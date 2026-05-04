import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, BarChart2 } from 'lucide-react';
import { activityApi } from '../api/activityApi';
import { StatRecord } from '../types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']; // Blue, Emerald, Amber, Violet, Red

export function Statistics() {
  const [stats, setStats] = useState<StatRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await activityApi.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.error || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setError('An error occurred while loading statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="h-full flex flex-col p-4 gap-4 max-w-[1800px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 tracking-wide flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-600" />
          THỐNG KÊ HOẠT ĐỘNG
        </h1>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Làm mới
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-500 gap-2">
            <p className="text-red-500">{error}</p>
            <button onClick={loadData} className="text-blue-500 hover:underline text-sm">Thử lại</button>
          </div>
        ) : !stats || stats.dates.length === 0 ? (
          <div className="flex-1 flex justify-center items-center text-slate-500">
            <p className="text-lg">Chưa có dữ liệu thống kê. Hãy bật/tắt thiết bị để bắt đầu.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-slate-700 mb-6">Số lần bật/tắt theo ngày</h3>
            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.dates}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13 }}
                    dy={10}
                  />
                  <YAxis 
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 13 }}
                    label={{ value: 'Số lần', angle: -90, position: 'insideLeft', fill: '#64748b', dy: 40, dx: -10 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  {stats.devices.map((device, index) => (
                    <Bar 
                      key={device} 
                      dataKey={device} 
                      fill={COLORS[index % COLORS.length]} 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
