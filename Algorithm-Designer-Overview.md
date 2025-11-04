# Vai Trò & Tổng Quan Hệ Thống: Algorithm Designer

**Người thực hiện:** Nguyễn Hải Trọng

**Phân nhánh (Git Branch):** `algorithm-safety-map(24127311)`

**Trọng tâm Giai đoạn:** Thiết kế Thuật toán và Tối ưu Hiệu suất

---

## 1. Định Nghĩa Vấn Đề

Vấn đề cốt lõi mà vai trò Algorithm Designer cần giải quyết là **Nguy cơ Quá tải Thông tin Thị giác** và **Rủi ro Phân vùng Sai lệch**. Việc thiếu các thuật toán tối ưu và chính xác sẽ khiến người dùng không thể nhận diện được mối đe dọa thực sự, dẫn đến sự hoảng loạn hoặc sự chủ quan.

### 1.1. Các Rủi ro Kỹ thuật do Thiếu Thuật toán Tối ưu:

| Rủi ro Kỹ thuật | Tác động Lên Dự án | Hệ quả Nghiêm trọng |
| :--- | :--- | :--- |
| **Visual Overload (Ô nhiễm Thị giác)** | **Ứng dụng không thể sử dụng** khi zoom xa do hàng ngàn marker chồng chéo. | Người dùng bị "ngợp" thông tin, không thể tìm thấy Bệnh viện/Nơi trú ẩn khi khẩn cấp. |
| **Inaccurate Risk Zoning** | **Sai lệch 50%** trong việc xác định vùng an toàn/nguy hiểm thực tế. | Người dùng tin tưởng vào vùng "An toàn" (Xanh) giả mạo, hoặc sơ tán khỏi vùng "Nguy hiểm" (Đỏ) giả mạo. |
| **Poor Performance (Hiệu suất Kém)** | **Thời gian render bản đồ > 5 giây** trên thiết bị di động 3G. | Ứng dụng bị treo, giật lag, khiến người dùng từ bỏ ứng dụng ngay trong tình huống khủng hoảng. |

### 1.2. Mục tiêu Chiến lược của Vai trò Algorithm Designer:

1.  **Chuyển đổi Dữ liệu:** Dịch thuật 100% dữ liệu GIS và API thô thành các lớp bản đồ trực quan **dễ hiểu trong 3 giây**.
2.  **Đảm bảo Hiệu suất:** Tối ưu các thuật toán (clustering, classification) để đảm bảo thời gian tải và render bản đồ **dưới 2 giây** trên thiết bị di động, ngay cả với hàng ngàn điểm dữ liệu.
3.  **Đảm bảo Chính xác:** Xây dựng các thuật toán (Jenks, Flood Fill, Clustering) phản ánh chính xác vùng ảnh hưởng thực tế và ưu tiên hiển thị các marker quan trọng nhất (POIs).

---

## 2. Phân Tách Công Việc & Mối quan hệ Xử lý

Công việc của Algorithm Designer được phân tách thành 3 giai đoạn xử lý chính, tạo ra các đầu ra là các lớp dữ liệu được chuẩn hóa để đưa lên Frontend. Các đầu ra này là sản phẩm thuật toán bắt buộc cho ứng dụng.

### 2.1. Giai đoạn 1: Phân loại & Chuẩn hóa
| Tài liệu Output (Data Layer) | Kỹ thuật Thuật toán | Nhiệm vụ Chi tiết | Mục đích Trọng tâm |
| :--- | :--- | :--- | :--- |
| **Risk Score Grid (Lưới Điểm Rủi ro)** | **Risk Scoring Model**, **Data Classification (Jenks Natural Breaks, Quantiles)**. | Tính toán `RiskScore` cho mỗi ô lưới (grid cell) từ nhiều nguồn (địa hình, thời tiết, lịch sử). Chạy thuật toán Jenks để tìm 4-5 bậc rủi ro. | Chuẩn hóa đầu vào, tạo ra các **"bậc" rủi ro (Risk Levels)** có ý nghĩa thống kê để gán màu. |

### 2.2. Giai đoạn 2: Tính toán Hình học

| Tài liệu Output (Data Layer) | Kỹ thuật Thuật toán | Nhiệm vụ Chi tiết | Mối quan hệ Truy vết |
| :--- | :--- | :--- | :--- |
| **Impact Zone Polygons (GeoJSON)** | **DEM-based Flood Fill (BFS)**, **Concentric Buffering**, **Polygon Parsing**. | Xử lý dữ liệu DEM để tạo vùng ngập lụt. Phân tích API bão để trích xuất hình nón. Tạo buffer (vùng đệm) cho tâm chấn động đất. | **Kế thừa** các tham số (ví dụ: mực nước dâng, cường độ) từ **Risk Score Grid** (GĐ1) để xác định quy mô vùng ảnh hưởng. |

### 2.3. Giai đoạn 3: Tối ưu Hiển thị

| Tài liệu Output (Data Layer) | Kỹ thuật Thuật toán | Nhiệm vụ Chi tiết | Mối quan hệ Kế thừa |
| :--- | :--- | :--- | :--- |
| **Clustered & Prioritized Markers** | **Grid-based Clustering (nhanh)** hoặc **DBSCAN (chính xác)**, **Collision Detection (Phát hiện va chạm)**. | Nhóm các marker POI thành các cụm (cluster) theo mức zoom. Ẩn/hiện marker dựa trên độ ưu tiên (Bệnh viện > Nơi trú ẩn). | **Kế thừa** vị trí POIs và **Impact Zone Polygons** (GĐ2) để quyết định marker nào cần được ưu tiên hiển thị (ví dụ: chỉ hiện nơi trú ẩn trong vùng bão). |

---

### Mối quan hệ Xử lý

Mỗi giai đoạn là đầu vào bắt buộc cho giai đoạn tiếp theo, đảm bảo tính nhất quán từ dữ liệu thô đến hình ảnh trực quan:

> $$\mathbf{Raw\ Data\ (API/GIS)} \xrightarrow{\text{Classification (Jenks)}} \mathbf{Risk\ Model\ (Grid)} \xrightarrow{\text{Computation (BFS/Buffer)}} \mathbf{Visual\ Layers\ (GeoJSON)}$$

* **Mục tiêu:** Đảm bảo rằng mọi **Lớp Bản đồ (Map Layer)** được hiển thị cho người dùng (ví dụ: vùng tô màu) đều có thể được truy vết ngược về một **Mô hình Điểm rủi ro (Risk Score Model)** cụ thể.

## 3. Lịch Trình - Tối ưu hóa 4 Tuần (Cho MVP)

Tiến độ được nén chặt, tập trung vào việc tạo ra các thuật toán cốt lõi và tối ưu hiệu suất cho sản phẩm khả dụng tối thiểu (MVP).

| Tuần | Mục tiêu Công việc | Hoạt động Trọng tâm  | Kết quả |
| :--- | :--- | :--- | :--- |
| **Tuần 1** | **Nền tảng & Dữ liệu Tĩnh** | Tích hợp base map (Mapbox/Leaflet). Hiển thị POIs tĩnh (chưa tối ưu). Xây dựng Risk Scoring Model (dùng dữ liệu giả lập). | `01-Base-Map-Layer.js` |
| **Tuần 2** | **Lõi Phân vùng Rủi ro (Tasks 1 & 2)** | Triển khai thuật toán tô màu **Jenks Natural Breaks (Task 1)**. Triển khai 1 thuật toán vùng ảnh hưởng (ví dụ: **Buffer - Task 2**). | `02-Risk-Choropleth-Layer.js` |
| **Tuần 3** | **Tối ưu Marker & Dữ liệu Động (Tasks 2 & 3)** | Triển khai **Marker Clustering (Task 3)**. Tích hợp API bão và render hình nón dự báo (Task 2). | `03-Clustered-Marker-Layer.js` |
| **Tuần 4** | **Hoàn thiện & Tối ưu Hiệu suất** | Triển khai **Marker Decluttering/Prioritization (Task 3)**. Tối ưu hiệu suất (sử dụng vector tiles). Finalize và tạo **Merge Request (MR)**. | **Algorithm MVP Sẵn sàng Merge.** |

---

## 4. Công Cụ và Kỹ Thuật

### 4.1. Công cụ Cốt lõi cho Thiết kế Thuật toán

* **Mapbox GL JS / Leaflet:** Thư viện frontend để render các lớp bản đồ. (Mapbox được khuyến nghị cho clustering hiệu suất cao).
* **Python (GeoPandas, Rasterio, Scikit-learn):** Backend để xử lý dữ liệu GIS nặng (tính toán vùng ngập lụt, phân loại Jenks, clustering DBSCAN).
* **PostGIS (PostgreSQL Extension):** Cơ sở dữ liệu chuyên dụng để lưu trữ và thực hiện các truy vấn không gian (spatial queries) hiệu suất cao.

### 4.2. Phương pháp Quản lý Mã nguồn (Sử dụng Git/GitHub)

* **Kiểm soát Phiên bản:** Sử dụng **Git** cho tất cả mã nguồn thuật toán (Python, JS).
* **Tên Branch Chuẩn:** Luôn làm việc trên nhánh `algorithm-safety-map(24127311)`.
* **Quy trình Phê duyệt:** Mọi thuật toán mới (ví dụ: `FloodFill.py` hoặc `Jenks.js`) đều phải được **Code Review** và vượt qua **Unit Tests** trước khi Merge vào nhánh chính.