import { motion } from 'framer-motion';
import { HiOutlineX, HiOutlineCheck } from 'react-icons/hi';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TRADITIONAL_METHODS, BUILDFLOW_METHODS } from '@/constants';

export function WhyBuildFlowSection() {
  return (
    <SectionWrapper id="about">
      <SectionHeading
        label="Why BuildFlow"
        title="Upgrade From Chaos to Clarity"
        description="See how BuildFlow replaces fragmented tools with one powerful platform."
      />

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black/40">
          {/* Traditional Column */}
          <div className="bg-zinc-950 p-8 border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <HiOutlineX className="w-4 h-4 text-zinc-500" />
              </div>
              <h3 className="text-lg font-bold text-zinc-500">
                Traditional
              </h3>
            </div>
            <ul className="space-y-4">
              {TRADITIONAL_METHODS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <HiOutlineX className="w-3 h-3 text-zinc-600" />
                  </div>
                  <span className="text-sm text-zinc-500 line-through decoration-zinc-700">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* BuildFlow Column */}
          <div className="bg-zinc-900/90 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-xs">
                <HiOutlineCheck className="w-4 h-4 text-zinc-950 font-bold" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100">BuildFlow</h3>
            </div>
            <ul className="space-y-4">
              {BUILDFLOW_METHODS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                    <HiOutlineCheck className="w-3 h-3 text-gold-400" />
                  </div>
                  <span className="text-sm text-zinc-200 font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
