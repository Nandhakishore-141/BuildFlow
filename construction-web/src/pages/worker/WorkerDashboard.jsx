import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Briefcase, CalendarCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import * as dashboardService from '@/services/dashboardService';

export const WorkerDashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getDashboardStats();
        setData(res.data || {});
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Loading your dashboard..." />
        <TablePlaceholder columns={3} rows={3} />
      </div>
    );
  }

  if (error === '404') {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description={`Welcome back, ${user?.name}.`} />
        <SectionCard>
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Worker Dashboard (/api/dashboard) is not yet implemented."
          />
        </SectionCard>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 font-medium">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back, ${user?.name}. Here's your schedule for today.`}
        action={
          <Button variant="primary" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">
            <CheckCircle className="w-4 h-4" />
            Check In Today
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Assigned Projects" value={data?.assignedProjects || 0} icon={Briefcase} color="gold" />
        <StatCard title="Hours Logged (Week)" value={data?.hoursLogged || "0h"} icon={Clock} color="blue" />
        <StatCard title="Attendance Rate" value={data?.attendanceRate || "0%"} icon={CalendarCheck} color="green" />
      </div>

      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Today's Assignments</h2>
          <Link to="/worker/projects" className="text-sm font-semibold text-gold-600 hover:text-gold-700">View All</Link>
        </div>
        {!data?.assignments?.length ? (
          <EmptyState 
            icon={Briefcase}
            title="No assignments today"
            description="You don't have any tasks scheduled for today."
          />
        ) : (
          <div>{/* Render real assignments here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
