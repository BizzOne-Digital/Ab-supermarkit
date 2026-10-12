// One-time replacement of the placehold.co placeholder images on the seeded hero slides
// with real artwork, stored via storedUploadService (MongoDB-backed, same as every other
// admin-uploaded image) instead of referencing frontend/public directly.
//
// Usage: node utils/importHeroSlideImages.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import connectDB from '../config/db.js';
import HeroSlide from '../models/HeroSlide.js';
import { uploadImage, deleteImage } from '../services/storedUploadService.js';

// Maps each slide (matched by its current heading) to the source file that should replace it.
const MAPPING = [
  { heading: 'Best Quality, Best Price, Best Service', file: 'hero-groceries-ivory-v1.png' },
  { heading: 'Weekly Deals You’ll Love', file: 'hero-pantry-ivory-v1.png' },
  { heading: 'Fresh Produce, Daily', file: 'hero-produce-ivory-v1.png' },
];

async function run() {
  await connectDB();

  for (const { heading, file } of MAPPING) {
    const slide = await HeroSlide.findOne({ heading });
    if (!slide) {
      console.error(`No slide found with heading "${heading}" — skipping ${file}`);
      continue;
    }

    const filePath = path.resolve('../frontend/public', file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath} — skipping`);
      continue;
    }

    const buffer = fs.readFileSync(filePath);
    const uploaded = await uploadImage(
      { buffer, mimetype: 'image/png', size: buffer.length },
      'hero-slides'
    );

    if (slide.image?.publicId) {
      await deleteImage(slide.image.publicId).catch(() => null);
    }

    slide.image = uploaded;
    await slide.save();
    console.log(`Updated "${heading}" -> ${uploaded.url}`);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
