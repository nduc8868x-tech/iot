import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Device } from '../types';
import { deviceApi } from '../api/deviceApi';

interface DeviceContextType {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  refreshDevices: () => Promise<void>;
  updateDeviceStatus: (deviceId: string, status: boolean) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices,   setDevices]   = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const VALID_IDS = ['1', '2', '3'];

  const loadDevices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try localStorage cache first for instant render (filter stale extra devices)
      const cached = localStorage.getItem('devices');
      if (cached) {
        const parsed = JSON.parse(cached) as Device[];
        setDevices(parsed.filter((d) => VALID_IDS.includes(d.id)));
      }

      // Fetch from backend
      const res = await deviceApi.getAll();
      if (res.success && res.data) {
        const valid = res.data.filter((d) => VALID_IDS.includes(d.id));
        setDevices(valid);
        localStorage.setItem('devices', JSON.stringify(valid));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 10_000);
    return () => clearInterval(interval);
  }, []);

  const refreshDevices = async () => {
    await loadDevices();
  };

  const updateDeviceStatus = (deviceId: string, status: boolean) => {
    setDevices((prev) => {
      const updated = prev.map((d) =>
        d.id === deviceId ? { ...d, status, lastUpdated: new Date().toISOString() } : d
      );
      localStorage.setItem('devices', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <DeviceContext.Provider value={{ devices, isLoading, error, refreshDevices, updateDeviceStatus }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDeviceContext() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDeviceContext must be used within DeviceProvider');
  return ctx;
}
