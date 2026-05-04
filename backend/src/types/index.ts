export interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'ac' | 'other';
  status: boolean;
  lastUpdated: string;
}

export interface DeviceControlRequest {
  action: 'ON' | 'OFF';
  timestamp?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// ─── Sensor History ────────────────────────────────────────────────────────────

export interface SensorHistoryRecord {
  id: number;
  deviceId: string;
  temperature: number;
  humidity: number;
  light: number;
  timestamp: string;
}

// ─── Activity Log ──────────────────────────────────────────────────────────────

export interface ActivityRecord {
  id: number;
  device: string;
  deviceId: string;
  action: 'BẬT' | 'TẮT';
  status: 'Thành công' | 'Thất bại';
  timestamp: string;
}

// ─── Paginated Response ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  records: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Statistics ────────────────────────────────────────────────────────────────

export interface DailyStats {
  date: string;
  [key: string]: string | number;
}

export interface StatRecord {
  dates: DailyStats[];
  devices: string[];
}
