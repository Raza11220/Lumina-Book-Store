import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/context/ThemeContext';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

import Home from '@/pages/Home';
import Books from '@/pages/Books';
import BookDetail from '@/pages/BookDetail';
import Categories from '@/pages/Categories';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import Orders from '@/pages/Orders';
import Profile from '@/pages/Profile';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import NotFound from '@/pages/NotFound';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import ManageBooks from '@/pages/admin/ManageBooks';
import ManageCategories from '@/pages/admin/ManageCategories';
import ManageUsers from '@/pages/admin/ManageUsers';
import ManageOrders from '@/pages/admin/ManageOrders';
import InventoryManagement from '@/pages/admin/InventoryManagement';
import AdminSettings from '@/pages/admin/AdminSettings';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <Toaster position="top-right" toastOptions={{
                  style: { borderRadius: '12px', background: '#1e293b', color: '#fff' },
                  success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                  error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }} />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                  <Route path="/books" element={<MainLayout><Books /></MainLayout>} />
                  <Route path="/books/:id" element={<MainLayout><BookDetail /></MainLayout>} />
                  <Route path="/categories" element={<MainLayout><Categories /></MainLayout>} />
                  <Route path="/cart" element={<MainLayout><ProtectedRoute><Cart /></ProtectedRoute></MainLayout>} />
                  <Route path="/wishlist" element={<MainLayout><ProtectedRoute><Wishlist /></ProtectedRoute></MainLayout>} />
                  <Route path="/checkout" element={<MainLayout><ProtectedRoute><Checkout /></ProtectedRoute></MainLayout>} />
                  <Route path="/orders" element={<MainLayout><ProtectedRoute><Orders /></ProtectedRoute></MainLayout>} />
                  <Route path="/profile" element={<MainLayout><ProtectedRoute><Profile /></ProtectedRoute></MainLayout>} />

                  <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="books" element={<ManageBooks />} />
                    <Route path="categories" element={<ManageCategories />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="inventory" element={<InventoryManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
