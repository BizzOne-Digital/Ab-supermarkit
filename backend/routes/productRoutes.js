import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { upload } from '../middleware/upload.js';
import { runValidation } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

router.post(
  '/',
  protect,
  authorize,
  upload.array('images', 6),
  runValidation([
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('regularPrice').isFloat({ min: 0 }).withMessage('Regular price must be a positive number'),
  ]),
  createProduct
);

router.post('/bulk-import', protect, authorize, bulkImportProducts);

router.put('/:id', protect, authorize, upload.array('images', 6), updateProduct);
router.delete('/:id', protect, authorize, deleteProduct);

export default router;
