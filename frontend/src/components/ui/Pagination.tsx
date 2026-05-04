import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Show at most 5 page buttons centred around the current page.
  const getPageNumbers = (): number[] => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>Trang {currentPage} / {totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-[#1e293b] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}>
            {page}
          </button>
        ))}

        <button
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
