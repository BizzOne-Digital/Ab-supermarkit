import express from 'express';
import { checkBirthdays, expireDeals } from '../controllers/cronController.js';

const router = express.Router();

router.get('/birthdays', checkBirthdays);
router.get('/expire-deals', expireDeals);

export default router;
