# Testing & Quality Control 
**Role:** Testing Lead (MSSV: 24127586)  
**Focus:** Quality Assurance, Integration Testing, and Performance Testing  
**Project:** Intelligent Travel Safety System with Weather and Disaster Warnings  

---

## I. Problem Definition  
Hệ thống “Intelligent Travel Safety System with Weather and Disaster Warnings” gồm nhiều module (Data, Risk Analysis, Alerting, Map, Chatbot, Offline Support) kết nối qua API  

Do đặc thù **PWA** (offline-first, service worker, push notification, client-side caching), rủi ro sai sót rất cao:  
- Dữ liệu trễ  
- Lỗi offline/online sync 

Là **Testing Lead**, tôi chịu trách nhiệm đảm bảo rằng:
- Toàn bộ module hoạt động ổn định, chính xác, và không có bug nghiêm trọng  
- Các API cảnh báo, bản đồ và rủi ro được tích hợp chính xác  
- Hệ thống vẫn hoạt động trơn tru trong điều kiện tải cao

Nếu không kiểm thử chặt chẽ:
- Người dùng có thể **không nhận cảnh báo đúng lúc** 
- API có thể **trả dữ liệu sai hoặc trễ**  
- Hệ thống có thể **sập hoặc đơ trong trường hợp khẩn cấp**

**Mục tiêu Testing & QC:**  
- Đảm bảo **độ chính xác ≥ 90%** cảnh báo đúng vùng  
- Thời gian phản hồi **≤ 5 giây** 
- Hệ thống chịu tải **5.000 user đồng thời** mà không crash
- Push notification delivery ≥ 90%  
- 100% bug được ghi nhận và theo dõi qua GitHub Issues  

---

## II. Decomposition  
#### 1. Test Case Design
- Viết test case cho 5 module: Data, Risk, Alert, Map, Offline. Mỗi test case gồm: ID, Mô tả, Input, Steps, Expected Result 
- Test PWA-specific: service worker caching, offline queue, push notification, IndexedDB sync, client-side rendering

#### 2. Integration Testing
- Mô phỏng pipeline `Weather API → Risk Processor → Alert Service → Map UI`
- PWA: offline → online sync, push notification → alert → map update 
- Kiểm tra dữ liệu, latency, và retry logic  

#### 3. Performance & Stress Testing
- Thiết kế kịch bản: 100, 1.000 và 5.000 người dùng
- **Client:** PWA startup time, JS execution, service worker registration, offline load  
- Theo dõi latency trung bình, error rate, throughput

#### 4. Bug Reporting & QC
- Viết template issue (Title, Steps, Expected, Actual, Severity, Browser/Device, Online/Offline state)
- Theo dõi trạng thái bug qua GitHub Issues  

---

## III. Timeline - Demo 7 ngày

| **Ngày** | **Mục tiêu** | **Công việc chính** | **Phối hợp với** |
|----------|--------------|-------------------|-----------------|
| **1** | Chuẩn bị & khởi động | - Thiết lập môi trường test (backend, PWA, data mock)<br>- Cấu hình tool quản lý test & bug<br>- Xác định phạm vi demo | PM|
| **2** | Hiểu hệ thống & requirements | - Thu thập yêu cầu, API spec, use-case diagram<br>- Xác định module & luồng dữ liệu online/offline | System Analyst |
| **3** | Lập kế hoạch test & chọn tool | - Viết Test Plan<br>- Chọn công cụ kiểm thử backend & PWA<br>- KPIs: accuracy, latency, load, offline reliability |  |
| **4** | Viết test case module | - Test case cho Data, Risk, Alert, Map, Offline<br>- Thêm test offline, service worker, push notification | Data & AI Devs |
| **5** | Kiểm thử tích hợp | - Mô phỏng flow API: Weather → Risk → Alert → Map<br>- Test offline → online sync, latency, retry, dữ liệu | API, Algorithm, UI/UX Devs |
| **6** | Stress & Performance Test | - Backend: 100 → 5k users<br>- Client: PWA startup, JS execution, service worker, offline load<br>- Lighthouse audit | AI Devs |
| **7** | Bug reporting & Demo QC | - Tổng hợp lỗi & tạo template issue (browser, device, offline/online)<br>- Theo dõi bug trên GitHub<br>- Chuẩn bị demo & báo cáo chất lượng cuối | Toàn nhóm |


## IV. Tools Justification

| **Mục** | **Công cụ chọn** | **Lý do chọn** | **Tối ưu hơn** |
|---------|-----------------|----------------|----------------|
| API Testing & Validation | **Postman** | Dễ dùng, trực quan, hỗ trợ Collection và mock API, không cần code | Nhanh hơn Insomnia, không cần setup phức tạp như WireMock |
| Unit & Integration Testing Backend | **pytest** | Cú pháp ngắn, plugin mạnh, dễ viết test logic & giả lập API | Ngắn gọn hơn unittest, dễ tích hợp CI/CD |
| Unit & Integration Testing PWA | **Jest + Testing Library** | Test component, service worker, offline cache, push notification | Thích hợp frontend hơn pytest |
| E2E Testing | **Cypress / Playwright** | Test flow offline → online, push notification, map update, UI interaction | Không thể làm được chỉ với pytest |
| Performance & Stress Testing | **k6 + Lighthouse** | K6: simulate concurrent users; Lighthouse: PWA metrics, offline, best practices | Nhẹ hơn JMeter, đo được client-side PWA performance |
| Bug Tracking & Quality Process | **GitHub Issues** | Tích hợp trực tiếp với repo, quản lý bug & PR, dễ sử dụng | Nhẹ hơn Jira, dễ theo dõi cho nhóm nhỏ |
| Documentation & Collaboration | **Markdown (.md)** | Gọn nhẹ, lưu trực tiếp trong repo, hỗ trợ GitHub Preview | Version control tốt hơn Google Docs |