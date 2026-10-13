import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Apple,
  Milk,
  Candy,
  Soup,
  Cookie,
  Sparkles,
  Flower2,
  Pill,
  Globe,
  ShoppingBasket,
} from 'lucide-react';

// Loose keyword -> icon mapping so the sidebar feels as lively/illustrated as a
// typical grocery template, without needing per-category icon uploads from the client.
const ICON_RULES = [
  [/fruit|produce|veg/i, Apple],
  [/dairy|milk/i, Milk],
  [/cand|sweet|choc/i, Candy],
  [/snack|chip|munch/i, Cookie],
  [/spice|pulse|grocery|essential/i, Soup],
  [/beauty|care|hair/i, Sparkles],
  [/home|household/i, Flower2],
  [/herbal|medicine|health/i, Pill],
  [/international|indian|asian/i, Globe],
];

const iconFor = (name) => ICON_RULES.find(([re]) => re.test(name))?.[1] || ShoppingBasket;

export default function CategorySidebar({ categories, className = '', style }) {
  return (
    <aside
      style={style}
      className={`hidden lg:flex flex-col bg-creme overflow-hidden border-y border-charcoal/10 shadow-card ${className}`}
    >
      <div className="px-4 py-3 border-b border-charcoal/10">
        <h3 className="font-heading text-black text-base">Shop by Category</h3>
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto py-1 divide-y divide-charcoal/10">
        {categories.length === 0 ? (
          <p className="px-4 py-3 text-sm text-charcoal/40">No categories yet</p>
        ) : (
          categories.map((c) => {
            const Icon = iconFor(c.name);
            return (
              <Link
                key={c._id}
                to={`/shop?category=${c._id}`}
                className="group flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal/80 hover:bg-gold/10 hover:text-gold-dark transition-colors"
              >
                <span className="h-6 w-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/25">
                  <Icon className="h-3 w-3 text-gold-dark" />
                </span>
                <span className="truncate flex-1">{c.name}</span>
                <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 text-gold-dark" />
              </Link>
            );
          })
        )}
      </nav>
    </aside>
  );
}
