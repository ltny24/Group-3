# README: Module Đánh giá Rủi ro AI (ai-risk-evaluation)

## 1. 🎯 Mục tiêu và Vai trò

* **Dự án:** Ứng dụng Cảnh báo Thời tiết & Thiên tai Du lịch
* **Module:** `ai-risk-evaluation`
* **Người thực hiện:** AI Developer 2

Nhiệm vụ của module `ai-risk-evaluation` là đóng vai trò **"Bộ não Logic"** trung tâm của toàn bộ hệ thống. Module này chịu trách nhiệm:

1.  Tiếp nhận dữ liệu thô (thời tiết, GIS) từ **Data Engineer** và dữ liệu dự đoán (bão, lũ) từ **AI Developer 1**.
2.  Phát triển và áp dụng các thuật toán (Rules/Fuzzy Logic) để **phân loại** mức độ rủi ro cho từng loại thiên tai.
3.  Tính toán một "Safety Score" tổng hợp (thông qua **Thuật toán Ưu tiên**) để xác định `Rủi_ro_Chung` (Cao / Trung bình / Thấp).
4.  Cung cấp một API đầu ra (Output) rõ ràng cho **Algorithm Designer** (tô màu bản đồ) và **UI/UX Developer** (hiển thị cảnh báo).

---

## 2. 🧩 Phân rã Công việc (Work Breakdown Structure)

Đây là breakdown chi tiết các task nhỏ cần thực hiện để hoàn thành module này.

### 2.1. Giai đoạn 1: Thiết kế & Thiết lập
* **1.1. Họp định nghĩa API (API Definition):**
    * *Task:* Làm việc với Data Engineer và AI Dev 1 để chốt cấu trúc dữ liệu **Input** (chính xác các trường dữ liệu module sẽ nhận).
    * *Task:* Làm việc với Algorithm Designer và UI/UX Dev để chốt cấu trúc dữ liệu **Output** (JSON response).
* **1.2. Thiết lập Môi trường:**
    * *Task:* Cài đặt môi trường Python (virtual environment).
    * *Task:* Cài đặt framework API (ví dụ: FastAPI) để xây dựng module.
    * *Task:* Cài đặt thư viện logic (ví dụ: `scikit-fuzzy`) để triển khai thuật toán.
* **1.3. Thiết kế Cấu trúc Mã nguồn (Codebase):**
    * *Task:* Tạo cấu trúc thư mục cho dự án (ví dụ: /rules, /models, /api).
    * *Task:* Viết các lớp (class) hoặc module cơ sở cho dữ liệu Input và Output.

### 2.2. Giai đoạn 2: Phát triển Thuật toán Rủi ro Cá nhân (Lớp 1)
* **2.1. Rủi ro Địa lý (Geographical Risks):**
    * *Task:* Viết logic cho **Sạt lở (Landslide)**, kết hợp `Input.Mưa` + `Input.Độ_dốc`.
    * *Task:* Viết logic cho **Lũ quét (Flash Flood)**, kết hợp `Input.Mưa` + `Input.Khoảng_cách_sông`.
    * *Task:* Viết logic cho **Ngập lụt (Inundation)**, kết hợp `Input.Mưa` + `Input.Vùng_trũng_GIS`.
* **2.2. Rủi ro Khí tượng (Meteorological Risks):**
    * *Task:* Viết logic cho **Gió giật (Wind Gust)**, dựa trên ngưỡng `Input.Tốc_độ_gió`.
    * *Task:* Viết logic cho **Dông sét (Lightning)**, dựa trên `Input.API_Sét` (từ AI Dev 1 hoặc Data Engineer).
    * *Task:* Viết logic cho **Nắng gắt (Heat Stroke)**, dựa trên `Input.Nhiệt_độ` và `Input.Độ_ẩm` (tính Heat Index).
* **2.3. Rủi ro Sự kiện (Event-based Risks):**
    * *Task:* Viết logic cho **Bão (Typhoon)**, dựa trên `Input.API_Bão.Nằm_trong_vùng` và `Input.API_Bão.Thời_gian`.
    * *Task:* Viết logic cho **Động đất (Earthquake)**, dựa trên `Input.Vùng_nguy_cơ_địa_chấn_tĩnh`.

### 2.3. Giai đoạn 3: Phát triển Thuật toán Tổng hợp (Lớp 2)
* **3.1. Viết Thuật toán Ưu tiên (Priority Aggregator):**
    * *Task:* Viết hàm (function) nhận đầu vào là 7 mức rủi ro (từ Giai đoạn 2).
    * *Task:* Xác định mức rủi ro cao nhất (ví dụ: "Cao").
    * *Task:* Trả về `Rủi_ro_Chung` và `Nguyên_nhân_Chính`.
* **3.2. Chuẩn hóa "Safety Score":**
    * *Task:* (Tùy chọn) Chuyển đổi các mức rủi ro thành một điểm số (ví dụ: Cao=10, Trung bình=5) nếu Algorithm Designer yêu cầu.

### 2.4. Giai đoạn 4: API, Tích hợp & Kiểm thử
* **4.1. Xây dựng API Endpoint:**
    * *Task:* Tạo API endpoint (ví dụ: `POST /api/v1/evaluate-risk`) nhận tọa độ `(lat, lon)` và trả về đối tượng JSON Output đã thống nhất.
* **4.2. Viết Kiểm thử Đơn vị (Unit Tests):**
    * *Task:* Tạo các file test cho *từng* thuật toán rủi ro (Giai đoạn 2) với dữ liệu giả (dummy data) để đảm bảo logic (ví dụ: Mưa 150mm + Dốc 30° *phải* trả về "Cao").
* **4.3. Tích hợp (Integration):**
    * *Task:* Kết nối API của module với nguồn cấp dữ liệu *thật* từ Data Engineer và AI Dev 1.
* **4.4. Viết Tài liệu (Documentation):**
    * *Task:* Viết tài liệu API (ví dụ: Swagger/OpenAPI) để hướng dẫn Algorithm Designer và UI/UX Dev cách gọi và sử dụng API của module.

---

## 3. 🛠️ Công cụ & Công nghệ (Tools)

Danh sách các công cụ được đề xuất cho riêng task `ai-risk-evaluation`:

* **Ngôn ngữ lập trình:** Python (v3.9+)
* **Framework API:** FastAPI (Khuyến nghị do tốc độ cao và tự động tạo tài liệu API) hoặc Flask.
* **Thư viện Logic:**
    * `scikit-fuzzy`: Thư viện chính để triển khai Fuzzy Logic, giúp các quy tắc `IF-THEN` trở nên mềm dẻo (ví dụ: "mưa *hơi* lớn" VÀ "dốc *hơi* cao").
    * `Pydantic`: Dùng chung với FastAPI để định nghĩa và xác thực (validate) mô hình dữ liệu Input/Output.
* **Kiểm thử:** `pytest`
* **Môi trường:** Docker (để đóng gói toàn bộ module logic thành một service độc lập).
* **Quản lý Mã nguồn:** Git