import express from 'express';
import { getDeals, createDeal, updateDeal, deleteDeal } from '../controllers/dealController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(15), getDeals);
router.post('/', protect, authorize, createDeal);
router.put('/:id', protect, authorize, updateDeal);
router.delete('/:id', protect, authorize, deleteDeal);

export default router;
