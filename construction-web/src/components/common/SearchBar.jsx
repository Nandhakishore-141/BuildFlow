import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export const SearchBar = ({ placeholder = "Search...", className, ...props }) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <input 
        type="text"
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all placeholder:text-neutral-400"
        {...props}
      />
    </div>
  );
};
