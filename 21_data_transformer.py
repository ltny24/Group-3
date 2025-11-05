import json
import pandas as pd
import geopandas as gpd
import logging

logging.basicConfig(
    filename='data_transformer.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def load_sample_data(json_path='api_sample.json'):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def clean_weather_data(weather_list):
    df = pd.DataFrame(weather_list)
    logging.info(f"Initial weather data: {df.shape[0]} rows")
    
    # Loại bỏ cột trùng
    df = df.loc[:,~df.columns.duplicated()]
    # Loại bỏ null
    df = df.dropna()
    logging.info(f"Cleaned weather data: {df.shape[0]} rows")
    
    # Chuẩn hóa tên thành mã hành chính (ví dụ: city -> city_code)
    city_code_map = {
        "Hanoi": "HN",
        "Ho Chi Minh": "HCM",
        "Da Nang": "DN"
    }
    df['city_code'] = df['city'].map(city_code_map)
    return df

def clean_disaster_data(disaster_list):
    df = pd.DataFrame(disaster_list)
    logging.info(f"Initial disaster data: {df.shape[0]} rows")
    
    # Loại bỏ cột trùng
    df = df.loc[:,~df.columns.duplicated()]
    # Loại bỏ null
    df = df.dropna()
    logging.info(f"Cleaned disaster data: {df.shape[0]} rows")
    
    return df

def merge_with_geojson(weather_df, disaster_df, geojson_path='vietnam_geo.json'):
    # Load GeoJSON
    gdf_geo = gpd.read_file(geojson_path)
    
    # Chuẩn hóa tên
    gdf_geo['city_code'] = gdf_geo['NAME_1'].map({
        "Hà Nội": "HN",
        "TP. Hồ Chí Minh": "HCM",
        "Đà Nẵng": "DN"
    })
    
    # Merge weather data
    gdf_weather = gdf_geo.merge(weather_df, on='city_code', how='left')
    
    # Merge disaster data (nếu có location -> city_code)
    disaster_df['city_code'] = disaster_df['location'].map({
        "Hanoi": "HN",
        "Ho Chi Minh": "HCM",
        "Da Nang": "DN"
    })
    gdf_disaster = gdf_weather.merge(disaster_df, on='city_code', how='left', suffixes=('_weather','_disaster'))
    
    logging.info(f"Merged GeoDataFrame: {gdf_disaster.shape[0]} rows")
    
    return gdf_disaster

if __name__ == "__main__":
    data = load_sample_data()
    weather_df = clean_weather_data(data['weather'])
    disaster_df = clean_disaster_data(data['disaster'])
    gdf_merged = merge_with_geojson(weather_df, disaster_df)
    
    # Lưu file GeoJSON chuẩn hóa
    gdf_merged.to_file('transformed_data.geojson', driver='GeoJSON')
    logging.info("Transformed data saved to transformed_data.geojson")
