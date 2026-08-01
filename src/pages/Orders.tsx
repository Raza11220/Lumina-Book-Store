import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Download } from 'lucide-react';
import { supabase, Order } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { StatusBadge } from '@/components/ui/Badge';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/ui/Button';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*, order_items(*, books(*))').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data ?? []);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="My Orders" subtitle="Track and manage your purchases" />
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 dark:border-slate-700">
          <Package className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">No orders yet</p>
          <p className="text-sm text-slate-400">When you place an order, it will appear here.</p>
          <Link to="/books" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
            Start Shopping <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/50">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Date</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(order.total)}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-900">
                        {item.books?.image_url && <img src={item.books.image_url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <Link to={`/books/${item.book_id}`} className="font-medium text-slate-900 hover:text-indigo-600 dark:text-white">{item.books?.title}</Link>
                        <p className="text-sm text-slate-500">Qty: {item.quantity} × {formatCurrency(item.unit_price)}</p>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.unit_price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700">
                  <div className="text-sm text-slate-500">
                    Ship to: {order.shipping_address?.full_name}, {order.shipping_address?.city}, {order.shipping_address?.state}
                  </div>
                  <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Invoice</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
