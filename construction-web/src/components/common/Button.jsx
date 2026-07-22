import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const variantStyles = {
  primary:
    'bg-gold-500 text-white hover:bg-gold-600 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30',
  secondary:
    'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/20',
  outline:
    'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300',
  ghost: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
