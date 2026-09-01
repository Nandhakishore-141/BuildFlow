import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export const PasswordInput = React.forwardRef(({
  label,
  error,
  className,
  id,
  value,
  onChange,
  showStrength = true,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    if (onChange) onChange(e);
  };

  const rules = [
    { label: 'At least 8 characters', met: localValue.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(localValue) },
    { label: 'One lowercase letter', met: /[a-z]/.test(localValue) },
    { label: 'One number', met: /[0-9]/.test(localValue) },
    { label: 'One special character', met: /[@$!%*?&]/.test(localValue) }
  ];

  const showRequirements = showStrength && localValue.length > 0;

  return (
    <div className="w-full mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          value={value !== undefined ? value : localValue}
          onChange={handleChange}
          className={cn(
            'w-full pl-4 pr-12 py-3 text-sm text-zinc-100 placeholder-zinc-500 bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-gold-500/80 focus:ring-2 focus:ring-gold-500/20 transition-all duration-200',
            error && 'border-red-500/80 focus:border-red-500 bg-red-500/5',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
          tabIndex="-1"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {showRequirements && (
        <div className="mt-3 space-y-1.5 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs font-medium">
              {rule.met ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              )}
              <span className={rule.met ? 'text-emerald-400' : 'text-zinc-500'}>{rule.label}</span>
            </div>
          ))}
        </div>
      )}

      {error && !showRequirements && (
        <p className="mt-1.5 text-xs text-red-400 font-medium flex items-center gap-1">
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
