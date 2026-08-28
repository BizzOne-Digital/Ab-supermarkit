import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.04 }}
      className="h-full"
    >
      <Link
        to={`/shop?category=${category._id}`}
        className="group flex flex-col items-center text-center rounded-lg bg-white shadow-card hover:shadow-xl transition-shadow overflow-hidden h-full"
      >
        <div className="aspect-square w-full bg-creme overflow-hidden">
          {category.image?.url ? (
            <img
              src={category.image.url}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-charcoal/30 text-sm">No image</div>
          )}
        </div>
        <div className="py-3 px-2">
          <span className="font-heading text-black group-hover:text-gold-dark transition-colors">{category.name}</span>
          <span className="flex items-center justify-center gap-1 text-xs font-bold text-gold-dark mt-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            ORDER <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
