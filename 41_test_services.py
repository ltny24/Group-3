import unittest
from weather_service import fetch_weather_data
from disaster_alert_service import fetch_disaster_data
from data_transformer import clean_weather_data, clean_disaster_data

class TestETLPipeline(unittest.TestCase):
    
    def test_fetch_weather(self):
        data = fetch_weather_data()
        self.assertIsInstance(data, dict)
        self.assertIn('city', data)
    
    def test_fetch_disaster(self):
        data = fetch_disaster_data()
        self.assertIsInstance(data, dict)
        self.assertIn('type', data)
    
    def test_clean_weather(self):
        sample = [{'city': 'Hanoi', 'temperature': 30, 'humidity': 70, 'description': 'Sunny'}]
        df = clean_weather_data(sample)
        self.assertEqual(df.iloc[0]['city_code'], 'HN')
    
    def test_clean_disaster(self):
        sample = [{'type': 'Flood', 'location': 'Hanoi', 'severity': 3, 'alert': 'Evacuate'}]
        df = clean_disaster_data(sample)
        self.assertEqual(df.iloc[0]['location'], 'Hanoi')

if __name__ == "__main__":
    unittest.main()
