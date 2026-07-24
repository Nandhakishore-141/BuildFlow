import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { 
  Briefcase, 
  ChevronLeft, 
  Users, 
  LineChart, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Download, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MapPin,
  RefreshCw,
  Info
} from 'lucide-react';
import * as homeownerService from '@/services/homeownerService';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1200',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200'
];

const HomeownerProjectWorkspaceContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);

  const fetchWorkspace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await homeownerService.getProjectWorkspace(id);
      setWorkspace(res.data || null);
    } catch (err) {
      console.error("Failed to load workspace:", err);
      setError(err.response?.data?.message || 'Failed to load project workspace.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/homeowner/projects')} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Projects
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
        <Button variant="outline" size="sm" onClick={() => navigate('/homeowner/projects')} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Projects
        </Button>
        <ErrorState title="Access Restricted or Project Not Found" description={error || 'You do not have permission to view this project workspace.'} onRetry={fetchWorkspace} />
      </div>
    );
  }

  const { project, team, progress, tasks, expenses, documents } = workspace;
  const coverImage = PROJECT_COVER_IMAGES[(project.id?.charCodeAt(0) || 0) % PROJECT_COVER_IMAGES.length];

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/homeowner/projects')} className="gap-1 text-xs">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              {project.project_name}
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadgeClass(project.status)}`}>
                {project.status}
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">Code: {project.project_code} • {project.city || 'Construction Site'}</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={fetchWorkspace} className="gap-2 self-start md:self-auto text-xs">
          <RefreshCw className="w-4 h-4" /> Refresh Workspace
        </Button>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white shadow-md">
        <img src={coverImage} alt={project.project_name} className="absolute inset-0 w-full h-full object-cover opacity-30" />
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
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Assigned Contractor</span>
              <span className="text-base md:text-lg font-bold text-white mt-1 block truncate">{team.contractor.name || 'Unassigned'}</span>
              <span className="text-xs text-neutral-300 block">{team.contractor.company_name}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Target Completion Date</span>
              <span className="text-base md:text-lg font-bold text-white mt-1 block">
                {project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString() : 'TBD'}
              </span>
              <span className="text-xs text-neutral-400 block">{team.workers.length} Skilled Workers Assigned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1 border-b border-neutral-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'progress', label: `Progress Feed (${progress.length})`, icon: LineChart },
          { id: 'team', label: `Project Team (${team.workers.length + 1})`, icon: Users },
          { id: 'timeline', label: `Timeline & Milestones (${tasks.length})`, icon: Calendar },
          { id: 'expenses', label: 'Expenses Audit', icon: DollarSign },
          { id: 'documents', label: `Documents (${documents.length})`, icon: FileText }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-xs md:text-sm transition-colors border-b-2 whitespace-nowrap ${
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <SectionCard title="Project Summary">
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  {project.description || 'No detailed project description logged for this construction site.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 text-sm">
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold block">Site Address</span>
                    <span className="font-medium text-neutral-800">{project.address || project.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold block">Planned Start Date</span>
                    <span className="font-medium text-neutral-800">{project.planned_start_date ? new Date(project.planned_start_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold block">State / Country</span>
                    <span className="font-medium text-neutral-800">{project.state || 'Karnataka'}, {project.country || 'India'}</span>
                  </div>
                </div>
              </SectionCard>

              {/* Financial Progress Bar */}
              <SectionCard title="Financial Utilization">
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
                  <div className="flex justify-between text-xs text-neutral-500 pt-1">
                    <span>Remaining Balance: <strong>{formatCurrency(expenses.remaining)}</strong></span>
                    <span>{((expenses.spent / (expenses.budget || 1)) * 100).toFixed(1)}% Used</span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Contractor Spotlight Card */}
            <div className="col-span-1">
              <SectionCard title="Contractor Spotlight">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-700 font-bold flex items-center justify-center text-lg border border-gold-200">
                      {team.contractor.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                        {team.contractor.name}
                        {team.contractor.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                      </h4>
                      <p className="text-xs font-semibold text-gold-700">{team.contractor.company_name}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-2 pt-3 border-t border-neutral-100 text-neutral-600">
                    <p><strong>Email:</strong> {team.contractor.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {team.contractor.phone || 'N/A'}</p>
                    <p><strong>Completed Projects:</strong> {team.contractor.completed_projects} of {team.contractor.total_projects}</p>
                    <p><strong>Avg Portfolio Completion:</strong> {team.contractor.avg_completion}%</p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsContractorModalOpen(true)}
                    className="w-full text-xs font-semibold gap-1 mt-2"
                  >
                    <UserCheck className="w-4 h-4" /> View Full Profile
                  </Button>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROGRESS FEED */}
      {activeTab === 'progress' && (
        <SectionCard title="Chronological Construction Feed">
          {progress.length === 0 ? (
            <EmptyState icon={LineChart} title="No Progress Updates Yet" description="Your contractor and workers will upload photo and video updates here." />
          ) : (
            <div className="space-y-6">
              {progress.map(update => (
                <div key={update.id} className="p-4 md:p-6 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">{update.uploader_name}</span>
                      {update.uploader_trade && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600 font-semibold">
                          {update.uploader_trade}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span>{update.created_at ? new Date(update.created_at).toLocaleString() : ''}</span>
                      <span className={`px-2 py-0.5 rounded-full font-semibold border ${
                        update.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {update.approval_status} {update.approver_name ? `by ${update.approver_name}` : ''}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 leading-relaxed">{update.description}</p>

                  {update.file_url && (
                    <div className="rounded-xl overflow-hidden border border-neutral-200 max-w-xl">
                      <img src={update.file_url} alt="Progress update site photo" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* TAB 3: TEAM TAB */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Contractor Card */}
          <SectionCard title="Primary Contractor">
            <div className="p-4 rounded-xl border border-gold-200 bg-gold-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-xl shadow-xs">
                  {team.contractor.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                    {team.contractor.name}
                    {team.contractor.is_verified && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </h3>
                  <p className="text-xs font-semibold text-gold-700">{team.contractor.company_name}</p>
                  <p className="text-xs text-neutral-500 mt-1">{team.contractor.email} • {team.contractor.phone}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => setIsContractorModalOpen(true)} className="gap-1 text-xs">
                <UserCheck className="w-4 h-4" /> View Company Profile
              </Button>
            </div>
          </SectionCard>

          {/* Assigned Workers Grid */}
          <SectionCard title={`Assigned On-Site Workers (${team.workers.length})`}>
            {team.workers.length === 0 ? (
              <EmptyState icon={Users} title="No Workers Assigned" description="Your contractor has not assigned workers to this project team yet." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.workers.map(w => (
                  <div key={w.worker_id} className="p-4 rounded-xl border border-neutral-200 bg-white hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <img src={w.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={w.worker_name} className="w-10 h-10 rounded-full object-cover border border-neutral-200" />
                        <div>
                          <h4 className="font-bold text-neutral-900 text-sm">{w.worker_name}</h4>
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gold-50 text-gold-700 border border-gold-200">
                            {w.trade || 'Worker'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs space-y-1.5 text-neutral-600 pt-2 border-t border-neutral-100">
                        <p><strong>Current Task:</strong> {w.current_task || 'General Site Duties'}</p>
                        <p><strong>Attendance Today:</strong> <span className={w.attendance_today === 'Present' ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>{w.attendance_today}</span></p>
                        <p><strong>Completed Tasks:</strong> {w.completed_tasks_count} tasks</p>
                        {w.latest_work_description && (
                          <p className="truncate text-neutral-500 italic">"{w.latest_work_description}"</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedWorker(w);
                        setIsWorkerModalOpen(true);
                      }}
                      className="w-full text-xs font-semibold gap-1 mt-2"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Worker Profile
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* TAB 4: TIMELINE */}
      {activeTab === 'timeline' && (
        <SectionCard title="Project Milestones & Task Schedule">
          {tasks.length === 0 ? (
            <EmptyState icon={Calendar} title="No Timeline Tasks Logged" description="Project tasks and milestone schedules will appear here." />
          ) : (
            <div className="relative pl-6 border-l-2 border-gold-300 space-y-6 my-2">
              {tasks.map(t => (
                <div key={t.id} className="relative">
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white ${
                    t.status === 'Completed' ? 'border-emerald-500 bg-emerald-500' : 'border-gold-500'
                  }`} />
                  
                  <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-neutral-900">{t.title}</h4>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                        t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    {t.description && <p className="text-xs text-neutral-600">{t.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                      <span>Due Date: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'}</span>
                      {t.assigned_worker_name && <span>Assigned: {t.assigned_worker_name}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* TAB 5: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 bg-white">
              <span className="text-xs text-neutral-400 font-semibold uppercase">Total Project Budget</span>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{formatCurrency(expenses.budget)}</p>
            </div>
            <div className="p-4 rounded-xl border border-neutral-200 bg-white">
              <span className="text-xs text-neutral-400 font-semibold uppercase">Total Expenditures</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">{formatCurrency(expenses.spent)}</p>
            </div>
            <div className="p-4 rounded-xl border border-neutral-200 bg-white">
              <span className="text-xs text-neutral-400 font-semibold uppercase">Remaining Surplus</span>
              <p className={`text-2xl font-bold mt-1 ${expenses.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(expenses.remaining)}
              </p>
            </div>
          </div>

          <SectionCard title="Logged Expenses & Receipts">
            {expenses.transactions.length === 0 ? (
              <EmptyState icon={DollarSign} title="No Expenses Logged" description="No site expenses have been recorded for this project yet." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                      <th className="p-4">Description</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Logged By</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {expenses.transactions.map(exp => (
                      <tr key={exp.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="p-4 font-bold text-neutral-900">{exp.description}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-600">{exp.logged_by_name || 'Contractor'}</td>
                        <td className="p-4 font-bold text-rose-700">{formatCurrency(exp.amount)}</td>
                        <td className="p-4 text-right text-xs text-neutral-500">{exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* TAB 6: DOCUMENTS */}
      {activeTab === 'documents' && (
        <SectionCard title="Project Contracts, Permits & Blueprints">
          {documents.length === 0 ? (
            <EmptyState icon={FileText} title="No Documents Uploaded" description="Contracts, blueprints, permits, and invoices will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                    <th className="p-4">Document Title</th>
                    <th className="p-4">Document Type</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4">Date Uploaded</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-bold text-neutral-900">{doc.title}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          {doc.file_type}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-600">{doc.uploader_name}</td>
                      <td className="p-4 text-xs text-neutral-500">{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(doc.file_url, '_blank')} 
                          className="gap-1 text-xs"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* CONTRACTOR PROFILE MODAL */}
      <Modal 
        isOpen={isContractorModalOpen} 
        onClose={() => setIsContractorModalOpen(false)} 
        title="Contractor Profile Details"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-gold-50 p-4 rounded-xl border border-gold-200">
            <div className="w-14 h-14 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-xl">
              {team.contractor.name?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                {team.contractor.name}
                {team.contractor.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
              </h3>
              <p className="text-xs font-semibold text-gold-700">{team.contractor.company_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div>
              <span className="text-xs text-neutral-400 uppercase font-semibold">Verification Status</span>
              <p className="font-bold text-emerald-700">{team.contractor.is_verified ? 'Verified & Active' : 'Pending'}</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase font-semibold">Total Projects</span>
              <p className="font-bold text-neutral-800">{team.contractor.total_projects} Projects</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase font-semibold">Completed Projects</span>
              <p className="font-bold text-neutral-800">{team.contractor.completed_projects} Projects</p>
            </div>
            <div>
              <span className="text-xs text-neutral-400 uppercase font-semibold">Avg Portfolio Completion</span>
              <p className="font-bold text-gold-600">{team.contractor.avg_completion}%</p>
            </div>
          </div>

          <div className="text-sm space-y-2 pt-2">
            <p><strong>Email Address:</strong> {team.contractor.email || 'N/A'}</p>
            <p><strong>Phone Number:</strong> {team.contractor.phone || 'N/A'}</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-neutral-100">
            <Button variant="primary" onClick={() => setIsContractorModalOpen(false)}>Close Profile</Button>
          </div>
        </div>
      </Modal>

      {/* WORKER PROFILE MODAL */}
      <Modal 
        isOpen={isWorkerModalOpen} 
        onClose={() => setIsWorkerModalOpen(false)} 
        title="Worker Detail Profile"
      >
        {selectedWorker && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <img src={selectedWorker.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={selectedWorker.worker_name} className="w-14 h-14 rounded-full object-cover border border-neutral-300" />
              <div>
                <h3 className="font-bold text-base text-neutral-900">{selectedWorker.worker_name}</h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gold-100 text-gold-800 border border-gold-200">
                  {selectedWorker.trade || 'Worker'}
                </span>
                <p className="text-xs text-neutral-500 mt-1">Experience: {selectedWorker.experience || 'N/A'} • Rating: ★ {selectedWorker.rating || 5.0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold">Assigned Date</span>
                <p className="font-medium text-neutral-800">{selectedWorker.assigned_date ? new Date(selectedWorker.assigned_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold">Attendance Today</span>
                <p className={`font-bold ${selectedWorker.attendance_today === 'Present' ? 'text-emerald-600' : 'text-neutral-500'}`}>
                  {selectedWorker.attendance_today}
                </p>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold">Completed Tasks</span>
                <p className="font-bold text-neutral-800">{selectedWorker.completed_tasks_count} tasks</p>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold">Current Task</span>
                <p className="font-medium text-neutral-800 truncate">{selectedWorker.current_task || 'General Site Duties'}</p>
              </div>
            </div>

            {selectedWorker.about_me && (
              <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200 leading-relaxed">
                <strong>About Worker:</strong> {selectedWorker.about_me}
              </div>
            )}

            {selectedWorker.latest_work_description && (
              <div className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <strong>Latest Work Log:</strong> "{selectedWorker.latest_work_description}"
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <Button variant="primary" onClick={() => setIsWorkerModalOpen(false)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export const HomeownerProjectWorkspace = () => (
  <ErrorBoundary>
    <HomeownerProjectWorkspaceContent />
  </ErrorBoundary>
);
