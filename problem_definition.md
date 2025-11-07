# Phần 1: Problem Definition - AI Safety Score Model

## 1. Overview

Thiên tai tự nhiên (bão, lũ lụt, sạt lở, hạn hán, v.v.) ảnh hưởng nghiêm trọng đến an toàn của con người và cơ sở hạ tầng. Dự án này hướng đến việc xây dựng một mô hình AI dự đoán **Safety Score** cho từng khu vực, dựa trên dữ liệu dự báo thiên tai do bên cung cấp và dữ liệu phụ trợ (địa lý, hạ tầng, dân cư).

Mục tiêu chính:

* Cung cấp chỉ số định lượng (Safety Score) hỗ trợ ra quyết định.
* Hỗ trợ hệ thống cảnh báo sớm, phân bổ nguồn lực và quy hoạch.

---

## 2. Problem Statement

### Input

Dữ liệu đầu vào gồm hai nhóm:

**Nhóm A — Dữ liệu dự báo (bên cung cấp):**

* temperature (°C)
* rainfall (mm)
* wind_speed (km/h)
* longitude, latitude
* probabilities (xác suất xảy ra sự kiện: flood, storm, landslide, ...)
* timestamp / forecast_horizon (ví dụ: 3-day, 7-day)

**Nhóm B — Dữ liệu phụ trợ (do nhóm dự án thu thập):**

* terrain: elevation (m), slope (%), land_type
* infrastructure: drainage_capacity, levee_presence, road_access
* population: population_density, vulnerable_population_index
* historical: past_events_count, past_damage_index

### Output

* `safety_score` trong khoảng 0 - 100 (0 = rất nguy hiểm, 100 = rất an toàn)

### Goal

Xây dựng mô hình ánh xạ `Input -> Safety Score` để đánh giá mức an toàn cho từng khu vực.

---

## 3. System Context

1. Bên cung cấp dữ liệu dự báo gửi file/stream JSON hoặc CSV chứa thông tin dự báo cho mỗi vị trí (longitude, latitude, timestamp).
2. Hệ thống của chúng ta xử lý, kết hợp với dữ liệu phụ trợ theo vùng, tạo feature và đưa vào mô hình.
3. Mô hình trả về `safety_score` và metadata (risk_level, feature_importance).

---

## 4. Research Questions

* Cách trích xuất feature quan trọng từ dữ liệu dự báo?
* Mối liên hệ giữa dự báo thời tiết và chỉ số an toàn ra sao?
* Cách kết hợp dữ liệu thời gian thực và dữ liệu tĩnh hiệu quả?
* Mô hình nào cho kết quả cân bằng giữa độ chính xác và khả năng giải thích?

---

## 5. Assumptions & Constraints

**Assumptions**

* Dữ liệu dự báo bên cung cấp có `timestamp` và `coordinates` rõ ràng.
* Dữ liệu phụ trợ có thể gán theo tọa độ hoặc mã vùng.
* Độ phân giải dữ liệu đủ để xét theo đơn vị hành chính (tỉnh/huyện) hoặc lưới ô (grid).

**Constraints**

* Dữ liệu có thể thiếu/không đồng đều giữa vùng.
* Một số yếu tố định tính (năng lực phản ứng của cộng đồng) khó lượng hoá.
* Safety Score là chỉ số tương đối, phụ thuộc độ chính xác dữ liệu.

---

## 6. Expected Outcome

* Mô hình trả về `safety_score` cho mỗi vị trí/vùng và `risk_level` (Low/Moderate/High).
* File model (.pkl/.joblib/.h5) và pipeline tiền xử lý (scaler, encoder).
* Dashboard hoặc API hiển thị kết quả theo bản đồ.

---

## 7. Success Metrics

| Metric          |                             Ý nghĩa |               Mục tiêu |
| --------------- | ----------------------------------: | ---------------------: |
| MAE / RMSE      |    Sai số dự đoán (điểm trên 0-100) |               MAE < 10 |
| R2              |           Mức giải thích biến thiên | R2 > 0.7 (tùy dữ liệu) |
| Data match rate | Tỷ lệ record dự báo có thể gán vùng |                  > 90% |

---

## 8. Problem Decomposition (Sub-problems)

1. Data ingestion: nhận file/stream dự báo từ bên cung cấp.
2. Geospatial join: gán dự báo vào vùng/ô lưới bằng kinh-vĩ.
3. Data cleaning: xử lý missing, outlier.
4. Feature engineering: tổng hợp rainfall windows, probability features, terrain-infra ratios.
5. Modeling: train regressor trả về safety_score.
6. Evaluation: metrics, cross-validation, explainability (SHAP).
7. Deployment: API, dashboard, map visualization.
8. Monitoring: track drift, re-train schedule.

---

## 9. Example Input & Output

**Example input (JSON):**

```json
{
  "location": "Da Nang",
  "coordinates": {"lon": 108.2, "lat": 16.07},
  "forecast": {
    "timestamp": "2025-11-06T00:00:00Z",
    "horizon_days": 3,
    "temperature": 29.5,
    "rainfall": 210,
    "wind_speed": 75,
    "flood_probability": 0.62
  }
}
```

**Example output (JSON):**

```json
{
  "safety_score": 68.2,
  "risk_level": "Moderate",
  "model_version": "v1.0"
}
```


