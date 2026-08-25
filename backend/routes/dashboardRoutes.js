import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/admin.js';

const router = express.Router();

router.get('/stats', protect, authorize, getDashboardStats);

export default router;
