import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  address?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  book_count: number;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category_id?: string;
  description?: string;
  price: number;
  discount: number;
  stock: number;
  image_url?: string;
  publisher?: string;
  language: string;
  pages?: number;
  published_year?: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface CartItem {
  id: string;
  user_id: string;
  book_id: string;
  quantity: number;
  created_at: string;
  books?: Book;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  books?: Book;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  shipping_address: Record<string, string>;
  payment_method: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profiles?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  books?: Book;
}

export interface Review {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  title?: string;
  body?: string;
  created_at: string;
  profiles?: Profile;
}
