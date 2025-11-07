# QUY TRÌNH BÁO LỖI & QUẢN LÝ CHẤT LƯỢNG (QC Workflow) 

## 1. Template Báo lỗi Chuẩn (GitHub Issue)

**Tiêu đề:** `[Module: Data/Risk/Alert/Map/PWA] Mô tả ngắn gọn, rõ ràng lỗi`

**Ví dụ:** `[Alert] Push notification không gửi khi Risk Score >= 8`

---

#### Các bước tái tạo lỗi (Steps to Reproduce):

Liệt kê **chính xác từng hành động** thực hiện để lỗi xảy ra.

1.  ...
2.  ...
3.  ...

**Lưu ý quan trọng (Để hỗ trợ Debug PWA):**
* Chỉ ra rõ trạng thái **Online/Offline** tại bước xảy ra lỗi.
* Thiết bị và OS (ví dụ: Chrome 120/Android 14) được sử dụng.

#### Kết quả mong đợi (Expected Result):

* Mô tả hành vi đúng của hệ thống.

    Ví dụ: `Hệ thống phải gửi push notification trong vòng 5 giây.`

#### Kết quả thực tế (Actual Result):

* Mô tả hành vi sai của hệ thống.

   Ví dụ: `Không nhận được push notification, hoặc nhận được sau 15 giây.`

#### Mức độ nghiêm trọng (Severity - BẮT BUỘC):

* **Critical:** Lỗi làm crash hệ thống, mất dữ liệu, hoặc ảnh hưởng đến tính năng cốt lõi.
* **High:** Lỗi ảnh hưởng nghiêm trọng đến trải nghiệm người dùng, có thể bị workaround.
* **Medium:** Lỗi nhỏ về logic, UI/UX không hoàn hảo.
* **Low:** Lỗi chính tả, lỗi giao diện nhỏ, không ảnh hưởng chức năng.

#### Môi trường (Environment - Chi tiết):

* **Browser / OS / Device:** (ví dụ: Chrome 120 / Android 14 / Samsung S23)
* **Online / Offline State:** (Ví dụ: Offline khi lỗi xảy ra, Online khi reconnect)
* **Network Speed:** (Nếu cần)

#### Đính kèm (Attachments):

* Screenshot / video tái tạo lỗi
* Log (Console log, Network log, Server log)

---

## 2. Quy trình Xử lý & Theo dõi Lỗi (GitHub Issues Workflow)

1.  **Phát hiện lỗi:** Tester phát hiện lỗi trong quá trình test (Unit/Integration/Performance).
2.  **Tạo GitHub Issue:** Tester tạo Issue với **template chuẩn** và thêm tag **`Bug`**.
3.  **Phân loại & Gán:** Testing Lead (hoặc QA Manager) xác định **Mức độ nghiêm trọng**, gán Issue cho **Developer** phụ trách Module, và thêm vào **Project Board**.
4.  **Theo dõi tiến độ:**
    * **Open:** Lỗi mới được tạo.
    * **In Progress:** Developer bắt đầu sửa lỗi.
    * **Fixed:** Developer đã sửa và gán lại cho Tester.
    * **Verified:** Tester đã kiểm tra fix và xác nhận lỗi không còn, không phát sinh lỗi mới (Regression Test).
    * **Closed:** Lỗi đã được giải quyết hoàn toàn.
5.  **Kiểm tra Fix:** Sau khi developer cập nhật code, Tester thực hiện **Regression Test** để đảm bảo không ảnh hưởng chức năng khác.
6.  **Cập nhật Tài liệu:** Nếu lỗi là do sai logic hoặc thiếu yêu cầu, tài liệu **Technical Design / Requirements** cần được cập nhật.