import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  UserCheck,
  UserPlus
} from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminDashboardContent = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getDashboard();
      setData(res.data || null);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
      setError(err.response?.data?.message || 'Failed to connect to administrative data services.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" description="Live platform analytics, operations overview, and executive metrics." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-100 animate-pulse rounded-xl" />
          ))}
        </div>
        <SectionCard>
          <TablePlaceholder columns={5} rows={5} />
        </SectionCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" description="Live platform analytics, operations overview, and executive metrics." />
        <ErrorState title="Unable to load dashboard" description={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  const totalUsers = data?.totalUsers ?? 0;
  const activeProjects = data?.activeProjects ?? 0;
  const completedProjects = data?.completedProjects ?? 0;
  const verifiedContractors = data?.verifiedContractors ?? 0;
  const pendingContractors = data?.pendingContractors ?? 0;
  const workersAssignedToday = data?.workersAssignedToday ?? 0;
  const totalBudget = data?.totalBudget ?? 0;
  const totalExpenses = data?.totalExpenses ?? 0;
  const recentRegistrations = data?.recentRegistrations ?? [];
  const recentProjects = data?.recentProjects ?? [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        description="Live platform analytics, operations overview, and executive metrics."
        action={
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />
      
      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Users" value={totalUsers} icon={Users} color="blue" />
        <StatCard title="Active Projects" value={activeProjects} icon={Briefcase} color="gold" />
        <StatCard title="Total Project Budget" value={formatCurrency(totalBudget)} icon={DollarSign} color="green" />
        <StatCard title="Total Expenses Logged" value={formatCurrency(totalExpenses)} icon={TrendingUp} color="purple" />
      </div>

      {/* Secondary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Verified Contractors" value={verifiedContractors} icon={UserCheck} color="green" />
        <StatCard title="Pending Approvals" value={pendingContractors} icon={Clock} color="amber" subtitle="Contractors awaiting verification" />
        <StatCard title="Projects Completed" value={completedProjects} icon={CheckCircle2} color="blue" />
        <StatCard title="Assigned Workers" value={workersAssignedToday} icon={Users} color="neutral" subtitle="Workers linked to projects" />
      </div>

      {/* Grid: Recent Registrations & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Recent Registrations">
          {recentRegistrations.length === 0 ? (
            <EmptyState icon={UserPlus} title="No recent registrations" description="New users will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {recentRegistrations.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-50/80">
                      <td className="p-3 font-bold text-neutral-900">
                        {u.name}
                        <span className="block text-xs font-normal text-neutral-500">{u.email}</span>
                      </td>
                      <td className="p-3 font-medium text-neutral-700">{u.role}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${u.is_verified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                          {u.is_verified ? 'Active' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent Projects Overview">
          {recentProjects.length === 0 ? (
            <EmptyState icon={Briefcase} title="No projects found" description="Created projects will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                    <th className="p-3">Project</th>
                    <th className="p-3">Contractor</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {recentProjects.map(p => (
                    <tr key={p.id} className="hover:bg-neutral-50/80">
                      <td className="p-3 font-bold text-neutral-900">
                        {p.project_name}
                        <span className="block text-xs font-mono font-normal text-neutral-500">{p.project_code}</span>
                      </td>
                      <td className="p-3 text-neutral-700">{p.contractor_name || 'N/A'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export const AdminDashboard = () => (
  <ErrorBoundary>
    <AdminDashboardContent />
  </ErrorBoundary>
);
