import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';
import * as couponService from '../../services/couponService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { code: '', discountType: 'percentage', discountValue: '', minOrder: 0, maxDiscount: '', expiryDate: '', usageLimit: '', isActive: true };

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    couponService.getCoupons().then((res) => setCoupons(res.coupons || [])).catch(() => setCoupons([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await couponService.createCoupon(form);
      toast.success('Coupon created');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponService.deleteCoupon(id);
      toast.success('Coupon deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete coupon');
    }
  };

  const toggleActive = async (c) => {
    try {
      await couponService.updateCoupon(c._id, { isActive: !c.isActive });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update coupon');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Coupons</h1>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add Coupon</button>
      </div>
      {loading ? <LoadingSpinner full /> : coupons.length === 0 ? (
        <EmptyState title="No coupons yet" />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4">Used</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-charcoal/5">
                  <td className="py-3 px-4 font-semibold">{c.code}</td>
                  <td className="py-3 px-4">{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                  <td className="py-3 px-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleActive(c)} className={`text-xs px-2 py-0.5 rounded ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => onDelete(c._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">Add Coupon</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Code</label>
                <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Value</label>
                  <input type="number" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Min Order</label>
                  <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Max Discount</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Expiry Date</label>
                  <input type="date" required value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
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
