# KIỂM THỬ HIỆU NĂNG & LOAD (Performance & Stress Test)

## 1. Các kịch bản & Mục tiêu (KPIs)

| ID | Mô tả | Số người dùng (Concurrent) | Các bước | Chỉ số đo lường & Mục tiêu | Công cụ chính |
|----|------|---------------------------|----------|---------------------------|---------------|
| PERF-001 | Startup & JS execution (Client-side) | 1 | Load PWA lần đầu (Cold Start) | **Startup $\le 3s$ (Time to Interactive)**. JS execution $\le 2s$. CPU usage $\le 50\%$. | Lighthouse |
| PERF-002 | Service Worker Registration & Load Time | 1 | Load PWA đã cache (Service Worker Active) | Registration $\le 1s$. **Load PWA (Warm Start) $\le 1.5s$** | Lighthouse |
| PERF-003 | Offline Load Performance | 1 | Chuyển offline, load app đã cache | Load $\mathbf{\le 2s}$, không có lỗi mạng (Network Errors), **Toàn bộ giao diện hiển thị**. | Lighthouse |
| PERF-004 | Lighthouse Audit (PWA Metrics) | 1 | Chạy Lighthouse trên Production/Staging Build | **Score $\ge 90$** cho Performance, Best Practices, Accessibility, và PWA (Offline, Installability). | Lighthouse |
| STRESS-001 | Backend Load Test (Medium) | 100 | Gửi request `Weather API` $\to$ `Risk API` đồng thời (trong 10 phút) | **Latency (P95) $\le 5s$**. Throughput $\ge 150$ request/giây. **Error rate $< 1\%$**. | k6 |
| STRESS-002 | Backend Load Test (High) | 1.000 | Gửi request `Weather API` $\to$ `Risk API` đồng thời (trong 10 phút) | **Latency (P95) $\le 5s$**. Throughput $\ge 500$ request/giây. **Error rate $< 2\%$**. | k6 |
| STRESS-003 | Backend Stress Test (Peak Load) | 5.000 | Gửi request `Weather API` $\to$ `Risk API` đồng thời (Tăng dần/Ramp-up) | **Latency (P95) $\le 8s$**. Hệ thống **ổn định**, **không crash** trong suốt 30 phút. Max CPU/Memory usage $< 80\%$. | k6 |
| STRESS-004 | Alert Service Concurrency | 500 | Kích hoạt Alert Service đồng thời với dữ liệu cảnh báo khác nhau | **Push Notification Delivery Rate $\ge 90\%$**. Latency Alert $\le 2s$. | k6 |

---

## 2. Công cụ kiểm thử

* **k6:** Công cụ chính để mô phỏng load backend API (Stress Test).
* **Lighthouse:** Công cụ chính để đánh giá PWA (offline, performance, best practices).
* **Browser DevTools (Network/Performance Tab):** Đo đạc chi tiết Client-side Performance và Latency.