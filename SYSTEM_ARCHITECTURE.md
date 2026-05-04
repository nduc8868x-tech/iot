# IoT System Architecture Documentation

## System Overview

This is a complete IoT system for remote device control and sensor data monitoring. The system integrates:
- **Frontend**: React + TypeScript + Vite
- **Backend API**: Node.js/Express + TypeScript
- **Database**: MongoDB Atlas (cloud, free tier)
- **Message Queue**: MQTT (Mosquitto Broker)
- **Hardware**: ESP32/ESP8266 with sensors and LED/relay control

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐       │
│  │  Dashboard   │  │  Activity    │  │  Device Control  │       │
│  │  (Real-time) │  │  History     │  │  (with Loading)  │       │
│  └──────────────┘  └──────────────┘  └──────────────────┘       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               DeviceContext (Global State)              │    │
│  │  ├─ Device List                                         │    │
│  │  ├─ Device Status (with localStorage cache)            │    │
│  │  └─ Connection State                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ HTTP REST API
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                      Backend API Server                          │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  REST Endpoints                                      │       │
│  │  ├─ GET  /api/devices          (List all devices)   │       │
│  │  ├─ GET  /api/devices/{id}/status                   │       │
│  │  ├─ POST /api/devices/{id}/control (Toggle device)  │       │
│  │  ├─ GET  /api/sensors/latest   (Latest readings)    │       │
│  │  ├─ GET  /api/sensors/history  (Paginated history)  │       │
│  │  ├─ GET  /api/activity         (Action log)         │       │
│  │  └─ GET  /api/health           (Connection check)   │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  MQTT Client                                         │       │
│  │  ├─ Subscribe: iot/sensor/+/data   (sensor values)  │       │
│  │  ├─ Subscribe: iot/sensor/all      (all sensors)    │       │
│  │  ├─ Subscribe: iot/device/+/status (status updates) │       │
│  │  └─ Publish:   iot/device/{id}/control (commands)   │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  MongoDB Atlas (Mongoose ODM)                        │       │
│  │  ├─ SensorData   (temperature, humidity, light)     │       │
│  │  ├─ DeviceAction (device, action, status, time)     │       │
│  │  └─ Device       (deviceId, name, type, status)     │       │
│  └──────────────────────────────────────────────────────┘       │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ MQTT Protocol
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                    MQTT Broker (Mosquitto)                       │
│                                                                  │
│  Topics:                                                         │
│  ├─ iot/sensor/temperature/data    (Temperature readings)       │
│  ├─ iot/sensor/humidity/data       (Humidity readings)          │
│  ├─ iot/sensor/light/data          (Light sensor readings)      │
│  ├─ iot/device/1/control           (Control Light)              │
│  ├─ iot/device/2/control           (Control AC)                 │
│  ├─ iot/device/3/control           (Control Fan)                │
│  ├─ iot/device/1/status            (Light status)               │
│  ├─ iot/device/2/status            (AC status)                  │
│  └─ iot/device/3/status            (Fan status)                 │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ MQTT Subscribe & Publish
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                      Hardware (ESP32/ESP8266)                    │
│                                                                  │
│  Sensors:              Devices/Actuators:                        │
│  ├─ DHT22 Sensor       ├─ LED 1 (Digital Pin)                  │
│  │  (Temp & Humidity)  ├─ LED 2 (Digital Pin)                  │
│  ├─ LDR Sensor         ├─ Relay Module                          │
│  │  (Light Level)      └─ Buzzer (PWM Pin)                      │
│  └─ ADC Readings                                                │
│                                                                  │
│  Firmware Tasks:                                                │
│  ├─ Read sensors every 2 seconds                                │
│  ├─ Publish sensor data to MQTT                                 │
│  ├─ Subscribe to device control topics                          │
│  └─ Control outputs based on MQTT messages                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequences

### Sequence 1: Reading Sensor Data (Hardware → Frontend)

```
Hardware                 MQTT Broker              Backend              Frontend
   │                         │                       │                   │
   ├─ Read sensors ──────┐   │                       │                   │
   │                     │   │                       │                   │
   └─ Publish to ────────┼──→ iot/sensor/temp/data  │                   │
     iot/sensor/temp/data │  │                       │                   │
                          │  ├─ MQTT Client ────────│─ Store in memory  │
                          │  │  subscribes          │                   │
                          │  │                      ├─ API: GET /devices│
                          │  │                      │  (returns latest) │←──┐
                          │  │                      │                   │   │
                          │  │                      │←─────────────────┤   │
                          │  │                      │                   │──→│
                          │  │                      │  New sensor data  │   │
                          │  │                      │                   │   │
                          │  │                      │  Update React     │
                          │  │                      │  State → Re-render│
                          │                        │
    (Repeat every 2 seconds)
```

**Key Points:**
- Hardware publishes sensor data every 2 seconds
- Backend MQTT client receives and stores the data
- Frontend polls API every 10 seconds to get latest readings
- Dashboard displays data in real-time charts (recharts library)

---

### Sequence 2: Device Control (Frontend → Hardware)

```
Frontend                Backend API         MQTT Broker           Hardware
   │                        │                   │                    │
   └─ User clicks toggle ────│─ POST /api/devices/{id}/control
                            │                   │
                ┌─ Display loading spinner      │
                │           │                   │
                │  Publish to ────────────────→ iot/device/1/control
                │  iot/device/1/control        │
                │           │                   │ Subscribe
                │           │                   │ iot/device/1/control
                │           │                   │
                │           │                   └──→ Control LED/Relay
                │           │                        (Execute action)
                │           │                        │
                │           │ Publish status update │
                │           │← iot/device/1/status──┘
                │           │                   │
                │  Update    │                   │
                │  in-memory ├─ Store in backend│
                │  cache     │   database       │
                │           │                   │
                └─ Hide loading spinner
                   Update UI to new state
                           │←────────────────────── 
                   (only if request successful)
```

**Key Points:**
1. UI shows loading state immediately
2. Request sent to backend with timestamp
3. Backend publishes MQTT command to hardware
4. Hardware executes and publishes status update
5. Backend receives status confirmation
6. Frontend receives success response
7. UI updates to reflect actual hardware state

---

### Sequence 3: Page Reload with State Persistence

```
User refreshes page (F5)
         │
         ▼
   React remounts
         │
         ├─ DeviceContext reads localStorage
         │  (previously cached device states)
         │
         ├─ Display cached device states
         │  immediately (no blank screen)
         │
         └─ Fetch fresh data from API/MQTT
            (updates in background)
         │
         ├─ mergeWith cached state
         │  (if hardware state changed)
         │
         └─ Update UI with latest values
            (smooth transition)
```

**Key Points:**
- Cached device list prevents blank screen on reload
- Fresh data fetched from server in parallel
- UI updates smoothly with latest hardware state
- No race conditions due to request queuing

---

## Component Architecture

### Frontend Structure

```
src/
├── components/
│   ├── Header.tsx              (Navigation + Connection Status)
│   ├── DeviceControl.tsx       (Device toggle switches with loading)
│   ├── MetricCard.tsx          (Display sensor values)
│   ├── SensorChart.tsx         (Real-time data visualization)
│   ├── Pagination.tsx          (Table pagination)
│   └── ConnectionStatus.tsx    (Status indicators & banners)
│
├── pages/
│   ├── Dashboard.tsx           (Main dashboard with charts)
│   ├── ActivityLog.tsx         (Device control history)
│   ├── EventHistory.tsx        (Sensor data logs)
│   └── Profile.tsx             (User profile info)
│
├── context/
│   └── DeviceContext.tsx       (Global device state management)
│
├── hooks/
│   └── useConnection.ts        (Custom hooks for data fetching)
│
├── services/
│   ├── types.ts                (TypeScript interfaces)
│   ├── deviceService.ts        (API client with error handling)
│   └── connectionStatusService.ts (Connection monitoring)
│
└── App.tsx                     (Main app wrapper)
```

---

## State Management Strategy

### Global State (DeviceContext)
```typescript
{
  devices: Device[],           // List of all devices
  isLoading: boolean,          // API loading state
  error: string | null,        // Error message
  refreshDevices: () => Promise<void>,
  updateDeviceStatus: (id, status) => void
}
```

### Local Component State
- `isControlling`: Loading state during device control
- `currentPage`: Pagination state in tables

### Persistent State (localStorage)
- Cached device list
- User preferences
- Last connection timestamp

### Service State
- Connection status (dedicated service)
- Request queue (prevents race conditions)

---

## Error Handling & Resilience

### Connection States
1. **Connected**: Normal operation
2. **Disconnected**: Show banner, use cached data
3. **Reconnecting**: Auto-retry every 3 seconds (max 5 attempts)
4. **Error**: Display error message in UI

### Request Failures
1. Display error toast/alert
2. Revert UI state to previous value
3. Log error to console
4. Retry on next user action

### Timeout Handling
- HTTP requests: 5-second timeout
- Health checks: 30-second interval
- MQTT reconnect: 3-second interval

---

## Device Types & Properties

```typescript
interface Device {
  id: string;              // Unique identifier
  name: string;            // Display name
  type: 'light'|'fan'|'ac'|'other';
  status: boolean;         // ON/OFF state
  lastUpdated: string;     // ISO 8601 timestamp
}
```

---

## Database Design (MongoDB Atlas)

Database: **MongoDB Atlas** — cloud NoSQL, free tier (512MB).
ODM: **Mongoose** với TypeScript.

### Collection 1: SensorData
```typescript
{
  temperature: Number,   // °C
  humidity:    Number,   // %
  light:       Number,   // Lux
  timestamp:   Date      // auto, indexed
}
```
Dữ liệu được lưu tự động mỗi khi ESP32 publish lên topic `iot/sensor/all`.

### Collection 2: DeviceAction
```typescript
{
  device:    String,   // "Đèn chính"
  deviceId:  String,   // "#1"
  action:    String,   // "BẬT" | "TẮT"
  status:    String,   // "Thành công" | "Thất bại"
  timestamp: Date      // auto, indexed
}
```
Ghi lại mỗi lần người dùng điều khiển thiết bị qua frontend.

### Collection 3: Device
```typescript
{
  deviceId:    String,   // "1", "2", "3"...
  name:        String,   // "Đèn chính"
  type:        String,   // "light" | "fan" | "ac" | "other"
  status:      Boolean,  // true = ON
  lastUpdated: Date
}
```

### Kết nối
File: `backend/src/config/database.ts`
```typescript
import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);
```
Backend dùng Google DNS (`8.8.8.8`) để resolve SRV record của Atlas khi router local không hỗ trợ.

---

## Performance Considerations

### Frontend
- Lazy load pages with Code Splitting
- Virtual scrolling for large tables
- Debounce search input (300ms)
- Cache sensor data visualization

### Backend
- Index on frequently searched columns (timestamp, device_id)
- Connection pooling for database
- Gzip compression for API responses
- MQTT topic filtering to reduce message volume

### MQTT
- QoS level 1 (At least once delivery)
- Last Will Testament (LWT) for device offline detection
- Topic limits to specific sensors/devices

---

## Security Considerations

1. **API Authentication**: Implement JWT tokens (future enhancement)
2. **MQTT Security**: Enable authentication and ACLs
3. **Input Validation**: Sanitize all API inputs
4. **Rate Limiting**: Max 10 requests/second per IP
5. **HTTPS**: Use in production (MQTT over WSS)
6. **Secrets**: Store API keys and broker credentials in .env files

---

## Deployment Architecture

### Development
```
Frontend: npm run dev (Vite dev server on :5173)
Backend: npm start (Node.js on :3000)
MQTT: mosquitto (Local broker on :1883, :9001)
```

### Production
```
Frontend: Static files on CDN or web server
Backend: Docker container or cloud VM
MQTT: Cloud-hosted or self-managed broker
Database: Cloud database (RDS, Cloud SQL, etc.)
```

---

## Testing Strategy

### Unit Tests
- Service functions (deviceService.ts)
- Utility functions

### Integration Tests
- API endpoints
- MQTT publish/subscribe

### E2E Tests
- Device control flow
- Page navigation
- Error scenarios

---

## Monitoring & Logging

### Metrics to Track
- API response times
- Device control success rate
- Connection uptime
- Sensor data quality

### Logging
- API request/response logs
- Device control events
- Error stack traces
- MQTT message logs

---

## Future Enhancements

1. **User Authentication**: Multi-user system with roles
2. **Automation**: Schedule device actions
3. **Notifications**: Push notifications for events
4. **Historical Analytics**: Data trends and reports
5. **Mobile App**: React Native version
6. **Voice Control**: Alexa/Google Home integration
7. **Machine Learning**: Predictive control

---

**Document Version**: 1.1  
**Last Updated**: May 2026  
**Maintainer**: Nguyễn Mạnh Đức (B22DCPT061) — D22CQPT01  
**Repository**: [nduc8868x-tech/iot](https://github.com/nduc8868x-tech/iot)
