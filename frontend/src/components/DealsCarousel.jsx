import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';
import resolveImageUrl from '../utils/resolveImageUrl';

function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => Math.max(targetDate - Date.now(), 0));

  useEffect(() => {
    const timer = setInterval(() => setRemaining(Math.max(targetDate - Date.now(), 0)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return { days, hours, mins, secs };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center bg-black text-ivory rounded-md px-2.5 py-1.5 min-w-[46px]">
      <span className="font-heading text-sm leading-none">{String(value).padStart(2, '0')}</span>
      <span className="text-[9px] uppercase tracking-wide text-ivory/60">{label}</span>
    </div>
  );
}

export default function DealsCarousel({ deals }) {
  const { addItem } = useCart();
  const scrollerRef = useRef(null);

  const soonestEndDate = deals.reduce((min, d) => {
    const t = new Date(d.endDate).getTime();
    return t < min ? t : min;
  }, Infinity);
  const countdown = useCountdown(Number.isFinite(soonestEndDate) ? soonestEndDate : Date.now());

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (deals.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl text-black flex items-center gap-2">
            <Percent className="h-6 w-6 text-gold-dark" /> Weekly Deals
          </h2>
          <p className="text-sm text-charcoal/60">Fresh savings on your favorite products</p>
        </div>
        <div className="flex items-center gap-3">
          {Number.isFinite(soonestEndDate) && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-charcoal/50 mr-1">Deals end in:</span>
              <CountdownUnit value={countdown.days} label="Days" />
              <CountdownUnit value={countdown.hours} label="Hrs" />
              <CountdownUnit value={countdown.mins} label="Min" />
              <CountdownUnit value={countdown.secs} label="Sec" />
            </div>
          )}
          <Link to="/shop?sale=true" className="btn-gold text-sm py-2 px-4 whitespace-nowrap">
            View All Deals
          </Link>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
          className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white shadow-card hover:bg-gold hover:text-black transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white shadow-card hover:bg-gold hover:text-black transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {deals.map((d) => {
            const product = d.product;
            if (!product) return null;
            const image = resolveImageUrl(product.images?.[0]?.url);
            const pct = Math.round(((product.regularPrice - d.salePrice) / product.regularPrice) * 100);
            return (
              <div key={d._id} className="shrink-0 w-[160px] sm:w-[180px] bg-white rounded-lg shadow-card overflow-hidden">
                <Link to={`/shop/${product.slug}`} className="relative block aspect-square bg-creme overflow-hidden">
                  {image ? (
                    <img src={image} alt={product.name} className="h-full w-full object-contain" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-charcoal/30 text-sm">No image</div>
                  )}
                  {Number.isFinite(pct) && pct > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{pct}%
                    </span>
                  )}
                </Link>
                <div className="p-2.5">
                  <Link to={`/shop/${product.slug}`} className="text-sm text-black hover:text-gold-dark line-clamp-1">
                    {product.name}
                  </Link>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-heading text-sm text-gold-dark font-semibold">${Number(d.salePrice).toFixed(2)}</span>
                    <span className="text-xs text-charcoal/40 line-through">${Number(product.regularPrice).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => addItem({ ...product, salePrice: d.salePrice, isOnSale: true }, 1)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-1.5 rounded-md bg-black text-gold hover:bg-gold hover:text-black transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
