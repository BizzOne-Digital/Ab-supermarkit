import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, authorize, updateSettings);

export default router;
