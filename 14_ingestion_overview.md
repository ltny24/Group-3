# API Data Ingestion Overview

## Mục tiêu
- Lấy dữ liệu thời tiết và thiên tai từ API thực.
- Validate dữ liệu bằng Pydantic.
- Ghi log chi tiết các request, response, lỗi.
- Lưu dữ liệu mẫu đầu tiên ra file `api_sample.json`.

## Quy trình
1. **Gọi API**:
   - `weather_service.py` gọi API thời tiết
   - `disaster_alert_service.py` gọi API thiên tai
2. **Validate dữ liệu**:
   - Dùng Pydantic `WeatherData` và `DisasterData`
3. **Logging**:
   - Thông tin request, response
   - Lỗi kết nối hoặc validate
4. **Dữ liệu mẫu**:
   - Lưu sẵn trong `api_sample.json` để kiểm tra

## Công cụ & Thư viện
- Python 3.10+
- requests
- pydantic
- logging
- json

## Deliverables
- weather_service.py
- disaster_alert_service.py
- api_sample.json
- ingestion_overview.md
- Log files: weather_service.log, disaster_service.log
