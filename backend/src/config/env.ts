import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mqtt: {
    host: process.env.MQTT_BROKER_HOST || 'localhost',
    port: parseInt(process.env.MQTT_BROKER_PORT || '1883'),
    clientId: process.env.MQTT_CLIENT_ID || 'iot-backend',
    username: process.env.MQTT_USERNAME || undefined,
    password: process.env.MQTT_PASSWORD || undefined,
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  mongoUri: process.env.MONGODB_URI || '',
};
