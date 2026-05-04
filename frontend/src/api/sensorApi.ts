import { apiClient } from './client';
import type { HistoryRecord, ApiResponse } from '../types';

export interface SensorLatestData {
  temperature: { value: number; unit: string };
  humidity:    { value: number; unit: string };
  light:       { value: number; unit: string };
}

export interface SensorHistoryData {
  records:    HistoryRecord[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export const sensorApi = {
  getLatest: () =>
    apiClient.get<ApiResponse<SensorLatestData>>('/sensors/latest'),

  getHistory: (page = 1, limit = 10) =>
    apiClient.get<ApiResponse<SensorHistoryData>>(`/sensors/history?page=${page}&limit=${limit}`),
};
