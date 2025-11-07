**KẾT NỐI API THẬT & TÍCH HỢP ALERT / SOS**

**I. GIỚI THIỆU**

Giai đoạn 4--5 đánh dấu bước chuyển từ **mô hình mô phỏng** sang **ứng
dụng thực tế có khả năng giao tiếp hai chiều với server**.\
Mục tiêu là tích hợp các API thật của hệ thống cảnh báo thiên tai và
dịch vụ cứu hộ, đồng thời bổ sung các tính năng **ALERT (Cảnh báo)** và
**SOS (Khẩn cấp)**.

Kết quả sau giai đoạn này:

-   Ứng dụng có thể **lấy dữ liệu thời gian thực từ API thật**,

-   Gửi và xử lý **yêu cầu SOS**,

-   Nhận và hiển thị **cảnh báo nguy hiểm gần vị trí người dùng**,

-   **Hoạt động offline** và tự đồng bộ lại khi có mạng.

**II. MỤC TIÊU**

  ------------------------------------------------------------------------------
  **Nhóm mục tiêu**    **Mô tả**                               **Kết quả mong
                                                               đợi**
  -------------------- --------------------------------------- -----------------
  **API Integration**  Kết nối đến các endpoint /safety/score, Dữ liệu thật được
                       /map/pois, /alerts/history,             tải từ server
                       /sos/activate                           

  **Authentication**   Xác thực người dùng bằng JWT            Xác minh token
                       (/users/me)                             hợp lệ

  **ALERT System**     Hiển thị danh sách cảnh báo, thông báo  Alert list cập
                       popup, mark-as-read                     nhật tự động

  **SOS Feature**      Gửi tín hiệu cứu hộ từ vị trí hiện tại  Server nhận được
                                                               yêu cầu SOS

  **Offline Queue**    Lưu tạm yêu cầu khi offline, gửi lại    Retry thành công
                       khi online                              

  **Notification**     Hiển thị cảnh báo đẩy và toast thông    User được cảnh
                       báo                                     báo tức thì
  ------------------------------------------------------------------------------

**III. KIẾN TRÚC HỆ THỐNG**

**1. Tổng thể**

\[Frontend PWA\] \<-\> \[API Gateway / Server\]

│

├─ GET /safety/score → Risk analysis

├─ GET /map/pois → Safe POIs & shelters

├─ GET /alerts/history → Hazard feed

├─ POST /sos/activate → Emergency signal

└─ GET /users/me → JWT validation

**2. Thành phần chính**

  -------------------------------------------------------------------------
  **Thành phần**                      **Vai trò**
  ----------------------------------- -------------------------------------
  src/api/client.ts                   Kết nối Axios, đính kèm token tự động

  src/api/alerts.ts                   Lấy danh sách cảnh báo

  src/api/sos.ts                      Gửi yêu cầu SOS

  src/utils/pwaQueue.ts               Quản lý hàng đợi khi offline

  src/components/alert/AlertHub.tsx   Giao diện hiển thị cảnh báo

  src/components/sos/SOSButton.tsx    Nút gửi tín hiệu SOS

  src/hooks/useAuth.ts                Kiểm tra và refresh token người dùng
  -------------------------------------------------------------------------

**IV. CÁCH TÍCH HỢP API THẬT**

**1. Chuẩn bị môi trường**

Tạo file .env:

VITE_API_BASE_URL=https://api.yourdomain.com/api/v1

VITE_API_TOKEN=\<JWT hoặc token test\>

**2. Cấu hình axios client**

export const api = axios.create({

baseURL: import.meta.env.VITE_API_BASE_URL,

headers: { \"Content-Type\": \"application/json\" }

});

api.interceptors.request.use(cfg =\> {

const token = localStorage.getItem(\"token\") \|\|
import.meta.env.VITE_API_TOKEN;

if (token) cfg.headers.Authorization = \`Bearer \${token}\`;

return cfg;

});

**3. Tích hợp vào tính năng ALERT**

// src/api/alerts.ts

export async function fetchAlerts() {

const { data } = await api.get(\"/alerts/history\");

return Array.isArray(data) ? data : data.alerts;

}

-   Gọi trong AlertHub.tsx để hiển thị danh sách cảnh báo.

-   Mỗi cảnh báo chứa: id, title, severity, lat, lon, issuedAt.

-   Các marker trên bản đồ được cập nhật theo dữ liệu thật từ API.

**4. Tích hợp vào tính năng SOS**

// src/api/sos.ts

export async function sendSOS(payload) {

return (await api.post(\"/sos/activate\", payload)).data;

}

-   Khi người dùng nhấn nút SOS, app:

    1.  Lấy vị trí GPS hiện tại
        (navigator.geolocation.getCurrentPosition),

    2.  Gửi request SOS tới server,

    3.  Hiển thị kết quả (SOS sent successfully),

    4.  Nếu offline → lưu request vào IndexedDB.

**V. LUỒNG HOẠT ĐỘNG**

**1. Alert Flow**

1.  FE khởi động → gọi GET /alerts/history.

2.  API trả về danh sách cảnh báo gần vị trí người dùng.

3.  Ứng dụng hiển thị danh sách + marker màu theo độ nghiêm trọng.

4.  Khi có cảnh báo mới → hiển thị **popup + notification toast**.

5.  User có thể:

    -   "Xem chi tiết" → mở bản đồ tại vị trí đó,

    -   "Đánh dấu đã đọc" → cập nhật trạng thái local,

    -   "Chia sẻ" → gửi qua social/app khác.

**2. SOS Flow**

1.  User nhấn giữ nút **SOS** 2 giây → hiện cửa sổ xác nhận.

2.  App lấy vị trí hiện tại và thời gian.

3.  Nếu **online**:

    -   Gửi POST /sos/activate → server trả ticket ID.

    -   Hiển thị thông báo "SOS Sent Successfully".

4.  Nếu **offline**:

    -   Lưu request vào pwaQueue.

    -   Khi mạng trở lại → processQueue() tự động gửi đi.

5.  Lưu log trong local storage để hiển thị lại khi user mở app lần sau.

**VI. OFFLINE QUEUE (IndexedDB)**

Mỗi yêu cầu SOS hoặc cảnh báo chưa gửi được sẽ được lưu lại:

{

\"endpoint\": \"/api/v1/sos/activate\",

\"payload\":
{\"lat\":10.78,\"lon\":106.7,\"ts\":\"2025-11-07T00:00:00Z\"},

\"status\": \"pending\"

}

Khi online lại → app chạy hàm:

processQueue(async (url,body) =\> await api.post(url, body));

→ tự gửi lại từng request theo FIFO.

**VII. GIAO DIỆN NGƯỜI DÙNG**

  -----------------------------------------------------------------------
  **Thành phần**              **Mô tả**
  --------------------------- -------------------------------------------
  **Alert Hub**               Danh sách cảnh báo, có filter theo cấp độ

  **Map View**                Bản đồ động hiển thị vùng rủi ro thật

  **SOS Button**              Nút đỏ nổi bật, hiển thị trạng thái gửi

  **Notification Toast**      Thông báo popup khi có cảnh báo mới

  **Dark Mode / Responsive**  Giao diện tương thích thiết bị & chế độ nền
  -----------------------------------------------------------------------

**VIII. TEST CASES**

  --------------------------------------------------------------------------
  **ID**         **Mô tả**                   **Kỳ vọng**
  -------------- --------------------------- -------------------------------
  **API-001**    /safety/score trả về điểm   200 OK, có score, riskLevel
                 an toàn                     

  **API-002**    /alerts/history hoạt động   Danh sách hiển thị đủ alert

  **API-003**    /sos/activate online        Trả status: ok, hiển thị
                                             success

  **API-004**    /sos/activate offline       Lưu vào queue, gửi lại sau khi
                                             online

  **UI-001**     Alert Hub filter            Lọc đúng theo severity

  **UI-002**     SOSButton confirm           Xác nhận & gửi đúng payload

  **PWA-001**    Offline retry               Gửi lại khi có mạng

  **AUTH-001**   /users/me                   Trả thông tin user hợp lệ
  --------------------------------------------------------------------------

**IX. BẢO MẬT & QUYỀN RIÊNG TƯ**

-   Tất cả các request thực hiện qua HTTPS.

-   Token JWT được lưu tạm (LocalStorage / IndexedDB) và tự refresh sau
    2h.

-   Không log thông tin vị trí ra console.

-   SOS payload chỉ gồm tọa độ, userId, thời gian, thiết bị.
