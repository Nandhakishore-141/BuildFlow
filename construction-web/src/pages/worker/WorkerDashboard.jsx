import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { 
  Building2, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ListTodo, 
  Megaphone, 
  Upload, 
  ArrowRight, 
  MapPin, 
  User, 
  Calendar,
  LogOut,
  Camera,
  Plus,
  Send,
  XCircle,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as workerService from '@/services/workerService';
import * as projectService from '@/services/projectService';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'
];

const WorkerDashboardContent = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check-In Modal & Action States
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isSubmittingCheckIn, setIsSubmittingCheckIn] = useState(false);
  const [checkInError, setCheckInError] = useState(null);

  // Task Completion Modal States
  const [completedTask, setCompletedTask] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionPhotoUrl, setCompletionPhotoUrl] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskError, setTaskError] = useState(null);

  // Action notification banner
  const [actionNotice, setActionNotice] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, projectsRes, tasksRes, invRes] = await Promise.all([
        workerService.getDashboardStats(),
        projectService.getProjects({ limit: 10 }),
        workerService.getTasks(),
        workerService.getInvitations()
      ]);

      setStats(statsRes.data || {});
      
      const rawProjects = projectsRes.data?.data?.data || projectsRes.data?.data || projectsRes.data || [];
      const projsList = Array.isArray(rawProjects) ? rawProjects : (Array.isArray(rawProjects?.data) ? rawProjects.data : []);
      setAssignedProjects(projsList);

      const rawTasks = tasksRes.data?.data || tasksRes.data || [];
      setTasks(Array.isArray(rawTasks) ? rawTasks : []);

      const rawInv = invRes.data?.data || invRes.data || [];
      setInvitations(Array.isArray(rawInv) ? rawInv : []);
      
      if (projsList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projsList[0].id);
      }
    } catch (err) {
      console.error("Failed to load worker dashboard:", err);
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRespondInvitation = async (invitationId, action) => {
    try {
      const res = await workerService.respondToInvitation(invitationId, action);
      const updatedStatus = res.data?.status || (action === 'accept' ? 'Accepted' : 'Rejected');
      
      setActionNotice({
        type: action === 'accept' ? 'success' : 'info',
        message: action === 'accept' 
          ? 'You have accepted the project invitation! You are now a member of the building team.' 
          : 'You declined the project invitation.'
      });

      // Update local invitation state immediately
      setInvitations(prev => prev.filter(inv => inv.invitation_id !== invitationId));
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to respond to invitation.');
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setCheckInError('Please select an assigned project site.');
      return;
    }

    setIsSubmittingCheckIn(true);
    setCheckInError(null);
    try {
      await workerService.clockIn({ project_id: selectedProjectId, latitude: 12.9716, longitude: 77.5946 });
      setIsCheckInModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      setCheckInError(err.response?.data?.message || 'Failed to check in.');
    } finally {
      setIsSubmittingCheckIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsSubmittingCheckIn(true);
    try {
      await workerService.clockOut({ latitude: 12.9716, longitude: 77.5946 });
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clock out.');
    } finally {
      setIsSubmittingCheckIn(false);
    }
  };

  const handleCompleteTaskSubmit = async (e) => {
    e.preventDefault();
    if (!completedTask) return;

    setIsSubmittingTask(true);
    setTaskError(null);
    try {
      await workerService.updateTaskStatus(completedTask.id, {
        status: 'Completed',
        notes: completionNotes,
        file_url: completionPhotoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800'
      });
      setCompletedTask(null);
      setCompletionNotes('');
      setCompletionPhotoUrl('');
      await fetchDashboardData();
    } catch (err) {
      setTaskError(err.response?.data?.message || 'Failed to complete task.');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Worker Dashboard" description="Loading your dashboard statistics and site duties..." />
        <TablePlaceholder columns={3} rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Worker Dashboard" description="Site management & building duties" />
        <ErrorState title="Unable to load dashboard" description={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  const { todayAttendance, activeProject } = stats || {};
  const isCheckedIn = todayAttendance?.status === 'Checked In';
  const isCheckedOut = todayAttendance?.status === 'Checked Out';
  const pendingInvitations = invitations.filter(inv => inv.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Worker Dashboard" 
        description={`Welcome back, ${user?.name}. Here is your construction schedule, site duties, and invitations.`}
        action={
          <div className="flex items-center gap-3">
            {isCheckedIn ? (
              <Button 
                variant="outline" 
                onClick={handleCheckOut}
                disabled={isSubmittingCheckIn}
                className="gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 font-bold text-xs"
              >
                <LogOut className="w-4 h-4" />
                Clock Out Now
              </Button>
            ) : isCheckedOut ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Shift Completed Today
              </span>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setIsCheckInModalOpen(true)}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-bold text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Check In Today
              </Button>
            )}

            <Button 
              variant="outline"
              onClick={() => navigate('/worker/upload-progress')}
              className="gap-2 text-xs font-bold"
            >
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
          </div>
        }
      />

      {/* Action Notice Banner */}
      {actionNotice && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between ${
          actionNotice.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-blue-50 text-blue-900 border-blue-200'
        }`}>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionNotice.message}
          </span>
          <button onClick={() => setActionNotice(null)} className="text-neutral-500 hover:text-neutral-800 font-bold">✕</button>
        </div>
      )}

      {/* PENDING PROJECT INVITATIONS SECTION (CRITICAL) */}
      {pendingInvitations.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 rounded-2xl border-2 border-amber-400 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-neutral-900">
                  Project Invitations ({pendingInvitations.length})
                </h3>
                <p className="text-xs text-neutral-600">Contractors have invited you to join their building project teams.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-extrabold shadow-xs">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {pendingInvitations.map(inv => (
              <div key={inv.invitation_id} className="p-4 rounded-xl border border-amber-200 bg-white shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">{inv.project_name}</h4>
                      <span className="text-[11px] font-mono text-neutral-500">{inv.project_code} • {inv.city}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {inv.sent_at ? new Date(inv.sent_at).toLocaleDateString() : ''}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 mt-2 text-neutral-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                    <p><strong>Contractor:</strong> <span className="text-neutral-900 font-semibold">{inv.contractor_name}</span> ({inv.contractor_company || 'Lead Contractor'})</p>
                    <p><strong>Location:</strong> {inv.address || inv.city}</p>
                    {inv.message && <p className="text-neutral-700 italic pt-1">"{inv.message}"</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleRespondInvitation(inv.invitation_id, 'accept')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 justify-center"
                  >
                    <Check className="w-4 h-4" /> Accept Invitation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRespondInvitation(inv.invitation_id, 'reject')}
                    className="flex-1 border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs gap-1.5 justify-center"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Attendance Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isCheckedIn 
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
          : isCheckedOut 
          ? 'bg-blue-50/70 border-blue-200 text-blue-950'
          : 'bg-amber-50/70 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 font-bold ${
            isCheckedIn ? 'bg-emerald-600' : isCheckedOut ? 'bg-blue-600' : 'bg-amber-600'
          }`}>
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base">
                {isCheckedIn ? 'Currently Checked In' : isCheckedOut ? 'Shift Completed' : 'Not Checked In Today'}
              </h3>
              <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full border ${
                isCheckedIn ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isCheckedOut ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {todayAttendance?.status}
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              {isCheckedIn 
                ? `Clocked in at ${new Date(todayAttendance?.record?.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} for building "${todayAttendance?.record?.project_name}".`
                : isCheckedOut
                ? `Clocked out at ${new Date(todayAttendance?.record?.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
                : 'Select your assigned building project to check in and record your daily attendance.'}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {!isCheckedIn && !isCheckedOut && (
            <Button 
              variant="primary" 
              onClick={() => setIsCheckInModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Check In Now
            </Button>
          )}
          {isCheckedIn && (
            <Button 
              variant="outline" 
              onClick={handleCheckOut}
              disabled={isSubmittingCheckIn}
              className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs gap-2"
            >
              <LogOut className="w-4 h-4" /> Clock Out
            </Button>
          )}
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Assigned Projects" value={stats.assignedProjects || 0} icon={Building2} color="gold" />
        <StatCard title="Active Project" value={activeProject?.project_name ? activeProject.project_name.substring(0, 12) + '...' : 'None'} icon={MapPin} color="blue" />
        <StatCard title="Attendance (Month)" value={`${stats.monthlyAttendanceCount || 0} Days`} icon={Clock} color="green" />
        <StatCard title="Pending Tasks" value={stats.pendingTasks || 0} icon={ListTodo} color="gold" />
        <StatCard title="Completed Tasks" value={stats.completedTasks || 0} icon={CheckCircle2} color="green" />
        <StatCard title="Announcements" value={stats.recentAnnouncements?.length || 0} icon={Megaphone} color="purple" />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Assigned Projects & Assigned Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Assigned Buildings / Projects */}
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Your Assigned Building Sites</h2>
                <p className="text-xs text-neutral-500">Buildings and construction sites you have accepted and joined</p>
              </div>
              <Link to="/worker/buildings" className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {assignedProjects.length === 0 ? (
              <EmptyState 
                icon={Building2}
                title="No assigned building sites"
                description={pendingInvitations.length > 0 ? "Accept a pending invitation above to join a project team." : "You are not currently assigned to any building projects."}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignedProjects.slice(0, 4).map((building, idx) => {
                  const coverImg = PROJECT_COVER_IMAGES[idx % PROJECT_COVER_IMAGES.length];
                  return (
                    <div 
                      key={building.id}
                      onClick={() => navigate(`/worker/buildings/${building.id}`)}
                      className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative h-32 w-full overflow-hidden bg-neutral-900">
                        <img src={coverImg} alt={building.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
                        <div className="absolute top-2.5 right-2.5">
                          <span className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full border ${
                            building.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {building.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-neutral-900 text-sm group-hover:text-gold-600 transition-colors">
                          {building.project_name}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium">
                          Supervisor: <strong className="text-neutral-700">{building.contractor_name || building.contractor_company || 'Lead Contractor'}</strong>
                        </p>
                        <p className="text-xs text-neutral-400 truncate">{building.address || building.city}</p>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-neutral-500">Progress</span>
                            <span className="text-gold-600 font-bold">{building.completion_percentage}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gold-500 h-full rounded-full" style={{ width: `${building.completion_percentage}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-gold-700 group-hover:bg-gold-50 transition-colors">
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gold-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Assigned Tasks & Completion */}
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Assigned Tasks & Duties</h2>
                <p className="text-xs text-neutral-500">Complete tasks and attach progress photo/notes for contractor review</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                {tasks.filter(t => t.status !== 'Completed').length} Pending
              </span>
            </div>

            {tasks.length === 0 ? (
              <EmptyState 
                icon={ListTodo}
                title="No tasks assigned"
                description="There are currently no tasks assigned to you."
              />
            ) : (
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white">
                {tasks.slice(0, 6).map(t => (
                  <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/80 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-neutral-900">{t.title}</h4>
                        <span className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full border ${
                          t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          t.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1">{t.description || 'General site duties.'}</p>
                      <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-medium pt-0.5">
                        <span>Project: <strong className="text-neutral-700">{t.project_name}</strong></span>
                        <span>Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {t.status === 'Completed' ? (
                        <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg flex items-center gap-1.5 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                        </span>
                      ) : (
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={() => setCompletedTask(t)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-transparent font-bold gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

        </div>

        {/* Right Column: Announcements & Latest Work Updates */}
        <div className="space-y-6">
          
          {/* Announcements Feed */}
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-600" />
                Recent Announcements
              </h2>
            </div>

            {(!stats?.recentAnnouncements || stats.recentAnnouncements.length === 0) ? (
              <EmptyState icon={Megaphone} title="No Announcements" description="No supervisor announcements at this time." />
            ) : (
              <div className="space-y-3">
                {stats.recentAnnouncements.map(ann => (
                  <div key={ann.id} className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/40 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                        ann.priority === 'Urgent' ? 'bg-red-100 text-red-800' : ann.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {ann.priority || 'Normal'}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {ann.publish_date ? new Date(ann.publish_date).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-neutral-900">{ann.title}</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">{ann.description}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Latest Work Updates */}
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <Camera className="w-4 h-4 text-gold-600" />
                Latest Work Updates
              </h2>
              <Link to="/worker/upload-progress" className="text-xs font-bold text-gold-600 hover:text-gold-700">
                + Upload
              </Link>
            </div>

            {(!stats?.latestWorkUpdates || stats.latestWorkUpdates.length === 0) ? (
              <EmptyState icon={Camera} title="No Progress Photos" description="Work progress photos uploaded by site workers will appear here." />
            ) : (
              <div className="space-y-4">
                {stats.latestWorkUpdates.slice(0, 3).map(update => (
                  <div key={update.id} className="p-3 rounded-xl border border-neutral-200 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                      <span>{update.uploader_name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {update.created_at ? new Date(update.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2">{update.description}</p>
                    {update.file_url && (
                      <div className="h-32 rounded-lg overflow-hidden border border-neutral-100">
                        <img src={update.file_url} alt="Progress log site media" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

        </div>
      </div>

      {/* Check In Modal */}
      <Modal isOpen={isCheckInModalOpen} onClose={() => setIsCheckInModalOpen(false)} title="Daily Site Check-In">
        <form onSubmit={handleCheckIn} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-1">Select Building Site</label>
            <select
              required
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 font-medium text-sm"
            >
              <option value="">Choose an assigned building site...</option>
              {assignedProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.project_name} ({p.project_code}) - {p.city}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" /> GPS Location Verification Active
            </p>
            <p className="text-neutral-600">Checking in will record your timestamp and location on site for your contractor's attendance register.</p>
          </div>

          {checkInError && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200">{checkInError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsCheckInModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmittingCheckIn} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              {isSubmittingCheckIn ? 'Clocking In...' : 'Confirm Check-In'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Complete Task Modal */}
      <Modal isOpen={!!completedTask} onClose={() => setCompletedTask(null)} title={`Mark Task Completed: ${completedTask?.title || ''}`}>
        <form onSubmit={handleCompleteTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Completion Notes / Details</label>
            <textarea
              rows="3"
              required
              value={completionNotes}
              onChange={e => setCompletionNotes(e.target.value)}
              placeholder="Describe work completed, materials used, or observations..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Completion Photo / Video URL (Optional)</label>
            <input
              type="url"
              value={completionPhotoUrl}
              onChange={e => setCompletionPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7"
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm"
            />
            <p className="text-[11px] text-neutral-400 mt-1">Uploaded media will be visible to your contractor and the project homeowner.</p>
          </div>

          {taskError && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200">{taskError}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setCompletedTask(null)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmittingTask} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              {isSubmittingTask ? 'Submitting...' : 'Mark Completed'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const WorkerDashboard = () => (
  <ErrorBoundary>
    <WorkerDashboardContent />
  </ErrorBoundary>
);
