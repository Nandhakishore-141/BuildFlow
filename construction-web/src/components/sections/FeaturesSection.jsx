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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group relative p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/60 hover:border-gold-500/40 hover:bg-zinc-900/90 transition-all duration-200 backdrop-blur-sm shadow-sm"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500/10 text-gold-400 group-hover:bg-gold-500 group-hover:text-zinc-950 transition-colors duration-200 mb-4 border border-gold-500/20">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <h3 className="text-base font-bold text-zinc-100 mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed">
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
