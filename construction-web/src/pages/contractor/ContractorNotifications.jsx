import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { Bell, BellOff, AlertCircle } from 'lucide-react';
import * as notificationService from '@/services/notificationService';

export const ContractorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await notificationService.getNotifications();
        setNotifications(res.data?.notifications || []);
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load notifications.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        description="View alerts, updates, and messages."
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
            <button className="py-4 text-sm font-medium text-gold-600 border-b-2 border-gold-600">Unread (0)</button>
            <button className="py-4 text-sm font-medium text-neutral-500 hover:text-neutral-700">All Notifications</button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-neutral-500 animate-pulse">Loading notifications...</div>
        ) : error === '404' ? (
          <div className="p-8">
            <EmptyState 
              icon={AlertCircle}
              title="Feature Not Yet Connected"
              description="The backend endpoint for Notifications (/api/notifications) is not yet implemented."
            />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-8">
            <EmptyState 
              icon={Bell}
              title="You're all caught up"
              description="There are no new notifications at this time."
            />
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {/* Render real notifications here */}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
