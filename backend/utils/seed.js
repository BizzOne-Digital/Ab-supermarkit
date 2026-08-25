// One-time / re-runnable seed script — populates the initial 30 products (per the client scoping
// document: "Initial setup/listing of up to 30 products") plus the categories, delivery links,
// FAQs and an admin login needed to actually use the admin panel.
// Run with: npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import DeliveryLink from '../models/DeliveryLink.js';
import FAQ from '../models/FAQ.js';
import Testimonial from '../models/Testimonial.js';

const img = (seed) => ({
  url: `https://placehold.co/800x800/F5EEDF/292929?text=${encodeURIComponent(seed)}`,
  publicId: `seed/${seed.toLowerCase().replace(/\s+/g, '-')}`,
  isPrimary: true,
});

const CATEGORIES = [
  { name: 'Fresh Produce', description: 'Fresh fruits and vegetables.' },
  { name: 'Indian & Asian Grocery', description: 'Rice, spices, lentils, sauces, noodles and international products.' },
  { name: 'Canadian Essentials', description: 'Everyday Canadian grocery favourites.' },
  { name: 'Dairy & Frozen', description: 'Milk, yogurt, cheese and frozen products.' },
  { name: 'Snacks & Drinks', description: 'Snacks, soft drinks, juices and beverages.' },
  { name: 'Pantry Essentials', description: 'Cooking oils, sauces, grains, cereals and canned goods.' },
  { name: 'Household', description: 'Daily convenience and household products.' },
  { name: 'Café', description: 'Coffee, hot drinks, snacks, baked items and café products.' },
];

// 30 products, spread across the 8 categories above.
const PRODUCTS = [
  // Fresh Produce
  { name: 'Fresh Strawberries', category: 'Fresh Produce', regularPrice: 5.99, salePrice: 4.99, unit: '1 lb', tags: ['fruit', 'fresh'], isFeatured: true },
  { name: 'Organic Bananas', category: 'Fresh Produce', regularPrice: 1.49, unit: 'per lb', tags: ['fruit'] },
  { name: 'Green Seedless Grapes', category: 'Fresh Produce', regularPrice: 3.49, salePrice: 2.49, unit: 'per lb', tags: ['fruit', 'deal'] },
  { name: 'Red Bell Peppers', category: 'Fresh Produce', regularPrice: 2.29, salePrice: 1.49, unit: 'per lb', tags: ['vegetable', 'deal'] },
  { name: 'Baby Spinach', category: 'Fresh Produce', regularPrice: 3.99, unit: '300 g', tags: ['vegetable'] },
  // Indian & Asian Grocery
  { name: 'Daawat Basmati Rice', category: 'Indian & Asian Grocery', regularPrice: 16.99, unit: '5 kg', brand: 'Daawat', isFeatured: true, isBestSeller: true },
  { name: 'Toor Dal (Split Pigeon Peas)', category: 'Indian & Asian Grocery', regularPrice: 8.49, unit: '2 kg', brand: 'Laxmi' },
  { name: 'Maggi Masala Noodles (Pack of 12)', category: 'Indian & Asian Grocery', regularPrice: 9.99, brand: 'Maggi', isBestSeller: true },
  { name: 'Shan Biryani Masala', category: 'Indian & Asian Grocery', regularPrice: 2.99, unit: '50 g', brand: 'Shan' },
  { name: 'Soy Sauce', category: 'Indian & Asian Grocery', regularPrice: 4.49, unit: '500 ml', brand: 'Kikkoman' },
  // Canadian Essentials
  { name: 'Neilson 2% Milk', category: 'Canadian Essentials', regularPrice: 6.49, unit: '4 L', brand: 'Neilson', isFeatured: true },
  { name: 'Wonder Bread White', category: 'Canadian Essentials', regularPrice: 3.29, unit: '675 g', brand: 'Wonder' },
  { name: 'Maple Syrup', category: 'Canadian Essentials', regularPrice: 12.99, unit: '500 ml', brand: "Crown Maple", tags: ['local'] },
  { name: 'Free-Run Eggs (Dozen)', category: 'Canadian Essentials', regularPrice: 5.49, unit: '12 pack' },
  { name: 'Tim Hortons Coffee', category: 'Canadian Essentials', regularPrice: 15.99, unit: '875 g', brand: 'Tim Hortons', isBestSeller: true },
  // Dairy & Frozen
  { name: 'Liberte Greek Yogurt', category: 'Dairy & Frozen', regularPrice: 5.99, unit: '750 g', brand: 'Liberte' },
  { name: 'Old Cheddar Cheese Block', category: 'Dairy & Frozen', regularPrice: 7.99, unit: '400 g' },
  { name: 'Frozen Mixed Berries', category: 'Dairy & Frozen', regularPrice: 6.49, unit: '600 g' },
  { name: 'Frozen Garlic Naan (6 pack)', category: 'Dairy & Frozen', regularPrice: 4.99, unit: '6 pack' },
  { name: 'Fresh Atlantic Salmon Fillet', category: 'Dairy & Frozen', regularPrice: 12.99, salePrice: 8.99, unit: 'per lb', tags: ['deal'] },
  // Snacks & Drinks
  { name: "Lay's Classic Chips", category: 'Snacks & Drinks', regularPrice: 3.99, unit: '235 g', brand: "Lay's", isFeatured: true },
  { name: 'Coca-Cola (12 pack cans)', category: 'Snacks & Drinks', regularPrice: 8.99, brand: 'Coca-Cola' },
  { name: 'Ferrero Rocher T24', category: 'Snacks & Drinks', regularPrice: 11.99, unit: 'T24 box', brand: 'Ferrero', isFeatured: true },
  { name: 'Orange Juice', category: 'Snacks & Drinks', regularPrice: 5.49, unit: '1.75 L' },
  { name: 'Sparkling Water (12 pack)', category: 'Snacks & Drinks', regularPrice: 6.99, unit: '12 pack' },
  // Pantry Essentials
  { name: 'OLIV Extra Virgin Olive Oil', category: 'Pantry Essentials', regularPrice: 14.99, unit: '1 L', brand: 'OLIV', isFeatured: true },
  { name: 'Rummo Pasta', category: 'Pantry Essentials', regularPrice: 3.49, unit: '500 g', brand: 'Rummo' },
  { name: 'Classico Pasta Sauce', category: 'Pantry Essentials', regularPrice: 4.29, unit: '650 ml', brand: 'Classico' },
  // Household
  { name: 'Paper Towels (6 rolls)', category: 'Household', regularPrice: 9.99, unit: '6 rolls' },
  { name: 'Dish Soap', category: 'Household', regularPrice: 3.49, unit: '739 ml' },
  // Café
  { name: 'Lavazza Qualita Oro Coffee', category: 'Café', regularPrice: 13.99, unit: '340 g', brand: 'Lavazza', isFeatured: true },
  { name: 'Croissants (4 pack)', category: 'Café', regularPrice: 6.49, unit: '4 pack', isFeatured: true },
];

const FAQS = [
  { question: 'Do you offer delivery?', answer: 'Yes — order directly on our website, or through Uber Eats, SkipTheDishes or DoorDash.', sortOrder: 1 },
  { question: 'Can I order groceries online?', answer: 'Yes, browse our full catalogue and check out securely right on this website.', sortOrder: 2 },
  { question: 'Do you offer pickup?', answer: 'Yes, select pickup at checkout and we will have your order ready at the store.', sortOrder: 3 },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards online, plus in-store payment options.', sortOrder: 4 },
  { question: 'Do you carry international groceries?', answer: 'Yes — we stock a wide range of Indian, Asian and Canadian grocery products.', sortOrder: 5 },
  { question: 'How can I contact the store?', answer: 'Call us at +1 382-577-5589 or email info@abssupermarket.com.', sortOrder: 6 },
];

async function run() {
  await connectDB();
  console.log('Seeding AB’s Supermarket data...');

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@abssupermarket.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({ name: 'AB Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword} (change this password after first login)`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // Categories
  const categoryMap = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    let doc = await Category.findOne({ name: c.name });
    if (!doc) {
      doc = await Category.create({ ...c, image: img(c.name), sortOrder: i });
    }
    categoryMap[c.name] = doc._id;
  }
  console.log(`Categories ready: ${CATEGORIES.length}`);

  // Products
  let created = 0;
  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) continue;
    await Product.create({
      name: p.name,
      sku: `SKU-${p.name.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      description: `${p.name} — quality you can trust, available now at AB's Supermarket.`,
      shortDescription: p.name,
      category: categoryMap[p.category],
      brand: p.brand || 'AB’s Supermarket',
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      images: [img(p.name)],
      stockQuantity: Math.floor(Math.random() * 80) + 20,
      unit: p.unit || 'each',
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      tags: p.tags || [],
      status: 'active',
    });
    created += 1;
  }
  console.log(`Products created: ${created} (skipped ${PRODUCTS.length - created} already existing) — total target: ${PRODUCTS.length}`);

  // Delivery links (placeholder URLs — replace with the client's real ordering page links before launch)
  const deliveryDefaults = [
    { platform: 'UberEats', url: 'https://www.ubereats.com/ca' },
    { platform: 'SkipTheDishes', url: 'https://www.skipthedishes.com' },
    { platform: 'DoorDash', url: 'https://www.doordash.com' },
  ];
  for (const d of deliveryDefaults) {
    const exists = await DeliveryLink.findOne({ platform: d.platform });
    if (!exists) await DeliveryLink.create(d);
  }
  console.log('Delivery links ready (placeholder URLs — update with real store links in Admin > Delivery Links).');

  // FAQs
  for (const f of FAQS) {
    const exists = await FAQ.findOne({ question: f.question });
    if (!exists) await FAQ.create(f);
  }
  console.log(`FAQs ready: ${FAQS.length}`);

  // A couple of starter testimonials so the homepage section isn't empty
  const testimonialDefaults = [
    { customerName: 'Sarah M.', rating: 5, review: 'Great selection and always fresh produce. My go-to grocery stop.' },
    { customerName: 'Amrit K.', rating: 5, review: 'Love that they carry all the Indian grocery staples I need, plus everyday essentials.' },
    { customerName: 'James T.', rating: 4, review: 'Friendly staff and the online ordering makes pickup so easy.' },
  ];
  for (const t of testimonialDefaults) {
    const exists = await Testimonial.findOne({ customerName: t.customerName, review: t.review });
    if (!exists) await Testimonial.create(t);
  }
  console.log('Testimonials ready.');

  console.log('\nSeed complete.');
  console.log(`Admin login -> email: ${adminEmail}  password: ${adminPassword}`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
