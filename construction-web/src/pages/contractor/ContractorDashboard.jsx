import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Briefcase, Users, Package, FileText, Receipt, Activity, FilePlus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';

export const ContractorDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back, ${user?.name}. Here's what's happening today.`}
        action={
          <Button variant="primary" className="gap-2">
            <FilePlus className="w-4 h-4" />
            New Project
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Active Projects" value="4" icon={Briefcase} trend="up" trendValue="1 since last week" color="gold" />
        <StatCard title="Workers Today" value="28" icon={Users} color="blue" />
        <StatCard title="Active Workers" value="42" icon={Users} color="blue" />
        <StatCard title="Material Requests" value="7" icon={Package} trend="up" trendValue="3 pending" color="purple" />
        <StatCard title="Pending Reviews" value="2" icon={FileText} color="red" />
        <StatCard title="Today's Expenses" value="$1,240" icon={Receipt} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Recent Projects</h2>
              <Link to="/contractor/projects" className="text-sm font-semibold text-gold-600 hover:text-gold-700">View All</Link>
            </div>
            <EmptyState 
              icon={Briefcase}
              title="No active projects"
              description="Get started by creating your first construction project."
              action={<Button variant="outline" size="sm">Create Project</Button>}
              className="py-12"
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link to="/contractor/workers" className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700 transition-colors flex items-center justify-between">
                Invite Worker
                <Activity className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link to="/contractor/materials" className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700 transition-colors flex items-center justify-between">
                Order Materials
                <Activity className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link to="/contractor/expenses" className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-sm font-medium text-neutral-700 transition-colors flex items-center justify-between">
                Log Expense
                <Activity className="w-4 h-4 text-neutral-400" />
              </Link>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-gold-500 shrink-0"></div>
                <div>
                  <p className="text-sm text-neutral-900 font-medium">New worker registered</p>
                  <p className="text-xs text-neutral-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
                <div>
                  <p className="text-sm text-neutral-900 font-medium">Material delivery arrived</p>
                  <p className="text-xs text-neutral-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <p className="text-sm text-neutral-900 font-medium">Progress photo uploaded</p>
                  <p className="text-xs text-neutral-500">Yesterday</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
