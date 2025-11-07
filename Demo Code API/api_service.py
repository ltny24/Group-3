import requests

# URL và Key giả lập. Trong thực tế, các giá trị này nên được đọc từ biến môi trường.
BASE_URL = "https://api.weather-service.com/data/2.5/weather"
API_KEY = "YOUR_SECRET_API_KEY"

def get_weather_data(city_name: str) -> dict or None:
    """
    Gọi API thời tiết để lấy dữ liệu cho một thành phố cụ thể.
    """
    params = {
        'q': city_name,
        'appid': API_KEY,
        'units': 'metric' # Nhiệt độ theo độ C
    }
    
    try:
        # Bước 1: Gọi API thời tiết với key hợp lệ
        response = requests.get(BASE_URL, params=params, timeout=5)
        
        # Bước 2: Kiểm tra response code (200 OK)
        response.raise_for_status() 
        
        return response.json()
    
    except requests.exceptions.HTTPError as err:
        print(f"Lỗi HTTP: {err}")
        return {"error": "HTTP Error", "status_code": response.status_code}
    except requests.exceptions.RequestException as err:
        print(f"Lỗi kết nối: {err}")
        return {"error": "Connection Error"}

# Để chạy file này, cần cài đặt: pip install requests