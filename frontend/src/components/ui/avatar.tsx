import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'student' | 'parent' | 'mentor' | 'recruiter' | 'default';
}

export function Avatar({
  name = 'User',
  src,
  size = 'md',
  variant = 'default',
  className,
  ...props
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  const variantClasses = {
    default: 'bg-primary-950/60 text-primary-300 border border-primary-500/30',
    student: 'bg-primary-950/60 text-primary-300 border border-primary-500/30',
    parent: 'bg-amber-950/60 text-amber-300 border border-amber-500/30',
    mentor: 'bg-teal-950/60 text-teal-300 border border-teal-500/30',
    recruiter: 'bg-rose-950/60 text-rose-300 border border-rose-500/30',
  };

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full font-heading font-semibold select-none overflow-hidden',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
