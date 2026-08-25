import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import * as categoryService from '../../services/categoryService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { name: '', description: '', isEnabled: true, sortOrder: 0 };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    categoryService.getCategories().then((res) => setCategories(res.categories || [])).catch(() => setCategories([])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '', isEnabled: c.isEnabled, sortOrder: c.sortOrder || 0 }); setFile(null); setModalOpen(true); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      if (editing) {
        await categoryService.updateCategory(editing._id, fd);
        toast.success('Category updated');
      } else {
        await categoryService.createCategory(fd);
        toast.success('Category created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Categories</h1>
        <button onClick={openCreate} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add Category</button>
      </div>

      {loading ? <LoadingSpinner full /> : categories.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="aspect-video bg-creme">
                {c.image?.url && <img src={c.image.url} alt={c.name} className="h-full w-full object-cover" />}
              </div>
              <div className="p-3">
                <p className="font-heading text-black">{c.name}</p>
                <p className="text-xs text-charcoal/50 mb-2">{c.isEnabled ? 'Enabled' : 'Disabled'}</p>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(c)} className="text-charcoal/50 hover:text-gold-dark"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => onDelete(c._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isEnabled} onChange={(e) => setForm({ ...form, isEnabled: e.target.checked })} className="accent-gold" /> Enabled
              </label>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full mt-1 text-sm" />
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
