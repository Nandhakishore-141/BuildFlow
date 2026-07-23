import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Activity } from 'lucide-react';
import * as adminService from '@/services/adminService';

export const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { adminService.getAnalytics().finally(() => setIsLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Analytics" description="System health, adoption rates, and revenue metrics." />
      <SectionCard>
        {isLoading ? <div className="h-64 animate-pulse bg-neutral-50 rounded-lg"></div> : (
          <EmptyState icon={Activity} title="Analytics Not Ready" description="Data visualization dashboards are being generated." />
        )}
      </SectionCard>
    </div>
  );
};
