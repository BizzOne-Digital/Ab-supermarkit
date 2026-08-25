import Deal from '../models/Deal.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDeals = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true, endDate: { $gte: new Date() } };
  const deals = await Deal.find(filter).populate('product').sort({ createdAt: -1 });
  res.status(200).json({ success: true, deals });
});

export const createDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.create(req.body);
  res.status(201).json({ success: true, deal });
});

export const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  res.status(200).json({ success: true, deal });
});

export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findByIdAndDelete(req.params.id);
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  res.status(200).json({ success: true, message: 'Deal deleted successfully' });
});
