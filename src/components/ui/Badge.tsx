import { ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, LucideIcon } from 'lucide-react';
import { classNames } from '@/utils/format';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    info: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };
  return (
    <span className={classNames('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeProps['variant']; icon: LucideIcon }> = {
    pending: { variant: 'warning', icon: AlertCircle },
    confirmed: { variant: 'info', icon: Info },
    processing: { variant: 'info', icon: Info },
    shipped: { variant: 'info', icon: Info },
    delivered: { variant: 'success', icon: CheckCircle2 },
    cancelled: { variant: 'error', icon: XCircle },
    refunded: { variant: 'default', icon: XCircle },
    paid: { variant: 'success', icon: CheckCircle2 },
    failed: { variant: 'error', icon: XCircle },
    active: { variant: 'success', icon: CheckCircle2 },
    inactive: { variant: 'default', icon: AlertCircle },
    out_of_stock: { variant: 'error', icon: XCircle },
  };
  const config = map[status] || { variant: 'default', icon: Info };
  const Icon = config.icon;
  return (
    <Badge variant={config.variant}>
      <Icon className="h-3 w-3" />
      <span className="capitalize">{status.replace(/_/g, ' ')}</span>
    </Badge>
  );
}
