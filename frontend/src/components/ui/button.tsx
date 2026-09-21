import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent' | 'amber';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-[10px] font-body text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variantStyles: Record<string, string> = {
      default:
        'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm shadow-primary-600/20 dark:bg-primary-600 dark:hover:bg-primary-500',
      secondary:
        'bg-white text-ink border border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-surface-dark dark:text-slate-200 dark:border-border-dark dark:hover:bg-surface-raised',
      outline:
        'border border-slate-200 bg-transparent hover:bg-slate-100/60 text-slate-700 dark:border-border-dark dark:text-slate-300 dark:hover:bg-surface-raised dark:hover:text-white',
      ghost:
        'text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-surface-raised dark:hover:text-primary-400',
      destructive:
        'bg-danger-600 text-white hover:bg-danger-700 shadow-sm shadow-danger-600/20 dark:bg-danger-600 dark:hover:bg-danger-500',
      accent:
        'bg-accent-500 text-white hover:bg-accent-600 shadow-sm shadow-accent-500/20 dark:bg-accent-500 dark:hover:bg-accent-400 dark:text-slate-950 font-semibold',
      amber:
        'bg-gold-500 text-slate-950 hover:bg-gold-600 shadow-sm shadow-gold-500/20 font-semibold dark:bg-gold-400 dark:hover:bg-gold-500',
    };

    const sizeStyles: Record<string, string> = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-12 rounded-[10px] px-6 text-base',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
