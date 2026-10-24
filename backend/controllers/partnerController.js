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
  if (req.files?.logo?.[0]) {
    data.logo = await uploadImage(req.files.logo[0], 'misc');
  }
  if (req.files?.menuImage?.[0]) {
    data.menuImage = await uploadImage(req.files.menuImage[0], 'misc');
  }
  const partner = await Partner.create(data);
  res.status(201).json({ success: true, partner });
});

export const updatePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

  Object.assign(partner, req.body);
  if (req.files?.logo?.[0]) {
    if (partner.logo?.publicId) await deleteImage(partner.logo.publicId).catch(() => null);
    partner.logo = await uploadImage(req.files.logo[0], 'misc');
  }
  if (req.files?.menuImage?.[0]) {
    if (partner.menuImage?.publicId) await deleteImage(partner.menuImage.publicId).catch(() => null);
    partner.menuImage = await uploadImage(req.files.menuImage[0], 'misc');
  }
  await partner.save();
  res.status(200).json({ success: true, partner });
});

export const deletePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
  if (partner.logo?.publicId) await deleteImage(partner.logo.publicId).catch(() => null);
  if (partner.menuImage?.publicId) await deleteImage(partner.menuImage.publicId).catch(() => null);
  await partner.deleteOne();
  res.status(200).json({ success: true, message: 'Partner deleted successfully' });
});
