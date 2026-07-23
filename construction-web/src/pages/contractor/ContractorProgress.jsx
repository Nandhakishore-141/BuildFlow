import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TimelinePlaceholder } from '@/components/common/TimelinePlaceholder';
import { GalleryPlaceholder } from '@/components/common/GalleryPlaceholder';
import { Button } from '@/components/common/Button';
import { CheckCircle } from 'lucide-react';

export const ContractorProgress = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Progress Reviews" 
        description="Review updates from your workers and share progress with homeowners."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Recent Photo Uploads</h2>
              <select className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
                <option value="all">All Projects</option>
              </select>
            </div>
            <GalleryPlaceholder count={8} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Pending Approvals</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gold-200 bg-gold-50">
                <p className="font-semibold text-gold-900 text-sm">Foundation Poured</p>
                <p className="text-xs text-gold-700 mt-1">Uploaded by Mike Smith • 2h ago</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="w-full text-xs bg-gold-600 hover:bg-gold-700 text-white border-0">Approve</Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">Reject</Button>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-gold-200 bg-gold-50">
                <p className="font-semibold text-gold-900 text-sm">Drywall Installation</p>
                <p className="text-xs text-gold-700 mt-1">Uploaded by Sarah Jones • 5h ago</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="w-full text-xs bg-gold-600 hover:bg-gold-700 text-white border-0">Approve</Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">Reject</Button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Project Timeline</h2>
            <TimelinePlaceholder items={4} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
