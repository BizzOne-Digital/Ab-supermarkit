import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import SiteSettings from '../models/SiteSettings.js';
import asyncHandler from '../utils/asyncHandler.js';
import { paginate } from '../utils/apiFeatures.js';
import { deductCloverInventory } from '../services/cloverService.js';
import { sendOrderConfirmation, sendAdminOrderNotification, sendOrderStatusUpdate } from '../services/emailService.js';

const TAX_RATE = 0.13; // default rate (adjust per province as needed)

// @desc    Create a new order (guest or logged-in)
// @route   POST /api/orders
// @access  Public
export const createOrder = asyncHandler(async (req, res) => {
  const { items, customerInfo, deliveryMethod, orderNotes, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
  }

  // Re-fetch products server-side to validate price/stock rather than trusting the client.
  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productMap.get(item.product);
    if (!product) {
      return res.status(400).json({ success: false, message: `Product ${item.product} not found` });
    }
    if (product.stockQuantity < item.qty) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
    }
    const price = product.isOnSale && product.salePrice ? product.salePrice : product.regularPrice;
    subtotal += price * item.qty;
    orderItems.push({ product: product._id, name: product.name, qty: item.qty, price });
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      const now = new Date();
      const validDates = (!coupon.startDate || now >= coupon.startDate) && (!coupon.expiryDate || now <= coupon.expiryDate);
      const withinLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;
      if (validDates && withinLimit && subtotal >= coupon.minOrder) {
        discount = coupon.discountType === 'percentage' ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        discount = Math.min(discount, subtotal);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  // Delivery fee is always computed server-side from admin-configured settings — never trust a client-supplied value.
  let deliveryFee = 0;
  if (deliveryMethod !== 'pickup') {
    const settings = await SiteSettings.getSettings();
    deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  }

  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = Number((taxableAmount * TAX_RATE).toFixed(2));
  const total = Number((taxableAmount + tax + deliveryFee).toFixed(2));

  const order = await Order.create({
    user: req.user ? req.user._id : null,
    items: orderItems,
    customerInfo,
    deliveryMethod,
    orderNotes,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    tax,
    deliveryFee,
    total,
    couponCode: couponCode ? couponCode.toUpperCase() : undefined,
  });

  // Decrement stock.
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.qty } })
    )
  );

  // Non-fatal integrations: never block order response on these.
  deductCloverInventory(
    orderItems.map((i) => ({ ...i, cloverItemId: productMap.get(i.product.toString())?.cloverItemId }))
  ).catch((err) => console.error('Clover deduction error:', err.message));

  sendOrderConfirmation(order).catch((err) => console.error('Order confirmation email error:', err.message));
  sendAdminOrderNotification(order).catch((err) => console.error('Admin notification email error:', err.message));

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's own orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

// @desc    List all orders (admin) with pagination/filter
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 20, 1);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.orderStatus) query.orderStatus = req.query.orderStatus;
  if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;
  if (req.query.search) {
    query.$or = [
      { orderNumber: { $regex: req.query.search, $options: 'i' } },
      { 'customerInfo.email': { $regex: req.query.search, $options: 'i' } },
      { 'customerInfo.name': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(query),
  ]);

  res.status(200).json({ success: true, orders, pagination: paginate(total, page, limit) });
});

// @desc    Get single order by id
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isOwner = order.user && req.user && order.user.toString() === req.user._id.toString();
  const isAdmin = req.user && req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.status(200).json({ success: true, order });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();

  if (orderStatus) {
    sendOrderStatusUpdate(order).catch((err) => console.error('Order status email error:', err.message));
  }

  res.status(200).json({ success: true, order });
});
