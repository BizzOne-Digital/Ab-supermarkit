import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  getMe,
  verifyTwoFactor,
  forgotPassword,
  resetPassword,
  updateProfile,
  getCustomers,
  adminCreateCustomer,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { runValidation } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  runValidation([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  register
);

router.post(
  '/login',
  runValidation([
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

router.post(
  '/verify-2fa',
  runValidation([
    body('userId').notEmpty().withMessage('userId is required'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit code'),
  ]),
  verifyTwoFactor
);

router.post('/logout', logout);
router.get('/me', protect, getMe);

router.post(
  '/forgot-password',
  runValidation([body('email').isEmail().withMessage('Valid email is required').normalizeEmail()]),
  forgotPassword
);

router.post(
  '/reset-password/:token',
  runValidation([body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')]),
  resetPassword
);

router.put('/update-profile', protect, updateProfile);

router.get('/customers', protect, authorize, getCustomers);
router.post(
  '/admin-create-customer',
  protect,
  authorize,
  runValidation([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  adminCreateCustomer
);

export default router;
