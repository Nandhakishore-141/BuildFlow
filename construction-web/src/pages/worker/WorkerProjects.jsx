import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/common/Button';
import { Briefcase } from 'lucide-react';

export const WorkerProjects = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assigned Projects" 
        description="View details for the construction projects you are currently assigned to."
      />

      <SectionCard>
        <div className="grid grid-cols-1 gap-6">
          <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Downtown Skyscraper</h3>
                <p className="text-neutral-500 text-sm mt-1">123 Main St • Supervisor: John Builder</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">Active</span>
                <Button variant="outline" size="sm">View Instructions</Button>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-sm text-neutral-700">
              <p><span className="font-semibold text-neutral-900">Your Role:</span> Master Electrician</p>
              <p className="mt-1"><span className="font-semibold text-neutral-900">Schedule:</span> Mon-Fri, 8:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
