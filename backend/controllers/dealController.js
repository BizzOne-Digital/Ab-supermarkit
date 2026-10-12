import Deal from '../models/Deal.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// A deal is only a schedule of a sale price for a product — the product's own
// salePrice/isOnSale (what the cart, product page, and ProductCard actually read)
// must be kept in sync with it, otherwise the deal has no real effect on the site.
const isDealCurrentlyActive = (deal) => {
  const now = new Date();
  return deal.isActive && new Date(deal.startDate) <= now && new Date(deal.endDate) >= now;
};

const syncProductWithDeal = async (deal) => {
  if (!deal) return;
  const product = await Product.findById(deal.product);
  if (!product) return;
  if (isDealCurrentlyActive(deal)) {
    product.salePrice = deal.salePrice;
  } else {
    product.salePrice = undefined;
  }
  await product.save();
};

const clearProductSalePrice = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return;
  product.salePrice = undefined;
  await product.save();
};

export const getDeals = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true, endDate: { $gte: new Date() } };
  const deals = await Deal.find(filter).populate('product').sort({ createdAt: -1 });
  res.status(200).json({ success: true, deals });
});

export const createDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.create(req.body);
  await syncProductWithDeal(deal);
  res.status(201).json({ success: true, deal });
});

export const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  await syncProductWithDeal(deal);
  res.status(200).json({ success: true, deal });
});

export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findByIdAndDelete(req.params.id);
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  await clearProductSalePrice(deal.product);
  res.status(200).json({ success: true, message: 'Deal deleted successfully' });
});
