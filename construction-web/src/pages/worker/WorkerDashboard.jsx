import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { Briefcase, Clock, CalendarCheck, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Worker Dashboard" 
        description={`Welcome back, ${user?.name}. Here's your daily overview.`}
        action={
          <Button variant="primary" className="gap-2">
            Check In
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Projects" value="1" icon={Briefcase} color="blue" />
        <StatCard title="Hours Worked" value="32" icon={Clock} color="purple" trend="up" trendValue="on track" />
        <StatCard title="Attendance" value="Present" icon={CalendarCheck} color="green" />
        <StatCard title="Pending Tasks" value="3" icon={Clock} color="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Today's Assigned Project</h2>
            <div className="p-6 border border-neutral-200 rounded-xl bg-neutral-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Downtown Skyscraper</h3>
                <p className="text-neutral-500 text-sm mt-1">123 Main St • Supervisor: Mehta & Co.</p>
              </div>
              <Link to="/worker/projects">
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Recent Photo Uploads</h2>
              <Link to="/worker/upload-progress" className="text-sm font-semibold text-gold-600 hover:text-gold-700">Upload New</Link>
            </div>
            <EmptyState 
              icon={ImageIcon}
              title="No recent uploads"
              description="You haven't uploaded any progress photos today."
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Pending Tasks</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4.5 h-4.5 rounded border-neutral-300 text-gold-500 focus:ring-gold-500" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Complete safety briefing</p>
                  <p className="text-xs text-neutral-500">Due today at 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4.5 h-4.5 rounded border-neutral-300 text-gold-500 focus:ring-gold-500" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Upload drywall photos</p>
                  <p className="text-xs text-neutral-500">Due today at 5:00 PM</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
