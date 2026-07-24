import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { 
  Building2, 
  ChevronLeft, 
  Users, 
  LineChart, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  RefreshCw,
  Info,
  ArrowRight,
  ExternalLink,
  Award,
  Phone,
  Mail,
  Briefcase,
  Camera,
  Check,
  XCircle,
  AlertCircle
} from 'lucide-react';
import * as homeownerService from '@/services/homeownerService';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1200',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200'
];

const HomeownerBuildingWorkspaceContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  // Profile Modals
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);
  const [selectedContractorProfile, setSelectedContractorProfile] = useState(null);

  const fetchWorkspace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [wsRes, propRes] = await Promise.all([
        homeownerService.getProjectWorkspace(id),
        homeownerService.getProposalsForProject(id).catch(() => ({ data: [] }))
      ]);
      setWorkspace(wsRes.data || null);
      setProposals(propRes.data || []);
    } catch (err) {
      console.error("Failed to load building workspace:", err);
      setError(err.response?.data?.message || 'Failed to load building workspace.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const handleAcceptProposal = async (proposalId) => {
    try {
      await homeownerService.acceptProposal(proposalId);
      setActionSuccessMsg('Contractor accepted successfully! Building is now in Planning status.');
      fetchWorkspace();
    } catch (err) {
      console.error("Failed to accept proposal:", err);
      setError(err.response?.data?.message || 'Failed to accept proposal.');
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await homeownerService.rejectProposal(proposalId);
      setActionSuccessMsg('Proposal rejected.');
      fetchWorkspace();
    } catch (err) {
      console.error("Failed to reject proposal:", err);
      setError(err.response?.data?.message || 'Failed to reject proposal.');
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
      case 'Planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Contractor Selected': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Looking for Contractor': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Waiting for Contractor Acceptance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Suspended': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/homeowner/buildings')} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to My Buildings
          </Button>
        </div>
        <div className="h-48 bg-neutral-100 animate-pulse rounded-2xl" />
        <SectionCard>
          <TablePlaceholder columns={4} rows={6} />
        </SectionCard>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/homeowner/buildings')} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to My Buildings
        </Button>
        <ErrorState title="Access Restricted or Building Not Found" description={error || 'You do not have permission to view this building workspace.'} onRetry={fetchWorkspace} />
      </div>
    );
  }

  const { project, team, progress, tasks, expenses } = workspace;
  const coverImage = PROJECT_COVER_IMAGES[(project.id?.charCodeAt(0) || 0) % PROJECT_COVER_IMAGES.length];

  const calculateDaysRemaining = (endDateStr) => {
    if (!endDateStr) return 'N/A';
    const diffTime = new Date(endDateStr) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} Days` : 'Due / Completed';
  };

  const nextMilestone = tasks.find(t => t.status !== 'Completed') || tasks[0];
  const latestActivity = progress[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/homeowner/buildings')} className="gap-1 text-xs font-semibold">
            <ChevronLeft className="w-4 h-4" /> Back to My Buildings
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              {project.project_name}
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadgeClass(project.status)}`}>
                {project.status}
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">Code: {project.project_code} • {project.address || project.city || 'Building Site'}</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={fetchWorkspace} className="gap-2 text-xs">
          <RefreshCw className="w-4 h-4" /> Refresh Workspace
        </Button>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center justify-between">
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white shadow-md">
        <img src={coverImage} alt={project.project_name} className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div className="relative z-10 p-6 md:p-8 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Completion Progress</span>
              <span className="text-2xl md:text-3xl font-extrabold text-gold-400 mt-1 block">{project.completion_percentage}%</span>
              <div className="w-full bg-neutral-700 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-gold-500 h-full rounded-full" style={{ width: `${project.completion_percentage}%` }} />
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Total Allocated Budget</span>
              <span className="text-xl md:text-2xl font-bold text-white mt-1 block">{formatCurrency(project.budget)}</span>
              <span className="text-xs text-neutral-400 mt-1 block">Spent: {formatCurrency(expenses.spent)}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Lead Contractor</span>
              <span className="text-base md:text-lg font-bold text-white mt-1 block truncate">{team.contractor.name || 'Awaiting Contractor'}</span>
              <span className="text-xs text-neutral-300 block">{team.contractor.company_name}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Days Remaining</span>
              <span className="text-base md:text-lg font-bold text-amber-300 mt-1 block">
                {calculateDaysRemaining(project.planned_end_date)}
              </span>
              <span className="text-xs text-neutral-400 block">Target: {project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'process', label: `Construction Process (${progress.length})`, icon: LineChart },
          { id: 'team', label: `My Team (${team.workers.length + (team.contractor.name ? 1 : 0)})`, icon: Users },
          { id: 'proposals', label: `Contractor Applications (${proposals.length})`, icon: Briefcase }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-bold text-xs md:text-sm transition-colors border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-gold-500 text-gold-700 bg-gold-50/50 rounded-t-lg' 
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-600' : 'text-neutral-400'}`} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <SectionCard title="Building Details & Metadata">
                <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                  {project.description || 'General building construction specifications and homeowner requirements.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-sm">
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold block">Site Address</span>
                    <span className="font-medium text-neutral-900">{project.address || project.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold block">Project Type</span>
                    <span className="font-medium text-neutral-900">{project.project_type || 'House'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold block">Planned Start</span>
                    <span className="font-medium text-neutral-900">{project.planned_start_date ? new Date(project.planned_start_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Budget Overview">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-neutral-600">Total Budget Spent</span>
                    <span className="font-bold text-neutral-900">{formatCurrency(expenses.spent)} / {formatCurrency(expenses.budget)}</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${expenses.spent > expenses.budget ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min(100, (expenses.spent / (expenses.budget || 1)) * 100)}%` }} 
                    />
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="col-span-1 space-y-6">
              <SectionCard title="Latest Activity">
                {latestActivity ? (
                  <div className="space-y-2 text-xs text-neutral-700">
                    <div className="flex justify-between font-bold text-neutral-900">
                      <span>{latestActivity.uploader_name}</span>
                      <span className="text-neutral-400">{new Date(latestActivity.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="line-clamp-3 text-neutral-600">"{latestActivity.description}"</p>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">No site progress activity logged yet.</p>
                )}
              </SectionCard>

              <SectionCard title="Next Milestone">
                {nextMilestone ? (
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-neutral-900 text-sm">{nextMilestone.title}</h4>
                    <p className="text-neutral-600">{nextMilestone.description}</p>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">All milestones completed.</p>
                )}
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* CONSTRUCTION PROCESS */}
      {activeTab === 'process' && (
        <SectionCard title="Construction Process Timeline">
          {progress.length === 0 ? (
            <EmptyState icon={LineChart} title="No Construction Process Logs Yet" description="Site photo and video progress steps will be posted here chronologically." />
          ) : (
            <div className="py-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gold-400 before:via-neutral-300 before:to-transparent space-y-8">
              {progress.map((update, idx) => (
                <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gold-500 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                    <Camera className="w-4 h-4" />
                  </div>

                  <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                      <span className="font-bold text-sm text-neutral-900">{update.uploader_name}</span>
                      <span className="text-xs text-neutral-400">{new Date(update.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed">{update.description}</p>
                    {update.file_url && (
                      <img src={update.file_url} alt="Progress" className="w-full h-48 object-cover rounded-xl border" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* MY TEAM */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <SectionCard title="Lead Contractor">
            {team.contractor.name ? (
              <div 
                onClick={() => {
                  setSelectedContractorProfile(team.contractor);
                  setIsContractorModalOpen(true);
                }}
                className="p-5 rounded-2xl border border-gold-200 bg-gradient-to-r from-gold-50/50 to-white hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-xl">
                    {team.contractor.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                      {team.contractor.name}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </h3>
                    <p className="text-xs font-bold text-gold-700">{team.contractor.company_name}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs font-bold">View Profile</Button>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">No contractor selected for this project yet.</p>
            )}
          </SectionCard>

          <SectionCard title={`Assigned On-Site Workers (${team.workers.length})`}>
            {team.workers.length === 0 ? (
              <EmptyState icon={Users} title="No Workers Assigned" description="Worker profiles will appear once assigned by contractor." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.workers.map(w => (
                  <div key={w.worker_id} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2">
                    <h4 className="font-bold text-sm text-neutral-900">{w.worker_name}</h4>
                    <p className="text-xs text-gold-700 font-semibold">{w.trade}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* CONTRACTOR APPLICATIONS (PROPOSALS) */}
      {activeTab === 'proposals' && (
        <SectionCard title="Contractor Proposals & Applications">
          {proposals.length === 0 ? (
            <EmptyState 
              icon={Briefcase} 
              title="No Contractor Applications Yet" 
              description="Proposals submitted by verified contractors will appear here for review." 
            />
          ) : (
            <div className="space-y-4">
              {proposals.map(prop => (
                <div key={prop.id} className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                        {prop.contractor_name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                          {prop.contractor_company || prop.contractor_name}
                          {prop.contractor_is_verified && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Contractor
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-neutral-500 font-medium">{prop.contractor_name} • {prop.contractor_email}</p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      prop.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : prop.status === 'rejected' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    "{prop.cover_message}"
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Proposed Cost</span>
                      <strong className="text-neutral-900 text-sm font-extrabold">{formatCurrency(prop.estimated_budget)}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Estimated Duration</span>
                      <strong className="text-neutral-900">{prop.estimated_duration}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Active Projects</span>
                      <strong className="text-neutral-900">{prop.contractor_active_projects} Active</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Completed Projects</span>
                      <strong className="text-neutral-900">{prop.contractor_completed_projects} Completed</strong>
                    </div>
                  </div>

                  {prop.status === 'pending' && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleAcceptProposal(prop.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-xs"
                      >
                        <Check className="w-4 h-4" /> Accept Contractor
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRejectProposal(prop.id)}
                        className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs font-semibold gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject Proposal
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* CONTRACTOR PROFILE MODAL */}
      <Modal 
        isOpen={isContractorModalOpen} 
        onClose={() => setIsContractorModalOpen(false)} 
        title="Contractor Profile"
      >
        {selectedContractorProfile && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gold-50 p-4 rounded-xl border border-gold-200">
              <div className="w-16 h-16 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-2xl shadow-xs">
                {selectedContractorProfile.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                  {selectedContractorProfile.name}
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </h3>
                <p className="text-xs font-bold text-gold-700">{selectedContractorProfile.company_name}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <Button variant="primary" onClick={() => setIsContractorModalOpen(false)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export const HomeownerBuildingWorkspace = () => (
  <ErrorBoundary>
    <HomeownerBuildingWorkspaceContent />
  </ErrorBoundary>
);
