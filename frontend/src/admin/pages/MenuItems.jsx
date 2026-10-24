import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Pencil } from 'lucide-react';
import * as menuItemService from '../../services/menuItemService';
import * as partnerService from '../../services/partnerService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import resolveImageUrl from '../../utils/resolveImageUrl';

const emptyForm = { partner: '', category: '', name: '', price: '', unit: '', isEnabled: true, sortOrder: 0 };

export default function MenuItems() {
  const [partners, setPartners] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    menuItemService.getMenuItems({ all: 'true' }).then((res) => setItems(res.menuItems || [])).catch(() => setItems([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    partnerService.getPartners({ all: 'true' }).then((res) => setPartners(res.partners || [])).catch(() => setPartners([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, partner: partners[0]?._id || '' });
    setFile(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      partner: item.partner,
      category: item.category,
      name: item.name,
      price: item.price,
      unit: item.unit || '',
      isEnabled: item.isEnabled,
      sortOrder: item.sortOrder ?? 0,
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
        await menuItemService.updateMenuItem(editing._id, fd);
        toast.success('Menu item updated');
      } else {
        await menuItemService.createMenuItem(fd);
        toast.success('Menu item added');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await menuItemService.deleteMenuItem(id);
      toast.success('Menu item deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete menu item');
    }
  };

  const toggleEnabled = async (item) => {
    try {
      const fd = new FormData();
      fd.append('isEnabled', !item.isEnabled);
      await menuItemService.updateMenuItem(item._id, fd);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update menu item');
    }
  };

  const partnerName = (id) => partners.find((p) => p._id === id)?.name || 'Unknown Partner';

  const grouped = items.reduce((acc, item) => {
    const key = `${item.partner}|${item.category}`;
    (acc[key] = acc[key] || []).push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Partner Menu Items</h1>
        <button onClick={openCreate} disabled={partners.length === 0} className="btn-gold text-sm py-2 px-4 disabled:opacity-50">
          <Plus className="h-4 w-4" /> Add Menu Item
        </button>
      </div>
      <p className="text-sm text-charcoal/50 mb-6">
        Shown on the public menu page for a collaboration (e.g. Moga Meat), linked from the homepage partner banner's "View Menu" button.
      </p>
      {partners.length === 0 && (
        <p className="text-sm text-red-600 mb-4">Add a partner under Collaborations first before adding menu items.</p>
      )}

      {loading ? (
        <LoadingSpinner full />
      ) : items.length === 0 ? (
        <EmptyState title="No menu items yet" message="Add items to build out a partner's menu." />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([key, groupItems]) => {
            const [partnerId, category] = key.split('|');
            return (
              <div key={key}>
                <h2 className="font-heading text-lg text-black mb-1">{category}</h2>
                <p className="text-xs text-charcoal/40 mb-3">{partnerName(partnerId)}</p>
                <div className="bg-white rounded-lg shadow-card overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {groupItems.map((item) => (
                        <tr key={item._id} className="border-b border-charcoal/5 last:border-0">
                          <td className="py-3 px-4 w-14">
                            <div className="h-10 w-10 rounded bg-creme overflow-hidden">
                              {item.image?.url && <img src={resolveImageUrl(item.image.url)} alt="" className="h-full w-full object-cover" />}
                            </div>
                          </td>
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4 text-charcoal/60">${Number(item.price).toFixed(2)}{item.unit ? ` ${item.unit}` : ''}</td>
                          <td className="py-3 px-4">
                            <button onClick={() => toggleEnabled(item)} className={`text-xs px-2 py-0.5 rounded ${item.isEnabled ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}>
                              {item.isEnabled ? 'Enabled' : 'Disabled'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button onClick={() => openEdit(item)} className="text-charcoal/50 hover:text-gold-dark mr-3"><Pencil className="h-4 w-4 inline" /></button>
                            <button onClick={() => onDelete(item._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4 inline" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
              <h2 className="font-heading text-xl text-black">{editing ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Partner</label>
                <select required value={form.partner} onChange={(e) => setForm({ ...form, partner: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3">
                  <option value="">Select partner</option>
                  {partners.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Category</label>
                <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" placeholder="e.g. Chicken Tandoori" />
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Item Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Price ($)</label>
                  <input type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Unit (optional)</label>
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="per pc" className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">Image {editing ? '(leave blank to keep current)' : '(optional)'}</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full mt-1 text-sm" />
                <p className="text-xs text-charcoal/40 mt-1">Falls back to a category icon if left blank.</p>
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
