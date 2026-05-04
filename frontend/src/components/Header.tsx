import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Activity,
  Clock,
  User,
  Search,
  Bell,
  Cpu,
  BarChart2 } from
'lucide-react';
import { ConnectionIndicator } from './ConnectionStatus';

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path ?
    'bg-blue-600 text-white' :
    'text-slate-400 hover:text-white hover:bg-slate-800';
  };
  return (
    <header className="bg-[#1e293b] text-white h-16 flex items-center justify-between px-8 sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-3 min-w-fit">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">IoT Admin</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-2 mx-8 overflow-x-auto">
        <Link
          to="/"
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')}`}>
          
          <LayoutGrid className="w-4 h-4" />
          Bảng điều khiển
        </Link>
        <Link
          to="/history"
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/history')}`}>
          
          <Activity className="w-4 h-4" />
          Lịch sử cảm biến
        </Link>
        <Link
          to="/activity"
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/activity')}`}>
          
          <Clock className="w-4 h-4" />
          Lịch sử hoạt động
        </Link>
        <Link
          to="/stats"
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/stats')}`}>
          
          <BarChart2 className="w-4 h-4" />
          Thống kê
        </Link>
        <Link
          to="/profile"
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/profile')}`}>
          
          <User className="w-4 h-4" />
          Hồ sơ cá nhân
        </Link>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-5 min-w-fit">
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-slate-200 placeholder:text-slate-500" />
          
        </div>

        {/* Connection Status Indicator */}
        <div className="hidden sm:block px-3 py-1 bg-slate-700 rounded-lg">
          <ConnectionIndicator />
        </div>

        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b]"></span>
        </button>

        <div className="flex items-center gap-3 pl-5 border-l border-slate-700">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold">Nguyễn Văn A</div>
            <div className="text-xs text-slate-400">ADMIN</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
            <User className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      </div>
    </header>);

}