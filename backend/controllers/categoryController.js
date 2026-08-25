import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

// @desc    List categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true };
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
  res.status(200).json({ success: true, categories });
});

// @desc    Get single category by slug or id
// @route   GET /api/categories/:idOrSlug
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const category = await Category.findOne({
    $or: [{ slug: idOrSlug }, ...(idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: idOrSlug }] : [])],
  });
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.status(200).json({ success: true, category });
});

// @desc    Create category (admin)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const img = await uploadImage(req.file.buffer, 'ab-supermarket/categories');
    data.image = img;
  }
  const category = await Category.create(data);
  res.status(201).json({ success: true, category });
});

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  Object.assign(category, req.body);

  if (req.file) {
    if (category.image?.publicId) {
      await deleteImage(category.image.publicId).catch(() => null);
    }
    category.image = await uploadImage(req.file.buffer, 'ab-supermarket/categories');
  }

  await category.save();
  res.status(200).json({ success: true, category });
});

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  if (category.image?.publicId) {
    await deleteImage(category.image.publicId).catch(() => null);
  }
  await category.deleteOne();
  res.status(200).json({ success: true, message: 'Category deleted successfully' });
});
