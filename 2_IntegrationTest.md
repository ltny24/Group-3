# KIỂM THỬ TÍCH HỢP (E2E & Hệ thống con) 

## 1. Luồng tích hợp chính (Core Pipeline)

**Flow:** `Weather API → Risk Processor → Alert Service → Map UI`

| ID | Mô tả | Các bước | Kết quả mong đợi | Mức độ ưu tiên |
|----|------|----------|-----------------|----------------|
| INT-001 | Kiểm tra end-to-end cảnh báo Critical | 1. **Weather API** trả dữ liệu `Bão Cấp 10`<br>2. **Risk Processor** tính toán `Risk Score $\ge 8/10`<br>3. **Alert Service** gửi Push Notification<br>4. **Map UI** nhận và cập nhật layer rủi ro | Nhận cảnh báo **Critical** trên thiết bị ($\le 5s$ tổng thời gian phản hồi). Map hiển thị đúng **vị trí và màu rủi ro** (Đỏ). | Critical |
| INT-002 | Offline → Online sync dữ liệu và cảnh báo | 1. Chuyển thiết bị **offline**<br>2. **Risk Processor** tính toán risk mới (Alert Service không thể gửi)<br>3. Chuyển thiết bị **online** | **Cảnh báo** bị giữ lại được gửi thành công. **Map UI** cập nhật layer rủi ro mới. **Không mất dữ liệu cảnh báo**. | Critical |
| INT-003 | Kiểm tra cơ chế retry API Risk (Tự phục hồi) | 1. **Risk Processor API** cố tình thất bại (ví dụ: HTTP 500)<br>2. Chờ cơ chế **Retry tự động** (ví dụ: sau 5s)<br>3. Risk Processor trả request thành công | Request thành công sau retry. **Alert & Map được cập nhật** chính xác. Latency tổng thể $\le$ 10s (do có retry). | High |
| INT-004 | Kiểm tra độ trễ toàn bộ (End-to-End Latency) | 1. Trigger flow **Weather → Risk → Alert** (Không lỗi)<br>2. Đo tổng thời gian từ Weather API đến khi Map UI cập nhật | Tổng thời gian phản hồi (P95 Latency) $\mathbf{\le 5 \text{ giây}}$. Push notification delivery $\ge 90\%$. | Critical |

---

## 2. Tích hợp đặc thù PWA (Offline/Service Worker)

| ID | Mô tả | Các bước | Kết quả mong đợi | Mức độ ưu tiên |
|----|------|----------|-----------------|----------------|
| PWA-001 | Caching Service Worker và Asset Integrity | 1. Load app online lần đầu<br>2. Reload app **offline**<br>3. Click vào các trang khác | App hoạt động offline, UI hiển thị đúng, **không có lỗi Network**. Dữ liệu cache (Service Worker) chính xác. | Critical |
| PWA-002 | Hàng đợi Push Notification (Background Sync API) | 1. Kích hoạt cảnh báo **offline**<br>2. **Alert Service** lưu vào hàng đợi<br>3. **Reconnect** | Notification được gửi thành công ngay sau khi reconnect. Log server xác nhận đã nhận request. | High |
| PWA-003 | Đồng bộ dữ liệu IndexedDB (Offline Data Sync) | 1. Nhập dữ liệu **offline** (ví dụ: tạo một ghi chú)<br>2. Kiểm tra dữ liệu được lưu trong IndexedDB<br>3. **Reconnect** | Dữ liệu đồng bộ lên server chính xác. Dữ liệu trong IndexedDB chuyển trạng thái `Synced`. | Critical |
| PWA-004 | Render bản đồ client-side và Cache Data Layer | 1. Load map online (cache tiles và 1 layer rủi ro cũ)<br>2. Chuyển **offline**, load lại map | Map hiển thị đúng **các layer đã cache** (Base map tiles) và **dữ liệu rủi ro gần nhất** đã được IndexedDB lưu trữ. | Medium |