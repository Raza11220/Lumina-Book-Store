import { useState } from 'react';
import { Save, Store, Bell, Globe, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [tab, setTab] = useState<'store' | 'notifications' | 'security'>('store');
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState({
    name: 'Lumina Books', email: 'support@luminabooks.com', phone: '+1 (555) 123-4567',
    currency: 'USD', address: '123 Book Street, Reading City, RC 12345',
    description: 'Your premium destination for books worldwide.',
  });
  const [notifications, setNotifications] = useState({ newOrders: true, lowStock: true, newReviews: false, newUsers: true });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: '30', passwordExpiry: '90' });

  function save() {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Settings saved'); }, 800);
  }

  const tabs = [
    { id: 'store' as const, label: 'Store', icon: Store },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500">Manage your store configuration</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <nav className="space-y-1 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            {tab === 'store' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Store Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Store Name" value={store.name} onChange={e => setStore(s => ({ ...s, name: e.target.value }))} />
                  <Input label="Email" value={store.email} onChange={e => setStore(s => ({ ...s, email: e.target.value }))} />
                  <Input label="Phone" value={store.phone} onChange={e => setStore(s => ({ ...s, phone: e.target.value }))} />
                  <Select label="Currency" value={store.currency} onChange={e => setStore(s => ({ ...s, currency: e.target.value }))}>
                    <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option>
                  </Select>
                  <Textarea label="Address" rows={2} value={store.address} onChange={e => setStore(s => ({ ...s, address: e.target.value }))} className="sm:col-span-2" />
                  <Textarea label="Description" rows={3} value={store.description} onChange={e => setStore(s => ({ ...s, description: e.target.value }))} className="sm:col-span-2" />
                </div>
              </div>
            )}
            {tab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</h2>
                {Object.entries(notifications).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                      <p className="text-sm text-slate-500">Get notified about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                    </div>
                    <input type="checkbox" checked={val} onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))} className="h-5 w-5 rounded text-indigo-600" />
                  </label>
                ))}
              </div>
            )}
            {tab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</h2>
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <div><p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p><p className="text-sm text-slate-500">Add an extra layer of security</p></div>
                  <input type="checkbox" checked={security.twoFactor} onChange={e => setSecurity(s => ({ ...s, twoFactor: e.target.checked }))} className="h-5 w-5 rounded text-indigo-600" />
                </label>
                <Input label="Session Timeout (minutes)" type="number" value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))} />
                <Input label="Password Expiry (days)" type="number" value={security.passwordExpiry} onChange={e => setSecurity(s => ({ ...s, passwordExpiry: e.target.value }))} />
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={save} loading={saving}><Save className="h-4 w-4" /> Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
