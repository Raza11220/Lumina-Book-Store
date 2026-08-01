import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { supabase, Category } from '@/lib/supabase';
import { slugify } from '@/utils/format';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const empty = { name: '', slug: '', description: '', icon: '📚', color: '#6366f1' };

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Record<string, any>>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(empty); setModalOpen(true); }
  function openEdit(cat: Category) { setEditing(cat); setForm({ ...cat }); setModalOpen(true); }

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      if (editing) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('Category updated');
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
        toast.success('Category added');
      }
      setModalOpen(false);
      await load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  async function remove(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', cat.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Category deleted');
    setCategories(prev => prev.filter(c => c.id !== cat.id));
  }

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Categories</h1>
          <p className="text-sm text-slate-500">{categories.length} categories</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: (cat.color || '#6366f1') + '20' }}>
                  {cat.icon || '📚'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{cat.book_count} books</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => remove(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {cat.description && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 dark:border-slate-700">
            <FolderTree className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">No categories yet</p>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated if empty" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Icon (emoji)" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Color</label>
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600" />
            </div>
          </div>
          <Textarea label="Description" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={save} loading={saving}>{editing ? 'Update' : 'Add'}</Button>
        </div>
      </Modal>
    </div>
  );
}
