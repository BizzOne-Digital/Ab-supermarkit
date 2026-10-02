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
      className={`hidden lg:flex flex-col bg-black overflow-hidden border-y border-gold/10 ${className}`}
    >
      <div className="px-5 py-4 border-b border-gold/15">
        <h3 className="font-heading text-gold text-lg">Shop by Category</h3>
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto py-2">
        {categories.length === 0 ? (
          <p className="px-5 py-4 text-sm text-ivory/40">No categories yet</p>
        ) : (
          categories.map((c) => {
            const Icon = iconFor(c.name);
            return (
              <Link
                key={c._id}
                to={`/shop?category=${c._id}`}
                className="group flex items-center gap-3 px-5 py-2.5 text-sm text-ivory/75 hover:bg-gold/10 hover:text-gold transition-colors"
              >
                <span className="h-7 w-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20">
                  <Icon className="h-3.5 w-3.5 text-gold" />
                </span>
                <span className="truncate flex-1">{c.name}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
              </Link>
            );
          })
        )}
      </nav>
    </aside>
  );
}
