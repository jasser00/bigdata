from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import predict
from app.db.base import Base, engine
from app.kafka_producer import close_kafka_producer
from dotenv import load_dotenv
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(
    title="Maintenance Prediction API",
    description="API for machine maintenance prediction with Kafka integration",
    version="1.0.0"
)

# CORS configuration - allow the production domain and local development
allowed_origins = [
    "http://bigdataproject.tech",
    "https://bigdataproject.tech",
    "http://www.bigdataproject.tech",
    "https://www.bigdataproject.tech",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:80",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    logger.info("Starting up application...")
    # Create database tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
    
    logger.info(f"Kafka bootstrap servers: {os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'redpanda:9092')}")
    logger.info("Application started successfully")

@app.on_event("shutdown")
def shutdown():
    logger.info("Shutting down application...")
    close_kafka_producer()
    logger.info("Application shutdown complete")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Maintenance Prediction API!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(predict.router)