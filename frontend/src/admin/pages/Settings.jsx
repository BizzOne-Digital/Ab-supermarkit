import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as settingsService from '../../services/settingsService';
import * as cloverService from '../../services/cloverService';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [cloverStatus, setCloverStatus] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => setForm(res.settings || {}))
      .catch(() => setForm({}));
    cloverService
      .getSyncStatus()
      .then((res) => setCloverStatus(res))
      .catch(() => setCloverStatus({ configured: false }));
  }, []);

  const onSyncNow = async () => {
    setSyncing(true);
    try {
      const res = await cloverService.triggerSync();
      if (!res.configured) {
        toast.error('Clover is not configured on the server.');
      } else {
        setLastSync(res);
        toast.success(`Synced ${res.synced} products to Clover${res.failed ? ` (${res.failed} failed)` : ''}.`);
      }
    } catch (err) {
      toast.error(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

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

        <div className="pt-4 border-t border-charcoal/10">
          <h2 className="font-heading text-lg text-black mb-3">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-charcoal/70">Facebook URL</label>
              <input
                value={form.socialLinks?.facebook || ''}
                onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
                placeholder="https://facebook.com/..."
                className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal/70">Instagram URL</label>
              <input
                value={form.socialLinks?.instagram || ''}
                onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
                placeholder="https://instagram.com/..."
                className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-charcoal/10">
          <h2 className="font-heading text-lg text-black mb-3">Delivery Charges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-charcoal/70">Delivery Fee ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.deliveryFee ?? ''}
                onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
                className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal/70">Free Delivery Over ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.freeDeliveryThreshold ?? ''}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: e.target.value })}
                className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal/70">Free Delivery Radius (km)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.freeDeliveryRadiusKm ?? ''}
                onChange={(e) => setForm({ ...form, freeDeliveryRadiusKm: e.target.value })}
                className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold"
              />
              <p className="text-xs text-charcoal/40 mt-1">Informational only — distance isn&apos;t calculated automatically yet.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-charcoal/10">
          <h2 className="font-heading text-lg text-black mb-3">Admin Security</h2>
          <div>
            <label className="text-sm font-medium text-charcoal/70">Auto-Logout After Inactivity (minutes)</label>
            <input
              type="number"
              step="1"
              min="1"
              value={form.adminIdleLogoutMinutes ?? ''}
              onChange={(e) => setForm({ ...form, adminIdleLogoutMinutes: e.target.value })}
              className="w-full mt-1 border border-charcoal/20 rounded-md py-2.5 px-3 focus:outline-none focus:border-gold max-w-[160px]"
            />
            <p className="text-xs text-charcoal/40 mt-1">Admins are logged out automatically after this many minutes with no activity in the admin portal.</p>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-card p-6 mt-6">
        <h2 className="font-heading text-lg text-black mb-3">Clover Inventory Sync</h2>
        {cloverStatus && (
          <p className="text-sm mb-3">
            Status:{' '}
            <span className={cloverStatus.configured ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
              {cloverStatus.configured ? 'Connected' : 'Not configured'}
            </span>
          </p>
        )}
        <p className="text-xs text-charcoal/50 mb-4">
          Products are pushed to Clover automatically whenever one is created or updated. Use this button to push all active products now (e.g. after a bulk import).
        </p>
        <button type="button" onClick={onSyncNow} disabled={syncing || !cloverStatus?.configured} className="btn-outline disabled:opacity-60">
          {syncing ? 'Syncing...' : 'Sync All Products Now'}
        </button>
        {lastSync && (
          <p className="text-xs text-charcoal/50 mt-2">
            Last manual sync: {lastSync.synced} succeeded, {lastSync.failed} failed.
          </p>
        )}
      </div>
    </div>
  );
}
