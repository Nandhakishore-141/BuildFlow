import { cn } from '@/utils/cn';

export function SectionHeading({
  label,
  title,
  description,
  align = 'center',
}) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center mx-auto max-w-2xl',
      )}
    >
      {label && (
        <span className="inline-block mb-3 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/10 rounded-full border border-gold-500/20 shadow-xs">
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-zinc-100">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-400">
          {description}
        </p>
      )}
    </div>
  );
}
