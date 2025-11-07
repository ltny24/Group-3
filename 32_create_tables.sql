-- Tạo bảng weather
CREATE TABLE IF NOT EXISTS weather (
    city_code VARCHAR(10) PRIMARY KEY,
    city_name VARCHAR(50),
    temperature FLOAT,
    humidity INT,
    description VARCHAR(100)
);

-- Tạo bảng disaster
CREATE TABLE IF NOT EXISTS disaster (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    location VARCHAR(50),
    severity INT,
    alert VARCHAR(200),
    city_code VARCHAR(10)
);

-- Tạo bảng geo_data (nếu muốn lưu GeoJSON)
CREATE TABLE IF NOT EXISTS geo_data (
    city_code VARCHAR(10) PRIMARY KEY,
    geometry GEOMETRY
);
