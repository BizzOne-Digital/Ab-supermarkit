import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';
import { paginate } from '../utils/apiFeatures.js';

// @desc    List products with pagination/filter/search/sort
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 20, 1);
  const skip = (page - 1) * limit;

  const query = { status: 'active' };

  if (req.query.category) query.category = req.query.category;
  if (req.query.brand) query.brand = req.query.brand;
  if (req.query.sale === 'true') query.isOnSale = true;
  if (req.query.featured === 'true') query.isFeatured = true;

  if (req.query.minPrice || req.query.maxPrice) {
    query.regularPrice = {};
    if (req.query.minPrice) query.regularPrice.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.regularPrice.$lte = Number(req.query.maxPrice);
  }

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  let sort = { createdAt: -1 };
  if (req.query.sort) {
    const sortMap = {
      'price-asc': { regularPrice: 1 },
      'price-desc': { regularPrice: -1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { name: 1 },
    };
    sort = sortMap[req.query.sort] || sort;
  }

  const [products, total] = await Promise.all([
    Product.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    products,
    pagination: paginate(total, page, limit),
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.status(200).json({ success: true, product });
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };

  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(req.files.map((file) => uploadImage(file.buffer, 'ab-supermarket/products')));
    productData.images = uploads.map((img, idx) => ({ ...img, isPrimary: idx === 0 }));
  }

  const product = await Product.create(productData);
  res.status(201).json({ success: true, product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  Object.assign(product, req.body);

  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary before replacing.
    await Promise.all(
      (product.images || []).map((img) => deleteImage(img.publicId).catch(() => null))
    );
    const uploads = await Promise.all(req.files.map((file) => uploadImage(file.buffer, 'ab-supermarket/products')));
    product.images = uploads.map((img, idx) => ({ ...img, isPrimary: idx === 0 }));
  }

  await product.save();
  res.status(200).json({ success: true, product });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  await Promise.all((product.images || []).map((img) => deleteImage(img.publicId).catch(() => null)));
  await product.deleteOne();

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});
