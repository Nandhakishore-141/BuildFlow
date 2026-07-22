import { motion } from 'framer-motion';
import { HiOutlineCheck } from 'react-icons/hi';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ROLES } from '@/constants';
import { cn } from '@/utils/cn';

function RoleCard({
  role,
  index,
}) {
  const isContractor = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className={cn(
        'relative rounded-2xl p-7 border transition-all duration-300 overflow-hidden',
        isContractor
          ? 'bg-neutral-900 border-neutral-700 text-white shadow-2xl shadow-neutral-900/30 scale-[1.02]'
          : 'bg-white border-neutral-200 hover:border-gold-200 hover:shadow-lg hover:shadow-gold-500/5',
      )}
    >
      {isContractor && (
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gold-500 text-white">
            Primary
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-5',
          isContractor ? 'bg-gold-500' : 'bg-gold-50',
        )}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isContractor ? 'white' : '#D4AF37'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {index === 0 && (
            <>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
          )}
          {index === 1 && (
            <>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </>
          )}
          {index === 2 && (
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </>
          )}
        </svg>
      </div>

      <h3
        className={cn(
          'text-xl font-bold mb-2',
          isContractor ? 'text-white' : 'text-neutral-900',
        )}
      >
        {role.role}
      </h3>
      <p
        className={cn(
          'text-sm mb-6 leading-relaxed',
          isContractor ? 'text-neutral-400' : 'text-neutral-500',
        )}
      >
        {role.description}
      </p>

      <ul className="space-y-3">
        {role.permissions.map((perm) => (
          <li key={perm} className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                isContractor
                  ? 'bg-gold-500/20 text-gold-400'
                  : 'bg-gold-50 text-gold-600',
              )}
            >
              <HiOutlineCheck className="w-3 h-3" />
            </div>
            <span
              className={cn(
                'text-sm',
                isContractor ? 'text-neutral-300' : 'text-neutral-600',
              )}
            >
              {perm}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function RoleBasedAccessSection() {
  return (
    <SectionWrapper variant="alt">
      <SectionHeading
        label="Role-Based Access"
        title="Tailored Experiences for Every Stakeholder"
        description="Each role gets a purpose-built interface with exactly the right level of access and functionality."
      />

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {ROLES.map((role, i) => (
          <RoleCard key={role.role} role={role} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
