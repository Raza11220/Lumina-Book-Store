import { useEffect, useState } from 'react';
import { Package, AlertTriangle, TrendingDown, Search } from 'lucide-react';
import { supabase, Book } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import LoadingSpinner from '@/components/LoadingSpinner';
import { classNames } from '@/utils/format';

export default function InventoryManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    supabase.from('books').select('*, categories(*)').order('stock', { ascending: true }).then(({ data }) => {
      setBooks(data ?? []);
      setLoading(false);
    });
  }, []);

  async function updateStock(book: Book, stock: number) {
    const { error } = await supabase.from('books').update({ stock, status: stock === 0 ? 'out_of_stock' : 'active' }).eq('id', book.id);
    if (error) return;
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, stock, status: stock === 0 ? 'out_of_stock' : 'active' } : b));
  }

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || (filter === 'low' && b.stock < 10 && b.stock > 0) || (filter === 'out' && b.stock === 0))
  );

  const lowStock = books.filter(b => b.stock < 10 && b.stock > 0).length;
  const outOfStock = books.filter(b => b.stock === 0).length;

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
        <p className="text-sm text-slate-500">Track and manage book stock levels</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30"><Package className="h-6 w-6" /></div>
            <div><p className="text-2xl font-bold text-slate-900 dark:text-white">{books.length}</p><p className="text-sm text-slate-500">Total Books</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30"><AlertTriangle className="h-6 w-6" /></div>
            <div><p className="text-2xl font-bold text-amber-600">{lowStock}</p><p className="text-sm text-slate-500">Low Stock</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30"><TrendingDown className="h-6 w-6" /></div>
            <div><p className="text-2xl font-bold text-rose-600">{outOfStock}</p><p className="text-sm text-slate-500">Out of Stock</p></div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="max-w-md flex-1">
          <Input icon={<Search className="h-4 w-4" />} placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(['all', 'low', 'out'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={classNames('rounded-lg px-4 py-2 text-sm font-medium', filter === f ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300')}>
              {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Current Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(book => (
              <tr key={book.id} className="border-t border-slate-100 dark:border-slate-700/50">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{book.title}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{book.categories?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={classNames('font-semibold', book.stock === 0 ? 'text-rose-600' : book.stock < 10 ? 'text-amber-600' : 'text-slate-900 dark:text-white')}>{book.stock}</span>
                </td>
                <td className="px-4 py-3">
                  {book.stock === 0 ? <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">Out of Stock</span>
                    : book.stock < 10 ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Low Stock</span>
                    : <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">In Stock</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={book.stock} onBlur={e => { const v = parseInt(e.target.value); if (v !== book.stock) updateStock(book, v); }} className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
