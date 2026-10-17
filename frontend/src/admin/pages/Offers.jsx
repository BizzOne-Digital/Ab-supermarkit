import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';
import * as offerService from '../../services/offerService';
import * as productService from '../../services/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import resolveImageUrl from '../../utils/resolveImageUrl';

const emptyForm = { heading: '', discountText: '', expiryDate: '', isEnabled: true, products: [] };

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    offerService.getOffers().then((res) => setOffers(res.offers || [])).catch(() => setOffers([])).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    productService.getProducts({ limit: 200 }).then((res) => setProducts(res.products || [])).catch(() => setProducts([]));
  }, []);

  const toggleProduct = (id) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(id) ? f.products.filter((p) => p !== id) : [...f.products, id],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'products') fd.append('products', JSON.stringify(v));
        else fd.append(k, v);
      });
      if (file) fd.append('image', file);
      await offerService.createOffer(fd);
      toast.success('Offer created');
      setModalOpen(false);
      setForm(emptyForm);
      setFile(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to create offer');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await offerService.deleteOffer(id);
      toast.success('Offer deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete offer');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Offers</h1>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add Offer</button>
      </div>
      {loading ? <LoadingSpinner full /> : offers.length === 0 ? (
        <EmptyState title="No offers yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((o) => (
            <div key={o._id} className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="aspect-video bg-creme">
                {o.image?.url && (
                  o.image.mimeType?.startsWith('video/') ? (
                    <video src={resolveImageUrl(o.image.url)} className="h-full w-full object-cover" autoPlay loop muted playsInline />
                  ) : (
                    <img src={resolveImageUrl(o.image.url)} alt={o.heading} className="h-full w-full object-cover" />
                  )
                )}
              </div>
              <div className="p-4">
                <p className="font-heading text-black">{o.heading}</p>
                <p className="text-sm text-gold-dark">{o.discountText}</p>
                <p className="text-xs text-charcoal/50 mt-1">Expires {new Date(o.expiryDate).toLocaleDateString()}</p>
                <p className="text-xs text-charcoal/50 mt-1">{o.products?.length || 0} product{o.products?.length === 1 ? '' : 's'} linked</p>
                <button onClick={() => onDelete(o._id)} className="text-charcoal/50 hover:text-red-600 mt-2"><Trash2 className="h-4 w-4 inline" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">Add Offer</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Heading</label>
                <input required value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Discount Text</label>
                <input value={form.discountText} onChange={(e) => setForm({ ...form, discountText: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Expiry Date</label>
                <input type="date" required value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Image or Short Video</label>
                <input type="file" accept="image/*,video/mp4,video/webm" onChange={(e) => setFile(e.target.files[0])} className="w-full mt-1 text-sm" />
                <p className="text-xs text-charcoal/40 mt-1">Videos up to 15MB (mp4 or webm).</p>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Products in this offer</label>
                <p className="text-xs text-charcoal/40 mb-1">Customers land on these when they open the offer.</p>
                <div className="border border-charcoal/20 rounded-md max-h-48 overflow-y-auto divide-y divide-charcoal/10">
                  {products.map((p) => (
                    <label key={p._id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-creme">
                      <input
                        type="checkbox"
                        checked={form.products.includes(p._id)}
                        onChange={() => toggleProduct(p._id)}
                        className="accent-gold"
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
                {form.products.length > 0 && (
                  <p className="text-xs text-gold-dark mt-1">{form.products.length} product{form.products.length === 1 ? '' : 's'} selected</p>
                )}
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
