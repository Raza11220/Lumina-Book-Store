import { Link } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="text-center">
        <p className="text-8xl font-bold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/"><Button><Home className="h-4 w-4" /> Back Home</Button></Link>
          <Link to="/books"><Button variant="outline"><BookOpen className="h-4 w-4" /> Browse Books</Button></Link>
        </div>
      </div>
    </div>
  );
}
