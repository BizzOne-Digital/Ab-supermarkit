import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';
import * as dealService from '../../services/dealService';
import * as productService from '../../services/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { product: '', salePrice: '', endDate: '', isActive: true };

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    dealService.getDeals().then((res) => setDeals(res.deals || [])).catch(() => setDeals([])).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    productService.getProducts({ limit: 100 }).then((res) => setProducts(res.products || [])).catch(() => setProducts([]));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dealService.createDeal(form);
      toast.success('Deal created');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to create deal');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this deal?')) return;
    try {
      await dealService.deleteDeal(id);
      toast.success('Deal deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete deal');
    }
  };

  const toggleActive = async (d) => {
    try {
      await dealService.updateDeal(d._id, { isActive: !d.isActive });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update deal');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Deals</h1>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add Deal</button>
      </div>
      {loading ? <LoadingSpinner full /> : deals.length === 0 ? (
        <EmptyState title="No deals yet" />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Regular Price</th>
                <th className="py-3 px-4">Sale Price</th>
                <th className="py-3 px-4">Ends</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d._id} className="border-b border-charcoal/5">
                  <td className="py-3 px-4">{d.product?.name || '—'}</td>
                  <td className="py-3 px-4 text-charcoal/50 line-through">
                    {d.product?.regularPrice ? `$${Number(d.product.regularPrice).toFixed(2)}` : '—'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gold-dark">${Number(d.salePrice).toFixed(2)}</td>
                  <td className="py-3 px-4">{new Date(d.endDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleActive(d)} className={`text-xs px-2 py-0.5 rounded ${d.isActive ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => onDelete(d._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4 inline" /></button>
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
              <h2 className="font-heading text-xl text-black">Add Deal</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Product</label>
                <select required value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3">
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                {form.product && (() => {
                  const selected = products.find((p) => p._id === form.product);
                  return selected ? (
                    <p className="text-xs text-charcoal/60 mt-1">
                      Regular price: <span className="font-semibold text-charcoal">${Number(selected.regularPrice).toFixed(2)}</span>
                    </p>
                  ) : null;
                })()}
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Sale Price</label>
                <input type="number" step="0.01" required value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                {(() => {
                  const selected = products.find((p) => p._id === form.product);
                  const sale = parseFloat(form.salePrice);
                  if (selected && Number.isFinite(sale) && sale > 0 && sale < selected.regularPrice) {
                    const pct = Math.round(((selected.regularPrice - sale) / selected.regularPrice) * 100);
                    return <p className="text-xs text-green-700 mt-1">{pct}% off regular price</p>;
                  }
                  return null;
                })()}
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">End Date</label>
                <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
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
