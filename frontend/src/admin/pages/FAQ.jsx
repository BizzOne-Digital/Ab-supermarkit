import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';
import * as faqService from '../../services/faqService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { question: '', answer: '', sortOrder: 0, isEnabled: true };

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    faqService.getFaqs().then((res) => setFaqs(res.faqs || [])).catch(() => setFaqs([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await faqService.createFaq(form);
      toast.success('FAQ added');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to add FAQ');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await faqService.deleteFaq(id);
      toast.success('FAQ deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete FAQ');
    }
  };

  const toggleEnabled = async (f) => {
    try {
      await faqService.updateFaq(f._id, { isEnabled: !f.isEnabled });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update FAQ');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">FAQs</h1>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add FAQ</button>
      </div>
      {loading ? <LoadingSpinner full /> : faqs.length === 0 ? (
        <EmptyState title="No FAQs yet" />
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f._id} className="bg-white rounded-lg shadow-card p-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-black">{f.question}</p>
                <p className="text-sm text-charcoal/60 mt-1">{f.answer}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => toggleEnabled(f)} className={`text-xs px-2 py-0.5 rounded ${f.isEnabled ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}>
                  {f.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
                <button onClick={() => onDelete(f._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">Add FAQ</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Question</label>
                <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Answer</label>
                <textarea required rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
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
