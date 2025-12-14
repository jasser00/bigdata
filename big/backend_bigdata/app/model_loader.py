# filepath: /home/jasser/Desktop/big/backend_bigdata/app/model_loader.py
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parents[1] / "model"

class ModelWrapper:
    def __init__(self):
        # Load your model here
        pass

    def predict(self, data):
        # Implement prediction logic here
        pass

# instantiate once so FastAPI loads it on startup
model_wrapper = ModelWrapper()