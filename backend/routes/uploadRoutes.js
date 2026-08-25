import express from 'express';
import { uploadSingleImage, deleteUploadedImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, authorize, upload.single('image'), uploadSingleImage);
router.delete('/:publicId', protect, authorize, deleteUploadedImage);

export default router;
