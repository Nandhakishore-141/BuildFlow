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
  Package, 
  CalendarCheck, 
  Bell, 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  UserCheck,
  UserPlus
} from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminAnalyticsContent = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAnalytics();
      setData(res.data || null);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.response?.data?.message || 'Failed to load platform analytics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Platform Analytics" description="System health, adoption rates, financial metrics, and operational performance." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-100 animate-pulse rounded-xl" />
          ))}
        </div>
        <SectionCard>
          <TablePlaceholder columns={4} rows={5} />
        </SectionCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Platform Analytics" description="System health, adoption rates, financial metrics, and operational performance." />
        <ErrorState title="Unable to load analytics" description={error} onRetry={fetchAnalytics} />
      </div>
    );
  }

  const {
    totalUsers = 0,
    contractorsCount = 0,
    homeownersCount = 0,
    workersCount = 0,
    activeProjects = 0,
    completedProjects = 0,
    planningProjects = 0,
    suspendedProjects = 0,
    totalBudget = 0,
    totalExpenses = 0,
    materialsLowInStock = 0,
    attendanceToday = 0,
    pendingNotifications = 0,
    recentRegistrations = [],
    expensesByCategory = [],
    projectsByStatus = []
  } = data || {};

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Platform Analytics" 
        description="System health, adoption rates, financial metrics, and operational performance."
        action={
          <Button variant="outline" size="sm" onClick={fetchAnalytics} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
        }
      />

      {/* KPI Section 1: User & Project Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon={Users} color="blue" subtitle={`${contractorsCount} Contractors, ${homeownersCount} Homeowners, ${workersCount} Workers`} />
        <StatCard title="Active Projects" value={activeProjects} icon={Briefcase} color="gold" subtitle={`${completedProjects} Completed, ${planningProjects} Planning`} />
        <StatCard title="Total Platform Budget" value={formatCurrency(totalBudget)} icon={DollarSign} color="green" />
        <StatCard title="Total Expenses Logged" value={formatCurrency(totalExpenses)} icon={TrendingUp} color="purple" />
      </div>

      {/* KPI Section 2: Operations & Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Workers Attendance Today" value={attendanceToday} icon={CalendarCheck} color="green" subtitle="Active clocked-in workers" />
        <StatCard title="Materials Low in Stock" value={materialsLowInStock} icon={Package} color="red" subtitle="Items below threshold" />
        <StatCard title="Pending Notifications" value={pendingNotifications} icon={Bell} color="amber" subtitle="Unread system notifications" />
        <StatCard title="Contractors Verified" value={contractorsCount} icon={UserCheck} color="blue" subtitle="Verified platform contractors" />
      </div>

      {/* Breakdown Section: Projects & Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Projects Status Breakdown">
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-700 font-medium"><div className="w-3 h-3 rounded-full bg-blue-500" /> Active (In Progress)</span>
              <span className="font-bold text-neutral-900">{activeProjects}</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(activeProjects / (totalUsers || 1)) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-700 font-medium"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Completed</span>
              <span className="font-bold text-neutral-900">{completedProjects}</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(completedProjects / (totalUsers || 1)) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-700 font-medium"><div className="w-3 h-3 rounded-full bg-amber-500" /> Planning Stage</span>
              <span className="font-bold text-neutral-900">{planningProjects}</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(planningProjects / (totalUsers || 1)) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-neutral-700 font-medium"><div className="w-3 h-3 rounded-full bg-rose-500" /> Suspended / On Hold</span>
              <span className="font-bold text-neutral-900">{suspendedProjects}</span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(suspendedProjects / (totalUsers || 1)) * 100}%` }} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Expenses Category Distribution">
          <div className="space-y-4 pt-2">
            {expensesByCategory.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No expenses recorded yet.</p>
            ) : (
              expensesByCategory.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-neutral-800">{cat.category}</span>
                    <span className="font-bold text-neutral-900">{formatCurrency(cat.total_amount)} ({cat.count} items)</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gold-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (cat.total_amount / (totalExpenses || 1)) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      {/* Recent Registrations Table */}
      <SectionCard title="Recent Registrations">
        {recentRegistrations.length === 0 ? (
          <EmptyState icon={UserPlus} title="No recent registrations" description="New user registrations will appear here." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Company / Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {recentRegistrations.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">
                      {user.name}
                      <span className="block text-xs font-normal text-neutral-500">{user.email}</span>
                    </td>
                    <td className="p-4 font-medium text-neutral-800">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-600">
                      {user.company_name || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${user.is_verified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                        {user.is_verified ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-xs text-neutral-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export const AdminAnalytics = () => (
  <ErrorBoundary>
    <AdminAnalyticsContent />
  </ErrorBoundary>
);
