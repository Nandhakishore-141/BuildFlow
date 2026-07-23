import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Clock, CalendarCheck } from 'lucide-react';

export const WorkerAttendance = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Attendance" 
        description="View your time logs and attendance history."
        action={
          <Button variant="primary" className="gap-2">
            Check In Now
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Hours Today" value="0.0" icon={Clock} color="neutral" />
        <StatCard title="Hours This Week" value="32.5" icon={Clock} color="blue" />
        <StatCard title="Attendance Rate" value="98%" icon={CalendarCheck} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-6">Recent Timesheets</h2>
            <TablePlaceholder columns={4} rows={6} />
          </SectionCard>
        </div>
        
        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Calendar</h2>
            <div className="w-full h-64 bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-200 border-dashed">
              <p className="text-neutral-400 font-medium">Calendar Placeholder</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
