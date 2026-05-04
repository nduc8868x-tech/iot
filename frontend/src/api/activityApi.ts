import { apiClient } from './client';
import type { ActivityRecord, ApiResponse, StatRecord } from '../types';

export interface ActivityData {
  records:    ActivityRecord[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export const activityApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<ApiResponse<ActivityData>>(`/activity?page=${page}&limit=${limit}`),
  getStats: () =>
    apiClient.get<ApiResponse<StatRecord>>('/activity/stats'),
};
