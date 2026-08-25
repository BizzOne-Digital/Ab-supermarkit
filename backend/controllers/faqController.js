import FAQ from '../models/FAQ.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getFaqs = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true };
  const faqs = await FAQ.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  res.status(200).json({ success: true, faqs });
});

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ success: true, faq });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
  res.status(200).json({ success: true, faq });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
  res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
});
