import axios from 'axios';

const isCloverPaymentConfigured = () => !!process.env.CLOVER_ECOMMERCE_PRIVATE_KEY;

const getPaymentClient = () => {
  const base = process.env.CLOVER_ECOMMERCE_API_URL || 'https://scl.clover.com';
  return axios.create({
    baseURL: base,
    headers: {
      Authorization: `Bearer ${process.env.CLOVER_ECOMMERCE_PRIVATE_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
};

/**
 * Charges a Clover card source token (created client-side via Clover.js) for the given amount.
 * amount must be in cents. Never throws - caller decides how to handle a failed/unconfigured charge.
 */
export const chargeCloverCard = async ({ source, amount, currency = 'usd', orderNumber }) => {
  if (!isCloverPaymentConfigured()) {
    return { success: false, configured: false, message: 'Clover payment is not configured' };
  }
  if (!source) {
    return { success: false, configured: true, message: 'Missing card payment token' };
  }

  try {
    const client = getPaymentClient();
    const { data } = await client.post('/v1/charges', {
      source,
      amount: Math.round(amount),
      currency,
      description: orderNumber ? `Order ${orderNumber}` : undefined,
    });
    return { success: true, configured: true, chargeId: data.id, raw: data };
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error('[cloverPaymentService] chargeCloverCard failed:', message);
    return { success: false, configured: true, message };
  }
};

export default { chargeCloverCard };
