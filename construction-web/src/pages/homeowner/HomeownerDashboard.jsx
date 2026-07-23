import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { Briefcase, Receipt, LineChart, FileText } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const HomeownerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Homeowner Dashboard" 
        description={`Welcome back, ${user?.name}. Here's an overview of your properties.`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value="1" icon={Briefcase} color="blue" />
        <StatCard title="Total Spent" value="$45,200" icon={Receipt} color="green" />
        <StatCard title="Overall Progress" value="35%" icon={LineChart} color="gold" />
        <StatCard title="New Documents" value="2" icon={FileText} color="purple" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Recent Updates</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-gold-500 shrink-0"></div>
              <div>
                <p className="text-sm text-neutral-900 font-medium">Foundation inspection passed</p>
                <p className="text-xs text-neutral-500">Today, 10:30 AM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
              <div>
                <p className="text-sm text-neutral-900 font-medium">Payment #2 received</p>
                <p className="text-xs text-neutral-500">Yesterday, 3:15 PM</p>
              </div>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Upcoming Milestones</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
              <p className="font-semibold text-neutral-900 text-sm">Framing Completion</p>
              <p className="text-xs text-neutral-500 mt-1">Expected: Nov 15th</p>
            </div>
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
              <p className="font-semibold text-neutral-900 text-sm">Roofing Installation</p>
              <p className="text-xs text-neutral-500 mt-1">Expected: Dec 5th</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};
