import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export const PasswordInput = React.forwardRef(({
  label,
  error,
  className,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'w-full pl-4 pr-12 py-3 text-sm text-neutral-900 placeholder-neutral-400 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 bg-red-50/10',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none"
          tabIndex="-1"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error.message || error}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
