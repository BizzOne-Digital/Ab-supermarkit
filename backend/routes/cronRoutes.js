import express from 'express';
import { checkBirthdays } from '../controllers/cronController.js';

const router = express.Router();

router.get('/birthdays', checkBirthdays);

export default router;
