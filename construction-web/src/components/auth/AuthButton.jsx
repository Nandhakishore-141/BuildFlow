import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function AuthButton({
  children,
  type = 'submit',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className,
  onClick,
  ...props
}) {
  const baseStyles = 'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';
  
  const variants = {
    primary: 'bg-gold-500 hover:bg-gold-400 text-zinc-950 shadow-lg shadow-gold-500/20 active:scale-[0.98]',
    outline: 'border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 active:scale-[0.98]',
    ghost: 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 active:scale-[0.98]',
  };

  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
