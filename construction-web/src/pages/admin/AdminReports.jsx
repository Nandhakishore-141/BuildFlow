import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';
import * as adminService from '@/services/adminService';

export const AdminReports = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { adminService.getReports().finally(() => setIsLoading(false)); }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Reports" description="Generate and view global reports." />
      <SectionCard>
        {isLoading ? <div className="h-64 animate-pulse bg-neutral-50 rounded-lg"></div> : (
          <EmptyState icon={FileText} title="No Reports" description="Report generation module is currently inactive." />
        )}
      </SectionCard>
    </div>
  );
};
