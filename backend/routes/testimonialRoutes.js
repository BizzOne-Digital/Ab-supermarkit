import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(15), getTestimonials);
router.post('/', protect, authorize, createTestimonial);
router.put('/:id', protect, authorize, updateTestimonial);
router.delete('/:id', protect, authorize, deleteTestimonial);

export default router;
