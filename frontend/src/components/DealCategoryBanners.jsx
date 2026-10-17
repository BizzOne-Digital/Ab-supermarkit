import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import resolveImageUrl from '../utils/resolveImageUrl';

// Renders whatever's set up in Admin > Slides (image, heading, subheading, button label/link) —
// fully editable there instead of being hardcoded, same admin screen used for the old hero
// carousel (now unused since the hero became a single static image).
export default function DealCategoryBanners({ slides }) {
  if (slides.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {slides.slice(0, 3).map((s) => {
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
        const className = 'group relative rounded-2xl overflow-hidden shadow-card h-40 sm:h-52 flex items-start';
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
  );
}
