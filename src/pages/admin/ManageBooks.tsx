import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, BookOpen } from 'lucide-react';
import { supabase, Book, Category } from '@/lib/supabase';
import { formatCurrency, discountedPrice, formatDate } from '@/utils/format';
import { StatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const emptyBook = {
  title: '', author: '', isbn: '', category_id: '', description: '', price: 0, discount: 0,
  stock: 0, image_url: '', publisher: '', language: 'English', pages: 0, published_year: 0,
  is_featured: false, is_bestseller: false, is_new_arrival: false, status: 'active',
};

export default function ManageBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState<Record<string, any>>(emptyBook);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('books').select('*, categories(*)').order('created_at', { ascending: false });
    setBooks(data ?? []);
    const { data: cats } = await supabase.from('categories').select('*');
    setCategories(cats ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(emptyBook); setModalOpen(true); }
  function openEdit(book: Book) { setEditing(book); setForm({ ...book }); setModalOpen(true); }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock),
        pages: Number(form.pages) || null, published_year: Number(form.published_year) || null,
        category_id: form.category_id || null,
      };
      if (editing) {
        const { error } = await supabase.from('books').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Book updated');
      } else {
        const { error } = await supabase.from('books').insert(payload);
        if (error) throw error;
        toast.success('Book added');
      }
      setModalOpen(false);
      await load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  async function remove(book: Book) {
    if (!confirm(`Delete "${book.title}"?`)) return;
    const { error } = await supabase.from('books').delete().eq('id', book.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Book deleted');
    setBooks(prev => prev.filter(b => b.id !== book.id));
  }

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    (b.isbn || '').includes(search)
  );

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Books</h1>
          <p className="text-sm text-slate-500">{books.length} books in catalog</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Book</Button>
      </div>

      <div className="mb-4 max-w-md">
        <Input icon={<Search className="h-4 w-4" />} placeholder="Search by title, author, or ISBN..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(book => (
              <tr key={book.id} className="border-t border-slate-100 dark:border-slate-700/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-900">
                      {book.image_url ? <img src={book.image_url} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><BookOpen className="h-4 w-4 text-slate-400" /></div>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{book.title}</p>
                      <p className="text-xs text-slate-500">{book.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{book.categories?.name || '—'}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{formatCurrency(discountedPrice(book.price, book.discount))}</td>
                <td className="px-4 py-3"><span className={book.stock < 10 ? 'font-semibold text-amber-600' : 'text-slate-600 dark:text-slate-300'}>{book.stock}</span></td>
                <td className="px-4 py-3"><StatusBadge status={book.status} /></td>
                <td className="px-4 py-3 text-slate-500">{formatDate(book.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(book)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(book)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Book' : 'Add New Book'} size="xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Input label="Author" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
          <Input label="ISBN" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} />
          <Select label="Category" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
            <option value="">None</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="Price ($)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          <Input label="Discount (%)" type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} />
          <Input label="Stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
          <Input label="Image URL" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
          <Input label="Publisher" value={form.publisher} onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))} />
          <Input label="Language" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} />
          <Input label="Pages" type="number" value={form.pages} onChange={e => setForm(f => ({ ...f, pages: e.target.value }))} />
          <Input label="Published Year" type="number" value={form.published_year} onChange={e => setForm(f => ({ ...f, published_year: e.target.value }))} />
          <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </Select>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="rounded text-indigo-600" /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_bestseller} onChange={e => setForm(f => ({ ...f, is_bestseller: e.target.checked }))} className="rounded text-indigo-600" /> Bestseller</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_new_arrival} onChange={e => setForm(f => ({ ...f, is_new_arrival: e.target.checked }))} className="rounded text-indigo-600" /> New Arrival</label>
          </div>
          <Textarea label="Description" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="sm:col-span-2" />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={save} loading={saving}>{editing ? 'Update' : 'Add'} Book</Button>
        </div>
      </Modal>
    </div>
  );
}
