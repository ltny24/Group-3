# Data Pipeline for Disaster & Weather Alerts

## **Problem Definition**

Mục tiêu của dự án là xây dựng một hệ thống pipeline dữ liệu tự động phục vụ cho hệ thống cảnh báo thiên tai và thời tiết. Hệ thống này hướng tới việc chuẩn hóa, tích hợp và cập nhật dữ liệu thời gian thực từ nhiều nguồn khác nhau để hỗ trợ việc phân tích rủi ro, ra quyết định và cảnh báo sớm cho người dùng hoặc các ứng dụng liên quan.

### **1. Vấn đề đặt ra**

Hiện nay, dữ liệu về thời tiết và thiên tai được cung cấp từ nhiều nguồn khác nhau — như các API thời tiết quốc tế, API cảnh báo của chính phủ, hoặc dữ liệu bản đồ hành chính dạng GeoJSON. Tuy nhiên, các nguồn dữ liệu này có:

* Định dạng khác nhau (JSON, XML, CSV, GeoJSON...).
* Tần suất cập nhật không đồng nhất.
* Độ chính xác và khả năng truy vấn theo không gian còn hạn chế.

Điều này gây khó khăn trong việc tích hợp, chuẩn hóa và sử dụng dữ liệu cho các ứng dụng cảnh báo hoặc giám sát rủi ro thiên tai. Vì vậy, cần có một pipeline dữ liệu tự động giúp đồng bộ hóa và quản lý dữ liệu một cách hiệu quả, đảm bảo độ tin cậy, tính toàn vẹn và khả năng mở rộng của hệ thống.

### **2. Mục tiêu cụ thể**

Hệ thống cần có khả năng:

* Thu thập và xử lý dữ liệu từ nhiều nguồn khác nhau, bao gồm:

  * API thời tiết (nhiệt độ, lượng mưa, tốc độ gió, độ ẩm...).
  * API cảnh báo thiên tai của các cơ quan chính phủ (bão, lũ, động đất...).
  * Dữ liệu bản đồ hành chính (GeoJSON) để định vị không gian và xác định khu vực chịu ảnh hưởng.
* Thiết kế cơ sở dữ liệu trung tâm sử dụng PostgreSQL kết hợp với PostGIS để lưu trữ dữ liệu không gian, cho phép:

  * Truy vấn dữ liệu theo vị trí địa lý, ranh giới hành chính hoặc khu vực rủi ro.
  * Liên kết dữ liệu thời tiết và cảnh báo với bản đồ thực tế.
  * Dễ dàng mở rộng khi tích hợp thêm các nguồn dữ liệu khác.
* Tự động hóa quy trình cập nhật dữ liệu bằng cách triển khai cron job hoặc script ETL, đảm bảo hệ thống luôn hoạt động ổn định và dữ liệu luôn được làm mới theo thời gian thực hoặc định kỳ.
* Cung cấp nền tảng dữ liệu ổn định và có thể mở rộng, làm cơ sở cho các ứng dụng phía sau như:

  * Hệ thống giám sát rủi ro thời tiết.
  * Ứng dụng cảnh báo sớm cho người dân.
  * Dashboard quản lý thiên tai dành cho cơ quan chức năng.

### **3. Thách thức kỹ thuật**

Một số vấn đề kỹ thuật mà dự án cần giải quyết gồm:

* Chuẩn hóa dữ liệu từ nhiều nguồn không đồng nhất.
* Đảm bảo độ chính xác và tính nhất quán của dữ liệu theo thời gian.
* Thiết kế kiến trúc hệ thống pipeline linh hoạt, dễ bảo trì và mở rộng.
* Xử lý dữ liệu không gian lớn (spatial data) trong khi vẫn đảm bảo hiệu năng truy vấn cao.
* Tối ưu hóa hiệu suất cập nhật và lưu trữ dữ liệu, tránh trùng lặp và quá tải hệ thống.

### **4. Kết quả mong đợi**

Sau khi hoàn thành, hệ thống sẽ:

* Tự động thu thập, làm sạch, và lưu trữ dữ liệu thiên tai – thời tiết vào cơ sở dữ liệu trung tâm.
* Cung cấp giao diện truy vấn hoặc API để các ứng dụng khác khai thác dữ liệu.
* Giảm thiểu thao tác thủ công trong việc quản lý và cập nhật dữ liệu.
* Đảm bảo độ chính xác, kịp thời và khả năng mở rộng để phục vụ trong các tình huống khẩn cấp hoặc quy mô lớn.

---

## **Decomposition**

| Giai Đoạn (Phase)                                     | Kỹ Thuật / Công Cụ Chính                | Nội Dung Chi Tiết Công Việc (Task Details)                                                                                                                                                                          | Mục Đích / Yêu Cầu Mong Đợi (Goal / Expectation)                      |
| ----------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Thiết Kế & Nền Tảng (Foundation & Design)             | PostgreSQL + PostGIS, Mermaid, Markdown | - Phân tích yêu cầu: xác định rõ nguồn API và dữ liệu GeoJSON.<br>- Vẽ sơ đồ pipeline tổng thể (ETL).<br>- Thiết kế ERD, Spatial Indexes cho PostGIS.                                                               | Hiểu rõ pipeline và cấu trúc lưu trữ, tối ưu truy vấn không gian.     |
| Thu Thập Dữ Liệu Thô (Data Ingestion)                 | Python (Requests, Pydantic), Logging    | - Module `weather_service.py` gọi API thời tiết.<br>- Module `disaster_alert_service.py` gọi API cảnh báo.<br>- Module `geojson_loader.py` đọc/tải GeoJSON hành chính.<br>- Validate dữ liệu đầu vào bằng Pydantic. | Lấy dữ liệu ổn định, module độc lập, dễ cấu hình và logging chi tiết. |
| Xử Lý & Chuẩn Hóa (Data Transformation)               | Python (Pandas, GeoPandas)              | - `data_transformer.py`:<br>  1. Clean: xử lý null và sai định dạng.<br>  2. Join: kết hợp dữ liệu thời tiết/thiên tai với dữ liệu hành chính.<br>  3. Transform: chuẩn hóa để nạp vào DB.                          | Dữ liệu sạch, đồng nhất, sẵn sàng nạp vào database.                   |
| Nạp Dữ Liệu & Tự Động Hóa (Data Loading & Automation) | SQLAlchemy / psycopg2, Cron Job         | - `data_loader.py` nạp dữ liệu.<br>- Script `create_tables.sql` chạy 1 lần.<br>- Cron Job/APScheduler định kỳ chạy pipeline (ETL).                                                                                  | Hệ thống tự động cập nhật dữ liệu, đảm bảo tính nhất quán.            |

---

## **Timeline**

| Ngày                                               | Mục Tiêu (Goal / Expectation)                                         | Nội Dung Chi Tiết Công Việc (Task Details)                                                                                                                                   | Deliverables                                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Ngày 1 – Khởi Tạo Nền Tảng Dữ Liệu                 | Hoàn thiện thiết kế nền tảng dữ liệu (sơ đồ, cấu trúc, flow tổng thể) | - File thiết kế data flow và ERD.<br>- Thiết lập PostgreSQL + PostGIS.<br>- Viết schema cơ bản và test truy vấn không gian.<br>- Ghi chú lại cấu trúc bảng chính và quan hệ. | `data_flow_diagram.png`, `database_erd.png`, `database_schema.md`                             |
| Ngày 2 – Kết Nối & Thu Thập Dữ Liệu Thời Gian Thực | Pipeline lấy và ghi log dữ liệu từ API thực                           | - Tạo module kết nối API thời tiết & thiên tai.<br>- Validate dữ liệu bằng Pydantic.<br>- Ghi log lỗi/kết nối/response.<br>- Lưu dữ liệu mẫu ra `.json`.                     | `weather_service.py`, `disaster_alert_service.py`, `api_sample.json`, `ingestion_overview.md` |
| Ngày 3 – Làm Sạch & Chuẩn Hóa Dữ Liệu Không Gian   | Dữ liệu chuẩn, sạch, có thể nạp DB                                    | - `data_transformer.py` clean, merge, chuẩn hóa.<br>- Loại bỏ cột trùng/null.<br>- Chuẩn hóa mã hành chính.<br>- Kết hợp dữ liệu địa lý với thời tiết/thiên tai.             | `data_transformer.py`, `transformation_notes.md`                                              |
| Ngày 4 – Tự Động Hóa Pipeline ETL                  | Pipeline ETL tự động                                                  | - `data_loader.py` nạp dữ liệu.<br>- Script `create_tables.sql`.<br>- Cron job chạy định kỳ.<br>- Kiểm tra log.                                                              | `data_loader.py`, `create_tables.sql`, `data_loading_plan.md`                                 |
| Ngày 5 – Kiểm Thử & Tài Liệu Hóa                   | Pipeline hoàn chỉnh, có tài liệu và test                              | - Viết Unit Test từng module.<br>- Test chạy thử toàn pipeline.<br>- Tạo Pull Request.                                                                                       | `test_*.py`, `README.md`, Pull Request                                                        |

---

## **Tools**

| Nhóm Chức Năng                | Công Cụ / Thư Viện Chính                                  | Mục Đích / Vai Trò                                                                                        |
| ----------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Cơ sở dữ liệu & không gian    | PostgreSQL, PostGIS                                       | Lưu trữ dữ liệu thời tiết, thiên tai, bản đồ hành chính; hỗ trợ truy vấn theo khu vực, tọa độ, ranh giới. |
| Thiết kế & mô hình hóa        | Mermaid, Draw.io, Markdown                                | Thiết kế sơ đồ pipeline (Data Flow), ERD, ghi chú tài liệu kỹ thuật.                                      |
| Kết nối & thu thập dữ liệu    | Python, requests, pydantic, logging, python-dotenv        | Gọi API, validate dữ liệu, quản lý API keys, logging chi tiết.                                            |
| Xử lý & chuẩn hóa dữ liệu     | pandas, geopandas, shapely, numpy, datetime               | Clean, chuẩn hóa, kết hợp dữ liệu địa lý với thời tiết/thiên tai.                                         |
| Nạp dữ liệu & tự động hóa     | SQLAlchemy, psycopg2, cron/APScheduler, create_tables.sql | Ghi dữ liệu vào DB, tự động hóa pipeline định kỳ.                                                         |
| Kiểm thử & đảm bảo chất lượng | pytest, unittest, black, flake8, isort                    | Unit test, kiểm tra logic pipeline, đảm bảo code chuẩn hóa, dễ bảo trì.                                   |
| Quản lý mã nguồn & tài liệu   | Git, GitHub, README.md, docstring                         | Quản lý phiên bản, tạo Pull Request, hướng dẫn sử dụng pipeline.                                          |
| Hỗ trợ phát triển & kiểm thử  | virtualenv/poetry, Jupyter Notebook, pgAdmin/DBeaver      | Thiết lập môi trường ảo, thử nghiệm truy vấn, kiểm tra dữ liệu trung gian.                                |
# Data Pipeline for Disaster & Weather Alerts

## **Problem Definition**

Mục tiêu của dự án là xây dựng một hệ thống pipeline dữ liệu tự động phục vụ cho hệ thống cảnh báo thiên tai và thời tiết. Hệ thống này hướng tới việc chuẩn hóa, tích hợp và cập nhật dữ liệu thời gian thực từ nhiều nguồn khác nhau để hỗ trợ việc phân tích rủi ro, ra quyết định và cảnh báo sớm cho người dùng hoặc các ứng dụng liên quan.

### **1. Vấn đề đặt ra**

Hiện nay, dữ liệu về thời tiết và thiên tai được cung cấp từ nhiều nguồn khác nhau — như các API thời tiết quốc tế, API cảnh báo của chính phủ, hoặc dữ liệu bản đồ hành chính dạng GeoJSON. Tuy nhiên, các nguồn dữ liệu này có:

* Định dạng khác nhau (JSON, XML, CSV, GeoJSON...).
* Tần suất cập nhật không đồng nhất.
* Độ chính xác và khả năng truy vấn theo không gian còn hạn chế.

Điều này gây khó khăn trong việc tích hợp, chuẩn hóa và sử dụng dữ liệu cho các ứng dụng cảnh báo hoặc giám sát rủi ro thiên tai. Vì vậy, cần có một pipeline dữ liệu tự động giúp đồng bộ hóa và quản lý dữ liệu một cách hiệu quả, đảm bảo độ tin cậy, tính toàn vẹn và khả năng mở rộng của hệ thống.

### **2. Mục tiêu cụ thể**

Hệ thống cần có khả năng:

* Thu thập và xử lý dữ liệu từ nhiều nguồn khác nhau, bao gồm:

  * API thời tiết (nhiệt độ, lượng mưa, tốc độ gió, độ ẩm...).
  * API cảnh báo thiên tai của các cơ quan chính phủ (bão, lũ, động đất...).
  * Dữ liệu bản đồ hành chính (GeoJSON) để định vị không gian và xác định khu vực chịu ảnh hưởng.
* Thiết kế cơ sở dữ liệu trung tâm sử dụng PostgreSQL kết hợp với PostGIS để lưu trữ dữ liệu không gian, cho phép:

  * Truy vấn dữ liệu theo vị trí địa lý, ranh giới hành chính hoặc khu vực rủi ro.
  * Liên kết dữ liệu thời tiết và cảnh báo với bản đồ thực tế.
  * Dễ dàng mở rộng khi tích hợp thêm các nguồn dữ liệu khác.
* Tự động hóa quy trình cập nhật dữ liệu bằng cách triển khai cron job hoặc script ETL, đảm bảo hệ thống luôn hoạt động ổn định và dữ liệu luôn được làm mới theo thời gian thực hoặc định kỳ.
* Cung cấp nền tảng dữ liệu ổn định và có thể mở rộng, làm cơ sở cho các ứng dụng phía sau như:

  * Hệ thống giám sát rủi ro thời tiết.
  * Ứng dụng cảnh báo sớm cho người dân.
  * Dashboard quản lý thiên tai dành cho cơ quan chức năng.

### **3. Thách thức kỹ thuật**

Một số vấn đề kỹ thuật mà dự án cần giải quyết gồm:

* Chuẩn hóa dữ liệu từ nhiều nguồn không đồng nhất.
* Đảm bảo độ chính xác và tính nhất quán của dữ liệu theo thời gian.
* Thiết kế kiến trúc hệ thống pipeline linh hoạt, dễ bảo trì và mở rộng.
* Xử lý dữ liệu không gian lớn (spatial data) trong khi vẫn đảm bảo hiệu năng truy vấn cao.
* Tối ưu hóa hiệu suất cập nhật và lưu trữ dữ liệu, tránh trùng lặp và quá tải hệ thống.

### **4. Kết quả mong đợi**

Sau khi hoàn thành, hệ thống sẽ:

* Tự động thu thập, làm sạch, và lưu trữ dữ liệu thiên tai – thời tiết vào cơ sở dữ liệu trung tâm.
* Cung cấp giao diện truy vấn hoặc API để các ứng dụng khác khai thác dữ liệu.
* Giảm thiểu thao tác thủ công trong việc quản lý và cập nhật dữ liệu.
* Đảm bảo độ chính xác, kịp thời và khả năng mở rộng để phục vụ trong các tình huống khẩn cấp hoặc quy mô lớn.

---

## **Decomposition**

| Giai Đoạn (Phase)                                     | Kỹ Thuật / Công Cụ Chính                | Nội Dung Chi Tiết Công Việc (Task Details)                                                                                                                                                                          | Mục Đích / Yêu Cầu Mong Đợi (Goal / Expectation)                      |
| ----------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Thiết Kế & Nền Tảng (Foundation & Design)             | PostgreSQL + PostGIS, Mermaid, Markdown | - Phân tích yêu cầu: xác định rõ nguồn API và dữ liệu GeoJSON.<br>- Vẽ sơ đồ pipeline tổng thể (ETL).<br>- Thiết kế ERD, Spatial Indexes cho PostGIS.                                                               | Hiểu rõ pipeline và cấu trúc lưu trữ, tối ưu truy vấn không gian.     |
| Thu Thập Dữ Liệu Thô (Data Ingestion)                 | Python (Requests, Pydantic), Logging    | - Module `weather_service.py` gọi API thời tiết.<br>- Module `disaster_alert_service.py` gọi API cảnh báo.<br>- Module `geojson_loader.py` đọc/tải GeoJSON hành chính.<br>- Validate dữ liệu đầu vào bằng Pydantic. | Lấy dữ liệu ổn định, module độc lập, dễ cấu hình và logging chi tiết. |
| Xử Lý & Chuẩn Hóa (Data Transformation)               | Python (Pandas, GeoPandas)              | - `data_transformer.py`:<br>  1. Clean: xử lý null và sai định dạng.<br>  2. Join: kết hợp dữ liệu thời tiết/thiên tai với dữ liệu hành chính.<br>  3. Transform: chuẩn hóa để nạp vào DB.                          | Dữ liệu sạch, đồng nhất, sẵn sàng nạp vào database.                   |
| Nạp Dữ Liệu & Tự Động Hóa (Data Loading & Automation) | SQLAlchemy / psycopg2, Cron Job         | - `data_loader.py` nạp dữ liệu.<br>- Script `create_tables.sql` chạy 1 lần.<br>- Cron Job/APScheduler định kỳ chạy pipeline (ETL).                                                                                  | Hệ thống tự động cập nhật dữ liệu, đảm bảo tính nhất quán.            |

---

## **Timeline**

| Ngày                                               | Mục Tiêu (Goal / Expectation)                                         | Nội Dung Chi Tiết Công Việc (Task Details)                                                                                                                                   | Deliverables                                                                                  |
| -------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Ngày 1 – Khởi Tạo Nền Tảng Dữ Liệu                 | Hoàn thiện thiết kế nền tảng dữ liệu (sơ đồ, cấu trúc, flow tổng thể) | - File thiết kế data flow và ERD.<br>- Thiết lập PostgreSQL + PostGIS.<br>- Viết schema cơ bản và test truy vấn không gian.<br>- Ghi chú lại cấu trúc bảng chính và quan hệ. | `01_database_schema.md`                             |
| Ngày 2 – Kết Nối & Thu Thập Dữ Liệu Thời Gian Thực | Pipeline lấy và ghi log dữ liệu từ API thực                           | - Tạo module kết nối API thời tiết & thiên tai.<br>- Validate dữ liệu bằng Pydantic.<br>- Ghi log lỗi/kết nối/response.<br>- Lưu dữ liệu mẫu ra `.json`.                     | `11_weather_service.py`, `12_disaster_alert_service.py`, `13_api_sample.json`, `14_ingestion_overview.md` |
| Ngày 3 – Làm Sạch & Chuẩn Hóa Dữ Liệu Không Gian   | Dữ liệu chuẩn, sạch, có thể nạp DB                                    | - `data_transformer.py` clean, merge, chuẩn hóa.<br>- Loại bỏ cột trùng/null.<br>- Chuẩn hóa mã hành chính.<br>- Kết hợp dữ liệu địa lý với thời tiết/thiên tai.             | `21_data_transformer.py`, `22_transformation_notes.md`                                              |
| Ngày 4 – Tự Động Hóa Pipeline ETL                  | Pipeline ETL tự động                                                  | - `data_loader.py` nạp dữ liệu.<br>- Script `create_tables.sql`.<br>- Cron job chạy định kỳ.<br>- Kiểm tra log.                                                              | `31_data_loader.py`, `32_create_tables.sql`, `33_data_loading_plan.md`                                 |
| Ngày 5 – Kiểm Thử & Tài Liệu Hóa                   | Pipeline hoàn chỉnh, có tài liệu và test                              | - Viết Unit Test từng module.<br>- Test chạy thử toàn pipeline.<br>- Tạo Pull Request.                                                                                       | `41_test_services.py`                                                  |

---

## **Tools**

| Nhóm Chức Năng                | Công Cụ / Thư Viện Chính                                  | Mục Đích / Vai Trò                                                                                        |
| ----------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Cơ sở dữ liệu & không gian    | PostgreSQL, PostGIS                                       | Lưu trữ dữ liệu thời tiết, thiên tai, bản đồ hành chính; hỗ trợ truy vấn theo khu vực, tọa độ, ranh giới. |
| Thiết kế & mô hình hóa        | Mermaid, Draw.io, Markdown                                | Thiết kế sơ đồ pipeline (Data Flow), ERD, ghi chú tài liệu kỹ thuật.                                      |
| Kết nối & thu thập dữ liệu    | Python, requests, pydantic, logging, python-dotenv        | Gọi API, validate dữ liệu, quản lý API keys, logging chi tiết.                                            |
| Xử lý & chuẩn hóa dữ liệu     | pandas, geopandas, shapely, numpy, datetime               | Clean, chuẩn hóa, kết hợp dữ liệu địa lý với thời tiết/thiên tai.                                         |
| Nạp dữ liệu & tự động hóa     | SQLAlchemy, psycopg2, cron/APScheduler, create_tables.sql | Ghi dữ liệu vào DB, tự động hóa pipeline định kỳ.                                                         |
| Kiểm thử & đảm bảo chất lượng | pytest, unittest, black, flake8, isort                    | Unit test, kiểm tra logic pipeline, đảm bảo code chuẩn hóa, dễ bảo trì.                                   |
| Quản lý mã nguồn & tài liệu   | Git, GitHub, README.md, docstring                         | Quản lý phiên bản, tạo Pull Request, hướng dẫn sử dụng pipeline.                                          |
| Hỗ trợ phát triển & kiểm thử  | virtualenv/poetry, Jupyter Notebook, pgAdmin/DBeaver      | Thiết lập môi trường ảo, thử nghiệm truy vấn, kiểm tra dữ liệu trung gian.                                |
