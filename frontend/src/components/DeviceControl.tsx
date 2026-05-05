import { useState } from 'react';
import { Lightbulb, Fan, AirVent, HelpCircle, LucideIcon } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useDeviceContext } from '../context/DeviceContext';
import { useConnectionStatus } from '../hooks/useConnection';
import { deviceApi } from '../api/deviceApi';
import { Device } from '../types';

// Map device type → icon component (semantic, not id-based)
const DEVICE_ICON_MAP: Record<Device['type'], LucideIcon> = {
  light: Lightbulb,
  fan: Fan,
  ac: AirVent,
  other: HelpCircle,
};

interface DeviceProps {
  id: string;
  name: string;
  icon: LucideIcon;
  isOn: boolean;
  onControl: (deviceId: string, action: 'ON' | 'OFF') => Promise<void>;
  isLoading: boolean;
}

function DeviceItem({
  id,
  name,
  icon: Icon,
  isOn,
  onControl,
  isLoading
}: DeviceProps) {
  const [isControlling, setIsControlling] = useState(false);
  const { isConnected } = useConnectionStatus();

  const handleToggle = async () => {
    if (!isConnected) {
      alert('Not connected to server. Please check your connection.');
      return;
    }

    setIsControlling(true);
    try {
      await onControl(id, isOn ? 'OFF' : 'ON');
    } catch (error) {
      console.error('Failed to control device:', error);
      alert('Failed to control device. Please try again.');
    } finally {
      setIsControlling(false);
    }
  };

  const isDisabled = !isConnected || isControlling || isLoading;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`p-2.5 rounded-lg transition-colors ${
            isOn ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
          }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{name}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {isControlling ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Đang cập nhật...</span>
              </>
            ) : isOn ? (
              'Đang bật'
            ) : (
              'Đang tắt'
            )}
          </p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={isDisabled}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          isDisabled
            ? 'bg-slate-300 cursor-not-allowed opacity-50'
            : isOn
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-slate-300 hover:bg-slate-400'
        }`}>
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform flex items-center justify-center ${
            isOn ? 'left-7' : 'left-1'
          }`}>
          {isControlling && <LoadingSpinner size="sm" />}
        </div>
      </button>
    </div>
  );
}

export function DeviceControl() {
  const { devices, isLoading, updateDeviceStatus } = useDeviceContext();
  const { isConnected } = useConnectionStatus();

  const handleDeviceControl = async (deviceId: string, action: 'ON' | 'OFF') => {
    try {
      const response = await deviceApi.control(deviceId, action);
      if (!response.success) {
        throw new Error(response.data?.message ?? 'Failed to control device');
      }
      // Update UI immediately after successful API call
      updateDeviceStatus(deviceId, action === 'ON');
    } catch (error) {
      console.error('Device control error:', error);
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-800">
          Điều khiển thiết bị
        </h3>
        {!isConnected && (
          <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded">
            Offline
          </span>
        )}
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          devices.map(device => (
            <DeviceItem
              key={device.id}
              id={device.id}
              name={device.name}
              icon={DEVICE_ICON_MAP[device.type]}
              isOn={device.status}
              onControl={handleDeviceControl}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </div>
  );
}