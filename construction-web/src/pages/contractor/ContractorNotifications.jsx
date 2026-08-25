import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Bell, Check, RefreshCw } from 'lucide-react';
import * as contractorService from '@/services/contractorService';

const ContractorNotificationsContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await contractorService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(err.response?.data?.message || 'Failed to fetch notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkRead = async (id) => {
    try {
      await contractorService.markNotificationRead(id);
      fetchData();
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications & Alerts" 
        description="Contractor system alerts, invitations, proposal updates, and operational activity."
        action={
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-xs font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh Notifications
          </Button>
        }
      />

      <SectionCard title="Contractor Alert Feed">
        {isLoading ? (
          <TablePlaceholder columns={3} rows={4} />
        ) : error ? (
          <ErrorState title="Unable to load notifications" description={error} onRetry={fetchData} />
        ) : notifications.length === 0 ? (
          <EmptyState 
            icon={Bell}
            title="No notifications"
            description="You don't have any pending alerts or operational notifications."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div 
                key={n.id} 
                className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                  n.is_read ? 'bg-white border-neutral-200' : 'bg-gold-50/50 border-gold-200 font-medium'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Bell className={`w-4 h-4 ${n.is_read ? 'text-neutral-400' : 'text-gold-600'}`} />
                    <h4 className="font-bold text-neutral-900 text-sm">{n.title || 'System Notification'}</h4>
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-neutral-400 font-mono block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                {!n.is_read && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs font-semibold gap-1 shrink-0"
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

export const ContractorNotifications = () => (
  <ErrorBoundary>
    <ContractorNotificationsContent />
  </ErrorBoundary>
);
