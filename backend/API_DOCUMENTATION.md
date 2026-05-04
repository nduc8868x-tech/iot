# IoT System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Environment Variables
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_MQTT_BROKER=ws://localhost:9001
```

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check API server connection status.

**Response:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-03-22T10:30:00Z"
}
```

---

### 2. Get All Devices

**GET** `/devices`

Retrieve list of all IoT devices.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Đèn chính",
      "type": "light",
      "status": true,
      "lastUpdated": "2024-03-22T10:30:00Z"
    },
    {
      "id": "2",
      "name": "Điều hòa",
      "type": "ac",
      "status": false,
      "lastUpdated": "2024-03-22T10:25:00Z"
    },
    {
      "id": "3",
      "name": "Quạt trần",
      "type": "fan",
      "status": true,
      "lastUpdated": "2024-03-22T10:28:00Z"
    }
  ],
  "timestamp": "2024-03-22T10:30:00Z"
}
```

**Status Codes:**
- `200` - Successfully retrieved devices
- `500` - Server error

---

### 3. Get Device Status

**GET** `/devices/{deviceId}/status`

Get current status of a specific device.

**URL Parameters:**
- `deviceId` (string, required) - Device ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": true,
    "timestamp": "2024-03-22T10:30:00Z"
  },
  "timestamp": "2024-03-22T10:30:00Z"
}
```

**Status Codes:**
- `200` - Successfully retrieved device status
- `404` - Device not found
- `500` - Server error

---

### 4. Control Device (ON/OFF)

**POST** `/devices/{deviceId}/control`

Send control command to device (turn ON or OFF).

**URL Parameters:**
- `deviceId` (string, required) - Device ID

**Request Body:**
```json
{
  "action": "ON",
  "timestamp": "2024-03-22T10:30:00Z"
}
```

**Parameters:**
- `action` (string, required) - "ON" or "OFF"
- `timestamp` (string, required) - ISO 8601 timestamp

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "deviceId": "1",
    "newStatus": true,
    "message": "Device turned ON successfully"
  },
  "timestamp": "2024-03-22T10:30:00Z"
}
```

**Status Codes:**
- `200` - Command sent successfully
- `404` - Device not found
- `500` - Server error

**Important Notes:**
- UI shows loading state immediately after request
- UI updates to reflect new state only after successful response
- If request fails, UI reverts to previous state
- All device control requests are queued to prevent race conditions

---

### 5. Publish MQTT Message

**POST** `/mqtt/publish`

Publish message to MQTT topic (for direct hardware communication testing).

**Request Body:**
```json
{
  "topic": "iot/device/1/control",
  "message": "ON",
  "timestamp": "2024-03-22T10:30:00Z"
}
```

**Parameters:**
- `topic` (string, required) - MQTT topic
- `message` (string, required) - Message payload
- `timestamp` (string, required) - ISO 8601 timestamp

**Response:**
```json
{
  "success": true,
  "message": "Message published successfully",
  "topic": "iot/device/1/control",
  "timestamp": "2024-03-22T10:30:00Z"
}
```

**Status Codes:**
- `200` - Message published successfully
- `500` - Server error

---

## MQTT Topics

### Publishing (Frontend → Hardware)

```
iot/device/{deviceId}/control    → Send ON/OFF commands
```

**Message Format:**
```
ON    (turn device on)
OFF   (turn device off)
```

### Subscribing (Hardware → Frontend)

```
iot/sensor/temperature     → Temperature readings
iot/sensor/humidity        → Humidity readings
iot/sensor/light           → Light sensor readings
iot/device/{deviceId}/status     → Device status changes
```

**Message Format:**
```json
{
  "value": 23.5,
  "unit": "°C",
  "timestamp": "2024-03-22T10:30:00Z"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-03-22T10:30:00Z"
}
```

### Common Errors
| Error | Description |
|-------|-------------|
| `Device not found` | Specified device ID doesn't exist |
| `Invalid action` | Action must be "ON" or "OFF" |
| `Connection failed` | Cannot connect to MQTT broker |
| `Timeout` | Request took too long |

---

## Rate Limiting

- Maximum 10 requests per second per IP
- Maximum 5 control commands per device per minute

---

## Connection Handling

### Offline Support
- Device list is cached in localStorage
- When offline, app displays cached device states
- Requests are queued and retried when connection is restored

### Disconnection Detection
- Health check runs every 30 seconds
- Connection status indicator in header shows real-time status
- Network status banner appears when disconnected

---

## Testing with cURL

### Get All Devices
```bash
curl -X GET http://localhost:3000/api/devices
```

### Get Device Status
```bash
curl -X GET http://localhost:3000/api/devices/1/status
```

### Control Device
```bash
curl -X POST http://localhost:3000/api/devices/1/control \
  -H "Content-Type: application/json" \
  -d '{"action":"ON","timestamp":"2024-03-22T10:30:00Z"}'
```

### Check Health
```bash
curl -X GET http://localhost:3000/api/health
```

---

## WebSocket Connection (MQTT)

### Broker Details
- URL: `ws://localhost:9001`
- Protocol: MQTT over WebSocket
- Auto-reconnect: Enabled
- Reconnect interval: 3 seconds (max 5 attempts)

### Testing with Mosquitto CLI

**Terminal 1 - Subscribe to sensor data:**
```bash
mosquitto_sub -h localhost -p 1883 -t "iot/sensor/+/data"
```

**Terminal 2 - Subscribe to device status:**
```bash
mosquitto_sub -h localhost -p 1883 -t "iot/device/+/status"
```

**Terminal 3 - Publish device command:**
```bash
mosquitto_pub -h localhost -p 1883 -t "iot/device/1/control" -m "ON"
```

---

## Version
- API Version: 1.0.0
- Last Updated: March 2024
