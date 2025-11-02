#  Intelligent Travel Safety System: Weather and Disaster Warnings

**Intelligent Travel Safety System (ITSS)** là một hệ thống tiên tiến sử dụng **Trí tuệ Nhân tạo (AI)** để cung cấp thông tin thời tiết và cảnh báo thiên tai theo thời gian thực cho khách du lịch. Mục tiêu là nâng cao **mức độ an toàn** và giúp người dùng đưa ra quyết định di chuyển thông minh.

---

## 1. Problem Definition (Định nghĩa Vấn đề) và Phân tích Sâu 

### 1.1 Vấn đề Cốt lõi (The Core Problem)

Du khách, đặc biệt là những người di chuyển đến các khu vực xa lạ hoặc có biến động khí hậu cao, thường đối mặt với **khoảng cách thông tin (Information Gap)** về các mối nguy hiểm tiềm ẩn:
* **Thiếu Tính Kịp thời:** Thông báo cảnh báo thiên tai từ các nguồn chính phủ thường không được dịch thuật hoặc không đến tay du khách nước ngoài một cách kịp thời.
* **Thiếu Tính Bản địa hóa:** Các ứng dụng thời tiết truyền thống chỉ cung cấp dự báo chung, không có khả năng đánh giá **mức độ rủi ro cục bộ** (Local Hazard Score) tại vị trí chính xác của du khách.
* **Thiếu Khả năng Dự báo:** Khách du lịch cần biết rủi ro *sẽ* xảy ra, không chỉ rủi ro *đã* xảy ra. Điều này đòi hỏi các mô hình **dự báo dựa trên AI**.

### 1.2 Mục tiêu Giải pháp của ITSS

ITSS được thiết kế để giải quyết các vấn đề trên thông qua ba trụ cột chính:

| Trụ cột | Mô tả Giá trị (Value Proposition) | Công nghệ Chính |
| :--- | :--- | :--- |
| **I. Nhận diện Thông minh** | **Phát hiện và Phân loại thiên tai** (bão, lũ lụt, cháy rừng, sóng thần, v.v.) bằng mô hình học sâu (Deep Learning) từ dữ liệu vệ tinh và khí tượng. | AI/Machine Learning |
| **II. Đánh giá Rủi ro Đa chiều** | Tính toán **Safety Score** dựa trên tổ hợp của **3 yếu tố**: 1. Thiên tai dự báo, 2. Dữ liệu lịch sử, và 3. Mức độ dễ bị tổn thương của khu vực (mật độ dân số, cơ sở hạ tầng). | Fuzzy Logic/Regression Models |
| **III. Hỗ trợ Quyết định (Decision Support)** | Cung cấp Bản đồ Tương tác giúp du khách **trực quan hóa rủi ro** và xác định ngay lập tức **lộ trình an toàn** cùng các điểm trú ẩn gần nhất. | GIS/Geospatial Algorithms |
### 1.3 Bối cảnh Sử dụng Chính (Key Use Cases) 🗺️

* **Cảnh báo theo Vị trí:** Hệ thống tự động gửi cảnh báo nếu người dùng di chuyển vào bán kính rủi ro (ví dụ: khu vực dự kiến ngập lụt sau 3 giờ).
* **Lập kế hoạch Hành trình An toàn:** Trước khi di chuyển, người dùng có thể kiểm tra "Safety Score" của điểm đến và tuyến đường để chọn lộ trình ít rủi ro nhất.
* **Hỗ trợ Khẩn cấp SOS:** Trong trường hợp nguy hiểm, người dùng có thể kích hoạt tính năng SOS để gửi vị trí và tình trạng khẩn cấp tới các cơ quan cứu hộ và người thân.
* **Kiểm tra Rủi ro Di sản/Điểm tham quan:** Đánh giá rủi ro của các điểm tham quan đã được lên lịch, giúp du khách hủy hoặc thay đổi lịch trình nếu cần.
### 1.4 Các Chỉ số Thành công (Success Metrics)

* **Tỷ lệ Cảnh báo Kịp thời:** Tối thiểu 95% cảnh báo được gửi đến người dùng trong vòng 5 giây kể từ khi dữ liệu rủi ro được xử lý.
* **Tỷ lệ Chính xác (Accuracy):** Độ chính xác của mô hình dự đoán thiên tai (AI) đạt trên 90%.
* **Mức độ Hài lòng của Người dùng (CSAT):** Điểm đánh giá mức độ tin cậy và hữu ích của cảnh báo đạt trên 4.5/5.
* **Thời gian Phản hồi SOS:** Giảm thời gian phản hồi trung bình của hệ thống SOS xuống dưới 60 giây.

### 1.5 Yêu cầu Kỹ thuật Cấp cao (High-Level Technical Requirements)

* Hệ thống phải xử lý **dữ liệu thời gian thực** (Real-time data stream) từ nhiều API.
* **Độ trễ (Latency)** của hệ thống cảnh báo phải dưới **5 giây** để đảm bảo tính kịp thời.
* Giao diện bản đồ phải **hiển thị mượt mà** và đáp ứng trên mọi thiết bị (**Responsive Design**).

---

## 2. Decomposition (Sơ đồ Phân rã Hệ thống) 

Hệ thống ITSS được cấu trúc theo kiến trúc **Microservices** và được phân rã thành các module chức năng độc lập như sau:

### 2.1 Kiến trúc Công nghệ (Technology Stack) 

| Lớp (Layer) | Công nghệ Đề xuất | Mục đích Chính |
| :--- | :--- | :--- |
| **Data Ingestion/DB** | **Python (Pandas, ETL Tools), PostgreSQL/PostGIS** | Thu thập, làm sạch dữ liệu lớn và lưu trữ dữ liệu địa lý. |
| **AI/Machine Learning** | **Python (TensorFlow/PyTorch), Scikit-learn** | Xây dựng, huấn luyện mô hình dự đoán thiên tai và tính toán Safety Score. |
| **Backend & API** | **Node.js (Express.js) hoặc Python (Django/Flask)** | Xây dựng API (RESTful) hiệu suất cao để phục vụ dữ liệu cảnh báo theo thời gian thực. |
| **GIS/Algorithm** | **Python (GeoPandas, Shapely), Mapbox/Leaflet** | Xử lý các phép toán địa lý, tính bán kính ảnh hưởng và render lớp bản đồ rủi ro. |
| **Frontend & UX** | **React/Vue.js (Web), React Native/Flutter (Mobile)** | Phát triển giao diện người dùng tương tác và tối ưu hóa trải nghiệm bản đồ. |

### 2.2 Sơ đồ Luồng Dữ liệu Tổng thể (Data Flow Structure)
### Sơ đồ Luồng Dữ liệu Tổng quan (Sử dụng Text/ASCII Art)

```text
+----------------------+   (1. Data Pipeline - ETL)    +----------------------+
|  API Dữ liệu Thô     | ----------------------------> | Cơ sở dữ liệu Trung tâm |
| (E1: Thời tiết, Geo) | <---------------------------- |       (DS1)          |
+----------------------+   (Dữ liệu Sạch & Lịch sử)  +----------------------+
                                     |
                                     | (Dữ liệu vào AI)
                                     v
+----------------------+   (DF: Dự đoán Thiên tai)   +----------------------+
| 2. AI Detection      | --------------------------> | 3. AI Risk Evaluation|
| (AI Dev 1)           |                           | (AI Dev 2)           |
+----------------------+                           +----------------------+
                                     |
                                     | (Safety Score)
                                     v
+--------------------------------------+
| 4. Algorithm Designer: Bản đồ Rủi ro |
+--------------------------------------+
                                     |
                                     | (Dữ liệu Bản đồ Đã Xử lý)
                                     v
+----------------------+ <-------- +-----------------------+
| 6. Frontend & UX     |           | 5. Backend & REST API |
| (UI/UX Developer)    | --------> | (Server Logic)        |
+----------------------+ <-------- +-----------------------+
        |                               ^
        | (Cảnh báo Trực quan)           | (Kiểm thử API & Hiệu năng)
        v                               |
+----------------------+   <-------- +----------------------+
| Du khách / Người dùng | (Yêu cầu API) | 7. Testing Lead (QA) |
+----------------------+               +----------------------+
```



### Mô tả Sơ đồ Luồng Dữ liệu Tổng thể



Quá trình hoạt động của hệ thống:

1.  **Nguồn Dữ liệu Đa dạng:** Dữ liệu được thu thập từ **API Thời tiết Chính phủ**, **Vệ tinh/Cảm biến** và **Dữ liệu Bản đồ Địa lý (GeoJSON)**.
2.  **Data Pipeline:** Dữ liệu thô được làm sạch, chuyển đổi (ETL) và lưu trữ trong Cơ sở dữ liệu Trung tâm.
3.  **Lớp Trí tuệ (AI Layer):** Dữ liệu được đưa vào 2 mô hình AI:
    * **AI Developer 1:** Nhận diện và dự đoán sự kiện thiên tai.
    * **AI Developer 2:** Tính toán **Safety Score** và Rủi ro phân loại.
4.  **Lớp Xử lý Thuật toán:** **Algorithm Designer** sử dụng kết quả Safety Score để tính toán bán kính ảnh hưởng và chuẩn bị dữ liệu cho việc hiển thị bản đồ (ví dụ: tạo ra các lớp GeoJSON với mã màu rủi ro).
5.  **Backend & API:** Cung cấp các **Endpoint RESTful** tiêu chuẩn để Frontend truy vấn thông tin cảnh báo, bản đồ rủi ro và các điểm trú ẩn.
6.  **Frontend & UX:** **UI/UX Developer** hiển thị thông tin trực quan, cho phép người dùng tương tác với bản đồ và nhận cảnh báo tức thời.
7.  **QA:** **Testing Lead** liên tục kiểm thử độ chính xác của cảnh báo và hiệu năng của API.

---

## 3. Phân công Công việc (Work Assignment) 

Dưới đây là bảng phân công chi tiết vai trò, nhiệm vụ và branch phát triển tương ứng cho từng thành viên trong dự án.

| STT | Vai trò | Tên Branch (Git Flow) | Nhiệm vụ chính | Mô tả công việc chi tiết |
| :-- | :--- | :--- | :--- | :--- |
| **1** | **System Analyst** | `system-analyst-requirements(24127595)` | Phân tích yêu cầu, thiết kế kiến trúc hệ thống, use-case và API spec | - Xây dựng **SRS** (Software Requirement Specification).<br>- Thiết kế sơ đồ luồng dữ liệu (**DFD**), **ERD** và use-case diagram.<br>- Xác định các endpoint API, request/response format.<br>- Quản lý tài liệu kiến trúc tổng thể hệ thống. |
| **2** | **AI Developer 1** | `ai-disaster-detection(24127194)` | Phát triển mô hình AI nhận diện và phân loại thiên tai | - Huấn luyện mô hình dự đoán thiên tai (bão, lũ lụt, động đất, cháy rừng, sóng thần) dựa trên dữ liệu khí tượng & dữ liệu thời gian thực.<br>- Xây dựng **API inferencing** phục vụ module cảnh báo thời tiết & thiên tai. |
| **3** | **AI Developer 2** | `ai-risk-evaluation(24127084)` | Phát triển hệ thống đánh giá rủi ro và phân loại mức độ an toàn khu vực | - Dùng dữ liệu thời tiết, thiên tai và lịch sử khí tượng để tính **“Safety Score”** cho từng khu vực.<br>- Tích hợp thuật toán **machine learning** hoặc **fuzzy logic** để xếp hạng (Cao / Trung bình / Thấp) theo nguy cơ thiên tai. |
| **4** | **Data Engineer** | `data-pipeline-and-storage(24127089)` | Thiết lập pipeline dữ liệu, ETL và cơ sở dữ liệu trung tâm | - Thu thập và xử lý dữ liệu từ API thời tiết, API cảnh báo thiên tai chính phủ và dữ liệu bản đồ địa lý (**GeoJSON**).<br>- Thiết kế database (**PostgreSQL/NoSQL**).<br>- Thiết lập **cron jobs** cập nhật dữ liệu định kỳ. |
| **5** | **Algorithm Designer** | `algorithm-safety-map(24127311)` | Thiết kế thuật toán phân vùng rủi ro thiên tai và hiển thị bản đồ | - Xây dựng thuật toán tô màu bản đồ theo mức độ rủi ro thiên tai.<br>- Tính toán bán kính ảnh hưởng của thiên tai (ví dụ: phạm vi bão hoặc lũ).<br>- Tối ưu hiển thị marker (bệnh viện, nơi trú ẩn, lãnh sự quán). |
| **6** | **UI/UX Developer** | `uiux-safety-interface(24127082)` | Thiết kế giao diện và trải nghiệm người dùng cho app | - Tạo mockup/Prototype cho: **Interactive Safety Map**, **Disaster & Weather Alert Hub**, **Quick SOS Screen**.<br>- Thực hiện responsive design & dark mode.<br>- Kết nối frontend với API cảnh báo. |
| **7** | **Testing Lead** | `testing-and-qc(24127586)` | Đảm bảo chất lượng, kiểm thử tích hợp và hiệu năng | - Viết **test case** cho từng module.<br>- Thực hiện **integration test** giữa các API cảnh báo & bản đồ.<br>- Kiểm thử **hiệu năng & stress test** khi có nhiều người nhận cảnh báo cùng lúc.<br>- Báo cáo bug qua Jira/GitHub Issues. |





