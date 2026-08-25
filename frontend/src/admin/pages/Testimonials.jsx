import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Star } from 'lucide-react';
import * as testimonialService from '../../services/testimonialService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { customerName: '', rating: 5, review: '', isEnabled: true };

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    testimonialService.getTestimonials().then((res) => setTestimonials(res.testimonials || [])).catch(() => setTestimonials([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await testimonialService.createTestimonial(form);
      toast.success('Testimonial added');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to add testimonial');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await testimonialService.deleteTestimonial(id);
      toast.success('Testimonial deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete testimonial');
    }
  };

  const toggleEnabled = async (t) => {
    try {
      await testimonialService.updateTestimonial(t._id, { isEnabled: !t.isEnabled });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update testimonial');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Testimonials</h1>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add Testimonial</button>
      </div>
      {loading ? <LoadingSpinner full /> : testimonials.length === 0 ? (
        <EmptyState title="No testimonials yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-gold text-gold' : 'text-charcoal/20'}`} />
                ))}
              </div>
              <p className="text-sm text-charcoal/70 mb-2 line-clamp-3">{t.review}</p>
              <p className="font-heading text-black text-sm mb-3">{t.customerName}</p>
              <div className="flex items-center justify-between">
                <button onClick={() => toggleEnabled(t)} className={`text-xs px-2 py-0.5 rounded ${t.isEnabled ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}>
                  {t.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
                <button onClick={() => onDelete(t._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">Add Testimonial</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Customer Name</label>
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Review</label>
                <textarea required rows={3} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
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
