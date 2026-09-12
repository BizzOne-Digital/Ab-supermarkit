import HeroSlide from '../models/HeroSlide.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';

export const getHeroSlides = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true };
  const slides = await HeroSlide.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  res.status(200).json({ success: true, slides });
});

export const createHeroSlide = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Slide image is required' });
  }
  const data = { ...req.body };
  data.image = await uploadImage(req.file.buffer, 'ab-supermarket/hero-slides');
  const slide = await HeroSlide.create(data);
  res.status(201).json({ success: true, slide });
});

export const updateHeroSlide = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });

  Object.assign(slide, req.body);
  if (req.file) {
    if (slide.image?.publicId) await deleteImage(slide.image.publicId).catch(() => null);
    slide.image = await uploadImage(req.file.buffer, 'ab-supermarket/hero-slides');
  }
  await slide.save();
  res.status(200).json({ success: true, slide });
});

export const deleteHeroSlide = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ success: false, message: 'Slide not found' });
  if (slide.image?.publicId) await deleteImage(slide.image.publicId).catch(() => null);
  await slide.deleteOne();
  res.status(200).json({ success: true, message: 'Slide deleted successfully' });
});
