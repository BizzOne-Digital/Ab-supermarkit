import express from 'express';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getFaqs);
router.post('/', protect, authorize, createFaq);
router.put('/:id', protect, authorize, updateFaq);
router.delete('/:id', protect, authorize, deleteFaq);

export default router;
