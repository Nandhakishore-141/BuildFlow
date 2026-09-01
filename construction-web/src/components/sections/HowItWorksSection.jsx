import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import { HOW_IT_WORKS_STEPS } from '@/constants';

export function HowItWorksSection() {
  return (
    <SectionWrapper id="how-it-works" variant="alt">
      <SectionHeading
        label="How It Works"
        title="From Project Kickoff to Completion"
        description="A seamless workflow that keeps everyone aligned and every milestone visible."
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/40 via-gold-500/20 to-zinc-800" />

        <div className="space-y-2">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="relative flex items-start gap-5 md:gap-6 group"
            >
              {/* Step Number */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-gold-500/40 bg-zinc-900 group-hover:border-gold-500 transition-colors duration-200 shrink-0 shadow-md">
                <span className="text-sm md:text-base font-bold text-gold-400">
                  {step.step}
                </span>
              </div>

              {/* Content */}
              <div className="pt-2 md:pt-3 pb-8">
                <h3 className="text-base md:text-lg font-bold text-zinc-100 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
