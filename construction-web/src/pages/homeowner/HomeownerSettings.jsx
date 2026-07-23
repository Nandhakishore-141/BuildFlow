import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';

export const HomeownerSettings = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your personal profile and account preferences."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-bold text-neutral-900">Personal Information</h3>
          <p className="text-sm text-neutral-500 mt-1">Update your contact details.</p>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <SectionCard>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                  <input type="tel" defaultValue={user?.phone || ''} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-2 border border-neutral-200 bg-neutral-50 rounded-lg text-neutral-500 cursor-not-allowed" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary">Save Changes</Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>

      <div className="hidden md:block w-full h-px bg-neutral-200 my-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h3 className="text-lg font-bold text-neutral-900">Security</h3>
          <p className="text-sm text-neutral-500 mt-1">Update your password.</p>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <SectionCard>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="primary">Update Password</Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
