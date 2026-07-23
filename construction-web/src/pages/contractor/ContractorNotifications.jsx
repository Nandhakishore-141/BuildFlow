import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const ContractorNotifications = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        description="View your alerts, messages, and updates."
        action={
          <Button variant="outline" className="gap-2">
            <BellOff className="w-4 h-4" />
            Mark all as read
          </Button>
        }
      />

      <SectionCard noPadding>
        <div className="border-b border-neutral-200">
          <div className="flex space-x-8 px-6">
            <button className="py-4 text-sm font-medium text-gold-600 border-b-2 border-gold-600">Unread (2)</button>
            <button className="py-4 text-sm font-medium text-neutral-500 hover:text-neutral-700">All Notifications</button>
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          <div className="p-6 bg-gold-50/50 hover:bg-neutral-50 transition-colors flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">New Worker Joined</p>
              <p className="text-sm text-neutral-600 mt-1">Michael Smith has completed registration and is awaiting project assignment.</p>
              <p className="text-xs text-neutral-400 mt-2">2 hours ago</p>
            </div>
          </div>
          
          <div className="p-6 bg-gold-50/50 hover:bg-neutral-50 transition-colors flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Material Delivery</p>
              <p className="text-sm text-neutral-600 mt-1">Order #8922 for Downtown Skyscraper has been delivered to the site.</p>
              <p className="text-xs text-neutral-400 mt-2">5 hours ago</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};
