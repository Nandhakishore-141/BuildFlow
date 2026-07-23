import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TimelinePlaceholder } from '@/components/common/TimelinePlaceholder';
import { GalleryPlaceholder } from '@/components/common/GalleryPlaceholder';

export const HomeownerProgress = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Construction Progress" 
        description="Track milestones and view photo updates from your contractor."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-6">Latest Photo Updates</h2>
            <GalleryPlaceholder count={6} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Milestone Timeline</h2>
            <TimelinePlaceholder items={5} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
