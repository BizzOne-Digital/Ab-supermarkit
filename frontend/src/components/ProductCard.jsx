import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const image = product.images?.[0]?.url;
  const price = product.isOnSale && product.salePrice ? product.salePrice : product.regularPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group bg-white rounded-lg shadow-card hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
    >
      <Link to={`/shop/${product.slug}`} className="relative block aspect-square bg-creme overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-charcoal/30 text-sm">No image</div>
        )}
        {product.isOnSale && (
          <span className="absolute top-2 left-2 bg-gold text-black text-xs font-bold px-2 py-1 rounded">SALE</span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/shop/${product.slug}`} className="font-heading text-lg text-black hover:text-gold-dark line-clamp-2 mb-1">
          {product.name}
        </Link>
        {product.unit && <p className="text-xs text-charcoal/50 mb-2">{product.unit}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg text-black">${Number(price).toFixed(2)}</span>
            {product.isOnSale && (
              <span className="text-sm text-charcoal/40 line-through">${Number(product.regularPrice).toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product, 1)}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-black text-gold hover:bg-gold hover:text-black transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
