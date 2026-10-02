// Adds placeholder hero slides so the homepage shows the slider instead of the video fallback.
// Replace these with real store photography via Admin > Homepage Slides whenever available.
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import HeroSlide from '../models/HeroSlide.js';

const img = (seed, bg = 'C99A35', fg = '090F12') => ({
  url: `https://placehold.co/1600x900/${bg}/${fg}?text=${encodeURIComponent(seed)}`,
  publicId: `seed/hero/${seed.toLowerCase().replace(/\s+/g, '-')}`,
});

const SLIDES = [
  {
    heading: 'Best Quality, Best Price, Best Service',
    subheading: 'Your neighbourhood destination for fresh groceries and everyday essentials.',
    ctaLabel: 'Shop Groceries',
    ctaLink: '/shop',
    sortOrder: 0,
    image: img('AB’S SUPERMARKET'),
  },
  {
    heading: 'Weekly Deals You’ll Love',
    subheading: 'Fresh savings on groceries, every single week.',
    ctaLabel: 'View Deals',
    ctaLink: '/shop?sale=true',
    sortOrder: 1,
    image: img('WEEKLY DEALS', '090F12', 'C99A35'),
  },
  {
    heading: 'Fresh Produce, Daily',
    subheading: 'Hand-picked fruits and vegetables, delivered to your door.',
    ctaLabel: 'Explore Our Store',
    ctaLink: '/about',
    sortOrder: 2,
    image: img('FRESH PRODUCE'),
  },
];

async function run() {
  await connectDB();
  const existing = await HeroSlide.countDocuments();
  if (existing > 0) {
    console.log(`${existing} hero slide(s) already exist — skipping seed (delete them in Admin first if you want to reseed).`);
    await mongoose.connection.close();
    process.exit(0);
  }

  for (const s of SLIDES) {
    await HeroSlide.create(s);
  }
  console.log(`Created ${SLIDES.length} placeholder hero slides. Replace via Admin > Homepage Slides when real photos are ready.`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
