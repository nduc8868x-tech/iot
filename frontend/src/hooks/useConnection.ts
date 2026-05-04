import { useEffect, useState, useCallback } from 'react';
import { connectionStatusService } from '../services/connectionStatusService';
import { deviceApi } from '../api/deviceApi';
import { ConnectionStatus } from '../types';

// ─── Connection status ─────────────────────────────────────────────────────────

interface UseConnectionStatusReturn {
  isConnected: boolean;
  error: string | null;
  lastConnected: string;
}

export function useConnectionStatus(): UseConnectionStatusReturn {
  const [status, setStatus] = useState<ConnectionStatus>(
    connectionStatusService.getStatus()
  );

  useEffect(() => {
    return connectionStatusService.subscribe(setStatus);
  }, []);

  return {
    isConnected:   status.isConnected,
    error:         status.error,
    lastConnected: status.lastConnected,
  };
}

// ─── Device control ────────────────────────────────────────────────────────────

interface UseDeviceControlReturn {
  isLoading: boolean;
  error: string | null;
  controlDevice: (deviceId: string, action: 'ON' | 'OFF') => Promise<boolean>;
}

export function useDeviceControl(): UseDeviceControlReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const controlDevice = useCallback(async (deviceId: string, action: 'ON' | 'OFF'): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deviceApi.control(deviceId, action);
      if (response.success && response.data) return response.data.newStatus;
      setError(response.data?.message ?? 'Failed to control device');
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Device control failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, controlDevice };
}
