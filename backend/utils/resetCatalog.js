// Removes the placeholder categories (never provided by the client) and adds just 3 simple
// placeholder products with no category, so the admin has something minimal to start from.
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const img = (seed) => ({
  url: `https://placehold.co/800x800/F5EEDF/292929?text=${encodeURIComponent(seed)}`,
  publicId: `seed/${seed.toLowerCase().replace(/\s+/g, '-')}`,
  isPrimary: true,
});

const PRODUCTS = [
  { name: 'Sample Product 1', regularPrice: 4.99, unit: 'each' },
  { name: 'Sample Product 2', regularPrice: 7.99, unit: 'each' },
  { name: 'Sample Product 3', regularPrice: 12.99, unit: 'each' },
];

async function run() {
  await connectDB();

  const { deletedCount: catsRemoved } = await Category.deleteMany({});
  console.log(`Removed ${catsRemoved} placeholder categories.`);

  await Product.deleteMany({});

  for (const p of PRODUCTS) {
    await Product.create({
      name: p.name,
      description: 'Sample placeholder product — replace with real product details.',
      shortDescription: p.name,
      regularPrice: p.regularPrice,
      images: [img(p.name)],
      stockQuantity: 50,
      unit: p.unit,
      status: 'active',
    });
  }
  console.log(`Added ${PRODUCTS.length} sample products (no category assigned).`);

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
