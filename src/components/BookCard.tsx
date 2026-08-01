import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Book } from '@/lib/supabase';
import { formatCurrency, discountedPrice, truncate, classNames } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function BookCard({ book, variant = 'default' }: BookCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const inWishlist = isInWishlist(book.id);
  const finalPrice = discountedPrice(book.price, book.discount);
  const hasDiscount = (book.discount ?? 0) > 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to add items to cart'); return; }
    addToCart(book.id).then(() => toast.success('Added to cart'));
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to use wishlist'); return; }
    toggleWishlist(book.id);
  }

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/books/${book.id}`}
        className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
          {book.image_url ? (
            <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-serif text-slate-400">
              {book.title[0]}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="font-semibold text-slate-900 line-clamp-2 dark:text-white">{book.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
          <div className="mt-auto flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(finalPrice)}</span>
            {hasDiscount && <span className="text-sm text-slate-400 line-through">{formatCurrency(book.price)}</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/books/${book.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-700">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center">
            <span className="font-serif text-3xl font-bold text-slate-400">{book.title}</span>
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
            -{book.discount}%
          </span>
        )}
        {book.is_bestseller && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
            Bestseller
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 transition-transform hover:scale-110"
            title="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button
            onClick={handleWishlist}
            className={classNames(
              'flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110',
              inWishlist ? 'bg-rose-500 text-white' : 'bg-white text-slate-900',
            )}
            title="Add to wishlist"
          >
            <Heart className={classNames('h-5 w-5', inWishlist && 'fill-current')} />
          </button>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900">
            <Eye className="h-5 w-5" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {book.categories && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {book.categories.name}
          </span>
        )}
        <h3 className="font-semibold text-slate-900 line-clamp-2 dark:text-white">{book.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{book.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({book.reviews_count})</span>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(finalPrice)}</span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-slate-400 line-through">{formatCurrency(book.price)}</span>
            )}
          </div>
          {book.stock > 0 ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">In Stock</span>
          ) : (
            <span className="text-xs font-medium text-rose-500">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
