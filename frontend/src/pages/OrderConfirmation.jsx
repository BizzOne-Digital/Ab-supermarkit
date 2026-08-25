import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="container-app section-py text-center max-w-lg mx-auto">
      <CheckCircle2 className="h-16 w-16 text-gold mx-auto mb-6" />
      <h1 className="font-heading text-3xl sm:text-4xl text-black mb-3">Thank You!</h1>
      <p className="text-charcoal/70 mb-6">
        {order
          ? `Your order ${order.orderNumber} has been placed successfully. We'll notify you once it's confirmed.`
          : "Your order has been placed successfully. We'll notify you once it's confirmed."}
      </p>
      {order && (
        <div className="bg-white rounded-lg shadow-card p-6 text-left mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-charcoal/60">Order Number</span>
            <span className="font-semibold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/60">Total</span>
            <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      )}
      <Link to="/shop" className="btn-gold">Continue Shopping</Link>
    </div>
  );
}
