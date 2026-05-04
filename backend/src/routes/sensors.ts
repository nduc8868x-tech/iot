import { Router, Request, Response } from 'express';
import { getMQTTClient } from '../config/mqtt.js';
import { ApiResponse } from '../types/index.js';
import { getSensorHistory, saveSensorReading } from '../services/sensorService.js';

const router = Router();

/**
 * GET /api/sensors/latest
 * Get latest sensor readings from ESP32
 */
const sensorReadings = {
  temperature: { value: 0, unit: '°C', timestamp: new Date().toISOString() },
  humidity: { value: 0, unit: '%', timestamp: new Date().toISOString() },
  light: { value: 0, unit: 'Lux', timestamp: new Date().toISOString() },
};

// Subscribe to sensor topics when router is initialized
export function initSensorRoutes(mqttClient: any) {
  // Subscribe to sensor data topics
  mqttClient.subscribe('iot/sensor/temperature/data', (err: any) => {
    if (err) console.error('Failed to subscribe to temperature data');
    else console.log('📡 Subscribed to iot/sensor/temperature/data');
  });

  mqttClient.subscribe('iot/sensor/humidity/data', (err: any) => {
    if (err) console.error('Failed to subscribe to humidity data');
    else console.log('📡 Subscribed to iot/sensor/humidity/data');
  });

  mqttClient.subscribe('iot/sensor/light/data', (err: any) => {
    if (err) console.error('Failed to subscribe to light data');
    else console.log('📡 Subscribed to iot/sensor/light/data');
  });

  mqttClient.subscribe('iot/sensor/all', (err: any) => {
    if (err) console.error('Failed to subscribe to all sensor data');
    else console.log('📡 Subscribed to iot/sensor/all');
  });

  // Handle incoming sensor messages
  mqttClient.on('message', (topic: string, message: Buffer) => {
    // Skip non-sensor topics
    if (!topic.startsWith('iot/sensor/')) {
      return;
    }
    
    try {
      const data = JSON.parse(message.toString());

      if (topic === 'iot/sensor/temperature/data') {
        sensorReadings.temperature = {
          value: data.value || 0,
          unit: data.unit || '°C',
          timestamp: new Date().toISOString(),
        };
        console.log(`🌡️ Temperature: ${data.value}${data.unit}`);
      } else if (topic === 'iot/sensor/humidity/data') {
        sensorReadings.humidity = {
          value: data.value || 0,
          unit: data.unit || '%',
          timestamp: new Date().toISOString(),
        };
        console.log(`💧 Humidity: ${data.value}${data.unit}`);
      } else if (topic === 'iot/sensor/light/data') {
        sensorReadings.light = {
          value: data.value || 0,
          unit: data.unit || 'Lux',
          timestamp: new Date().toISOString(),
        };
        console.log(`💡 Light: ${data.value}${data.unit}`);
      } else if (topic === 'iot/sensor/all') {
        if (data.temperature !== undefined) {
          sensorReadings.temperature.value = data.temperature;
          sensorReadings.temperature.timestamp = new Date().toISOString();
        }
        if (data.humidity !== undefined) {
          sensorReadings.humidity.value = data.humidity;
          sensorReadings.humidity.timestamp = new Date().toISOString();
        }
        if (data.light !== undefined) {
          sensorReadings.light.value = data.light;
          sensorReadings.light.timestamp = new Date().toISOString();
        }
        // Lưu snapshot vào MongoDB
        saveSensorReading(
          sensorReadings.temperature.value,
          sensorReadings.humidity.value,
          sensorReadings.light.value
        ).catch((err) => console.error('Failed to save sensor reading:', err));
        console.log(`📊 All Sensors: Temp=${data.temperature}°C, Humidity=${data.humidity}%, Light=${data.light}Lux`);
      }
    } catch (error) {
      // Silently ignore JSON parse errors for non-JSON messages
      // This prevents error spam from device control messages
    }
  });
}

router.get('/latest', (req: Request, res: Response) => {
  try {
    const response: ApiResponse<typeof sensorReadings> = {
      success: true,
      data: sensorReadings,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to get sensor readings',
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
});

/**
 * GET /api/sensors/temperature
 */
router.get('/temperature', (req: Request, res: Response) => {
  const response: ApiResponse<typeof sensorReadings.temperature> = {
    success: true,
    data: sensorReadings.temperature,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

/**
 * GET /api/sensors/humidity
 */
router.get('/humidity', (req: Request, res: Response) => {
  const response: ApiResponse<typeof sensorReadings.humidity> = {
    success: true,
    data: sensorReadings.humidity,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

/**
 * GET /api/sensors/light
 */
router.get('/light', (req: Request, res: Response) => {
  const response: ApiResponse<typeof sensorReadings.light> = {
    success: true,
    data: sensorReadings.light,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

/**
 * GET /api/sensors/history?page=1&limit=10
 * Paginated historical sensor readings.
 * Frontend (EventHistory page) consumes this instead of generating mock data locally.
 */
router.get('/history', async (req: Request, res: Response) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const data  = await getSensorHistory(page, limit);
    res.json({ success: true, data, timestamp: new Date().toISOString() } satisfies ApiResponse<typeof data>);
  } catch {
    res.status(500).json({ success: false, error: 'Failed to get history', timestamp: new Date().toISOString() });
  }
});

export default router;
