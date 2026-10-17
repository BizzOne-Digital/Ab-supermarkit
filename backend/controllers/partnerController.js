import Partner from '../models/Partner.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/storedUploadService.js';

export const getPartners = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true };
  const partners = await Partner.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  res.status(200).json({ success: true, partners });
});

export const createPartner = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.logo = await uploadImage(req.file, 'misc');
  }
  const partner = await Partner.create(data);
  res.status(201).json({ success: true, partner });
});

export const updatePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

  Object.assign(partner, req.body);
  if (req.file) {
    if (partner.logo?.publicId) await deleteImage(partner.logo.publicId).catch(() => null);
    partner.logo = await uploadImage(req.file, 'misc');
  }
  await partner.save();
  res.status(200).json({ success: true, partner });
});

export const deletePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
  if (partner.logo?.publicId) await deleteImage(partner.logo.publicId).catch(() => null);
  await partner.deleteOne();
  res.status(200).json({ success: true, message: 'Partner deleted successfully' });
});
