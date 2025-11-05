# Nền Tảng Dữ Liệu Thời Tiết và Thiên Tai

## 1. Data Flow Diagram (Mermaid)
```
flowchart LR
    A[Nguồn dữ liệu thời tiết] --> B[ETL Pipeline]
    C[Nguồn dữ liệu thiên tai] --> B
    B --> D[Nền tảng dữ liệu PostgreSQL + PostGIS]
    D --> E[Ứng dụng cảnh báo thời tiết]
    D --> F[Dashboard phân tích dữ liệu]
````

*Ghi chú:* Sơ đồ mô tả luồng dữ liệu từ các nguồn vào ETL, lưu trữ trên PostgreSQL + PostGIS và xuất ra ứng dụng cảnh báo & dashboard.

---

## 2. Database ERD (Mermaid)

```

erDiagram
    WeatherStation {
        int id PK
        string name
        geometry location
    }
    WeatherData {
        int id PK
        int station_id FK
        timestamp recorded_at
        float temperature
        float humidity
        float wind_speed
    }
    DisasterEvent {
        int id PK
        string type
        geometry location
        timestamp occurred_at
        string severity
    }

    WeatherStation ||--o{ WeatherData : provides
    DisasterEvent ||--|| WeatherStation : affects
```

*Ghi chú:*

* **WeatherStation**: trạm đo, lưu vị trí không gian.
* **WeatherData**: dữ liệu đo theo từng trạm; quan hệ `WeatherStation → WeatherData`.
* **DisasterEvent**: thông tin thiên tai; có thể ảnh hưởng nhiều trạm.

---

## 3. Database Schema & Queries

### 3.1 Tạo cơ sở dữ liệu và kích hoạt PostGIS

```sql
CREATE DATABASE weather_disaster;
\c weather_disaster;

CREATE EXTENSION postgis;
```

### 3.2 Tạo bảng chính

#### WeatherStation

```sql
CREATE TABLE WeatherStation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location GEOMETRY(Point, 4326)
);
```

*Ghi chú:* Lưu trạm đo với vị trí không gian.

#### WeatherData

```sql
CREATE TABLE WeatherData (
    id SERIAL PRIMARY KEY,
    station_id INT REFERENCES WeatherStation(id),
    recorded_at TIMESTAMP,
    temperature FLOAT,
    humidity FLOAT,
    wind_speed FLOAT
);
```

*Ghi chú:* Dữ liệu đo theo trạm; quan hệ `WeatherStation → WeatherData`.

#### DisasterEvent

```sql
CREATE TABLE DisasterEvent (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    location GEOMETRY(Point, 4326),
    occurred_at TIMESTAMP,
    severity VARCHAR(20)
);
```

*Ghi chú:* Lưu thông tin thiên tai; quan hệ tới các trạm đo nếu cần.

### 3.3 Test truy vấn không gian

```sql
-- Tìm các WeatherStation trong bán kính 10km từ điểm (106.7, 10.8)
SELECT id, name
FROM WeatherStation
WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_MakePoint(106.7, 10.8), 4326),
    10000
);
```

*Ghi chú:* `ST_DWithin` kiểm tra khoảng cách không gian (10km).
cd Group-3
---

## 4. Ghi chú tổng quan

* **Các bảng chính:** WeatherStation, WeatherData, DisasterEvent.
* **Quan hệ chính:**

  * `WeatherStation → WeatherData` (1:n)
  * `DisasterEvent → WeatherStation` (n:m hoặc 1:n tuỳ thiết kế mở rộng)
* **Mục đích:** Chuẩn hóa, tích hợp dữ liệu thời tiết và thiên tai, hỗ trợ truy vấn không gian và ứng dụng cảnh báo.