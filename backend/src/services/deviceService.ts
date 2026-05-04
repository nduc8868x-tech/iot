import { Device, DeviceControlResponse } from '../types/index.js';
import { publishMQTT, getDeviceState, setDeviceState } from '../config/mqtt.js';

// Mock devices database
const devices: Map<string, Device> = new Map([
  [
    '1',
    {
      id: '1',
      name: 'Đèn chính',
      type: 'light',
      status: false,
      lastUpdated: new Date().toISOString(),
    },
  ],
  [
    '2',
    {
      id: '2',
      name: 'Điều hòa',
      type: 'ac',
      status: false,
      lastUpdated: new Date().toISOString(),
    },
  ],
  [
    '3',
    {
      id: '3',
      name: 'Quạt trần',
      type: 'fan',
      status: true,
      lastUpdated: new Date().toISOString(),
    },
  ],
]);

export class DeviceService {
  static getAllDevices(): Device[] {
    return Array.from(devices.values());
  }

  static getDeviceById(deviceId: string): Device | null {
    return devices.get(deviceId) || null;
  }

  static async controlDevice(
    deviceId: string,
    action: 'ON' | 'OFF'
  ): Promise<DeviceControlResponse> {
    const device = devices.get(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    const newStatus = action === 'ON';

    // Always update in-memory state immediately so GET /devices reflects the change.
    device.status = newStatus;
    device.lastUpdated = new Date().toISOString();
    setDeviceState(deviceId, newStatus);

    try {
      // Best-effort MQTT publish — hardware may not be connected in dev mode.
      await publishMQTT(`iot/device/${deviceId}/control`, action);
      return { success: true, deviceId, newStatus, message: `Device turned ${action} successfully` };
    } catch {
      // MQTT unavailable (e.g. no broker running) — degrade gracefully.
      console.warn(`[DeviceService] MQTT unavailable — state updated in-memory only`);
      return { success: true, deviceId, newStatus, message: `Device turned ${action} (MQTT offline)` };
    }
  }

  static updateDeviceStatus(deviceId: string, status: boolean): void {
    const device = devices.get(deviceId);
    if (device) {
      device.status = status;
      device.lastUpdated = new Date().toISOString();
      setDeviceState(deviceId, status);
    }
  }
}
