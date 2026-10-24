import express from 'express';
import { getPartners, createPartner, updatePartner, deletePartner } from '../controllers/partnerController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';
import { cacheControl } from '../middleware/cacheControl.js';

const router = express.Router();

router.get('/', cacheControl(15), getPartners);
const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'menuImage', maxCount: 1 },
]);

router.post('/', protect, authorize, uploadFields, createPartner);
router.put('/:id', protect, authorize, uploadFields, updatePartner);
router.delete('/:id', protect, authorize, deletePartner);

export default router;
