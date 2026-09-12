import express from 'express';
import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '../controllers/heroSlideController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getHeroSlides);
router.post('/', protect, authorize, upload.single('image'), createHeroSlide);
router.put('/:id', protect, authorize, upload.single('image'), updateHeroSlide);
router.delete('/:id', protect, authorize, deleteHeroSlide);

export default router;
