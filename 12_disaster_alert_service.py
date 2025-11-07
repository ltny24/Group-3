import requests
from pydantic import BaseModel, ValidationError
import logging

logging.basicConfig(
    filename='disaster_service.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class DisasterData(BaseModel):
    type: str
    location: str
    severity: int
    alert: str

API_URL = "https://api.example.com/disaster/alerts"

def fetch_disaster_data():
    try:
        logging.info(f"Requesting disaster alerts from {API_URL}")
        response = requests.get(API_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Received response: {data}")
        disaster = DisasterData(**data)
        logging.info("Disaster data validated successfully")
        return disaster.dict()
    except requests.RequestException as e:
        logging.error(f"Request failed: {e}")
    except ValidationError as ve:
        logging.error(f"Validation error: {ve}")
    return None
