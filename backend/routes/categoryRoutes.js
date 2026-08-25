import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';
import { runValidation } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:idOrSlug', getCategory);

router.post(
  '/',
  protect,
  authorize,
  upload.single('image'),
  runValidation([body('name').trim().notEmpty().withMessage('Category name is required')]),
  createCategory
);

router.put('/:id', protect, authorize, upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize, deleteCategory);

export default router;
