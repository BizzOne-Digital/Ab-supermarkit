import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

// @desc    Generic single-image upload used by the admin panel
// @route   POST /api/upload
// @access  Private/Admin
export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const folder = req.body.folder || 'ab-supermarket/misc';
  const result = await uploadImage(req.file.buffer, folder);
  res.status(201).json({ success: true, image: result });
});

// @desc    Delete an image by its Cloudinary public id
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteUploadedImage = asyncHandler(async (req, res) => {
  // publicId may contain slashes (folder path) encoded in the URL param.
  const publicId = decodeURIComponent(req.params.publicId);
  const result = await deleteImage(publicId);
  res.status(200).json({ success: true, result });
});
