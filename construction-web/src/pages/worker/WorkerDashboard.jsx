import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Building2, CalendarCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import * as dashboardService from '@/services/dashboardService';

const WorkerDashboardContent = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
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
        <PageHeader title="Worker Dashboard" description="Loading your dashboard..." />
        <TablePlaceholder columns={3} rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Worker Dashboard" 
        description={`Welcome back, ${user?.name}. Here is your building schedule and daily site duties.`}
        action={
          <Button 
            variant="primary" 
            onClick={() => navigate('/worker/attendance')}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
          >
            <CheckCircle className="w-4 h-4" />
            Check In Today
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Assigned Buildings" value={data?.assignedProjects || 0} icon={Building2} color="gold" />
        <StatCard title="Hours Logged (Week)" value={data?.hoursLogged || "0h"} icon={Clock} color="blue" />
        <StatCard title="Attendance Rate" value={data?.attendanceRate || "100%"} icon={CalendarCheck} color="green" />
      </div>

      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Your Assigned Buildings</h2>
          <Link to="/worker/buildings" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
            View All Buildings
          </Link>
        </div>
        
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-neutral-900 text-sm">Building Sites Workspace</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Access site instructions, leadership contacts, construction progress feeds, and site documents.</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/worker/buildings')} className="gap-2 text-xs font-bold shrink-0">
            <Building2 className="w-4 h-4" /> Go to My Buildings
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export const WorkerDashboard = () => (
  <ErrorBoundary>
    <WorkerDashboardContent />
  </ErrorBoundary>
);
