import express from 'express';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuItemController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(15), getMenuItems);
router.post('/', protect, authorize, upload.single('image'), createMenuItem);
router.put('/:id', protect, authorize, upload.single('image'), updateMenuItem);
router.delete('/:id', protect, authorize, deleteMenuItem);

export default router;
