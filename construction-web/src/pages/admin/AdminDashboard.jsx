import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Users, Briefcase, FileText, Activity, AlertCircle } from 'lucide-react';
import * as adminService from '@/services/adminService';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getDashboard();
        setData(res.data || {});
      } catch (err) {
        setError('Failed to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Dashboard" 
        description="System overview, live metrics, and platform health."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={data?.totalUsers || 0} icon={Users} color="blue" />
        <StatCard title="Verified Contractors" value={data?.verifiedContractors || 0} icon={Users} color="green" />
        <StatCard title="Active Projects" value={data?.activeProjects || 0} icon={Briefcase} color="gold" />
        <StatCard title="Workers Assigned" value={data?.workersAssignedToday || 0} icon={Users} color="neutral" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Projects Completed" value={data?.projectsCompleted || 0} icon={Briefcase} color="purple" />
        <StatCard title="Revenue (Placeholder)" value={data?.revenuePlaceholder || "$0"} icon={Activity} color="green" />
        <StatCard title="Pending Verifications" value={data?.pendingVerifications || 0} icon={AlertCircle} color="red" />
        <StatCard title="Pending Reports" value={data?.pendingReports || 0} icon={FileText} color="blue" />
      </div>

      <SectionCard>
        <h2 className="text-lg font-bold mb-4">Latest Registrations</h2>
        <EmptyState icon={Users} title="No recent registrations" description="New users will appear here." />
      </SectionCard>
    </div>
  );
};
