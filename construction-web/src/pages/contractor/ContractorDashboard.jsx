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
import { Modal } from '@/components/common/Modal';
import { 
  Briefcase, 
  Users, 
  Package, 
  FileText, 
  Receipt, 
  Activity, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  LineChart,
  ListTodo,
  Calendar as CalendarIcon,
  Flag,
  Send,
  AlertTriangle,
  Check,
  XCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as dashboardService from '@/services/dashboardService';
import * as contractorService from '@/services/contractorService';

const ContractorDashboardContent = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Task Modal
  const [reviewingTask, setReviewingTask] = useState(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, calRes] = await Promise.all([
        dashboardService.getDashboardStats('contractor'),
        contractorService.getCalendarEvents()
      ]);
      setData(dashRes.data || null);
      setCalendarEvents(calRes.data || []);
    } catch (err) {
      console.error("Failed to load contractor dashboard:", err);
      setError(err.response?.data?.message || 'Failed to load contractor operational data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleTaskReviewSubmit = async (action) => {
    if (!reviewingTask) return;
    setIsSubmittingReview(true);
    try {
      await contractorService.reviewTask(reviewingTask.id, { action, contractor_comments: reviewComments });
      setReviewingTask(null);
      setReviewComments('');
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process task review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'On Hold': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Contractor Command Center" description="Loading operational control metrics..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-100 animate-pulse rounded-xl" />
          ))}
        </div>
        <SectionCard>
          <TablePlaceholder columns={4} rows={4} />
        </SectionCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Contractor Command Center" description="Operational overview of assigned building projects." />
        <ErrorState title="Unable to load dashboard" description={error} onRetry={fetchDashboard} />
      </div>
    );
  }

  const {
    active_projects = 0,
    planning_projects = 0,
    completed_projects = 0,
    on_hold_projects = 0,
    delayed_projects = 0,
    avg_completion = 0,
    total_workers = 0,
    workers_present_today = 0,
    workers_absent_today = 0,
    pending_invitations = 0,
    open_tasks = 0,
    in_progress_tasks = 0,
    under_review_tasks = 0,
    completed_tasks = 0,
    delayed_tasks = 0,
    total_budget = 0,
    total_expenses = 0,
    remaining_budget = 0,
    pending_materials = 0,
    pending_approvals = 0,
    recent_projects = [],
    recent_progress = []
  } = data || {};

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contractor Operational Control Center" 
        description={`Welcome back, ${user?.name} (${user?.company_name || 'Lead Contractor'}). Live site operations & project metrics.`}
        action={
          <Button variant="outline" size="sm" onClick={fetchDashboard} className="gap-2 text-xs font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh Metrics
          </Button>
        }
      />
      
      {/* Metric Cards Grid Row 1: Core Operations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Active Buildings" value={active_projects} icon={Briefcase} color="gold" subtitle={`${planning_projects} In Planning`} />
        <StatCard title="Workers On Site" value={workers_present_today} icon={Users} color="green" subtitle={`${workers_absent_today} Absent Today`} />
        <StatCard title="Pending Invitations" value={pending_invitations} icon={Send} color="blue" subtitle="Awaiting worker response" />
        <StatCard title="Tasks Under Review" value={under_review_tasks} icon={ListTodo} color="purple" subtitle="Awaiting contractor approval" />
        <StatCard title="Delayed Tasks" value={delayed_tasks} icon={AlertTriangle} color="red" subtitle="Past target due date" />
        <StatCard title="Avg Building Progress" value={`${avg_completion}%`} icon={LineChart} color="green" subtitle="Across all contracts" />
      </div>

      {/* Metric Cards Grid Row 2: Detailed Task Breakdown & Financials */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-1">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Open Tasks (To Do)</span>
          <p className="text-2xl font-extrabold text-neutral-900">{open_tasks}</p>
          <p className="text-xs text-neutral-500">Unstarted task assignments</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-1">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Tasks In Progress</span>
          <p className="text-2xl font-extrabold text-blue-700">{in_progress_tasks}</p>
          <p className="text-xs text-neutral-500">Active site trade execution</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-1">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Completed Tasks</span>
          <p className="text-2xl font-extrabold text-emerald-700">{completed_tasks}</p>
          <p className="text-xs text-neutral-500">Approved by contractor</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-1">
          <span className="text-xs text-neutral-400 font-semibold uppercase">Remaining Funds</span>
          <p className="text-2xl font-extrabold text-emerald-700">{formatCurrency(remaining_budget)}</p>
          <p className="text-xs text-neutral-500">Budget balance across sites</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Projects & Calendar Events */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Active Building Contracts">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-neutral-500 font-medium">Buildings managed by {user?.company_name || 'your firm'}</span>
              <Link to="/contractor/projects" className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1">
                Open Projects Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recent_projects.length === 0 ? (
              <EmptyState 
                icon={Briefcase}
                title="No active projects assigned"
                description="Browse Construction Opportunities to bid or accept homeowner invitations."
              />
            ) : (
              <div className="space-y-3">
                {recent_projects.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => navigate(`/contractor/projects`)}
                    className="p-4 rounded-xl border border-neutral-200 bg-white hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-neutral-900 text-sm group-hover:text-gold-600 transition-colors">{p.project_name}</h4>
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusBadgeClass(p.status)}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Homeowner: <strong className="text-neutral-700">{p.owner_name || 'Homeowner'}</strong> • Budget: <strong className="text-neutral-900">{formatCurrency(p.budget)}</strong>
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-xs font-bold text-gold-600">{p.completion_percentage}% Completed</div>
                      <div className="w-28 bg-neutral-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-gold-500 h-full rounded-full" style={{ width: `${p.completion_percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Schedule & Calendar Events Widget */}
          <SectionCard title="Site Calendar & Target Schedule">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-neutral-500 font-medium">Upcoming task deadlines & milestone targets</span>
            </div>

            {calendarEvents.length === 0 ? (
              <EmptyState icon={CalendarIcon} title="No Scheduled Events" description="Due task dates and project milestones will appear on your schedule." />
            ) : (
              <div className="space-y-2 text-xs">
                {calendarEvents.slice(0, 5).map(evt => (
                  <div key={evt.id} className="p-3 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shrink-0 ${
                        evt.event_type === 'milestone' ? 'bg-purple-600' : 'bg-gold-500'
                      }`}>
                        {evt.event_type === 'milestone' ? <Flag className="w-4 h-4" /> : <ListTodo className="w-4 h-4" />}
                      </div>
                      <div>
                        <strong className="text-neutral-900 text-xs block">{evt.title}</strong>
                        <span className="text-neutral-500 text-[11px]">{evt.project_name} • [{evt.priority}]</span>
                      </div>
                    </div>
                    <span className="font-mono text-neutral-700 font-bold text-xs bg-neutral-100 px-2.5 py-1 rounded-md">
                      {new Date(evt.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Col: Tasks Under Review & Progress Logs */}
        <div className="col-span-1 space-y-6">
          <SectionCard title="Recent Site Progress Logs">
            {recent_progress.length === 0 ? (
              <p className="text-xs text-neutral-400">No site progress updates submitted recently.</p>
            ) : (
              <div className="space-y-3">
                {recent_progress.map(update => (
                  <div key={update.id} className="p-3 rounded-xl border border-neutral-100 bg-neutral-50/80 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{update.uploader_name}</span>
                      <span className="text-neutral-400 font-normal">{new Date(update.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-neutral-600 line-clamp-2">"{update.description}"</p>
                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="font-semibold text-gold-700">{update.project_name}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold border ${
                        update.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {update.approval_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export const ContractorDashboard = () => (
  <ErrorBoundary>
    <ContractorDashboardContent />
  </ErrorBoundary>
);
