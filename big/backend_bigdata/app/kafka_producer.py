import json
import os
from kafka import KafkaProducer
from kafka.errors import KafkaError
import logging

logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "redpanda:9092")
KAFKA_TOPIC_PREDICTIONS = os.getenv("KAFKA_TOPIC_PREDICTIONS", "predictions")

_producer = None

def get_kafka_producer() -> KafkaProducer:
    """Get or create a Kafka producer instance."""
    global _producer
    if _producer is None:
        try:
            _producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: k.encode('utf-8') if k else None,
                acks='all',
                retries=3,
            )
            logger.info(f"Kafka producer connected to {KAFKA_BOOTSTRAP_SERVERS}")
        except KafkaError as e:
            logger.error(f"Failed to create Kafka producer: {e}")
            raise
    return _producer

def send_prediction_event(prediction_data: dict) -> bool:
    """Send a prediction event to Kafka topic."""
    try:
        producer = get_kafka_producer()
        future = producer.send(
            KAFKA_TOPIC_PREDICTIONS,
            key=prediction_data.get("machine_id", "unknown"),
            value=prediction_data
        )
        # Wait for the message to be delivered (with timeout)
        record_metadata = future.get(timeout=10)
        logger.info(
            f"Prediction sent to topic {record_metadata.topic} "
            f"partition {record_metadata.partition} offset {record_metadata.offset}"
        )
        return True
    except KafkaError as e:
        logger.error(f"Failed to send prediction to Kafka: {e}")
        return False

def close_kafka_producer():
    """Close the Kafka producer."""
    global _producer
    if _producer is not None:
        _producer.close()
        _producer = None
        logger.info("Kafka producer closed")
