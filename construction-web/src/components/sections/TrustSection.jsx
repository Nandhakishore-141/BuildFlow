import { motion } from 'framer-motion';
import { TRUST_COMPANIES } from '@/constants';

export function TrustSection() {
  return (
    <section className="py-14 border-y border-neutral-100 bg-neutral-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-neutral-400 mb-8"
        >
          Trusted by Contractors, Engineers and Homeowners
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {TRUST_COMPANIES.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-lg font-bold text-neutral-300 tracking-tight select-none hover:text-neutral-400 transition-colors duration-300"
            >
              {company}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
