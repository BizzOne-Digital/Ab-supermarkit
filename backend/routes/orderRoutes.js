import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { runValidation } from '../middleware/validate.js';

const router = express.Router();

// Optional-auth: try to attach req.user if a token is present, otherwise continue as guest.
const optionalAuth = async (req, res, next) => {
  const hasAuthHeader = req.headers.authorization?.startsWith('Bearer ');
  const hasCookie = !!req.cookies?.token;
  if (!hasAuthHeader && !hasCookie) return next();
  return protect(req, res, next);
};

router.post(
  '/',
  optionalAuth,
  runValidation([
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('customerInfo.name').trim().notEmpty().withMessage('Customer name is required'),
    body('customerInfo.email').isEmail().withMessage('Valid customer email is required'),
    body('customerInfo.phone').trim().notEmpty().withMessage('Customer phone is required'),
  ]),
  createOrder
);

router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, authorize, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize, updateOrderStatus);

export default router;
