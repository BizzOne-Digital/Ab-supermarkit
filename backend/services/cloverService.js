import axios from 'axios';

const isCloverConfigured = () =>
  !!(process.env.CLOVER_ACCESS_TOKEN && process.env.CLOVER_MERCHANT_ID);

const getCloverClient = () => {
  return axios.create({
    baseURL: process.env.CLOVER_API_URL || 'https://api.clover.com',
    headers: {
      Authorization: `Bearer ${process.env.CLOVER_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
};

/**
 * Fetches the full inventory list from Clover. No-ops gracefully if Clover
 * credentials are not configured.
 */
export const fetchCloverInventory = async () => {
  if (!isCloverConfigured()) {
    console.warn('[cloverService] Clover credentials not configured - skipping inventory fetch.');
    return { success: false, configured: false, items: [] };
  }

  try {
    const client = getCloverClient();
    const { data } = await client.get(`/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/items`);
    return { success: true, configured: true, items: data.elements || [] };
  } catch (error) {
    console.error('[cloverService] fetchCloverInventory failed:', error.message);
    return { success: false, configured: true, items: [], error: error.message };
  }
};

/**
 * Pushes/updates a single product's inventory data to Clover. No-ops
 * gracefully if not configured.
 */
export const syncProductToClover = async (product) => {
  if (!isCloverConfigured()) {
    console.warn('[cloverService] Clover credentials not configured - skipping product sync.');
    return { success: false, configured: false };
  }

  try {
    const client = getCloverClient();
    const payload = {
      name: product.name,
      price: Math.round((product.salePrice || product.regularPrice) * 100),
      sku: product.sku,
      stockCount: product.stockQuantity,
    };

    if (product.cloverItemId) {
      await client.post(
        `/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/items/${product.cloverItemId}`,
        payload
      );
    } else {
      const { data } = await client.post(
        `/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/items`,
        payload
      );
      return { success: true, configured: true, cloverItemId: data.id };
    }

    return { success: true, configured: true };
  } catch (error) {
    console.error('[cloverService] syncProductToClover failed:', error.message);
    return { success: false, configured: true, error: error.message };
  }
};

/**
 * Deducts stock in Clover for items in a just-placed order. Never throws -
 * order creation must succeed regardless of Clover availability.
 */
export const deductCloverInventory = async (orderItems) => {
  if (!isCloverConfigured()) {
    console.warn('[cloverService] Clover credentials not configured - skipping inventory deduction.');
    return { success: false, configured: false };
  }

  try {
    const client = getCloverClient();
    await Promise.all(
      (orderItems || []).map((item) => {
        if (!item.cloverItemId) return Promise.resolve();
        return client
          .post(`/v3/merchants/${process.env.CLOVER_MERCHANT_ID}/items/${item.cloverItemId}/adjust`, {
            quantity: -Math.abs(item.qty),
          })
          .catch((err) => {
            console.error(`[cloverService] Failed to deduct inventory for item ${item.cloverItemId}:`, err.message);
          });
      })
    );
    return { success: true, configured: true };
  } catch (error) {
    console.error('[cloverService] deductCloverInventory failed:', error.message);
    return { success: false, configured: true, error: error.message };
  }
};

export default { fetchCloverInventory, syncProductToClover, deductCloverInventory };
