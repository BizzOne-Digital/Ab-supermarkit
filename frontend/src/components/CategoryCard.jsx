import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CategoryCard({ category }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/shop?category=${category._id}`}
        className="group flex flex-col items-center text-center rounded-lg bg-white shadow-card overflow-hidden"
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
        </div>
      </Link>
    </motion.div>
  );
}
