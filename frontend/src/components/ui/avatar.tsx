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
    default: 'bg-zinc-100 text-zinc-900 border border-zinc-300',
    student: 'bg-black text-white border border-zinc-900',
    parent: 'bg-zinc-100 text-zinc-900 border border-zinc-300',
    mentor: 'bg-zinc-900 text-white border border-zinc-800',
    recruiter: 'bg-zinc-200 text-zinc-900 border border-zinc-300',
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
