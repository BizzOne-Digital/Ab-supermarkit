import Testimonial from '../models/Testimonial.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getTestimonials = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isEnabled: true };
  const testimonials = await Testimonial.find(filter).sort({ date: -1 });
  res.status(200).json({ success: true, testimonials });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  res.status(200).json({ success: true, testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
});
