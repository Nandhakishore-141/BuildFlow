import { motion } from 'framer-motion';
import { HiOutlineCheck } from 'react-icons/hi';
import { cn } from '@/utils/cn';

export function RoleCard({
  emoji,
  role,
  description,
  features = [],
  isSelected = false,
  onSelect,
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={cn(
        'relative flex flex-col p-6 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-md',
        isSelected
          ? 'bg-zinc-900 border-gold-500/80 text-zinc-100 shadow-xl shadow-gold-500/5 ring-1 ring-gold-500/50'
          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90 text-zinc-300'
      )}
    >
      {/* Checkmark indicator */}
      <div
        className={cn(
          'absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200',
          isSelected
            ? 'bg-gold-500 border-gold-500 text-zinc-950 scale-100'
            : 'border-zinc-700 bg-zinc-800 scale-75 opacity-0 group-hover:opacity-100'
        )}
      >
        {isSelected && <HiOutlineCheck className="w-4 h-4 text-zinc-950 stroke-[3px]" />}
      </div>

      {/* Emoji Header */}
      <div
        className={cn(
          'w-12 h-12 text-2xl rounded-xl flex items-center justify-center mb-5 shrink-0 select-none border',
          isSelected ? 'bg-gold-500/15 border-gold-500/30' : 'bg-zinc-800 border-zinc-700/60'
        )}
      >
        {emoji}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold mb-1.5 text-zinc-100">
        {role}
      </h3>
      <p className="text-xs mb-5 leading-relaxed text-zinc-400">
        {description}
      </p>

      {/* Features List */}
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                isSelected ? 'bg-gold-500/20 text-gold-400' : 'bg-zinc-800 text-zinc-500'
              )}
            >
              <HiOutlineCheck className="w-2.5 h-2.5" />
            </div>
            <span className={cn('text-xs', isSelected ? 'text-zinc-200' : 'text-zinc-400')}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Continue Action */}
      <button
        type="button"
        className={cn(
          'w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer',
          isSelected
            ? 'bg-gold-500 hover:bg-gold-400 text-zinc-950 font-extrabold'
            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
        )}
      >
        Continue
      </button>
    </motion.div>
  );
}
