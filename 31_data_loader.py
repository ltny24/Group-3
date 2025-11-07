import psycopg2
import json
import logging
import geopandas as gpd

logging.basicConfig(
    filename='data_loader.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

DB_PARAMS = {
    "dbname": "etl_db",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "port": 5432
}

def load_json(json_path='api_sample.json'):
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def insert_weather(conn, weather_list):
    with conn.cursor() as cur:
        for w in weather_list:
            cur.execute("""
                INSERT INTO weather (city_code, city_name, temperature, humidity, description)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (city_code) DO UPDATE SET
                    temperature = EXCLUDED.temperature,
                    humidity = EXCLUDED.humidity,
                    description = EXCLUDED.description
            """, (w['city_code'], w['city'], w['temperature'], w['humidity'], w['description']))
    conn.commit()
    logging.info("Weather data loaded successfully")

def insert_disaster(conn, disaster_list):
    with conn.cursor() as cur:
        for d in disaster_list:
            cur.execute("""
                INSERT INTO disaster (type, location, severity, alert, city_code)
                VALUES (%s, %s, %s, %s, %s)
            """, (d['type'], d['location'], d['severity'], d['alert'], d['city_code']))
    conn.commit()
    logging.info("Disaster data loaded successfully")

def main():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        logging.info("Connected to DB successfully")
        
        data = load_json()
        insert_weather(data['weather'])
        insert_disaster(data['disaster'])
        
        logging.info("Data loading completed")
    except Exception as e:
        logging.error(f"Data loading failed: {e}")
    finally:
        if conn:
            conn.close()
            logging.info("DB connection closed")

if __name__ == "__main__":
    main()
