import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendBirthdayAlert } from '../services/emailService.js';

// @desc    Find users whose birthday is today and email the store owner so they can
//          follow up with a birthday coupon. Intended to be hit once a day by a scheduler
//          (Vercel Cron in production, or manually/via a local cron in dev).
// @route   GET /api/cron/birthdays
// @access  Protected by CRON_SECRET (query param or header) when configured
export const checkBirthdays = asyncHandler(async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const provided = req.headers['x-cron-secret'] || req.query.secret;
    if (provided !== secret) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  }

  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const year = now.getFullYear();

  const users = await User.find({ dateOfBirth: { $exists: true, $ne: null } });
  const todaysBirthdays = users.filter((u) => {
    const dob = new Date(u.dateOfBirth);
    return dob.getMonth() === month && dob.getDate() === day && u.lastBirthdayNotifiedYear !== year;
  });

  if (todaysBirthdays.length > 0) {
    await sendBirthdayAlert(todaysBirthdays);
    await User.updateMany(
      { _id: { $in: todaysBirthdays.map((u) => u._id) } },
      { $set: { lastBirthdayNotifiedYear: year } }
    );
  }

  res.status(200).json({ success: true, notified: todaysBirthdays.length });
});
