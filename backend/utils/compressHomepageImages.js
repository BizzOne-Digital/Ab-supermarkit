// One-off compression pass for the large homepage/public PNGs (hero, deal banners, store photo)
// that were bloating page load — converts to compressed JPEG at a sensible max width for how
// large each actually renders on screen.
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const TARGETS = [
  { file: 'hero-groceries-reference-v1.png', width: 1800, quality: 72 },
  { file: 'hero-groceries-mobile-v1.png', width: 900, quality: 72 },
  { file: 'deal-weekly-v2.png', width: 900, quality: 72 },
  { file: 'deal-karvachauth-v2.png', width: 900, quality: 72 },
  { file: 'deal-delivery-v2.png', width: 900, quality: 72 },
  { file: 'store-interior-clean-v1.png', width: 1400, quality: 72 },
];

async function run() {
  const publicDir = path.resolve('../frontend/public');

  for (const { file, width, quality } of TARGETS) {
    const inputPath = path.join(publicDir, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skip (not found): ${file}`);
      continue;
    }
    const outputPath = path.join(publicDir, file.replace(/\.png$/, '.jpg'));
    const before = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(outputPath);

    const after = fs.statSync(outputPath).size;
    console.log(`${file} -> ${path.basename(outputPath)}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
