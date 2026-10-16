import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Three promo banners with artwork matching the deal type (Weekly Deals /
// Special Offer / Free Delivery). Promotional copy stays dynamic and
// numbers are derived from real data.
export default function DealCategoryBanners({ deals, offers, siteSettings }) {
  const bestPct = deals.reduce((max, d) => {
    const off = d.product?.regularPrice
      ? Math.round(((d.product.regularPrice - d.salePrice) / d.product.regularPrice) * 100)
      : 0;
    return off > max ? off : max;
  }, 0);

  const banners = [
    {
      image: '/deal-weekly-v2.jpg',
      label: 'Weekly Deals',
      sub: bestPct > 0 ? `Up to ${bestPct}% Off` : 'Shop Now',
      to: '/shop?sale=true',
    },
    {
      image: '/deal-karvachauth-v2.jpg',
      label: 'Special Offer',
      sub: offers[0]?.heading || 'Shop Now',
      to: '#special-offers',
    },
    {
      image: '/deal-delivery-v2.jpg',
      label: 'Free Delivery',
      sub: siteSettings?.freeDeliveryThreshold != null ? `Over $${Number(siteSettings.freeDeliveryThreshold).toFixed(0)}` : 'Shop Now',
      to: '/shop',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {banners.map((b) => {
        const content = (
          <div className="relative z-10 p-6 pt-5 sm:pt-7">
            <p className="font-heading text-xl sm:text-2xl text-black">{b.label}</p>
            <p className="text-sm font-semibold text-gold-dark mb-4 line-clamp-1">{b.sub}</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black text-gold px-3 py-1.5 rounded-md group-hover:bg-gold group-hover:text-black transition-colors">
              Shop Now <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        );
        const className = 'group relative rounded-2xl overflow-hidden shadow-card h-40 sm:h-52 flex items-start';
        const style = { backgroundImage: `url('${b.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' };

        return b.to.startsWith('#') ? (
          <a key={b.label} href={b.to} className={className} style={style}>
            {content}
          </a>
        ) : (
          <Link key={b.label} to={b.to} className={className} style={style}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
