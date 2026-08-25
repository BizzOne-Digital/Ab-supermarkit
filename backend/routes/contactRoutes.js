import express from 'express';
import { body } from 'express-validator';
import { submitContactForm, getContactSubmissions } from '../controllers/contactController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';
import { runValidation } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  runValidation([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ]),
  submitContactForm
);

router.get('/', protect, authorize, getContactSubmissions);

export default router;
