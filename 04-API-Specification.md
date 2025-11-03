# 04. ĐẶC TẢ API (API Specification)

**Dự án:** Intelligent Travel Safety System (PWA)  
**Phiên bản:** 1.1 (Bổ sung CRUD SOS & API Map Service)  
**Dựa trên:** 03-System-Architecture.md (Kiến trúc Microservices)  
**Mô tả:** Tài liệu này đặc tả các endpoint API công khai (Exposed by API Gateway A-02) mà PWA Client (A-01) sẽ sử dụng.

---

## I. CÁC TIÊU CHUẨN CHUNG

| Mục | Chi tiết | Ghi chú |
|-----|----------|---------|
| Kiến trúc | RESTful API | Sử dụng các HTTP method chuẩn (GET, POST, PUT, DELETE). |
| Cổng (Port) | 443 (HTTPS) | Bắt buộc phải qua HTTPS. |
| Định dạng Dữ liệu | JSON | Toàn bộ Request Body và Response Body. |
| Xác thực | JSON Web Token (JWT) | Yêu cầu Header `Authorization: Bearer <token>` cho các endpoint bảo mật. |
| Định dạng Thời gian | ISO 8601 | VD: `2024-11-03T09:00:00Z`. |

---

## II. SERVICE: USER & AUTH (A-05)

### 1. Đăng ký Tài khoản (User Registration)

- **Method:** POST  
- **Endpoint:** `/api/v1/auth/register`  
- **Mô tả:** Tạo tài khoản người dùng mới.  
- **Bảo mật:** Public  

**Request Body**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Success (201)**
```json
{
  "user_id": "UUID",
  "message": "User created successfully"
}
```

**Response Error (400)**
```json
{
  "error": "Email already registered",
  "code": "AUTH_EMAIL_EXIST"
}
```

---

### 2. Đăng nhập (User Login)

- **Method:** POST  
- **Endpoint:** `/api/v1/auth/login`  
- **Mô tả:** Xác thực người dùng và cấp JWT.  
- **Bảo mật:** Public  

**Request Body**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Success (200)**
```json
{
  "access_token": "string (JWT)",
  "token_type": "Bearer",
  "expires_in": 7200
}
```

**Response Error (401)**
```json
{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID_CRED"
}
```

---

### 3. Lấy thông tin Cá nhân (Get User Profile)

- **Method:** GET  
- **Endpoint:** `/api/v1/users/me`  
- **Mô tả:** Lấy thông tin chi tiết của người dùng đang đăng nhập.  
- **Bảo mật:** JWT Required  

**Response Success (200)**
```json
{
  "user_id": "UUID",
  "email": "string",
  "saved_locations": [
    {"id": "UUID", "name": "string", "lat": double, "lon": double}
  ],
  "sos_contacts": [
    {"id": "UUID", "name": "string", "phone": "string", "relationship": "string"}
  ]
}
```

---

### 4. Cập nhật Thông tin Cá nhân (Update User Profile)

- **Method:** PUT  
- **Endpoint:** `/api/v1/users/me`  
- **Mô tả:** Cập nhật thông tin (ví dụ: email, password, setting).  
- **Bảo mật:** JWT Required  

**Request Body**
```json
{
  "email": "string (optional)",
  "new_password": "string (optional)"
}
```

**Response Success (200)**
```json
{
  "user_id": "UUID",
  "message": "Profile updated successfully"
}
```

**Response Error (403)**
```json
{
  "error": "Forbidden: Current password incorrect",
  "code": "AUTH_FORBIDDEN"
}
```

---

### 5. Quản lý Vị trí Quan tâm (Saved Locations)

- **Method:** POST  
- **Endpoint:** `/api/v1/users/locations`  
- **Mô tả:** Thêm một vị trí quan tâm mới.  
- **Bảo mật:** JWT Required  

- **Method:** DELETE  
- **Endpoint:** `/api/v1/users/locations/{location_id}`  
- **Mô tả:** Xóa vị trí quan tâm theo ID.  
- **Bảo mật:** JWT Required  

**POST Request Body**
```json
{
  "name": "string (Home/Work/etc.)",
  "lat": double,
  "lon": double
}
```

**POST Response Success (201)**
```json
{
  "location_id": "UUID",
  "message": "Location saved"
}
```

---

### 6. Quản lý Liên hệ Khẩn cấp (SOS Contacts)

- **Method:** POST  
- **Endpoint:** `/api/v1/users/contacts`  
- **Mô tả:** Thêm một liên hệ khẩn cấp mới (Tối đa 3).  
- **Bảo mật:** JWT Required  

- **Method:** PUT  
- **Endpoint:** `/api/v1/users/contacts/{contact_id}`  
- **Mô tả:** Cập nhật chi tiết liên hệ SOS.  
- **Bảo mật:** JWT Required  

- **Method:** DELETE  
- **Endpoint:** `/api/v1/users/contacts/{contact_id}`  
- **Mô tả:** Xóa liên hệ khẩn cấp theo ID.  
- **Bảo mật:** JWT Required  

**POST Request Body**
```json
{
  "name": "string",
  "phone": "string (E.164)",
  "relationship": "string (Family/Friend)"
}
```

**POST Response Success (201)**
```json
{
  "contact_id": "UUID",
  "message": "Contact added"
}
```

**POST Response Error (400)**
```json
{
  "error": "Maximum 3 contacts allowed",
  "code": "CONTACT_MAX_LIMIT"
}
```

---

## III. SERVICE: AI ENGINE (A-04)

### 1. Lấy Điểm An toàn (Get Safety Score)

- **Method:** GET  
- **Endpoint:** `/api/v1/safety/score`  
- **Mô tả:** Tính toán hoặc lấy Điểm An toàn (0.0 - 1.0) tại một tọa độ cụ thể.  
- **Bảo mật:** Public (Rate Limited)  

**Request Query Parameters**
- `lat` (double, Bắt buộc)  
- `lon` (double, Bắt buộc)  

**Response Success (200)**
```json
{
  "latitude": double,
  "longitude": double,
  "score_value": double (0.0 - 1.0),
  "model_version": "v1.1",
  "cached": boolean
}
```

**Response Error (429)**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT"
}
```

---

## IV. SERVICE: SOS (A-07)

### 1. Kích hoạt SOS (Activate Emergency)

- **Method:** POST  
- **Endpoint:** `/api/v1/sos/activate`  
- **Mô tả:** Kích hoạt chu trình khẩn cấp, gửi thông báo đến các liên hệ và dịch vụ.  
- **Bảo mật:** JWT Required  

**Request Body**
```json
{
  "location": {"lat": double, "lon": double},
  "battery_level": integer,
  "offline_mode": boolean (true nếu từ SW queue)
}
```

**Response Success (202)**
```json
{
  "sos_id": "UUID",
  "message": "SOS signal accepted and processing"
}
```

**Response Error (400)**
```json
{
  "error": "Missing required data",
  "code": "SOS_MISSING_DATA"
}
```

---

## V. SERVICE: ALERT HUB (A-03)

### 1. Lịch sử Cảnh báo (Alert History)

- **Method:** GET  
- **Endpoint:** `/api/v1/alerts/history`  
- **Mô tả:** Lấy lịch sử các cảnh báo đã nhận/đã xảy ra trong khu vực của người dùng.  
- **Bảo mật:** JWT Required  

**Request Query Parameters**
- `limit` (integer, Mặc định 20)  
- `offset` (integer)  
- `severity` (optional: 1-5)  

**Response Success (200)**
```json
{
  "total": 50,
  "alerts": [
    {
      "id": "UUID",
      "title": "string",
      "severity": 4,
      "polygon_geojson": "GeoJSON MultiPolygon",
      "received_at": "ISO 8601"
    }
  ]
}
```

---

## VI. SERVICE: MAP SERVICE (A-06)

### 1. Lấy Vector Tiles (Map Tiles)

- **Method:** GET  
- **Endpoint:** `/api/v1/map/tiles/{z}/{x}/{y}`  
- **Mô tả:** Lấy Vector Tile theo chuẩn Z/X/Y để render bản đồ rủi ro.  
- **Bảo mật:** Public (Highly Cached)  

**Response Success (200)**
- Binary/Vector Tile Data (`application/vnd.mapbox-vector-tile`)  

**Response Error (404)**
```json
{
  "error": "Tile not found",
  "code": "MAP_TILE_404"
}
```

---

### 2. Lấy Điểm Quan tâm (POI - Points of Interest)

- **Method:** GET  
- **Endpoint:** `/api/v1/map/pois`  
- **Mô tả:** Lấy danh sách POI (Shelters, Hospitals) trong phạm vi hiển thị.  
- **Bảo mật:** Public (Rate Limited)  

**Request Query Parameters**
- `bbox` (string, Bắt buộc: minLon,minLat,maxLon,maxLat)  

**Response Success (200)**
```json
{
  "pois": [
    {
      "id": "UUID",
      "name": "string",
      "type": "Shelter/Hospital",
      "lat": double,
      "lon": double,
      "distance_km": double
    }
  ]
}
```
