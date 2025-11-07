# Data Loading Plan

## Mục tiêu
- Nạp dữ liệu weather & disaster từ `api_sample.json` vào PostgreSQL.
- Tạo bảng với `create_tables.sql` nếu chưa có.
- Tự động chạy định kỳ qua cron job.
- Kiểm tra log mỗi lần chạy.

## Quy trình
1. **Chuẩn bị DB**:
   - Tạo database `etl_db`
   - Chạy `create_tables.sql` để tạo bảng.
2. **Load dữ liệu**:
   - Chạy `data_loader.py`
   - Kiểm tra log file `data_loader.log`
3. **Cron job**:
   - Thêm entry vào crontab:
     ```bash
     0 * * * * /usr/bin/python3 /path/to/data_loader.py
     ```
     (chạy mỗi giờ)
4. **Deliverables**:
   - data_loader.py
   - create_tables.sql
   - data_loading_plan.md
   - Logs: data_loader.log
