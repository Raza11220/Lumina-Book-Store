import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, discountedPrice } from '@/utils/format';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import BookCard from '@/components/BookCard';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { items, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader title="My Wishlist" />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 dark:border-slate-700">
          <Heart className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">Please sign in to view your wishlist</p>
          <Link to="/login" className="mt-4 text-indigo-600 hover:underline">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-8"><div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader title="My Wishlist" />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 dark:border-slate-700">
          <Heart className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-500">Your wishlist is empty</p>
          <p className="text-sm text-slate-400">Save books you love to find them quickly later.</p>
          <Link to="/books" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
            Browse Books <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="My Wishlist" subtitle={`${items.length} book${items.length !== 1 ? 's' : ''} saved`} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(item => item.books && <BookCard key={item.id} book={item.books} />)}
      </div>
    </div>
  );
}
