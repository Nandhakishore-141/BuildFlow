import { cn } from '@/utils/cn';

export function SectionHeading({
  label,
  title,
  description,
  align = 'center',
  dark = false,
}) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center mx-auto max-w-2xl',
      )}
    >
      {label && (
        <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 rounded-full border border-gold-100">
          {label}
        </span>
      )}
      <h2
        className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight',
          dark ? 'text-white' : 'text-neutral-900',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-lg leading-relaxed',
            dark ? 'text-neutral-400' : 'text-neutral-500',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
