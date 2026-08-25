import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import * as orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Account() {
  const { user, updateUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: user?.name || '', phone: user?.phone || '' } });

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  return (
    <div className="container-app section-py">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-black">My Account</h1>
        <button onClick={logout} className="flex items-center gap-2 text-charcoal/60 hover:text-red-600 text-sm">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="font-heading text-xl text-black mb-4">Profile</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-charcoal/70">Full Name</label>
              <input {...register('name')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal/70">Email</label>
              <input value={user?.email || ''} disabled className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 bg-creme/50 text-charcoal/60" />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal/70">Phone</label>
              <input {...register('phone')} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-gold disabled:opacity-60">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-heading text-xl text-black mb-4">Order History</h2>
          {loadingOrders ? (
            <LoadingSpinner full />
          ) : orders.length === 0 ? (
            <EmptyState icon={Package} title="No orders yet" message="Your past orders will appear here." />
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o._id} className="bg-white rounded-lg shadow-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-black">{o.orderNumber}</p>
                    <p className="text-xs text-charcoal/50">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">${Number(o.total).toFixed(2)}</p>
                    <span className="text-xs px-2 py-0.5 rounded bg-creme text-gold-dark font-medium">{o.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
