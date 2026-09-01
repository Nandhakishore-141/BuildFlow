import { motion } from 'framer-motion';
import { HiOutlineStar } from 'react-icons/hi';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import { TESTIMONIALS } from '@/constants';

function TestimonialCard({
  testimonial,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="relative p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/60 hover:border-gold-500/30 hover:bg-zinc-900/90 transition-all duration-200 backdrop-blur-sm shadow-sm"
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <HiOutlineStar
            key={i}
            className="w-4 h-4 text-gold-400 fill-gold-400"
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-sm text-zinc-300 leading-relaxed mb-6">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-zinc-950 text-xs font-bold shadow-xs">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-100">
            {testimonial.name}
          </p>
          <p className="text-xs text-zinc-400">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <SectionWrapper>
      <SectionHeading
        label="Testimonials"
        title="Trusted by Construction Professionals"
        description="Hear from contractors, homeowners, and engineers who have transformed their workflow."
      />

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {TESTIMONIALS.map((testimonial, i) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={i}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
