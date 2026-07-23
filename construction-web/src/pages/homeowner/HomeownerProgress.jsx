import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TimelinePlaceholder } from '@/components/common/TimelinePlaceholder';
import { Camera, AlertCircle } from 'lucide-react';
import * as progressService from '@/services/progressService';

export const HomeownerProgress = () => {
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
        else setError('Failed to load progress tracking.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Live Progress" 
        description="View live photos and timeline updates from your contractor."
      />

      <SectionCard>
        {isLoading ? (
          <TimelinePlaceholder steps={4} />
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Progress (/api/progress) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : !data?.timeline?.length ? (
          <EmptyState 
            icon={Camera}
            title="No updates yet"
            description="Your contractor has not uploaded any progress photos or timeline updates."
          />
        ) : (
          <div>{/* Render real progress here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
