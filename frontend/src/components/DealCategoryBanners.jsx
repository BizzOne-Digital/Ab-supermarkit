import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import resolveImageUrl from '../utils/resolveImageUrl';

// Renders whatever's set up in Admin > Slides (image, heading, subheading, button label/link) —
// fully editable there instead of being hardcoded, same admin screen used for the old hero
// carousel (now unused since the hero became a single static image). Horizontally scrollable so
// admin can add any number of these without breaking the layout on mobile.
export default function DealCategoryBanners({ slides }) {
  const scrollerRef = useRef(null);

  if (slides.length === 0) return null;

  const scrollBy = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {slides.length > 1 && (
        <>
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
        </>
      )}

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {slides.map((s) => {
          const content = (
            <div className="relative z-10 p-6 pt-5 sm:pt-7">
              {s.heading && <p className="font-heading text-xl sm:text-2xl text-black">{s.heading}</p>}
              {s.subheading && <p className="text-sm font-semibold text-gold-dark mb-4 line-clamp-1">{s.subheading}</p>}
              {s.ctaLabel && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black text-gold px-3 py-1.5 rounded-md group-hover:bg-gold group-hover:text-black transition-colors">
                  {s.ctaLabel} <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </div>
          );
          const className = 'group relative shrink-0 w-[85%] sm:w-[360px] snap-start rounded-2xl overflow-hidden shadow-card h-40 sm:h-52 flex items-start';
          const style = s.image?.url
            ? { backgroundImage: `url('${resolveImageUrl(s.image.url)}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined;
          const to = s.ctaLink || '/shop';

          return to.startsWith('#') ? (
            <a key={s._id} href={to} className={`${className} bg-creme`} style={style}>
              {content}
            </a>
          ) : (
            <Link key={s._id} to={to} className={`${className} bg-creme`} style={style}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
