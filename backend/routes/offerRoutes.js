import express from 'express';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getOffers);
router.post('/', protect, authorize, upload.single('image'), createOffer);
router.put('/:id', protect, authorize, upload.single('image'), updateOffer);
router.delete('/:id', protect, authorize, deleteOffer);

export default router;
