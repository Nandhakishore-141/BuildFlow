import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Bell, AlertCircle } from 'lucide-react';
import * as notificationService from '@/services/notificationService';

export const HomeownerNotifications = () => {
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
        description="View project updates and contractor messages."
      />

      <SectionCard>
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500 animate-pulse">Loading notifications...</div>
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Notifications (/api/notifications) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : notifications.length === 0 ? (
          <EmptyState 
            icon={Bell}
            title="You're all caught up"
            description="There are no new notifications at this time."
          />
        ) : (
          <div className="divide-y divide-neutral-100">
            {/* Render real notifications here */}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
