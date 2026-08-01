import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, BookOpen } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency, discountedPrice } from '@/utils/format';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';

export default function Cart() {
  const { items, loading, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-8"><div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader title="Shopping Cart" />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 dark:border-slate-700">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <ShoppingBag className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">Your cart is empty</h2>
          <p className="mt-1 text-slate-500">Looks like you haven't added any books yet.</p>
          <Link to="/books" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
            Browse Books <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const shippingFee = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingFee + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Shopping Cart" subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(item => {
            const book = item.books;
            if (!book) return null;
            const price = discountedPrice(book.price, book.discount);
            return (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <Link to={`/books/${book.id}`} className="flex-shrink-0">
                  <div className="h-32 w-24 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                    {book.image_url ? (
                      <img src={book.image_url} alt={book.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-2 text-center font-serif text-sm font-bold text-slate-400">{book.title}</div>
                    )}
                  </div>
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/books/${book.id}`} className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-white">{book.title}</Link>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-600">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-slate-600 dark:text-slate-300">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-slate-900 dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-slate-600 dark:text-slate-300">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(price * item.quantity)}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(price)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Link to="/books" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
            <BookOpen className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <div>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-medium text-slate-900 dark:text-white">{formatCurrency(totalPrice)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd className="font-medium text-slate-900 dark:text-white">{shippingFee === 0 ? 'Free' : formatCurrency(shippingFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Tax (8%)</dt><dd className="font-medium text-slate-900 dark:text-white">{formatCurrency(tax)}</dd></div>
              <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                <div className="flex justify-between"><dt className="font-semibold text-slate-900 dark:text-white">Total</dt><dd className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(grandTotal)}</dd></div>
              </div>
            </dl>
            {totalPrice < 50 && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                Add {formatCurrency(50 - totalPrice)} more for free shipping!
              </p>
            )}
            <Button onClick={() => navigate('/checkout')} className="mt-6 w-full" size="lg">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
