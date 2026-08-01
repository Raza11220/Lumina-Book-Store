import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Register() {
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
          <h1 className="text-4xl font-bold leading-tight">Join thousands of readers today</h1>
          <p className="mt-4 text-lg text-indigo-100">Create your free account and start exploring a world of books, exclusive deals, and personalized recommendations.</p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div><div className="text-3xl font-bold">50K+</div><div className="text-sm text-indigo-200">Books</div></div>
            <div><div className="text-3xl font-bold">100K+</div><div className="text-sm text-indigo-200">Readers</div></div>
            <div><div className="text-3xl font-bold">4.9★</div><div className="text-sm text-indigo-200">Rating</div></div>
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
            <SignUp routing="path" path="/register" signInUrl="/login" fallbackRedirectUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
