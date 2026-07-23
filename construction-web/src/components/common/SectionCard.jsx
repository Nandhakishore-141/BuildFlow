import { cn } from '@/utils/cn';

export const SectionCard = ({ children, className, noPadding = false }) => {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden",
      !noPadding && "p-6",
      className
    )}>
      {children}
    </div>
  );
};
