import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, ExternalLink } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import { getInitials } from '@/utils/format';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useUser();
  const { profile, refreshProfile } = useAuth();
  const [tab, setTab] = useState<'info' | 'address'>('info');
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [address, setAddress] = useState({
    street: profile?.address?.street || '',
    city: profile?.address?.city || '',
    state: profile?.address?.state || '',
    zip: profile?.address?.zip || '',
    country: profile?.address?.country || '',
  });

  async function saveInfo() {
    setSaving(true);
    try {
      await supabase.from('profiles').update({
        full_name: info.full_name,
        phone: info.phone,
        avatar_url: info.avatar_url,
      }).eq('id', user!.id);
      await refreshProfile();
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  }

  async function saveAddress() {
    setSaving(true);
    try {
      await supabase.from('profiles').update({ address }).eq('id', user!.id);
      await refreshProfile();
      toast.success('Address updated');
    } catch { toast.error('Failed to update address'); }
    finally { setSaving(false); }
  }

  const tabs = [
    { id: 'info' as const, label: 'Personal Info', icon: User },
    { id: 'address' as const, label: 'Address', icon: MapPin },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="My Profile" subtitle="Manage your account settings" />
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-2xl font-bold text-white overflow-hidden">
              {user?.imageUrl ? <img src={user.imageUrl} alt="" className="h-full w-full rounded-full object-cover" /> : getInitials(info.full_name || user?.primaryEmailAddress?.emailAddress || 'U')}
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{info.full_name || user?.fullName}</h3>
            <p className="text-sm text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
            <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium capitalize text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              {profile?.role}
            </span>
          </div>
          <nav className="mt-4 space-y-1 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Account & Security</p>
            <p className="mb-3 text-xs text-slate-500">Manage your password, social logins, and security settings through Clerk.</p>
            <div className="flex items-center justify-between">
              <UserButton />
              <a href="https://clerk.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                Manage account <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            {tab === 'info' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Input label="Full Name" icon={<User className="h-4 w-4" />} value={info.full_name} onChange={e => setInfo(s => ({ ...s, full_name: e.target.value }))} />
                  <Input label="Email" icon={<Mail className="h-4 w-4" />} value={user?.primaryEmailAddress?.emailAddress || ''} disabled />
                  <Input label="Phone" icon={<Phone className="h-4 w-4" />} value={info.phone} onChange={e => setInfo(s => ({ ...s, phone: e.target.value }))} />
                  <Input label="Avatar URL" icon={<Camera className="h-4 w-4" />} value={info.avatar_url} onChange={e => setInfo(s => ({ ...s, avatar_url: e.target.value }))} placeholder="Auto-synced from Clerk" />
                </div>
                <div className="mt-6"><Button onClick={saveInfo} loading={saving}>Save Changes</Button></div>
              </div>
            )}
            {tab === 'address' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Shipping Address</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Input label="Street Address" value={address.street} onChange={e => setAddress(s => ({ ...s, street: e.target.value }))} className="sm:col-span-2" />
                  <Input label="City" value={address.city} onChange={e => setAddress(s => ({ ...s, city: e.target.value }))} />
                  <Input label="State" value={address.state} onChange={e => setAddress(s => ({ ...s, state: e.target.value }))} />
                  <Input label="ZIP Code" value={address.zip} onChange={e => setAddress(s => ({ ...s, zip: e.target.value }))} />
                  <Input label="Country" value={address.country} onChange={e => setAddress(s => ({ ...s, country: e.target.value }))} />
                </div>
                <div className="mt-6"><Button onClick={saveAddress} loading={saving}>Save Address</Button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
