import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TimelinePlaceholder } from '@/components/common/TimelinePlaceholder';
import { GalleryPlaceholder } from '@/components/common/GalleryPlaceholder';
import { Button } from '@/components/common/Button';
import { Camera, AlertCircle } from 'lucide-react';
import * as progressService from '@/services/progressService';

export const ContractorProgress = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await progressService.getProgress();
        setData(res.data || {});
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load progress.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Progress & Photos" 
        description="Review site photos and track phase completions."
        action={
          <Button variant="primary" className="gap-2">
            <Camera className="w-4 h-4" />
            Upload Photos
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Recent Uploads</h2>
            {isLoading ? (
              <GalleryPlaceholder count={6} />
            ) : error === '404' ? (
              <EmptyState 
                icon={AlertCircle}
                title="Feature Not Yet Connected"
                description="The backend endpoint for Progress (/api/progress) is not yet implemented."
              />
            ) : error ? (
              <div className="text-center py-8 text-red-500 font-medium">{error}</div>
            ) : !data?.photos?.length ? (
              <EmptyState 
                icon={Camera}
                title="No photos found"
                description="No progress photos have been uploaded yet."
              />
            ) : (
              <div>{/* Render real photos here */}</div>
            )}
          </SectionCard>
        </div>
        
        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Project Timeline</h2>
            {isLoading ? (
              <TimelinePlaceholder steps={5} />
            ) : error === '404' ? (
              <EmptyState 
                icon={AlertCircle}
                title="Pending Backend"
                description="Timeline feature requires backend API."
              />
            ) : error ? (
              <div className="text-center py-4 text-red-500 text-sm font-medium">{error}</div>
            ) : !data?.timeline?.length ? (
              <p className="text-sm text-neutral-500">No timeline data available.</p>
            ) : (
              <div>{/* Render timeline here */}</div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
