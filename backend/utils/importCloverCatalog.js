// One-time import of the real AB's Supermarket catalogue exported from Clover.
// Usage: node utils/importCloverCatalog.js import-data/clover-catalog.csv
//
// Expected header (order-independent, matched by name):
//   Clover ID,Name,Category for website,Price,Product Code,SKU,Quantity,Default tax rates?,Tax Rates
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Minimal RFC4180-ish CSV parser: handles quoted fields containing commas/newlines.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && next === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

function looksLikeScientificNotation(value) {
  return /^\d+(\.\d+)?E\+\d+$/i.test((value || '').trim());
}

function parsePrice(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

async function run() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node utils/importCloverCatalog.js <path-to-csv>');
    process.exit(1);
  }
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  await connectDB();

  const text = fs.readFileSync(resolvedPath, 'utf-8');
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  const idx = {
    cloverId: header.findIndex((h) => /clover id/i.test(h)),
    name: header.findIndex((h) => /^name$/i.test(h)),
    category: header.findIndex((h) => /category/i.test(h)),
    price: header.findIndex((h) => /^price$/i.test(h)),
    productCode: header.findIndex((h) => /product code/i.test(h)),
    sku: header.findIndex((h) => /^sku$/i.test(h)),
    qty: header.findIndex((h) => /quantity/i.test(h)),
    taxRates: header.findIndex((h) => /^tax rates/i.test(h)),
  };

  // Normalizes category text so things like "Grocery Essentials" and "Grocery  Essentials"
  // (double space) collapse into a single category instead of colliding on slug.
  const normalizeCategory = (raw) => raw.trim().replace(/\s+/g, ' ');

  // Pass 1: collect distinct category names and upsert them.
  const categoryNames = new Set();
  for (const r of dataRows) {
    const cat = normalizeCategory(r[idx.category] || '');
    if (cat) categoryNames.add(cat);
  }

  const categoryMap = {};
  let sortOrder = 0;
  for (const name of categoryNames) {
    let doc = await Category.findOne({ name });
    if (!doc) {
      doc = await Category.create({ name, sortOrder: sortOrder++ });
    }
    categoryMap[name] = doc._id;
  }
  console.log(`Categories ready: ${categoryNames.size}`);

  // Pass 2: upsert products, keyed by Clover ID so re-running updates instead of duplicating.
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const skipReasons = [];

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    const cloverId = (r[idx.cloverId] || '').trim();
    const name = (r[idx.name] || '').trim();
    const rawPrice = (r[idx.price] || '').trim();
    const price = parsePrice(rawPrice);

    if (!name || price === null) {
      skipped++;
      skipReasons.push({ row: i + 2, cloverId, name, reason: !name ? 'missing name' : 'missing/invalid price' });
      continue;
    }

    const categoryName = normalizeCategory(r[idx.category] || '');
    const productCode = (r[idx.productCode] || '').trim();
    const skuRaw = (r[idx.sku] || '').trim();
    const sku = !looksLikeScientificNotation(skuRaw) && skuRaw ? skuRaw : (!looksLikeScientificNotation(productCode) ? productCode : '');
    const barcode = !looksLikeScientificNotation(productCode) ? productCode : '';
    const qtyRaw = parseInt(r[idx.qty], 10);
    const stockQuantity = Number.isFinite(qtyRaw) ? Math.max(qtyRaw, 0) : 0;
    const taxRate = (r[idx.taxRates] || '').trim();

    const productData = {
      name,
      cloverItemId: cloverId || undefined,
      sku: sku || undefined,
      barcode: barcode || undefined,
      category: categoryMap[categoryName] || undefined,
      regularPrice: price,
      stockQuantity,
      unit: 'each',
      status: 'active',
      tags: taxRate === 'No Tax' ? ['tax-exempt'] : [],
    };

    const existing = cloverId ? await Product.findOne({ cloverItemId: cloverId }) : null;
    if (existing) {
      Object.assign(existing, productData);
      await existing.save();
      updated++;
    } else {
      await Product.create(productData);
      created++;
    }
  }

  console.log(`\nImport complete.`);
  console.log(`Products created: ${created}`);
  console.log(`Products updated: ${updated}`);
  console.log(`Rows skipped: ${skipped}`);
  if (skipReasons.length > 0) {
    console.log('\nSkipped rows (first 20):');
    console.log(skipReasons.slice(0, 20));
  }

  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
