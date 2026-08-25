import SiteSettings from '../models/SiteSettings.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get site settings (public - only non-sensitive display fields used by the storefront)
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSettings();
  res.status(200).json({ success: true, settings });
});

// @desc    Update site settings (admin)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSettings();
  Object.assign(settings, req.body);
  await settings.save();
  res.status(200).json({ success: true, settings });
});
