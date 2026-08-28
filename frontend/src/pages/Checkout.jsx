import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as orderService from '../services/orderService';
import * as settingsService from '../services/settingsService';
import EmptyState from '../components/EmptyState';

const TAX_RATE = 0.13;

export default function Checkout() {
  const { items, subtotal, discount, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState({ deliveryFee: 5, freeDeliveryThreshold: 100 });

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => {
        if (res.settings) {
          setDeliverySettings({
            deliveryFee: res.settings.deliveryFee ?? 5,
            freeDeliveryThreshold: res.settings.freeDeliveryThreshold ?? 100,
          });
        }
      })
      .catch(() => {});
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      deliveryMethod: 'pickup',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      orderNotes: '',
    },
  });

  const deliveryMethod = watch('deliveryMethod');

  if (items.length === 0) {
    return (
      <div className="container-app section-py">
        <EmptyState title="Your cart is empty" action={<Link to="/shop" className="btn-gold">Shop Now</Link>} />
      </div>
    );
  }

  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = taxableAmount * TAX_RATE;
  const freeDelivery = subtotal >= deliverySettings.freeDeliveryThreshold;
  const deliveryFee = deliveryMethod === 'delivery' && !freeDelivery ? deliverySettings.deliveryFee : 0;
  const total = taxableAmount + tax + deliveryFee;

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ product: i._id, name: i.name, qty: i.qty, price: i.price })),
        customerInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
        },
        deliveryMethod: data.deliveryMethod,
        orderNotes: data.orderNotes,
        subtotal,
        discount,
        tax,
        deliveryFee,
        total,
        couponCode: coupon?.code,
      };
      const res = await orderService.createOrder(payload);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-confirmation', { state: { order: res.order } });
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app section-py">
      <h1 className="font-heading text-3xl sm:text-4xl text-black mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="font-heading text-xl text-black mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Full Name</label>
                <input {...register('name', { required: 'Name is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Email</label>
                <input type="email" {...register('email', { required: 'Email is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-charcoal/70">Phone</label>
                <input {...register('phone', { required: 'Phone is required' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="font-heading text-xl text-black mb-4">Delivery Method</h2>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="pickup" {...register('deliveryMethod')} className="accent-gold" />
                <span>Pickup</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="delivery" {...register('deliveryMethod')} className="accent-gold" />
                <span>Delivery</span>
              </label>
            </div>
            {deliveryMethod === 'delivery' && !freeDelivery && (
              <p className="text-xs text-gold-dark mb-4">
                Spend ${(deliverySettings.freeDeliveryThreshold - subtotal).toFixed(2)} more to get free delivery!
              </p>
            )}
            {deliveryMethod === 'delivery' && freeDelivery && (
              <p className="text-xs text-green-700 mb-4">Your order qualifies for free delivery.</p>
            )}
            {deliveryMethod === 'delivery' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-charcoal/70">Address</label>
                  <input {...register('address', { required: deliveryMethod === 'delivery' })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">City</label>
                  <input {...register('city')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Province</label>
                  <input {...register('province')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Postal Code</label>
                  <input {...register('postalCode')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <label className="text-sm font-medium text-charcoal/70">Order Notes (optional)</label>
            <textarea {...register('orderNotes')} rows={3} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6 h-fit sticky top-28">
          <h2 className="font-heading text-xl text-black mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between">
                <span className="text-charcoal/70">{i.name} × {i.qty}</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-charcoal/10 pt-4">
            <div className="flex justify-between"><span className="text-charcoal/60">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span className="text-charcoal/60">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-charcoal/60">Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between font-heading text-lg text-black pt-2 border-t border-charcoal/10"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button type="submit" disabled={submitting} className="btn-gold w-full mt-6 disabled:opacity-60">
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
