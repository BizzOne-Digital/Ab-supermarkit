import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    sku: { type: String, trim: true },
    barcode: { type: String, trim: true },
    description: { type: String },
    shortDescription: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    subcategory: { type: String },
    brand: { type: String },
    regularPrice: { type: Number, required: [true, 'Regular price is required'], min: 0 },
    salePrice: { type: Number, min: 0 },
    images: [imageSchema],
    stockQuantity: { type: Number, default: 0, min: 0 },
    cloverItemId: { type: String },
    unit: { type: String, default: 'each' },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    tags: [{ type: String }],
    lowStockThreshold: { type: Number, default: 10 },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now()
      .toString(36)
      .slice(-4)}`;
  }
  // Keep isOnSale consistent with salePrice presence
  this.isOnSale = !!(this.salePrice && this.salePrice > 0 && this.salePrice < this.regularPrice);
  next();
});

productSchema.virtual('isLowStock').get(function () {
  return this.stockQuantity <= this.lowStockThreshold;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ status: 1, category: 1 });

export default mongoose.model('Product', productSchema);
