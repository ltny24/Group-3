# Báo cáo: Phương pháp Giải quyết Vấn đề Điểm Rủi ro (Risk Score)

**Trọng tâm:** Thiết kế thuật toán cho `algorithm-safety-map(24127311)`

---

## 1. Giới thiệu Vấn đề

Để giải quyết vấn đề phân vùng rủi ro thiên tai, một **Mô hình Tính điểm có Trọng số (Weighted Scoring Model)** được đề xuất. Phương pháp này cung cấp một cơ chế linh hoạt để tổng hợp nhiều yếu tố rủi ro không đồng nhất (ví dụ: khoảng cách, độ cao, dữ liệu lịch sử) thành một chỉ số rủi ro duy nhất, có thể định lượng và trực quan hóa.

Báo cáo này trình bày quy trình 5 bước để xây dựng thuật toán tính toán Risk Score.

---

## 2. Quy trình 5 bước Xây dựng Thuật toán

### Bước 1: Xác định các Yếu tố Rủi ro

Quá trình bắt đầu bằng việc xác định tất cả các lớp dữ liệu (data layers) đầu vào ảnh hưởng đến rủi ro tại một vị trí (ví dụ: mỗi ô lưới 1km x 1km).

* **Yếu tố Động:** Dữ liệu thay đổi theo thời gian thực.
    * `F1`: Khoảng cách tới tâm bão hoặc vùng ảnh hưởng bão.
    * `F2`: Tình trạng cảnh báo lũ lụt đang hoạt động (Có/Không).
    * `F3`: Cường độ rung chấn (Động đất) dự báo.
* **Yếu tố Tĩnh:** Dữ liệu địa lý hoặc lịch sử.
    * `F4`: Độ cao so với mực nước biển (Digital Elevation Model - DEM).
    * `F5`: Dữ liệu lịch sử thiên tai (ví dụ: vùng ngập lụt 100 năm).
    * `F6`: Khoảng cách tới bờ biển (cho rủi ro bão, sóng thần).

### Bước 2: Chuẩn hóa Dữ liệu

Đây là bước bắt buộc để đồng bộ hóa các đơn vị đo lường khác nhau (ví dụ: "mét" độ cao và "km" khoảng cách). Nếu không chuẩn hóa, một yếu tố có thang đo lớn (như độ cao) sẽ lấn át hoàn toàn các yếu tố khác.

* **Phương pháp:** Min-Max Scaling.
* **Mục tiêu:** Đưa tất cả các yếu tố về một thang điểm chung, phổ biến nhất là **từ 0 đến 1**.
* **Ý nghĩa thang điểm chuẩn hóa:**
    * `0`: Đại diện cho mức an toàn nhất (ví dụ: ở rất xa bão, độ cao rất lớn).
    * `1`: Đại diện cho mức nguy hiểm nhất (ví dụ: ở ngay tâm bão, độ cao bằng 0).

**Ví dụ công thức chuẩn hóa:**

1.  **Khoảng cách tới bão (F1):** (Chuẩn hóa ngược - càng gần càng nguy hiểm)
    * Giả định vùng ảnh hưởng nguy hiểm tối đa là 100km.
    * `Score_F1 = 1 - (Khoảng_cách / 100)`
    * *(Nếu khoảng cách > 100km, Score_F1 = 0)*

2.  **Độ cao (F4 - cho Lũ lụt):** (Chuẩn hóa ngược - càng thấp càng nguy hiểm)
    * Giả định độ cao an toàn tuyệt đối là 50m.
    * `Score_F4 = 1 - (Độ_cao / 50)`
    * *(Nếu độ cao > 50m, Score_F4 = 0)*

Sau bước này, tất cả các yếu tố `F1, F2, F3...` đều có một giá trị chuẩn hóa (Normalized Score) từ 0 đến 1.

### Bước 3: Gán Trọng số

Không phải mọi yếu tố đều có tầm quan trọng như nhau. Các yếu tố động (như một cơn bão đang hoạt động) phải có tác động đến điểm số lớn hơn các yếu tố tĩnh (như lịch sử).

* **Nguyên tắc:** Gán một trọng số (Weight `w`) cho mỗi yếu tố. Tổng tất cả các trọng số phải bằng 1.0 (hoặc 100%).
* **Ví dụ gán trọng số (ví dụ):**
    * `w1` (Bão đang đến): **0.4** (Rất quan trọng)
    * `w2` (Cảnh báo lũ): **0.3** (Quan trọng)
    * `w4` (Độ cao): **0.15** (Hơi quan trọng)
    * `w5` (Lịch sử): **0.1** (Quan trọng vừa)
    * `w6` (Bờ biển): **0.05** (Ít quan trọng)
    * **Tổng = 0.4 + 0.3 + 0.15 + 0.1 + 0.05 = 1.0**

### Bước 4: Xây dựng Công thức Tổng hợp

Điểm rủi ro cuối cùng được tính bằng tổng có trọng số của các điểm chuẩn hóa (từ Bước 2) và trọng số (từ Bước 3).

**Công thức tính Risk Score:**
`RiskScore = (w1 * Score_F1) + (w2 * Score_F2) + (w4 * Score_F4) + (w5 * Score_F5) + (w6 * Score_F6)`

**Ví dụ tính toán cho 1 ô lưới cụ thể:**

* **Giả định:**
    * Cách bão 20km (từ Bước 2, `Score_F1 = 1 - (20/100) = 0.8`)
    * Không có cảnh báo lũ (`Score_F2 = 0`)
    * Độ cao 10m (từ Bước 2, `Score_F4 = 1 - (10/50) = 0.8`)
    * Lịch sử ngập lụt cao (`Score_F5 = 1.0`)
    * Cách bờ biển 5km (`Score_F6 = 1 - (5/50) = 0.9` - giả sử 50km là an toàn)

* **Tính toán:**
    * `RiskScore` = (0.4 \* 0.8) + (0.3 \* 0) + (0.15 \* 0.8) + (0.1 \* 1.0) + (0.05 \* 0.9)
    * `RiskScore` = 0.32 + 0 + 0.12 + 0.1 + 0.045
    * **`RiskScore` = 0.585**

Kết quả: Ô lưới này có điểm rủi ro là **0.585** (trên thang điểm từ 0 đến 1).

### Bước 5: Phát triển Thuật toán Phân loại (Tô màu)

Sau khi có được `risk_score_grid` (một mảng 2D chứa các giá trị 0.0-1.0) từ Bước 4, nhiệm vụ của Bước 5 là tạo ra một "Lưới Phân loại" (Classified Grid) mới. Lưới này là một mảng 2D có cùng kích thước, nhưng thay vì chứa điểm số, nó chứa một số nguyên (ví dụ: 0, 1, 2, 3) đại diện cho cấp độ rủi ro (An toàn, Thấp, Cao, Nguy hiểm).

Lưới số nguyên này sau đó được gửi đến Frontend (Mapbox) để tô màu.

**A. Phương pháp 1: Phân loại Thủ công (Manual/Static Classification)**

Phương pháp này dùng các ngưỡng cố định, do chuyên gia định nghĩa.

**Logic**: Chúng ta định nghĩa các "bin" (khoảng giá trị) và dùng thư viện NumPy để "số hóa" toàn bộ lưới một cách nhanh chóng.

Công cụ: `numpy.digitize` hoặc `numpy.select`.

**Ví dụ (sử dụng `numpy.select`):**

Đầu tiên, định nghĩa các điều kiện và các giá trị (số nguyên) tương ứng.

`condlist` = [ `risk_score_grid` <= 0.25, (Điều kiện 1) `risk_score_grid` <= 0.50, (Điều kiện 2) `risk_score_grid` <= 0.75 (Điều kiện 3) ]

`choicelist` = [ 0, (Giá trị nếu ĐK 1 đúng - An toàn) 1, (Giá trị nếu ĐK 2 đúng - Thấp) 2 (Giá trị nếu ĐK 3 đúng - Cao) ]

Hàm `np.select(condlist, choicelist, default=3)` sẽ chạy trên toàn bộ 1 triệu ô. Nếu ô nào không thỏa mãn cả 3 điều kiện (tức là > 0.75), nó sẽ nhận giá trị default là 3 (Nguy hiểm).

**Ưu điểm**: Rất nhanh, ổn định. Một điểm số 0.6 luôn luôn là "Rủi ro cao" (Cam) bất kể các ô xung quanh như thế nào.

**Nhược điểm**: Nếu tất cả các điểm số đều rơi vào một khoảng (ví dụ: từ 0.4 đến 0.5), bản đồ của người dùng sẽ chỉ có một màu Vàng duy nhất, làm mất đi sự khác biệt chi tiết.

**B. Phương pháp 2: Phân loại Động (Dynamic Classification - Jenks Natural Breaks)**

Phương pháp này "thông minh" hơn. Nó phân tích dữ liệu hiện tại của risk_score_grid để tìm ra các điểm ngắt (breaks) "tự nhiên" nhất, nhằm tối đa hóa sự khác biệt giữa các nhóm.

**Logic**: Thuật toán (ví dụ: Jenks) sẽ xem xét toàn bộ 1 triệu điểm rủi ro và tự quyết định, "OK, dựa trên dữ liệu này, dường như có 4 nhóm tự nhiên với các ngưỡng là 0.21, 0.45, và 0.68." Các ngưỡng này sẽ thay đổi mỗi khi dữ liệu đầu vào (bão, lũ) thay đổi.

**Công cụ**: Thư viện `pysal.mapclassify`. Đây là thư viện chuẩn trong Phân tích Không gian Python.

**Ví dụ (sử dụng `pysal.mapclassify`):**
```python
import mapclassify as mc

k = 4 (Chúng ta muốn 4 nhóm màu)

# Phải làm phẳng (flatten) lưới 2D thành mảng 1D

flat_data = risk_score_grid.flatten()

# Chạy thuật toán Jenks. Đây là bước tính toán

classifier = mc.NaturalBreaks(flat_data, k=k)

# 'classifier.bins' sẽ cho bạn biết các ngưỡng (ví dụ: [0.21, 0.45, 0.68])

# 'classifier.yb' là mảng 1D chứa các lớp (0, 1, 2, 3)
```

Cuối cùng, reshape mảng `classifier.yb` trở lại kích thước (1000, 1000) ban đầu.

**Ưu điểm**: Tạo ra các bản đồ có tính trực quan cao nhất, luôn hiển thị sự phân tách rõ rệt giữa các vùng (luôn có đủ 4 màu).

**Nhược điểm**: Ngưỡng của bản đồ thay đổi liên tục. Một ô 0.6 hôm nay có thể là màu Cam, nhưng ngày mai khi có bão lớn, điểm 0.6 có thể chỉ là màu Vàng (vì các điểm 0.8, 0.9 xuất hiện).

## 3. Công cụ Kỹ thuật Đề xuất

Để triển khai mô hình này một cách hiệu quả, các công cụ sau được đề xuất:

* **Backend (Python):**
    * **GeoPandas / Shapely:** Để xử lý các ô lưới (polygons) và vị trí địa lý.
    * **Rasterio:** Để đọc và xử lý dữ liệu độ cao (DEM) cho yếu tố `F4`.
    * **Numpy:** Để thực hiện các phép tính công thức (Bước 4) nhanh chóng trên toàn bộ lưới (vectorized operations).
* **Database:**
    * **PostGIS (PostgreSQL Extension):** Để lưu trữ các lớp dữ liệu tĩnh (độ cao, lịch sử) và thực hiện các truy vấn không gian phức tạp.
## 4. Ví dụ về code
Đoạn code này minh họa cách tính toán "Risk Score Grid"
 — một bản đồ dạng lưới (grid map) mô tả mức độ rủi ro cho từng vùng.

 **Ý tưởng chính:**
   - Mỗi ô (cell) trong lưới đại diện cho một khu vực địa lý nhỏ.
   - Các lớp dữ liệu (layers) như bão, ngập lụt, địa hình, lịch sử thiên tai,
    và khoảng cách tới bờ biển được tổng hợp lại bằng công thức có trọng số.
   - Kết quả là một bản đồ 2D (1000x1000), trong đó mỗi ô chứa điểm rủi ro
     (risk score) từ 0.0 đến 1.0 — càng cao thì nguy cơ càng lớn.

 **Ứng dụng:** Đây là phần cốt lõi trong hệ thống Risk Score, giúp xác định
     khu vực nào có nguy cơ cao để hỗ trợ cảnh báo, quy hoạch, 
     hoặc phản ứng khẩn cấp.
```python
import numpy as np

def calculate_risk_score_grid():
    """
    Tính toán lưới điểm rủi ro (Risk Score Grid) bằng NumPy.
    """
    
    # 1. Định nghĩa Trọng số (Weights)
    # Các trọng số này phải có tổng bằng 1.0
    WEIGHTS = {
        'storm_proximity': 0.4,
        'flood_alert': 0.3,
        'elevation': 0.15,
        'history': 0.1,
        'coast_proximity': 0.05
    }

    # 2. Tải các Lớp dữ liệu (Data Layers)
    # Giả sử chúng ta đã tải và CHUẨN HÓA (normalized) 
    # tất cả các lớp dữ liệu thành các mảng NumPy 2D (grid).
    # Mọi giá trị trong các mảng này đều nằm trong khoảng 0.0 đến 1.0.
    
    # Ở đây, chúng ta sẽ mô phỏng (simulate) dữ liệu
    grid_shape = (1000, 1000) # Bản đồ là một lưới 1000x1000
    
    # 0.8 (gần), 0.1 (xa)
    layer_storm = np.random.rand(*grid_shape) 
    # 1.0 (có cảnh báo), 0.0 (không)
    layer_flood = np.random.randint(0, 2, size=grid_shape).astype(float) 
    # 1.0 (thấp, nguy hiểm), 0.0 (cao, an toàn)
    layer_elevation = np.random.rand(*grid_shape) 
    # 1.0 (lịch sử tồi tệ), 0.0 (an toàn)
    layer_history = np.random.rand(*grid_shape) 
    # 1.0 (gần bờ biển), 0.0 (xa)
    layer_coast = np.random.rand(*grid_shape) 

    
    # 3. Tính toán Tổng có Trọng số (Weighted Sum)
    # Đây là lõi thuật toán. NumPy thực hiện phép nhân và cộng
    # trên toàn bộ 1,000,000 ô (1000x1000) ngay lập tức.
    
    risk_score_grid = (
        WEIGHTS['storm_proximity'] * layer_storm +
        WEIGHTS['flood_alert']   * layer_flood +
        WEIGHTS['elevation']     * layer_elevation +
        WEIGHTS['history']       * layer_history +
        WEIGHTS['coast_proximity'] * layer_coast
    )

    # risk_score_grid bây giờ là một mảng 2D (1000x1000), 
    # mỗi ô chứa một điểm rủi ro (ví dụ: 0.585).
    # Bước tiếp theo là dùng thuật toán Jenks để phân loại lưới này.
    
    print(f"Kích thước lưới Risk Score: {risk_score_grid.shape}")
    print(f"Điểm rủi ro tại ô (500, 500): {risk_score_grid[500, 500]:.4f}")
    
    return risk_score_grid

# Chạy ví dụ
risk_grid = calculate_risk_score_grid()
```