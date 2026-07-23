import { cn } from '@/utils/cn';

export const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-500 mt-1 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};
