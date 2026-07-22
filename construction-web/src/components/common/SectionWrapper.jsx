import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function SectionWrapper({
  children,
  className,
  id,
  variant = 'default',
}) {
  const bgStyles = {
    default: 'bg-white',
    alt: 'section-gradient',
    dark: 'bg-neutral-950 text-white',
  };

  return (
    <section id={id} className={cn('py-20 md:py-28', bgStyles[variant], className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.div>
    </section>
  );
}
