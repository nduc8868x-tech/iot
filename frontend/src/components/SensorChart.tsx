import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import { SensorData } from '../types';
interface SensorChartProps {
  data: SensorData[];
}
export function SensorChart({ data }: SensorChartProps) {
  return (
    <div className="h-full w-full">
    <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}>
            
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9" />
            
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#94a3b8',
                fontSize: 12
              }}
              dy={10} />
            
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#94a3b8',
                fontSize: 12
              }} />
            
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#94a3b8',
                fontSize: 12
              }} />
            
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} />
            
            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
              wrapperStyle={{
                fontSize: '13px',
                fontWeight: 500
              }} />
            
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              name="Nhiệt độ (°C)"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorTemp)"
              strokeWidth={2} />
            
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="light"
              name="Ánh sáng (Lux)"
              stroke="#f97316"
              fillOpacity={1}
              fill="url(#colorLight)"
              strokeWidth={2} />
            
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              name="Độ ẩm (%)"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorHum)"
              strokeWidth={2} />
            
          </AreaChart>
        </ResponsiveContainer>
    </div>
    );

}