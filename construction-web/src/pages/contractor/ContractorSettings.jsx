import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { Settings as SettingsIcon, AlertCircle } from 'lucide-react';
import * as profileService from '@/services/profileService';

export const ContractorSettings = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await profileService.getProfile();
        setProfile(res.data?.profile || {});
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load profile settings.');
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
        description="Manage your company profile and account preferences."
      />

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
            title="Feature Not Yet Connected"
            description="The backend endpoint for Profile (/api/profile) is not yet implemented."
          />
        </SectionCard>
      ) : error ? (
        <SectionCard>
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        </SectionCard>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <h3 className="text-lg font-bold text-neutral-900">Company Details</h3>
              <p className="text-sm text-neutral-500 mt-1">Update your company name and contact info.</p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <SectionCard>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Company Name</label>
                    <input type="text" defaultValue={profile?.company_name || ""} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Business Address</label>
                    <textarea rows="3" defaultValue={profile?.address || ""} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500"></textarea>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </form>
              </SectionCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
