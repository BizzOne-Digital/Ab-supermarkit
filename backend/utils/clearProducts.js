// Removes all seeded/placeholder products. Categories, FAQs, delivery links and the admin
// user are left in place — only product data is cleared since none of it came from the client.
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

async function run() {
  await connectDB();
  const { deletedCount } = await Product.deleteMany({});
  console.log(`Removed ${deletedCount} placeholder products.`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed to clear products:', err);
  process.exit(1);
});
