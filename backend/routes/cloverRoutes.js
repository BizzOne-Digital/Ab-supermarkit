import express from 'express';
import { getSyncStatus, triggerSync, getCloverInventory } from '../controllers/cloverController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';

const router = express.Router();

router.get('/sync-status', protect, authorize, getSyncStatus);
router.post('/sync', protect, authorize, triggerSync);
router.get('/inventory', protect, authorize, getCloverInventory);

export default router;
