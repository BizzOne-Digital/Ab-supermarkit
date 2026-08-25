import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, coupon, discount, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const onApplyCoupon = async (e) => {
    e.preventDefault();
    if (!code) return;
    setApplying(true);
    try {
      await applyCoupon(code);
      setCode('');
    } catch (err) {
      toast.error(err.message || 'Invalid coupon');
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-app section-py">
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added anything yet."
          action={
            <Link to="/shop" className="btn-gold">
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  const total = Math.max(subtotal - discount, 0);

  return (
    <div className="container-app section-py">
      <h1 className="font-heading text-3xl sm:text-4xl text-black mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 bg-white rounded-lg shadow-card p-4">
              <div className="h-20 w-20 bg-creme rounded-md overflow-hidden shrink-0">
                {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/shop/${item.slug}`} className="font-heading text-black hover:text-gold-dark line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-charcoal/60">${item.price.toFixed(2)} each</p>
              </div>
              <QuantitySelector value={item.qty} onChange={(v) => updateQty(item._id, v)} />
              <p className="w-20 text-right font-semibold hidden sm:block">${(item.price * item.qty).toFixed(2)}</p>
              <button
                onClick={() => removeItem(item._id)}
                className="text-charcoal/40 hover:text-red-600 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-card p-6 h-fit sticky top-28">
          <h2 className="font-heading text-xl text-black mb-4">Order Summary</h2>
          {coupon ? (
            <div className="flex items-center justify-between text-sm mb-3 bg-creme rounded-md px-3 py-2">
              <span className="font-semibold text-gold-dark">{coupon.code}</span>
              <button onClick={removeCoupon} className="text-charcoal/50 hover:text-red-600">Remove</button>
            </div>
          ) : (
            <form onSubmit={onApplyCoupon} className="flex gap-2 mb-4">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 border border-charcoal/20 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gold"
              />
              <button type="submit" disabled={applying} className="btn-outline px-4 py-2 text-sm">Apply</button>
            </form>
          )}
          <div className="space-y-2 text-sm border-t border-charcoal/10 pt-4">
            <div className="flex justify-between">
              <span className="text-charcoal/60">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-heading text-lg text-black pt-2 border-t border-charcoal/10">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-gold w-full mt-6">
            Checkout <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
