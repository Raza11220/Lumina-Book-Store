import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Eye } from 'lucide-react';
import { supabase, Order } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/utils/format';
import { StatusBadge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewing, setViewing] = useState<Order | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*, profiles(full_name, email), order_items(*, books(*))').order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(order: Order, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id);
    if (error) { toast.error(error.message); return; }
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
    toast.success('Order status updated');
  }

  const filtered = orders.filter(o =>
    (o.id.includes(search) || o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || o.status === statusFilter)
  );

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Orders</h1>
        <p className="text-sm text-slate-500">{orders.length} total orders</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="max-w-md flex-1">
          <Input icon={<Search className="h-4 w-4" />} placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="!w-auto">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-t border-slate-100 dark:border-slate-700/50">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 dark:text-white">{o.profiles?.full_name || '—'}</p>
                  <p className="text-xs text-slate-500">{o.profiles?.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(o.created_at)}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{o.order_items?.length || 0}</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(o.total)}</td>
                <td className="px-4 py-3">
                  <Select value={o.status} onChange={e => updateStatus(o, e.target.value)} className="!w-auto !py-1.5 text-xs">
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </Select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setViewing(o)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center py-12 text-slate-400">
          <ShoppingCart className="h-12 w-12" />
          <p className="mt-2">No orders found</p>
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Order #${viewing?.id.slice(0, 8)}`} size="lg">
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs uppercase text-slate-400">Customer</p><p className="font-medium text-slate-900 dark:text-white">{viewing.profiles?.full_name}</p></div>
              <div><p className="text-xs uppercase text-slate-400">Email</p><p className="text-slate-600 dark:text-slate-300">{viewing.profiles?.email}</p></div>
              <div><p className="text-xs uppercase text-slate-400">Date</p><p className="text-slate-600 dark:text-slate-300">{formatDate(viewing.created_at)}</p></div>
              <div><p className="text-xs uppercase text-slate-400">Status</p><StatusBadge status={viewing.status} /></div>
              <div><p className="text-xs uppercase text-slate-400">Payment</p><p className="capitalize text-slate-600 dark:text-slate-300">{viewing.payment_method} — {viewing.payment_status}</p></div>
              <div><p className="text-xs uppercase text-slate-400">Total</p><p className="font-bold text-slate-900 dark:text-white">{formatCurrency(viewing.total)}</p></div>
            </div>
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="mb-2 text-xs uppercase text-slate-400">Shipping Address</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {viewing.shipping_address?.full_name}<br />
                {viewing.shipping_address?.address}<br />
                {viewing.shipping_address?.city}, {viewing.shipping_address?.state} {viewing.shipping_address?.zip}<br />
                {viewing.shipping_address?.country}
              </p>
            </div>
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="mb-2 text-xs uppercase text-slate-400">Items</p>
              <div className="space-y-2">
                {viewing.order_items?.map(item => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="h-10 w-8 overflow-hidden rounded bg-slate-100 dark:bg-slate-900">
                      {item.books?.image_url && <img src={item.books.image_url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="flex-1 text-slate-900 dark:text-white">{item.books?.title || 'Unknown'}</span>
                    <span className="text-slate-500">×{item.quantity}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
