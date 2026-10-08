// One-time import of product photos from frontend/public/product-images/<CloverID>/01.jpg, 02.jpg, ...
// Takes only the first image per product (01.jpg, or the alphabetically-first file if that's
// missing), compresses it, and stores it via storedUploadService (MongoDB-backed, same as every
// other admin-uploaded image). Matches folders to products by Clover ID.
//
// Usage: node utils/importProductImages.js [path-to-product-images-folder]
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { uploadImage, deleteImage } from '../services/storedUploadService.js';

const MAX_WIDTH = 900;
const JPEG_QUALITY = 78;

async function run() {
  const rootDir = path.resolve(process.argv[2] || 'frontend/public/product-images');
  if (!fs.existsSync(rootDir)) {
    console.error(`Folder not found: ${rootDir}`);
    process.exit(1);
  }

  await connectDB();

  const folders = fs.readdirSync(rootDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  console.log(`Found ${folders.length} product-image folders.`);

  let updated = 0;
  let noMatch = 0;
  let noImageFile = 0;
  let failed = 0;
  const noMatchIds = [];

  for (let i = 0; i < folders.length; i++) {
    const cloverId = folders[i].name;
    const folderPath = path.join(rootDir, cloverId);

    const files = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();

    if (files.length === 0) {
      noImageFile++;
      continue;
    }

    const product = await Product.findOne({ cloverItemId: cloverId });
    if (!product) {
      noMatch++;
      noMatchIds.push(cloverId);
      continue;
    }

    try {
      const srcPath = path.join(folderPath, files[0]);
      const rawBuffer = fs.readFileSync(srcPath);

      const compressed = await sharp(rawBuffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY })
        .toBuffer();

      const fakeFile = { buffer: compressed, mimetype: 'image/jpeg', size: compressed.length };

      // Replace any existing image(s) on this product.
      await Promise.all((product.images || []).map((img) => deleteImage(img.publicId).catch(() => null)));

      const uploaded = await uploadImage(fakeFile, 'products');
      product.images = [{ ...uploaded, isPrimary: true }];
      await product.save();

      updated++;
      if (updated % 200 === 0) {
        console.log(`...${updated} products updated so far`);
      }
    } catch (err) {
      failed++;
      console.error(`Failed for ${cloverId}:`, err.message);
    }
  }

  console.log('\nImport complete.');
  console.log(`Products updated with an image: ${updated}`);
  console.log(`Folders with no matching product: ${noMatch}`);
  console.log(`Folders with no image file inside: ${noImageFile}`);
  console.log(`Failed uploads: ${failed}`);
  if (noMatchIds.length > 0) {
    console.log('\nFirst 20 unmatched Clover IDs (no product with this cloverItemId):');
    console.log(noMatchIds.slice(0, 20));
  }

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
