import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '@/services/apiClient';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { 
  Building2, 
  ChevronLeft, 
  Users, 
  LineChart, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  RefreshCw,
  Info,
  HardHat,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1200',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200'
];

const WorkerBuildingWorkspaceContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkspace = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/projects/${id}/building-workspace`);
      setWorkspace(res.data?.data || null);
    } catch (err) {
      console.error("Failed to load building workspace:", err);
      setError(err.response?.data?.message || 'Failed to load building details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/worker/buildings')} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to My Buildings
          </Button>
        </div>
        <div className="h-48 bg-neutral-100 animate-pulse rounded-2xl" />
        <SectionCard>
          <TablePlaceholder columns={4} rows={5} />
        </SectionCard>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/worker/buildings')} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to My Buildings
        </Button>
        <ErrorState title="Building Not Assigned or Restricted" description={error || 'You are not assigned to this building site.'} onRetry={fetchWorkspace} />
      </div>
    );
  }

  const { project, team, progress, tasks, documents } = workspace;
  const coverImage = PROJECT_COVER_IMAGES[(project.id?.charCodeAt(0) || 0) % PROJECT_COVER_IMAGES.length];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/worker/buildings')} className="gap-1 text-xs font-semibold">
            <ChevronLeft className="w-4 h-4" /> Back to My Buildings
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              {project.project_name}
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}>
                {project.status}
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">Code: {project.project_code} • {project.address}, {project.city}</p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={fetchWorkspace} className="gap-2 text-xs">
          <RefreshCw className="w-4 h-4" /> Refresh Building State
        </Button>
      </div>

      {/* Building Hero Card */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white shadow-md">
        <img src={coverImage} alt={project.project_name} className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div className="relative z-10 p-6 md:p-8 bg-gradient-to-t from-neutral-950 via-neutral-900/80 to-transparent">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Building Completion</span>
              <span className="text-2xl md:text-3xl font-extrabold text-gold-400 mt-1 block">{project.completion_percentage}%</span>
              <div className="w-full bg-neutral-700 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-gold-500 h-full rounded-full" style={{ width: `${project.completion_percentage}%` }} />
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Lead Contractor</span>
              <span className="text-base md:text-lg font-bold text-white mt-1 block truncate">{team.contractor.name || 'Supervisor'}</span>
              <span className="text-xs text-neutral-300 block">{team.contractor.company_name}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Site Engineer / Lead</span>
              <span className="text-base md:text-lg font-bold text-white mt-1 block truncate">{team.site_engineer.name}</span>
              <span className="text-xs text-neutral-400 block">On-Site Management</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">Target End Date</span>
              <span className="text-base md:text-lg font-bold text-white mt-1 block">
                {project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString() : 'TBD'}
              </span>
              <span className="text-xs text-neutral-400 block">{team.workers.length} On-Site Workers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Building-Specific Tabs (Clean, No Duplicated Navigation) */}
      <div className="flex items-center gap-1 border-b border-neutral-200 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'team', label: `On-Site Team (${team.workers.length + 1})`, icon: Users },
          { id: 'progress', label: `Site Progress Feed (${progress.length})`, icon: LineChart },
          { id: 'timeline', label: `Timeline & Milestones (${tasks.length})`, icon: Calendar },
          { id: 'documents', label: `Building Documents (${documents.length})`, icon: FileText }
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
          <SectionCard title="Building Overview & Instructions">
            <p className="text-sm text-neutral-700 leading-relaxed mb-4">
              {project.description || 'General construction site duties and building tasks.'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 text-sm">
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">Site Location</span>
                <span className="font-medium text-neutral-900">{project.address || project.city || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">City / Region</span>
                <span className="font-medium text-neutral-900">{project.city}, {project.state || 'India'}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">Planned Start Date</span>
                <span className="font-medium text-neutral-900">{project.planned_start_date ? new Date(project.planned_start_date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-400 uppercase font-semibold block">Target End Date</span>
                <span className="font-medium text-neutral-900">{project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* TAB 2: TEAM */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Management Leadership */}
          <SectionCard title="Site Leadership & Management">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contractor */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-lg shrink-0">
                  {team.contractor.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{team.contractor.name}</h4>
                  <span className="text-xs font-semibold text-gold-700 block">{team.contractor.company_name} (Contractor)</span>
                  <p className="text-xs text-neutral-500 mt-1">{team.contractor.phone || team.contractor.email}</p>
                </div>
              </div>

              {/* Site Engineer */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                  <HardHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{team.site_engineer.name}</h4>
                  <span className="text-xs font-semibold text-blue-700 block">Lead Site Engineer</span>
                  <p className="text-xs text-neutral-500 mt-1">Supervising Construction Execution</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Assigned Workers List */}
          <SectionCard title={`Assigned On-Site Workers (${team.workers.length})`}>
            {team.workers.length === 0 ? (
              <EmptyState icon={Users} title="No Assigned Workers" description="No worker profiles currently assigned to this building site." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                      <th className="p-4">Worker Name</th>
                      <th className="p-4">Trade / Skill</th>
                      <th className="p-4">Current Assigned Task</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Assigned Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {team.workers.map(w => (
                      <tr key={w.worker_id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="p-4 font-bold text-neutral-900 flex items-center gap-3">
                          <img src={w.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={w.worker_name} className="w-8 h-8 rounded-full object-cover border border-neutral-200" />
                          {w.worker_name}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gold-50 text-gold-800 border border-gold-200">
                            {w.trade || 'Worker'}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-700 font-medium">{w.current_task || 'General Site Duties'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            w.status === 'On Site Today' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-xs text-neutral-500">
                          {w.assigned_date ? new Date(w.assigned_date).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* TAB 3: PROGRESS */}
      {activeTab === 'progress' && (
        <SectionCard title="Building Site Progress Feed">
          {progress.length === 0 ? (
            <EmptyState icon={LineChart} title="No Progress Logs Yet" description="Site photo and video progress updates logged by workers and contractors will appear here." />
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
                      <img src={update.file_url} alt="Progress log site photo" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* TAB 4: TIMELINE */}
      {activeTab === 'timeline' && (
        <SectionCard title="Building Milestones & Task Schedule">
          {tasks.length === 0 ? (
            <EmptyState icon={Calendar} title="No Milestones Logged" description="Building milestones and scheduled tasks will be listed here." />
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

      {/* TAB 5: DOCUMENTS */}
      {activeTab === 'documents' && (
        <SectionCard title="Project-Related Building Documents">
          {documents.length === 0 ? (
            <EmptyState icon={FileText} title="No Documents Attached" description="Building blueprints, safety specs, and work orders will appear here." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                    <th className="p-4">Document Title</th>
                    <th className="p-4">Document Type</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4">Date Attached</th>
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
    </div>
  );
};

export const WorkerBuildingWorkspace = () => (
  <ErrorBoundary>
    <WorkerBuildingWorkspaceContent />
  </ErrorBoundary>
);
