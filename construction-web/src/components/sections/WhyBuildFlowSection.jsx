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
        <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
          {/* Traditional Column */}
          <div className="bg-neutral-50 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-neutral-200 flex items-center justify-center">
                <HiOutlineX className="w-4 h-4 text-neutral-500" />
              </div>
              <h3 className="text-lg font-bold text-neutral-400">
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
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                    <HiOutlineX className="w-3 h-3 text-neutral-400" />
                  </div>
                  <span className="text-sm text-neutral-500 line-through decoration-neutral-300">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* BuildFlow Column */}
          <div className="bg-neutral-900 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <HiOutlineCheck className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">BuildFlow</h3>
            </div>
            <ul className="space-y-4">
              {BUILDFLOW_METHODS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
                    <HiOutlineCheck className="w-3 h-3 text-gold-400" />
                  </div>
                  <span className="text-sm text-neutral-200">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
