import MenuItem from '../models/MenuItem.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/storedUploadService.js';

export const getMenuItems = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true };
  if (req.query.partner) filter.partner = req.query.partner;
  const menuItems = await MenuItem.find(filter).sort({ category: 1, sortOrder: 1, name: 1 });
  res.status(200).json({ success: true, menuItems });
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.image = await uploadImage(req.file, 'misc');
  }
  const menuItem = await MenuItem.create(data);
  res.status(201).json({ success: true, menuItem });
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) return res.status(404).json({ success: false, message: 'Menu item not found' });

  Object.assign(menuItem, req.body);
  if (req.file) {
    if (menuItem.image?.publicId) await deleteImage(menuItem.image.publicId).catch(() => null);
    menuItem.image = await uploadImage(req.file, 'misc');
  }
  await menuItem.save();
  res.status(200).json({ success: true, menuItem });
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) return res.status(404).json({ success: false, message: 'Menu item not found' });
  if (menuItem.image?.publicId) await deleteImage(menuItem.image.publicId).catch(() => null);
  await menuItem.deleteOne();
  res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
});
