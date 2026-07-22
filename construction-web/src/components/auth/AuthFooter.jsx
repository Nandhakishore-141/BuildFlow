import { cn } from '@/utils/cn';

export function AuthFooter({ className }) {
  return (
    <div
      className={cn(
        'mt-8 text-center text-xs text-neutral-400 flex items-center justify-center gap-4',
        className
      )}
    >
      <a href="#" className="hover:text-neutral-600 transition-colors">
        Terms of Service
      </a>
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 shrink-0" />
      <a href="#" className="hover:text-neutral-600 transition-colors">
        Privacy Policy
      </a>
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 shrink-0" />
      <a href="#" className="hover:text-neutral-600 transition-colors">
        Contact Help
      </a>
    </div>
  );
}
