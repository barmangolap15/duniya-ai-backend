import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'xp' | 'streak' | 'danger' | 'verified' | 'role';
  size?: 'default' | 'sm';
}

function Badge({ className, variant = 'default', size = 'default', ...props }: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default:
      'bg-primary-500/10 text-primary-400 border-primary-500/20 dark:bg-primary-950/50 dark:text-primary-300 dark:border-primary-500/30',
    secondary:
      'bg-surface-raised text-slate-300 border-border-dark',
    outline:
      'bg-transparent text-slate-300 border-border-dark',
    xp:
      'bg-accent-500/10 text-accent-400 border-accent-500/25 font-mono font-medium',
    streak:
      'bg-gold-500/10 text-gold-400 border-gold-500/25 font-mono font-medium',
    danger:
      'bg-danger-500/10 text-danger-400 border-danger-500/25',
    verified:
      'bg-accent-500/15 text-accent-400 border-accent-500/40 font-semibold',
    role:
      'bg-slate-800 text-slate-300 border-slate-700 font-mono tracking-wider uppercase',
  };

  const sizeStyles = {
    default: 'px-2.5 py-0.5 text-xs',
    sm: 'px-1.5 py-0.5 text-[10px]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-body transition-colors select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
