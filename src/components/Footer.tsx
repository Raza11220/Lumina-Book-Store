import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Lumina<span className="text-indigo-600">Books</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Your premium destination for books. Discover, explore, and read the world's best literature.
            </p>
            <div className="mt-4 flex gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-400">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/books" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">All Books</Link></li>
              <li><Link to="/books?filter=bestsellers" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Bestsellers</Link></li>
              <li><Link to="/books?filter=new" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">New Arrivals</Link></li>
              <li><Link to="/categories" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Account</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/profile" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">My Profile</Link></li>
              <li><Link to="/orders" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Order History</Link></li>
              <li><Link to="/wishlist" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Wishlist</Link></li>
              <li><Link to="/cart" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Shopping Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Help Center</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Shipping Info</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Returns</a></li>
              <li><a href="#" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Lumina Books. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
