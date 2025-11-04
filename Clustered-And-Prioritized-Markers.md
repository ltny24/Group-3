# Báo cáo: Tối ưu Hiển thị Marker (Clustering & Prioritization)

**Trọng tâm:** Thiết kế thuật toán cho `algorithm-safety-map(24127311)`

---

## 1. Giới thiệu Vấn đề

Vấn đề cần giải quyết là **"Quá tải Thông tin Thị giác" (Visual Overload)**. Khi bản đồ hiển thị hàng ngàn điểm POI (Bệnh viện, Nơi trú ẩn, Lãnh sự quán), các marker này sẽ chồng chéo lên nhau, tạo thành một mớ hỗn độn, khiến người dùng không thể đọc được thông tin.

Giải pháp là một **Pipeline Xử lý Hiển thị Động (Dynamic Rendering Pipeline)**. Pipeline này phải chạy theo thời gian thực (real-time) trên Client (trình duyệt/ứng dụng di động) mỗi khi người dùng thay đổi mức độ zoom hoặc di chuyển bản đồ.

---

## 2. Tổng quan Luồng Xử lý (Pipeline Overview)

Đây là một pipeline chạy phía **Client-side**, được kích hoạt bởi các sự kiện của bản đồ (ví dụ: `zoomend` hoặc `moveend`).

Mục tiêu của pipeline là nhận **hàng ngàn** điểm dữ liệu thô (raw markers) làm đầu vào và chỉ xuất **vài chục** đối tượng đồ họa (clusters, prioritized markers) ra màn hình.

**Luồng xử lý (Flow):**

> **(User Action: Zoom/Move)** $\rightarrow$
> **[Giai đoạn 1: Thu thập Dữ liệu (Data Fetching)]** $\rightarrow$
> **[Giai đoạn 2: Phân cụm (Clustering)]** $\rightarrow$
> **[Giai đoạn 3: Khử chồng chéo (Decluttering/Prioritization)]** $\rightarrow$
> **(Output: Rendered View)**

---

## 3. Phân tích Chi tiết Giai đoạn Pipeline

### 3.1. Giai đoạn 0: Tiền xử lý (Backend - One-time)

Đây là bước chuẩn bị dữ liệu, thực hiện một lần duy nhất trong cơ sở dữ liệu (PostGIS) trước khi cung cấp cho Frontend.

1.  **Gán Độ ưu tiên (Priority Assignment):**
    * Một trường `priority` (số nguyên) được thêm vào bảng dữ liệu POIs.
    * Giá trị `priority` càng nhỏ, độ ưu tiên càng cao.
    * *Ví dụ:* `1`: Bệnh viện Cấp 1, `2`: Nơi trú ẩn khẩn cấp, `3`: Lãnh sự quán, `4`: Bệnh viện Cấp 2, `5`: Trạm cảnh sát, `10`: Hiệu thuốc.
2.  **Tối ưu hóa Phân phối (Data Tiling):**
    * Dữ liệu POIs không được gửi dưới dạng một file JSON 50MB.
    * Chúng được cắt thành các **Vector Tiles (MVT)**. Đây là công nghệ cốt lõi. Mỗi tile chứa dữ liệu đã được đơn giản hóa cho một ô lưới và một mức zoom cụ thể.

### 3.2. Giai đoạn 1: Thu thập Dữ liệu (Data Fetching / Tile Loading)

Đây là bước đầu tiên của pipeline real-time trên Client.

* **Trigger:** Người dùng di chuyển/zoom bản đồ.
* **Hoạt động:**
    1.  Client (Mapbox/Leaflet) xác định các **ô "tiles"** cần thiết cho khung nhìn (viewport) mới.
    2.  Nó yêu cầu (fetches) các vector tiles này từ Backend.
* **Output:** Một tập hợp (vài nghìn) điểm POIs **chỉ nằm trong khung nhìn hiện tại**, cùng với thuộc tính `priority` của chúng (đã gán ở Giai đoạn 0).

### 3.3. Giai đoạn 2: Phân cụm (Clustering)

Đây là bộ lọc thô đầu tiên, mục tiêu là nhóm các marker ở gần nhau.

* **Input:** Hàng ngàn điểm POIs (từ Giai đoạn 1).
* **Thuật toán:** Thường là **Grid-based Clustering** (nhanh) hoặc K-D Trees, được tích hợp sẵn trong thư viện bản đồ (ví dụ: `supercluster` của Mapbox).
* **Cách hoạt động:**
    1.  Thuật toán chia khung nhìn thành một lưới (grid) các ô (ví dụ: 50x50 pixel).
    2.  Tất cả các điểm rơi vào cùng một ô lưới sẽ được nhóm lại thành một **"Cluster" (Cụm)**.
    3.  Các điểm nằm một mình trong một ô sẽ trở thành **"Single Marker" (Điểm đơn)**.
* **Output:** Một tập hợp dữ liệu đã giảm đáng kể, bao gồm:
    * Danh sách các **Clusters** (ví dụ: "Cụm 50 điểm tại Tọa độ X").
    * Danh sách các **Single Markers**.

### 3.4. Giai đoạn 3: Ưu tiên & Khử chồng chéo (Prioritization & Decluttering)

Đây là bộ lọc tinh cuối cùng, xử lý các va chạm còn sót lại sau khi phân cụm.

* **Input:** Danh sách các Clusters và Single Markers (từ Giai đoạn 2).
* **Thuật toán:** **Collision Detection (Phát hiện Va chạm)**.
* **Cách hoạt động:**
    1.  Thư viện bản đồ tính toán "hộp bao" (bounding box) tính bằng pixel cho mỗi Cluster và Single Marker.
    2.  Nó lặp qua danh sách, kiểm tra xem các "hộp" này có chồng lấn (overlap) không.
    3.  **Xử lý Xung đột:** Khi `Box A` va chạm với `Box B`:
        * Hệ thống so sánh `priority` của chúng (đã lấy từ Giai đoạn 0).
        * `if (A.priority < B.priority)`: Hiển thị A, Ẩn B.
        * `else`: Hiển thị B, Ẩn A.
        * (Nếu `priority` bằng nhau, nó có thể ẩn cả hai hoặc ẩn một cách ngẫu nhiên).
* **Output:** Một danh sách **cuối cùng** các đối tượng (clusters, markers) đã được lọc, đảm bảo không có đối tượng nào bị chồng lấn.

### 3.5. Giai đoạn 4: Hiển thị (Render)

* **Input:** Danh sách đã lọc từ Giai đoạn 3.
* **Hoạt động:** Thư viện bản đồ vẽ các đối tượng này lên màn hình. Toàn bộ pipeline (Giai đoạn 1-4) diễn ra trong mili giây, tạo cảm giác mượt mà cho người dùng.

---

## 4. Công cụ Kỹ thuật & Công nghệ

* **Backend (Giai đoạn 0):**
    * **PostGIS:** Lưu trữ POIs và trường `priority`.
    * **Tegola / Postile:** Các công cụ để tạo (serving) Vector Tiles (MVT) từ PostGIS.
* **Frontend (Pipeline Giai đoạn 1-4):**
    * **Mapbox GL JS:** Hỗ trợ **toàn bộ pipeline** (Giai đoạn 1-4) một cách tự nhiên (native). Nó tự động xử lý việc tải MVT, phân cụm (clustering), và khử chồng chéo (collision detection) dựa trên thuộc tính `priority` mà chúng ta cung cấp.
    * **Leaflet:** Yêu cầu plugin bên ngoài (ví dụ: `Leaflet.markercluster`) để xử lý Giai đoạn 2 (Clustering), nhưng việc khử chồng chéo (Giai đoạn 3) phức tạp hơn và không hiệu quả bằng Mapbox.