import express from 'express';
import { body } from 'express-validator';
import { subscribeNewsletter, getNewsletterSubscribers } from '../controllers/newsletterController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { runValidation } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/subscribe',
  runValidation([body('email').isEmail().withMessage('Valid email is required').normalizeEmail()]),
  subscribeNewsletter
);

router.get('/', protect, authorize, getNewsletterSubscribers);

export default router;
