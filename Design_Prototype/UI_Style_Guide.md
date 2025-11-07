**UI Style Guide**

**1. Bảng màu sắc (Color Palette)**

| **Mục đích** | **Màu** | **Mã Hex** | **Ghi chú** |
|---------------|----------|-------------|--------------|
| Màu chủ đạo (Primary) | Xanh dương | #1A73E8 | Dùng cho nút, icon, thanh điều hướng chính |
| Phụ (Secondary) | Xanh nhạt | #E8F1FD | Nền thẻ, khung hiển thị thông tin |
| An toàn | Xanh lá | #34C759 | Thông báo “An toàn”, trạng thái đã xử lý |
| Cảnh báo | Cam | #FF9500 | Cảnh báo mức độ trung bình |
| Nguy cấp | Đỏ | #FF3B30 | Dùng cho SOS và cảnh báo nghiêm trọng |
| Nền | Trắng | #FFFFFF | Màu nền chính |
| Chữ chính | Xám đậm | #0F172A | Tiêu đề, nội dung chính |
| Chữ phụ | Xám vừa | #6B7280 | Ghi chú, thời gian, phụ đề |


**2. Phông chữ (Typography)**

 | **Mục đích sử dụng** | **Phông chữ** | **Cỡ chữ (px)** | **Độ đậm** | **Ví dụ** |
|-----------------------|---------------|------------------|-------------|------------|
| Tiêu đề lớn | Inter / Roboto | 24 | 700 | “Travel Safety System” |
| Tiêu đề phần | Inter / Roboto | 20 | 600 | “Cảnh báo thời gian thực” |
| Nội dung chính | Inter / Roboto | 16 | 400 | “Nhận cảnh báo ngay khi có nguy cơ” |
| Phụ đề / ghi chú | Inter / Roboto | 14 | 400 | “5 phút trước” |
| Nút bấm | Inter / Roboto | 16 | 600 | “Bắt đầu”, “Đã đọc” |


**3. Quy định Bố cục và Các Thanh phần Giao Diện**

**Màn hình Trang chủ (Home)**

-   Chỉ số an toàn (Safety Score) hình tròn (120x120 px), nổi bật giữa
    màn hình.

-   3 nút nhanh:

    -   Bản đồ (Map)

    -   Cảnh báo (Alerts)

    -   SOS (khẩn cấp)

-   Thanh điều hướng dưới: Home / Map / Alerts / Profile (biểu tượng
    24x24 px).

**Màn hình Bản đồ (Map)**

-   Bản đồ tương tác với vùng màu hiển nguy cơ:

    -   Đỏ: Nghiêm trọng

    -   Cam: Cao

    -   Vàng: Trung bình

    -   Xanh: Thấp

-   Thanh tìm kiếm trên cùng, bo tròn 8px.

-   Nút SOS tròn 56x56 px nổi bật ở góc phải dưới.

**Màn hình Trung tâm Cảnh báo (Alert Hub)**

-   Danh sách các cảnh báo theo màu mức độ nguy hiểm.

-   Thẻ lọc: Gần tôi / Toàn quốc / Tất cả.

-   Thẻ cảnh báo cao 80--100 px, bo tròn 12px.

**Màn hình Chi tiết Cảnh báo (Alert Detail)**

-   Bản đồ nhỏ (200 px cao).

-   Chip mức nguy cơ (Critical / High / Moderate / Low).

-   Checklists:

    -   Nên làm (nền xanh nhạt)

    -   Tránh làm (nền đỏ nhạt)

-   Nút cuối: "Đã đọc", "Chia sẻ".

**Màn hình SOS**

-   Nút tròn lớn (150--180 px), màu đỏ gradient #FF3B30 → #FF5E57.

-   Trạng thái hiển thị: "Giữ để gọi", "Đang gởi\...", "Đã gởi thành
    công".

**Màn hình Lịch sử (History)**

-   Dạng timeline, phân ngày rõ ràng.

-   Mỗi mục có tên sự kiện, thời gian, màu mức nguy cơ.

**Màn hình Cài đặt (Settings)**

-   Bật/tắt các tùy chọn:

    -   Ngôn ngữ (VI/EN)

    -   Thông báo

    -   Chế độ tối

    -   Ngoại tuyến

-   Liên kết: Chính sách bảo mật, Điều khoản sử dụng.

**Màn hình Hồ sơ (Profile)**

-   Ảnh đại diện tròn (80x80 px).

-   Liên hệ khẩn cấp và địa điểm lưu.

-   Nút: "+ Thêm liên hệ khẩn cấp", "Đăng xuất".

**Màn hình Trợ giúp (Help)**

-   Thông tin về ứng dụng, số điện khẩn cấp (113, 114, 115).

-   Gợi ý an toàn du lịch, hướng dẫn hành động.

**Màn hình Thông báo (Notifications)**

-   Danh sách cảnh báo gần nhất kèm thời gian.

-   Popup: "Bão mạnh gần khu vực! Hãy ở trong nhà."

**Màn hình Ngoại tuyến (Offline)**

-   Hiển thị "Không có kết nối Internet".

-   Thanh tiến độ tải dữ liệu (ví dụ: 65%).

-   Nút: "Thử lại", "Xem dữ liệu đã lưu".

**4. Quy Chuẩn Thiết Kế Chung**

-   **Bo góc:** 12--16 px.

-   **Bóng đổ:** Nhẹ, mờ 20% (#000).

-   **Chiều cao nút:** 48 px.

-   **Khoảng cách:** 16 px giữa các thành phần.

-   **Tính đồng nhất:** Giữ nguyên cố định header, padding, icon.

**5. Tiêu Chuẩn Khả Năng Tiếp Cận (Accessibility)**

-   Tỷ lệ tương phản tối thiểu: 4.5:1.

-   Vùng chạm được: ≥ 44x44 px.

-   Có chế độ High Contrast cho màn hình nguy cấp.

-   Phản hồi rung khi nhấn SOS hoặc nhận cảnh báo khẩn cấp.
