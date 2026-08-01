import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, BookOpen, Users, TrendingUp, Package, ArrowRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/utils/format';
import { StatusBadge } from '@/components/ui/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, books: 0, users: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<{ name: string; sales: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [books, orders, users, cats] = await Promise.all([
        supabase.from('books').select('id, price, stock, category_id, categories(*)'),
        supabase.from('orders').select('id, total, status, created_at, profiles(full_name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('id, role'),
        supabase.from('categories').select('id, name, book_count'),
      ]);

      const allBooks = books.data ?? [];
      const allOrders = orders.data ?? [];
      const allUsers = users.data ?? [];
      const allCats = cats.data ?? [];

      const revenue = allOrders.reduce((s, o) => s + Number(o.total), 0);
      const lowStock = allBooks.filter(b => b.stock < 10).length;

      setStats({ revenue, orders: allOrders.length, books: allBooks.length, users: allUsers.length, lowStock });

      // Sales last 7 days
      const days: { name: string; sales: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const dayOrders = allOrders.filter(o => o.created_at.slice(0, 10) === key);
        days.push({ name: d.toLocaleDateString('en-US', { weekday: 'short' }), sales: dayOrders.reduce((s, o) => s + Number(o.total), 0) });
      }
      setSalesData(days);

      // Category distribution
      const catMap: Record<string, number> = {};
      allBooks.forEach(b => {
        const catName = (b.categories as any)?.name || 'Uncategorized';
        catMap[catName] = (catMap[catName] || 0) + 1;
      });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      setRecentOrders(allOrders);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: DollarSign, color: 'from-emerald-500 to-green-600', change: '+12.5%' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'from-indigo-500 to-blue-600', change: '+8.2%' },
    { label: 'Books in Catalog', value: stats.books, icon: BookOpen, color: 'from-amber-500 to-orange-600', change: '+3.1%' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-purple-500 to-pink-600', change: '+15.3%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(card => (
          <div key={card.label} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> {card.change}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sales Overview</h3>
          <p className="text-sm text-slate-500">Last 7 days revenue</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Books by Category</h3>
          <p className="text-sm text-slate-500">Distribution</p>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="py-20 text-center text-sm text-slate-400">No data</p>}
          <div className="mt-2 space-y-1">
            {categoryData.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /> {c.name}
                </span>
                <span className="font-medium text-slate-900 dark:text-white">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders + low stock */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm font-medium text-indigo-600 hover:underline">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{o.profiles?.full_name || '—'}</td>
                      <td className="py-3 text-slate-500">{formatDate(o.created_at)}</td>
                      <td className="py-3"><StatusBadge status={o.status} /></td>
                      <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">{formatCurrency(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Inventory Alert</h3>
            <Link to="/admin/inventory" className="text-sm font-medium text-indigo-600 hover:underline">Manage →</Link>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
            <Package className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.lowStock}</p>
              <p className="text-sm text-amber-600 dark:text-amber-500">Books with low stock</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Link to="/admin/books" className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-indigo-600" /> Manage Books</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link to="/admin/users" className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-indigo-600" /> Manage Users</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link to="/admin/orders" className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700">
              <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-indigo-600" /> View Analytics</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
