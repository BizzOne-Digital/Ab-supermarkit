import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import resolveImageUrl from '../utils/resolveImageUrl';

// Wide banner-style tiles (image + bottom-left label + arrow), as opposed to CategoryCard's
// square centered-label style used on the Shop page filters.
export default function FeaturedCategoriesRow({ categories }) {
  const withImages = categories.filter((c) => c.image?.url).slice(0, 5);
  if (withImages.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {withImages.map((c) => (
        <Link
          key={c._id}
          to={`/shop?category=${c._id}`}
          className="group relative aspect-[4/5] sm:aspect-square rounded-lg overflow-hidden shadow-card"
        >
          <img
            src={resolveImageUrl(c.image.url)}
            alt={c.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <span className="font-heading text-ivory text-sm sm:text-base">{c.name}</span>
            <span className="h-7 w-7 rounded-full bg-ivory/90 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors">
              <ArrowRight className="h-3.5 w-3.5 text-black" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
