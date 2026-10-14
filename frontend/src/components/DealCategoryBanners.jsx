import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Each banner's "Up to X% Off" is computed from real active deals in that category — never a
// made-up number. If there's no matching category or no deal in it yet, the banner just shows
// a plain "Shop Now" with no discount claim.
const BANNERS = [
  {
    image: '/deal-produce-v1.png',
    label: 'Fresh Fruits & Vegetables',
    categoryMatch: /fresh produce|produce|fruit|vegetable/i,
  },
  {
    image: '/deal-dairy-v1.png',
    label: 'Dairy & Eggs',
    categoryMatch: /dairy/i,
  },
  {
    image: '/deal-snacks-v1.png',
    label: 'Snacks & Sweets',
    categoryMatch: /snack|sweet|candy|candies/i,
  },
];

export default function DealCategoryBanners({ categories, deals }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {BANNERS.map((b) => {
        const category = categories.find((c) => b.categoryMatch.test(c.name));

        const pct = category
          ? deals.reduce((max, d) => {
              const prodCategory = d.product?.category?._id || d.product?.category;
              if (String(prodCategory) !== String(category._id)) return max;
              const off = d.product?.regularPrice
                ? Math.round(((d.product.regularPrice - d.salePrice) / d.product.regularPrice) * 100)
                : 0;
              return off > max ? off : max;
            }, 0)
          : 0;

        return (
          <Link
            key={b.label}
            to={category ? `/shop?category=${category._id}` : '/shop'}
            className="group relative rounded-2xl overflow-hidden shadow-card h-32 sm:h-36 flex items-center"
            style={{ backgroundImage: `url('${b.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="relative z-10 p-5">
              <p className="font-heading text-lg text-black">{b.label}</p>
              <p className="text-sm font-semibold text-gold-dark mb-3">
                {pct > 0 ? `Up to ${pct}% Off` : 'Shop Now'}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black text-gold px-3 py-1.5 rounded-md group-hover:bg-gold group-hover:text-black transition-colors">
                Shop Now <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
