import { apiClient } from './client';

export const connectionApi = {
  /** Ping the backend health endpoint. Used by connectionStatusService. */
  healthCheck: () =>
    apiClient.get<{ success: boolean; data: { status: string }; timestamp: string }>('/health'),
};
