import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Briefcase, Activity, CalendarCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import * as dashboardService from '@/services/dashboardService';

export const HomeownerDashboard = () => {
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
            description="The backend endpoint for Homeowner Dashboard (/api/dashboard) is not yet implemented."
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
        description={`Welcome back, ${user?.name}. Here's an overview of your property projects.`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value={data?.activeProjects || 0} icon={Briefcase} color="gold" />
        <StatCard title="Avg Completion" value={`${data?.avgCompletion || 0}%`} icon={Activity} color="green" />
        <StatCard title="Upcoming Milestones" value={data?.milestones || 0} icon={CalendarCheck} color="blue" />
        <StatCard title="Completed Projects" value={data?.completedProjects || 0} icon={CheckCircle} color="purple" />
      </div>

      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Recent Projects</h2>
          <Link to="/homeowner/projects" className="text-sm font-semibold text-gold-600 hover:text-gold-700">View All</Link>
        </div>
        {!data?.recentProjects?.length ? (
          <EmptyState 
            icon={Briefcase}
            title="No active projects"
            description="You don't have any active construction projects."
          />
        ) : (
          <div>{/* Render real projects here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
