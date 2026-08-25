import express from 'express';
import { getDeals, createDeal, updateDeal, deleteDeal } from '../controllers/dealController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getDeals);
router.post('/', protect, authorize, createDeal);
router.put('/:id', protect, authorize, updateDeal);
router.delete('/:id', protect, authorize, deleteDeal);

export default router;
