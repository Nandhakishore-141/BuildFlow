import { motion } from 'framer-motion';
import { HiOutlineStar, HiOutlineBriefcase, HiOutlineClock } from 'react-icons/hi';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import { WORKER_PROFILES } from '@/constants';
import { cn } from '@/utils/cn';

function WorkerCard({ worker, index }) {
  const availabilityColor = {
    Available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Busy: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Unavailable: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="group relative p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 hover:border-gold-500/30 hover:bg-zinc-900/90 transition-all duration-200 backdrop-blur-sm"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 text-zinc-950 font-bold text-sm shrink-0 shadow-sm">
          {worker.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-zinc-100 truncate">
              {worker.name}
            </h4>
            <span
              className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                availabilityColor[worker.availability],
              )}
            >
              {worker.availability}
            </span>
          </div>

          <p className="text-sm text-gold-400 font-semibold mb-3">{worker.skill}</p>

          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <HiOutlineBriefcase className="w-3.5 h-3.5 text-zinc-500" />
              {worker.experience}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineStar className="w-3.5 h-3.5 text-gold-500" />
              {worker.rating}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineClock className="w-3.5 h-3.5 text-zinc-500" />
              Full-time
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function WorkerMarketplaceSection() {
  return (
    <SectionWrapper id="solutions">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div>
          <SectionHeading
            label="Worker Marketplace"
            title="Find Skilled Workers Instantly"
            description="Workers create professional profiles showcasing their skills, experience, and ratings. Contractors browse, invite, and workers accept or decline — all within the platform."
            align="left"
          />

          <div className="space-y-4 mt-8">
            {[
              {
                title: 'Workers create their own profiles',
                desc: 'Showcase skills, certifications, and work history.',
              },
              {
                title: 'Contractors browse available workers',
                desc: 'Search by skill, experience, rating, and availability.',
              },
              {
                title: 'Contractors invite workers',
                desc: 'Send project invitations directly through the platform.',
              },
              {
                title: 'Workers accept or reject',
                desc: 'Workers review project details and decide to join.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 w-5 h-5 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">
                    {item.title}
                  </p>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right - Worker Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {WORKER_PROFILES.map((worker, i) => (
            <WorkerCard key={worker.id} worker={worker} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
