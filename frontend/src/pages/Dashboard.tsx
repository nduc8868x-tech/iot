import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, Activity } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { SensorChart } from '../components/SensorChart';
import { DeviceControl } from '../components/DeviceControl';
import { SensorData } from '../types';
import { sensorApi } from '../api/sensorApi';

type FilterType = 'all' | 'temperature' | 'humidity' | 'light';

export function Dashboard() {
  const [sensorData,   setSensorData]   = useState<SensorData[]>([]);
  const [filteredData, setFilteredData] = useState<SensorData[]>([]);
  const [filter,       setFilter]       = useState<FilterType>('all');
  const [latestData,   setLatestData]   = useState({ temperature: 0, humidity: 0, light: 0 });

  const fetchSensorData = async () => {
    try {
      const res = await sensorApi.getLatest();
      if (!res.success || !res.data) return;

      const { temperature, humidity, light } = res.data;
      setLatestData({
        temperature: temperature.value,
        humidity:    humidity.value,
        light:       light.value,
      });

      const now = new Date();
      const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      setSensorData((prev) => {
        const next = [...prev, { time: timeLabel, temperature: temperature.value, humidity: humidity.value, light: light.value }];
        return next.slice(-30);
      });
    } catch (err) {
      console.error('Failed to fetch sensor data:', err);
    }
  };

  useEffect(() => {
    setFilteredData(
      filter === 'all'         ? sensorData :
      filter === 'temperature' ? sensorData.map((d) => ({ ...d, humidity: 0, light: 0 })) :
      filter === 'humidity'    ? sensorData.map((d) => ({ ...d, temperature: 0, light: 0 })) :
                                 sensorData.map((d) => ({ ...d, temperature: 0, humidity: 0 }))
    );
  }, [sensorData, filter]);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col p-4 gap-3 max-w-[1800px] mx-auto w-full">
      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 flex-shrink-0">
        <MetricCard title="Nhiệt độ" value={latestData.temperature.toFixed(2)} unit="°C"  icon={Thermometer} color="red" />
        <MetricCard title="Độ ẩm"   value={latestData.humidity.toFixed(2)}    unit="%"   icon={Droplets}    color="blue" />
        <MetricCard title="Ánh sáng" value={latestData.light.toFixed(0)}       unit="Lux" icon={Sun}         color="orange" />
      </div>

      {/* Chart + Device Control */}
      <div className="flex-1 min-h-0 grid grid-cols-4 gap-3">
        <div className="col-span-3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 p-4 min-h-0">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-lg">
                <Activity className="w-4 h-4 text-slate-600" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Biểu đồ thời gian thực</h3>
            </div>

            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              {(['all', 'temperature', 'humidity', 'light'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    filter === f
                      ? f === 'all'         ? 'bg-white text-slate-800 font-semibold shadow-sm'
                      : f === 'temperature' ? 'bg-white text-red-600 shadow-sm'
                      : f === 'humidity'    ? 'bg-white text-blue-600 shadow-sm'
                      :                       'bg-white text-orange-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  {f === 'all' ? 'TẤT CẢ' : f === 'temperature' ? 'NHIỆT ĐỘ' : f === 'humidity' ? 'ĐỘ ẨM' : 'ÁNH SÁNG'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <SensorChart data={filteredData} />
          </div>
        </div>
        <div className="col-span-1 min-h-0">
          <DeviceControl />
        </div>
      </div>
    </div>
  );
}
