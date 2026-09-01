import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export const SearchBar = ({ placeholder = "Search...", value, onChange, className, ...props }) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange ? onChange(e.target.value) : undefined}
        className="w-full pl-9 pr-4 py-2 bg-zinc-900/90 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500/60 transition-all shadow-inner"
        {...props}
      />
    </div>
  );
};
