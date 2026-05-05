# Tài Liệu API — Hệ thống IoT Smart Home

**Base URL**: `http://localhost:3000/api`  
**Format**: JSON  
**Encoding**: UTF-8

---

## Mục lục

1. [Cấu trúc Response chung](#1-cấu-trúc-response-chung)
2. [Health Check](#2-health-check)
3. [Devices — Thiết bị](#3-devices--thiết-bị)
4. [Sensors — Cảm biến](#4-sensors--cảm-biến)
5. [Activity — Lịch sử hoạt động](#5-activity--lịch-sử-hoạt-động)
6. [MQTT Topics](#6-mqtt-topics)
7. [Mã lỗi HTTP](#7-mã-lỗi-http)

---

## 1. Cấu trúc Response chung

Mọi response đều theo cấu trúc chuẩn:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

Khi xảy ra lỗi:

```json
{
  "success": false,
  "error": "Thông báo lỗi",
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `success` | boolean | `true` nếu request thành công |
| `data` | object / array | Dữ liệu trả về (chỉ có khi success=true) |
| `error` | string | Thông báo lỗi (chỉ có khi success=false) |
| `timestamp` | string (ISO 8601) | Thời điểm server xử lý request |

---

## 2. Health Check

### GET `/api/health`

Kiểm tra trạng thái server. Frontend dùng endpoint này mỗi 30 giây để kiểm tra kết nối.

**Request**: Không có body, không có params.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

---

## 3. Devices — Thiết bị

Hệ thống quản lý **3 thiết bị**:

| deviceId | Tên | Loại |
| :---: | :--- | :--- |
| `1` | Đèn chính | light |
| `2` | Điều hòa | ac |
| `3` | Quạt trần | fan |

---

### GET `/api/devices`

Lấy danh sách toàn bộ thiết bị.

**Request**: Không có params.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Đèn chính",
      "type": "light",
      "status": false,
      "lastUpdated": "2026-05-04T02:00:00.000Z"
    },
    {
      "id": "2",
      "name": "Điều hòa",
      "type": "ac",
      "status": true,
      "lastUpdated": "2026-05-04T02:00:00.000Z"
    },
    {
      "id": "3",
      "name": "Quạt trần",
      "type": "fan",
      "status": false,
      "lastUpdated": "2026-05-04T02:00:00.000Z"
    }
  ],
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

**Cấu trúc Device object:**

| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | string | ID thiết bị ("1", "2", "3") |
| `name` | string | Tên hiển thị |
| `type` | string | `"light"` / `"ac"` / `"fan"` / `"other"` |
| `status` | boolean | `true` = BẬT, `false` = TẮT |
| `lastUpdated` | string | ISO 8601, lần cập nhật cuối |

---

### GET `/api/devices/:deviceId/status`

Lấy trạng thái của một thiết bị theo ID.

**Path Params:**

| Param | Kiểu | Ví dụ |
| :--- | :--- | :--- |
| `deviceId` | string | `1`, `2`, `3` |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": true,
    "timestamp": "2026-05-04T02:00:00.000Z"
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

**Response 404** (thiết bị không tồn tại):
```json
{
  "success": false,
  "error": "Device not found",
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

---

### POST `/api/devices/:deviceId/control`

Điều khiển bật/tắt thiết bị. Backend sẽ publish lệnh đến MQTT topic `iot/device/{id}/control` và ghi log vào MongoDB.

**Path Params:**

| Param | Kiểu | Ví dụ |
| :--- | :--- | :--- |
| `deviceId` | string | `1`, `2`, `3` |

**Request Body:**
```json
{
  "action": "ON"
}
```

| Trường | Kiểu | Bắt buộc | Giá trị hợp lệ |
| :--- | :--- | :---: | :--- |
| `action` | string | Có | `"ON"` hoặc `"OFF"` |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "deviceId": "1",
    "newStatus": true,
    "message": "Device 1 turned ON"
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

**Response 400** (action không hợp lệ):
```json
{
  "success": false,
  "error": "Invalid action. Must be ON or OFF",
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

**Response 404** (thiết bị không tồn tại):
```json
{
  "success": false,
  "error": "Device not found",
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

**Ví dụ cURL:**
```bash
curl -X POST http://localhost:3000/api/devices/1/control \
  -H "Content-Type: application/json" \
  -d '{"action": "ON"}'
```

---

## 4. Sensors — Cảm biến

### GET `/api/sensors/latest`

Lấy dữ liệu cảm biến mới nhất (cập nhật theo dữ liệu MQTT cuối cùng từ ESP32).

**Request**: Không có params.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "temperature": {
      "value": 27.5,
      "unit": "°C",
      "timestamp": "2026-05-04T02:00:00.000Z"
    },
    "humidity": {
      "value": 65,
      "unit": "%",
      "timestamp": "2026-05-04T02:00:00.000Z"
    },
    "light": {
      "value": 320.5,
      "unit": "Lux",
      "timestamp": "2026-05-04T02:00:00.000Z"
    }
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

---

### GET `/api/sensors/temperature`

Lấy riêng dữ liệu nhiệt độ.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "value": 27.5,
    "unit": "°C",
    "timestamp": "2026-05-04T02:00:00.000Z"
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

---

### GET `/api/sensors/humidity`

Lấy riêng dữ liệu độ ẩm.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "value": 65,
    "unit": "%",
    "timestamp": "2026-05-04T02:00:00.000Z"
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

---

### GET `/api/sensors/light`

Lấy riêng dữ liệu ánh sáng.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "value": 320.5,
    "unit": "Lux",
    "timestamp": "2026-05-04T02:00:00.000Z"
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

---

### GET `/api/sensors/history`

Lấy lịch sử dữ liệu cảm biến từ MongoDB, có phân trang. Mỗi bản ghi chứa đồng thời cả 3 giá trị (nhiệt độ, độ ẩm, ánh sáng).

**Query Params:**

| Param | Kiểu | Mặc định | Giới hạn | Mô tả |
| :--- | :--- | :---: | :---: | :--- |
| `page` | number | `1` | >= 1 | Số trang |
| `limit` | number | `10` | 1–100 | Số bản ghi mỗi trang |

**Ví dụ:** `GET /api/sensors/history?page=2&limit=10`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 11,
        "deviceId": "#A3F2",
        "temperature": 27.9,
        "humidity": 55,
        "light": 117.22,
        "timestamp": "02:00:00 04/05/2026"
      }
    ],
    "total": 150,
    "page": 2,
    "limit": 10,
    "totalPages": 15
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

**Cấu trúc SensorHistoryRecord:**

| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | number | Số thứ tự (tính theo trang) |
| `deviceId` | string | 4 ký tự cuối của MongoDB ObjectId |
| `temperature` | number | Nhiệt độ (°C) |
| `humidity` | number | Độ ẩm (%) |
| `light` | number | Ánh sáng (Lux) |
| `timestamp` | string | Định dạng `HH:mm:ss dd/MM/yyyy` |

**Cấu trúc Pagination:**

| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `total` | number | Tổng số bản ghi trong DB |
| `page` | number | Trang hiện tại |
| `limit` | number | Số bản ghi/trang |
| `totalPages` | number | Tổng số trang |

---

## 5. Activity — Lịch sử hoạt động

### GET `/api/activity`

Lấy lịch sử các hành động điều khiển thiết bị, có phân trang.

**Query Params:**

| Param | Kiểu | Mặc định | Giới hạn | Mô tả |
| :--- | :--- | :---: | :---: | :--- |
| `page` | number | `1` | >= 1 | Số trang |
| `limit` | number | `10` | 1–100 | Số bản ghi mỗi trang |

**Ví dụ:** `GET /api/activity?page=1&limit=10`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "device": "Đèn chính",
        "deviceId": "#1",
        "action": "BẬT",
        "status": "Thành công",
        "timestamp": "02:00:00 04/05/2026"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

**Cấu trúc ActivityRecord:**

| Trường | Kiểu | Giá trị |
| :--- | :--- | :--- |
| `id` | number | Số thứ tự |
| `device` | string | Tên thiết bị (`"Đèn chính"`, `"Điều hòa"`, `"Quạt trần"`) |
| `deviceId` | string | `"#1"`, `"#2"`, `"#3"` |
| `action` | string | `"BẬT"` hoặc `"TẮT"` |
| `status` | string | `"Thành công"` hoặc `"Thất bại"` |
| `timestamp` | string | Định dạng `HH:mm:ss dd/MM/yyyy` |

---

### GET `/api/activity/stats`

Thống kê số lần điều khiển theo ngày và theo thiết bị. Dữ liệu dạng chuỗi thời gian, dùng để vẽ biểu đồ.

**Request**: Không có params.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "dates": [
      {
        "date": "04/05/2026",
        "Đèn chính": 5,
        "Điều hòa": 3,
        "Quạt trần": 2
      }
    ],
    "devices": ["Đèn chính", "Điều hòa", "Quạt trần"]
  },
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

---

## 6. MQTT Topics

Backend subscribe/publish theo cấu trúc topic sau:

### Subscribe (Backend lắng nghe)

| Topic | Payload | Mô tả |
| :--- | :--- | :--- |
| `iot/sensor/temperature/data` | `{"value": 27.5, "unit": "°C"}` | Nhiệt độ từ ESP32 |
| `iot/sensor/humidity/data` | `{"value": 65, "unit": "%"}` | Độ ẩm từ ESP32 |
| `iot/sensor/light/data` | `{"value": 320, "unit": "Lux"}` | Ánh sáng từ ESP32 |
| `iot/sensor/all` | `{"temperature": 27.5, "humidity": 65, "light": 320}` | Gửi đồng thời cả 3 giá trị, backend lưu MongoDB |
| `iot/device/+/status` | `{"status": true}` | Phần cứng báo lại trạng thái sau khi thực thi lệnh |

### Publish (Backend gửi lệnh)

| Topic | Payload | Mô tả |
| :--- | :--- | :--- |
| `iot/device/1/control` | `"ON"` hoặc `"OFF"` | Điều khiển Đèn chính |
| `iot/device/2/control` | `"ON"` hoặc `"OFF"` | Điều khiển Điều hòa |
| `iot/device/3/control` | `"ON"` hoặc `"OFF"` | Điều khiển Quạt trần |

### Kiểm thử MQTT bằng Mosquitto

```bash
# Publish dữ liệu cảm biến (mô phỏng ESP32)
mosquitto_pub -h localhost -p 1883 \
  -t "iot/sensor/all" \
  -m '{"temperature":27.5,"humidity":65,"light":320}'

# Bật đèn chính (mô phỏng frontend)
mosquitto_pub -h localhost -p 1883 \
  -t "iot/device/1/control" -m "ON"

# Theo dõi tất cả topic
mosquitto_sub -h localhost -p 1883 -t "iot/#"
```

---

## 7. Mã lỗi HTTP

| HTTP Code | Ý nghĩa | Nguyên nhân phổ biến |
| :---: | :--- | :--- |
| 200 | OK | Request thành công |
| 400 | Bad Request | `action` không phải `ON`/`OFF` |
| 404 | Not Found | `deviceId` không tồn tại / route sai |
| 500 | Internal Server Error | Lỗi MongoDB, lỗi MQTT hoặc lỗi server |
| 503 | Service Unavailable | MongoDB chưa kết nối được |

---

## 8. Danh sách tất cả Endpoint

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| GET | `/api/health` | Kiểm tra trạng thái server |
| GET | `/api/devices` | Danh sách tất cả thiết bị |
| GET | `/api/devices/:id/status` | Trạng thái một thiết bị |
| POST | `/api/devices/:id/control` | Bật/tắt thiết bị |
| GET | `/api/sensors/latest` | Dữ liệu cảm biến mới nhất |
| GET | `/api/sensors/temperature` | Nhiệt độ mới nhất |
| GET | `/api/sensors/humidity` | Độ ẩm mới nhất |
| GET | `/api/sensors/light` | Ánh sáng mới nhất |
| GET | `/api/sensors/history` | Lịch sử cảm biến (phân trang) |
| GET | `/api/activity` | Lịch sử hoạt động thiết bị (phân trang) |
| GET | `/api/activity/stats` | Thống kê hành động theo ngày |

---

**Phiên bản**: 1.1.0  
**Cập nhật**: 04/05/2026  
**Tác giả**: Nguyễn Mạnh Đức (B22DCPT061) — D22CQPT01
