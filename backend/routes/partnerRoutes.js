import express from 'express';
import { getPartners, createPartner, updatePartner, deletePartner } from '../controllers/partnerController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(15), getPartners);
router.post('/', protect, authorize, upload.single('logo'), createPartner);
router.put('/:id', protect, authorize, upload.single('logo'), updatePartner);
router.delete('/:id', protect, authorize, deletePartner);

export default router;
