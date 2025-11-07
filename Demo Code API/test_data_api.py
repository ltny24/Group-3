import pytest
from unittest.mock import patch, Mock
from api_service import get_weather_data

# Dữ liệu giả lập (Mock Data) cho thành phố "Hà Nội" với trạng thái "Bão"
# (Đáp ứng Kết quả mong đợi của DATA-001)
MOCK_HA_NOI_DATA = {
    "coord": {"lon": 105.84, "lat": 21.03}, # Kiểm tra Tọa độ
    "weather": [{"id": 501, "main": "Rain", "description": "heavy rain"}], # Kiểm tra Mã thời tiết (mô phỏng 'storm')
    "main": {
        "temp": 25.0, # Kiểm tra Nhiệt độ (giá trị mong muốn)
        "humidity": 90, # Kiểm tra Độ ẩm (0-100%)
        "pressure": 1009
    },
    "name": "Hà Nội",
    "cod": 200
}

# Sử dụng @patch để giả lập (mock) hàm requests.get trong module api_service
@patch('api_service.requests.get')
def test_data_001_valid_weather_response(mock_get):
    """
    Kiểm tra chức năng get_weather_data trả về đúng các trường dữ liệu 
    và status code 200 OK theo kịch bản DATA-001.
    """
    # 1. ARRANGE (Chuẩn bị): Thiết lập response giả lập
    # Tạo một đối tượng Mock (giả lập) cho response API
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = MOCK_HA_NOI_DATA
    mock_response.raise_for_status.return_value = None # Không raise lỗi HTTP
    
    # Gán đối tượng Mock này làm giá trị trả về cho requests.get
    mock_get.return_value = mock_response

    # 2. ACT (Thực thi): Gọi hàm cần test
    city = "Hà Nội"
    actual_data = get_weather_data(city)

    # 3. ASSERT (Kiểm tra): So sánh Kết quả thực tế với Kết quả mong đợi
    
    # Kiểm tra hàm đã được gọi với tham số đúng chưa
    mock_get.assert_called_once() 
    
    # Kiểm tra Response chứa nhiệt độ (± 2°C)
    # Ta kiểm tra giá trị thực tế có khớp với giá trị mock không
    assert actual_data['main']['temp'] == pytest.approx(25.0, abs=2), \
        "Nhiệt độ không nằm trong khoảng ± 2°C"
    
    # Kiểm tra Độ ẩm (0-100%)
    assert 0 <= actual_data['main']['humidity'] <= 100, \
        "Độ ẩm (humidity) không nằm trong khoảng 0-100%"
        
    # Kiểm tra Mã thời tiết (ví dụ: 'storm', 'rain')
    assert 'weather' in actual_data and len(actual_data['weather']) > 0, \
        "Thiếu trường Mã thời tiết ('weather')"
        
    # Kiểm tra Tọa độ (lat/lon)
    assert 'coord' in actual_data and 'lat' in actual_data['coord'], \
        "Thiếu thông tin tọa độ (lat/lon)"

# Kịch bản 2: Kiểm tra trường hợp API trả lỗi 404 (Không tìm thấy thành phố)
@patch('api_service.requests.get')
def test_data_001_city_not_found(mock_get):
    """Kiểm tra xử lý lỗi HTTP 404 khi không tìm thấy thành phố."""
    
    # 1. ARRANGE (Chuẩn bị): Thiết lập response giả lập lỗi 404
    mock_response = Mock()
    mock_response.status_code = 404
    # Khi gọi raise_for_status() trên Mock, nó sẽ ném ra lỗi HTTPError
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("404 Client Error: Not Found")

    mock_get.return_value = mock_response

    # 2. ACT (Thực thi)
    city = "InvalidCity"
    actual_data = get_weather_data(city)

    # 3. ASSERT (Kiểm tra)
    # Kiểm tra hàm trả về thông báo lỗi 
    assert actual_data is not None
    assert actual_data.get('error') == "HTTP Error"
    assert actual_data.get('status_code') == 404