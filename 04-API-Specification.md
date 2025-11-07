# 04. ĐẶC TẢ API (API Specification)

**Dự án:** Intelligent Travel Safety System (PWA)  
**Phiên bản:** 1.3 (Hoàn thiện Đặc tả OpenAPI)  
**Dựa trên:** 03-System-Architecture.md (Kiến trúc Microservices)  
**Mô tả:** Tài liệu này đặc tả các endpoint API công khai (Exposed by API Gateway A-02) mà PWA Client (A-01) sẽ sử dụng, đồng thời cung cấp đặc tả OpenAPI để phục vụ công cụ tự động.

---

## I. CÁC TIÊU CHUẨN CHUNG

| Mục | Chi tiết | Ghi chú |
|-----|---------|---------|
| Kiến trúc | RESTful API | Sử dụng các HTTP method chuẩn (GET, POST, PUT, DELETE). |
| Cổng (Port) | 443 (HTTPS) | Bắt buộc phải qua HTTPS. |
| Định dạng Dữ liệu | JSON | Toàn bộ Request Body và Response Body. |
| Xác thực | JSON Web Token (JWT) | Yêu cầu Header Authorization: Bearer `<token>` cho các endpoint bảo mật. |
| Định dạng Thời gian | ISO 8601 | VD: 2024-11-03T09:00:00Z. |

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

### 3. Lấy thông tin Cá nhân (Get User Profile)
- **Method:** GET  
- **Endpoint:** `/api/v1/users/me`  
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

### 4. Cập nhật Thông tin Cá nhân (Update User Profile)
- **Method:** PUT  
- **Endpoint:** `/api/v1/users/me`  
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

### 5. Quản lý Vị trí Quan tâm (Saved Locations)
- **POST `/users/locations`**: Thêm vị trí quan tâm mới (JWT Required)  
- **DELETE `/users/locations/{location_id}`**: Xóa vị trí quan tâm theo ID (JWT Required)  

**Request Body (POST)**
```json
{
  "name": "string (Home/Work/etc.)",
  "lat": double,
  "lon": double
}
```

**Response Success (201)**
```json
{
  "location_id": "UUID",
  "message": "Location saved"
}
```

### 6. Quản lý Liên hệ Khẩn cấp (SOS Contacts)
- **POST `/users/contacts`**: Thêm liên hệ mới (JWT Required)  
- **PUT `/users/contacts/{contact_id}`**: Cập nhật chi tiết (JWT Required)  
- **DELETE `/users/contacts/{contact_id}`**: Xóa liên hệ theo ID (JWT Required)  

**Request Body (POST)**
```json
{
  "name": "string",
  "phone": "string (E.164)",
  "relationship": "string (Family/Friend)"
}
```

**Response Success (201)**
```json
{
  "contact_id": "UUID",
  "message": "Contact added"
}
```

**Response Error (400)**
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
- **Bảo mật:** Public (Rate Limited)  

**Query Parameters**
- `lat` (double, required)
- `lon` (double, required)

**Response Success (200)**
```json
{
  "latitude": double,
  "longitude": double,
  "score_value": double (0.0-1.0),
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
- **Bảo mật:** JWT Required  

**Request Body**
```json
{
  "location": {"lat": double, "lon": double},
  "battery_level": integer,
  "offline_mode": boolean
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
- **Bảo mật:** JWT Required  

**Query Parameters**
- `limit` (integer, default 20)
- `offset` (integer)
- `severity` (1-5, optional)

**Response Success (200)**
```json
{
  "total": 50,
  "alerts": [
    {"id": "UUID", "title": "string", "severity": 4, "polygon_geojson": "GeoJSON MultiPolygon", "received_at": "ISO 8601"}
  ]
}
```

---

## VI. SERVICE: MAP SERVICE (A-06)

### 1. Lấy Vector Tiles (Map Tiles)
- **Method:** GET  
- **Endpoint:** `/api/v1/map/tiles/{z}/{x}/{y}`  
- **Bảo mật:** Public (Highly Cached)  

**Response Success (200)**: Binary/Vector Tile Data (`application/vnd.mapbox-vector-tile`)  
**Response Error (404)**
```json
{
  "error": "Tile not found",
  "code": "MAP_TILE_404"
}
```

### 2. Lấy Điểm Quan tâm (POI)
- **Method:** GET  
- **Endpoint:** `/api/v1/map/pois`  
- **Bảo mật:** Public (Rate Limited)  

**Query Parameters**
- `bbox` (string, required: minLon,minLat,maxLon,maxLat)

**Response Success (200)**
```json
{
  "pois": [
    {"id": "UUID", "name": "string", "type": "Shelter/Hospital", "lat": double, "lon": double, "distance_km": double}
  ]
}
```

---

## VII. ĐẶC TẢ OPENAPI/SWAGGER (YAML)
Đặc tả OpenAPI 3.0 đầy đủ schema, security, và paths đã được tích hợp cho các service: Auth, User, AI Engine, SOS, Alert Hub



```yaml
openapi: 3.0.0
info:
  title: Intelligent Travel Safety PWA API
  version: 1.3.0
  description: |
    Đặc tả API công khai cho Ứng dụng PWA 
    (Service: Auth, AI, SOS, Alert, Map)
    
    **Security:**
    - JWT Bearer Token cho endpoints bảo mật
    - Rate Limiting cho endpoints public
    - HTTPS bắt buộc

servers:
  - url: https://api.travel-safety.com/api/v1
    description: Production API Gateway
  - url: /api/v1
    description: Local development

components:
  securitySchemes:
    JWTAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token nhận được từ endpoint /auth/login

  schemas:
    # === SCHEMAS CƠ BẢN ===
    ErrorResponse:
      type: object
      required: [error, code]
      properties:
        error:
          type: string
          description: Message lỗi human-readable
        code:
          type: string
          description: Mã lỗi cho xử lý tự động
      example:
        error: "Email already registered"
        code: "AUTH_EMAIL_EXIST"

    UserRegistration:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
          example: "user@example.com"
        password:
          type: string
          minLength: 8
          example: "securePassword123"
      description: Thông tin đăng ký người dùng mới

    AuthToken:
      type: object
      properties:
        access_token: 
          type: string
          description: JWT token cho xác thực
        token_type: 
          type: string 
          enum: [Bearer]
        expires_in: 
          type: integer 
          description: 'Thời gian hết hạn tính bằng giây (7200s = 2 giờ)'
      example:
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        token_type: "Bearer"
        expires_in: 7200
    
    # === SCHEMAS ENTITY (Kế thừa từ ERD) ===
    SavedLocation:
      type: object
      required: [id, name, lat, lon]
      properties:
        id: 
          type: string
          format: uuid
          example: "123e4567-e89b-12d3-a456-426614174000"
        name: 
          type: string
          example: "Nhà riêng"
        lat: 
          type: number
          format: double
          example: 10.762622
        lon: 
          type: number
          format: double
          example: 106.660172

    SOSContact:
      type: object
      required: [id, name, phone, relationship]
      properties:
        id: 
          type: string
          format: uuid
        name: 
          type: string
          example: "Nguyễn Văn A"
        phone: 
          type: string
          description: 'Định dạng E.164'
          example: "+84123456789"
        relationship: 
          type: string
          example: "Gia đình"

    UserProfile:
      type: object
      properties:
        user_id: 
          type: string
          format: uuid
        email: 
          type: string
          format: email
        saved_locations:
          type: array
          items:
            $ref: '#/components/schemas/SavedLocation'
        sos_contacts:
          type: array
          items:
            $ref: '#/components/schemas/SOSContact'

    # === SCHEMAS CẢNH BÁO/RỦI RO ===
    SafetyScore:
      type: object
      properties:
        latitude: 
          type: number
          format: double
        longitude: 
          type: number
          format: double
        score_value: 
          type: number
          format: double
          minimum: 0.0
          maximum: 1.0
          description: 'Điểm an toàn từ 0.0 (nguy hiểm) đến 1.0 (an toàn)'
        model_version: 
          type: string
          example: "v1.1"
        cached: 
          type: boolean
          description: 'Kết quả có được từ cache hay không'

    AlertSummary:
      type: object
      properties:
        id: 
          type: string
          format: uuid
        title: 
          type: string
          example: "Bão số 9 đổ bộ"
        severity: 
          type: integer
          minimum: 1
          maximum: 5
          description: 'Mức độ nghiêm trọng (1: Thấp, 5: Cao)'
        polygon_geojson: 
          type: string
          description: 'GeoJSON MultiPolygon string'
        received_at: 
          type: string
          format: date-time
    
    # === SCHEMAS MAP/POI ===
    POI:
      type: object
      properties:
        id: 
          type: string
          format: uuid
        name: 
          type: string
          example: "Trạm cứu hộ Quận 1"
        type: 
          type: string
          enum: [Shelter, Hospital]
        lat: 
          type: number
          format: double
        lon: 
          type: number
          format: double
        distance_km: 
          type: number
          format: double
          description: 'Khoảng cách từ vị trí hiện tại (km)'

paths:
  # === AUTH ENDPOINTS ===
  /auth/register:
    post:
      tags: [Auth]
      summary: Đăng ký tài khoản người dùng mới
      description: Tạo tài khoản mới với email và password
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
      responses:
        '201':
          description: Tạo tài khoản thành công
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: string
                    format: uuid
                  message:
                    type: string
        '400':
          description: Email đã tồn tại hoặc dữ liệu không hợp lệ
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /auth/login:
    post:
      tags: [Auth]
      summary: Đăng nhập và lấy JWT
      description: Xác thực người dùng và trả về access token
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
      responses:
        '200':
          description: Đăng nhập thành công
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthToken'
        '401':
          description: Thông tin đăng nhập không hợp lệ
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  # === USER PROFILE & SETTINGS ENDPOINTS ===
  /users/me:
    get:
      tags: [User]
      summary: Lấy thông tin chi tiết của người dùng đang đăng nhập
      description: Trả về profile đầy đủ bao gồm locations và contacts
      operationId: getUserProfile
      security:
        - JWTAuth: []
      responses:
        '200':
          description: Thành công
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '401':
          description: Unauthorized - Token không hợp lệ hoặc hết hạn

    put:
      tags: [User]
      summary: Cập nhật thông tin cá nhân
      description: Cập nhật email hoặc mật khẩu mới
      operationId: updateUserProfile
      security:
        - JWTAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                new_password:
                  type: string
                  minLength: 8
      responses:
        '200':
          description: Cập nhật thành công
          content:
            application/json:
              schema:
                type: object
                properties:
                  user_id:
                    type: string
                    format: uuid
                  message:
                    type: string
        '403':
          description: Forbidden - Mật khẩu cũ không đúng
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          
  # === SAVED LOCATIONS ENDPOINTS ===
  /users/locations:
    post:
      tags: [User]
      summary: Thêm một vị trí quan tâm mới
      description: Lưu vị trí quan trọng như nhà, cơ quan...
      operationId: addSavedLocation
      security:
        - JWTAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, lat, lon]
              properties:
                name:
                  type: string
                  example: "Công ty"
                lat:
                  type: number
                  format: double
                lon:
                  type: number
                  format: double
      responses:
        '201':
          description: Tạo location thành công
          content:
            application/json:
              schema:
                type: object
                properties:
                  location_id:
                    type: string
                    format: uuid
                  message:
                    type: string
        '401':
          description: Unauthorized
          
  /users/locations/{location_id}:
    delete:
      tags: [User]
      summary: Xóa vị trí quan tâm theo ID
      operationId: deleteSavedLocation
      security:
        - JWTAuth: []
      parameters:
        - name: location_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '204':
          description: Xóa thành công (No Content)

  # === SOS CONTACTS ENDPOINTS (CRUD) ===
  /users/contacts:
    post:
      tags: [User]
      summary: Thêm liên hệ khẩn cấp mới (Tối đa 3)
      description: Thêm liên hệ SOS, giới hạn tối đa 3 contacts
      operationId: addSOSContact
      security:
        - JWTAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, phone, relationship]
              properties:
                name:
                  type: string
                phone:
                  type: string
                relationship:
                  type: string
      responses:
        '201':
          description: Tạo contact thành công
          content:
            application/json:
              schema:
                type: object
                properties:
                  contact_id:
                    type: string
                    format: uuid
                  message:
                    type: string
        '400':
          description: Bad Request - Vượt quá giới hạn 3 liên hệ
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          
  /users/contacts/{contact_id}:
    parameters:
      - name: contact_id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    put:
      tags: [User]
      summary: Cập nhật chi tiết liên hệ SOS
      operationId: updateSOSContact
      security:
        - JWTAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                phone:
                  type: string
                relationship:
                  type: string
      responses:
        '200':
          description: Cập nhật thành công
          content:
            application/json:
              schema:
                type: object
                properties:
                  contact_id:
                    type: string
                    format: uuid
                  message:
                    type: string
        '404':
          description: Not Found - Liên hệ không tồn tại
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    delete:
      tags: [User]
      summary: Xóa liên hệ khẩn cấp theo ID
      operationId: deleteSOSContact
      security:
        - JWTAuth: []
      responses:
        '204':
          description: Xóa thành công (No Content)

  # === AI ENGINE ENDPOINTS ===
  /safety/score:
    get:
      tags: [AI Engine]
      summary: Lấy Điểm An toàn tại một vị trí
      description: Tính toán điểm an toàn (0.0-1.0) dựa trên tọa độ
      operationId: getSafetyScore
      parameters:
        - name: lat
          in: query
          required: true
          schema:
            type: number
            format: double
          example: 10.762622
        - name: lon
          in: query
          required: true
          schema:
            type: number
            format: double
          example: 106.660172
      responses:
        '200':
          description: Thành công
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SafetyScore'
        '429':
          description: Rate Limit Exceeded - Vượt quá giới hạn request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  # === SOS ENDPOINTS ===
  /sos/activate:
    post:
      tags: [SOS]
      summary: Kích hoạt tín hiệu khẩn cấp
      description: Kích hoạt SOS và gửi thông báo đến contacts & emergency services
      operationId: activateSOS
      security:
        - JWTAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [location]
              properties:
                location:
                  type: object
                  required: [lat, lon]
                  properties:
                    lat:
                      type: number
                      format: double
                    lon:
                      type: number
                      format: double
                battery_level:
                  type: integer
                  minimum: 0
                  maximum: 100
                offline_mode:
                  type: boolean
                  description: 'True nếu gửi từ Service Worker queue (offline)'
      responses:
        '202':
          description: Accepted - Tín hiệu SOS đã được chấp nhận xử lý
          content:
            application/json:
              schema:
                type: object
                properties:
                  sos_id:
                    type: string
                    format: uuid
                  message:
                    type: string
        '400':
          description: Missing Data - Thiếu dữ liệu bắt buộc
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          
  # === ALERT HUB ENDPOINTS ===
  /alerts/history:
    get:
      tags: [Alert Hub]
      summary: Lịch sử các cảnh báo đã nhận/xảy ra trong khu vực
      description: Lấy danh sách cảnh báo với phân trang và lọc theo severity
      operationId: getAlertHistory
      security:
        - JWTAuth: []
      parameters:
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
        - name: severity
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 5
      responses:
        '200':
          description: Thành công
          content:
            application/json:
              schema:
                type: object
                properties:
                  total:
                    type: integer
                    description: Tổng số alerts khớp filter
                  alerts:
                    type: array
                    items:
                      $ref: '#/components/schemas/AlertSummary'
        '401':
          description: Unauthorized

  # === MAP SERVICE ENDPOINTS ===
  /map/tiles/{z}/{x}/{y}:
    get:
      tags: [Map Service]
      summary: Lấy Vector Tile theo chuẩn Z/X/Y
      description: Vector tiles cho bản đồ rủi ro, cached heavily
      operationId: getVectorTile
      parameters:
        - name: z
          in: path
          required: true
          schema:
            type: integer
            description: Zoom level
        - name: x
          in: path
          required: true
          schema:
            type: integer
            description: Tile X coordinate
        - name: y
          in: path
          required: true
          schema:
            type: integer
            description: Tile Y coordinate
      responses:
        '200':
          description: Vector Tile Data
          content:
            application/vnd.mapbox-vector-tile:
              schema:
                type: string
                format: binary
        '404':
          description: Tile Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          
  /map/pois:
    get:
      tags: [Map Service]
      summary: Lấy Điểm Quan tâm (POI - Shelters, Hospitals)
      description: Tìm shelters và hospitals trong bounding box
      operationId: getPOIs
      parameters:
        - name: bbox
          in: query
          required: true
          description: 'Boundary Box format: minLon,minLat,maxLon,maxLat'
          schema:
            type: string
            example: "106.6601,10.7626,106.7000,10.8000"
      responses:
        '200':
          description: Thành công
          content:
            application/json:
              schema:
                type: object
                properties:
                  pois:
                    type: array
                    items:
                      $ref: '#/components/schemas/POI'
        '429':
          description: Rate Limit Exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'