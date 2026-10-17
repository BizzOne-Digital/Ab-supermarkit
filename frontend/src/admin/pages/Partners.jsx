import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Pencil } from 'lucide-react';
import * as partnerService from '../../services/partnerService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import resolveImageUrl from '../../utils/resolveImageUrl';

const emptyForm = { name: '', tagline: '', menuLink: '', menuComingSoon: false, isEnabled: true, sortOrder: 0 };

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    partnerService.getPartners({ all: 'true' }).then((res) => setPartners(res.partners || [])).catch(() => setPartners([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, tagline: p.tagline || '', menuLink: p.menuLink || '', menuComingSoon: !!p.menuComingSoon, isEnabled: p.isEnabled, sortOrder: p.sortOrder ?? 0 });
    setFile(null);
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('logo', file);
      if (editing) {
        await partnerService.updatePartner(editing._id, fd);
        toast.success('Partner updated');
      } else {
        await partnerService.createPartner(fd);
        toast.success('Partner added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save partner');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    try {
      await partnerService.deletePartner(id);
      toast.success('Partner deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete partner');
    }
  };

  const toggleEnabled = async (p) => {
    try {
      const fd = new FormData();
      fd.append('isEnabled', !p.isEnabled);
      await partnerService.updatePartner(p._id, fd);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update partner');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Collaborations / Partners</h1>
        <button onClick={openCreate} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add Partner</button>
      </div>
      <p className="text-sm text-charcoal/50 mb-6">Shown as a "In collaboration with..." banner on the homepage, with a button linking to their menu.</p>

      {loading ? (
        <LoadingSpinner full />
      ) : partners.length === 0 ? (
        <EmptyState title="No partners yet" message="Add a collaboration to show it on the homepage." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="aspect-video bg-creme flex items-center justify-center p-4">
                {p.logo?.url ? (
                  <img src={resolveImageUrl(p.logo.url)} alt={p.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-charcoal/30 text-sm">No logo</span>
                )}
              </div>
              <div className="p-4">
                <p className="font-heading text-black">{p.name}</p>
                {p.tagline && <p className="text-sm text-charcoal/60">{p.tagline}</p>}
                {p.menuLink && <p className="text-xs text-gold-dark truncate mt-1">{p.menuLink}</p>}
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => toggleEnabled(p)}
                    className={`text-xs px-2 py-0.5 rounded ${p.isEnabled ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}
                  >
                    {p.isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(p)} className="text-charcoal/50 hover:text-gold-dark"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(p._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-md w-full my-8">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">{editing ? 'Edit Partner' : 'Add Partner'}</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" placeholder="Hoga Meat Bar & Grill" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Tagline (optional)</label>
                <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" placeholder="Fresh, quality meats now available in-store" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Menu Link</label>
                <input type="url" value={form.menuLink} onChange={(e) => setForm({ ...form, menuLink: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" placeholder="https://..." />
                <p className="text-xs text-charcoal/40 mt-1">Opens in a new tab when the "View Menu" button is clicked.</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.menuComingSoon} onChange={(e) => setForm({ ...form, menuComingSoon: e.target.checked })} className="accent-gold" />
                Menu Coming Soon (button shows "Coming Soon" instead of opening the link)
              </label>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Logo {editing ? '(leave blank to keep current)' : ''}</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full mt-1 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isEnabled} onChange={(e) => setForm({ ...form, isEnabled: e.target.checked })} className="accent-gold" /> Enabled
              </label>
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
