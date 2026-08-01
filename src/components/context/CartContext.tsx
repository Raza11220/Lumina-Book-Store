import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, CartItem } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface CartContextValue {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchCart() {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('cart_items')
      .select('*, books(*, categories(*))')
      .eq('user_id', user.id);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchCart(); }, [user]);

  async function addToCart(bookId: string, quantity = 1) {
    if (!user) return;
    const existing = items.find(i => i.book_id === bookId);
    if (existing) {
      await supabase.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({ user_id: user.id, book_id: bookId, quantity });
    }
    await fetchCart();
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
    await fetchCart();
  }

  async function removeFromCart(itemId: string) {
    await supabase.from('cart_items').delete().eq('id', itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  }

  async function clearCart() {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    setItems([]);
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    const book = i.books;
    if (!book) return s;
    const price = book.price * (1 - (book.discount ?? 0) / 100);
    return s + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, loading, totalItems, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart, refresh: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
