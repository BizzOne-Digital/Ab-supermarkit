import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', protect, authorize, createTestimonial);
router.put('/:id', protect, authorize, updateTestimonial);
router.delete('/:id', protect, authorize, deleteTestimonial);

export default router;
