# File: /home/jasser/Desktop/big/backend_bigdata/app/prometheus_metrics.py

from prometheus_client import Counter, Histogram, start_http_server
import time

PREDICTION_COUNTER = Counter("predictions_total", "Total prediction calls")
PREDICTION_LATENCY = Histogram("prediction_latency_seconds", "Latency of prediction calls in seconds")

def start_metrics_server(port=8000):
    start_http_server(port)

def record_prediction_latency(start_time):
    elapsed_time = time.time() - start_time
    PREDICTION_LATENCY.observe(elapsed_time)

# Start the metrics server on a separate thread or process if needed
# Example usage:
# if __name__ == "__main__":
#     start_metrics_server()