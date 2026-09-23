import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'xp' | 'streak' | 'danger' | 'verified' | 'role';
  size?: 'default' | 'sm';
}

function Badge({ className, variant = 'default', size = 'default', ...props }: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default:
      'bg-zinc-100 text-zinc-900 border-zinc-200',
    secondary:
      'bg-zinc-50 text-zinc-700 border-zinc-200',
    outline:
      'bg-white text-zinc-800 border-zinc-300',
    xp:
      'bg-black text-white border-black font-mono font-medium',
    streak:
      'bg-zinc-100 text-zinc-900 border-zinc-300 font-mono font-medium',
    danger:
      'bg-zinc-100 text-zinc-900 border-zinc-300',
    verified:
      'bg-black text-white border-black font-semibold',
    role:
      'bg-zinc-100 text-zinc-900 border-zinc-300 font-mono tracking-wider uppercase font-semibold',
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
