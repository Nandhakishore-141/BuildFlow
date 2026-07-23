import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Briefcase } from 'lucide-react';

export const HomeownerProjects = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Properties" 
        description="View details and completion estimates for your ongoing construction projects."
      />

      <SectionCard>
        <div className="grid grid-cols-1 gap-6">
          <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Suburban Family Home</h3>
                <p className="text-neutral-500 text-sm mt-1">123 Meadow Lane • Contractor: Mehta & Co.</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-neutral-900">Expected Completion</p>
                <p className="text-emerald-600 font-bold">Dec 2026</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-neutral-700">Current Phase: Framing</span>
                <span className="font-bold text-gold-600">35%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5">
                <div className="bg-gold-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
