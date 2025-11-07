# 🌲 Huấn luyện mô hình Random Forest cho Safety Score

## 🎯 1. Mục tiêu

Mục tiêu của giai đoạn này là huấn luyện một mô hình **Random Forest Regressor** để dự đoán **Safety Score** (chỉ số an toàn) cho từng khu vực tại Việt Nam, dựa trên:
- Dữ liệu dự báo thiên tai (mưa, bão, cháy rừng, động đất, v.v.)
- Dữ liệu hạ tầng (mức độ đô thị hóa, phủ đất)
- Dữ liệu thời gian và vị trí địa lý.

Mô hình sẽ đưa ra:
1. **Safety Score (0–100)** — giá trị phản ánh mức độ an toàn tổng hợp.
2. **Feature Importance** — cho biết yếu tố nào ảnh hưởng mạnh nhất đến độ an toàn.

---

## 🧩 2. Tổng quan về thuật toán Random Forest

### 2.1. Khái niệm
**Random Forest** là một **ensemble learning algorithm** — tức là mô hình kết hợp nhiều **cây quyết định (decision trees)** để dự đoán kết quả cuối cùng.

Thay vì chỉ dùng một cây (dễ bị overfitting), Random Forest tạo ra **nhiều cây độc lập** từ các mẫu dữ liệu ngẫu nhiên, rồi **lấy trung bình kết quả**.

Công thức tổng quát:
\[
\hat{y} = \frac{1}{N} \sum_{i=1}^{N} T_i(X)
\]
- \( \hat{y} \): kết quả dự đoán trung bình.  
- \( T_i(X) \): dự đoán của cây thứ i.  
- \( N \): số cây trong rừng.

---

### 2.2. Cơ chế hoạt động
1. **Bootstrap Sampling:**  
   Chọn ngẫu nhiên một tập dữ liệu con (có thể trùng lặp) để huấn luyện từng cây.

2. **Feature Subsampling:**  
   Ở mỗi nút chia trong cây, chỉ xem xét **một tập con đặc trưng (features)** ngẫu nhiên.  
   → Tăng tính đa dạng, giảm tương quan giữa các cây.

3. **Aggregation (Bagging):**  
   Dự đoán cuối cùng được lấy **trung bình** (đối với hồi quy) hoặc **bỏ phiếu đa số** (đối với phân loại).

---

### 2.3. Ưu điểm
- Giảm overfitting so với Decision Tree.  
- Hiệu năng cao với dữ liệu tabular.  
- Tự động xử lý mối quan hệ phi tuyến.  
- Cho phép đánh giá độ quan trọng đặc trưng (feature importance).

---

## ⚙️ 3. Chuẩn bị dữ liệu

### 3.1. Đặc trưng đầu vào
| Nhóm | Biến đầu vào ví dụ |
|------|--------------------|
| Dự báo thời tiết | `temperature_C`, `humidity`, `pressure`, `wind_speed` |
| Rủi ro thiên tai | `rain_probability`, `storm_probability`, `earthquake_mag`, `fire_count` |
| Hạ tầng | `infra_resilience`, `land_cover_type` |
| Thời gian | `day_of_week`, `month`, `hour` |
| Vị trí | `lat`, `lon` |

### 3.2. Biến đầu ra (Target)
- `safety_score`: chỉ số an toàn (thang 0–100).  
  Có thể được tính từ dữ liệu lịch sử (tần suất thiên tai, thiệt hại, độ phơi nhiễm, v.v.).

### 3.3. Xử lý trước (Preprocessing)
1. Chuẩn hóa hoặc scale giá trị liên tục về [0,1].  
2. One-hot encode các biến phân loại (`land_cover_type`, `alert_event`).  
3. Loại bỏ giá trị thiếu (`NaN`) hoặc thay bằng trung vị.  
4. Chia tập dữ liệu: 70% train – 15% validation – 15% test.

---

## 🧮 4. Huấn luyện mô hình Random Forest

### 4.1. Cấu trúc mô hình
Mỗi cây là một Decision Tree độc lập, được huấn luyện trên một phần dữ liệu và tập đặc trưng ngẫu nhiên.  
Các cây hoạt động song song (parallellized), giúp huấn luyện nhanh.

### 4.2. Hyperparameters chính

| Tham số | Mô tả | Gợi ý |
|----------|--------|-------|
| `n_estimators` | Số lượng cây trong rừng | 200–500 |
| `max_depth` | Độ sâu tối đa mỗi cây | 8–20 |
| `min_samples_split` | Số mẫu tối thiểu để chia một nút | 2–10 |
| `min_samples_leaf` | Số mẫu tối thiểu ở lá cuối | 1–5 |
| `max_features` | Tỷ lệ đặc trưng được xem xét ở mỗi lần chia | sqrt hoặc log2 |
| `bootstrap` | Có lấy mẫu lại dữ liệu không | True |
| `n_jobs` | Số luồng CPU sử dụng | -1 (toàn bộ CPU) |

---

### 4.3. Quy trình huấn luyện

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# 1. Chuẩn bị dữ liệu
X = df[["temperature_C", "humidity", "pressure", "wind_speed",
        "rain_probability", "storm_probability", "earthquake_mag",
        "fire_count", "infra_resilience", "lat", "lon"]]
y = df["safety_score"]

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# 2. Chia dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 3. Huấn luyện mô hình
model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_split=3,
    min_samples_leaf=2,
    max_features="sqrt",
    bootstrap=True,
    n_jobs=-1,
    random_state=42
)
model.fit(X_train, y_train)

# 4. Đánh giá
y_pred = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, y_pred))
print("R²:", r2_score(y_test, y_pred))

# 5. Lưu mô hình
joblib.dump(model, "models/random_forest_safety.pkl")
```

---

## 📊 5. Đánh giá mô hình

### 5.1. Metrics
| Metric | Ý nghĩa | Mục tiêu |
|---------|----------|----------|
| **MAE** | Sai số tuyệt đối trung bình | Càng thấp càng tốt |
| **RMSE** | Sai số bình phương trung bình | Càng thấp càng tốt |
| **R²** | Tỷ lệ biến thiên được mô hình giải thích | Gần 1 là tốt |
| **Feature Importance** | Độ ảnh hưởng của từng đặc trưng | Giúp diễn giải mô hình |

### 5.2. Ví dụ kết quả
- MAE ≈ 3.2  
- R² ≈ 0.86  
→ Mô hình có khả năng dự đoán tốt và ổn định.

---

## 🔍 6. Phân tích Feature Importance

```python
import pandas as pd
import matplotlib.pyplot as plt

importances = model.feature_importances_
features = X.columns

pd.DataFrame({"Feature": features, "Importance": importances}).sort_values(by="Importance", ascending=False)
```

**Ví dụ kết quả:**

| Feature | Importance |
|----------|-------------|
| storm_probability | 0.25 |
| rain_probability | 0.22 |
| infra_resilience | 0.18 |
| fire_count | 0.10 |
| wind_speed | 0.07 |
| humidity | 0.06 |
| earthquake_mag | 0.05 |
| temperature_C | 0.04 |
| lat/lon | 0.03 |

---

## 🧠 7. Diễn giải và Ứng dụng
- Mô hình Random Forest cho phép đánh giá **độ an toàn tổng hợp** theo vùng.  
- Có thể triển khai trong:
  - Hệ thống cảnh báo thiên tai.  
  - Dashboard bản đồ an toàn.  
  - Ứng dụng quy hoạch và phòng ngừa rủi ro.

**Ý nghĩa Safety Score:**
| Score | Mức an toàn | Gợi ý hành động |
|--------|--------------|-----------------|
| 0–40 | Nguy hiểm cao | Cảnh báo đỏ |
| 40–70 | Rủi ro trung bình | Theo dõi liên tục |
| 70–100 | An toàn | Không cần cảnh báo |

