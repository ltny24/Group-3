# TEST CASES CHI TIẾT 

## 1. Module Data (API & Cache)

| ID | Mô tả | Input | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên |
|----|-------|-------|------------------|-----------------|----------------|
| DATA-001 | Kiểm tra API trả dữ liệu thời tiết cơ bản | Thành phố: "Hà Nội", Loại: Bão | 1. Gọi API thời tiết với key hợp lệ<br>2. Kiểm tra response code (200 OK)<br>3. Kiểm tra các trường dữ liệu | Response chứa nhiệt độ ($\pm 2^{\circ}C$), độ ẩm (0-100%), mã thời tiết (ví dụ: 'storm', 'rain'), và tọa độ (lat/lon) | High |
| DATA-002 | Kiểm tra dữ liệu cache offline chính xác | Thành phố: "Đà Nẵng", Network: Offline | 1. Load dữ liệu Đà Nẵng online<br>2. Chuyển sang chế độ offline<br>3. Truy xuất lại dữ liệu đã cache | Dữ liệu offline hiển thị **đúng** và **đầy đủ** các trường (nhiệt độ, mã thời tiết) như khi online. Load time $\le$ 2s | High |
| DATA-003 | Đồng bộ dữ liệu sau offline về server | Dữ liệu người dùng thay đổi offline (ví dụ: thay đổi cài đặt) | 1. Tắt mạng, thay đổi cài đặt<br>2. Bật mạng (online)<br>3. Kích hoạt sync (hoặc đợi auto-sync) | Dữ liệu được cập nhật thành công lên server. Module Risk nhận dữ liệu đúng (nếu có liên quan). **Không mất dữ liệu**. | Critical |

---

## 2. Module Risk (Tính toán và Ngưỡng)

| ID | Mô tả | Input | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên |
|----|-------|-------|------------------|-----------------|----------------|
| RISK-001 | Tính toán mức độ rủi ro thời tiết nghiêm trọng | Thời tiết: **Bão Cấp 10**; Khu vực: **Đông dân cư** | 1. Gọi Risk Processor với dữ liệu đầu vào<br>2. Nhận `risk_score` và `alert_level` | Risk score $\ge$ ngưỡng 8/10, kích hoạt cảnh báo loại **Critical**. Thời gian phản hồi $\le$ 2s | Critical |
| RISK-002 | Kiểm tra độ trễ API Risk trong điều kiện bình thường | Thời tiết: **Mưa nhẹ**; Khu vực: **Vùng ven** | 1. Gửi 100 request API Risk đồng thời<br>2. Đo thời gian phản hồi (P95 Latency) | Thời gian phản hồi trung bình $\le$ 2 giây. Error rate $\le$ 1% | High |
| RISK-003 | Kiểm tra tính toán rủi ro không nghiêm trọng | Thời tiết: **Nắng ráo**; Khu vực: **Bình thường** | 1. Gọi Risk Processor<br>2. Nhận `risk_score` | `Risk score < ngưỡng cảnh báo` (ví dụ: < 3/10), **không** kích hoạt Alert. | Medium |

---

## 3. Module Alert (Push Notification & Hàng đợi)

| ID | Mô tả | Input | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên |
|----|-------|-------|------------------|-----------------|----------------|
| ALERT-001 | Kiểm tra push notification end-to-end | Cảnh báo thời tiết nghiêm trọng (Trigger: RISK-001) | 1. Kích hoạt cảnh báo từ Alert Service<br>2. Kiểm tra nhận thông báo trên thiết bị thực/mô phỏng | Nhận thông báo **thành công** ($\ge 90\%$ tỉ lệ nhận). Độ trễ **≤ 5 giây** từ lúc trigger đến lúc nhận. Nội dung thông báo đúng. | Critical |
| ALERT-002 | Kiểm tra hàng đợi cảnh báo offline (PWA-Specific) | Cảnh báo khi offline (Trigger: RISK-001) | 1. Chuyển thiết bị/trình duyệt offline<br>2. Kích hoạt cảnh báo (Alert Service cố gắng gửi)<br>3. Bật mạng (online) | Thông báo được gửi thành công **sau khi kết nối** (Sử dụng Service Worker/IndexedDB queue). **Không mất cảnh báo**. | Critical |
| ALERT-003 | Kiểm tra định dạng và nội dung cảnh báo | Cảnh báo: Bão | 1. Trigger cảnh báo bão<br>2. Kiểm tra nội dung thông báo | Nội dung chứa: Loại cảnh báo (`Bão`), Mức độ (`Critical`), Vùng ảnh hưởng (`[Tên Tỉnh/Thành]`). Icon và màu sắc đúng. | High |

---

## 4. Module Map (Hiển thị rủi ro)

| ID | Mô tả | Input | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên |
|----|-------|-------|------------------|-----------------|----------------|
| MAP-001 | Hiển thị rủi ro trên bản đồ đúng vị trí/màu | Vị trí: Hà Nội (Risk Score: 8) | 1. Gọi API Map để lấy layer rủi ro<br>2. Render bản đồ trên Map UI | Bản đồ hiển thị **polygon/layer rủi ro** tại vị trí Hà Nội với **màu sắc tương ứng** với Risk Score 8 (ví dụ: Đỏ/Critical). | High |
| MAP-002 | Cập nhật bản đồ sau offline (IndexedDB Sync) | Thay đổi vị trí người dùng (offline), có cảnh báo mới | 1. Chuyển offline, di chuyển vị trí<br>2. Kết nối online, gọi API Map | Map cập nhật **vị trí mới** và hiển thị **layer rủi ro đúng** cho vị trí đó ngay lập tức (sau sync). | Critical |
| MAP-003 | Render bản đồ client-side với cache (PWA-Specific) | Load map offline | 1. Load bản đồ online (cache tiles)<br>2. Chuyển offline, reload trang | Map hiển thị **các layer đã cache** (Base map tiles) và **dữ liệu rủi ro** (nếu đã cache IndexedDB) | Medium |

---

## 5. Module Offline (PWA-Specific)

| ID | Mô tả | Input | Các bước thực hiện | Kết quả mong đợi | Mức độ ưu tiên |
|----|-------|-------|------------------|-----------------|----------------|
| OFF-001 | Kiểm tra caching Service Worker cơ bản | Tài nguyên PWA (HTML, CSS, JS, Assets) | 1. Load app online lần đầu tiên<br>2. Kiểm tra Service Worker đã đăng ký & cache<br>3. Reload app ở chế độ offline | Ứng dụng **hoạt động offline**, UI/UX hiển thị đúng, dữ liệu cache đầy đủ. Không có lỗi network. | Critical |
| OFF-002 | Đồng bộ dữ liệu IndexedDB lên server | Dữ liệu người dùng mới (ví dụ: tạo 1 điểm đánh dấu) | 1. Nhập/Tạo dữ liệu mới ở trạng thái offline<br>2. Kiểm tra IndexedDB<br>3. Bật mạng (online) | Dữ liệu được đồng bộ thành công lên server. Kiểm tra dữ liệu trên backend và IndexedDB đã xóa/cập nhật trạng thái sync. | Critical |
| OFF-003 | Tải lại (Reload) ứng dụng offline | App đã cache, đang offline | 1. Load app online, sau đó tắt mạng<br>2. Đóng và mở lại app (reload) | App load thành công $\le$ 2s. Toàn bộ tính năng cơ bản **hoạt động (read-only)**. | High |