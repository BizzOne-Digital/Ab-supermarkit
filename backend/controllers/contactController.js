import ContactSubmission from '../models/ContactSubmission.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendContactFormEmail } from '../services/emailService.js';
import { paginate } from '../utils/apiFeatures.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = asyncHandler(async (req, res) => {
  const submission = await ContactSubmission.create(req.body);
  sendContactFormEmail(submission).catch((err) => console.error('Contact email error:', err.message));
  res.status(201).json({ success: true, message: 'Thank you for reaching out. We will get back to you shortly.', submission });
});

// @desc    List contact submissions (admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactSubmissions = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 20, 1);
  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    ContactSubmission.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactSubmission.countDocuments(),
  ]);

  res.status(200).json({ success: true, submissions, pagination: paginate(total, page, limit) });
});
