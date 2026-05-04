# IoT System - Complete Deployment & User Guide

**Project**: Smart Home IoT Control System  
**Student**: Nguyễn Văn A (B21DCCN001)  
**Class**: D21CQCN01-B  
**Date**: March 2024

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Running the System](#running-the-system)
5. [System Features](#system-features)
6. [Testing Guide](#testing-guide)
7. [Demo Scenarios](#demo-scenarios)
8. [Troubleshooting](#troubleshooting)
9. [Project Structure](#project-structure)
10. [Documentation References](#documentation-references)

---

## Quick Start

### Minimal Setup (5 minutes)
```bash
# 1. Navigate to project
cd iot

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173
```

**Note**: Demo mode uses mock data (no backend required)

---

## Prerequisites

### Required Software
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v8+ (comes with Node.js)
- **MongoDB Atlas** account (free tier) — [mongodb.com/atlas](https://www.mongodb.com/atlas)

### Optional (for full integration)
- **Mosquitto** (MQTT Broker)
  - Windows: Download from [mosquitto.org](https://mosquitto.org/download/)
  - Linux: `sudo apt-get install mosquitto`
- **ESP32/ESP8266** (for hardware integration)

---

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Setup
Tạo file `backend/.env`:
```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/iot_system?retryWrites=true&w=majority&appName=iot-cluster

MQTT_BROKER_HOST=<broker-ip>
MQTT_BROKER_PORT=1883
MQTT_CLIENT_ID=iot-backend
MQTT_USERNAME=<mqtt-user>
MQTT_PASSWORD=<mqtt-password>

CORS_ORIGIN=http://localhost:5173
```

---

## Running the System

### Development Mode
```bash
npm run dev
# Opens http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

---

## System Features

### ✅ Dashboard (/)
- **Real-time Sensor Monitoring**: Temperature, Humidity, Light
- **Live Data Chart**: Auto-updating every 2 seconds
- **Device Control**: 3 devices with loading states
- **Connection Status**: Indicator shows connection health
- **Features**:
  - No page scrolling required
  - Loading state during control
  - State persists on page reload
  - Offline mode with cached data

### ✅ Data Sensor History (/history)
- **Sensor Data Table**: 20+ historical records
- **Search**: By time range and value
- **Pagination**: 10 records per page
- **Sorting**: Click headers to sort

### ✅ Device History (/activity)
- **Action Log**: All device control events
- **Search**: By device and time
- **Pagination**: 10 records per page
- **Status Tracking**: Success/failure indicators

### ✅ Profile (/profile)
- **Student Information**: Name, ID, class
- **Documentation Links**: API, architecture, database
- **Project Details**: Overview and features

---

## Key Features Implemented for Bài 4

### 1. Loading States ✅
- Spinner shown immediately when user clicks device toggle
- Button disabled during request
- "Đang cập nhật..." text indicator
- Reverts on failure

### 2. State Persistence ✅
- Device states cached in localStorage
- Restored on page reload
- Fresh data fetched in background
- No blank screen on reload

### 3. Connection Management ✅
- Real-time connection status monitoring
- Green/red indicator in header
- Disconnect banner with error message
- Auto-reconnect every 3 seconds

### 4. Error Handling ✅
- API request timeout handling
- Failed requests show error alert
- Graceful fallback to cached data
- Request queuing prevents race conditions

### 5. MQTT Integration Ready ✅
- Service layer for device control
- MQTT topic structure defined
- Publish/subscribe support ready
- Backend integration guides provided

---

## Testing Guide

### Test Device Control
```
1. Go to Dashboard
2. Click device toggle
3. Observe spinner appears
4. Wait for response (if network connected)
5. UI updates to new state
6. Reload page - state persists
```

### Test Offline Mode
```
1. Disconnect network or stop backend
2. Observe disconnect banner appears
3. Try device control - shows error
4. Reconnect - auto-reconnects
```

### Test Search & Pagination
```
1. Go to History page
2. Search by date range
3. Change pages
4. Verify correct records shown
```

---

## MQTT Testing (with Mosquitto)

### Start MQTT Broker
```bash
mosquitto -v
```

### Simulate Hardware Sensor
```bash
mosquitto_pub -h localhost -p 1883 \
  -t "iot/sensor/temperature/data" \
  -m '{"value":23.5,"unit":"°C"}'
```

### Control Devices
```bash
# Turn light ON
mosquitto_pub -h localhost -p 1883 \
  -t "iot/device/1/control" -m "ON"

# Hardware responses with status
mosquitto_pub -h localhost -p 1883 \
  -t "iot/device/1/status" \
  -m '{"status":true}'
```

### Monitor All Messages
```bash
mosquitto_sub -h localhost -p 1883 -t "iot/+/+"
```

---

## Troubleshooting

### Cannot load page
```bash
npm run dev  # Ensure dev server running
# Visit http://localhost:5173
```

### API connection failed
```env
# Check .env.local
REACT_APP_API_URL=http://localhost:3000/api
# Ensure backend running on port 3000
```

### MQTT not connecting
```bash
# Check broker running
mosquitto -v
# Ensure port 9001 available
# Check firewall settings
```

### Devices not responding
```bash
# Verify device control endpoint exists
# Check backend subscribes to iot/device/+/control
# Verify hardware firmware running
```

---

## Project Structure

```
src/
├── components/
│   ├── Header.tsx                 # Navigation + status
│   ├── DeviceControl.tsx          # Device toggles
│   ├── MetricCard.tsx             # Sensor cards
│   ├── SensorChart.tsx            # Data chart
│   └── ConnectionStatus.tsx       # Status indicators
├── pages/
│   ├── Dashboard.tsx              # Main page
│   ├── ActivityLog.tsx            # Device history
│   ├── EventHistory.tsx           # Sensor data
│   └── Profile.tsx                # Student info
├── context/
│   └── DeviceContext.tsx          # Global state
├── hooks/
│   └── useConnection.ts           # Custom hooks
└── services/
    ├── deviceService.ts           # API client
    ├── connectionStatusService.ts # Connection monitor
    └── types.ts                   # TypeScript types
```

---

## Documentation Files

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - REST API & MQTT reference
- **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** - Architecture & design
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database design (see docs below)

---

## Database (MongoDB Atlas)

Dự án sử dụng **MongoDB Atlas** (free tier). 3 collections:

### SensorData
```json
{
  "temperature": 27.9,
  "humidity": 55,
  "light": 117.22,
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

### DeviceAction
```json
{
  "device": "Đèn chính",
  "deviceId": "#1",
  "action": "BẬT",
  "status": "Thành công",
  "timestamp": "2026-05-04T02:00:00.000Z"
}
```

### Device
```json
{
  "deviceId": "1",
  "name": "Đèn chính",
  "type": "light",
  "status": false,
  "lastUpdated": "2026-05-04T02:00:00.000Z"
}
```

---

## Demo Checklist for Bài 4

### Required Demonstrations
- [ ] Dashboard shows no scrolling
- [ ] 3 sensors displayed with real values
- [ ] 3 devices with ON/OFF controls
- [ ] Real-time chart updating
- [ ] Loading spinner on device control
- [ ] State persists on page reload
- [ ] Offline disconnection handling
- [ ] Search & filtering works
- [ ] Pagination functions correctly
- [ ] Profile page displays student info

### Additional Tests
- [ ] MQTT publish/subscribe working
- [ ] Hardware receives control commands
- [ ] Sensor data updates every 2 seconds
- [ ] LED/Relay responds to commands
- [ ] Connection status indicator updates
- [ ] Error handling for failed requests

---

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Your VPS
```

### Docker
```bash
docker build -t iot-system .
docker run -p 5173:5173 iot-system
```

---

## Contact

**Student**: Nguyễn Văn A  
**ID**: B21DCCN001  
**Class**: D21CQCN01-B  
**Email**: [your-email@university.edu]

---

**Last Updated**: March 22, 2024  
**Version**: 1.0.0
