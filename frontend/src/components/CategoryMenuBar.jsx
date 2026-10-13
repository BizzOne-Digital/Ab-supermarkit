import { Link } from 'react-router-dom';
import {
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

// Loose keyword -> icon mapping so the category strip feels as lively/illustrated as a
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

// Horizontal category menu shown full-width directly below the hero banner, replacing the
// old fixed-height left sidebar (client asked for a template-style full-width banner with the
// category menu underneath instead of a side menu competing with it for space).
export default function CategoryMenuBar({ categories }) {
  if (categories.length === 0) return null;

  return (
    <nav className="bg-white border-b border-charcoal/10">
      <div className="container-app">
        <div className="flex items-center divide-x divide-charcoal/10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((c) => {
            const Icon = iconFor(c.name);
            return (
              <Link
                key={c._id}
                to={`/shop?category=${c._id}`}
                className="group shrink-0 flex items-center gap-2.5 px-4 py-3 text-sm text-charcoal/80 hover:bg-gold/10 hover:text-gold-dark transition-colors"
              >
                <span className="h-7 w-7 rounded-full bg-gold/15 flex items-center justify-center shrink-0 group-hover:bg-gold/25">
                  <Icon className="h-3.5 w-3.5 text-gold-dark" />
                </span>
                <span className="whitespace-nowrap">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
