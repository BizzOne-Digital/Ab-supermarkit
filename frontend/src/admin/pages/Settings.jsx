import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as settingsService from '../../services/settingsService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => setForm(res.settings || {}))
      .catch(() => setForm({}));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.updateSettings(form);
      setForm(res.settings);
      toast.success('Settings updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <LoadingSpinner full />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-6">Site Settings</h1>
      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-charcoal/70">Store Name</label>
          <input value={form.storeName || ''} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Contact Email</label>
          <input value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Contact Phone</label>
          <input value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Address</label>
          <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="text-sm font-medium text-charcoal/70">Tax Rate (%)</label>
          <input type="number" value={form.taxRate ?? ''} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold" />
        </div>
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
