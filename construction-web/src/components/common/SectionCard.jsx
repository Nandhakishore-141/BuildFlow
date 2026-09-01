import { cn } from '@/utils/cn';

export const SectionCard = ({ children, className, noPadding = false }) => {
  return (
    <div className={cn(
      "bg-zinc-900/80 rounded-xl border border-zinc-800/80 shadow-sm shadow-black/10 overflow-hidden backdrop-blur-sm",
      !noPadding && "p-6",
      className
    )}>
      {children}
    </div>
  );
};
