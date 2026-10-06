import asyncHandler from '../utils/asyncHandler.js';
import StoredUpload from '../models/StoredUpload.js';
import { uploadImage, deleteImage, isValidFolder } from '../services/storedUploadService.js';

// @desc    Generic single-image upload used by the admin panel
// @route   POST /api/upload
// @access  Private/Admin
export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const folder = req.body.folder || 'misc';
  try {
    const result = await uploadImage(req.file, folder);
    res.status(201).json({ success: true, image: result, url: result.url, filename: result.publicId.split('/')[1], folder: result.publicId.split('/')[0] });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Delete an image by its stored publicId ("folder/filename")
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteUploadedImage = asyncHandler(async (req, res) => {
  // publicId may contain slashes (folder path) encoded in the URL param.
  const publicId = decodeURIComponent(req.params.publicId);
  const result = await deleteImage(publicId);
  res.status(200).json({ success: true, result });
});

// Only safe, single-segment filenames — no path traversal.
const FILENAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

// @desc    Stream a stored image back out
// @route   GET /api/uploads/:folder/:filename
// @access  Public (images must be viewable on the storefront)
export const serveUpload = asyncHandler(async (req, res) => {
  const { folder, filename } = req.params;

  if (!isValidFolder(folder) || !FILENAME_RE.test(filename) || filename.includes('..')) {
    return res.status(400).json({ success: false, message: 'Invalid image path' });
  }

  const doc = await StoredUpload.findOne({ folder, filename }).select('mimeType size data');
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Image not found' });
  }

  res.set({
    'Content-Type': doc.mimeType,
    'Content-Length': String(doc.size),
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
  res.send(doc.data);
});
