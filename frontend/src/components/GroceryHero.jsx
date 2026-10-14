import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Truck,
  Percent,
  BadgeCheck,
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

// Same loose keyword -> icon mapping used by CategorySidebar, so the category icon row below
// the hero search bar stays visually consistent with the sidebar further down the page.
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

const TRUST_BADGES = [
  { icon: Truck, title: 'Fresh Products', desc: 'Delivered to your door' },
  { icon: Percent, title: 'Great Prices', desc: 'Weekly deals & offers' },
  { icon: BadgeCheck, title: 'Quality You Can Trust', desc: 'Carefully selected products' },
];

export default function GroceryHero({ categories }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-groceries-reference-v1.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-transparent" />

      <div className="relative z-10 container-app py-10 sm:py-14">
        <div className="max-w-xl">
          <p className="flex items-center gap-2 text-gold-dark text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="h-px w-6 bg-gold-dark inline-block" /> Shop by Category
          </p>
          <h1 className="font-heading leading-tight">
            <span className="block text-3xl sm:text-5xl font-bold text-black">Your Everyday</span>
            <span className="block text-3xl sm:text-5xl font-bold text-gold-dark">Grocery Essentials</span>
          </h1>
          <p className="mt-4 text-charcoal/70 text-base sm:text-lg">
            Fresh groceries, household essentials, personal care and more — all in one place.
          </p>

          <form onSubmit={onSearch} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products or categories..."
                className="w-full rounded-md py-3 pl-11 pr-4 text-sm bg-white border border-charcoal/10 shadow-card focus:outline-none focus:border-gold"
              />
            </div>
            <button type="submit" className="btn-gold px-6">
              Search
            </button>
          </form>

          {categories.length > 0 && (
            <div className="mt-8 flex items-start gap-5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.slice(0, 8).map((c) => {
                const Icon = iconFor(c.name);
                return (
                  <Link
                    key={c._id}
                    to={`/shop?category=${c._id}`}
                    className="group flex flex-col items-center gap-2 shrink-0 w-20 text-center"
                  >
                    <span className="h-14 w-14 rounded-full bg-white border border-gold/20 shadow-card flex items-center justify-center group-hover:border-gold transition-colors">
                      <Icon className="h-6 w-6 text-gold-dark" />
                    </span>
                    <span className="text-xs text-charcoal/80 group-hover:text-gold-dark font-medium leading-tight">{c.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-charcoal/10 pt-6">
            {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-gold-dark" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-black leading-tight">{title}</p>
                  <p className="text-xs text-charcoal/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
