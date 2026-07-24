import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/common/Button';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Settings, Shield, Bell, CheckCircle2 } from 'lucide-react';

const AdminSettingsContent = () => {
  const [formData, setFormData] = useState({
    platformName: 'ConstructIQ',
    supportEmail: 'support@constructiq.com',
    maintenanceMode: 'off',
    sessionTimeout: '60',
    emailNotifications: true,
    autoApproveContractors: false
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" description="Configure global system preferences, security, and operation parameters." />

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Platform configuration updated successfully. All system modules notified.
        </div>
      )}

      <SectionCard>
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b pb-2">
              <Settings className="w-4 h-4 text-gold-600" />
              General System Info
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Platform Name</label>
              <input 
                type="text" 
                value={formData.platformName} 
                onChange={e => setFormData({ ...formData, platformName: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Support Email</label>
              <input 
                type="email" 
                value={formData.supportEmail} 
                onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" 
                required 
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b pb-2">
              <Shield className="w-4 h-4 text-gold-600" />
              Security & Access Control
            </h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Maintenance Mode</label>
              <select 
                value={formData.maintenanceMode} 
                onChange={e => setFormData({ ...formData, maintenanceMode: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="off">Off (System Fully Operational)</option>
                <option value="on">On (Restricted Access & Logins Blocked)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">JWT Session Timeout (Minutes)</label>
              <select 
                value={formData.sessionTimeout} 
                onChange={e => setFormData({ ...formData, sessionTimeout: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="1440">24 Hours</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 border-b pb-2">
              <Bell className="w-4 h-4 text-gold-600" />
              Notification Defaults
            </h3>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="emailNotifs" 
                checked={formData.emailNotifications} 
                onChange={e => setFormData({ ...formData, emailNotifications: e.target.checked })}
                className="w-4 h-4 accent-gold-600 rounded" 
              />
              <label htmlFor="emailNotifs" className="text-sm font-medium text-neutral-700 cursor-pointer">
                Send system alerts to admin email address
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="autoVerify" 
                checked={formData.autoApproveContractors} 
                onChange={e => setFormData({ ...formData, autoApproveContractors: e.target.checked })}
                className="w-4 h-4 accent-gold-600 rounded" 
              />
              <label htmlFor="autoVerify" className="text-sm font-medium text-neutral-700 cursor-pointer">
                Auto-verify newly registered contractors without manual approval
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <Button type="submit" variant="primary">
              Save Configuration
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export const AdminSettings = () => (
  <ErrorBoundary>
    <AdminSettingsContent />
  </ErrorBoundary>
);
