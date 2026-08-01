import { useEffect, useState } from 'react';
import { Users, Search, Shield } from 'lucide-react';
import { supabase, Profile } from '@/lib/supabase';
import { formatDate, getInitials } from '@/utils/format';
import { StatusBadge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setUsers(data ?? []);
      setLoading(false);
    });
  }, []);

  async function updateRole(user: Profile, role: 'customer' | 'admin') {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', user.id);
    if (error) { toast.error(error.message); return; }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role } : u));
    toast.success(`${user.full_name} is now ${role}`);
  }

  const filtered = users.filter(u =>
    (u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter)
  );

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
        <p className="text-sm text-slate-500">{users.length} registered users</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="max-w-md flex-1">
          <Input icon={<Search className="h-4 w-4" />} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="!w-auto">
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="admin">Admins</option>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t border-slate-100 dark:border-slate-700/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white">
                      {u.avatar_url ? <img src={u.avatar_url} alt="" className="h-full w-full rounded-full object-cover" /> : getInitials(u.full_name || 'U')}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{u.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.phone || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {u.role === 'admin' && <Shield className="h-3 w-3" />}{u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <Select value={u.role} onChange={e => updateRole(u, e.target.value as any)} className="!w-auto !py-1.5 text-xs">
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-slate-400">
          <Users className="h-12 w-12" />
          <p className="mt-2">No users found</p>
        </div>
      )}
    </div>
  );
}
