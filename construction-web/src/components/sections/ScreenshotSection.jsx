import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SectionHeading } from '@/components/common/SectionHeading';

function LaptopMockup() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Glow */}
      <div className="absolute -inset-8 bg-gradient-to-b from-gold-500/10 via-gold-500/5 to-transparent rounded-3xl blur-3xl" />

      {/* Laptop Frame */}
      <div className="relative">
        {/* Screen */}
        <div className="relative bg-neutral-900 rounded-t-xl border border-neutral-700 overflow-hidden shadow-2xl">
          {/* Browser Chrome */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-800 border-b border-neutral-700">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <div className="flex-1 flex justify-center">
              <div className="px-12 py-1 bg-neutral-700/50 rounded-md text-[10px] text-neutral-400">
                app.buildflow.io
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 md:p-6 space-y-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg gradient-gold" />
                <div className="h-3 w-24 bg-neutral-700 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-20 bg-neutral-800 rounded-lg" />
                <div className="w-7 h-7 rounded-full bg-neutral-700" />
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-3">
              {['#D4AF37', '#10B981', '#3B82F6', '#F59E0B'].map((color, i) => (
                <div
                  key={i}
                  className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50"
                >
                  <div className="h-2 w-16 bg-neutral-700 rounded mb-2" />
                  <div className="h-5 w-12 bg-neutral-600 rounded mb-1" />
                  <div
                    className="h-1.5 w-20 rounded-full mt-2"
                    style={{ backgroundColor: `${color}30` }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: color,
                        width: `${60 + i * 10}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Chart Area */}
              <div className="col-span-2 bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                <div className="h-2 w-20 bg-neutral-700 rounded mb-4" />
                <div className="flex items-end gap-2 h-24">
                  {[45, 72, 55, 88, 65, 78, 92, 60, 85, 70, 95, 82].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gold-500/40"
                        style={{ height: `${h}%` }}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Kanban Mini */}
              <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                <div className="h-2 w-16 bg-neutral-700 rounded mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-5 bg-neutral-700/60 rounded border border-neutral-600/30 px-2 flex items-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-gold-500/60 mr-2" />
                      <div className="h-1.5 flex-1 bg-neutral-600 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
              <div className="h-2 w-24 bg-neutral-700 rounded mb-3" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2 border-b border-neutral-700/30 last:border-0"
                  >
                    <div className="w-6 h-6 rounded-full bg-neutral-700" />
                    <div className="h-2 w-28 bg-neutral-700 rounded" />
                    <div className="h-2 w-16 bg-neutral-700/50 rounded ml-auto" />
                    <div className="h-4 w-14 bg-gold-500/20 rounded text-[8px] text-gold-400 flex items-center justify-center">
                      Active
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Base */}
        <div className="relative h-4 bg-gradient-to-b from-neutral-700 to-neutral-600 rounded-b-lg">
          <div className="absolute inset-x-0 -bottom-px h-1 bg-neutral-500 rounded-b-lg" />
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-1 bg-neutral-500 rounded-b" />
        </div>
      </div>
    </div>
  );
}

export function ScreenshotSection() {
  return (
    <SectionWrapper variant="alt">
      <SectionHeading
        label="Dashboard Preview"
        title="Your Command Center"
        description="A powerful, intuitive dashboard that puts everything you need at your fingertips."
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <LaptopMockup />
      </motion.div>
    </SectionWrapper>
  );
}
