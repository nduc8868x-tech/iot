import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // router DNS không resolve SRV records của Atlas

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { initMQTT } from './config/mqtt.js';
import deviceRoutes from './routes/devices.js';
import mqttRoutes from './routes/mqtt.js';
import sensorRoutes, { initSensorRoutes } from './routes/sensors.js';
import activityRoutes from './routes/activity.js';
import { requestLogger } from './middleware/requestLogger.js';
import { ApiResponse } from './types/index.js';
import { connectDB } from './config/database.js';

const app: Express = express();

// ─── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, data: { status: 'ok' }, timestamp: new Date().toISOString() });
});

app.use('/api/devices',  deviceRoutes);
app.use('/api/sensors',  sensorRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/mqtt',     mqttRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  const response: ApiResponse<null> = {
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  } satisfies ApiResponse<null>);
});

// ─── Startup ──────────────────────────────────────────────────────────────────
async function startServer() {
  await connectDB();

  // MQTT is optional — server starts even without a broker.
  const mqttClient = await initMQTT();
  initSensorRoutes(mqttClient);

  app.listen(config.port, () => {
    console.log(`\nBackend running on http://localhost:${config.port}`);
    console.log(`API: http://localhost:${config.port}/api`);
    console.log(`CORS: ${config.cors.origin}`);
    console.log(`MQTT: ${config.mqtt.host}:${config.mqtt.port}\n`);
  });
}

startServer().catch((err) => {
  console.error('Startup error:', err);
  process.exit(1);
});
