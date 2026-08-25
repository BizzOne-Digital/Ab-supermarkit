import express from 'express';
import {
  getDeliveryLinks,
  createDeliveryLink,
  updateDeliveryLink,
  deleteDeliveryLink,
} from '../controllers/deliveryLinkController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getDeliveryLinks);
router.post('/', protect, authorize, createDeliveryLink);
router.put('/:id', protect, authorize, updateDeliveryLink);
router.delete('/:id', protect, authorize, deleteDeliveryLink);

export default router;
