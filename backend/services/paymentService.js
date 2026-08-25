/**
 * paymentService
 * ----------------
 * This is a MOCK/STUB payment gateway implementation. It exposes the exact
 * shape (createPaymentIntent / confirmPayment) that a real gateway
 * integration (Stripe, Square, etc.) would provide, so controllers can call
 * this interface today and be repointed at a real SDK later without any
 * changes to their call sites - only the internals of these two functions
 * need to change.
 *
 * To go live: swap the bodies below for e.g. `stripe.paymentIntents.create()`
 * / `stripe.paymentIntents.confirm()` using PAYMENT_SECRET_KEY from env.
 */

const generateFakeId = (prefix) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

/**
 * @param {{amount: number, currency?: string, metadata?: object}} params
 * @returns {Promise<{success: boolean, id: string, status: string, amount: number, currency: string, clientSecret: string}>}
 */
export const createPaymentIntent = async ({ amount, currency = 'cad', metadata = {} }) => {
  // Mock: pretend a payment intent was created successfully.
  const id = generateFakeId('pi');
  return {
    success: true,
    id,
    status: 'requires_confirmation',
    amount,
    currency,
    metadata,
    clientSecret: `${id}_secret_${Math.random().toString(36).slice(2, 10)}`,
  };
};

/**
 * @param {string} paymentIntentId
 * @returns {Promise<{success: boolean, id: string, status: string}>}
 */
export const confirmPayment = async (paymentIntentId) => {
  // Mock: pretend confirmation always succeeds.
  return {
    success: true,
    id: paymentIntentId || generateFakeId('pi'),
    status: 'succeeded',
  };
};

export default { createPaymentIntent, confirmPayment };
