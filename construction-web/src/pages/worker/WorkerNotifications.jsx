import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Bell, Check, CheckCheck, RefreshCw, AlertCircle, Info, CalendarCheck, Megaphone, ListTodo } from 'lucide-react';
import * as workerService from '@/services/workerService';

const WorkerNotificationsContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await workerService.getNotifications();
      setNotifications(res.notifications || res.data || []);
    } catch (err) {
      console.error("Failed to load worker notifications:", err);
      setError(err.response?.data?.message || 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await workerService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Notifications" 
        description="View site updates, task assignments, supervisor announcements, and attendance notifications."
        action={
          <Button variant="outline" size="sm" onClick={fetchNotifications} className="gap-2 text-xs">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        }
      />

      <SectionCard>
        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'all' ? 'bg-gold-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'unread' ? 'bg-gold-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {unreadCount} New Notification{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isLoading ? (
          <TablePlaceholder columns={3} rows={5} />
        ) : error ? (
          <ErrorState title="Unable to load notifications" description={error} onRetry={fetchNotifications} />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState 
            icon={Bell}
            title={filter === 'unread' ? 'No unread notifications' : "You're all caught up"}
            description={filter === 'unread' ? 'You have read all your notifications.' : 'There are no notifications at this time.'}
          />
        ) : (
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white">
            {filteredNotifications.map(n => (
              <div 
                key={n.id} 
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  !n.is_read ? 'bg-amber-50/40 font-medium' : 'hover:bg-neutral-50/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    !n.is_read ? 'bg-gold-500 text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-neutral-900">{n.title}</h4>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-gold-500" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-neutral-400 font-mono block pt-0.5">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                    </span>
                  </div>
                </div>

                {!n.is_read && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs gap-1 shrink-0 font-bold hover:bg-gold-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Read
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

export const WorkerNotifications = () => (
  <ErrorBoundary>
    <WorkerNotificationsContent />
  </ErrorBoundary>
);
