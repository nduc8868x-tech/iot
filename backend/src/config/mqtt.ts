import mqtt, { MqttClient } from 'mqtt';
import { config } from './env.js';

let client: MqttClient;

export function initMQTT(): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    const options = {
      host: config.mqtt.host,
      port: config.mqtt.port,
      clientId: config.mqtt.clientId,
      username: config.mqtt.username,
      password: config.mqtt.password,
      reconnectPeriod: 3000,
      keepalive: 60,
    };
    
    console.log(`\n🌐 MQTT Connection Details:`);
    console.log(`   Host: ${config.mqtt.host}`);
    console.log(`   Port: ${config.mqtt.port}`);
    console.log(`   Client ID: ${config.mqtt.clientId}`);
    console.log(`   Username: ${config.mqtt.username}`);
    console.log(`   Attempting connection...\n`);
    
    try {
      client = mqtt.connect(options);
      
      let timeoutId: NodeJS.Timeout;
      
      client.on('connect', () => {
        clearTimeout(timeoutId);
        console.log('✅ Connected to MQTT broker successfully!');
        
        // Subscribe to device control topics
        client.subscribe('iot/device/+/control', (err: any) => {
          if (err) {
            console.error('❌ Subscribe error:', err);
            resolve(client);
          } else {
            console.log('📡 Subscribed to device control topics');
            resolve(client);
          }
        });
      });
      
      client.on('message', (topic: any, message: any) => {
        console.log(`📨 MQTT Message - Topic: ${topic}, Message: ${message.toString()}`);
        handleMQTTMessage(topic, message.toString());
      });
      
      client.on('error', (error: any) => {
        console.error('❌ MQTT Connection Error:', error.message || error);
      });
      
      client.on('offline', () => {
        console.log('⚠️ MQTT Broker offline - will attempt to reconnect');
      });
      
      timeoutId = setTimeout(() => {
        console.error('\n❌ MQTT Connection Timeout');
        console.log(`   Could not reach broker at ${config.mqtt.host}:${config.mqtt.port}`);
        console.log('⚠️ Backend starting WITHOUT MQTT (using mock data)\n');
        resolve(client);
      }, 12000);
    } catch (error: any) {
      console.error('❌ MQTT Setup Error:', error.message);
      resolve(client);
    }
  });
}

// Store for device states
const deviceStates = new Map<string, boolean>();

function handleMQTTMessage(topic: string, message: string) {
  // Parse device ID from topic: iot/device/{id}/control
  const match = topic.match(/iot\/device\/(\d+)\/control/);
  if (match) {
    const deviceId = match[1];
    const action = message.toUpperCase();
    console.log(`🎯 Device ${deviceId}: ${action}`);
    
    // Update device state
    deviceStates.set(deviceId, action === 'ON');
    
    // Publish status response
    client.publish(
      `iot/device/${deviceId}/status`,
      JSON.stringify({
        deviceId,
        status: action === 'ON',
        timestamp: new Date().toISOString(),
      }),
      { qos: 1 }
    );
  }
}

export function publishMQTT(topic: string, message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!client || !client.connected) {
      reject(new Error('MQTT client not connected'));
      return;
    }
    
    client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function getMQTTClient() {
  return client;
}

export function getDeviceState(deviceId: string): boolean {
  return deviceStates.get(deviceId) ?? false;
}

export function setDeviceState(deviceId: string, state: boolean) {
  deviceStates.set(deviceId, state);
}
