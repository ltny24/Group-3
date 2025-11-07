**Design Prototype**

**1. Mục tiêu tài liệu**\
Nội dung gồm:

-   Mô tả chức năng, bố cục, hành vi tương tác.

-   Quy chuẩn hiển thị, kích thước, màu sắc, font, trạng thái.

-   Liên kết giữa các thành phần UI và các module hệ thống (Map, Alerts,
    SOS, Settings\...).

**2. Danh sách màn hình chính**

  ---------------------------------------------------------------------------------
  **STT**   **Màn hình**    **Mục đích**                              **Mức độ ưu
                                                                      tiên**
  --------- --------------- ----------------------------------------- -------------
  01        Onboarding      Giới thiệu ứng dụng, xin quyền truy cập   Cao
                            vị trí và thông báo                       

  02        Home            Trung tâm hiển thị chỉ số an toàn và truy Cao
                            cập nhanh                                 

  03        Map             Hiển thị vùng rủi ro, hỗ trợ tìm kiếm     Cao

  04        Alert Hub       Danh sách cảnh báo                        Cao

  05        Alert Detail    Chi tiết cảnh báo                         Cao

  06        SOS             Gửi tín hiệu khẩn cấp                     Cao

  07        History         Lịch sử cảnh báo và SOS                   Trung bình

  08        Settings        Cấu hình ứng dụng                         Trung bình

  09        Profile         Quản lý thông tin cá nhân                 Trung bình

  10        Help            Hỗ trợ người dùng                         Thấp

  11        Notifications   Hiển thị thông báo mới                    Trung bình

  12        Offline         Xử lý khi không có mạng                   Trung bình
  ---------------------------------------------------------------------------------

**3. Mô tả chi tiết từng màn hình**

**3.1. Onboarding Screen**

-   **Mục đích:** Giới thiệu ứng dụng và hướng dẫn quyền truy cập.

-   **Thành phần:**

    -   3 slide: *Welcome* → *Permission* → *Get Started*

    -   Button: **Next**, **Allow**, **Get Started**

    -   Progress Bar (màu #1A73E8).

-   **Hành vi:**

    -   Chạm "Next" → slide kế tiếp.

    -   "Allow Access" → mở hệ thống quyền Android/iOS.

    -   "Get Started" → chuyển sang màn hình Home.

**3.2. Home Screen**

-   **Mục đích:** Trung tâm thông tin -- hiển thị Safety Score & lối tắt
    nhanh.

-   **Thành phần:**

    -   Chỉ số **Safety Score** (vòng tròn 120×120 px).

    -   3 nút nhanh: Map / Alerts / SOS (kích thước 64×64 px).

    -   Thanh điều hướng (bottom navbar): Home / Map / Alerts / Profile.

    -   Icon Notification (24×24 px, góc phải trên).

-   **Hành vi:**

    -   Tap vào từng nút → điều hướng.

    -   Khi offline → chuyển tới màn hình "Offline Mode".

**3.3. Map Screen**

-   **Thành phần:**

    -   Map chính (Leaflet hoặc Google Maps API).

    -   Polygons hiển thị vùng nguy cơ:

        -   Đỏ (#FF3B30): Critical

        -   Cam (#FF9500): High

        -   Vàng (#FFD60A): Moderate

        -   Xanh (#34C759): Low

    -   Nút tìm kiếm (search bar bo tròn 8 px).

    -   Nút SOS nổi (FAB 56×56 px).

    -   Chú giải màu (Legend).

-   **Hành vi:**

    -   Tap vùng → mở Alert Detail.

    -   Nhấn SOS → đến màn hình SOS.

**3.4. Alert Hub**

-   **Thành phần:**

    -   Tabs: "Gần tôi" / "Toàn quốc" / "Tất cả".

    -   Alert Card:

        -   Biểu tượng thời tiết (32×32 px).

        -   Tiêu đề, vị trí, thời gian.

        -   Màu cảnh báo (Critical/High/Moderate/Low).

    -   Scroll dọc.

-   **Hành vi:**

    -   Tap → Alert Detail.

    -   Vuốt xuống để refresh.

**3.5. Alert Detail**

-   **Thành phần:**

    -   Mini Map (cao 200 px).

    -   Chip nguy cơ (màu theo mức cảnh báo).

    -   Checklist:

        -   "Nên làm" (nền xanh nhạt).

        -   "Không nên làm" (nền đỏ nhạt).

    -   Button: "Đánh dấu đã đọc", "Chia sẻ".

-   **Hành vi:**

    -   Tap "Chia sẻ" → mở hệ thống chia sẻ OS.

    -   Tap "Đánh dấu đã đọc" → lưu vào History.

**3.6. SOS Screen**

-   **Thành phần:**

    -   SOS Button (đường kính 180 px, màu đỏ gradient #FF3B30→#FF5E57).

    -   Popup xác nhận.

    -   Text trạng thái:

        -   "Đang gửi\..."

        -   "Đã gửi thành công ✓".

-   **Hành vi:**

    -   Nhấn giữ → gửi.

    -   Khi gửi xong → tự động lưu vào History.

**3.7. History Screen**

-   **Thành phần:**

    -   Timeline chia theo ngày.

    -   Icon (SOS / Alert).

    -   Mô tả ngắn + thời gian.

-   **Hành vi:**

    -   Tap → mở lại Alert Detail (nếu còn trong cache).

**3.8. Settings Screen**

-   **Thành phần:**

    -   Switch / Toggle:

        -   Ngôn ngữ (VI/EN)

        -   Thông báo

        -   Dark Mode

        -   Offline Mode

    -   Link: Privacy Policy.

-   **Hành vi:**

    -   Thay đổi ngôn ngữ → reload giao diện.

    -   Bật Offline → app lưu cache cục bộ.

**3.9. Profile Screen**

-   **Thành phần:**

    -   Avatar (80×80 px).

    -   Họ tên, email.

    -   Danh sách liên hệ khẩn cấp.

    -   Nút "+ Thêm liên hệ", "Đăng xuất".

-   **Hành vi:**

    -   "Thêm liên hệ" → popup nhập số điện thoại.

    -   "Đăng xuất" → xác nhận & quay lại Onboarding.

**3.10. Help Screen**

-   **Thành phần:**

    -   Giới thiệu app.

    -   Mẹo an toàn.

    -   Số khẩn cấp: 113 / 114 / 115.

    -   Link: Chính sách bảo mật.

**3.11. Notifications Screen**

-   **Thành phần:**

    -   Danh sách cảnh báo gần đây.

    -   Popup (toast): "Bão mạnh gần khu vực bạn!".

-   **Hành vi:**

    -   Tap → mở Alert Detail.

**3.12. Offline Screen**

-   **Thành phần:**

    -   Icon mất kết nối.

    -   Progress bar tải cache.

    -   Nút: "Thử lại", "Xem dữ liệu đã lưu".

-   **Hành vi:**

    -   Tap Retry → thử kết nối lại.

    -   View Offline → mở danh sách cache.

**4. Bảng phân tích thành phần UI (Element Breakdown)**

  --------------------------------------------------------------------------
  **Loại thành  **Mô tả**       **Kích thước / **Màu**      **Trạng thái**
  phần**                        Padding**                   
  ------------- --------------- -------------- ------------ ----------------
  **Button      Nút chính       48 px chiều    #1A73E8      Hover: #1565C0 /
  (Primary)**   (Home, Next,    cao, 16 px                  Active: #0D47A1
                SOS\...)        padding                     

  **Button      Nút khẩn (SOS)  150--180 px    #FF3B30 →    Pressed: rung +
  (Danger)**                    tròn           #FF5E57      đổi bóng

  **Card        Thẻ cảnh báo    100 px cao, bo Tùy theo mức Hover: bóng nhẹ
  (Alert)**     trong Alert Hub tròn 12 px     độ           

  **Navbar      Mục điều hướng  Icon 24×24     #1A73E8      Active: tô sáng,
  Item**        dưới cùng       px + text 12                Inactive: xám
                                px                          

  **Search      Ô tìm kiếm bản  Cao 44 px, bo  #E8F1FD      Focus: border
  Bar**         đồ              góc 8 px                    xanh

  **Chip (Risk  Mức cảnh báo    32×20 px       Đỏ / Cam /   Không đổi
  Level)**      nhỏ                            Vàng / Xanh  

  **Progress    Thanh tiến      Cao 6 px       #1A73E8      Animation 0.5s
  Bar**         trình                                       
                Onboarding                                  

  **Popup /     Cảnh báo hoặc   Rộng 80% màn   Trắng / đỏ / Tự ẩn sau 3s
  Toast**       xác nhận        hình           vàng         

  **List Item   Mục lịch sử     60 px cao      Xám nhạt /   Tap → mở chi
  (History)**                                  theo loại    tiết

  **Icon        Biểu tượng      24×24 px       #1A73E8      Active đổi độ
  (General)**   Material                                    sáng 80%
  --------------------------------------------------------------------------

**5. Animation & Feedback**

  -----------------------------------------------------------------------
  **Loại hiệu ứng**        **Thời      **Mô tả**
                           lượng**     
  ------------------------ ----------- ----------------------------------
  **Transition giữa màn    0.3--0.4s   Trượt ngang (slide in/out)
  hình**                               

  **Button Press**         0.1s        Co nhẹ + đổi màu

  **Popup xuất hiện**      0.2s        Fade-in + scale nhẹ

  **SOS Send**             0.5s        Hiệu ứng nhấp nháy + rung
                                       (vibration)

  **Progress / Loading**   liên tục    Dạng vòng quay (spinner)
  -----------------------------------------------------------------------

**6. Accessibility & Usability**

-   Tỉ lệ tương phản ≥ 4.5:1.

-   Kích thước vùng chạm tối thiểu: 44×44 px.

-   Hỗ trợ "High Contrast Mode" khi bật Dark Mode.

-   Feedback âm thanh + rung cho hành động khẩn.

**7. Liên kết Prototype**

-   **Figma Link:** <https://flare-alarm-31688961.figma.site/>

**8. Tiêu chí hoàn thành**

\- Có đủ 12 màn hình.\
- Mỗi thành phần được mô tả rõ trong bảng Element Breakdown.\
- Prototype hoạt động mượt, có hiệu ứng cơ bản.\
- Testing Lead xác nhận usability ≥ 80%.
