import asyncHandler from '../utils/asyncHandler.js';
import { fetchCloverInventory, syncProductToClover } from '../services/cloverService.js';
import Product from '../models/Product.js';

// @desc    Check whether Clover integration is configured/reachable
// @route   GET /api/clover/sync-status
// @access  Private/Admin
export const getSyncStatus = asyncHandler(async (req, res) => {
  const configured = !!(process.env.CLOVER_ACCESS_TOKEN && process.env.CLOVER_MERCHANT_ID);
  res.status(200).json({
    success: true,
    configured,
    message: configured
      ? 'Clover integration is configured.'
      : 'Clover integration is not configured. Set CLOVER_MERCHANT_ID and CLOVER_ACCESS_TOKEN to enable it.',
  });
});

// @desc    Trigger a sync of all active products to Clover (or inventory pull)
// @route   POST /api/clover/sync
// @access  Private/Admin
export const triggerSync = asyncHandler(async (req, res) => {
  const configured = !!(process.env.CLOVER_ACCESS_TOKEN && process.env.CLOVER_MERCHANT_ID);
  if (!configured) {
    // Always respond gracefully, even when Clover isn't configured.
    return res.status(200).json({
      success: false,
      configured: false,
      message: 'Clover is not configured - nothing was synced.',
    });
  }

  const products = await Product.find({ status: 'active' });
  const results = await Promise.all(products.map((p) => syncProductToClover(p)));
  const failures = results.filter((r) => !r.success).length;

  res.status(200).json({
    success: true,
    configured: true,
    synced: results.length - failures,
    failed: failures,
  });
});

// @desc    Manually fetch current Clover inventory (for diagnostics)
// @route   GET /api/clover/inventory
// @access  Private/Admin
export const getCloverInventory = asyncHandler(async (req, res) => {
  const result = await fetchCloverInventory();
  res.status(200).json(result);
});
