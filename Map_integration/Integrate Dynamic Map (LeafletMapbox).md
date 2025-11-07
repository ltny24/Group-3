**TÍCH HỢP BẢN ĐỒ ĐỘNG (DYNAMIC MAP INTEGRATION)**

**I. GIỚI THIỆU CHUNG**

**1. Bối cảnh**

Sau khi hoàn tất giai đoạn thiết kế nguyên mẫu (Giai đoạn 1) và xây dựng
giao diện cơ bản (Giai đoạn 2), hệ thống bước sang **Giai đoạn 3 -- Tích
hợp Bản đồ Động (Dynamic Map Integration)**.\
Mục tiêu của giai đoạn này là mô phỏng khả năng **giám sát khu vực rủi
ro và cảnh báo vị trí nguy hiểm** trên bản đồ theo thời gian thực ---
một phần cốt lõi của ứng dụng **Hệ thống Cảnh báo An toàn Du lịch Thông
minh (Smart Travel Safety Alert System)**.

**2. Phạm vi**

-   Tích hợp bản đồ (Leaflet/Mapbox) vào giao diện React.

-   Hiển thị vùng rủi ro (Polygon) và điểm cảnh báo (Marker) dựa trên dữ
    liệu giả lập (mock GeoJSON).

-   Cho phép tương tác trực tiếp: click để xem thông tin chi tiết.

-   Chuẩn bị cho khả năng **tích hợp dữ liệu thời gian thực** trong giai
    đoạn 4.

**II. MỤC TIÊU CHI TIẾT**

| **Nhóm mục tiêu** | **Mô tả cụ thể** | **Kết quả mong đợi** |
|--------------------|------------------|------------------------|
| **Technical Goal 1** | Kết nối và hiển thị bản đồ động bằng thư viện Leaflet | Bản đồ hiển thị nền OSM và dữ liệu GeoJSON |
| **Technical Goal 2** | Vẽ vùng rủi ro (Polygon) từ dữ liệu mô phỏng | Các vùng được tô màu theo cấp độ rủi ro |
| **Technical Goal 3** | Vẽ các điểm cảnh báo (Marker) | Marker hiển thị biểu tượng và popup thông tin |
| **Technical Goal 4** | Cho phép người dùng tương tác (click/zoom/pan) | Có thể xem chi tiết rủi ro và điều hướng bản đồ mượt mà |
| **Technical Goal 5** | Tích hợp cơ chế cache offline (PWA-ready) | App vẫn hiển thị khi offline |
| **UI/UX Goal** | Giao diện trực quan, rõ ràng, dễ hiểu | Màu sắc và popup phân biệt từng cấp độ nguy hiểm |
| **Testing Goal** | Có thể kiểm thử theo kịch bản MAP, INT, PERF, OFF | Từng mục tiêu có thể được xác minh độc lập |


**III. KIẾN TRÚC VÀ LUỒNG HOẠT ĐỘNG**

**1. Sơ đồ tổng quát**

\[Frontend PWA App\]

\|

├── fetch(\"/data/zones.geojson\") → Render Polygon (Risk Zones)

├── fetch(\"/data/markers.geojson\") → Render Markers (Alerts)

└── TileLayer (OpenStreetMap) → Nền bản đồ

\[User Interaction\]

├── Click Polygon → Popup chi tiết khu vực

├── Click Marker → Popup thông tin cảnh báo

└── Zoom / Pan → Thay đổi vùng hiển thị

**2. Công nghệ sử dụng**

| **Thành phần** | **Mô tả** |
|-----------------|-----------|
| **React + TypeScript** | Framework chính cho frontend |
| **Leaflet.js + React-Leaflet** | Thư viện bản đồ động |
| **OpenStreetMap TileLayer** | Nguồn nền bản đồ miễn phí |
| **GeoJSON** | Định dạng dữ liệu vùng rủi ro và cảnh báo |
| **Service Worker / Workbox** | Hỗ trợ cache và hoạt động offline |
| **Supercluster (optional)** | Gom nhóm (clustering) marker |


**IV. CẤU TRÚC HỆ THỐNG**

phase3_map_integration

├── src/

│ └── components/map/

│ └── DynamicMap.tsx ← component bản đồ chính

├── public/

│ └── data/

│ ├── zones.geojson ← dữ liệu vùng rủi ro (Polygon)

│ └── markers.geojson ← dữ liệu cảnh báo (Point)

└── docs/

└── Phase3_MapIntegration_Report.md

**V. MÔ TẢ DỮ LIỆU**

**1. File zones.geojson --- Vùng rủi ro**

**Định dạng:** GeoJSON FeatureCollection\
**Mỗi Feature gồm:**

-   geometry.type: \"Polygon\"

-   geometry.coordinates: mảng các tọa độ \[lng, lat\]

-   properties:

    -   id --- mã vùng

    -   name --- tên vùng

    -   riskLevel --- \"low\" \| \"moderate\" \| \"high\" \|
        \"critical\"

    -   hazard --- \"storm\" \| \"flood\" \| \"landslide\" \| \"heat\"
        \| \...

    -   color --- màu hiển thị (hex)

    -   updatedAt --- thời gian cập nhật

**Ví dụ:**

{

\"type\": \"Feature\",

\"geometry\": {

\"type\": \"Polygon\",

\"coordinates\": \[\[\[106.68,
10.78\],\[106.70,10.80\],\[106.73,10.79\],\[106.72,10.76\],\[106.68,10.78\]\]\]

},

\"properties\": {

\"id\": \"Z1\",

\"name\": \"Impact Zone 1\",

\"riskLevel\": \"moderate\",

\"hazard\": \"storm\",

\"color\": \"#fde68a\",

\"updatedAt\": \"2025-11-07T00:00:00Z\"

}

}

**2. File markers.geojson --- Điểm cảnh báo**

**Định dạng:** GeoJSON FeatureCollection\
**Mỗi Feature gồm:**

-   geometry.type: \"Point\"

-   geometry.coordinates: \[lng, lat\]

-   properties:

    -   id, title, severity, type, issuedAt, expiresAt

**Ví dụ:**

{

\"type\": \"Feature\",

\"geometry\": { \"type\": \"Point\", \"coordinates\": \[106.705,
10.785\] },

\"properties\": {

\"id\": \"A1\",

\"title\": \"STORM alert #1\",

\"severity\": 3,

\"type\": \"storm\",

\"source\": \"mock\",

\"issuedAt\": \"2025-11-07T00:00:00Z\",

\"expiresAt\": \"2025-11-07T03:00:00Z\"

}

}

**VI. LOGIC HOẠT ĐỘNG (DynamicMap.tsx)**

1.  **Fetch dữ liệu**

2.  useEffect(() =\> {

3.  fetch(\"/data/zones.geojson\").then(r =\> r.json()).then(setZones);

4.  fetch(\"/data/markers.geojson\").then(r =\>
    r.json()).then(setAlerts);

5.  }, \[\]);

6.  **Hiển thị vùng (GeoJSON layer)**

7.  \<GeoJSON

8.  data={zones}

9.  style={f =\> ({ color: f.properties.color, fillOpacity: 0.3 })}

10. onEachFeature={(f, layer) =\> {

11. layer.bindPopup(

12. \`\<b\>\${f.properties.name}\</b\>\<br/\>Risk:
    \${f.properties.riskLevel}\<br/\>Hazard: \${f.properties.hazard}\`

13. );

14. }}

15. /\>

16. **Hiển thị điểm cảnh báo**

17. {alerts?.features?.map(f =\> (

18. \<Marker key={f.properties.id}
    position={\[f.geometry.coordinates\[1\],
    f.geometry.coordinates\[0\]\]}\>

19. \<Popup\>

20. \<b\>{f.properties.title}\</b\>\<br/\>Severity:
    {f.properties.severity}\<br/\>Type: {f.properties.type}

21. \</Popup\>

22. \</Marker\>

23. ))}

**VII. PWA & OFFLINE CACHE**

**1. Cấu hình**

-   Thêm zones.geojson và markers.geojson vào danh sách precache trong
    service-worker.js.

-   Chiến lược CacheFirst hoặc StaleWhileRevalidate.

**2. Test case OFF-001**

| **Bước** | **Kỳ vọng** |
|-----------|-------------|
| 1. Mở app online | Bản đồ + dữ liệu hiển thị bình thường |
| 2. Tắt mạng, reload | Các polygon và marker vẫn hiển thị |
| 3. Xóa cache và reload offline | Dữ liệu không tải được (đúng kỳ vọng) |


**VIII. TESTING PLAN**

| **ID** | **Kiểm thử** | **Mô tả** | **Kết quả mong đợi** |
|---------|--------------|-----------|-----------------------|
| MAP-001 | Render Map | Bản đồ hiển thị vùng rủi ro | OK |
| MAP-002 | Layer Style | Màu vùng khớp properties.color | OK |
| INT-001 | Click Polygon | Popup hiển thị name/riskLevel/hazard | OK |
| INT-002 | Click Marker | Popup hiển thị title/severity/type | OK |
| PERF-001 | 300 Marker Test | Không lag ở zoom 10–12 | OK |
| OFF-001 | Offline Cache | Dữ liệu vẫn hiển thị khi offline | OK |


**IX. VẤN ĐỀ PHÁT SINH & GIẢI PHÁP**

 | **Vấn đề** | **Nguyên nhân** | **Giải pháp** |
|-------------|-----------------|---------------|
| Icon Marker không hiện | Sai đường dẫn ảnh | Gán icon URL thủ công |
| Bản đồ trắng | Thiếu CSS Leaflet | Import `leaflet.css` |
| Polygon không hiển thị | Sai cấu trúc GeoJSON | Kiểm tra mảng coordinates |
| Lỗi khi build PWA | Thiếu precache file | Thêm vào `workbox.config.js` |


**X. HƯỚNG PHÁT TRIỂN**

-   **Kết nối API thật** từ cơ quan khí tượng, cứu hộ.

-   **Tự động cập nhật dữ liệu** mỗi 15 phút qua cron job.

-   **Tạo bộ lọc thông minh** (lọc theo khu vực, loại rủi ro, mức độ
    nghiêm trọng).

-   **Thêm Heatmap** biểu diễn mật độ cảnh báo.

-   **Giao diện responsive** tối ưu cho mobile.
