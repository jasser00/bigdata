from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
from app.db import crud
from app.kafka_producer import send_prediction_event
from app.prometheus_metrics import PREDICTION_COUNTER, PREDICTION_LATENCY
import time
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Request/Response Models
class PredictRequest(BaseModel):
    machineId: str
    temperature: float
    humidity: float

class PredictResponse(BaseModel):
    prediction: int  # 0 = No maintenance needed, 1 = Maintenance needed
    needs_maintenance: bool
    confidence: float
    timestamp: datetime
    model_version: str = "v1.0"
    kafka_sent: bool = False

class PredictionHistory(BaseModel):
    id: int
    machine_id: str
    features: Dict[str, Any]
    prediction: int  # 0 or 1
    needs_maintenance: bool
    model_version: str
    timestamp: datetime

class StatsResponse(BaseModel):
    total_predictions: int
    unique_machines: int
    avg_prediction: float
    latest_prediction: Optional[datetime]

class MachineInfo(BaseModel):
    machine_id: str
    prediction_count: int
    last_prediction: Optional[float]
    last_timestamp: Optional[datetime]

# Endpoints
@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    start_time = time.time()
    
    # Increment prediction counter
    PREDICTION_COUNTER.inc()
    
    # ML Model Logic: Determine if maintenance is needed (0 or 1)
    # Rule-based prediction (replace with actual ML model):
    # - High temperature (> 80°C) OR high humidity (> 70%) = needs maintenance
    # - Very high temperature (> 90°C) = definitely needs maintenance
    # - Calculate a risk score and threshold it
    
    risk_score = (request.temperature / 100) * 0.6 + (request.humidity / 100) * 0.4
    
    # Add additional risk factors
    if request.temperature > 90:
        risk_score += 0.3
    elif request.temperature > 80:
        risk_score += 0.15
    
    if request.humidity > 70:
        risk_score += 0.1
    
    # Clamp confidence between 0 and 1
    confidence = min(max(risk_score, 0.0), 1.0)
    
    # Threshold: if risk score > 0.5, maintenance is needed
    needs_maintenance = confidence > 0.5
    prediction_value = 1 if needs_maintenance else 0
    
    model_version = "v1.0"
    timestamp = datetime.utcnow()

    record = {
        "machine_id": request.machineId,
        "features": {"temperature": request.temperature, "humidity": request.humidity},
        "prediction": prediction_value,
        "model_version": model_version,
    }

    # Save to database
    try:
        created = crud.create_prediction(record)
        logger.info(f"Prediction saved to database for machine {request.machineId}: maintenance={'needed' if needs_maintenance else 'not needed'}")
    except Exception as e:
        logger.error(f"Failed to save prediction: {e}")
        raise HTTPException(status_code=500, detail="Failed to save prediction")

    # Send to Kafka
    kafka_event = {
        "machine_id": request.machineId,
        "temperature": request.temperature,
        "humidity": request.humidity,
        "prediction": prediction_value,
        "needs_maintenance": needs_maintenance,
        "confidence": round(confidence, 4),
        "model_version": model_version,
        "timestamp": timestamp.isoformat(),
    }
    
    kafka_sent = False
    try:
        kafka_sent = send_prediction_event(kafka_event)
    except Exception as e:
        logger.warning(f"Failed to send to Kafka (non-critical): {e}")
    
    # Record latency
    PREDICTION_LATENCY.observe(time.time() - start_time)

    return PredictResponse(
        prediction=prediction_value,
        needs_maintenance=needs_maintenance,
        confidence=round(confidence, 4),
        timestamp=timestamp,
        model_version=model_version,
        kafka_sent=kafka_sent
    )

@router.get("/history", response_model=List[PredictionHistory])
async def get_history():
    """Get all prediction history"""
    try:
        predictions = crud.get_all_predictions()
        return [
            PredictionHistory(
                id=p.id,
                machine_id=p.machine_id,
                features=p.features if p.features else {},
                prediction=int(p.prediction) if p.prediction in [0, 1] else (1 if p.prediction > 0.5 else 0),
                needs_maintenance=bool(p.prediction >= 1 or p.prediction > 0.5),
                model_version=p.model_version or "v1.0",
                timestamp=p.timestamp
            )
            for p in predictions
        ]
    except Exception as e:
        logger.error(f"Failed to fetch history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")

@router.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get prediction statistics"""
    try:
        predictions = crud.get_all_predictions()
        if not predictions:
            return StatsResponse(
                total_predictions=0,
                unique_machines=0,
                avg_prediction=0.0,
                latest_prediction=None
            )
        
        unique_machines = len(set(p.machine_id for p in predictions))
        avg_pred = sum(p.prediction for p in predictions) / len(predictions)
        latest = max(p.timestamp for p in predictions)
        
        return StatsResponse(
            total_predictions=len(predictions),
            unique_machines=unique_machines,
            avg_prediction=round(avg_pred, 4),
            latest_prediction=latest
        )
    except Exception as e:
        logger.error(f"Failed to fetch stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stats")

@router.get("/machines", response_model=List[MachineInfo])
async def get_machines():
    """Get all unique machines with their prediction info"""
    try:
        predictions = crud.get_all_predictions()
        machines_dict = {}
        
        for p in predictions:
            if p.machine_id not in machines_dict:
                machines_dict[p.machine_id] = {
                    "machine_id": p.machine_id,
                    "prediction_count": 0,
                    "last_prediction": None,
                    "last_timestamp": None
                }
            machines_dict[p.machine_id]["prediction_count"] += 1
            if machines_dict[p.machine_id]["last_timestamp"] is None or p.timestamp > machines_dict[p.machine_id]["last_timestamp"]:
                machines_dict[p.machine_id]["last_prediction"] = p.prediction
                machines_dict[p.machine_id]["last_timestamp"] = p.timestamp
        
        return [MachineInfo(**m) for m in machines_dict.values()]
    except Exception as e:
        logger.error(f"Failed to fetch machines: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch machines")

@router.get("/machine/{machine_id}", response_model=List[PredictionHistory])
async def get_machine_predictions(machine_id: str):
    """Get predictions for a specific machine"""
    try:
        predictions = crud.get_all_predictions()
        machine_predictions = [p for p in predictions if p.machine_id == machine_id]
        
        return [
            PredictionHistory(
                id=p.id,
                machine_id=p.machine_id,
                features=p.features if p.features else {},
                prediction=int(p.prediction) if p.prediction in [0, 1] else (1 if p.prediction > 0.5 else 0),
                needs_maintenance=bool(p.prediction >= 1 or p.prediction > 0.5),
                model_version=p.model_version or "v1.0",
                timestamp=p.timestamp
            )
            for p in machine_predictions
        ]
    except Exception as e:
        logger.error(f"Failed to fetch machine predictions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch machine predictions")