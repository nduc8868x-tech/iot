import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  color: 'red' | 'blue' | 'orange';
}
export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color
}: MetricCardProps) {
  const colorStyles = {
    red: 'text-red-500 bg-red-50',
    blue: 'text-blue-500 bg-blue-50',
    orange: 'text-orange-500 bg-orange-50'
  };
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <h3 className="text-slate-500 text-xs font-medium mb-0.5">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          {unit && <span className="text-slate-500 text-sm font-medium">{unit}</span>}
        </div>
      </div>
      <div className={`p-2.5 rounded-xl ${colorStyles[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>);

}