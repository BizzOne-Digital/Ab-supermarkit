import Offer from '../models/Offer.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/storedUploadService.js';

// Admin sends products as a JSON-encoded array of ids inside the multipart form (can't send a
// real array field alongside a file upload), so it needs parsing before it reaches the schema.
const parseProducts = (raw) => {
  if (raw === undefined) return undefined;
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getOffers = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true, expiryDate: { $gte: new Date() } };
  const offers = await Offer.find(filter).populate('products', 'name slug images regularPrice salePrice isOnSale').sort({ createdAt: -1 });
  res.status(200).json({ success: true, offers });
});

export const createOffer = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.products !== undefined) data.products = parseProducts(data.products);
  if (req.file) {
    data.image = await uploadImage(req.file, 'offers');
  }
  const offer = await Offer.create(data);
  res.status(201).json({ success: true, offer });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

  const updates = { ...req.body };
  if (updates.products !== undefined) updates.products = parseProducts(updates.products);
  Object.assign(offer, updates);
  if (req.file) {
    if (offer.image?.publicId) await deleteImage(offer.image.publicId).catch(() => null);
    offer.image = await uploadImage(req.file, 'offers');
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
