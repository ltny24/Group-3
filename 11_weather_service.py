import requests
from pydantic import BaseModel, ValidationError
import logging

logging.basicConfig(
    filename='weather_service.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class WeatherData(BaseModel):
    city: str
    temperature: float
    humidity: int
    description: str

API_URL = "https://api.example.com/weather?city=Hanoi"

def fetch_weather_data():
    try:
        logging.info(f"Requesting weather data from {API_URL}")
        response = requests.get(API_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
        logging.info(f"Received response: {data}")
        weather = WeatherData(**data)
        logging.info("Weather data validated successfully")
        return weather.dict()
    except requests.RequestException as e:
        logging.error(f"Request failed: {e}")
    except ValidationError as ve:
        logging.error(f"Validation error: {ve}")
    return None
