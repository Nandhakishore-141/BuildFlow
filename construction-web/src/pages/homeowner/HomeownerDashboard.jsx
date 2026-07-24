import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Building2, Activity, CalendarCheck, CheckCircle2, DollarSign, ArrowRight, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as homeownerService from '@/services/homeownerService';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'
];

const HomeownerDashboardContent = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, buildingsRes] = await Promise.all([
        homeownerService.getDashboardStats(),
        homeownerService.getProjects()
      ]);
      setStats(statsRes.data || null);
      setBuildings(buildingsRes.data || []);
    } catch (err) {
      console.error("Failed to load homeowner dashboard:", err);
      setError(err.response?.data?.message || 'Failed to load homeowner property data.');
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Suspended': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Homeowner Dashboard" description="Overview of your construction buildings and property milestones." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-100 animate-pulse rounded-xl" />
          ))}
        </div>
        <SectionCard>
          <TablePlaceholder columns={3} rows={4} />
        </SectionCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Homeowner Dashboard" description="Overview of your construction buildings and property milestones." />
        <ErrorState title="Unable to load dashboard" description={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  const {
    total_projects = 0,
    active_projects = 0,
    completed_projects = 0,
    avg_completion = 0,
    total_budget = 0,
    total_spent = 0,
    upcoming_milestones = 0
  } = stats || {};

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Homeowner Dashboard" 
        description={`Welcome back, ${user?.name}. Oversee your building sites and track live progress.`}
        action={
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="gap-2 text-xs">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        }
      />
      
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Buildings" value={active_projects} icon={Building2} color="gold" subtitle={`${total_projects} Total Buildings`} />
        <StatCard title="Average Progress" value={`${avg_completion}%`} icon={Activity} color="green" />
        <StatCard title="Total Budget Allocated" value={formatCurrency(total_budget)} icon={DollarSign} color="blue" subtitle={`Spent: ${formatCurrency(total_spent)}`} />
        <StatCard title="Completed Buildings" value={completed_projects} icon={CheckCircle2} color="purple" subtitle={`${upcoming_milestones} Pending Milestones`} />
      </div>

      {/* Building Cards Grid */}
      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Your Property Buildings</h2>
            <p className="text-xs text-neutral-500">Select any building to open its workspace.</p>
          </div>
          <Link to="/homeowner/buildings" className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1">
            View All Buildings ({buildings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {buildings.length === 0 ? (
          <EmptyState 
            icon={Building2}
            title="No Buildings Found"
            description="No active or past construction buildings registered under your homeowner profile."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buildings.map((b, idx) => {
              const coverImg = PROJECT_COVER_IMAGES[idx % PROJECT_COVER_IMAGES.length];
              return (
                <div 
                  key={b.id} 
                  onClick={() => navigate(`/homeowner/buildings/${b.id}`)}
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Cover Image */}
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                      <img src={coverImg} alt={b.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-xs font-extrabold rounded-full border shadow-xs ${getStatusBadgeClass(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                        {b.project_code}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                          {b.project_name}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1 font-medium">
                          Contractor: <strong className="text-neutral-700">{b.contractor_name || 'Unassigned'}</strong>
                          {b.contractor_company && ` (${b.contractor_company})`}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-neutral-500">Construction Completion</span>
                          <span className="text-gold-600 font-bold">{b.completion_percentage}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-gold-500 h-full rounded-full transition-all duration-300" style={{ width: `${b.completion_percentage}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-neutral-100 text-neutral-600">
                        <div>
                          <span className="text-neutral-400 block font-medium">Allocated Budget</span>
                          <strong className="text-neutral-900">{formatCurrency(b.budget)}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block font-medium">Expected End</span>
                          <strong className="text-neutral-900">{b.planned_end_date ? new Date(b.planned_end_date).toLocaleDateString() : 'N/A'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-gold-700 group-hover:bg-gold-50 transition-colors">
                    <span>Open Building Workspace</span>
                    <ArrowRight className="w-4 h-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export const HomeownerDashboard = () => (
  <ErrorBoundary>
    <HomeownerDashboardContent />
  </ErrorBoundary>
);
