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
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={cn(
        'relative flex flex-col p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden',
        isSelected
          ? 'bg-neutral-900 border-neutral-800 text-white shadow-xl shadow-neutral-950/20'
          : 'bg-white border-neutral-200 hover:border-gold-300 hover:shadow-lg hover:shadow-gold-500/5 text-neutral-800'
      )}
    >
      {/* Checkmark indicator */}
      <div
        className={cn(
          'absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300',
          isSelected
            ? 'bg-gold-500 border-gold-500 text-neutral-900 scale-100'
            : 'border-neutral-300 bg-neutral-50 scale-75 opacity-0 group-hover:opacity-100'
        )}
      >
        {isSelected && <HiOutlineCheck className="w-4 h-4 text-white stroke-[3px]" />}
      </div>

      {/* Emoji Header */}
      <div
        className={cn(
          'w-12 h-12 text-2xl rounded-xl flex items-center justify-center mb-5 shrink-0 select-none',
          isSelected ? 'bg-neutral-800' : 'bg-gold-50'
        )}
      >
        {emoji}
      </div>

      {/* Content */}
      <h3 className={cn('text-lg font-bold mb-1.5', isSelected ? 'text-white' : 'text-neutral-900')}>
        {role}
      </h3>
      <p className={cn('text-xs mb-5 leading-relaxed', isSelected ? 'text-neutral-400' : 'text-neutral-500')}>
        {description}
      </p>

      {/* Features List */}
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center shrink-0',
                isSelected ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-50 text-gold-600'
              )}
            >
              <HiOutlineCheck className="w-2.5 h-2.5" />
            </div>
            <span className={cn('text-xs', isSelected ? 'text-neutral-300' : 'text-neutral-600')}>
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
            ? 'bg-gold-500 hover:bg-gold-600 text-neutral-950 font-extrabold'
            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
        )}
      >
        Continue
      </button>
    </motion.div>
  );
}
