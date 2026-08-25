import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, X } from 'lucide-react';
import * as deliveryLinkService from '../../services/deliveryLinkService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const emptyForm = { platform: 'UberEats', url: '', isEnabled: true };

export default function DeliveryLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    deliveryLinkService.getDeliveryLinks().then((res) => setLinks(res.deliveryLinks || [])).catch(() => setLinks([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await deliveryLinkService.createDeliveryLink(form);
      toast.success('Delivery link added');
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to add link');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      await deliveryLinkService.deleteDeliveryLink(id);
      toast.success('Link deleted');
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete link');
    }
  };

  const toggleEnabled = async (l) => {
    try {
      await deliveryLinkService.updateDeliveryLink(l._id, { isEnabled: !l.isEnabled });
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to update link');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Delivery Links</h1>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-sm py-2 px-4"><Plus className="h-4 w-4" /> Add Link</button>
      </div>
      {loading ? <LoadingSpinner full /> : links.length === 0 ? (
        <EmptyState title="No delivery links yet" />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l._id} className="border-b border-charcoal/5">
                  <td className="py-3 px-4 font-medium">{l.platform}</td>
                  <td className="py-3 px-4 truncate max-w-xs"><a href={l.url} target="_blank" rel="noreferrer" className="text-gold-dark hover:underline">{l.url}</a></td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleEnabled(l)} className={`text-xs px-2 py-0.5 rounded ${l.isEnabled ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}>
                      {l.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => onDelete(l._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4 inline" /></button>
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
              <h2 className="font-heading text-xl text-black">Add Delivery Link</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-charcoal/70">Platform</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3">
                  <option value="UberEats">UberEats</option>
                  <option value="SkipTheDishes">SkipTheDishes</option>
                  <option value="DoorDash">DoorDash</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal/70">URL</label>
                <input required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
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
