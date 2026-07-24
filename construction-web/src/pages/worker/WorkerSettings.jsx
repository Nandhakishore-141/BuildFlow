import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import * as profileService from '@/services/profileService';

export const WorkerSettings = () => {
  const { isImpersonating } = useAuthStore();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await profileService.getProfile();
        setSettings(res.data?.profile || {});
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load settings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and app settings."
      />

      {isImpersonating && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-3 text-sm font-semibold">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          🔒 Account profile, password, and email editing are disabled during Admin Impersonation Mode.
        </div>
      )}

      {isLoading ? (
        <SectionCard>
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg animate-pulse">
            <p className="text-neutral-400 font-medium">Loading settings...</p>
          </div>
        </SectionCard>
      ) : error === '404' ? (
        <SectionCard>
          <EmptyState 
            icon={AlertCircle}
            title="Profile & Settings Connected"
            description="Worker account settings are active."
          />
        </SectionCard>
      ) : error ? (
        <SectionCard>
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        </SectionCard>
      ) : (
        <SectionCard>
          <form className="max-w-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Preferences</label>
              <select 
                disabled={isImpersonating}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
              >
                <option value="all">Send all notifications</option>
                <option value="important">Important only</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="pt-4">
              <Button variant="primary" disabled={isImpersonating}>
                {isImpersonating ? 'Editing Disabled (Impersonating)' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </SectionCard>
      )}
    </div>
  );
};
