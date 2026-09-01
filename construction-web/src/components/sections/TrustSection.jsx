import { motion } from 'framer-motion';
import { TRUST_COMPANIES } from '@/constants';

export function TrustSection() {
  return (
    <section className="py-14 border-y border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-zinc-500 mb-8"
        >
          Trusted by Contractors, Engineers and Homeowners
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {TRUST_COMPANIES.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-lg font-bold text-zinc-500 tracking-tight select-none hover:text-zinc-300 transition-colors duration-200"
            >
              {company}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
