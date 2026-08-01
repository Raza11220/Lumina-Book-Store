import { ReactNode } from 'react';
import { Star } from 'lucide-react';
import { classNames } from '@/utils/format';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({ rating, size = 'md', showValue = false, interactive = false, onChange }: StarRatingProps) {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-6 w-6' };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={classNames(interactive && 'cursor-pointer', !interactive && 'cursor-default')}
          >
            <Star
              className={classNames(
                sizes[size],
                star <= Math.round(rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-none text-slate-300 dark:text-slate-600',
              )}
            />
          </button>
        ))}
      </div>
      {showValue && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>}
    </div>
  );
}

export function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}>
          <Star
            className={classNames(
              'h-7 w-7 transition-colors',
              star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-300 dark:text-slate-600',
            )}
          />
        </button>
      ))}
    </div>
  );
}
