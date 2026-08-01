import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Login() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 lg:flex lg:flex-col lg:justify-center lg:p-12">
        <div className="max-w-md text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">Lumina Books</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight">Welcome back to your literary world</h1>
          <p className="mt-4 text-lg text-indigo-100">Sign in to access your cart, wishlist, orders, and personalized book recommendations.</p>
          <div className="mt-12 space-y-4">
            {['Access exclusive member discounts', 'Track your orders in real-time', 'Build your personal library'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-indigo-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm">✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">Lumina Books</span>
            </Link>
          </div>
          <div className="flex justify-center">
            <SignIn routing="path" path="/login" signUpUrl="/register" fallbackRedirectUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
