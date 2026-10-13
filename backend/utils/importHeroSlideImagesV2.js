// Replaces the v1 hero slide images with the new "center-clear" v2 set, which were designed
// with an open center area so the heading/subheading can sit centered on the image instead of
// off to one side.
//
// Usage: node utils/importHeroSlideImagesV2.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import connectDB from '../config/db.js';
import HeroSlide from '../models/HeroSlide.js';
import { uploadImage, deleteImage } from '../services/storedUploadService.js';

const MAPPING = [
  { heading: 'Best Quality, Best Price, Best Service', file: 'hero-everyday-center-clear-v2.png' },
  { heading: 'Weekly Deals You’ll Love', file: 'hero-mixed-center-clear-v2.png' },
  { heading: 'Fresh Produce, Daily', file: 'hero-snacks-care-center-clear-v2.png' },
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
