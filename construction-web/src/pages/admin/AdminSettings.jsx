import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/common/Button';

export const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" description="Configure global system preferences." />
      <SectionCard>
        <form className="max-w-xl space-y-4">
          <div><label className="block text-sm font-medium mb-1">Platform Name</label><input type="text" defaultValue="ConstructIQ" className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium mb-1">Support Email</label><input type="email" defaultValue="support@constructiq.com" className="w-full px-4 py-2 border rounded-lg" /></div>
          <div>
            <label className="block text-sm font-medium mb-1">Maintenance Mode</label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option value="off">Off (System Active)</option>
              <option value="on">On (Block Logins)</option>
            </select>
          </div>
          <div className="pt-4"><Button type="button" variant="primary">Save Settings</Button></div>
        </form>
      </SectionCard>
    </div>
  );
};
