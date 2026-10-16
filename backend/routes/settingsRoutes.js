import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(15), getSettings);
router.put('/', protect, authorize, updateSettings);

export default router;
