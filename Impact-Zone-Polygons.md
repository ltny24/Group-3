# Báo cáo: Giải pháp Tính toán Vùng Ảnh hưởng (Impact Zone Polygons)

**Trọng tâm:** Thiết kế thuật toán cho `algorithm-safety-map(24127311)`

---

## 1. Giới thiệu Vấn đề

**Impact Zone Polygon** là một đối tượng đa giác (Polygon) đại diện cho vùng địa lý dự kiến bị ảnh hưởng bởi một thiên tai cụ thể. Mục tiêu của thuật toán là tính toán và tạo ra các đa giác này một cách tự động và chính xác, dựa trên dữ liệu đầu vào của thiên tai.

Kết quả đầu ra (output) phải là một đối tượng hình học (geometry) ở định dạng chuẩn (ví dụ: **GeoJSON**) để hệ thống Frontend (Mapbox, Leaflet) có thể render (vẽ) lên bản đồ.

Phương pháp tính toán **phụ thuộc hoàn toàn** vào bản chất của loại thiên tai. Dưới đây là ba mô hình thuật toán chính cho ba loại thiên tai phổ biến.

---

## 2. Phân loại Giải pháp theo Loại hình Thiên tai

### 2.1. Loại 1: Bão (Storms / Cyclones)

* **Vấn đề:** Vùng ảnh hưởng của bão (đường đi, bán kính gió) không phải là thứ hệ thống *tính toán* (calculate) từ đầu, mà là dữ liệu *dự báo* (forecast) do các cơ quan khí tượng (NOAA, JMA, GDACS) cung cấp.
* **Giải pháp (Thuật toán):** **Phân tích và Trích xuất Dữ liệu API (API Data Parsing & Forwarding).**
* **Cách hoạt động chi tiết:**
    1.  **Thu thập (Ingestion):** Hệ thống Backend gọi đến API của một trung tâm dự báo (ví dụ: NOAA).
    2.  **Phân tích (Parsing):** Dữ liệu trả về thường ở định dạng XML hoặc JSON. Nhiệm vụ của thuật toán là tìm và trích xuất các đối tượng hình học đã được tính toán sẵn.
    3.  **Các lớp dữ liệu chính:**
        * **"Hình nón Bất định" (Cone of Uncertainty - COU):** Đây là một `Polygon` mà API cung cấp, thể hiện vùng mà tâm bão có thể đi qua trong 24-48-72 giờ tới.
        * **"Vùng Bán kính Gió" (Wind Radii / Swaths):** Đây là các `Polygon` (thường là 4 hoặc 8 cạnh) thể hiện các vùng có sức gió trên một mức nhất định (ví dụ: 34-knot, 50-knot, 64-knot).
    4.  **Kết quả (Output):** Thuật toán **không tính toán** mà chỉ **chuẩn hóa** các `Polygon` này về định dạng `GeoJSON` và gửi về cho Frontend.

---

### 2.2. Loại 2: Lũ lụt (Floods)

* **Vấn đề:** Đây là loại phức tạp nhất vì vùng ngập lụt phụ thuộc trực tiếp vào hai yếu tố: (1) Mực nước dâng dự kiến và (2) Địa hình (nước không thể chảy lên dốc).
* **Giải pháp (Thuật toán):** **"Flood Fill" dựa trên Địa hình (DEM-based Flood Fill)**. (Còn gọi là Mô hình "Bồn tắm" - Bathtub Model).
* **Yêu cầu Dữ liệu (Input):**
    * **DEM (Digital Elevation Model):** Một tệp `raster` (ảnh) mà mỗi pixel chứa giá trị độ cao của vị trí đó.
    * **Mực nước dâng dự kiến (Water Surface Elevation - WSE):** Một giá trị (ví dụ: "Lũ dâng 5 mét").
    * **Điểm bắt đầu (Seed Point):** Vị trí nguồn (pixel trên sông, hồ, hoặc điểm vỡ đê).
* **Cách hoạt động chi tiết:**
    1.  **Nguyên lý:** Thuật toán hoạt động tương tự **Breadth-First Search (BFS)** trên một `Grid` (Grid chính là file DEM).
    2.  **Bước 1 (Khởi tạo):** Chọn 1 hoặc nhiều "seed pixel" (ô hạt giống) làm điểm bắt đầu (ví dụ: các pixel thuộc về con sông). Thêm chúng vào một hàng đợi (Queue).
    3.  **Bước 2 (Lan truyền - Propagation):** Lấy một pixel từ hàng đợi. Kiểm tra 8 pixel lân cận của nó.
    4.  **Bước 3 (Điều kiện - Condition):** Một pixel lân cận sẽ bị "làm ngập" (và được thêm vào hàng đợi) *chỉ khi* (IF) cả hai điều kiện sau đều đúng:
        * `Pixel_Độ_cao` **<** `Mực_nước_dâng` (Địa hình của pixel đó thấp hơn mực nước lũ).
        * Pixel đó **chưa được thăm** (chưa bị ngập).
    5.  **Bước 4 (Kết quả Raster):** Thuật toán tiếp tục lan truyền cho đến khi hàng đợi rỗng. Lúc này, nó đã chạm đến các "bức tường" (pixels có độ cao > mực nước dâng). Tập hợp tất cả các pixel "đã thăm" tạo thành một `raster mask` (mặt nạ nhị phân thể hiện vùng ngập).
    6.  **Bước 5 (Vector hóa - Vectorization):** Chuyển đổi `raster mask` (tập hợp các pixel vuông) này thành một `Polygon` (vector) mượt mà bằng thuật toán (ví dụ: Marching Squares). Đây chính là `Impact Zone Polygon` (GeoJSON) cuối cùng.

---

### 2.3. Loại 3: Động đất (Earthquakes) & Sự cố Điểm (Point Incidents)

* **Vấn đề:** Áp dụng cho các sự cố xảy ra tại một điểm (tâm chấn, vụ nổ, rò rỉ hóa chất) và có mức độ ảnh hưởng lan tỏa tương đối đồng đều ra xung quanh.
* **Giải pháp (Thuật toán):** **Tạo Vùng đệm (Buffering).**
* **Cách hoạt động chi tiết:**
    1.  **Đầu vào (Input):**
        * Một tọa độ điểm (Point geometry): Vị trí tâm chấn.
        * Cường độ (Magnitude) hoặc một mô hình suy giảm (attenuation model) để xác định bán kính.
    2.  **Logic:** Dựa trên cường độ, hệ thống xác định các bán kính ảnh hưởng khác nhau.
        * *Ví dụ:* Độ lớn 7.0 => Vùng Nguy hiểm (Đỏ) = 15km; Vùng Cảnh báo (Cam) = 50km.
    3.  **Thực thi (Backend):** Sử dụng một hàm GIS chuẩn (ví dụ `ST_Buffer()` trong PostGIS hoặc `buffer()` trong GeoPandas).
    4.  **Kết quả (Output):** Tạo ra các `Polygon` hình tròn đồng tâm (concentric polygons) thể hiện các mức độ ảnh hưởng (rung chấn) khác nhau.

---

## 3. Công cụ Kỹ thuật & Định dạng Dữ liệu

* **Định dạng Trao đổi Dữ liệu:**
    * **GeoJSON:** Là tiêu chuẩn bắt buộc. Cấu trúc JSON đơn giản, mô tả `Polygon` bằng một danh sách các cặp tọa độ `[longitude, latitude]`.

* **Công cụ Backend (Python):**
    * **Rasterio:** Thư viện bắt buộc để đọc và xử lý file DEM (cho Loại 2: Lũ lụt).
    * **GeoPandas / Shapely:** Để thực hiện các phép toán vector (cho Loại 3: Buffering) và thao tác với các đối tượng GeoJSON.
    * **Scikit-image (skimage.segmentation.flood_fill):** Có thể được sử dụng để chạy thuật toán Flood Fill trên mảng numpy (đã được đọc bởi Rasterio).

* **Công cụ Database (Khuyến nghị):**
    * **PostGIS (PostgreSQL Extension):** Cực kỳ mạnh mẽ. Có thể lưu trữ và thực hiện các hàm này trực tiếp trong CSDL (ví dụ: `ST_Buffer`, `ST_Clip`, `ST_AsGeoJSON`).
## 4. Ví dụ về code
Đoạn code này minh họa cách mô phỏng và xác định vùng ngập lụt (Flood Zone) dựa trên mô hình độ cao DEM (Digital Elevation Model) và thuật toán Flood Fill.
Trong hệ thống Impact Zone Polygon, kết quả của hàm này giúp xác định:
  * Các khu vực bị ngập khi mực nước dâng lên (nguy cơ cao)
  * Phân vùng rủi ro theo địa hình, làm đầu vào để tính chỉ số Risk Score
    cho các vùng dân cư, cơ sở hạ tầng, hoặc khu công nghiệp.
```python
import numpy as np
from skimage.segmentation import flood_fill

def calculate_flood_zone():
    """
    Tính toán vùng ngập lụt bằng DEM-based Flood Fill.
    """
    
    # 1. Mô phỏng Lưới Độ cao (DEM Grid)
    # (Ngoài đời thực, bạn sẽ tải từ file GeoTIFF bằng 'rasterio')
    # 10 là núi, 1 là sông/biển
    dem_grid = np.array([
        [10, 10, 10, 10, 10, 10, 10],
        [10, 8,  5,  4,  3,  1,  1], # Sông/biển ở [1, 6]
        [10, 7,  5,  3,  2,  1,  1], # Sông/biển ở [2, 6]
        [10, 6,  4,  2,  3,  5,  10],
        [10, 5,  3,  2,  4,  10, 10],# Vùng trũng bị cô lập ở [4, 3] (giá trị 2)
        [10, 10, 10, 10, 10, 10, 10]
    ])
    
    # 2. Định nghĩa tham số
    water_level = 4.5  # Mực nước dâng 4.5 mét
    seed_point = (2, 6) # Điểm bắt đầu (hạt giống) từ con sông

    # 3. Bước A: Tạo Mặt nạ Tiềm năng ("Bathtub Model")
    # Lấy tất cả các ô có độ cao < mực nước
    potential_mask = dem_grid < water_level
    
    print("Mặt nạ Tiềm năng (Bathtub Mask):")
    print(potential_mask.astype(int))
    # Lưu ý: Ô [4, 3] (vùng trũng) là 1 (True)
    
    # 4. Bước B: Tạo Mặt nạ Thực tế (Flood Fill)
    # Bắt đầu từ 'seed_point', "tô màu" tất cả các ô True
    # liền kề trong 'potential_mask'.
    # Nó sẽ KHÔNG tô được đến ô [4, 3] vì nó bị chặn
    # bởi các ô có giá trị >= 4.5 (ví dụ: [3, 5] và [4, 4]).
    
    actual_flood_mask = flood_fill(
        potential_mask.astype(int), # Input phải là integer
        seed_point,
        new_value=2 # Tô màu vùng ngập lụt bằng giá trị 2
    )

    print("\nMặt nạ Ngập lụt Thực tế (Actual Flood Mask):")
    print(actual_flood_mask)
    # Kết quả: Ô [4, 3] vẫn là 1 (True), không phải 2 (Flooded)
    
    # Bước cuối cùng (không có trong code) là "vector hóa" 
    # (vectorize) mảng 'actual_flood_mask == 2' này 
    # để tạo ra một GeoJSON Polygon.
    
    return actual_flood_mask == 2

# Chạy ví dụ
flood_zone = calculate_flood_zone()
```