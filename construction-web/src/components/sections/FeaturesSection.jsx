import { motion } from 'framer-motion';
import {
  FolderKanban,
  HardHat,
  Shield,
  Package,
  CalendarCheck,
  Receipt,
  GitBranch,
  Camera,
  Bell,
  BarChart3,
} from 'lucide-react';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';
import { FEATURES } from '@/constants';

const ICON_MAP = {
  FolderKanban,
  HardHat,
  Shield,
  Package,
  CalendarCheck,
  Receipt,
  GitBranch,
  Camera,
  Bell,
  BarChart3,
};

function FeatureCard({ feature, index }) {
  const Icon = ICON_MAP[feature.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative p-6 rounded-xl border border-neutral-200/80 bg-white hover:border-gold-200 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-50 text-gold-600 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300 mb-4">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <SectionWrapper id="features">
      <SectionHeading
        label="Features"
        title="Everything You Need to Build Better"
        description="A comprehensive suite of tools designed specifically for construction project management."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
