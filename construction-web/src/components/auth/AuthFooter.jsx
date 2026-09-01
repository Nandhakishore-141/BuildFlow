import { cn } from '@/utils/cn';

export function AuthFooter({ className }) {
  return (
    <div
      className={cn(
        'mt-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-4',
        className
      )}
    >
      <a href="#" className="hover:text-zinc-300 transition-colors">
        Terms of Service
      </a>
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
      <a href="#" className="hover:text-zinc-300 transition-colors">
        Privacy Policy
      </a>
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
      <a href="#" className="hover:text-zinc-300 transition-colors">
        Contact Help
      </a>
    </div>
  );
}
