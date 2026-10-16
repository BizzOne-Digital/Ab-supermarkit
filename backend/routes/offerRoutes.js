import express from 'express';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { uploadMedia } from '../middleware/upload.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(15), getOffers);
router.post('/', protect, authorize, uploadMedia.single('image'), createOffer);
router.put('/:id', protect, authorize, uploadMedia.single('image'), updateOffer);
router.delete('/:id', protect, authorize, deleteOffer);

export default router;
