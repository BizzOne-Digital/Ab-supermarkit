import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-card p-6 flex flex-col h-full"
    >
      <Quote className="h-6 w-6 text-gold mb-3" />
      <p className="text-charcoal/80 flex-1 mb-4">&ldquo;{testimonial.review}&rdquo;</p>
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < testimonial.rating ? 'fill-gold text-gold' : 'text-charcoal/20'}`}
          />
        ))}
      </div>
      <p className="font-heading text-black">{testimonial.customerName}</p>
    </motion.div>
  );
}
