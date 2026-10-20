import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  const [jumpValue, setJumpValue] = useState('');

  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const onJump = (e) => {
    e.preventDefault();
    const n = Number(jumpValue);
    if (Number.isFinite(n) && n >= 1 && n <= totalPages) {
      onPageChange(n);
      setJumpValue('');
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-10 w-10 flex items-center justify-center rounded-md border border-charcoal/20 disabled:opacity-40 hover:border-gold hover:text-gold transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, idx) => (
          <span key={p} className="flex items-center">
            {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-charcoal/40">...</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`h-10 w-10 rounded-md font-medium transition-colors ${
                p === page ? 'bg-gold text-black' : 'border border-charcoal/20 hover:border-gold hover:text-gold'
              }`}
            >
              {p}
            </button>
          </span>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="h-10 w-10 flex items-center justify-center rounded-md border border-charcoal/20 disabled:opacity-40 hover:border-gold hover:text-gold transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      <form onSubmit={onJump} className="flex items-center gap-2 text-sm text-charcoal/60">
        <span>Page {page} of {totalPages} — jump to</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          placeholder="#"
          className="w-16 border border-charcoal/20 rounded-md py-1.5 px-2 text-center focus:outline-none focus:border-gold"
        />
        <button type="submit" className="btn-outline text-xs py-1.5 px-3">Go</button>
      </form>
    </div>
  );
}
