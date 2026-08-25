import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { User, Phone, MapPin, Briefcase, Award, ShieldAlert, CheckCircle2, Lock, Camera } from 'lucide-react';
import * as workerService from '@/services/workerService';

const WorkerProfileContent = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    skill: '',
    experience: '',
    about_me: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await workerService.getProfile();
      const p = res.data || {};
      setProfile(p);
      setFormData({
        name: p.name || '',
        phone: p.phone || '',
        address: p.address || '',
        skill: p.skill || '',
        experience: p.experience || '',
        about_me: p.about_me || '',
        avatar_url: p.avatar_url || ''
      });
    } catch (err) {
      console.error("Failed to load worker profile:", err);
      setError(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await workerService.updateProfile(formData);
      setProfile(res.data || profile);
      setSuccessMessage('Profile details updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" description="Loading profile data..." />
        <SectionCard>
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-xl animate-pulse">
            <p className="text-neutral-400 font-medium">Loading profile details...</p>
          </div>
        </SectionCard>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" description="Manage your personal details" />
        <ErrorState title="Unable to load profile" description={error} onRetry={fetchProfile} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="My Profile" 
        description="View and update your personal details, trade skill, contact information, and address."
      />

      {/* Header Profile Hero Card */}
      <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl text-white flex flex-col sm:flex-row items-center gap-6 shadow-md">
        <img 
          src={formData.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
          alt={profile?.name} 
          className="w-24 h-24 rounded-full object-cover border-4 border-gold-500 shadow-md shrink-0" 
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-extrabold">{profile?.name}</h2>
            <span className="px-3 py-0.5 text-xs font-extrabold rounded-full bg-gold-500 text-neutral-950 self-center sm:self-auto">
              {profile?.skill || 'Worker'}
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-mono">Employee ID: {profile?.id}</p>
          <p className="text-xs text-neutral-400">Assigned Contractor: <strong className="text-gold-400">{profile?.assigned_contractor_name || 'Independent / Assigned Contractor'}</strong></p>
        </div>
      </div>

      <SectionCard title="Edit Personal Details">
        {successMessage && (
          <div className="mb-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Restricted / Locked Read-Only Section */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              Restricted System Fields (Read Only)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-0.5">Role</label>
                <input type="text" disabled value={profile?.role || 'Worker'} className="w-full px-3 py-2 bg-neutral-200/60 border border-neutral-300 rounded-lg text-neutral-700 font-bold cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-neutral-400 font-medium mb-0.5">Employee ID</label>
                <input type="text" disabled value={profile?.id || ''} className="w-full px-3 py-2 bg-neutral-200/60 border border-neutral-300 rounded-lg text-neutral-700 font-mono cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-neutral-400 font-medium mb-0.5">Assigned Contractor</label>
                <input type="text" disabled value={profile?.assigned_contractor_name || 'Assigned by Contractor'} className="w-full px-3 py-2 bg-neutral-200/60 border border-neutral-300 rounded-lg text-neutral-700 font-bold cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Permitted Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Phone Number</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Trade / Primary Skill</label>
              <input 
                type="text" 
                name="skill"
                value={formData.skill} 
                onChange={handleChange}
                placeholder="e.g. Mason, Electrician, Carpenter"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Years of Experience</label>
              <input 
                type="text" 
                name="experience"
                value={formData.experience} 
                onChange={handleChange}
                placeholder="e.g. 5 Years"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Address / Location</label>
              <input 
                type="text" 
                name="address"
                value={formData.address} 
                onChange={handleChange}
                placeholder="City, State"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Avatar / Profile Picture URL</label>
              <input 
                type="url" 
                name="avatar_url"
                value={formData.avatar_url} 
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">About Me / Bio</label>
              <textarea 
                rows="3"
                name="about_me"
                value={formData.about_me} 
                onChange={handleChange}
                placeholder="Brief summary of your construction work experience..."
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium" 
              />
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" type="submit" disabled={isSaving} className="font-bold">
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export const WorkerProfile = () => (
  <ErrorBoundary>
    <WorkerProfileContent />
  </ErrorBoundary>
);
