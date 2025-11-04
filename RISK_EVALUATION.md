# ĐÁNH GIÁ RỦI RO THIÊN TAI 

## 1. Giới thiệu

Mục tiêu của hệ thống là **tính toán Safety Score (thang 0–10)** thể hiện mức độ an toàn của một khu vực trước rủi ro thiên tai.  
Phần này tập trung vào **vulnerability** – mức độ dễ bị tổn thương của con người và hạ tầng — từ đó kết hợp với **xác suất thiên tai (hazard probability)** do nhóm khác cung cấp để tính ra **Safety Score tổng hợp**.

---

## 2. Thành phần dữ liệu đầu vào

### 2.1. Hazard Probability
- Được cung cấp từ mô hình AI nhận diện thiên tai (phần I).  
- Thể hiện xác suất xảy ra thiên tai trong một khoảng thời gian nhất định (ví dụ: 0–1).  
- Là **đầu vào chính** cho mô hình đánh giá rủi ro.

### 2.2. Vulnerability Data
Dữ liệu thu thập và xử lý trong phần này gồm ba nhóm:

| Nhóm yếu tố | Mô tả | Ví dụ dữ liệu |
|--------------|-------|----------------|
| **Dân cư (Population)** | Mật độ dân số, phân bố dân cư theo khu vực | người/km² |
| **Cơ sở hạ tầng (Infrastructure)** | Số lượng, chất lượng công trình công cộng (trường, bệnh viện, cầu đường...) | chỉ số tổng hợp |
| **Thiệt hại lịch sử (Historical Damage)** | Số lần và mức độ thiệt hại do thiên tai trước đây | chi phí thiệt hại, số người ảnh hưởng |

---

## 3. Quy trình xử lý dữ liệu

### 3.1. Thu thập dữ liệu
- Nguồn: Tổng cục Thống kê, OpenStreetMap, WorldPop, cơ quan phòng chống thiên tai.  
- Dữ liệu được tập hợp theo từng vùng hành chính (quận, huyện hoặc tỉnh).

### 3.2. Làm sạch và lọc
- Loại bỏ dữ liệu trùng, thiếu hoặc sai định dạng.  
- Kiểm tra và giới hạn ngoại lệ (outlier) bằng phương pháp z-score.  
- Thống nhất đơn vị đo và tên cột dữ liệu.

### 3.3. Chuẩn hóa
- Chuẩn hóa giá trị các yếu tố về **thang 0–1** hoặc **0–10** để dễ so sánh:
  - `population_density_scaled = normalize(population_density)`
  - `infrastructure_score_scaled = normalize(infrastructure_index)`
- Tạo bảng dữ liệu đầu vào cuối cùng:
`region_id, hazard_prob, population_density, infra_index, historical_damage`

---

## 4. Mô hình đánh giá rủi ro

### 4.1. Khái quát
Mức độ rủi ro tổng hợp được xác định dựa trên hai thành phần:
1. **Hazard Probability (H)** – xác suất thiên tai.  
2. **Vulnerability (V)** – mức độ dễ bị tổn thương của khu vực.

### 4.2. Tính Vulnerability
Áp dụng mô hình hồi quy tuyến tính hoặc fuzzy logic để kết hợp các yếu tố:
`Vulnerability = α1 * Population + α2 * Infrastructure + α3 * HistoricalDamage`
Trong đó các hệ số α được xác định bằng quá trình huấn luyện hoặc chuyên gia gán trọng số.

### 4.3. Tính Risk Score và Safety Score
`RiskScore = β1 * HazardProbability + β2 * Vulnerability`
`SafetyScore = 10 - RiskScore`
Giá trị được chuẩn hóa về thang 0–10, trong đó:
| SafetyScore | Mức độ an toàn |
|--------------|----------------|
| 0–3 | Nguy hiểm cao |
| 4–6 | Trung bình |
| 7–10 | An toàn |

---

## 5. Kiểm định và đánh giá mô hình

- **Kiểm định chéo (Cross-validation)** để đảm bảo độ ổn định mô hình.  
- **Đánh giá sai số:**  
  - MAE (Mean Absolute Error)  
  - RMSE (Root Mean Square Error)  
- So sánh kết quả Safety Score với dữ liệu thực tế (thiệt hại, cảnh báo).

---

## 6. Công cụ và thư viện

- **Python:** ngôn ngữ chính  
- **Pandas / NumPy:** xử lý và chuẩn hóa dữ liệu  
- **Scikit-learn:** hồi quy tuyến tính, chuẩn hóa dữ liệu  
- **Matplotlib / Seaborn:** biểu đồ trực quan kết quả  
- **GeoPandas (tuỳ chọn):** hiển thị kết quả theo bản đồ vùng  

---

## 7. Kết luận

Mô hình này giúp đánh giá nhanh và khách quan **mức độ an toàn (Safety Score)** của từng khu vực dựa trên:
- Xác suất thiên tai từ hệ thống nhận diện AI, và  
- Mức độ dễ tổn thương được tính toán từ dữ liệu dân cư, hạ tầng và thiệt hại lịch sử.

Kết quả có thể hỗ trợ cơ quan quản lý trong việc **phân vùng rủi ro**, **lên kế hoạch ứng phó**, hoặc **phân bổ nguồn lực phòng chống thiên tai**.
