import Coupon from '../models/Coupon.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    List coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, coupons });
});

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const data = { ...req.body, code: req.body.code?.toUpperCase() };
  const coupon = await Coupon.create(data);
  res.status(201).json({ success: true, coupon });
});

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.code) data.code = data.code.toUpperCase();

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  res.status(200).json({ success: true, coupon });
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
});

// @desc    Validate a coupon code against a cart subtotal
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || subtotal === undefined) {
    return res.status(400).json({ success: false, message: 'Coupon code and subtotal are required' });
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    return res.status(400).json({ success: false, message: 'This coupon is not yet active' });
  }
  if (coupon.expiryDate && now > coupon.expiryDate) {
    return res.status(400).json({ success: false, message: 'This coupon has expired' });
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
  }
  if (subtotal < coupon.minOrder) {
    return res
      .status(400)
      .json({ success: false, message: `Minimum order of $${coupon.minOrder.toFixed(2)} required for this coupon` });
  }

  let discount =
    coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  discount = Math.min(discount, subtotal);

  res.status(200).json({
    success: true,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    discount: Number(discount.toFixed(2)),
  });
});
