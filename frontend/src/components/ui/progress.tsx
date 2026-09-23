import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'primary' | 'accent' | 'gold';
}

export function Progress({
  value = 0,
  max = 100,
  variant = 'primary',
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantColors = {
    primary: 'bg-black',
    accent: 'bg-zinc-900',
    gold: 'bg-zinc-800',
  };

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-zinc-200', className)}
      {...props}
    >
      <div
        className={cn('h-full transition-all duration-300 ease-out rounded-full', variantColors[variant])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
