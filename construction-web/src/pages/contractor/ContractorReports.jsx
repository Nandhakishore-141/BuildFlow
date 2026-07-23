import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { BarChart2, Download, AlertCircle } from 'lucide-react';
import * as reportService from '@/services/reportService';

export const ContractorReports = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await reportService.getReports();
        setData(res.data || {});
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load reports.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports & Analytics" 
        description="Generate comprehensive reports on budget, timeline, and workforce."
        action={
          <Button variant="primary" className="gap-2">
            <Download className="w-4 h-4" />
            Generate New Report
          </Button>
        }
      />

      <SectionCard>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg animate-pulse">
            <p className="text-neutral-400 font-medium">Loading analytics...</p>
          </div>
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Reports (/api/reports) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : !data?.reports?.length ? (
          <EmptyState 
            icon={BarChart2}
            title="No reports generated"
            description="You haven't generated any reports yet."
          />
        ) : (
          <div>{/* Render real charts here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
