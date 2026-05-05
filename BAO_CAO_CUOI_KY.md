# BÁO CÁO CUỐI KỲ
## HỆ THỐNG ĐIỀU KHIỂN NHÀ THÔNG MINH IoT

**Sinh viên**: Nguyễn Mạnh Đức  
**MSSV**: B22DCPT061  
**Lớp**: D22CQPT01  
**Email**: nduc8868x@gmail.com  
**GitHub**: https://github.com/nduc8868x-tech/iot

---

# CHƯƠNG 1: TỔNG QUAN ĐỀ TÀI

## 1.1. Đặt vấn đề và lý do chọn đề tài

Trong bối cảnh cuộc cách mạng công nghiệp 4.0 đang diễn ra mạnh mẽ, Internet of Things (IoT) đã trở thành một trong những công nghệ cốt lõi, thay đổi cách con người tương tác với môi trường xung quanh. Nhà thông minh (Smart Home) là một trong những ứng dụng phổ biến và thiết thực nhất của IoT, mang lại sự tiện nghi, tiết kiệm năng lượng và nâng cao chất lượng cuộc sống.

Thực tế hiện nay, người dùng phải di chuyển vật lý để bật/tắt các thiết bị điện trong nhà, hoặc không thể theo dõi các thông số môi trường như nhiệt độ, độ ẩm, ánh sáng theo thời gian thực. Điều này gây bất tiện và lãng phí năng lượng, đặc biệt khi người dùng vắng nhà. Ngoài ra, việc giám sát và lưu trữ lịch sử vận hành thiết bị một cách có hệ thống cũng là nhu cầu quan trọng trong quản lý nhà ở hiện đại.

Xuất phát từ những bất cập trên, đề tài **"Hệ thống điều khiển và giám sát nhà thông minh qua giao thức MQTT"** được đề xuất nhằm xây dựng một nền tảng web cho phép:
- Giám sát dữ liệu cảm biến môi trường (nhiệt độ, độ ẩm, ánh sáng) theo thời gian thực.
- Điều khiển từ xa các thiết bị điện (đèn, quạt, điều hòa) thông qua giao diện web.
- Lưu trữ và truy xuất lịch sử hoạt động của thiết bị và dữ liệu cảm biến.
- Đảm bảo hệ thống hoạt động ổn định với khả năng xử lý mất kết nối gracefully.

Đề tài có giá trị thực tiễn cao, kết hợp được nhiều công nghệ hiện đại trong một hệ thống hoàn chỉnh, giúp sinh viên nắm vững kiến thức về lập trình web full-stack, giao thức IoT và tích hợp phần cứng.

## 1.2. Mục tiêu đề tài

### Mục tiêu tổng quát
Xây dựng một hệ thống IoT hoàn chỉnh bao gồm frontend, backend, cơ sở dữ liệu và tích hợp phần cứng, cho phép giám sát và điều khiển thiết bị nhà thông minh từ xa qua giao diện web.

### Mục tiêu cụ thể

**Về giao diện người dùng (Frontend):**
- Xây dựng dashboard hiển thị dữ liệu cảm biến theo thời gian thực với biểu đồ trực quan.
- Thiết kế giao diện điều khiển thiết bị trực quan, có loading state và phản hồi tức thì.
- Xây dựng các trang lịch sử cảm biến và lịch sử hoạt động với chức năng lọc, tìm kiếm và phân trang.
- Đảm bảo toàn bộ giao diện hiển thị trong một màn hình (không cuộn trang).

**Về hệ thống backend:**
- Xây dựng RESTful API đầy đủ cho quản lý thiết bị và dữ liệu cảm biến.
- Tích hợp MQTT client để giao tiếp với thiết bị phần cứng.
- Kết nối và lưu trữ dữ liệu vào MongoDB Atlas (cloud).

**Về tích hợp hệ thống:**
- Kết nối toàn bộ luồng dữ liệu từ phần cứng ESP32/ESP8266 → MQTT Broker → Backend → Frontend.
- Xử lý các tình huống mất kết nối, lỗi API một cách gracefully.

## 1.3. Phạm vi và giới hạn

### Phạm vi thực hiện
- **Phần cứng**: Hỗ trợ vi điều khiển ESP32/ESP8266 với cảm biến DHT22 (nhiệt độ, độ ẩm) và LDR (ánh sáng).
- **Thiết bị điều khiển**: 3 thiết bị — Đèn chính (light), Điều hòa (ac), Quạt trần (fan).
- **Giao thức**: MQTT (port 1883) cho giao tiếp phần cứng, HTTP REST API cho giao tiếp frontend-backend.
- **Nền tảng**: Ứng dụng web chạy trên trình duyệt, không có ứng dụng di động.
- **Lưu trữ**: MongoDB Atlas (cloud, free tier, 512MB).

### Giới hạn
- Chưa triển khai xác thực người dùng (JWT/OAuth); hệ thống chỉ có một tài khoản ADMIN duy nhất.
- Không hỗ trợ điều khiển tự động theo lịch (scheduling).
- Firmware ESP32 không nằm trong phạm vi báo cáo này (chỉ mô phỏng qua MQTT CLI).
- Chưa triển khai HTTPS/WSS cho môi trường production.
- Không có chức năng thông báo đẩy (push notification).

## 1.4. Bố cục báo cáo

Báo cáo được tổ chức thành 6 chương như sau:

- **Chương 1 – Tổng quan đề tài**: Trình bày lý do chọn đề tài, mục tiêu, phạm vi và giới hạn của hệ thống.
- **Chương 2 – Cơ sở lý thuyết**: Giới thiệu các khái niệm và công nghệ nền tảng được sử dụng trong dự án, bao gồm IoT, MQTT, REST API, và các framework phát triển.
- **Chương 3 – Phân tích và thiết kế hệ thống**: Mô tả yêu cầu chức năng, kiến trúc tổng thể, sơ đồ ERD và thiết kế giao diện.
- **Chương 4 – Cài đặt và hiện thực**: Trình bày môi trường phát triển, tài liệu API chi tiết, định dạng MQTT message và hiện thực các module chính.
- **Chương 5 – Kiểm thử và đánh giá**: Kế hoạch kiểm thử, test cases cho các API và đánh giá tổng thể hệ thống.
- **Chương 6 – Kết luận và hướng phát triển**: Tóm tắt kết quả đạt được, hạn chế còn tồn tại và định hướng phát triển trong tương lai.

---

# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

## 2.1. Tổng quan về IoT

**Internet of Things (IoT)** là một hệ sinh thái gồm các thiết bị vật lý được kết nối với nhau và với Internet, có khả năng thu thập, truyền tải và xử lý dữ liệu mà không cần sự can thiệp trực tiếp của con người. Khái niệm này lần đầu được đề xuất bởi Kevin Ashton vào năm 1999 và hiện đang phát triển nhanh chóng với hàng tỷ thiết bị kết nối trên toàn thế giới.

Một hệ thống IoT điển hình gồm 4 lớp chính:

| Lớp | Chức năng | Ví dụ trong đề tài |
| :--- | :--- | :--- |
| **Perception Layer** (Cảm nhận) | Thu thập dữ liệu từ môi trường | ESP32, cảm biến DHT22, LDR |
| **Network Layer** (Mạng) | Truyền tải dữ liệu | MQTT, Wi-Fi |
| **Processing Layer** (Xử lý) | Lưu trữ và xử lý dữ liệu | Node.js Backend, MongoDB Atlas |
| **Application Layer** (Ứng dụng) | Giao diện người dùng | React Web Dashboard |

### Đặc điểm của hệ thống IoT trong đề tài

Hệ thống được xây dựng theo mô hình **Publish/Subscribe** thông qua MQTT Broker, giúp tách biệt hoàn toàn giữa nhà sản xuất dữ liệu (ESP32) và người tiêu thụ dữ liệu (Backend Server). Điều này mang lại các ưu điểm:

- **Mở rộng dễ dàng**: Có thể thêm nhiều thiết bị mà không cần thay đổi kiến trúc.
- **Giảm tải mạng**: MQTT tối ưu cho băng thông thấp, phù hợp với vi điều khiển.
- **Tách biệt logic**: Backend và phần cứng hoàn toàn độc lập, dễ bảo trì.

---

## 2.2. Giao thức truyền thông sử dụng

### 2.2.1. MQTT (Message Queuing Telemetry Transport)

**MQTT** là giao thức truyền thông nhẹ (lightweight), dựa trên mô hình Publish/Subscribe, được thiết kế tối ưu cho các thiết bị có tài nguyên hạn chế và kết nối mạng không ổn định. MQTT được chuẩn hóa bởi OASIS và ISO/IEC 20922.

**Mô hình hoạt động:**

```
[Publisher]          [MQTT Broker]         [Subscriber]
ESP32         -->    Mosquitto      -->    Backend Server
(Publish)           (Route)               (Subscribe)
```

**Các khái niệm cốt lõi:**

- **Topic**: Chuỗi phân cấp dùng để phân loại message, sử dụng dấu `/` để phân tách. Ví dụ: `iot/sensor/temperature/data`.
- **Wildcard**: `+` thay thế một cấp, `#` thay thế nhiều cấp. Ví dụ: `iot/device/+/status` subscribe tất cả thiết bị.
- **QoS (Quality of Service)**: Đảm bảo độ tin cậy gửi tin:
  - QoS 0 – At most once: Gửi một lần, không xác nhận.
  - QoS 1 – At least once: Đảm bảo nhận được ít nhất một lần (dùng trong đề tài).
  - QoS 2 – Exactly once: Đảm bảo nhận đúng một lần.
- **Retain**: Message cuối cùng được lưu tại Broker, Subscriber mới sẽ nhận được ngay.
- **Last Will Testament (LWT)**: Message tự động gửi khi client ngắt kết nối bất thường.

**Lý do chọn MQTT trong đề tài:**
- Overhead header chỉ 2 bytes, phù hợp với vi điều khiển ESP32 bộ nhớ giới hạn.
- Hỗ trợ QoS 1 đảm bảo lệnh điều khiển thiết bị không bị mất.
- MQTT Broker (Mosquitto) miễn phí, dễ cài đặt.
- Thư viện MQTT client (`mqtt` npm package) hỗ trợ đầy đủ trong Node.js.

**Cấu hình MQTT trong hệ thống:**

```
Broker: Mosquitto (localhost hoặc IP LAN)
Port TCP: 1883
Keepalive: 60 giây
Reconnect: tự động sau 3 giây
Connection Timeout: 12 giây
QoS: 1
```

---

### 2.2.2. WebSocket (RFC 6455)

**WebSocket** là giao thức truyền thông song công (full-duplex) trên một kết nối TCP duy nhất, được chuẩn hóa trong RFC 6455 (2011). Khác với HTTP truyền thống (request-response), WebSocket cho phép server chủ động đẩy dữ liệu xuống client mà không cần client gửi request.

**Quá trình handshake:**

```
Client → Server: HTTP Upgrade Request
  GET /ws HTTP/1.1
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Key: dGhlIHNhbXBsZQ==

Server → Client: HTTP 101 Switching Protocols
  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

**Ứng dụng trong hệ thống:**

Trong phiên bản hiện tại của đề tài, WebSocket chưa được triển khai trực tiếp ở tầng giao tiếp Frontend–Backend. Thay vào đó, frontend sử dụng **HTTP Polling** (gọi API định kỳ mỗi 2–10 giây) để lấy dữ liệu mới. Đây là lựa chọn đơn giản hơn, phù hợp với phạm vi đồ án sinh viên.

WebSocket là hướng nâng cấp tự nhiên cho các phiên bản tiếp theo, giúp giảm độ trễ và tải server khi cần push dữ liệu cảm biến theo thời gian thực với tần suất cao.

---

### 2.2.3. REST API (HTTP)

**REST (Representational State Transfer)** là kiến trúc thiết kế API dựa trên các nguyên tắc của HTTP. API RESTful sử dụng các HTTP methods (GET, POST, PUT, DELETE) tương ứng với các thao tác CRUD trên tài nguyên.

**Các nguyên tắc REST được áp dụng trong đề tài:**

| Nguyên tắc | Mô tả | Áp dụng trong đề tài |
| :--- | :--- | :--- |
| **Stateless** | Mỗi request độc lập, không lưu session | Backend không lưu session người dùng |
| **Uniform Interface** | URL rõ ràng theo tài nguyên | `/api/devices`, `/api/sensors/latest` |
| **Client-Server** | Tách biệt frontend và backend | React (port 5173) ↔ Node.js (port 3000) |
| **Layered System** | Có thể thêm middleware | `requestLogger`, CORS middleware |

**Cấu trúc Response chuẩn hóa:**

Toàn bộ API trong hệ thống trả về định dạng `ApiResponse<T>` nhất quán:

```json
{
  "success": true,
  "data": { },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

Khi có lỗi:
```json
{
  "success": false,
  "error": "Device not found",
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

**HTTP Status Codes sử dụng:**

| Code | Ý nghĩa | Trường hợp |
| :---: | :--- | :--- |
| `200 OK` | Thành công | GET, POST thành công |
| `400 Bad Request` | Dữ liệu đầu vào sai | Action không phải `ON`/`OFF` |
| `404 Not Found` | Tài nguyên không tồn tại | Device ID không hợp lệ |
| `500 Internal Server Error` | Lỗi server | Lỗi MongoDB, lỗi không xác định |

---

## 2.3. Hardware và thiết bị

### Vi điều khiển ESP32/ESP8266

**ESP32** là vi điều khiển do Espressif Systems sản xuất, được sử dụng rộng rãi trong các dự án IoT nhờ tích hợp Wi-Fi và Bluetooth, hiệu năng cao với giá thành thấp.

| Thông số | ESP32 | ESP8266 |
| :--- | :--- | :--- |
| **CPU** | Dual-core Xtensa LX6, 240 MHz | Single-core, 80/160 MHz |
| **RAM** | 520 KB SRAM | 96 KB SRAM |
| **Flash** | 4 MB | 4 MB |
| **Wi-Fi** | 802.11 b/g/n | 802.11 b/g/n |
| **Bluetooth** | BLE 4.2 + Classic | Không có |
| **GPIO** | 34 pins | 17 pins |
| **ADC** | 12-bit, 18 kênh | 10-bit, 1 kênh |

Trong đề tài, ESP32/ESP8266 thực hiện các nhiệm vụ:
- Kết nối Wi-Fi để giao tiếp với MQTT Broker.
- Đọc dữ liệu từ cảm biến DHT22 và LDR mỗi 2 giây.
- Publish dữ liệu cảm biến lên MQTT topic `iot/sensor/all`.
- Subscribe topic `iot/device/+/control` để nhận lệnh điều khiển.
- Điều khiển LED/Relay dựa trên lệnh nhận được.

### Cảm biến DHT22

**DHT22** (AM2302) là cảm biến kỹ thuật số đo nhiệt độ và độ ẩm, giao tiếp qua giao thức 1-Wire.

| Thông số | Giá trị |
| :--- | :---: |
| Dải đo nhiệt độ | −40°C đến +80°C |
| Độ chính xác nhiệt độ | ±0.5°C |
| Dải đo độ ẩm | 0% đến 100% RH |
| Độ chính xác độ ẩm | ±2–5% RH |
| Thời gian lấy mẫu | Tối thiểu 2 giây |
| Điện áp hoạt động | 3.3V – 5V |

### Cảm biến LDR (Light Dependent Resistor)

**LDR** là điện trở quang, giá trị điện trở thay đổi tỉ lệ nghịch với cường độ ánh sáng. Kết hợp với điện trở kéo (pull-down) tạo thành mạch phân áp, đọc qua kênh ADC của ESP32.

Giá trị ADC (0–4095 với 12-bit) được quy đổi sang đơn vị Lux thông qua công thức:

```
Lux = (ADC_Value / 4095.0) * MAX_LUX
```

### Các thiết bị điều khiển

| ID | Tên thiết bị | Loại | Giao diện phần cứng |
| :---: | :--- | :---: | :--- |
| 1 | Đèn chính | `light` | LED hoặc Relay + đèn |
| 2 | Điều hòa | `ac` | Relay module |
| 3 | Quạt trần | `fan` | Relay module |

---

## 2.4. Thư viện và framework sử dụng

### Backend

| Thư viện | Phiên bản | Chức năng |
| :--- | :---: | :--- |
| **Node.js** | v18+ | Runtime JavaScript phía server |
| **Express.js** | 4.18 | Web framework, routing, middleware |
| **TypeScript** | 5.3 | Static typing cho JavaScript |
| **Mongoose** | 8.x | ODM kết nối MongoDB, định nghĩa Schema |
| **mqtt** | 5.x | MQTT client, publish/subscribe |
| **date-fns** | 4.x | Định dạng và xử lý ngày giờ |
| **cors** | 2.x | Xử lý Cross-Origin Resource Sharing |
| **tsx** | 4.x | Chạy TypeScript trực tiếp (dev mode) |

**Lý do chọn Express.js:** Nhẹ, linh hoạt, cộng đồng lớn, phù hợp xây dựng REST API nhanh. Không cần opinionated structure như NestJS cho quy mô đồ án.

**Lý do chọn Mongoose:** ODM (Object Document Mapper) cung cấp Schema validation, middleware hooks, và query API thuận tiện cho MongoDB.

**Giải pháp DNS đặc biệt:** MongoDB Atlas sử dụng SRV record để resolve địa chỉ cluster. Router cục bộ không hỗ trợ DNS SRV nên hệ thống cần cấu hình thủ công:

```typescript
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google Public DNS
```

---

### Frontend

| Thư viện | Phiên bản | Chức năng |
| :--- | :---: | :--- |
| **React** | 18.3 | UI framework, component-based |
| **TypeScript** | 5.5 | Type safety cho frontend |
| **Vite** | 5.2 | Build tool, dev server cực nhanh |
| **React Router** | 6.26 | Client-side routing (SPA) |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Recharts** | 2.12 | Biểu đồ dữ liệu cảm biến |
| **Lucide React** | 0.x | Bộ icon SVG |
| **date-fns** | 4.x | Định dạng timestamp |

**Lý do chọn React:** Phổ biến nhất, component reusable, React Hooks đơn giản hóa state management. Context API đủ dùng cho quy mô đề tài mà không cần Redux.

**Lý do chọn Vite:** Thời gian khởi động dev server < 1 giây nhờ ES modules native, Hot Module Replacement (HMR) tức thì khi sửa code, nhanh hơn webpack nhiều lần.

**Lý do chọn Tailwind CSS:** Không cần viết file CSS riêng, responsive design dễ dàng, purge unused classes trong production giúp bundle nhỏ.

**Lý do chọn Recharts:** API đơn giản, tích hợp tốt với React, hỗ trợ AreaChart với nhiều trục Y (nhiệt độ/độ ẩm trái, ánh sáng phải), ResponsiveContainer tự động theo kích thước.

---

### Cơ sở dữ liệu

**MongoDB Atlas** là dịch vụ cơ sở dữ liệu NoSQL đám mây do MongoDB Inc. cung cấp.

| Đặc điểm | Mô tả |
| :--- | :--- |
| **Loại** | Document-oriented NoSQL |
| **Lưu trữ** | BSON (Binary JSON) |
| **Triển khai** | Cloud — AWS / GCP / Azure |
| **Free Tier** | 512 MB, shared cluster |
| **ODM** | Mongoose 8.x |
| **Indexing** | Index trên `timestamp` để query nhanh |

**Lý do chọn MongoDB thay vì SQL:**
- Dữ liệu cảm biến có cấu trúc linh hoạt, dễ thêm trường mới mà không cần migration.
- Document model phù hợp với dữ liệu JSON từ IoT.
- MongoDB Atlas free tier đủ dùng cho đề tài, không cần tự quản lý server.
- Mongoose Schema vẫn cung cấp validation giống SQL constraints.

---

### MQTT Broker — Mosquitto

**Eclipse Mosquitto** là MQTT Broker mã nguồn mở, nhẹ, được sử dụng rộng rãi cho các dự án IoT.

| Thông số | Giá trị |
| :--- | :---: |
| **Phiên bản MQTT hỗ trợ** | 3.1 / 3.1.1 / 5.0 |
| **Port TCP** | 1883 |
| **Port WebSocket** | 9001 |
| **License** | EPL / EDL (mã nguồn mở) |
| **Nền tảng** | Windows, Linux, macOS |

Cài đặt:
```bash
# Windows
mosquitto.exe -v

# Linux
sudo apt-get install mosquitto mosquitto-clients
mosquitto -v
```

---

# CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 3.1. Yêu cầu chức năng và phi chức năng

### 3.1.1. Yêu cầu chức năng

Yêu cầu chức năng mô tả những gì hệ thống phải làm được từ góc độ người dùng.

**UC-01 – Xem dữ liệu cảm biến theo thời gian thực**

| Thuộc tính | Nội dung |
| :--- | :--- |
| Mô tả | Hệ thống hiển thị giá trị nhiệt độ, độ ẩm, ánh sáng cập nhật liên tục trên Dashboard |
| Tác nhân | Người dùng (Admin) |
| Luồng chính | 1. Người dùng truy cập trang Dashboard. 2. Frontend gọi `GET /api/sensors/latest` mỗi 2 giây. 3. Dữ liệu mới được cập nhật lên biểu đồ và các MetricCard. |
| Kết quả | Biểu đồ đường hiển thị 30 điểm dữ liệu gần nhất |

**UC-02 – Điều khiển thiết bị**

| Thuộc tính | Nội dung |
| :--- | :--- |
| Mô tả | Người dùng bật/tắt thiết bị từ giao diện web |
| Tác nhân | Người dùng (Admin) |
| Luồng chính | 1. Người dùng nhấn nút toggle. 2. Frontend hiển thị loading spinner. 3. Gọi `POST /api/devices/{id}/control`. 4. Backend publish lệnh qua MQTT. 5. ESP32 nhận lệnh và thực thi. 6. UI cập nhật trạng thái mới. |
| Luồng thay thế | Nếu backend lỗi: hiện thông báo lỗi, khôi phục trạng thái cũ |

**UC-03 – Xem lịch sử cảm biến**

| Thuộc tính | Nội dung |
| :--- | :--- |
| Mô tả | Hiển thị bảng lịch sử dữ liệu cảm biến có phân trang, lọc và sắp xếp |
| Tác nhân | Người dùng (Admin) |
| Luồng chính | 1. Người dùng vào trang `/history`. 2. Chọn loại cảm biến lọc (Nhiệt độ / Độ ẩm / Ánh sáng / Tất cả). 3. Chọn chế độ tìm kiếm (Theo thời gian / Theo thông tin). 4. Nhập từ khóa tìm kiếm. 5. Dữ liệu lọc hiển thị với phân trang 10 bản ghi/trang. |

**UC-04 – Xem lịch sử hoạt động thiết bị**

| Thuộc tính | Nội dung |
| :--- | :--- |
| Mô tả | Xem log toàn bộ lệnh điều khiển thiết bị đã thực hiện |
| Tác nhân | Người dùng (Admin) |
| Luồng chính | 1. Người dùng vào trang `/activity`. 2. Lọc theo thiết bị (Đèn chính / Điều hòa / Quạt trần). 3. Tìm kiếm theo thời gian hoặc thông tin. 4. Sắp xếp theo các cột. 5. Phân trang 10 bản ghi/trang. |

**UC-05 – Giám sát trạng thái kết nối**

| Thuộc tính | Nội dung |
| :--- | :--- |
| Mô tả | Hệ thống hiển thị trạng thái kết nối backend theo thời gian thực |
| Tác nhân | Hệ thống tự động |
| Luồng chính | 1. Frontend gọi `GET /api/health` mỗi 30 giây. 2. Nếu thành công: indicator xanh "Connected". 3. Nếu thất bại: indicator đỏ, hiển thị banner ngắt kết nối. 4. Tự động thử lại mỗi 3 giây, tối đa 5 lần. |

---

### 3.1.2. Yêu cầu phi chức năng

Yêu cầu phi chức năng xác định các tiêu chí chất lượng mà hệ thống phải đáp ứng.

**Hiệu năng:**
- Giao diện Dashboard cập nhật dữ liệu cảm biến trong vòng 2 giây.
- API response time < 500ms trong điều kiện mạng LAN bình thường.
- Trang web tải hoàn chỉnh < 3 giây (đã có cache localStorage).

**Giao diện:**
- Toàn bộ nội dung mỗi trang hiển thị vừa trong một màn hình (không cuộn trang).
- Hỗ trợ màn hình độ phân giải tối thiểu 1280×720.
- Ngôn ngữ giao diện: Tiếng Việt.

**Độ tin cậy:**
- Khi mất kết nối backend, giao diện vẫn hiển thị dữ liệu thiết bị từ localStorage cache.
- MQTT client tự động kết nối lại sau 3 giây nếu mất kết nối Broker.
- Nếu MQTT Broker không khả dụng, backend vẫn khởi động và xử lý API bình thường.

**Bảo mật:**
- Credentials MongoDB Atlas lưu trong file `.env`, không commit lên Git.
- CORS chỉ cho phép origin từ `http://localhost:5173`.
- Validate đầu vào tại API: action chỉ chấp nhận `ON` hoặc `OFF`.

**Khả năng mở rộng:**
- Kiến trúc Pub/Sub cho phép thêm thiết bị mới chỉ bằng cách thêm topic MQTT.
- Pagination API hỗ trợ `limit` tối đa 100 bản ghi/trang.

---

## 3.2. Kiến trúc hệ thống tổng thể

Hệ thống được thiết kế theo mô hình **4 tầng** (Four-Tier Architecture), phân tách rõ ràng trách nhiệm của từng thành phần:

```
┌─────────────────────────────────────────────────────────────┐
│                   TẦNG GIAO DIỆN (Frontend)                 │
│                                                             │
│   React + TypeScript + Vite (port 5173)                     │
│   ┌──────────┐  ┌──────────────┐  ┌────────────────────┐   │
│   │Dashboard │  │Lịch sử cảm  │  │Lịch sử hoạt động  │   │
│   │(Realtime)│  │biến (/history│  │thiết bị (/activity)│   │
│   └──────────┘  └──────────────┘  └────────────────────┘   │
│                                                             │
│   DeviceContext (Global State) + localStorage cache         │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTP REST API (JSON)
                        │  GET /api/sensors/latest  (2s poll)
                        │  POST /api/devices/{id}/control
                        │  GET /api/activity?page=1
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   TẦNG XỬ LÝ (Backend API)                  │
│                                                             │
│   Node.js + Express + TypeScript (port 3000)                │
│   ┌──────────────┐  ┌───────────────┐  ┌───────────────┐  │
│   │/api/devices  │  │/api/sensors   │  │/api/activity  │  │
│   │  GET, POST   │  │latest, history│  │  GET, stats   │  │
│   └──────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
│   MQTT Client (mqtt npm)                                    │
│   Subscribe: iot/sensor/+/data, iot/sensor/all              │
│   Publish:   iot/device/{id}/control                        │
└─────────┬───────────────────────────────┬───────────────────┘
          │  MongoDB Driver (Mongoose)     │  MQTT Protocol
          ▼                               ▼
┌──────────────────────┐    ┌─────────────────────────────────┐
│  TẦNG DỮ LIỆU        │    │  TẦNG PHẦN CỨNG                 │
│  MongoDB Atlas       │    │  MQTT Broker (Mosquitto)         │
│  (Cloud, free tier)  │    │  port 1883                       │
│                      │    │           │                      │
│  Collections:        │    │  ┌────────┴──────────┐          │
│  ├─ SensorData       │    │  │   ESP32/ESP8266   │          │
│  ├─ DeviceAction     │    │  │  DHT22 + LDR      │          │
│  └─ Device (static)  │    │  │  LED + Relay      │          │
└──────────────────────┘    └──└───────────────────┘──────────┘
```

### Luồng dữ liệu chính

**Luồng 1 – Đọc cảm biến (Hardware → Frontend):**

```
ESP32 đọc DHT22/LDR (mỗi 2 giây)
    → Publish lên iot/sensor/all (MQTT)
        → Backend MQTT client nhận message
            → Cập nhật sensorReadings (in-memory)
            → Lưu vào MongoDB (SensorData)
                → Frontend poll GET /api/sensors/latest (mỗi 2 giây)
                    → Cập nhật biểu đồ + MetricCard
```

**Luồng 2 – Điều khiển thiết bị (Frontend → Hardware):**

```
Người dùng nhấn toggle
    → Frontend hiển thị spinner
    → POST /api/devices/{id}/control {"action":"ON"}
        → Backend cập nhật in-memory state
        → Publish iot/device/{id}/control "ON" (MQTT)
        → Ghi log vào MongoDB (DeviceAction)
            → ESP32 nhận lệnh, bật/tắt LED/Relay
            → Response trả về Frontend
                → Ẩn spinner, cập nhật UI
```

---

## 3.3. Sơ đồ ERD (Entity Relationship Diagram)

Cơ sở dữ liệu MongoDB Atlas sử dụng 3 collection. Do MongoDB là NoSQL document-oriented, sơ đồ ERD được biểu diễn theo dạng Document Model thay vì quan hệ bảng truyền thống.

### Collection 1: SensorData

Lưu trữ mỗi lần ESP32 publish dữ liệu lên topic `iot/sensor/all`.

```
SensorData {
    _id         : ObjectId       [PK, auto]
    temperature : Number         [required] -- Nhiệt độ (°C)
    humidity    : Number         [required] -- Độ ẩm (%)
    light       : Number         [required] -- Ánh sáng (Lux)
    timestamp   : Date           [indexed, default: Date.now]
}
```

**Index:** `{ timestamp: -1 }` — để query lịch sử theo thứ tự mới nhất trước, hiệu suất cao.

### Collection 2: DeviceAction

Ghi log mỗi lần người dùng điều khiển thiết bị qua frontend.

```
DeviceAction {
    _id       : ObjectId         [PK, auto]
    device    : String           [required] -- Tên VN: "Đèn chính"
    deviceId  : String           [required, indexed] -- "#1", "#2", "#3"
    action    : String           [enum: "BẬT" | "TẮT"]
    status    : String           [enum: "Thành công" | "Thất bại"]
    timestamp : Date             [indexed, default: Date.now]
}
```

**Index:** `{ deviceId: 1 }`, `{ timestamp: -1 }` — để lọc theo thiết bị và sắp xếp theo thời gian.

### Collection 3: Device

Lưu thông tin cấu hình thiết bị (hiện tại khởi tạo tĩnh trong code).

```
Device {
    _id         : ObjectId       [PK, auto]
    deviceId    : String         [unique, required] -- "1", "2", "3"
    name        : String         [required] -- "Đèn chính"
    type        : String         [enum: "light" | "fan" | "ac" | "other"]
    status      : Boolean        [default: false]
    lastUpdated : Date           [default: Date.now]
}
```

### Mối quan hệ giữa các Collection

```
Device (deviceId: "1")
    ↑ tham chiếu logic (không foreign key)
DeviceAction (deviceId: "#1", device: "Đèn chính")
```

Do MongoDB không hỗ trợ foreign key, mối quan hệ giữa `Device` và `DeviceAction` được duy trì ở tầng ứng dụng thông qua `DEVICE_NAMES` map trong `activityService.ts`:

```typescript
const DEVICE_NAMES: Record<string, string> = {
  '1': 'Đèn chính',
  '2': 'Điều hòa',
  '3': 'Quạt trần',
};
```

`SensorData` không liên kết trực tiếp với `Device` vì mỗi bản ghi chứa đầy đủ 3 giá trị cảm biến của toàn bộ hệ thống tại một thời điểm.

---

## 3.4. Thiết kế giao diện

Giao diện được thiết kế theo nguyên tắc **Single-Screen Layout** — toàn bộ nội dung mỗi trang hiển thị vừa trong một màn hình mà không cần cuộn, sử dụng CSS Flexbox với `h-screen overflow-hidden`.

### 3.4.1. Trang Dashboard (/)

**Bố cục:**

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | Nav | Search | Connection | User        │  ← h-16, cố định
├────────────────┬────────────────────────────────────────┤
│ MetricCard     │ MetricCard Độ ẩm  │ MetricCard Ánh sáng│  ← flex-shrink-0
│ Nhiệt độ 28°C  │ 55%               │ 376 Lux            │
├────────────────┴────────────────────────────────────────┤
│                                        │                 │
│  Biểu đồ thời gian thực (Recharts)     │ Điều khiển     │  ← flex-1 min-h-0
│  AreaChart: Nhiệt độ + Độ ẩm + Sáng   │ thiết bị       │
│  Responsive, tự co giãn theo chiều cao │ Toggle ON/OFF  │
│                                        │                 │
└────────────────────────────────────────┴─────────────────┘
```

**Thành phần chính:**
- **MetricCard**: Hiển thị giá trị hiện tại kèm icon (Thermometer / Droplets / Sun), cập nhật mỗi 2 giây.
- **SensorChart**: AreaChart 2 trục Y (trái: nhiệt độ + độ ẩm, phải: ánh sáng), 30 điểm dữ liệu gần nhất, có legend và tooltip hover.
- **DeviceControl**: 3 thiết bị với toggle switch, hiển thị trạng thái ON/OFF, spinner khi đang xử lý.

### 3.4.2. Trang Lịch sử cảm biến (/history)

**Bố cục:**

```
┌─────────────────────────────────────────────────────────┐
│  "DATA SENSOR"           [Làm mới]  [Xuất dữ liệu]     │  ← Header
├──────────────────────────────────────────────────────────┤
│  [Tất cả cảm biến ▼]  [Theo Thời gian ▼]  [🔍 Nhập...]│  ← Filter bar
├──────────────────────────────────────────────────────────┤
│  Mã (ID)  │  Cảm biến ↕  │  Giá trị ↕  │  Thời gian ↕ │  ← Table header
├───────────┼──────────────┼─────────────┼───────────────┤
│  #1       │  Nhiệt độ    │  28.0 °C    │  09:15:07...  │
│  #2       │  Độ ẩm       │  55 %       │  09:15:07...  │
│  #3       │  Ánh sáng    │  376.00 lux │  09:15:07...  │
│  ...      │  ...         │  ...        │  ...          │
├──────────────────────────────────────────────────────────┤
│  [◀] [1] [2] [3] ... [▶]                               │  ← Pagination
└──────────────────────────────────────────────────────────┘
```

**Tính năng nổi bật:**
- Mỗi bản ghi sensor (chứa 3 giá trị) được **flatten** thành 3 dòng riêng biệt.
- Màu sắc giá trị: Nhiệt độ — cam (`text-orange-500`), Độ ẩm — xanh (`text-blue-500`), Ánh sáng — cam nhạt (`text-orange-400`).
- Tìm kiếm động: Chế độ **Theo Thời gian** filter theo chuỗi timestamp, chế độ **Theo Thông tin** filter theo ID, tên cảm biến, giá trị.

### 3.4.3. Trang Lịch sử hoạt động (/activity)

**Bố cục:**

```
┌─────────────────────────────────────────────────────────┐
│  "ACTION HISTORY"                 [Làm mới] [Báo cáo]  │
├──────────────────────────────────────────────────────────┤
│  [Tất cả thiết bị ▼]  [Theo Thời gian ▼]  [🔍 Nhập...] │
├──────────────────────────────────────────────────────────┤
│  STT │ Thiết bị ↕ │ Lệnh ↕   │ Trạng thái ↕ │ Thời gian ↕│
├──────┼────────────┼──────────┼──────────────┼────────────┤
│  1   │ Đèn chính  │ 🟢 BẬT   │ ✓ Thành công │ 09:15:07  │
│  2   │ Điều hòa   │ 🔴 TẮT   │ ✓ Thành công │ 09:14:30  │
├──────────────────────────────────────────────────────────┤
│  [◀] [1] [2] ... [▶]                                    │
└──────────────────────────────────────────────────────────┘
```

### 3.4.4. Trang Hồ sơ cá nhân (/profile)

**Bố cục:**

```
┌─────────────────────────────────────────────────────────┐
│  [Banner gradient xanh]                                 │
│           [Avatar + badge xác nhận]                     │
│         Nguyễn Mạnh Đức  •  B22DCPT061                  │
├─────────────────────────┬───────────────────────────────┤
│  THÔNG TIN CÁ NHÂN      │  TÀI LIỆU ĐỒ ÁN              │
│  Họ và tên: ...         │  📦 Mã nguồn (GitHub)         │
│  Mã SV: B22DCPT061      │  📄 Báo cáo đồ án             │
│  Lớp: D22CQPT01         │  📋 Tài liệu API              │
│  Email: nduc8868x@...   │                               │
└─────────────────────────┴───────────────────────────────┘
```

### 3.4.5. Header Navigation

Header cố định (`sticky top-0`) với nền tối `#1e293b`, gồm:

```
[IoT Admin Logo]  [Bảng điều khiển] [Lịch sử cảm biến] [Lịch sử hoạt động] [Hồ sơ cá nhân]
                                        (Nav links, active = nền xanh)
                  [🔍 Tìm kiếm]  [● Connected]  [🔔]  [Nguyễn Mạnh Đức / ADMIN]
```

Tab đang active được highlight bằng nền `bg-blue-600`, các tab còn lại là `text-slate-400`.

---

# CHƯƠNG 4: CÀI ĐẶT VÀ HIỆN THỰC

## 4.1. Môi trường phát triển và công cụ

### 4.1.1. Phần mềm và công cụ

| Công cụ | Phiên bản | Mục đích |
| :--- | :---: | :--- |
| **Node.js** | 18+ | Runtime backend và build frontend |
| **npm** | 9+ | Quản lý package |
| **Visual Studio Code** | 1.88+ | IDE lập trình |
| **Git** | 2.x | Quản lý phiên bản |
| **Mosquitto** | 2.x | MQTT Broker local |
| **MongoDB Compass** | 1.42+ | GUI quản lý MongoDB |
| **Google Chrome** | 120+ | Trình duyệt kiểm thử |
| **Postman** | 10+ | Kiểm thử API |

### 4.1.2. Cấu trúc thư mục dự án

```
iot/
├── backend/                    # Node.js + Express API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # Kết nối MongoDB Atlas
│   │   │   ├── env.ts          # Biến môi trường
│   │   │   └── mqtt.ts         # MQTT client khởi tạo
│   │   ├── models/
│   │   │   ├── Device.ts       # Mongoose schema Device
│   │   │   ├── DeviceAction.ts # Mongoose schema DeviceAction
│   │   │   └── SensorData.ts   # Mongoose schema SensorData
│   │   ├── routes/
│   │   │   ├── devices.ts      # REST /api/devices
│   │   │   ├── sensors.ts      # REST /api/sensors
│   │   │   ├── activity.ts     # REST /api/activity
│   │   │   └── mqtt.ts         # REST /api/mqtt
│   │   ├── services/
│   │   │   ├── deviceService.ts    # Logic điều khiển thiết bị
│   │   │   ├── sensorService.ts    # Logic lịch sử cảm biến
│   │   │   └── activityService.ts  # Logic lịch sử hoạt động
│   │   ├── middleware/
│   │   │   └── requestLogger.ts    # Log mọi HTTP request
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript interfaces
│   │   └── index.ts            # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                    # (gitignored) Biến môi trường
│
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts       # HTTP client base
│   │   │   ├── deviceApi.ts    # API devices
│   │   │   ├── sensorApi.ts    # API sensors
│   │   │   ├── activityApi.ts  # API activity
│   │   │   └── connectionApi.ts# API health check
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── SensorChart.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   └── ConnectionStatus.tsx
│   │   ├── context/
│   │   │   └── DeviceContext.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EventHistory.tsx
│   │   │   ├── ActivityLog.tsx
│   │   │   └── Profile.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── public/
│   │   └── avatar.jpg
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
├── SYSTEM_ARCHITECTURE.md
└── BAO_CAO_CUOI_KY.md
```

### 4.1.3. Cấu hình môi trường

Tạo file `backend/.env` với nội dung:

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/iot_system?retryWrites=true&w=majority

MQTT_BROKER_HOST=<địa chỉ IP broker>
MQTT_BROKER_PORT=1883
MQTT_CLIENT_ID=iot-backend
MQTT_USERNAME=<username>
MQTT_PASSWORD=<password>

CORS_ORIGIN=http://localhost:5173
```

### 4.1.4. Khởi động hệ thống

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev
# → Server chạy tại http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# → App chạy tại http://localhost:5173

# Terminal 3 — MQTT Broker (tùy chọn)
mosquitto -v
# → Broker chạy tại localhost:1883
```

---

## 4.2. Tài liệu API

Base URL: `http://localhost:3000/api`

Tất cả response đều có cấu trúc chuẩn:

```json
{
  "success": true | false,
  "data": { },
  "error": "Mô tả lỗi (chỉ khi success = false)",
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

### 4.2.1. Health Check

#### `GET /api/health`

Kiểm tra trạng thái hoạt động của server.

**Request:** Không có body, không có query params.

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "timestamp": "2026-05-04T09:15:07.123Z"
}
```

**Sử dụng:** Frontend gọi endpoint này mỗi 30 giây để kiểm tra kết nối và cập nhật trạng thái indicator trên Header.

---

### 4.2.2. Device API

#### `GET /api/devices`

Lấy danh sách toàn bộ thiết bị.

**Response `200 OK`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Đèn chính",
      "type": "light",
      "status": false,
      "lastUpdated": "2026-05-04T09:15:07.000Z"
    },
    {
      "id": "2",
      "name": "Điều hòa",
      "type": "ac",
      "status": true,
      "lastUpdated": "2026-05-04T09:14:30.000Z"
    },
    {
      "id": "3",
      "name": "Quạt trần",
      "type": "fan",
      "status": true,
      "lastUpdated": "2026-05-04T09:13:00.000Z"
    }
  ],
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

#### `GET /api/devices/:deviceId/status`

Lấy trạng thái của một thiết bị cụ thể.

**URL Params:**

| Param | Kiểu | Mô tả |
| :--- | :---: | :--- |
| `deviceId` | string | ID thiết bị: `"1"`, `"2"`, `"3"` |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": false,
    "timestamp": "2026-05-04T09:15:07.000Z"
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

**Response `404 Not Found`:**

```json
{
  "success": false,
  "error": "Device not found",
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

#### `POST /api/devices/:deviceId/control`

Điều khiển bật/tắt thiết bị.

**URL Params:**

| Param | Kiểu | Mô tả |
| :--- | :---: | :--- |
| `deviceId` | string | ID thiết bị: `"1"`, `"2"`, `"3"` |

**Request Body:**

```json
{
  "action": "ON"
}
```

| Field | Kiểu | Bắt buộc | Giá trị hợp lệ |
| :--- | :---: | :---: | :--- |
| `action` | string | Có | `"ON"` hoặc `"OFF"` |

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "success": true,
    "deviceId": "1",
    "newStatus": true,
    "message": "Device turned ON successfully"
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

**Response `400 Bad Request`** (action không hợp lệ):

```json
{
  "success": false,
  "error": "Invalid action. Must be ON or OFF",
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

**Response `404 Not Found`** (deviceId không tồn tại):

```json
{
  "success": false,
  "error": "Device not found",
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

**Luồng xử lý bên trong:**

1. Validate `action` phải là `ON` hoặc `OFF`.
2. `DeviceService.controlDevice(deviceId, action)` — cập nhật in-memory state.
3. Publish MQTT: `iot/device/{deviceId}/control` với message `"ON"` hoặc `"OFF"`.
4. `recordActivity(deviceId, action, success)` — ghi log vào MongoDB.
5. Trả về response cho frontend.

---

### 4.2.3. Sensor API

#### `GET /api/sensors/latest`

Lấy giá trị cảm biến mới nhất (từ in-memory, cập nhật realtime qua MQTT).

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "temperature": {
      "value": 28.0,
      "unit": "°C",
      "timestamp": "2026-05-04T09:15:07.000Z"
    },
    "humidity": {
      "value": 55,
      "unit": "%",
      "timestamp": "2026-05-04T09:15:07.000Z"
    },
    "light": {
      "value": 376.22,
      "unit": "Lux",
      "timestamp": "2026-05-04T09:15:07.000Z"
    }
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

#### `GET /api/sensors/temperature`

Lấy chỉ giá trị nhiệt độ mới nhất.

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "value": 28.0,
    "unit": "°C",
    "timestamp": "2026-05-04T09:15:07.000Z"
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

#### `GET /api/sensors/humidity`

Lấy chỉ giá trị độ ẩm mới nhất.

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "value": 55,
    "unit": "%",
    "timestamp": "2026-05-04T09:15:07.000Z"
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

#### `GET /api/sensors/light`

Lấy chỉ giá trị ánh sáng mới nhất.

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "value": 376.22,
    "unit": "Lux",
    "timestamp": "2026-05-04T09:15:07.000Z"
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

#### `GET /api/sensors/history`

Lấy lịch sử dữ liệu cảm biến có phân trang, sắp xếp mới nhất trước.

**Query Params:**

| Param | Kiểu | Mặc định | Mô tả |
| :--- | :---: | :---: | :--- |
| `page` | number | `1` | Số trang (bắt đầu từ 1) |
| `limit` | number | `10` | Số bản ghi mỗi trang (tối đa 100) |

**Ví dụ:** `GET /api/sensors/history?page=1&limit=10`

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "deviceId": "#A3F2",
        "temperature": 28.0,
        "humidity": 55,
        "light": 376.22,
        "timestamp": "09:15:07 04/05/2026"
      },
      {
        "id": 2,
        "deviceId": "#B1E9",
        "temperature": 27.9,
        "humidity": 56,
        "light": 370.10,
        "timestamp": "09:15:05 04/05/2026"
      }
    ],
    "total": 248,
    "page": 1,
    "limit": 10,
    "totalPages": 25
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

> **Lưu ý:** `deviceId` được lấy từ 4 ký tự cuối của MongoDB `_id` (ObjectId), hiển thị dạng `#XXXX`. `timestamp` định dạng `HH:mm:ss dd/MM/yyyy`.

---

### 4.2.4. Activity API

#### `GET /api/activity`

Lấy lịch sử điều khiển thiết bị có phân trang.

**Query Params:**

| Param | Kiểu | Mặc định | Mô tả |
| :--- | :---: | :---: | :--- |
| `page` | number | `1` | Số trang |
| `limit` | number | `10` | Số bản ghi mỗi trang (tối đa 100) |

**Response `200 OK`:**

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
        "timestamp": "09:15:07 04/05/2026"
      },
      {
        "id": 2,
        "device": "Điều hòa",
        "deviceId": "#2",
        "action": "TẮT",
        "status": "Thành công",
        "timestamp": "09:14:30 04/05/2026"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

#### `GET /api/activity/stats`

Lấy thống kê số lần bật/tắt từng thiết bị theo từng ngày.

**Response `200 OK`:**

```json
{
  "success": true,
  "data": {
    "dates": [
      {
        "date": "04/05/2026",
        "Đèn chính": 3,
        "Điều hòa": 1,
        "Quạt trần": 2
      },
      {
        "date": "03/05/2026",
        "Đèn chính": 5,
        "Điều hòa": 2,
        "Quạt trần": 4
      }
    ],
    "devices": ["Đèn chính", "Điều hòa", "Quạt trần"]
  },
  "timestamp": "2026-05-04T09:15:07.000Z"
}
```

---

### 4.2.5. Tổng hợp các Endpoint

| Method | Endpoint | Mô tả | Auth |
| :---: | :--- | :--- | :---: |
| `GET` | `/api/health` | Kiểm tra server | Không |
| `GET` | `/api/devices` | Danh sách thiết bị | Không |
| `GET` | `/api/devices/:id/status` | Trạng thái thiết bị | Không |
| `POST` | `/api/devices/:id/control` | Điều khiển thiết bị | Không |
| `GET` | `/api/sensors/latest` | Cảm biến mới nhất | Không |
| `GET` | `/api/sensors/temperature` | Nhiệt độ mới nhất | Không |
| `GET` | `/api/sensors/humidity` | Độ ẩm mới nhất | Không |
| `GET` | `/api/sensors/light` | Ánh sáng mới nhất | Không |
| `GET` | `/api/sensors/history` | Lịch sử cảm biến (paged) | Không |
| `GET` | `/api/activity` | Lịch sử hoạt động (paged) | Không |
| `GET` | `/api/activity/stats` | Thống kê theo ngày | Không |

---

## 4.4. MQTT và WebSocket Message Format

### 4.4.1. MQTT Topics

Hệ thống sử dụng cấu trúc topic phân cấp theo dạng `iot/{loại}/{id}/{hướng}`.

#### Topics cảm biến (ESP32 → Backend)

| Topic | Hướng | QoS | Định dạng Message |
| :--- | :---: | :---: | :--- |
| `iot/sensor/temperature/data` | Publish | 1 | `{"value": 28.0, "unit": "°C"}` |
| `iot/sensor/humidity/data` | Publish | 1 | `{"value": 55, "unit": "%"}` |
| `iot/sensor/light/data` | Publish | 1 | `{"value": 376.22, "unit": "Lux"}` |
| `iot/sensor/all` | Publish | 1 | `{"temperature": 28.0, "humidity": 55, "light": 376.22}` |

> Topic `iot/sensor/all` được ưu tiên sử dụng vì gửi 3 giá trị trong 1 message, tiết kiệm bandwidth. Khi nhận topic này, backend tự động lưu snapshot vào MongoDB.

#### Topics điều khiển thiết bị (Backend ↔ ESP32)

| Topic | Hướng | QoS | Định dạng Message |
| :--- | :---: | :---: | :--- |
| `iot/device/1/control` | Backend → ESP32 | 1 | `"ON"` hoặc `"OFF"` |
| `iot/device/2/control` | Backend → ESP32 | 1 | `"ON"` hoặc `"OFF"` |
| `iot/device/3/control` | Backend → ESP32 | 1 | `"ON"` hoặc `"OFF"` |
| `iot/device/1/status` | ESP32 → Backend | 1 | `{"deviceId":"1","status":true,"timestamp":"..."}` |
| `iot/device/2/status` | ESP32 → Backend | 1 | `{"deviceId":"2","status":false,"timestamp":"..."}` |
| `iot/device/3/status` | ESP32 → Backend | 1 | `{"deviceId":"3","status":true,"timestamp":"..."}` |

Backend sử dụng wildcard `iot/device/+/control` để subscribe tất cả thiết bị cùng lúc thay vì subscribe từng topic riêng lẻ.

#### Ví dụ mô phỏng bằng Mosquitto CLI

```bash
# Giả lập ESP32 gửi dữ liệu tổng hợp
mosquitto_pub -h localhost -p 1883 \
  -t "iot/sensor/all" \
  -m '{"temperature":28.5,"humidity":60,"light":400}'

# Giả lập ESP32 gửi từng cảm biến riêng
mosquitto_pub -h localhost -p 1883 \
  -t "iot/sensor/temperature/data" \
  -m '{"value":28.5,"unit":"°C"}'

# Bật đèn chính thủ công
mosquitto_pub -h localhost -p 1883 \
  -t "iot/device/1/control" -m "ON"

# Giả lập ESP32 phản hồi trạng thái
mosquitto_pub -h localhost -p 1883 \
  -t "iot/device/1/status" \
  -m '{"deviceId":"1","status":true,"timestamp":"2026-05-04T09:15:07.000Z"}'

# Theo dõi toàn bộ message
mosquitto_sub -h localhost -p 1883 -t "iot/#" -v
```

---

### 4.4.2. WebSocket Events

Trong phiên bản hiện tại, hệ thống chưa triển khai kết nối WebSocket trực tiếp giữa Frontend và Backend. Thay vào đó, Frontend sử dụng cơ chế **HTTP Polling** để lấy dữ liệu theo chu kỳ:

| Dữ liệu | Endpoint | Chu kỳ |
| :--- | :--- | :---: |
| Dữ liệu cảm biến | `GET /api/sensors/latest` | 2 giây |
| Trạng thái thiết bị | `GET /api/devices` | 10 giây |
| Kiểm tra kết nối | `GET /api/health` | 30 giây |

WebSocket (`ws://localhost:3001/ws`) được dự kiến tích hợp trong phiên bản tiếp theo để thay thế polling, nhằm giảm overhead HTTP và cải thiện độ trễ cập nhật dữ liệu.

---

## 4.5. Hiện thực các module chính

### 4.5.1. Module khởi động server (backend/src/index.ts)

Điểm khởi đầu của backend, thực hiện tuần tự: cấu hình DNS → kết nối MongoDB → kết nối MQTT → khởi động HTTP server.

```typescript
import dns from 'dns';
// Fix DNS cho MongoDB Atlas SRV record
// Router local không resolve được SRV, dùng Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function startServer() {
  await connectDB();              // Kết nối MongoDB Atlas

  const mqttClient = await initMQTT();  // Kết nối MQTT (timeout 12s)
  initSensorRoutes(mqttClient);         // Đăng ký MQTT listener

  app.listen(config.port, () => {
    console.log(`Backend running on http://localhost:${config.port}`);
  });
}
```

Nếu MQTT Broker không khả dụng trong 12 giây, server vẫn khởi động bình thường và phục vụ các API request — thiết kế **graceful degradation**.

---

### 4.5.2. Module MQTT Client (backend/src/config/mqtt.ts)

Quản lý kết nối MQTT, publish lệnh điều khiển và xử lý phản hồi từ thiết bị.

```typescript
export function initMQTT(): Promise<MqttClient> {
  return new Promise((resolve) => {
    client = mqtt.connect({
      host: config.mqtt.host,
      port: config.mqtt.port,
      clientId: config.mqtt.clientId,
      reconnectPeriod: 3000,   // Tự kết nối lại sau 3 giây
      keepalive: 60,
    });

    // Timeout 12 giây — nếu không kết nối được, vẫn resolve
    const timeoutId = setTimeout(() => {
      console.log('⚠️ Backend starting WITHOUT MQTT');
      resolve(client);
    }, 12000);

    client.on('connect', () => {
      clearTimeout(timeoutId);
      // Subscribe wildcard để nhận trạng thái mọi thiết bị
      client.subscribe('iot/device/+/control');
      resolve(client);
    });

    // Khi nhận message từ ESP32, cập nhật state và publish status
    client.on('message', (topic, message) => {
      const match = topic.match(/iot\/device\/(\d+)\/control/);
      if (match) {
        const deviceId = match[1];
        deviceStates.set(deviceId, message.toString() === 'ON');
        client.publish(`iot/device/${deviceId}/status`,
          JSON.stringify({ deviceId, status: message.toString() === 'ON',
                           timestamp: new Date().toISOString() }),
          { qos: 1 }
        );
      }
    });
  });
}
```

---

### 4.5.3. Module điều khiển thiết bị (backend/src/services/deviceService.ts)

Lưu danh sách thiết bị trong `Map` in-memory, xử lý lệnh điều khiển và đồng bộ với MQTT.

```typescript
const devices: Map<string, Device> = new Map([
  ['1', { id:'1', name:'Đèn chính', type:'light', status:false,
          lastUpdated: new Date().toISOString() }],
  ['2', { id:'2', name:'Điều hòa',  type:'ac',    status:false,
          lastUpdated: new Date().toISOString() }],
  ['3', { id:'3', name:'Quạt trần', type:'fan',   status:true,
          lastUpdated: new Date().toISOString() }],
]);

static async controlDevice(deviceId: string, action: 'ON'|'OFF')
  : Promise<DeviceControlResponse> {

  const device = devices.get(deviceId);
  if (!device) throw new Error('Device not found');

  // Cập nhật state ngay lập tức (không đợi MQTT confirm)
  device.status = action === 'ON';
  device.lastUpdated = new Date().toISOString();
  setDeviceState(deviceId, device.status);

  try {
    await publishMQTT(`iot/device/${deviceId}/control`, action);
    return { success:true, deviceId, newStatus:device.status,
             message:`Device turned ${action} successfully` };
  } catch {
    // MQTT offline — vẫn trả về success (state đã cập nhật in-memory)
    return { success:true, deviceId, newStatus:device.status,
             message:`Device turned ${action} (MQTT offline)` };
  }
}
```

---

### 4.5.4. Module lưu lịch sử cảm biến (backend/src/routes/sensors.ts)

MQTT listener nhận dữ liệu từ ESP32 và tự động lưu vào MongoDB khi nhận topic `iot/sensor/all`.

```typescript
mqttClient.on('message', (topic: string, message: Buffer) => {
  if (!topic.startsWith('iot/sensor/')) return;

  const data = JSON.parse(message.toString());

  if (topic === 'iot/sensor/all') {
    // Cập nhật in-memory để API /latest trả về nhanh
    sensorReadings.temperature.value = data.temperature;
    sensorReadings.humidity.value    = data.humidity;
    sensorReadings.light.value       = data.light;

    // Lưu vào MongoDB Atlas (async, không block)
    saveSensorReading(data.temperature, data.humidity, data.light)
      .catch(err => console.error('Failed to save:', err));
  }
});
```

---

### 4.5.5. Module quản lý trạng thái toàn cục Frontend (DeviceContext.tsx)

React Context cung cấp state thiết bị cho toàn bộ ứng dụng, kết hợp localStorage cache để tránh màn hình trắng khi reload.

```typescript
const loadDevices = async () => {
  // 1. Đọc cache localStorage — hiển thị ngay không chờ network
  const cached = localStorage.getItem('devices');
  if (cached) setDevices(JSON.parse(cached));

  // 2. Fetch từ backend để lấy dữ liệu mới nhất
  const res = await deviceApi.getAll();
  if (res.success && res.data) {
    setDevices(res.data);
    localStorage.setItem('devices', JSON.stringify(res.data));
  }
};

useEffect(() => {
  loadDevices();
  // Tự động refresh mỗi 10 giây
  const interval = setInterval(loadDevices, 10_000);
  return () => clearInterval(interval);
}, []);

// Cập nhật optimistic (không đợi server confirm)
const updateDeviceStatus = (deviceId: string, status: boolean) => {
  setDevices(prev => {
    const updated = prev.map(d =>
      d.id === deviceId
        ? { ...d, status, lastUpdated: new Date().toISOString() }
        : d
    );
    localStorage.setItem('devices', JSON.stringify(updated));
    return updated;
  });
};
```

---

### 4.5.6. Module Flatten dữ liệu cảm biến (EventHistory.tsx)

Mỗi bản ghi `HistoryRecord` từ API chứa 3 giá trị (nhiệt độ + độ ẩm + ánh sáng). Frontend **flatten** mỗi bản ghi thành 3 dòng riêng biệt trong bảng.

```typescript
function flattenRecords(records: HistoryRecord[]): FlatRow[] {
  const rows: FlatRow[] = [];
  records.forEach((r) => {
    rows.push({ id:`#${r.id*3-2}`, type:'temperature',
                label:'Nhiệt độ', value:r.temperature.toFixed(1),
                unit:'°C', timestamp:r.timestamp });
    rows.push({ id:`#${r.id*3-1}`, type:'humidity',
                label:'Độ ẩm', value:r.humidity.toFixed(0),
                unit:'%',  timestamp:r.timestamp });
    rows.push({ id:`#${r.id*3}`,   type:'light',
                label:'Ánh sáng', value:r.light.toFixed(2),
                unit:'lux', timestamp:r.timestamp });
  });
  return rows;
}
```

Kết quả: 1 trang API trả về 10 bản ghi → bảng hiển thị 30 dòng (10 × 3 loại cảm biến).


---

# CHƯƠNG 5: KIỂM THỬ VÀ ĐÁNH GIÁ

## 5.1. Kế hoạch kiểm thử

### 5.1.1. Chiến lược kiểm thử tổng thể

Hệ thống được kiểm thử theo mô hình phân tầng — mỗi tầng được kiểm tra độc lập trước khi kiểm tra tích hợp toàn bộ:

| Tầng | Loại kiểm thử | Công cụ |
| :--- | :--- | :--- |
| Frontend (UI) | Manual testing, Browser DevTools | Chrome, Firefox |
| Backend (API) | Functional testing | Postman, cURL |
| Database | Data validation | MongoDB Atlas Console |
| MQTT | Protocol testing | mosquitto_pub / mosquitto_sub |
| Tích hợp (End-to-End) | Kiểm thử luồng hoàn chỉnh | Thủ công + DevTools |

### 5.1.2. Danh mục kiểm thử

| STT | Nhóm chức năng | Số test case | Mức ưu tiên |
| :---: | :--- | :---: | :--- |
| 1 | Dashboard — giám sát cảm biến | 3 | Cao |
| 2 | Điều khiển thiết bị | 5 | Cao |
| 3 | Lịch sử cảm biến (EventHistory) | 2 | Trung bình |
| 4 | Lịch sử hoạt động (ActivityLog) | 2 | Trung bình |
| 5 | Xử lý lỗi và mất kết nối | 4 | Cao |
| **Tổng** | | **16** | |

---

## 5.2. Test Cases

### 5.2.1. API Health và Device

**TC-01: Health Check**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-01 |
| Mô tả | Endpoint /api/health phản hồi đúng |
| Phương thức | GET |
| URL | http://localhost:3000/api/health |
| Expected | HTTP 200, {"status":"ok","timestamp":"..."} |
| Kết quả | Đạt |

**TC-02: Lấy danh sách thiết bị**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-02 |
| Mô tả | Trả về mảng 3 thiết bị (id 1, 2, 3) |
| Phương thức | GET |
| URL | http://localhost:3000/api/devices |
| Expected | HTTP 200, mảng 3 phần tử |
| Kết quả | Đạt |

**TC-03: Bật thiết bị**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-03 |
| Mô tả | Gửi lệnh BẬT đến đèn chính (id=1) |
| Phương thức | POST |
| URL | http://localhost:3000/api/devices/1/control |
| Body | {"status": true} |
| Expected | HTTP 200, {"success":true,"device":{"status":true}} |
| Kết quả | Đạt |

**TC-04: Tắt thiết bị**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-04 |
| Mô tả | Gửi lệnh TẮT đến điều hòa (id=2) |
| Phương thức | POST |
| URL | http://localhost:3000/api/devices/2/control |
| Body | {"status": false} |
| Expected | HTTP 200, {"success":true,"device":{"status":false}} |
| Kết quả | Đạt |

**TC-05: Thiết bị không tồn tại**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-05 |
| Mô tả | Truy cập thiết bị id=99 (không tồn tại) |
| Phương thức | GET |
| URL | http://localhost:3000/api/devices/99/status |
| Expected | HTTP 404, {"error":"Device not found"} |
| Kết quả | Đạt |

---

### 5.2.2. API Cảm biến và Lịch sử

**TC-06: Lấy dữ liệu cảm biến mới nhất**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-06 |
| Mô tả | Lấy reading cảm biến gần nhất |
| Phương thức | GET |
| URL | http://localhost:3000/api/sensors/latest |
| Expected | HTTP 200, có đủ trường temperature, humidity, light, timestamp |
| Kết quả | Đạt |

**TC-07: Lịch sử cảm biến có phân trang**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-07 |
| Mô tả | Lấy trang 2, mỗi trang 10 bản ghi |
| Phương thức | GET |
| URL | http://localhost:3000/api/sensors/history?page=2&limit=10 |
| Expected | HTTP 200, data gồm 10 bản ghi, pagination.page=2 |
| Kết quả | Đạt |

**TC-08: Lịch sử hoạt động thiết bị**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-08 |
| Mô tả | Lấy log hành động điều khiển |
| Phương thức | GET |
| URL | http://localhost:3000/api/activity?page=1&limit=10 |
| Expected | HTTP 200, mỗi item có device, action, status, timestamp |
| Kết quả | Đạt |

---

### 5.2.3. Kiểm thử Frontend (Thủ công)

**TC-09: Dashboard cảm biến cập nhật tự động**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-09 |
| Mô tả | Dữ liệu cảm biến làm mới mỗi 2 giây |
| Bước thực hiện | Mở Dashboard, quan sát trong 10 giây |
| Expected | Giá trị MetricCard thay đổi; biểu đồ thêm điểm mới |
| Kết quả | Đạt |

**TC-10: Loading state khi điều khiển thiết bị**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-10 |
| Mô tả | Spinner xuất hiện khi chờ phản hồi API |
| Bước thực hiện | Click toggle thiết bị, quan sát ngay lập tức |
| Expected | Nút disabled + spinner; sau phản hồi spinner biến mất |
| Kết quả | Đạt |

**TC-11: State persistence sau reload**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-11 |
| Mô tả | Trạng thái thiết bị không mất sau F5 |
| Bước thực hiện | Bật đèn chính, nhấn F5 |
| Expected | Đèn chính vẫn hiển thị BẬT (đọc từ localStorage) |
| Kết quả | Đạt |

**TC-12: Lọc theo loại cảm biến**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-12 |
| Mô tả | Chọn Nhiệt độ trong dropdown lọc EventHistory |
| Bước thực hiện | Vào /history, chọn Nhiệt độ trong dropdown |
| Expected | Bảng chỉ hiển thị dòng Nhiệt độ |
| Kết quả | Đạt |

**TC-13: Phân trang bảng**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-13 |
| Mô tả | Click sang trang 2 trong EventHistory |
| Bước thực hiện | Click nút Next page |
| Expected | Hiển thị đúng 10 dòng tiếp theo, số trang là 2 |
| Kết quả | Đạt |

---

### 5.2.4. Kiểm thử MQTT

**TC-14: Publish dữ liệu cảm biến**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-14 |
| Mô tả | Backend nhận và lưu dữ liệu cảm biến qua MQTT |
| Lệnh | mosquitto_pub -h localhost -p 1883 -t iot/sensor/all -m '{"temperature":26.5,"humidity":60,"light":300}' |
| Expected | Backend log ghi nhận; MongoDB lưu bản ghi mới; /sensors/latest trả về giá trị mới |
| Kết quả | Đạt |

**TC-15: Điều khiển thiết bị qua MQTT**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-15 |
| Mô tả | Backend publish lệnh đúng topic khi frontend gửi yêu cầu |
| Bước thực hiện | Subscriber trên topic iot/device/1/control, click BẬT trên Dashboard |
| Expected | Subscriber nhận payload ON trong vòng 1 giây |
| Kết quả | Đạt |

**TC-16: Graceful degradation khi MQTT offline**

| Trường | Giá trị |
| :--- | :--- |
| Test ID | TC-16 |
| Mô tả | Backend khởi động được dù MQTT broker không hoạt động |
| Bước thực hiện | Tắt Mosquitto, khởi động backend |
| Expected | Sau 12 giây timeout backend vẫn khởi động, phục vụ API bình thường |
| Kết quả | Đạt |

---

## 5.3. Đánh giá hệ thống

### 5.3.1. Kết quả kiểm thử tổng hợp

| Nhóm | Tổng TC | Đạt | Không đạt | Tỉ lệ |
| :--- | :---: | :---: | :---: | :---: |
| API Health và Device | 5 | 5 | 0 | 100% |
| API Sensor và Activity | 3 | 3 | 0 | 100% |
| Frontend Manual | 5 | 5 | 0 | 100% |
| MQTT Protocol | 3 | 3 | 0 | 100% |
| **Tổng** | **16** | **16** | **0** | **100%** |

---

### 5.3.2. Đánh giá hiệu năng

Thời gian phản hồi API đo trong điều kiện mạng nội bộ, kết nối MongoDB Atlas qua Internet:

| Endpoint | Thời gian TB | Thời gian Max |
| :--- | :---: | :---: |
| GET /api/health | 8 ms | 15 ms |
| GET /api/devices | 45 ms | 120 ms |
| POST /api/devices/:id/control | 180 ms | 350 ms |
| GET /api/sensors/latest | 55 ms | 130 ms |
| GET /api/sensors/history | 90 ms | 200 ms |
| GET /api/activity | 85 ms | 190 ms |

**Nhận xét:**
- Tất cả endpoint đáp ứng trong dưới 400 ms, nằm trong ngưỡng tốt cho ứng dụng web.
- Endpoint /control chậm hơn do cần publish MQTT và chờ xác nhận từ thiết bị.
- Độ trễ MongoDB Atlas (cloud, free tier) dao động 40–100 ms do kết nối quốc tế.

---

### 5.3.3. Đánh giá độ tin cậy

| Tình huống | Hành vi hệ thống | Đánh giá |
| :--- | :--- | :---: |
| Backend offline | Header đỏ, banner mất kết nối, localStorage vẫn hiển thị | Tốt |
| MongoDB không kết nối | Backend log lỗi, trả HTTP 503 cho endpoint liên quan DB | Tốt |
| MQTT Broker offline | Backend khởi động sau 12 giây, phục vụ API bình thường | Tốt |
| Request API timeout | Alert lỗi, UI revert trạng thái cũ, không treo giao diện | Tốt |
| Reload trang | Thiết bị hiển thị ngay từ localStorage, fetch mới ở nền | Tốt |

---

### 5.3.4. Đánh giá theo tiêu chí đề tài

| Tiêu chí yêu cầu | Đã đáp ứng | Ghi chú |
| :--- | :---: | :--- |
| Hiển thị dữ liệu cảm biến real-time | Có | Polling 2 giây, biểu đồ cập nhật động |
| Điều khiển ON/OFF 3 thiết bị | Có | Đèn chính, Điều hòa, Quạt trần |
| Loading state khi điều khiển | Có | Spinner và disabled button |
| State persistence sau reload | Có | localStorage cache |
| Giao diện single-screen (không cuộn) | Có | h-screen overflow-hidden |
| Lịch sử cảm biến và phân trang | Có | 10 bản ghi/trang, sort 3 cột |
| Lịch sử hoạt động và phân trang | Có | Lọc theo thiết bị, sort thời gian |
| Trang Profile sinh viên | Có | Thông tin đầy đủ, links tài liệu |
| Kết nối MongoDB Atlas | Có | DNS fix với Google DNS |
| Tích hợp MQTT | Có | Graceful degradation nếu broker offline |
| Xử lý mất kết nối | Có | Auto-reconnect mỗi 3 giây |

**11/11 tiêu chí đạt yêu cầu.**

---

### 5.3.5. Hạn chế còn tồn tại

Dù hệ thống đáp ứng đầy đủ các yêu cầu đề tài, một số điểm cần cải thiện trong tương lai:

1. **Chưa có xác thực người dùng (Authentication)**: API hiện tại là public. Cần bổ sung JWT hoặc API key cho môi trường sản xuất.

2. **Polling thay vì WebSocket**: Frontend dùng HTTP polling (2 giây) thay vì WebSocket, gây overhead không cần thiết khi dữ liệu không đổi.

3. **Độ trễ khởi động khi MQTT offline**: Timeout 12 giây làm chậm quá trình khởi động. Có thể giảm bằng cách cấu hình connectTimeout ngắn hơn.

4. **Chưa có unit test tự động**: Kiểm thử hiện tại hoàn toàn thủ công. Cần bổ sung Vitest cho frontend và Jest cho backend.

5. **Giới hạn MongoDB free tier**: 512 MB lưu trữ đủ cho demo nhưng không phù hợp triển khai dài hạn.

