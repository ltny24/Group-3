**Build PWA Interface (Mock Data)**

**1. Giới thiệu chung**

Giai đoạn 2 của dự án **Travel Safety Alert System** tập trung xây dựng
**giao diện ứng dụng (frontend)** trên nền tảng **Progressive Web App
(PWA)** --- cho phép người dùng cài đặt, hoạt động ngoại tuyến, và nhận
dữ liệu cảnh báo du lịch ngay cả khi không có kết nối mạng.

Đây là giai đoạn chuyển tiếp từ **Giai đoạn 1 -- Design Prototype
(Figma)** sang **sản phẩm web có thể chạy thật** bằng **React +
TypeScript + Vite**, với **Mock Data JSON** thay cho backend thật.

**Mục tiêu cụ thể**

-   Chuyển đổi nguyên mẫu giao diện Figma sang ứng dụng PWA thực tế.

-   Thiết lập **Web App Manifest** để hỗ trợ cài đặt (Installable).

-   Thiết lập **Service Worker (SW)** để đảm bảo **Offline Mode**.

-   Kết nối dữ liệu tạm qua **mock JSON** mô phỏng phản hồi API.

-   Kiểm thử khả năng hoạt động offline, routing, cache, và tốc độ tải.

**2. Giới thiệu về PWA (Progressive Web App)**

**2.1 Khái niệm**

**PWA** là một dạng ứng dụng web hiện đại kết hợp ưu điểm của web và
mobile app:

-   **Hoạt động offline.**

-   **Cài đặt được** như ứng dụng di động (Add to Home Screen).

-   **Tốc độ tải nhanh, cập nhật tự động.**

-   **Cảm giác sử dụng như native app.**

PWA dựa trên 3 thành phần cốt lõi:

| **Thành phần**          | **Mô tả**                                      | **File tương ứng trong dự án**           |
|--------------------------|------------------------------------------------|------------------------------------------|
| **Manifest**             | Cung cấp thông tin mô tả ứng dụng (tên, icon, start_url, display). | `public/manifest.webmanifest` |
| **Service Worker (SW)**  | Script chạy nền giúp cache dữ liệu và cho phép hoạt động offline. | `public/sw.js` |
| **HTTPS**                | Giao thức bảo mật bắt buộc để SW hoạt động.   | Vercel / Netlify / Firebase Hosting |


**3. Kiến trúc & cấu trúc dự án**

**3.1 Cấu trúc tổng thể**

project/

│

├─ index.html \# App shell (root) - mount #root

│

├─ public/

│ ├─ manifest.webmanifest \# Manifest file (Installable metadata)

│ ├─ sw.js \# Service Worker script

│ ├─ icons/

│ │ ├─ icon-192.png

│ │ ├─ icon-512.png

│ │ └─ icon-maskable.png

│ └─ mocks/

│ ├─ data-001.json \# Mock alert list

│ ├─ data-002.json \# Mock alert detail

│ └─ data-003.json \# Mock SOS response

│

├─ src/

│ ├─ main.tsx \# React entry point, register SW

│ ├─ App.tsx \# Routing + navigation bar

│ ├─ sw/

│ │ └─ register.ts \# Đăng ký Service Worker

│ └─ components/ \# Các màn hình giao diện

│ ├─ HomeScreen.tsx

│ ├─ MapScreen.tsx

│ ├─ AlertHubScreen.tsx

│ ├─ AlertDetailScreen.tsx

│ ├─ SOSScreen.tsx

│ ├─ HistoryScreen.tsx

│ ├─ SettingsScreen.tsx

│ ├─ ProfileScreen.tsx

│ ├─ HelpScreen.tsx

│ ├─ NotificationsScreen.tsx

│ └─ OfflineScreen.tsx

│

├─ package.json \# Thông tin dependency

└─ vite.config.ts \# Cấu hình build (Vite + React)

**4. Quy trình hoạt động của hệ thống**

**4.1 Luồng tổng quát**

1.  Trình duyệt tải index.html (App shell) → mount vào \<div
    id=\"root\"\>.

2.  src/main.tsx render React \<App/\> và gọi hàm
    registerServiceWorker().

3.  App.tsx dùng react-router-dom để điều hướng giữa các màn hình.

4.  Khi người dùng truy cập **/alerts**, app fetch
    public/mocks/data-001.json.

5.  SW (sw.js) intercept mọi request → lưu cache khi có mạng.

6.  Khi offline, SW trả dữ liệu từ cache, app vẫn hoạt động bình thường.

**4.2 Sơ đồ luồng hoạt động**

![A screenshot of a computer program AI-generated content may be
incorrect.](media/image1.png){width="5.493356299212598in"
height="3.5918099300087487in"}

**5. Service Worker (SW) -- Cơ chế hoạt động**

**5.1 Vòng đời SW**

| **Giai đoạn** | **Mô tả**             | **Hành động cụ thể trong `sw.js`** |
|----------------|----------------------|------------------------------------|
| **Install**    | Tải SW lần đầu       | Cache `index.html`, JS, CSS, icons, mock JSON |
| **Activate**   | Xóa cache cũ, kích hoạt SW mới | Gọi `clients.claim()` |
| **Fetch**      | Chặn request, trả từ cache | Dùng `caches.match()` và `fetch()` fallback |


**5.2 Chiến lược cache**

| **Loại dữ liệu**         | **Chiến lược**                     | **Mục tiêu**                    |
|---------------------------|------------------------------------|----------------------------------|
| App Shell (HTML/JS/CSS)   | Cache-first                        | Tốc độ tải nhanh                |
| Mock JSON (data)          | Cache-first + background update    | Dữ liệu vẫn hiển thị offline    |
| Route SPA                | Fallback `/index.html`             | Tránh lỗi 404 khi refresh       |
| Icon                      | Cache-only                         | Không thay đổi                 |


**5.3 Code Service Worker**

const CACHE = \'ts-pwa-v2\';

const PRECACHE = \[

\'/\', \'/index.html\', \'/manifest.webmanifest\',

\'/icons/icon-192.png\', \'/icons/icon-512.png\',
\'/icons/icon-maskable.png\',

\'/mocks/data-001.json\', \'/mocks/data-002.json\',
\'/mocks/data-003.json\'

\];

self.addEventListener(\'install\', (e) =\> {

e.waitUntil(caches.open(CACHE).then(c =\> c.addAll(PRECACHE)));

self.skipWaiting();

});

self.addEventListener(\'activate\', (e) =\> {

e.waitUntil(

caches.keys().then(keys =\> Promise.all(keys.map(k =\> k !== CACHE &&
caches.delete(k))))

);

self.clients.claim();

});

self.addEventListener(\'fetch\', (e) =\> {

if (e.request.method !== \'GET\') return;

const url = new URL(e.request.url);

if (url.origin === location.origin) {

e.respondWith(

caches.match(e.request).then(cached =\>

cached \|\| fetch(e.request).then(res =\> {

const copy = res.clone();

caches.open(CACHE).then(c =\> c.put(e.request, copy));

return res;

}).catch(() =\> caches.match(\'/index.html\')) // SPA fallback

)

);

}

});

**6. Web App Manifest -- Cấu hình Installable**

**File: public/manifest.webmanifest**

{

\"name\": \"Travel Safety\",

\"short_name\": \"Safety\",

\"start_url\": \"/\",

\"scope\": \"/\",

\"display\": \"standalone\",

\"background_color\": \"#ffffff\",

\"theme_color\": \"#0ea5e9\",

\"icons\": \[

{ \"src\": \"/icons/icon-192.png\", \"sizes\": \"192x192\", \"type\":
\"image/png\" },

{ \"src\": \"/icons/icon-512.png\", \"sizes\": \"512x512\", \"type\":
\"image/png\" },

{ \"src\": \"/icons/icon-maskable.png\", \"sizes\": \"512x512\",
\"type\": \"image/png\", \"purpose\": \"maskable any\" }

\]

}

-   Biểu tượng chính là **chiếc ô màu trắng nền xanh**, định dạng PNG.

-   Khi người dùng truy cập, Chrome nhận diện Manifest + SW → hiển thị
    "**Install Travel Safety**".

**7. Fetch Mock Data và Liên kết Backend**

**7.1 Hiện tại (Mock Mode)**

-   Các file JSON đặt trong public/mocks/.

-   Gọi bằng fetch(\'/mocks/data-001.json\').

**Ví dụ dữ liệu:**

{

\"alerts\": \[

{ \"id\": \"A001\", \"title\": \"Tropical Storm\", \"severity\":
\"High\", \"location\": \"Ha Long Bay\" },

{ \"id\": \"A002\", \"title\": \"Heavy Rain\", \"severity\":
\"Moderate\", \"location\": \"Da Nang\" }

\]

}

**7.2 Khi kết nối Backend thật**

-   Base URL cấu hình qua .env:

-   VITE_API_BASE_URL=https://api.travelsafety.vn

-   Gọi API:

-   const API_BASE = import.meta.env.VITE_API_BASE_URL;

-   fetch(\`\${API_BASE}/alerts\`)

-   Backend trả JSON có cùng schema với mock → không cần thay đổi giao
    diện.

**8. Offline Mode -- Kiểm thử thực tế**

**Bước kiểm tra:**

1.  Chạy npm run dev.

2.  Mở Chrome DevTools → tab **Application → Service Worker**.

3.  Tick "Offline".

4.  Refresh lại trang.

**Kết quả:**

-   App vẫn hiển thị giao diện, danh sách cảnh báo từ cache.

-   Dữ liệu mock được load từ cache, không cần mạng.

-   Khi online trở lại, SW tự động cập nhật phiên bản mới.
