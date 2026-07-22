import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function AuthCard({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'w-full max-w-md bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-neutral-900/5',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
