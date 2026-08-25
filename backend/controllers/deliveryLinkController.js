import DeliveryLink from '../models/DeliveryLink.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDeliveryLinks = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true };
  const deliveryLinks = await DeliveryLink.find(filter).sort({ platform: 1 });
  res.status(200).json({ success: true, deliveryLinks });
});

export const createDeliveryLink = asyncHandler(async (req, res) => {
  const deliveryLink = await DeliveryLink.create(req.body);
  res.status(201).json({ success: true, deliveryLink });
});

export const updateDeliveryLink = asyncHandler(async (req, res) => {
  const deliveryLink = await DeliveryLink.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!deliveryLink) return res.status(404).json({ success: false, message: 'Delivery link not found' });
  res.status(200).json({ success: true, deliveryLink });
});

export const deleteDeliveryLink = asyncHandler(async (req, res) => {
  const deliveryLink = await DeliveryLink.findByIdAndDelete(req.params.id);
  if (!deliveryLink) return res.status(404).json({ success: false, message: 'Delivery link not found' });
  res.status(200).json({ success: true, message: 'Delivery link deleted successfully' });
});
