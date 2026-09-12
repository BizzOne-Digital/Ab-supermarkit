import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Pencil } from 'lucide-react';
import * as heroSlideService from '../../services/heroSlideService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { heading: '', subheading: '', ctaLabel: '', ctaLink: '', sortOrder: 0, isEnabled: true };

export default function Slides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    heroSlideService
      .getHeroSlides({ all: 'true' })
      .then((res) => setSlides(res.slides || []))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      heading: s.heading || '',
      subheading: s.subheading || '',
      ctaLabel: s.ctaLabel || '',
      ctaLink: s.ctaLink || '',
      sortOrder: s.sortOrder ?? 0,
      isEnabled: s.isEnabled,
    });
    setFile(null);
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);

      if (editing) {
        await heroSlideService.updateHeroSlide(editing._id, fd);
        toast.success('Slide updated');
      } else {
        if (!file) {
          toast.error('Please choose an image');
          setSaving(false);
          return;
        }
        await heroSlideService.createHeroSlide(fd);
        toast.success('Slide created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await heroSlideService.deleteHeroSlide(id);
      toast.success('Slide deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete slide');
    }
  };

  const toggleEnabled = async (s) => {
    try {
      const fd = new FormData();
      fd.append('isEnabled', !s.isEnabled);
      await heroSlideService.updateHeroSlide(s._id, fd);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update slide');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Homepage Slides</h1>
        <button onClick={openCreate} className="btn-gold text-sm py-2 px-4">
          <Plus className="h-4 w-4" /> Add Slide
        </button>
      </div>
      <p className="text-sm text-charcoal/50 mb-6">These images rotate in the homepage hero, replacing the old video.</p>

      {loading ? (
        <LoadingSpinner full />
      ) : slides.length === 0 ? (
        <EmptyState title="No slides yet" message="Add at least one slide for the homepage hero." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slides
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((s) => (
              <div key={s._id} className="bg-white rounded-lg shadow-card overflow-hidden">
                <div className="aspect-video bg-creme">
                  {s.image?.url && <img src={s.image.url} alt={s.heading} className="h-full w-full object-cover" />}
                </div>
                <div className="p-4">
                  <p className="font-heading text-black">{s.heading || <span className="text-charcoal/40">No heading</span>}</p>
                  {s.subheading && <p className="text-sm text-charcoal/60">{s.subheading}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => toggleEnabled(s)}
                      className={`text-xs px-2 py-0.5 rounded ${s.isEnabled ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}
                    >
                      {s.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(s)} className="text-charcoal/50 hover:text-gold-dark"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(s._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
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
              <h2 className="font-heading text-xl text-black">{editing ? 'Edit Slide' : 'Add Slide'}</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Image {editing ? '(leave blank to keep current)' : ''}</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full mt-1 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Heading</label>
                <input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Subheading</label>
                <input value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Button Label</label>
                  <input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Button Link</label>
                  <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="/shop" className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
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
