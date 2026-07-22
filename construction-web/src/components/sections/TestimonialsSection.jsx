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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="relative p-6 rounded-xl border border-neutral-200/80 bg-white hover:border-gold-200 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <HiOutlineStar
            key={i}
            className="w-4 h-4 text-gold-500 fill-gold-500"
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-sm text-neutral-600 leading-relaxed mb-6">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-xs font-bold">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            {testimonial.name}
          </p>
          <p className="text-xs text-neutral-400">
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
