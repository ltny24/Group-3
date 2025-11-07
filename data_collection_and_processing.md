# Phần 2: Thu thập, Lọc và Chuẩn hóa Dữ liệu

## 1. Mục tiêu
Chuẩn bị bộ dữ liệu đầu vào để huấn luyện mô hình AI tính Safety Score cho từng khu vực ở Việt Nam.
Dữ liệu gồm các nhóm: dự báo thiên tai, địa hình, dân cư, phủ đất - hạ tầng, lịch sử thiên tai.
Mục tiêu là tạo bộ dữ liệu không gian-thời gian thống nhất, sạch và sẵn sàng cho mô hình.

## 2. Nguồn dữ liệu

### 2.1 Dữ liệu dự báo thiên tai (Disaster Forecast Dataset)
- Nguồn: Cung cấp bởi nhóm City (đội dự báo).
- Định dạng: .csv
- Tần suất: hàng ngày hoặc theo đợt.
- Thuộc tính:
  - city: Tên thành phố hoặc khu vực
  - lat, lon: Tọa độ địa lý
  - temperature_C: Nhiệt độ (°C)
  - humidity: Độ ẩm (%)
  - pressure: Áp suất (hPa)
  - wind_speed: Tốc độ gió (m/s)
  - weather_description: Mô tả thời tiết
  - rain_probability: Xác suất mưa lớn (%)
  - storm_probability: Xác suất bão/gió mạnh (%)
  - alert_event: Loại cảnh báo (bão, lũ, sạt lở, cháy rừng, động đất, ...)
  - alert_description: Mô tả cảnh báo
  - alert_start, alert_end: Thời gian hiệu lực cảnh báo (ISO)
  - earthquake_mag: Độ lớn động đất (nếu có)
  - earthquake_place: Vị trí tâm chấn (nếu có)
  - fire_count: Số điểm cháy phát hiện
  - fire_confidence_max: Độ tin cậy phát hiện cháy (%)
  - timestamp: Thời gian ghi nhận

### 2.2 Dữ liệu địa hình (DEM)
- Nguồn: NASA SRTM hoặc OpenDEM
- Độ phân giải: 30 m
- Định dạng: GeoTIFF (.tif)
- Công dụng: tính elevation, slope, xác định vùng dễ ngập/sạt lở

### 2.3 Dữ liệu dân cư (Population density)
- Nguồn: WorldPop
- Độ phân giải: ~100 m
- Định dạng: GeoTIFF (.tif)
- Công dụng: đánh giá exposure (mức phơi nhiễm dân số)

### 2.4 Dữ liệu phủ đất và hạ tầng (Land cover & infrastructure)
- Nguồn: JAXA - Annual Land-Use & Land-Cover Maps for Vietnam
- Độ phân giải: 10 m
- Định dạng: GeoTIFF (.tif)
- Công dụng: xác định loại phủ đất (forest, urban, water, agriculture...) để ước tính khả năng thoát nước và rủi ro sạt lở

### 2.5 Dữ liệu lịch sử thiên tai (Historical hazard records)
- Nguồn chính: EM-DAT (The International Disaster Database)
- Định dạng: .csv hoặc .xlsx
- Thuộc tính: event_id, disaster_type, start_date, end_date, affected_region, fatalities, injured, economic_loss, source
- Công dụng: tính hazard frequency, historical risk factor

## 3. Lọc và tiền xử lý dữ liệu

### 3.1 Chuẩn hóa không gian (spatial alignment)
- Reproject tất cả lớp về WGS84 (EPSG:4326).
- Resample raster về cùng độ phân giải mục tiêu (ví dụ 100 m).
- Clip raster theo ranh giới Việt Nam để giảm dung lượng.

### 3.2 Chuẩn hóa thời gian (temporal normalization)
- Chuyển đổi mọi trường thời gian về ISO 8601 (YYYY-MM-DD hoặc YYYY-MM-DDTHH:MM:SSZ).
- Với dữ liệu lịch sử, gộp theo khung 10 năm hoặc theo năm tùy phân tích.

### 3.3 Làm sạch dữ liệu
- Loại bỏ record thiếu toạ độ hoặc giá trị quan trọng (ví dụ rain_probability null).
- Thay thế hoặc nội suy giá trị bị thiếu (interpolation) theo không gian hoặc thời gian nếu phù hợp.
- Xử lý outlier: clip theo ngưỡng hợp lý (ví dụ rainfall <= 2000 mm/day).

### 3.4 Trích xuất và hợp nhất đặc trưng
- Tại mỗi record dự báo (lat, lon, timestamp), trích xuất:
  - elevation: giá trị DEM tại tọa độ hoặc trung bình trong bán kính nhỏ
  - slope: tính gradient từ DEM
  - land_cover_type: giá trị pixel LULC (one-hot hoặc category id)
  - population_density: giá trị raster WorldPop
  - hazard_history_features: flood_count_10y, storm_count_10y, avg_damage_10y (từ EM-DAT)
- Kết hợp các trường dự báo: rain_probability, storm_probability, earthquake_mag, fire_count, v.v.
- Lưu kết quả thành bảng flat (CSV hoặc Parquet) cho modeling.

### 3.5 Chuẩn hóa giá trị cho mô hình
- Với mô hình tree-based (RandomForest, XGBoost): không bắt buộc scaling nhưng vẫn nên xử lý categorical (one-hot hoặc target encoding).
- Với mô hình neural network: áp dụng StandardScaler hoặc MinMaxScaler cho features liên tục.
- Mã hóa thời gian nếu cần (hour, dayofyear, season).

## 4. Cấu trúc dữ liệu đầu ra (sau xử lý)
Mỗi dòng đại diện một record dự báo đã ghép dữ liệu nền:
- city, lat, lon, timestamp
- temperature_C, humidity, pressure, wind_speed
- rain_probability, storm_probability, alert_event, ...
- elevation, slope, land_cover_type_*, population_density
- flood_count_10y, storm_count_10y, avg_damage_10y
- fire_count, fire_confidence_max, earthquake_mag
- final: safety_score_target (nếu có nhãn) hoặc null

## 5. Lưu trữ và định dạng
- Lưu file processed chính: `data/processed/combined_dataset.parquet` (hoặc CSV nếu muốn).
- Giữ metadata: nguồn, date_downloaded, processing_notes.
- Ghi version dữ liệu (v1, v2) để tracking.

## 6. Công cụ đề xuất
- Raster: rasterio, rioxarray
- Vector / geospatial: geopandas, shapely
- Bảng / preprocessing: pandas, numpy, scikit-learn
- Visualization: folium, matplotlib, geoplot

## 7. Ghi chú lưu ý khi thực hiện
- Luôn kiểm tra CRS trước khi join (nhỡ CRS khác gây lệch toạ độ).  
- Với file GeoTIFF lớn, xử lý theo tile/chunk để tiết kiệm bộ nhớ.  
- Lưu intermediate files (clip region, resampled rasters) để tái sử dụng.

