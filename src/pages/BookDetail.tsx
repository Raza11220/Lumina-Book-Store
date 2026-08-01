import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Share2, ChevronRight, BookOpen } from 'lucide-react';
import { supabase, Book, Review, Profile } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatCurrency, discountedPrice, formatDate, classNames } from '@/utils/format';
import StarRating, { StarRatingInput } from '@/components/StarRating';
import Button from '@/components/ui/Button';
import { Textarea, Input } from '@/components/ui/Input';
import LoadingSpinner from '@/components/LoadingSpinner';
import BookCard from '@/components/BookCard';
import toast from 'react-hot-toast';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<(Review & { profiles?: Profile })[]>([]);
  const [related, setRelated] = useState<Book[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('books').select('*, categories(*)').eq('id', id!).maybeSingle();
      setBook(data);
      if (data) {
        const [revs, rel] = await Promise.all([
          supabase.from('reviews').select('*, profiles(*)').eq('book_id', id!).order('created_at', { ascending: false }),
          supabase.from('books').select('*, categories(*)').eq('category_id', data.category_id || '').neq('id', id!).limit(4),
        ]);
        setReviews(revs.data ?? []);
        setRelated(rel.data ?? []);
      }
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  function handleAddToCart() {
    if (!user) { toast.error('Please sign in to add items to cart'); navigate('/login'); return; }
    if (!book) return;
    addToCart(book.id, quantity).then(() => toast.success('Added to cart!'));
  }

  function handleBuyNow() {
    if (!user) { navigate('/login'); return; }
    if (!book) return;
    addToCart(book.id, quantity).then(() => navigate('/cart'));
  }

  function handleWishlist() {
    if (!user) { toast.error('Please sign in to use wishlist'); return; }
    if (book) toggleWishlist(book.id);
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !book) return;
    setSubmittingReview(true);
    try {
      const { data, error } = await supabase.from('reviews').insert({
        book_id: book.id,
        user_id: user.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        body: reviewForm.body,
      }).select('*, profiles(*)').single();
      if (error) throw error;
      setReviews(prev => [data, ...prev]);
      setReviewForm({ rating: 5, title: '', body: '' });
      toast.success('Review submitted!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) return <LoadingSpinner size="lg" />;

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="h-16 w-16 text-slate-300" />
        <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">Book not found</h2>
        <Link to="/books" className="mt-4 text-indigo-600 hover:underline">Browse all books</Link>
      </div>
    );
  }

  const finalPrice = discountedPrice(book.price, book.discount);
  const hasDiscount = (book.discount ?? 0) > 0;
  const inWishlist = isInWishlist(book.id);
  const userReview = reviews.find(r => r.user_id === user?.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/books" className="hover:text-indigo-600">Books</Link>
        <ChevronRight className="h-3 w-3" />
        {book.categories && <><Link to={`/books?category=${book.categories.slug}`} className="hover:text-indigo-600">{book.categories.name}</Link><ChevronRight className="h-3 w-3" /></>}
        <span className="truncate text-slate-700 dark:text-slate-300">{book.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Image */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
              {book.image_url ? (
                <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <span className="font-serif text-4xl font-bold text-slate-400">{book.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5">
          {book.categories && (
            <Link to={`/books?category=${book.categories.slug}`} className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {book.categories.name}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{book.title}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">by <span className="font-medium">{book.author}</span></p>

          <div className="mt-4 flex items-center gap-4">
            <StarRating rating={book.rating} showValue />
            <span className="text-sm text-slate-500">{book.reviews_count} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(finalPrice)}</span>
            {hasDiscount && <span className="text-lg text-slate-400 line-through">{formatCurrency(book.price)}</span>}
            {hasDiscount && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-sm font-semibold text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">Save {book.discount}%</span>}
          </div>

          <p className="mt-6 text-slate-600 leading-relaxed dark:text-slate-300">{book.description || 'No description available.'}</p>

          {/* Specs */}
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            {[
              ['Publisher', book.publisher],
              ['Language', book.language],
              ['Pages', book.pages?.toString()],
              ['Published', book.published_year?.toString()],
              ['ISBN', book.isbn],
              ['Stock', book.stock > 0 ? `${book.stock} available` : 'Out of stock'],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label as string}>
                <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Purchase box */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(finalPrice)}</span>
              {hasDiscount && <span className="text-sm text-slate-400 line-through">{formatCurrency(book.price)}</span>}
            </div>

            {book.stock > 0 ? (
              <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">In Stock</p>
            ) : (
              <p className="mt-2 text-sm font-medium text-rose-500">Out of Stock</p>
            )}

            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</span>
              <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-600">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center text-slate-600 dark:text-slate-300">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-slate-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(book.stock, q + 1))} className="flex h-9 w-9 items-center justify-center text-slate-600 dark:text-slate-300">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button onClick={handleAddToCart} variant="outline" className="w-full" disabled={book.stock === 0}>
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button onClick={handleBuyNow} className="w-full" disabled={book.stock === 0}>
                Buy Now
              </Button>
              <Button onClick={handleWishlist} variant="ghost" className="w-full">
                <Heart className={classNames('h-4 w-4', inWishlist && 'fill-rose-500 text-rose-500')} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              {[
                { icon: Truck, text: 'Free shipping over $50' },
                { icon: RotateCcw, text: '30-day return policy' },
                { icon: ShieldCheck, text: 'Secure checkout' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <f.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Reviews</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="text-center">
                <p className="text-5xl font-bold text-slate-900 dark:text-white">{book.rating.toFixed(1)}</p>
                <StarRating rating={book.rating} size="lg" />
                <p className="mt-2 text-sm text-slate-500">{book.reviews_count} reviews</p>
              </div>
              {!userReview && user && (
                <form onSubmit={submitReview} className="mt-6 space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Write a Review</h3>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
                    <StarRatingInput value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
                  </div>
                  <Input label="Title" placeholder="Great book!" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
                  <Textarea label="Review" rows={3} placeholder="Share your thoughts..." value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} />
                  <Button type="submit" loading={submittingReview} size="sm">Submit Review</Button>
                </form>
              )}
              {!user && (
                <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
                  <p className="text-sm text-slate-500">Sign in to write a review</p>
                  <Link to="/login" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline">Sign In</Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-700">
                <p className="text-slate-500">No reviews yet. Be the first to review!</p>
              </div>
            ) : reviews.map(review => (
              <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white">
                      {(review.profiles?.full_name || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{review.profiles?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {review.title && <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">{review.title}</h4>}
                {review.body && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.body}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Related Books</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}
