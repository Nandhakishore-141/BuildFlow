import { cn } from '@/utils/cn';

export const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 backdrop-blur-sm", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-4 text-zinc-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-bold text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-400 mt-1 max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};
