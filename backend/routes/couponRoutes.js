import express from 'express';
import { body } from 'express-validator';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { runValidation } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/validate',
  runValidation([
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a positive number'),
  ]),
  validateCoupon
);

router.get('/', protect, authorize, getCoupons);
router.post(
  '/',
  protect,
  authorize,
  runValidation([
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('discountType must be percentage or fixed'),
    body('discountValue').isFloat({ min: 0 }).withMessage('discountValue must be a positive number'),
    body('expiryDate').notEmpty().withMessage('Expiry date is required'),
  ]),
  createCoupon
);
router.put('/:id', protect, authorize, updateCoupon);
router.delete('/:id', protect, authorize, deleteCoupon);

export default router;
