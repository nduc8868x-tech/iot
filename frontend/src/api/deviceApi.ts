import { apiClient } from './client';
import type { Device, DeviceControlResponse, DeviceStatus, ApiResponse } from '../types';

/** All device-related HTTP calls. No logic — just fetch wrappers. */
export const deviceApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Device[]>>('/devices'),

  getStatus: (deviceId: string) =>
    apiClient.get<ApiResponse<DeviceStatus>>(`/devices/${deviceId}/status`),

  control: (deviceId: string, action: 'ON' | 'OFF') =>
    apiClient.post<ApiResponse<DeviceControlResponse>>(`/devices/${deviceId}/control`, {
      action,
      timestamp: new Date().toISOString(),
    }),
};
