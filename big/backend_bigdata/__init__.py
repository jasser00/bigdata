# The file /home/jasser/Desktop/big/backend_bigdata/__init__.py will be updated to include the necessary imports for the backend application.

from .db import session
from .api import predict
from .model_loader import ModelWrapper
from .prometheus_metrics import PREDICTION_COUNTER

__all__ = ["session", "predict", "ModelWrapper", "PREDICTION_COUNTER"]