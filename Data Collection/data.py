import requests
import csv
import time

API_KEY = "ae8ebf9e892fce5ee5eb7276c4bba186"
input_file = "location.txt"
output_file = "vietnam_tourism_weather.csv"

locations = []
with open(input_file, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        try:
            name, lat, lon = [x.strip() for x in line.split("|")]
            lat, lon = float(lat), float(lon)
            locations.append((name, lat, lon))
        except ValueError:
            continue

print(f"Loaded {len(locations)} locations from {input_file}")

with open(output_file, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["location", "lat", "lon", "temperature_C", "humidity", "pressure", "wind_speed", "description", "timestamp"])

    for name, lat, lon in locations:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=en"

        try:
            res = requests.get(url)
            data = res.json()

            if res.status_code == 200:
                temp = data["main"]["temp"]
                humidity = data["main"]["humidity"]
                pressure = data["main"]["pressure"]
                wind = data["wind"]["speed"]
                desc = data["weather"][0]["description"]
                ts = data["dt"]

                writer.writerow([name, lat, lon, temp, humidity, pressure, wind, desc, ts])
                print(f"✅ {name}: {temp}°C - {desc}")
            else:
                print(f"❌ Error for {name}: {res.status_code}")
        except Exception as e:
            print(f"⚠️ Failed for {name}: {e}")

        time.sleep(1)
