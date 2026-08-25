import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Settings as SettingsIcon, ShieldAlert, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import * as contractorService from '@/services/contractorService';

const ContractorSettingsContent = () => {
  const { isImpersonating, user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const [form, setForm] = useState({
    name: '',
    company_name: '',
    phone: ''
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await contractorService.getSettings();
      const p = res.data || {};
      setProfile(p);
      setForm({
        name: p.name || '',
        company_name: p.company_name || '',
        phone: p.phone || ''
      });
    } catch (err) {
      console.error("Failed to load contractor settings:", err);
      setError(err.response?.data?.message || 'Failed to load profile settings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isImpersonating) return;
    setIsSaving(true);
    setActionSuccess(null);
    try {
      await contractorService.updateSettings(form);
      setActionSuccess('Company profile settings updated successfully.');
      fetchData();
    } catch (err) {
      console.error("Failed to update settings:", err);
      setError(err.response?.data?.message || 'Failed to update company settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Company Settings & Profile" 
        description="Manage your contractor business information, company name, and contact details."
        action={
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-xs font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh Profile
          </Button>
        }
      />

      {isImpersonating && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-3 text-sm font-semibold">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          🔒 Account profile and settings editing are disabled during Admin Impersonation Mode.
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {isLoading ? (
        <SectionCard>
          <div className="h-48 flex items-center justify-center bg-neutral-50 rounded-lg animate-pulse">
            <p className="text-neutral-400 font-medium text-xs">Loading company profile...</p>
          </div>
        </SectionCard>
      ) : error ? (
        <SectionCard>
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Business Verification</h3>
              <p className="text-xs text-neutral-500 mt-1">Official contractor partner status on ConstructIQ.</p>
            </div>

            <div className="p-4 rounded-xl border border-gold-200 bg-gold-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm text-neutral-900">Verified Contractor</span>
              </div>
              <p className="text-xs text-neutral-600">Your company profile is verified to receive direct homeowner invitations and submit project proposals.</p>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <SectionCard title="Company Information">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Company Name *</label>
                  <input 
                    type="text" 
                    required
                    value={form.company_name} 
                    onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
                    disabled={isImpersonating}
                    className="w-full h-10 px-3 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Lead Contractor Representative Name</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    disabled={isImpersonating}
                    className="w-full h-10 px-3 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Business Email (Read Only)</label>
                    <input 
                      type="email" 
                      value={profile?.email || ''} 
                      disabled
                      className="w-full h-10 px-3 border border-neutral-200 bg-neutral-100 rounded-xl text-sm text-neutral-500 cursor-not-allowed" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Business Phone Number</label>
                    <input 
                      type="text" 
                      value={form.phone} 
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      disabled={isImpersonating}
                      className="w-full h-10 px-3 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-neutral-100">
                  <Button variant="primary" size="sm" type="submit" disabled={isImpersonating || isSaving} className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs">
                    {isSaving ? 'Saving Changes...' : isImpersonating ? 'Disabled in Impersonation' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
};

export const ContractorSettings = () => (
  <ErrorBoundary>
    <ContractorSettingsContent />
  </ErrorBoundary>
);
