# File: /home/jasser/Desktop/big/backend_bigdata/test.py

import os
import requests

def test_prediction_api():
    url = "http://localhost:8000/predict"
    payload = {
        "machineId": "123",
        "temperature": 75,
        "humidity": 50
    }
    response = requests.post(url, json=payload)
    assert response.status_code == 200
    assert "prediction" in response.json()

if __name__ == "__main__":
    test_prediction_api()