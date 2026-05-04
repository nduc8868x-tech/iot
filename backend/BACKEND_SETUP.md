# Backend Setup Guide for IoT System

This guide helps you set up the Node.js/Express backend server for the IoT system.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Endpoints](#api-endpoints)
6. [MQTT Integration](#mqtt-integration)
7. [Running the Server](#running-the-server)
8. [Testing](#testing)
9. [Deployment](#deployment)

---

## Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm 8+
- Mosquitto MQTT Broker
- MySQL/PostgreSQL (optional, for persistent storage)

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts                    # Main server file
│   ├── config/
│   │   ├── database.ts             # Database connection
│   │   ├── mqtt.ts                 # MQTT configuration
│   │   └── env.ts                  # Environment variables
│   ├── routes/
│   │   ├── devices.ts              # Device endpoints
│   │   ├── sensors.ts              # Sensor endpoints
│   │   └── mqtt.ts                 # MQTT publish endpoint
│   ├── middleware/
│   │   ├── errorHandler.ts         # Error handling
│   │   ├── validation.ts           # Input validation
│   │   └── cors.ts                 # CORS setup
│   ├── services/
│   │   ├── deviceService.ts        # Device business logic
│   │   ├── sensorService.ts        # Sensor data logic
│   │   └── mqttService.ts          # MQTT client logic
│   └── types/
│       └── index.ts                # TypeScript types
├── tests/
│   └── api.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Installation

### Step 1: Initialize Backend Project

```bash
mkdir backend
cd backend
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express cors dotenv mqtt axios
npm install --save-dev typescript ts-node @types/node @types/express nodemon
```

### Step 3: Initialize TypeScript

```bash
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## Configuration

### Step 1: Create .env File

```bash
cp .env.example .env
```

Contents of `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# MQTT
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_CLIENT_ID=iot-backend
MQTT_USERNAME=
MQTT_PASSWORD=

# Database (optional)
DATABASE_URL=mysql://root:password@localhost:3306/iot_system
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=iot_system
DATABASE_USER=root
DATABASE_PASSWORD=password

# CORS
CORS_ORIGIN=http://localhost:5173

# API Keys
API_KEY=your-secret-api-key
JWT_SECRET=your-jwt-secret
```

### Step 2: Create Environment Config File

**src/config/env.ts**:
```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mqtt: {
    host: process.env.MQTT_BROKER_HOST || 'localhost',
    port: parseInt(process.env.MQTT_BROKER_PORT || '1883'),
    clientId: process.env.MQTT_CLIENT_ID || 'iot-backend',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },
  
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    name: process.env.DATABASE_NAME || 'iot_system',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};
```

---

## API Endpoints

### Main Server File

**src/index.ts**:
```typescript
import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { initMQTT } from './config/mqtt';
import deviceRoutes from './routes/devices';
import mqttRoutes from './routes/mqtt';

const app: Express = express();

// Middleware
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/devices', deviceRoutes);
app.use('/api/mqtt', mqttRoutes);

// MQTT Connection
initMQTT();

// Start Server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`MQTT Broker: ${config.mqtt.host}:${config.mqtt.port}`);
});
```

### Device Routes

**src/routes/devices.ts**:
```typescript
import express, { Router, Request, Response } from 'express';
import { deviceService } from '../services/deviceService';

const router = Router();

// Get all devices
router.get('/', async (req: Request, res: Response) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.json({
      success: true,
      data: devices,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get devices',
      timestamp: new Date().toISOString(),
    });
  }
});

// Get device status
router.get('/:deviceId/status', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const status = await deviceService.getDeviceStatus(deviceId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Device not found',
        timestamp: new Date().toISOString(),
      });
    }
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get device status',
      timestamp: new Date().toISOString(),
    });
  }
});

// Control device
router.post('/:deviceId/control', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { action, timestamp } = req.body;
    
    // Validate action
    if (!['ON', 'OFF'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be ON or OFF',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Send control command
    const result = await deviceService.controlDevice(
      deviceId,
      action as 'ON' | 'OFF'
    );
    
    res.json({
      success: result.success,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to control device',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
```

### MQTT Routes

**src/routes/mqtt.ts**:
```typescript
import express, { Router, Request, Response } from 'express';
import { mqttService } from '../services/mqttService';

const router = Router();

// Publish MQTT message
router.post('/publish', async (req: Request, res: Response) => {
  try {
    const { topic, message, timestamp } = req.body;
    
    // Validate
    if (!topic || !message) {
      return res.status(400).json({
        success: false,
        error: 'topic and message are required',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Publish
    await mqttService.publish(topic, message);
    
    res.json({
      success: true,
      message: 'Message published successfully',
      topic,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to publish message',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
```

---

## MQTT Integration

### MQTT Config

**src/config/mqtt.ts**:
```typescript
import mqtt, { MqttClient } from 'mqtt';
import { config } from './env';

let client: MqttClient;

export function initMQTT() {
  const options = {
    host: config.mqtt.host,
    port: config.mqtt.port,
    clientId: config.mqtt.clientId,
    username: config.mqtt.username,
    password: config.mqtt.password,
    reconnectPeriod: 3000,
    keepalive: 60,
  };
  
  client = mqtt.connect(options);
  
  client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');
    
    // Subscribe to control topics
    client.subscribe('iot/device/+/control', (err) => {
      if (err) console.error('Subscribe error:', err);
      else console.log('📡 Subscribed to device control topics');
    });
  });
  
  client.on('message', (topic, message) => {
    console.log(`📨 Message: ${topic} = ${message.toString()}`);
    handleMQTTMessage(topic, message.toString());
  });
  
  client.on('error', (error) => {
    console.error('❌ MQTT error:', error);
  });
  
  return client;
}

function handleMQTTMessage(topic: string, message: string) {
  // Parse device ID from topic: iot/device/{id}/control
  const match = topic.match(/iot\/device\/(\d+)\/control/);
  if (match) {
    const deviceId = match[1];
    const action = message.toUpperCase();
    console.log(`🎯 Control device ${deviceId}: ${action}`);
    
    // TODO: Update device in database
    // TODO: Publish status response
    
    client.publish(
      `iot/device/${deviceId}/status`,
      JSON.stringify({
        deviceId,
        status: action === 'ON',
        timestamp: new Date().toISOString(),
      })
    );
  }
}

export function publishMQTT(topic: string, message: string) {
  return new Promise((resolve, reject) => {
    if (!client.connected) {
      reject(new Error('MQTT client not connected'));
      return;
    }
    
    client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) reject(err);
      else resolve(null);
    });
  });
}

export function getMQTTClient() {
  return client;
}
```

### MQTT Service

**src/services/mqttService.ts**:
```typescript
import { publishMQTT } from '../config/mqtt';

export const mqttService = {
  async publish(topic: string, message: string): Promise<void> {
    await publishMQTT(topic, message);
  },
  
  async sendDeviceCommand(
    deviceId: string,
    action: 'ON' | 'OFF'
  ): Promise<void> {
    const topic = `iot/device/${deviceId}/control`;
    await publishMQTT(topic, action);
  },
  
  async publishSensorData(
    sensorType: string,
    value: number,
    unit: string
  ): Promise<void> {
    const topic = `iot/sensor/${sensorType}/data`;
    const message = JSON.stringify({
      value,
      unit,
      timestamp: new Date().toISOString(),
    });
    await publishMQTT(topic, message);
  },
};
```

### Device Service

**src/services/deviceService.ts**:
```typescript
import { mqttService } from './mqttService';

interface Device {
  id: string;
  name: string;
  status: boolean;
  lastUpdated: string;
}

// Mock devices (replace with database queries)
const devices: Map<string, Device> = new Map([
  ['1', { id: '1', name: 'Đèn chính', status: false, lastUpdated: new Date().toISOString() }],
  ['2', { id: '2', name: 'Điều hòa', status: false, lastUpdated: new Date().toISOString() }],
  ['3', { id: '3', name: 'Quạt trần', status: false, lastUpdated: new Date().toISOString() }],
]);

export const deviceService = {
  async getAllDevices(): Promise<Device[]> {
    return Array.from(devices.values());
  },
  
  async getDeviceStatus(deviceId: string): Promise<Device | null> {
    return devices.get(deviceId) || null;
  },
  
  async controlDevice(
    deviceId: string,
    action: 'ON' | 'OFF'
  ): Promise<{ success: boolean; deviceId: string; newStatus: boolean; message: string }> {
    const device = devices.get(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }
    
    try {
      // Send MQTT command
      await mqttService.sendDeviceCommand(deviceId, action);
      
      // Update local state
      const newStatus = action === 'ON';
      device.status = newStatus;
      device.lastUpdated = new Date().toISOString();
      devices.set(deviceId, device);
      
      return {
        success: true,
        deviceId,
        newStatus,
        message: `Device turned ${action} successfully`,
      };
    } catch (error) {
      return {
        success: false,
        deviceId,
        newStatus: device.status,
        message: 'Failed to control device',
      };
    }
  },
};
```

---

## Running the Server

### Development Mode with Auto-Reload

**Update package.json scripts**:
```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "devw": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  }
}
```

### Run Server
```bash
# Development with auto-reload
npm run devw

# Production
npm run build
npm start
```

---

## Testing

### Test with cURL

```bash
# Check health
curl -X GET http://localhost:3000/api/health

# Get all devices
curl -X GET http://localhost:3000/api/devices

# Get device status
curl -X GET http://localhost:3000/api/devices/1/status

# Control device
curl -X POST http://localhost:3000/api/devices/1/control \
  -H "Content-Type: application/json" \
  -d '{"action":"ON","timestamp":"2024-03-22T10:30:00Z"}'

# Publish MQTT message
curl -X POST http://localhost:3000/api/mqtt/publish \
  -H "Content-Type: application/json" \
  -d '{"topic":"test/topic","message":"Hello MQTT"}'
```

### Test MQTT Communication

```bash
# Terminal 1: Subscribe to all messages
mosquitto_sub -h localhost -p 1883 -t "iot/+/+"

# Terminal 2: Publish sensor data
mosquitto_pub -h localhost -p 1883 \
  -t "iot/sensor/temperature/data" \
  -m '{"value":23.5,"unit":"°C"}'

# Terminal 3: Control device via API
curl -X POST http://localhost:3000/api/devices/1/control \
  -H "Content-Type: application/json" \
  -d '{"action":"ON"}'

# You should see in Terminal 1:
# iot/device/1/control ON
# iot/device/1/status {"deviceId":"1","status":true}
```

---

## Deployment

### Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      MQTT_BROKER_HOST: mosquitto
      DATABASE_HOST: db
    depends_on:
      - mosquitto
      - db

  mosquitto:
    image: eclipse-mosquitto:latest
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto.conf:/mosquitto/config/mosquitto.conf

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: iot_system
    ports:
      - "3306:3306"
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong API keys
- [ ] Enable MQTT authentication
- [ ] Set CORS properly
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Setup monitoring/logging
- [ ] Deploy with PM2 or systemd

---

**Version**: 1.0  
**Last Updated**: March 2024
