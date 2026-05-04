import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Download, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Pagination } from '../components/ui/Pagination';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { sensorApi } from '../api/sensorApi';
import { HistoryRecord } from '../types';

type SensorType = 'all' | 'temperature' | 'humidity' | 'light';
type SearchMode  = 'time' | 'info';
type SortOrder   = 'desc' | 'asc';

interface FlatRow {
  id:        string;
  type:      'temperature' | 'humidity' | 'light';
  label:     string;
  value:     string;
  unit:      string;
  timestamp: string;
}

const SENSOR_COLOR: Record<FlatRow['type'], string> = {
  temperature: 'text-orange-500',
  humidity:    'text-blue-500',
  light:       'text-orange-400',
};

const VALUE_COLOR: Record<FlatRow['type'], string> = {
  temperature: 'text-orange-500',
  humidity:    'text-blue-500',
  light:       'text-orange-400',
};

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />;
  return order === 'asc'
    ? <ChevronUp   className="w-3.5 h-3.5 text-blue-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />;
}

function flattenRecords(records: HistoryRecord[]): FlatRow[] {
  const rows: FlatRow[] = [];
  records.forEach((r) => {
    rows.push({ id: `#${r.id * 3 - 2}`, type: 'temperature', label: 'Nhiệt độ', value: r.temperature.toFixed(1), unit: '°C',  timestamp: r.timestamp });
    rows.push({ id: `#${r.id * 3 - 1}`, type: 'humidity',    label: 'Độ ẩm',    value: r.humidity.toFixed(0),    unit: '%',   timestamp: r.timestamp });
    rows.push({ id: `#${r.id * 3}`,     type: 'light',       label: 'Ánh sáng', value: r.light.toFixed(2),       unit: 'lux', timestamp: r.timestamp });
  });
  return rows;
}

export function EventHistory() {
  const [records,      setRecords]      = useState<HistoryRecord[]>([]);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [isLoading,    setIsLoading]    = useState(false);
  const [sensorFilter, setSensorFilter] = useState<SensorType>('all');
  const [searchMode,   setSearchMode]   = useState<SearchMode>('time');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [sortField,    setSortField]    = useState<'type' | 'value' | 'time'>('time');
  const [sortOrder,    setSortOrder]    = useState<SortOrder>('desc');

  const loadData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await sensorApi.getHistory(page, 10);
      if (res.success && res.data) {
        setRecords(res.data.records);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to load sensor history:', err);
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
    let flat = flattenRecords(records);

    if (sensorFilter !== 'all') flat = flat.filter((r) => r.type === sensorFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (searchMode === 'time') {
        flat = flat.filter((r) => r.timestamp.toLowerCase().includes(q));
      } else {
        flat = flat.filter((r) =>
          r.id.toLowerCase().includes(q) ||
          r.label.toLowerCase().includes(q) ||
          r.value.toLowerCase().includes(q) ||
          r.unit.toLowerCase().includes(q)
        );
      }
    }

    flat = [...flat].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'type')  cmp = a.label.localeCompare(b.label);
      if (sortField === 'value') cmp = parseFloat(a.value) - parseFloat(b.value);
      if (sortField === 'time')  cmp = a.timestamp.localeCompare(b.timestamp);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return flat;
  }, [records, sensorFilter, searchMode, searchQuery, sortField, sortOrder]);

  return (
    <div className="h-full flex flex-col p-4 gap-3 max-w-[1800px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 tracking-wide">DATA SENSOR</h1>
        <div className="flex gap-2">
          <button
            onClick={() => loadData(currentPage)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs shadow-sm">
            <Download className="w-3.5 h-3.5" /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 flex-shrink-0">
        {/* Dropdown 1 — sensor type */}
        <select
          value={sensorFilter}
          onChange={(e) => { setSensorFilter(e.target.value as SensorType); setCurrentPage(1); }}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]">
          <option value="all">Tất cả cảm biến</option>
          <option value="temperature">Nhiệt độ</option>
          <option value="humidity">Độ ẩm</option>
          <option value="light">Ánh sáng</option>
        </select>

        {/* Dropdown 2 — search mode */}
        <select
          value={searchMode}
          onChange={(e) => { setSearchMode(e.target.value as SearchMode); setSearchQuery(''); }}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]">
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
                ? 'VD: 2026, 04/04/2026 01:01...'
                : 'Nhập ID, tên cảm biến, giá trị...'
            }
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-28">
                    Mã (ID)
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort('type')}>
                    <span className="flex items-center gap-1">
                      Cảm biến <SortIcon active={sortField === 'type'} order={sortOrder} />
                    </span>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort('value')}>
                    <span className="flex items-center gap-1">
                      Giá trị <SortIcon active={sortField === 'value'} order={sortOrder} />
                    </span>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => toggleSort('time')}>
                    <span className="flex items-center gap-1">
                      Thời gian <SortIcon active={sortField === 'time'} order={sortOrder} />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                  <tr key={row.id + row.type} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-slate-500 font-medium">{row.id}</td>
                    <td className="px-6 py-3">
                      <span className={`text-sm font-semibold ${SENSOR_COLOR[row.type]}`}>
                        {row.label}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-sm font-bold ${VALUE_COLOR[row.type]}`}>
                        {row.value}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">{row.unit}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">{row.timestamp}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
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
