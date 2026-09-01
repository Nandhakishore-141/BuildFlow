import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function AuthCard({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-xl',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
