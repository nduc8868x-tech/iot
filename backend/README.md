# IoT Backend Server

Node.js/Express backend for IoT System with MQTT integration.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy example config
cp .env.example .env
# Edit .env if needed
```

### 3. Start Server
```bash
# Development with auto-reload
npm run devw

# Or just development
npm run dev

# Production
npm run build
npm start
```

Server will run on **http://localhost:3000**

---

## Prerequisites

### Required
- **Node.js 16+**
- **npm 8+**

### Optional
- **Mosquitto MQTT Broker**
  ```bash
  # Windows: Download from https://mosquitto.org/download/
  # Linux: sudo apt-get install mosquitto
  # macOS: brew install mosquitto
  
  # Start broker
  mosquitto -v
  ```

---

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Devices
```bash
# Get all devices
GET /api/devices

# Get device status
GET /api/devices/{deviceId}/status

# Control device (ON/OFF)
POST /api/devices/{deviceId}/control
Content-Type: application/json

{
  "action": "ON"
}
```

### MQTT
```bash
# Publish MQTT message
POST /api/mqtt/publish
Content-Type: application/json

{
  "topic": "iot/device/1/control",
  "message": "ON"
}
```

---

## Testing with cURL

```bash
# Check health
curl -X GET http://localhost:3000/api/health

# Get all devices
curl -X GET http://localhost:3000/api/devices

# Control device
curl -X POST http://localhost:3000/api/devices/1/control \
  -H "Content-Type: application/json" \
  -d '{"action":"ON"}'

# Publish MQTT message
curl -X POST http://localhost:3000/api/mqtt/publish \
  -H "Content-Type: application/json" \
  -d '{"topic":"iot/sensor/temp/data","message":"23.5"}'
```

---

## MQTT Integration

### Subscribe (Receive)
```bash
# Listen to device control commands
mosquitto_sub -h localhost -p 1883 -t "iot/device/+/control"

# Listen to all IoT messages
mosquitto_sub -h localhost -p 1883 -t "iot/+/+"
```

### Publish (Send)
```bash
# Turn device ON
mosquitto_pub -h localhost -p 1883 -t "iot/device/1/control" -m "ON"

# Send sensor data
mosquitto_pub -h localhost -p 1883 \
  -t "iot/sensor/temperature/data" \
  -m '{"value":23.5,"unit":"°C"}'
```

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts                  # Main server
│   ├── config/
│   │   ├── env.ts               # Environment config
│   │   └── mqtt.ts              # MQTT client setup
│   ├── routes/
│   │   ├── devices.ts           # Device endpoints
│   │   └── mqtt.ts              # MQTT endpoints
│   ├── services/
│   │   └── deviceService.ts     # Business logic
│   └── types/
│       └── index.ts             # TypeScript types
├── package.json
├── tsconfig.json
├── .env
├── .env.example
└── README.md
```

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# MQTT Broker
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_CLIENT_ID=iot-backend
MQTT_USERNAME=              # Optional
MQTT_PASSWORD=              # Optional

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Features

✅ Express REST API  
✅ MQTT Client (Publish & Subscribe)  
✅ Device Management  
✅ Device Control  
✅ CORS Support  
✅ Error Handling  
✅ TypeScript Support  
✅ Development Auto-reload  

---

## Common Errors

### Cannot find mosquitto

**Solution:**
- Install mosquitto (see Prerequisites)
- Or skip MQTT and use mock mode

### Port 3000 already in use

**Solution:**
```bash
# Change port in .env
PORT=3001
```

### CORS Error

**Solution:**
```bash
# Update .env
CORS_ORIGIN=http://your-frontend-url
```

### MQTT connection timeout

**Solution:**
```bash
# Check broker is running
mosquitto -v

# Check firewall allows port 1883
```

---

## Next Steps

1. ✅ Start backend: `npm run devw`
2. ✅ Start frontend: `cd ../` then `npm run dev`
3. ✅ Start MQTT: `mosquitto -v`
4. ✅ Test endpoints with cURL or Postman
5. ✅ Check devices in frontend dashboard

---

**Version:** 1.0.0  
**Status:** Ready for Development
