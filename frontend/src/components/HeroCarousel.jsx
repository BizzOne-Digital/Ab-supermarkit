import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const AUTO_ROTATE_MS = 6000;

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <section className="relative bg-black text-ivory overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${slide.image?.url}')` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/30" />

      <div className="container-app py-24 sm:py-36 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-center mx-auto"
          >
            {slide.heading && (
              <h1 className="font-heading text-4xl sm:text-6xl font-bold leading-tight text-gold">{slide.heading}</h1>
            )}
            {slide.subheading && <p className="mt-5 text-ivory/70 text-lg">{slide.subheading}</p>}
            {slide.ctaLabel && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link to={slide.ctaLink || '/shop'} className="btn-gold">
                  {slide.ctaLabel}
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s._id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-gold' : 'w-2 bg-ivory/50 hover:bg-ivory/80'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
