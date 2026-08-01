import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, WishlistItem } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface WishlistContextValue {
  items: WishlistItem[];
  loading: boolean;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (bookId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchWishlist() {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('wishlist_items')
      .select('*, books(*, categories(*))')
      .eq('user_id', user.id);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchWishlist(); }, [user]);

  const isInWishlist = (bookId: string) => items.some(i => i.book_id === bookId);

  async function toggleWishlist(bookId: string) {
    if (!user) return;
    const existing = items.find(i => i.book_id === bookId);
    if (existing) {
      await supabase.from('wishlist_items').delete().eq('id', existing.id);
      setItems(prev => prev.filter(i => i.id !== existing.id));
    } else {
      await supabase.from('wishlist_items').insert({ user_id: user.id, book_id: bookId });
      await fetchWishlist();
    }
  }

  return (
    <WishlistContext.Provider value={{ items, loading, isInWishlist, toggleWishlist, refresh: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
