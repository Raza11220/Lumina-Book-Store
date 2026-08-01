import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List, X } from 'lucide-react';
import { supabase, Book, Category } from '@/lib/supabase';
import BookCard from '@/components/BookCard';
import { BookGridSkeleton } from '@/components/Skeletons';
import PageHeader from '@/components/PageHeader';
import { Select } from '@/components/ui/Input';
import { classNames } from '@/utils/format';

const PAGE_SIZE = 12;

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const q = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || '';
  const filter = searchParams.get('filter') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
    setPage(1);
  }

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchBooks() {
      let query = supabase.from('books').select('*, categories(*)', { count: 'exact' }).eq('status', 'active');

      if (q) query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%,isbn.ilike.%${q}%`);
      if (categorySlug) {
        const cat = categories.find(c => c.slug === categorySlug);
        if (cat) query = query.eq('category_id', cat.id);
      }
      if (filter === 'bestsellers') query = query.eq('is_bestseller', true);
      if (filter === 'new') query = query.eq('is_new_arrival', true);
      if (filter === 'featured') query = query.eq('is_featured', true);
      if (filter === 'discounted') query = query.gt('discount', 0);
      if (minPrice) query = query.gte('price', Number(minPrice));
      if (maxPrice) query = query.lte('price', Number(maxPrice));

      switch (sort) {
        case 'price_low': query = query.order('price', { ascending: true }); break;
        case 'price_high': query = query.order('price', { ascending: false }); break;
        case 'rating': query = query.order('rating', { ascending: false }); break;
        case 'title': query = query.order('title', { ascending: true }); break;
        default: query = query.order('created_at', { ascending: false });
      }

      query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      const { data, count } = await query;
      setBooks(data ?? []);
      setTotal(count ?? 0);
      setLoading(false);
    }
    if (categories.length > 0 || !categorySlug) fetchBooks();
    else fetchBooks();
  }, [q, categorySlug, filter, sort, minPrice, maxPrice, page, categories]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const activeCategory = useMemo(() => categories.find(c => c.slug === categorySlug), [categories, categorySlug]);

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Categories</h3>
        <div className="space-y-1">
          <button onClick={() => updateParam('category', '')} className={classNames('block w-full rounded-lg px-3 py-2 text-left text-sm', !categorySlug ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
            All Categories
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => updateParam('category', cat.slug)} className={classNames('block w-full rounded-lg px-3 py-2 text-left text-sm', categorySlug === cat.slug ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
              {cat.name} ({cat.book_count})
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Price Range</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={e => updateParam('minPrice', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={e => updateParam('maxPrice', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">Filters</h3>
        <div className="space-y-1">
          {[
            { v: '', label: 'All Books' },
            { v: 'bestsellers', label: 'Bestsellers' },
            { v: 'new', label: 'New Arrivals' },
            { v: 'featured', label: "Editor's Choice" },
            { v: 'discounted', label: 'On Sale' },
          ].map(f => (
            <button key={f.v} onClick={() => updateParam('filter', f.v)} className={classNames('block w-full rounded-lg px-3 py-2 text-left text-sm', filter === f.v ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={activeCategory ? activeCategory.name : q ? `Search: "${q}"` : 'All Books'}
        subtitle={`${total} books found`}
      />

      <div className="flex gap-8">
        {/* Desktop filters */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            {FilterPanel}
          </div>
        </aside>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium lg:hidden dark:border-slate-600">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <div className="flex items-center gap-2">
              <Select value={sort} onChange={e => updateParam('sort', e.target.value)} className="!w-auto">
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="title">Title: A-Z</option>
              </Select>
              <div className="hidden gap-1 sm:flex">
                <button onClick={() => setView('grid')} className={classNames('flex h-9 w-9 items-center justify-center rounded-lg border', view === 'grid' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'border-slate-300 dark:border-slate-600')}>
                  <Grid className="h-4 w-4" />
                </button>
                <button onClick={() => setView('list')} className={classNames('flex h-9 w-9 items-center justify-center rounded-lg border', view === 'list' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'border-slate-300 dark:border-slate-600')}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? <BookGridSkeleton count={8} /> : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 dark:border-slate-700">
              <Search className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-500">No books found</p>
              <p className="text-sm text-slate-400">Try adjusting your filters or search query</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {books.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {books.map(book => <BookCard key={book.id} book={book} variant="horizontal" />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-slate-600">
                Previous
              </button>
              {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)} className={classNames('h-9 w-9 rounded-lg text-sm font-medium', p === page ? 'bg-indigo-600 text-white' : 'border border-slate-300 dark:border-slate-600')}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-slate-600">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
              <button onClick={() => setShowFilters(false)}><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
