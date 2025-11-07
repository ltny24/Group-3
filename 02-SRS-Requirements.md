# 02. Đặc Tả Yêu Cầu Phần Mềm (Software Requirement Specification - SRS 2.1)

**Dự án:** Intelligent Travel Safety System: Weather and Disaster Warnings  
**Tài liệu Mẹ:** 01-System-Analyst-Overview.md  
**Người xây dựng:** System Analyst (Như Ý)

---

## I. GIỚI THIỆU (INTRODUCTION)

| Mục | Phân tích chi tiết |
|-----|--------------------|
| **Mục đích Tài liệu** | Nêu rõ SRS là cơ sở cho design, implementation, testing và verification. Đây là nơi đội phát triển, tester và stakeholder dựa vào để đánh giá hoàn thành yêu cầu. |
| **Phạm vi Hệ thống** | Hệ thống chỉ tập trung vào an toàn du lịch, cảnh báo thiên tai, và đánh giá rủi ro. Không bao gồm dịch vụ thương mại (booking, payment, đặt vé). Điều này giúp giới hạn phạm vi project để tránh scope creep. |
| **Đầu vào/Đầu ra Hệ thống** | **Đầu vào:** Dữ liệu thời gian thực từ ít nhất 3 nguồn API ngoài (VD: NOAA, Meteostat) dưới định dạng JSON hoặc GeoJSON.<br>**Đầu ra:** Cảnh báo qua Push Notification và Dữ liệu bản đồ (Vector Tiles). |

### I.1. Tài liệu Liên quan (Reference Documents)

- **01-System-Analyst-Overview.md:** Tổng quan vai trò và cấu trúc dự án  
- **03-System-Architecture.md:** Thiết kế Kiến trúc hệ thống, ERD, DFD  
- **04-API-Specification.md:** Đặc tả chi tiết các API Endpoint (OpenAPI/Swagger)

### I.2. Thuật ngữ và Định nghĩa (Glossary)

| Thuật ngữ | Định nghĩa |
|------------|------------|
| **Safety Score (S)** | Điểm số an toàn dựa trên AI (0–100) để đánh giá mức độ rủi ro tại một khu vực. |
| **Geo-fencing** | Kỹ thuật xác định vị trí người dùng nằm trong một vùng địa lý đã định trước (polygon). |
| **Circuit Breaker** | Cơ chế chống lỗi (fail-fast) để ngăn chặn gọi lặp lại một dịch vụ bị lỗi. |
| **RTO/RPO** | Recovery Time/Point Objective: Mục tiêu thời gian và điểm dữ liệu phục hồi sau thảm họa. |

---

## II. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS - FR)

###  FR1: Module Cảnh báo & Thông báo (Alert Hub)

| ID | Tên Yêu cầu | Mô tả Chi tiết | Tiêu chuẩn Kỹ thuật | Phụ trách Chính |
|----|--------------|----------------|----------------------|----------------|
| **FR1.1** | Xác thực Nguồn Dữ liệu & Fail-safe | Nếu dữ liệu lỗi hoặc không xác thực được, hệ thống phải Log lỗi và không phát thông báo (fail-safe). | Sử dụng API Key Validation và kiểm tra schema JSON bắt buộc. | Data Engineer |
| **FR1.2** | Thông báo Đẩy (Push Notification) | Hỗ trợ đa ngôn ngữ và múi giờ (Timezone) của người dùng. | Sử dụng Web Push API thông qua Service Workers để gửi thông báo. Phải có chính sách Retry nếu gửi thất bại. | Backend Dev, UI/UX |
| **FR1.3** | Phân loại Nguy hiểm | Phân loại 4 cấp: Đỏ (Cao), Cam (Trung bình), Vàng (Thấp), Xanh (Thông tin). | Hiển thị kèm Icon hoặc Âm thanh riêng cho mỗi cấp độ (UX). | Backend Dev |
| **FR1.4** | Lọc Địa lý (Geo-fencing) | Thông báo chỉ được gửi đến người dùng nằm trong Phạm vi Ảnh hưởng (polygon). | Sử dụng truy vấn không gian (Spatial Query) với PostGIS hoặc MongoDB Geospatial. | Algorithm Designer |
| **FR1.5** | Quản lý Vị trí Lưu trữ | Cho phép người dùng lưu trữ tối đa 5 vị trí quan tâm. | Dữ liệu phải được mã hóa (AES-256 hoặc SHA256). | UI/UX, Backend Dev |

---

###  FR2: Module Đánh giá Rủi ro (AI Risk Evaluation)

| ID | Tên Yêu cầu | Mô tả Chi tiết | Tiêu chuẩn Kỹ thuật | Phụ trách Chính |
|----|--------------|----------------|----------------------|----------------|
| **FR2.1** | Công thức Safety Score | Safety Score (S) được tính bằng mô hình AI. Ngưỡng cảnh báo: S < 30. | Regression/Neural Network (TensorFlow/PyTorch). | AI Developer 2 |
| **FR2.2** | Đầu vào Mô hình AI | Dữ liệu phải chuẩn hóa (Z-score/Min-Max). | File training: .pkl hoặc .csv. | AI Developer 2, Data Engineer |
| **FR2.3** | Cập nhật & Cache Kết quả | Safety Score được cache cho khu vực truy cập cao. TTL = 15 phút. | Redis hoặc Memcached. | Data Engineer |

---

###  FR3: Bản đồ An toàn Tương tác (Interactive Safety Map)

| ID | Tên Yêu cầu | Mô tả Chi tiết | Tiêu chuẩn Kỹ thuật | Phụ trách Chính |
|----|--------------|----------------|----------------------|----------------|
| **FR3.1** | Tô màu Vùng Rủi ro | Bản đồ tô màu 3 mức rủi ro, tuân thủ Accessibility. | Màu: Đỏ `#FF0000`, Cam `#FF8C00`. | Algorithm Designer |
| **FR3.2** | Tối ưu Hiển thị POI | Hiển thị POI khi Zoom > 12. | Lazy Loading/Pagination. | Algorithm Designer, UI/UX |
| **FR3.3** | Tính toán Khoảng cách | Khoảng cách đường chim bay giữa người dùng và POI. | Haversine formula. | Backend Dev |

---

###  FR4: SOS Khẩn cấp (Quick SOS Screen)

| ID | Tên Yêu cầu | Mô tả Chi tiết | Tiêu chuẩn Kỹ thuật | Phụ trách Chính |
|----|--------------|----------------|----------------------|----------------|
| **FR4.1** | Gửi Thông tin Khẩn cấp | Gửi Vị trí hiện tại (GPS), tình trạng pin, và mã nhận dạng đến 3 số khẩn cấp được cài đặt trước| Độ trễ chấp nhận tối đa: $\le 5$ giây sau khi nhấn nút SOS. Kênh gửi: Web Push Notification (fallback SMS/Email). Nếu mất mạng, App phải lưu queue (Service Worker) và gửi lại. | Backend Dev |
| **FR4.2** | Xác thực Quyền truy cập | Kiểm tra quyền GPS, Pin, Danh bạ. | Tuân thủ các quy tắc cấp quyền của trình duyệt (Browser Permission API) và các tiêu chuẩn cài đặt PWA (Web Manifest, Service Worker).| UI/UX |

---

## III. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

### 3.1. NFR1: Hiệu năng (Performance)

| ID | Tiêu chí | Đặc tả Chi tiết |
|----|-----------|----------------|
| **NFR1.1** | Độ trễ API | GET /safety/score < 500ms (P95). |
| **NFR1.2** | Tốc độ Cảnh báo | Push Notification < 60s sau khi nhận dữ liệu ngoài. |
| **NFR1.3** | Thông lượng | 500 Requests/Second. |
| **NFR1.4** | Kiểm thử Hiệu năng | JMeter hoặc Gatling để xác minh. |

### 3.2. NFR2: Độ tin cậy và Khả dụng (Reliability & Availability)

| ID | Tiêu chí | Đặc tả Chi tiết |
|----|-----------|----------------|
| **NFR2.1** | Thời gian Hoạt động | 99.9% uptime. |
| **NFR2.2** | Sao lưu & Phục hồi | Backup 12h/lần, RTO ≤ 1h, RPO ≤ 30m. |
| **NFR2.3** | Hạn mức Thất bại | Có Circuit Breaker tránh lặp lỗi API ngoài. |

### 3.3. NFR3: Bảo mật (Security)

| ID | Tiêu chí | Đặc tả Chi tiết |
|----|-----------|----------------|
| **NFR3.1** | Mã hóa Dữ liệu | AES-256 khi lưu trữ. |
| **NFR3.2** | Quản lý Session | JWT, Token Expiry ≤ 2h. |
| **NFR3.3** | Lưu trữ Log Bảo mật | Giữ tối thiểu 90 ngày. |

### 3.4. NFR4: Khả năng Mở rộng và Bảo trì (Scalability & Maintainability)

| ID | Tiêu chí | Đặc tả Chi tiết |
|----|-----------|----------------|
| **NFR4.1** | Kiến trúc & CI/CD | Microservices, main branch protected, auto-deploy staging. |
| **NFR4.2** | Tài liệu API | Theo chuẩn OpenAPI (Swagger). |
| **NFR4.3** | Độ bao phủ Test | Unit Test Coverage ≥ 80%. |

---

## IV. BỔ SUNG & MỞ RỘNG (APPENDICES)

### 4.1. Giả định và Phụ thuộc (Assumptions and Dependencies)

| ID | Loại | Mô tả Giả định |
|----|------|----------------|
| **AS-01** | Phụ thuộc Ngoài | API ngoài phản hồi < 5s, uptime ≥ 98%. |
| **AS-02** | Người dùng | Có kết nối mạng (≥ 3G). |
| **AS-03** | GPS | Người dùng cho phép truy cập dịch vụ định vị. |

---

### 4.2. Khả năng Mở rộng Tương lai (Future Enhancements)

| ID | Tính năng Đề xuất | Mục tiêu | Ghi chú |
|----|--------------------|-----------|--------|
| **FE-01** | Phân tích Hành trình | Cho phép nhập hành trình để AI đánh giá rủi ro toàn tuyến. | - |
| **FE-02** | AI Học theo Cá nhân | AI học theo phản ứng người dùng để cá nhân hóa cảnh báo. | Tuân thủ GDPR. |
| **FE-03** | Tích hợp Thanh toán | Cho phép mua Premium (không quảng cáo, cảnh báo nâng cao). | - |

---

### 4.3. Ma trận Truy vết Tổng hợp (Traceability Matrix Summary)

| Yêu cầu (FR) | Module Chính | Kế thừa từ SRS | Ảnh hưởng đến Tài liệu | Trace ID |
|---------------|---------------|----------------|------------------------|-----------|
| **FR1.4 (Geo-fencing)** | Alert Hub, DB | NFR4.2 (Spatial Query) | 03-Architecture.md (ERD/PostGIS) | T-001 |
| **FR2.1 (Safety Score)** | AI Engine | NFR2.3 (AI Accuracy) | 03-Architecture.md (DFD/Luồng AI) | T-002 |
| **FR4.1 (SOS)** | SOS Service | NFR3.2 (Session Management) | 04-API-Specification.md (/sos endpoint) | T-003 |
| **FR3.2 (POI Tối ưu)** | Map Frontend | NFR1.3 (Throughput) | 04-API-Specification.md (/map/poi endpoint) | T-004 |
| **FE-02 (AI Cá nhân)** | AI Engine | FR2.1 (Safety Score Logic) | 03-Architecture.md (Data Lake) | T-005 |
