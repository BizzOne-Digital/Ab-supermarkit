import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

export default function DealCard({ deal, compact = false }) {
  const product = deal.product;
  if (!product) return null;
  const image = product.images?.[0]?.url;
  const percentOff = Math.round(((product.regularPrice - deal.salePrice) / product.regularPrice) * 100);

  if (compact) {
    return (
      <Link to={`/shop/${product.slug}`} className="flex items-center gap-3 group">
        <div className="h-14 w-14 shrink-0 rounded-lg bg-charcoal overflow-hidden">
          {image && <img src={image} alt={product.name} className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ivory truncate group-hover:text-gold">{product.name}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-gold font-semibold text-sm">${Number(deal.salePrice).toFixed(2)}</span>
            <span className="text-xs text-ivory/40 line-through">${Number(product.regularPrice).toFixed(2)}</span>
          </div>
        </div>
        {Number.isFinite(percentOff) && percentOff > 0 && (
          <span className="shrink-0 bg-gold/10 text-gold text-[11px] font-bold px-2 py-1 rounded">
            {percentOff}% OFF
          </span>
        )}
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-black rounded-lg overflow-hidden shadow-card border border-gold/20 flex flex-col"
    >
      <Link to={`/shop/${product.slug}`} className="relative block aspect-square bg-charcoal overflow-hidden">
        {image && <img src={image} alt={product.name} className="h-full w-full object-cover" />}
        {Number.isFinite(percentOff) && percentOff > 0 && (
          <span className="absolute top-2 left-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Tag className="h-3 w-3" /> {percentOff}% OFF
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/shop/${product.slug}`} className="font-heading text-ivory hover:text-gold line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-heading text-gold text-lg">${Number(deal.salePrice).toFixed(2)}</span>
          <span className="text-sm text-ivory/40 line-through">${Number(product.regularPrice).toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
