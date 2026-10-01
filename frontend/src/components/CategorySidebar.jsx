import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function CategorySidebar({ categories, className = '' }) {
  return (
    <aside className={`hidden lg:flex flex-col bg-black rounded-r-2xl overflow-hidden border-y border-r border-gold/15 ${className}`}>
      <div className="px-5 py-4 border-b border-gold/15">
        <h3 className="font-heading text-gold text-lg">Shop by Category</h3>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {categories.length === 0 ? (
          <p className="px-5 py-4 text-sm text-ivory/40">No categories yet</p>
        ) : (
          categories.map((c) => (
            <Link
              key={c._id}
              to={`/shop?category=${c._id}`}
              className="group flex items-center justify-between px-5 py-2.5 text-sm text-ivory/75 hover:bg-gold/10 hover:text-gold transition-colors"
            >
              <span className="truncate">{c.name}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
            </Link>
          ))
        )}
      </nav>
    </aside>
  );
}
