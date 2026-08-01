import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Category } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      setCategories(data ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="All Categories" subtitle="Browse books by genre" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => (
          <Link
            key={cat.id}
            to={`/books?category=${cat.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: (cat.color || '#6366f1') + '20' }}>
                  {cat.icon || '📚'}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                {cat.description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>}
                <p className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">{cat.book_count} books available</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
