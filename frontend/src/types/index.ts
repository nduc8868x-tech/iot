// ─── Device ───────────────────────────────────────────────────────────────────

export interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'other';
  status: boolean;
  lastUpdated: string;
}

export interface DeviceControlResponse {
  success: boolean;
  deviceId: string;
  newStatus: boolean;
  message: string;
}

export interface DeviceStatus {
  id: string;
  status: boolean;
  timestamp: string;
}

// ─── Sensor ───────────────────────────────────────────────────────────────────

export interface SensorData {
  time: string;
  temperature: number;
  humidity: number;
  light: number;
}

export interface HistoryRecord {
  id: number;
  deviceId: string;
  temperature: number;
  humidity: number;
  light: number;
  timestamp: string;
}

export interface ActivityRecord {
  id: number;
  device: string;
  deviceId: string;
  action: 'BẬT' | 'TẮT';
  status: 'Thành công' | 'Thất bại';
  timestamp: string;
}

// ─── Connection ───────────────────────────────────────────────────────────────

export interface ConnectionStatus {
  isConnected: boolean;
  lastConnected: string;
  error: string | null;
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export interface DailyStats {
  date: string;
  [key: string]: string | number;
}

export interface StatRecord {
  dates: DailyStats[];
  devices: string[];
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
