import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
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
  );
}
