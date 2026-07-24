import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import * as notificationService from '@/services/notificationService';

export const HomeownerNotifications = () => {
  const [data, setData] = useState({ data: [], unread: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications('homeowner');
      setData(res.data || { data: [], unread: 0 });
    } catch (err) {
      setError('Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markNotificationRead(id, 'homeowner');
      setData((prev) => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
        data: prev.data.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        description="View project updates and contractor messages."
      />

      <SectionCard>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-neutral-900">
            {data.unread > 0 ? `${data.unread} Unread Notifications` : 'All Notifications'}
          </h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500 animate-pulse">Loading notifications...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : data.data.length === 0 ? (
          <EmptyState 
            icon={Bell}
            title="You're all caught up"
            description="There are no new notifications at this time."
          />
        ) : (
          <div className="divide-y divide-neutral-100">
            {data.data.map(notification => (
              <div 
                key={notification.id} 
                className={`py-4 flex items-start gap-4 ${!notification.is_read ? 'bg-blue-50/50 -mx-6 px-6' : ''}`}
              >
                <div className={`p-2 rounded-full ${!notification.is_read ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-500'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm ${!notification.is_read ? 'font-bold text-neutral-900' : 'font-semibold text-neutral-700'}`}>
                    {notification.title}
                  </h4>
                  <p className={`text-sm mt-1 ${!notification.is_read ? 'text-neutral-700' : 'text-neutral-500'}`}>
                    {notification.message}
                  </p>
                  <span className="text-xs text-neutral-400 font-medium block mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
                {!notification.is_read && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="shrink-0"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
