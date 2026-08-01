import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, BookOpen, Headphones, Sparkles, TrendingUp, Star } from 'lucide-react';
import { supabase, Book, Category } from '@/lib/supabase';
import BookCard from '@/components/BookCard';
import { BookGridSkeleton } from '@/components/Skeletons';

export default function Home() {
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [featured, setFeatured] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [bs, na, feat, cats] = await Promise.all([
        supabase.from('books').select('*, categories(*)').eq('is_bestseller', true).eq('status', 'active').limit(5),
        supabase.from('books').select('*, categories(*)').eq('is_new_arrival', true).eq('status', 'active').limit(5),
        supabase.from('books').select('*, categories(*)').eq('is_featured', true).eq('status', 'active').limit(3),
        supabase.from('categories').select('*').order('book_count', { ascending: false }).limit(6),
      ]);
      setBestsellers(bs.data ?? []);
      setNewArrivals(na.data ?? []);
      setFeatured(feat.data ?? []);
      setCategories(cats.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.3) 0%, transparent 50%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-200 backdrop-blur">
                <Sparkles className="h-4 w-4" /> Over 50,000 books to explore
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Discover your next <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">favorite book</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300">
                From timeless classics to the latest bestsellers. Lumina Books brings the world's literature to your fingertips with fast shipping and member-exclusive pricing.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/books" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 transition-transform hover:scale-105">
                  Browse Books <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
                  Join Free
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-3 gap-4">
                {bestsellers.slice(0, 6).map((book, i) => (
                  <div key={book.id} className={`transform ${i % 2 === 0 ? 'translate-y-4' : '-translate-y-4'} transition-transform hover:scale-105`}>
                    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-slate-800 shadow-2xl">
                      {book.image_url ? (
                        <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center p-2 text-center font-serif text-lg font-bold text-slate-400">{book.title}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% protected payments' },
              { icon: BookOpen, title: '50K+ Books', desc: 'Vast collection available' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <f.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Find books in your favorite genre</p>
            </div>
            <Link to="/categories" className="text-sm font-medium text-indigo-600 hover:underline">View all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(cat => (
              <Link key={cat.id} to={`/books?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{cat.book_count} books</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ backgroundColor: (cat.color || '#6366f1') + '20', color: cat.color || '#6366f1' }}>
                    {cat.icon || '📚'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bestsellers</h2>
              </div>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Most loved by our readers</p>
            </div>
            <Link to="/books?filter=bestsellers" className="text-sm font-medium text-indigo-600 hover:underline">View all →</Link>
          </div>
          {loading ? <BookGridSkeleton count={5} /> : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {bestsellers.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* Featured banner */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Editor's Choice</h2>
              </div>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Handpicked books we love</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">New Arrivals</h2>
              </div>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Fresh off the press</p>
            </div>
            <Link to="/books?filter=new" className="text-sm font-medium text-indigo-600 hover:underline">View all →</Link>
          </div>
          {loading ? <BookGridSkeleton count={5} /> : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {newArrivals.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-12 text-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%)' }} />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to start reading?</h2>
              <p className="mt-4 text-lg text-indigo-100">Join Lumina Books today and get 15% off your first order.</p>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 transition-transform hover:scale-105">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
