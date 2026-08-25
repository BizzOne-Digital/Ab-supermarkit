import Offer from '../models/Offer.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

export const getOffers = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true, expiryDate: { $gte: new Date() } };
  const offers = await Offer.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, offers });
});

export const createOffer = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.image = await uploadImage(req.file.buffer, 'ab-supermarket/offers');
  }
  const offer = await Offer.create(data);
  res.status(201).json({ success: true, offer });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

  Object.assign(offer, req.body);
  if (req.file) {
    if (offer.image?.publicId) await deleteImage(offer.image.publicId).catch(() => null);
    offer.image = await uploadImage(req.file.buffer, 'ab-supermarket/offers');
  }
  await offer.save();
  res.status(200).json({ success: true, offer });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
  if (offer.image?.publicId) await deleteImage(offer.image.publicId).catch(() => null);
  await offer.deleteOne();
  res.status(200).json({ success: true, message: 'Offer deleted successfully' });
});
