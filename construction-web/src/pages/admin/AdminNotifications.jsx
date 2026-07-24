import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminNotificationsContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(err.response?.data?.message || 'Failed to load system notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      alert("Failed to update notification");
    }
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'Unread') return !n.is_read;
    if (filter === 'Read') return n.is_read;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Notifications" 
        description="Monitor platform events, system alerts, user actions, and automated notifications."
        action={
          <Button variant="outline" size="sm" onClick={fetchNotifications} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      <SectionCard>
        <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-4">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Filter:</span>
          {['All', 'Unread', 'Read'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === f 
                  ? 'bg-neutral-900 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <TablePlaceholder columns={4} rows={5} />
        ) : error ? (
          <ErrorState title="Unable to load notifications" description={error} onRetry={fetchNotifications} />
        ) : filteredNotifs.length === 0 ? (
          <EmptyState icon={Bell} title="No Notifications" description={filter === 'All' ? "System is operating normally." : `No ${filter.toLowerCase()} notifications found.`} />
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map(n => (
              <div 
                key={n.id} 
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  n.is_read 
                    ? 'bg-white border-neutral-200 opacity-80' 
                    : 'bg-gold-50/50 border-gold-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    n.is_read ? 'bg-neutral-100 text-neutral-500' : 'bg-gold-100 text-gold-700'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-neutral-900">{n.title}</h4>
                      {n.user_name && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
                          {n.user_name} ({n.user_role || 'User'})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[11px] text-neutral-400 mt-2 block">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                    </span>
                  </div>
                </div>

                {!n.is_read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleMarkRead(n.id)} 
                    className="text-xs text-gold-700 hover:text-gold-900 shrink-0 gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
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

export const AdminNotifications = () => (
  <ErrorBoundary>
    <AdminNotificationsContent />
  </ErrorBoundary>
);
