import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/common/Button';
import { ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import * as profileService from '@/services/profileService';

export const HomeownerSettings = () => {
  const { user, isImpersonating } = useAuthStore();
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', role: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await profileService.getProfile();
        setProfile(res.data || { name: '', phone: '', email: '', role: '' });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    if (isImpersonating) return;
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isImpersonating) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await profileService.updateProfile({ 
        name: profile.name, 
        phone: profile.phone 
      });
      setProfile(res.data);
      setSuccess('Profile updated successfully.');
      
      useAuthStore.setState(state => ({
        user: { ...state.user, name: res.data.name }
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your contact preferences and profile details."
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
      ) : (
        <SectionCard>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium border border-emerald-100">{success}</div>}
          
          <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={profile.name || ""} 
                onChange={handleChange}
                disabled={isImpersonating}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 font-medium text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={profile.phone || ""} 
                onChange={handleChange}
                disabled={isImpersonating}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 font-medium text-neutral-900 bg-neutral-50 focus:bg-white transition-colors outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-500 mb-1">Email Address (Read-Only)</label>
              <input 
                type="email" 
                value={profile.email || ""} 
                readOnly
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500 font-medium cursor-not-allowed outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-500 mb-1">Account Role (Read-Only)</label>
              <input 
                type="text" 
                value={profile.role || ""} 
                readOnly
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500 font-medium cursor-not-allowed outline-none" 
              />
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <Button type="submit" isLoading={isSaving} disabled={isImpersonating}>
                {isImpersonating ? 'Editing Disabled (Impersonating)' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </SectionCard>
      )}
    </div>
  );
};
