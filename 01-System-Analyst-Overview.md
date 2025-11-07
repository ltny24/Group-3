#  Vai Trò & Tổng Quan Hệ Thống: System Analyst

**Người thực hiện:** Lê Thị Như Ý

**Phân nhánh (Git Branch):** `system-analyst-requirements(24127595)`

**Trọng tâm Giai đoạn:** Design & Specification Phase Lead (Lãnh đạo Giai đoạn Thiết kế và Đặc tả)

---

## 1.  Định Nghĩa Vấn Đề (Problem Definition) - Góc nhìn System Analyst

Vấn đề cốt lõi mà vai trò System Analyst cần giải quyết là **Nguy cơ Mất đồng bộ Kỹ thuật (Technical Misalignment Risk)** và **Sự Phân mảnh Thông tin** do thiếu một bộ tài liệu thiết kế kỹ thuật thống nhất và không thể hiểu sai. Sự thiếu hụt này làm tăng rủi ro về chi phí và thời gian phát triển.

### 1.1. Các Rủi ro Kỹ thuật do Thiếu Thiết kế Chuẩn:

| Rủi ro Kỹ thuật | Tác động Lên Dự án | Hệ quả Nghiêm trọng |
| :--- | :--- | :--- |
| **Ambiguity & Scope Creep** | **Lãng phí tới 40%** thời gian phát triển do yêu cầu thay đổi liên tục. | Gây lãng phí nguồn lực của Backend và UI/UX. |
| **Data Inconsistency** | **Data Engineer** và **AI Developer** sử dụng các định nghĩa dữ liệu khác nhau. | Mô hình AI hoạt động sai lệch hoặc thất bại trong quá trình tích hợp dữ liệu (ETL). |
| **Integration Failure** | Lỗi giao tiếp giữa các dịch vụ do API không được định nghĩa rõ ràng. | Chậm trễ lớn trong quá trình Tích hợp và Kiểm thử. |

### 1.2. Mục tiêu Chiến lược của Vai trò SA:

1.  **Chuyển giao Ngôn ngữ:** Dịch thuật 100% yêu cầu nghiệp vụ thành đặc tả kỹ thuật **không thể hiểu sai** qua tài liệu **SRS**.
2.  **Thiết lập Nền tảng:** Cung cấp mô hình kiến trúc và dữ liệu chuẩn (**DFD, ERD**) làm cơ sở xây dựng cho các đội Data và Backend.
3.  **Đảm bảo Giao tiếp:** Xây dựng **04-API-Specification.md** làm chuẩn mực duy nhất và đầy đủ cho mọi tương tác API.

---

## 2.  Phân Tách Công Việc & Mối quan hệ Tài liệu (Decomposition & Traceability)


Công việc của System Analyst được phân tách thành 3 giai đoạn thiết kế chính, tạo ra các đầu ra có tính **truy vết (Traceability)** cao. Các đầu ra này là hợp đồng kỹ thuật bắt buộc cho các đội phát triển (Development Teams).

---
* **Mục tiêu:** Đảm bảo rằng mọi **API Endpoint** trong `04-API-Specification.md` đều có thể được truy vết ngược về một **Yêu cầu Chức năng (FR)** cụ thể trong `02-SRS-Requirements.md`.
### 2.1. Giai đoạn 1: Phân tích Nhu cầu (Requirements Analysis)

| Tài liệu Output | Kỹ thuật Phân tích | Nhiệm vụ Chi tiết | Mục đích Trọng tâm |
| :--- | :--- | :--- | :--- |
| **02-SRS-Requirements.md** | **MoSCoW Method** (Phân loại yêu cầu), **Benchmarking**, **Stakeholder Interviews**. | Định nghĩa toàn bộ **Yêu cầu Chức năng (FR)** và **Yêu cầu Phi Chức năng (NFR)**, bao gồm cả tiêu chuẩn hiệu năng và bảo mật. | Thiết lập **phạm vi (Scope)** chính xác của dự án, tránh hiện tượng Scope Creep (yêu cầu phát sinh). |

### 2.2. Giai đoạn 2: Thiết kế Cấu trúc (Architectural Design)

| Tài liệu Output | Kỹ thuật Thiết kế | Nhiệm vụ Chi tiết | Mối quan hệ Truy vết |
| :--- | :--- | :--- | :--- |
| **03-System-Architecture.md** | **Functional Decomposition** (Phân rã chức năng), **Context Modeling**, **UML** (Use-Case Diagram). | Xây dựng **DFD** (Luồng xử lý dữ liệu), **ERD** (Mô hình Database Schema), và **Sơ đồ Use-Case** (Kịch bản tương tác). | **Kế thừa** các thực thể dữ liệu (Entities) và luồng xử lý từ các yêu cầu chức năng (FRs) trong **02-SRS**. |

### 2.3. Giai đoạn 3: Đặc tả Kỹ thuật (Technical Specification)

| Tài liệu Output | Kỹ thuật Đặc tả | Nhiệm vụ Chi tiết | Mối quan hệ Kế thừa |
| :--- | :--- | :--- | :--- |
| **04-API-Specification.md** | **OpenAPI/Swagger Standards**, **JSON Schema Definition**, **HTTP Status Codes Standardization**. | Định nghĩa chi tiết các **API Endpoint** (URI, Method, Status Code), và cấu trúc dữ liệu **Request/Response JSON Schema**. | **Kế thừa** các bảng (Tables) từ **ERD** (`03-Architecture`) để định nghĩa trường dữ liệu JSON chính xác. |

---

### Mối quan hệ Kế thừa (Traceability Flow)

Mỗi giai đoạn là đầu vào bắt buộc, đảm bảo tính nhất quán từ yêu cầu đến chi tiết kỹ thuật:

> $$\mathbf{SRS} \xrightarrow{\text{Định nghĩa Data}} \mathbf{Architecture} \xrightarrow{\text{Định nghĩa Schema}} \mathbf{API\ Spec}$$

* **Mục tiêu:** Đảm bảo rằng mọi **API Endpoint** trong `04-API-Specification.md` đều có thể được truy vết ngược về một **Yêu cầu Chức năng (FR)** cụ thể trong `02-SRS-Requirements.md`.
Công việc được phân tách thành 3 tài liệu chính có mối quan hệ **Kế thừa (Traceability)** chặt chẽ. Mỗi tài liệu là đầu vào bắt buộc cho giai đoạn tiếp theo.


## 3.  Lịch Trình (Timeline) - Tối ưu hóa 1 Tuần (7 Ngày)

Tiến độ được nén chặt và giám sát theo ngày, tập trung vào việc tạo ra các đầu ra thiết kế chất lượng cao nhất.

| Ngày | Mục tiêu Công việc | Hoạt động Trọng tâm (Focus Activities) | Deliverables (Kết quả) |
| :--- | :--- | :--- | :--- |
| **Day 1-2** | **Phân tích Yêu cầu Chuyên sâu** | Phân tích nghiệp vụ, định nghĩa Scope/Out-of-Scope. Viết toàn bộ Yêu cầu Chức năng (FR) và Phi Chức năng (NFR). | **02-SRS-Requirements.md** (90% Hoàn thành). |
| **Day 3-4** | **Thiết kế Mô hình Dữ liệu và Luồng** | Thiết kế **ERD** (Database Schema) và **DFD** (Luồng dữ liệu) chi tiết. Vẽ sơ đồ Use-Case. | **03-System-Architecture.md** (Final Draft). |
| **Day 5-6** | **Đặc tả API Kỹ thuật** | Định nghĩa tất cả các API Endpoint (Alerts, Safety Score, Map Data) và cấu trúc Request/Response JSON chuẩn theo OpenAPI/Swagger. | **04-API-Specification.md** (90% Hoàn thành). |
| **Day 7** | **Tổng hợp & Ban hành Chính thức** | Finalize (kiểm tra lần cuối) tất cả các tài liệu. Tạo **Merge Request (MR)** để ban hành. | **Ban hành Chính thức các file 02, 03, 04.** |


---

## 4.  Công Cụ và Kỹ Thuật (Tools & Workflow)

### 4.1. Công cụ Cốt lõi cho Thiết kế

* **Draw.io / Lucidchart:** Công cụ thiết kế sơ đồ tiêu chuẩn cho **DFD** (Data Flow Diagram) và **ERD** (Entity-Relationship Diagram).
* **OpenAPI/Swagger:** Sử dụng để viết đặc tả API theo chuẩn kỹ thuật thống nhất, tạo tài liệu API tương tác.
* **Markdown:** Định dạng tiêu chuẩn cho tất cả các tài liệu dự án để dễ dàng đọc và quản lý phiên bản trên Git.

### 4.2.  Phương pháp Quản lý Tài liệu (Using Git/GitHub)

* **Kiểm soát Phiên bản:** Sử dụng **Git** để theo dõi lịch sử thay đổi của tài liệu.
* **Tên Branch Chuẩn:** Luôn làm việc trên nhánh `system-analyst-requirements(24127595)`.
* **Quy trình Phê duyệt:** Mọi thay đổi lớn trên tài liệu đều phải được thực hiện thông qua **Merge Request (MR)** và được phê duyệt trước khi Merge vào nhánh chính.
