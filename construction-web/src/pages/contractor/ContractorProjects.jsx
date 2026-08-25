import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { 
  Briefcase, 
  Filter, 
  RefreshCw, 
  Eye, 
  Users, 
  DollarSign, 
  Calendar, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LineChart,
  Package,
  Receipt,
  FileText,
  ListTodo,
  Flag,
  Send,
  Plus,
  Trash2,
  Edit,
  Check,
  XCircle,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import * as contractorService from '@/services/contractorService';
import { TaskCreationDrawer } from '@/components/contractor/TaskCreationDrawer';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'
];

const PROJECT_STATUS_OPTIONS = [
  'Planning',
  'Pending Approval',
  'Active',
  'In Progress',
  'On Hold',
  'Delayed',
  'Completed',
  'Cancelled'
];

const ContractorProjectsContent = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected Project Workspace Modal
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState('overview');

  // Tasks Tab States
  const [tasks, setTasks] = useState([]);
  const [taskViewMode, setTaskViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    estimated_duration: '1 Day',
    assigned_worker_ids: [],
    milestone_id: ''
  });
  const [isSavingTask, setIsSavingTask] = useState(false);

  // Task Review Modal
  const [reviewingTask, setReviewingTask] = useState(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Milestones Tab States
  const [milestones, setMilestones] = useState([]);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ name: '', description: '', due_date: '' });

  // Daily Work Updates States
  const [workUpdates, setWorkUpdates] = useState([]);
  const [isWorkUpdateModalOpen, setIsWorkUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', content: '', file_url: '', file_type: 'Photo' });

  // Expense Management States
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Materials',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    receipt_url: ''
  });
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [expenseFormError, setExpenseFormError] = useState(null);

  // Project Status & Progress Edit State
  const [editingStatus, setEditingStatus] = useState('');
  const [editingProgress, setEditingProgress] = useState(0);
  const [isSavingProjectMeta, setIsSavingProjectMeta] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await contractorService.getProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to load contractor projects:", err);
      setError(err.response?.data?.message || 'Failed to fetch assigned projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenWorkspace = async (projectId) => {
    setSelectedProjectId(projectId);
    setIsLoadingWorkspace(true);
    setWorkspaceTab('overview');
    try {
      const [wsRes, tasksRes, msRes, dwuRes] = await Promise.all([
        contractorService.getProjectWorkspace(projectId),
        contractorService.getProjectTasks(projectId),
        contractorService.getProjectMilestones(projectId),
        contractorService.getDailyWorkUpdates(projectId)
      ]);
      const ws = wsRes.data || null;
      setWorkspace(ws);
      setTasks(tasksRes.data || []);
      setMilestones(msRes.data || []);
      setWorkUpdates(dwuRes.data || []);
      if (ws?.project) {
        setEditingStatus(ws.project.status);
        setEditingProgress(Math.round(ws.project.completion_percentage || 0));
      }
    } catch (err) {
      console.error("Failed to load workspace:", err);
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  const reloadWorkspaceSubdata = async (projectId) => {
    try {
      const [wsRes, tasksRes, msRes, dwuRes] = await Promise.all([
        contractorService.getProjectWorkspace(projectId),
        contractorService.getProjectTasks(projectId),
        contractorService.getProjectMilestones(projectId),
        contractorService.getDailyWorkUpdates(projectId)
      ]);
      setWorkspace(wsRes.data || null);
      setTasks(tasksRes.data || []);
      setMilestones(msRes.data || []);
      setWorkUpdates(dwuRes.data || []);
      fetchProjects();
    } catch (err) {
      console.error("Failed to refresh workspace:", err);
    }
  };

  const handleSaveProjectStatusAndProgress = async () => {
    if (!selectedProjectId) return;
    setIsSavingProjectMeta(true);
    try {
      await contractorService.updateProjectStatus(selectedProjectId, editingStatus);
      await contractorService.updateProjectProgress(selectedProjectId, { completion_percentage: editingProgress });
      alert('Project status & completion progress saved successfully!');
      reloadWorkspaceSubdata(selectedProjectId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save project status.');
    } finally {
      setIsSavingProjectMeta(false);
    }
  };

  // TASK ACTIONS
  const handleOpenTaskModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'Medium',
        due_date: task.due_date ? task.due_date.substring(0, 10) : '',
        estimated_duration: task.estimated_duration || '1 Day',
        assigned_worker_ids: task.assigned_workers ? task.assigned_workers.map(w => w.id) : [],
        milestone_id: task.milestone_id || ''
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        priority: 'Medium',
        due_date: '',
        estimated_duration: '1 Day',
        assigned_worker_ids: [],
        milestone_id: ''
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    setIsSavingTask(true);
    try {
      if (editingTask) {
        await contractorService.updateTask(editingTask.id, taskForm);
      } else {
        await contractorService.createTask(selectedProjectId, taskForm);
      }
      setIsTaskModalOpen(false);
      reloadWorkspaceSubdata(selectedProjectId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await contractorService.deleteTask(taskId);
        reloadWorkspaceSubdata(selectedProjectId);
      } catch (err) {
        alert('Failed to delete task.');
      }
    }
  };

  const handleTaskReviewSubmit = async (action) => {
    if (!reviewingTask) return;
    setIsSubmittingReview(true);
    try {
      await contractorService.reviewTask(reviewingTask.id, { action, contractor_comments: reviewComments });
      setReviewingTask(null);
      setReviewComments('');
      reloadWorkspaceSubdata(selectedProjectId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process task review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // MILESTONE ACTIONS
  const handleSaveMilestone = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await contractorService.createMilestone(selectedProjectId, milestoneForm);
      setIsMilestoneModalOpen(false);
      setMilestoneForm({ name: '', description: '', due_date: '' });
      reloadWorkspaceSubdata(selectedProjectId);
    } catch (err) {
      alert('Failed to create milestone.');
    }
  };

  // DAILY WORK UPDATE ACTIONS
  const handleSaveDailyWorkUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await contractorService.createDailyWorkUpdate(selectedProjectId, updateForm);
      setIsWorkUpdateModalOpen(false);
      setUpdateForm({ title: '', content: '', file_url: '', file_type: 'Photo' });
      reloadWorkspaceSubdata(selectedProjectId);
    } catch (err) {
      alert('Failed to post work update.');
    }
  };

  // EXPENSE ACTIONS
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    
    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setExpenseFormError('Please enter a valid expense amount greater than zero.');
      return;
    }

    setIsSavingExpense(true);
    setExpenseFormError(null);
    try {
      await contractorService.createExpense({
        project_id: selectedProjectId,
        ...expenseForm,
        amount
      });
      setIsExpenseModalOpen(false);
      setExpenseForm({
        title: '',
        category: 'Materials',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        receipt_url: ''
      });
      reloadWorkspaceSubdata(selectedProjectId);
    } catch (err) {
      setExpenseFormError(err.response?.data?.message || 'Failed to record expense.');
    } finally {
      setIsSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (confirm('Are you sure you want to delete this expense record? Financial totals will be updated.')) {
      try {
        await contractorService.deleteExpense(expenseId);
        reloadWorkspaceSubdata(selectedProjectId);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete expense record.');
      }
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

  const filteredProjects = projects.filter(p => {
    const matchesSearch = !search || 
      p.project_name.toLowerCase().includes(search.toLowerCase()) || 
      p.project_code.toLowerCase().includes(search.toLowerCase()) ||
      (p.owner_name && p.owner_name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assigned Construction Projects" 
        description="Manage building execution, assign worker tasks, review progress, and track milestones."
        action={
          <Button variant="outline" size="sm" onClick={fetchProjects} className="gap-2 text-xs font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh Projects
          </Button>
        }
      />

      <SectionCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <SearchBar 
              placeholder="Search project name, code or homeowner..." 
              value={search} 
              onChange={setSearch} 
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0 mr-1" />
            {['All', 'Active', 'Planning', 'On Hold', 'Delayed', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  statusFilter === st 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={4} rows={4} />
        ) : error ? (
          <ErrorState title="Unable to load projects" description={error} onRetry={fetchProjects} />
        ) : filteredProjects.length === 0 ? (
          <EmptyState 
            icon={Briefcase}
            title="No assigned projects found"
            description={search ? `No projects match "${search}".` : "You are not currently assigned as lead contractor for any active building contracts."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((p, idx) => {
              const coverImg = PROJECT_COVER_IMAGES[idx % PROJECT_COVER_IMAGES.length];
              return (
                <div 
                  key={p.id} 
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                      <img src={coverImg} alt={p.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-xs font-extrabold rounded-full border shadow-xs ${getStatusBadgeClass(p.status)}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                        {p.project_code}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                          {p.project_name}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">
                          Homeowner: <strong className="text-neutral-800">{p.owner_name || 'Homeowner'}</strong> ({p.owner_email})
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-neutral-500">Construction Completion</span>
                          <span className="text-gold-600 font-bold">{p.completion_percentage}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-gold-500 h-full rounded-full transition-all duration-300" style={{ width: `${p.completion_percentage}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-neutral-100 text-neutral-700 bg-neutral-50 p-3 rounded-xl">
                        <div>
                          <span className="text-neutral-400 uppercase text-[10px] font-bold block">Total Budget</span>
                          <strong className="text-neutral-900">{formatCurrency(p.budget)}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 uppercase text-[10px] font-bold block">Total Spent</span>
                          <strong className="text-rose-700">{formatCurrency(p.spent)}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 uppercase text-[10px] font-bold block">Remaining Balance</span>
                          <strong className="text-emerald-700">{formatCurrency(p.remaining)}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 uppercase text-[10px] font-bold block">Workers Assigned</span>
                          <strong className="text-neutral-900">{p.total_workers} Workers</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-500 font-mono">Target: {p.planned_end_date ? new Date(p.planned_end_date).toLocaleDateString() : 'N/A'}</span>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleOpenWorkspace(p.id)}
                      className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1.5 text-xs shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Open Workspace
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* PROJECT WORKSPACE MODAL */}
      <Modal
        isOpen={Boolean(selectedProjectId)}
        onClose={() => setSelectedProjectId(null)}
        title={workspace ? `Project Workspace: ${workspace.project.project_name}` : 'Loading Workspace...'}
      >
        {isLoadingWorkspace || !workspace ? (
          <TablePlaceholder columns={3} rows={5} />
        ) : (
          <div className="space-y-5">
            {/* SIMPLIFIED 5 CORE WORKSPACE TABS */}
            <div className="p-1.5 bg-neutral-100/90 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1 font-extrabold text-xs">
              {[
                { id: 'overview', label: 'Overview', icon: Briefcase },
                { id: 'team', label: `Team (${workspace.team.workers.length})`, icon: Users },
                { id: 'tasks', label: `Tasks (${tasks.length})`, icon: ListTodo },
                { id: 'progress', label: `Progress (${workUpdates.length})`, icon: Send },
                { id: 'milestones', label: `Timeline (${milestones.length})`, icon: Flag }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setWorkspaceTab(t.id)}
                  className={`flex-1 min-w-[100px] px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    workspaceTab === t.id 
                      ? 'bg-neutral-900 text-white shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/70'
                  }`}
                >
                  <t.icon className={`w-4 h-4 ${workspaceTab === t.id ? 'text-gold-400' : 'text-neutral-400'}`} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB: OVERVIEW & STATUS CONTROL */}
            {workspaceTab === 'overview' && (
              <div className="space-y-5 text-xs">
                {/* Status & Completion Progress Manager */}
                <div className="p-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-700 pb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-gold-400">Project Status & Progress Control</h4>
                      <p className="text-[11px] text-neutral-300">Updating project status notifies assigned workers and homeowner immediately.</p>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={handleSaveProjectStatusAndProgress}
                      disabled={isSavingProjectMeta}
                      className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shrink-0"
                    >
                      {isSavingProjectMeta ? 'Saving Changes...' : 'Save Status & Progress'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">Contract Status *</label>
                      <select
                        value={editingStatus}
                        onChange={e => setEditingStatus(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs font-bold focus:ring-2 focus:ring-gold-500"
                      >
                        {PROJECT_STATUS_OPTIONS.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase font-bold text-neutral-300">Completion Percentage</label>
                        <span className="text-gold-400 font-extrabold">{editingProgress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={editingProgress}
                        onChange={e => setEditingProgress(parseInt(e.target.value, 10))}
                        className="w-full accent-gold-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* FINANCIAL OVERVIEW & EXPENSE LOGGING CARD */}
                <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-sm text-neutral-900 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gold-600" /> Financial Budget & Expense Summary
                      </h4>
                      <p className="text-[11px] text-neutral-500">Real-time expenditure tracking and financial utilization.</p>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        setExpenseFormError(null);
                        setIsExpenseModalOpen(true);
                      }}
                      className="bg-gold-500 hover:bg-gold-600 text-white font-extrabold text-xs gap-1 shrink-0 shadow-xs"
                    >
                      <Plus className="w-4 h-4" /> Record New Expense
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Allocated Budget</span>
                      <strong className="text-neutral-900 text-sm">{formatCurrency(workspace.expenses.budget)}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Total Amount Spent</span>
                      <strong className="text-rose-700 text-sm">{formatCurrency(workspace.expenses.spent)}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Remaining Balance</span>
                      <strong className="text-emerald-700 text-sm">{formatCurrency(workspace.expenses.remaining)}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 uppercase font-bold text-[10px] block">Budget Utilization</span>
                      <strong className="text-gold-600 text-sm font-mono">
                        {workspace.expenses.budget > 0 ? ((workspace.expenses.spent / workspace.expenses.budget) * 100).toFixed(1) : 0}%
                      </strong>
                    </div>
                  </div>

                  {/* Budget Utilization Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-neutral-600">
                      <span>Spent: {formatCurrency(workspace.expenses.spent)}</span>
                      <span>Budget: {formatCurrency(workspace.expenses.budget)}</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          workspace.expenses.spent > workspace.expenses.budget ? 'bg-rose-600' : 'bg-gold-500'
                        }`} 
                        style={{ width: `${Math.min(100, (workspace.expenses.spent / (workspace.expenses.budget || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Recorded Expenses History Feed */}
                  <div className="pt-2">
                    <h5 className="font-bold text-xs text-neutral-800 uppercase tracking-wider mb-2">Recorded Expenses ({workspace.expenses.transactions.length})</h5>
                    {workspace.expenses.transactions.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic p-3 bg-neutral-50 rounded-lg">No expenses recorded for this project yet. Click "+ Record New Expense" to log costs.</p>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {workspace.expenses.transactions.map(exp => (
                          <div key={exp.id} className="p-3 rounded-xl border border-neutral-200 bg-white flex items-center justify-between text-xs gap-3 hover:border-gold-300 transition-colors">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <strong className="text-neutral-900 font-bold">{exp.title || `${exp.category} Expense`}</strong>
                                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                                  exp.category === 'Labor' ? 'bg-blue-100 text-blue-800' :
                                  exp.category === 'Materials' ? 'bg-amber-100 text-amber-900' :
                                  exp.category === 'Equipment' ? 'bg-purple-100 text-purple-800' :
                                  'bg-neutral-100 text-neutral-700'
                                }`}>
                                  {exp.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500">
                                {exp.vendor ? `Vendor: ${exp.vendor} • ` : ''}Date: {new Date(exp.date).toLocaleDateString()} {exp.description ? `• "${exp.description}"` : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <strong className="text-rose-700 font-extrabold text-sm">{formatCurrency(exp.amount)}</strong>
                              {exp.receipt_url && (
                                <a href={exp.receipt_url} target="_blank" rel="noreferrer" className="text-gold-600 hover:underline font-bold text-[11px]">
                                  Receipt
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteExpense(exp.id)}
                                className="text-neutral-400 hover:text-rose-600 p-1 rounded hover:bg-neutral-100"
                                title="Delete Expense"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-neutral-400 uppercase font-bold text-[10px] block">Homeowner Name</span>
                    <strong className="text-neutral-900 text-sm">{workspace.team.owner.name}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 uppercase font-bold text-[10px] block">Homeowner Contact</span>
                    <strong className="text-neutral-900">{workspace.team.owner.email} • {workspace.team.owner.phone}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TASKS (KANBAN & LIST) */}
            {workspaceTab === 'tasks' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTaskViewMode('kanban')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        taskViewMode === 'kanban' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      Kanban Board
                    </button>
                    <button
                      onClick={() => setTaskViewMode('list')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        taskViewMode === 'list' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      List View
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenTaskModal(null)}
                    className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1"
                  >
                    + Create & Assign Task
                  </Button>
                </div>

                {tasks.length === 0 ? (
                  <EmptyState icon={ListTodo} title="No Tasks Created" description="Create and assign site tasks to accepted project workers." />
                ) : taskViewMode === 'kanban' ? (
                  /* KANBAN BOARD */
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { statusKey: 'Todo', title: 'To Do / Open', color: 'bg-neutral-100 text-neutral-800' },
                      { statusKey: 'In Progress', title: 'In Progress', color: 'bg-blue-100 text-blue-800' },
                      { statusKey: 'Under Review', title: 'Under Review', color: 'bg-amber-100 text-amber-900' },
                      { statusKey: 'Completed', title: 'Completed', color: 'bg-emerald-100 text-emerald-900' }
                    ].map(col => {
                      const columnTasks = tasks.filter(t => 
                        col.statusKey === 'Todo' ? (t.status === 'Todo' || t.status === 'Not Started') :
                        col.statusKey === 'Under Review' ? (t.status === 'Under Review' || t.status === 'Waiting for Review') :
                        t.status === col.statusKey
                      );
                      return (
                        <div key={col.statusKey} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-3 min-h-[300px]">
                          <div className="flex items-center justify-between font-extrabold text-xs">
                            <span className={`px-2 py-0.5 rounded-md ${col.color}`}>{col.title}</span>
                            <span className="text-neutral-400 font-mono">{columnTasks.length}</span>
                          </div>

                          <div className="space-y-2">
                            {columnTasks.map(t => (
                              <div key={t.id} className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-2 text-xs hover:border-gold-400 transition-colors">
                                <div className="flex items-start justify-between gap-1">
                                  <h5 className="font-bold text-neutral-900 text-xs">{t.title}</h5>
                                  <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded ${
                                    t.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                    t.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                                    'bg-neutral-100 text-neutral-600'
                                  }`}>
                                    {t.priority}
                                  </span>
                                </div>

                                {t.description && <p className="text-neutral-500 text-[11px] line-clamp-2">{t.description}</p>}

                                <div className="text-[11px] text-neutral-600 pt-1 border-t border-neutral-100 space-y-1">
                                  <p><strong>Assigned:</strong> {t.assigned_workers?.length > 0 ? t.assigned_workers.map(w => w.name).join(', ') : 'Unassigned'}</p>
                                  <p><strong>Due:</strong> {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'}</p>
                                </div>

                                {/* Review Action Button for Under Review tasks */}
                                {(t.status === 'Under Review' || t.status === 'Waiting for Review') && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setReviewingTask(t)}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] gap-1 justify-center py-1 mt-1"
                                  >
                                    Review Worker Submission
                                  </Button>
                                )}

                                <div className="flex justify-end gap-2 pt-1">
                                  <button onClick={() => handleOpenTaskModal(t)} className="text-neutral-400 hover:text-neutral-800"><Edit className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => handleDeleteTask(t.id)} className="text-neutral-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* LIST VIEW */
                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white text-xs">
                    {tasks.map(t => (
                      <div key={t.id} className="p-3 flex items-center justify-between gap-3 hover:bg-neutral-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-neutral-900 text-sm font-bold">{t.title}</strong>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadgeClass(t.status)}`}>
                              {t.status}
                            </span>
                            <span className="text-neutral-400 font-mono">[{t.priority}]</span>
                          </div>
                          <p className="text-neutral-500 mt-0.5">{t.description}</p>
                          <p className="text-neutral-400 text-[11px] mt-1">Assigned: {t.assigned_workers?.map(w => w.name).join(', ') || 'Unassigned'} • Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {(t.status === 'Under Review' || t.status === 'Waiting for Review') && (
                            <Button size="sm" onClick={() => setReviewingTask(t)} className="bg-amber-500 text-white font-bold text-xs">Review</Button>
                          )}
                          <button onClick={() => handleOpenTaskModal(t)} className="p-1 text-neutral-400 hover:text-neutral-800"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteTask(t.id)} className="p-1 text-neutral-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MILESTONES */}
            {workspaceTab === 'milestones' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Project Milestones & Phases</h4>
                  <Button variant="primary" size="sm" onClick={() => setIsMilestoneModalOpen(true)} className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1">
                    + Create Milestone
                  </Button>
                </div>

                {milestones.length === 0 ? (
                  <EmptyState icon={Flag} title="No Milestones Created" description="Create target building milestones to track project phases." />
                ) : (
                  <div className="space-y-3">
                    {milestones.map(m => (
                      <div key={m.id} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-neutral-900 text-sm">{m.name}</span>
                          <span className={`px-2.5 py-0.5 text-xs rounded-full border ${m.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-neutral-600">{m.description}</p>
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-100">
                          <span>Target Due: {m.due_date ? new Date(m.due_date).toLocaleDateString() : 'N/A'}</span>
                          <span>Linked Tasks: {m.completed_tasks} / {m.total_tasks} Completed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROGRESS & DAILY WORK UPDATES */}
            {workspaceTab === 'progress' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Daily Site Work Log Feed</h4>
                  <Button variant="primary" size="sm" onClick={() => setIsWorkUpdateModalOpen(true)} className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1">
                    + Post Daily Work Update
                  </Button>
                </div>

                {workUpdates.length === 0 ? (
                  <EmptyState icon={Send} title="No Daily Updates" description="Post site updates visible to assigned workers and homeowner." />
                ) : (
                  <div className="space-y-3">
                    {workUpdates.map(u => (
                      <div key={u.id} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2 text-xs">
                        <div className="flex justify-between font-bold text-neutral-900">
                          <span>{u.title || 'Daily Site Progress Update'}</span>
                          <span className="text-neutral-400 font-mono">{new Date(u.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-neutral-700 leading-relaxed">{u.content}</p>
                        {u.file_url && <img src={u.file_url} alt="Update file" className="w-full h-44 object-cover rounded-lg border" />}
                        <p className="text-[10px] text-neutral-400">Posted by {u.author_name} ({u.author_role})</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: TEAM */}
            {workspaceTab === 'team' && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Project Roster & Invitations</h4>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-emerald-800">Accepted Active Members ({workspace.team.workers.length})</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workspace.team.workers.map(w => (
                      <div key={w.worker_id} className="p-3 rounded-xl border border-neutral-200 bg-white space-y-1">
                        <div className="flex justify-between font-bold text-neutral-900">
                          <span>{w.worker_name}</span>
                          <span className="text-gold-700 font-semibold">{w.trade || 'Worker'}</span>
                        </div>
                        <p className="text-neutral-500">Joined: {w.assigned_date ? new Date(w.assigned_date).toLocaleDateString() : 'Active Member'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-neutral-100">
              <Button variant="primary" size="sm" onClick={() => setSelectedProjectId(null)}>Close Workspace</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* REDESIGNED PROCORE-QUALITY TASK CREATION DRAWER */}
      <TaskCreationDrawer
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        project={workspace?.project}
        eligibleWorkers={workspace?.team?.workers || []}
        milestones={milestones}
        editingTask={editingTask}
        isSaving={isSavingTask}
        onSaveTask={async (taskData) => {
          if (!selectedProjectId) return;
          setIsSavingTask(true);
          try {
            if (editingTask) {
              await contractorService.updateTask(editingTask.id, taskData);
            } else {
              await contractorService.createTask(selectedProjectId, taskData);
            }
            setIsTaskModalOpen(false);
            reloadWorkspaceSubdata(selectedProjectId);
          } catch (err) {
            alert(err.response?.data?.message || 'Failed to save task.');
          } finally {
            setIsSavingTask(false);
          }
        }}
      />

      {/* TASK REVIEW & APPROVAL MODAL */}
      <Modal isOpen={!!reviewingTask} onClose={() => setReviewingTask(null)} title={`Review Task Submission: ${reviewingTask?.title || ''}`}>
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <p><strong>Submitted by:</strong> {reviewingTask?.assigned_workers?.map(w => w.name).join(', ') || 'Worker'}</p>
            {reviewingTask?.completion_notes && <p><strong>Worker Completion Notes:</strong> "{reviewingTask.completion_notes}"</p>}
            {reviewingTask?.completion_file_url && (
              <div>
                <strong className="block mb-1">Attached Completion Media:</strong>
                <img src={reviewingTask.completion_file_url} alt="Submission" className="w-full h-44 object-cover rounded-lg border" />
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Contractor Feedback / Revision Comments</label>
            <textarea
              rows="3"
              value={reviewComments}
              onChange={e => setReviewComments(e.target.value)}
              placeholder="Add feedback for approval or specify required revisions..."
              className="w-full p-3 border border-neutral-300 rounded-xl text-sm font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-neutral-100">
            <Button
              variant="outline"
              onClick={() => handleTaskReviewSubmit('reject')}
              disabled={isSubmittingReview}
              className="border-rose-300 text-rose-700 hover:bg-rose-50 font-bold"
            >
              <XCircle className="w-4 h-4 mr-1" /> Request Changes / Reject
            </Button>
            <Button
              variant="primary"
              onClick={() => handleTaskReviewSubmit('approve')}
              disabled={isSubmittingReview}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <Check className="w-4 h-4 mr-1" /> Approve Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* CREATE MILESTONE MODAL */}
      <Modal isOpen={isMilestoneModalOpen} onClose={() => setIsMilestoneModalOpen(false)} title="Create Project Milestone">
        <form onSubmit={handleSaveMilestone} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Milestone Name *</label>
            <input required type="text" value={milestoneForm.name} onChange={e => setMilestoneForm({ ...milestoneForm, name: e.target.value })} placeholder="e.g., Foundation Completion" className="w-full h-10 px-3 border border-neutral-300 rounded-xl text-sm font-medium" />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Target Due Date</label>
            <input type="date" value={milestoneForm.due_date} onChange={e => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })} className="w-full h-10 px-3 border border-neutral-300 rounded-xl text-sm font-medium" />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Description</label>
            <textarea rows="3" value={milestoneForm.description} onChange={e => setMilestoneForm({ ...milestoneForm, description: e.target.value })} placeholder="Milestone details..." className="w-full p-3 border border-neutral-300 rounded-xl text-sm font-medium" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" type="button" onClick={() => setIsMilestoneModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="bg-gold-500 hover:bg-gold-600 text-white font-bold">Save Milestone</Button>
          </div>
        </form>
      </Modal>

      {/* CREATE DAILY WORK UPDATE MODAL */}
      <Modal isOpen={isWorkUpdateModalOpen} onClose={() => setIsWorkUpdateModalOpen(false)} title="Post Daily Work Update">
        <form onSubmit={handleSaveDailyWorkUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Update Title</label>
            <input type="text" value={updateForm.title} onChange={e => setUpdateForm({ ...updateForm, title: e.target.value })} placeholder="e.g., Roof Framing Completed Ahead of Schedule" className="w-full h-10 px-3 border border-neutral-300 rounded-xl text-sm font-medium" />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Update Details *</label>
            <textarea required rows="4" value={updateForm.content} onChange={e => setUpdateForm({ ...updateForm, content: e.target.value })} placeholder="Describe site accomplishments, weather conditions, or next steps..." className="w-full p-3 border border-neutral-300 rounded-xl text-sm font-medium" />
          </div>
          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Attached Photo / Video URL</label>
            <input type="url" value={updateForm.file_url} onChange={e => setUpdateForm({ ...updateForm, file_url: e.target.value })} placeholder="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7" className="w-full h-10 px-3 border border-neutral-300 rounded-xl text-sm font-medium" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" type="button" onClick={() => setIsWorkUpdateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" className="bg-gold-500 hover:bg-gold-600 text-white font-bold">Post Work Update</Button>
          </div>
        </form>
      </Modal>

      {/* RECORD NEW EXPENSE MODAL */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Record Building Project Expense">
        <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
          {expenseFormError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-xl">
              ⚠️ {expenseFormError}
            </div>
          )}

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Building Project *</label>
            <input
              type="text"
              disabled
              value={workspace?.project?.project_name || 'Selected Project'}
              className="w-full h-10 px-3 bg-neutral-100 border border-neutral-300 rounded-xl font-bold text-neutral-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">Expense Category *</label>
              <select
                value={expenseForm.category}
                onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full h-10 px-3 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-gold-500"
              >
                <option value="Labor">Labor</option>
                <option value="Materials">Materials</option>
                <option value="Equipment">Equipment</option>
                <option value="Permits">Permits</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">Amount (₹) *</label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                placeholder="e.g., 25000"
                className="w-full h-10 px-3 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">Expense Title / Item Name *</label>
              <input
                required
                type="text"
                value={expenseForm.title}
                onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
                placeholder="e.g., Cement Batch #3 Purchase"
                className="w-full h-10 px-3 border border-neutral-300 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">Expense Date *</label>
              <input
                required
                type="date"
                value={expenseForm.date}
                onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="w-full h-10 px-3 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Vendor / Supplier Name</label>
            <input
              type="text"
              value={expenseForm.vendor}
              onChange={e => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
              placeholder="e.g., Apex Building Supplies Ltd."
              className="w-full h-10 px-3 border border-neutral-300 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Description / Notes</label>
            <textarea
              rows="3"
              value={expenseForm.description}
              onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
              placeholder="Add payment notes, invoice references, or delivery terms..."
              className="w-full p-3 border border-neutral-300 rounded-xl font-medium text-neutral-800 focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Receipt / Invoice Image URL</label>
            <input
              type="url"
              value={expenseForm.receipt_url}
              onChange={e => setExpenseForm({ ...expenseForm, receipt_url: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7"
              className="w-full h-10 px-3 border border-neutral-300 rounded-xl font-medium text-neutral-900 focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {expenseForm.receipt_url && (
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-[11px] font-bold text-neutral-500 block mb-1">Receipt Image Preview:</span>
              <img src={expenseForm.receipt_url} alt="Receipt Preview" className="w-full h-36 object-cover rounded-lg border" />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" type="button" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSavingExpense} className="bg-gold-500 hover:bg-gold-600 text-white font-extrabold">
              {isSavingExpense ? 'Recording Expense...' : 'Record Expense'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const ContractorProjects = () => (
  <ErrorBoundary>
    <ContractorProjectsContent />
  </ErrorBoundary>
);
