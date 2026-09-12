import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import * as authService from '../../services/authService';
import * as orderService from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { name: '', email: '', phone: '', password: '' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [orderStats, setOrderStats] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      authService.getCustomers().catch(() => ({ customers: [] })),
      orderService.getOrders({ limit: 200 }).catch(() => ({ orders: [] })),
    ]).then(([custRes, orderRes]) => {
      setCustomers(custRes.customers || []);
      const map = new Map();
      (orderRes.orders || []).forEach((o) => {
        const key = o.customerInfo?.email;
        if (!key) return;
        const existing = map.get(key) || { orderCount: 0, totalSpent: 0 };
        existing.orderCount += 1;
        existing.totalSpent += Number(o.total) || 0;
        map.set(key, existing);
      });
      setOrderStats(map);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.adminCreateCustomer(form);
      toast.success('Customer created');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to create customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Customers</h1>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-sm py-2 px-4">
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>
      <p className="text-sm text-charcoal/50 mb-6">Registered customer accounts, with order activity where available.</p>

      {loading ? (
        <LoadingSpinner full />
      ) : customers.length === 0 ? (
        <EmptyState title="No customers yet" message="Add a customer manually, or wait for signups." />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const stats = orderStats.get(c.email) || { orderCount: 0, totalSpent: 0 };
                return (
                  <tr key={c._id} className="border-b border-charcoal/5">
                    <td className="py-3 px-4">{c.name}</td>
                    <td className="py-3 px-4">{c.email}</td>
                    <td className="py-3 px-4">{c.phone || '—'}</td>
                    <td className="py-3 px-4">{stats.orderCount}</td>
                    <td className="py-3 px-4">${stats.totalSpent.toFixed(2)}</td>
                    <td className="py-3 px-4 text-xs text-charcoal/50">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">Add Customer</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Full Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Temporary Password</label>
                <input type="text" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                <p className="text-xs text-charcoal/40 mt-1">Share this with the customer — they can change it after logging in.</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold text-sm py-2 px-4 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
