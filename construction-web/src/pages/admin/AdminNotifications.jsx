import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Bell } from 'lucide-react';

export const AdminNotifications = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="System Notifications" description="View system alerts and errors." />
      <SectionCard>
        <EmptyState icon={Bell} title="No Notifications" description="System is operating normally." />
      </SectionCard>
    </div>
  );
};
