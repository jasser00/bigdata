# filepath: /home/jasser/Desktop/big/backend_bigdata/app/db/models.py
from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.sql import func
from app.db.base import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String, index=True)
    features = Column(JSON)
    prediction = Column(Float)
    model_version = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())