import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, FileText, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Pagination } from '../components/ui/Pagination';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { activityApi } from '../api/activityApi';
import { ActivityRecord } from '../types';

type DeviceFilter = 'all' | 'Đèn chính' | 'Điều hòa' | 'Quạt trần';
type SearchMode   = 'time' | 'info';
type SortOrder    = 'desc' | 'asc';

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />;
  return order === 'asc'
    ? <ChevronUp   className="w-3.5 h-3.5 text-emerald-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />;
}

export function ActivityLog() {
  const [data,        setData]        = useState<ActivityRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [isLoading,   setIsLoading]   = useState(false);
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('all');
  const [searchMode,   setSearchMode]   = useState<SearchMode>('time');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [sortField,   setSortField]   = useState<'device' | 'action' | 'status' | 'time'>('time');
  const [sortOrder,   setSortOrder]   = useState<SortOrder>('desc');

  const loadData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await activityApi.getAll(page, 10);
      if (res.success && res.data) {
        setData(res.data.records);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load activity log:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(currentPage); }, [currentPage]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortOrder('desc'); }
  };

  const rows = useMemo(() => {
    let flat = [...data];

    if (deviceFilter !== 'all') flat = flat.filter((r) => r.device === deviceFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (searchMode === 'time') {
        flat = flat.filter((r) => r.timestamp.toLowerCase().includes(q));
      } else {
        flat = flat.filter((r) =>
          String(r.id).includes(q) ||
          r.device.toLowerCase().includes(q) ||
          r.deviceId.toLowerCase().includes(q) ||
          r.action.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
        );
      }
    }

    flat = [...flat].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'device') cmp = a.device.localeCompare(b.device);
      if (sortField === 'action') cmp = a.action.localeCompare(b.action);
      if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      if (sortField === 'time')   cmp = a.timestamp.localeCompare(b.timestamp);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return flat;
  }, [data, deviceFilter, searchMode, searchQuery, sortField, sortOrder]);

  return (
    <div className="h-full flex flex-col p-4 gap-3 max-w-[1800px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 tracking-wide">ACTION HISTORY</h1>
        <div className="flex gap-2">
          <button
            onClick={() => loadData(currentPage)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-xs shadow-sm">
            <FileText className="w-3.5 h-3.5" /> Tải báo cáo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 flex-shrink-0">
        {/* Dropdown 1 — device filter */}
        <select
          value={deviceFilter}
          onChange={(e) => { setDeviceFilter(e.target.value as DeviceFilter); setCurrentPage(1); }}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[160px]">
          <option value="all">Tất cả thiết bị</option>
          <option value="Đèn chính">Đèn chính</option>
          <option value="Điều hòa">Điều hòa</option>
          <option value="Quạt trần">Quạt trần</option>

        </select>

        {/* Dropdown 2 — search mode */}
        <select
          value={searchMode}
          onChange={(e) => { setSearchMode(e.target.value as SearchMode); setSearchQuery(''); }}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[160px]">
          <option value="time">Theo Thời gian</option>
          <option value="info">Theo Thông tin</option>
        </select>

        {/* Dynamic search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchMode === 'time'
                ? 'VD: 2026, 13/04/2026 14:08...'
                : 'Nhập ID, tên thiết bị, lệnh BẬT/TẮT, trạng thái...'
            }
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-16">STT</th>
                  <th
                    className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort('device')}>
                    <span className="flex items-center gap-1">Thiết bị <SortIcon active={sortField === 'device'} order={sortOrder} /></span>
                  </th>
                  <th
                    className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort('action')}>
                    <span className="flex items-center gap-1">Hành động <SortIcon active={sortField === 'action'} order={sortOrder} /></span>
                  </th>
                  <th
                    className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort('status')}>
                    <span className="flex items-center gap-1">Trạng thái <SortIcon active={sortField === 'status'} order={sortOrder} /></span>
                  </th>
                  <th
                    className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort('time')}>
                    <span className="flex items-center gap-1">Thời gian thực hiện <SortIcon active={sortField === 'time'} order={sortOrder} /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-400 font-medium">{row.id}</td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-800 text-sm">{row.device}</div>
                      <div className="text-xs text-slate-500">ID: {row.deviceId}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-4 py-1 rounded-md text-xs font-bold ${
                        row.action === 'BẬT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {row.action}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {row.status === 'Thành công' ? (
                          <>
                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700">Thành công</span>
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-2.5 h-2.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <span className="text-xs font-semibold text-red-700">Thất bại</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 font-medium">{row.timestamp}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
