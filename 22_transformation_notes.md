# Data Transformation Notes

## Mục tiêu
- Làm sạch dữ liệu weather và disaster từ `api_sample.json`.
- Loại bỏ cột trùng và giá trị null.
- Chuẩn hóa mã hành chính (`city_code`) cho các thành phố.
- Kết hợp dữ liệu với GeoJSON Việt Nam để có dữ liệu địa lý chuẩn.
- Xuất dữ liệu chuẩn sẵn sàng nạp vào DB.

## Quy trình
1. **Load dữ liệu**: từ `api_sample.json`.
2. **Clean dữ liệu**:
   - Loại bỏ cột trùng
   - Loại bỏ null
   - Chuẩn hóa city -> city_code
3. **Merge với GeoJSON**:
   - Load file `vietnam_geo.json`
   - Gán city_code cho geojson
   - Merge weather và disaster vào GeoDataFrame
4. **Output**:
   - Lưu file `transformed_data.geojson` chuẩn hóa

## Công cụ & Thư viện
- Python 3.10+
- pandas
- geopandas
- logging
- json

## Deliverables
- data_transformer.py
- transformed_data.geojson
- Log file: data_transformer.log
