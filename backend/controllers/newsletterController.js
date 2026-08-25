import Newsletter from '../models/Newsletter.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Subscribe to newsletter (deduped by email)
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const existing = await Newsletter.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(200).json({ success: true, message: 'You are already subscribed to our newsletter.' });
  }
  await Newsletter.create({ email: email.toLowerCase() });
  res.status(201).json({ success: true, message: 'Successfully subscribed to our newsletter.' });
});

// @desc    List newsletter subscribers (admin)
// @route   GET /api/newsletter
// @access  Private/Admin
export const getNewsletterSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
  res.status(200).json({ success: true, subscribers });
});
