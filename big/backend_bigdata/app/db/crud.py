# Updated contents for /home/jasser/Desktop/big/backend_bigdata/app/db/crud.py

from app.db.session import SessionLocal
from app.db.models import Prediction

def create_prediction(prediction_data):
    db = SessionLocal()
    new_prediction = Prediction(**prediction_data)
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    db.close()
    return new_prediction

def get_prediction(prediction_id):
    db = SessionLocal()
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    db.close()
    return prediction

def get_all_predictions():
    db = SessionLocal()
    predictions = db.query(Prediction).all()
    db.close()
    return predictions

def update_prediction(prediction_id, prediction_data):
    db = SessionLocal()
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if prediction:
        for key, value in prediction_data.items():
            setattr(prediction, key, value)
        db.commit()
        db.refresh(prediction)
    db.close()
    return prediction

def delete_prediction(prediction_id):
    db = SessionLocal()
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if prediction:
        db.delete(prediction)
        db.commit()
    db.close()
    return prediction