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
import { Users, Send, ShieldCheck, RefreshCw, Briefcase, Plus, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import * as contractorService from '@/services/contractorService';

const ContractorWorkersContent = () => {
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [workerFilter, setWorkerFilter] = useState('all'); // 'all', 'available', 'assigned'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Invite Modal States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [workersRes, projectsRes] = await Promise.all([
        contractorService.getContractorWorkers(search),
        contractorService.getProjects()
      ]);
      setWorkers(workersRes.data || []);
      const projList = projectsRes.data || [];
      setProjects(projList);
      if (projList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projList[0].id);
      }
    } catch (err) {
      console.error("Failed to load contractor workers:", err);
      setError(err.response?.data?.message || 'Failed to fetch site workers.');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch available workers whenever selected project changes or modal opens
  const fetchAvailableWorkers = useCallback(async (projId) => {
    if (!projId) return;
    setIsLoadingAvailable(true);
    try {
      const res = await contractorService.getAvailableWorkersForProject(projId);
      setAvailableWorkers(res.data || []);
    } catch (err) {
      console.error("Failed to load available workers:", err);
    } finally {
      setIsLoadingAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (isInviteModalOpen && selectedProjectId) {
      fetchAvailableWorkers(selectedProjectId);
    }
  }, [isInviteModalOpen, selectedProjectId, fetchAvailableWorkers]);

  const handleOpenInviteModal = (worker = null) => {
    setSelectedWorker(worker);
    setModalError(null);
    setInvitationMessage('');
    setIsInviteModalOpen(true);
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    const targetWorkerId = selectedWorker?.id || (availableWorkers.length > 0 ? availableWorkers[0].id : null);
    if (!targetWorkerId || !selectedProjectId) {
      setModalError('Please select a building project and an eligible worker.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      await contractorService.inviteWorkerToProject(selectedProjectId, targetWorkerId, invitationMessage);
      const workerName = selectedWorker?.name || availableWorkers.find(w => w.id === targetWorkerId)?.name || 'Worker';
      setActionSuccess(`Project invitation sent to ${workerName}. Status: Pending Worker Approval.`);
      setIsInviteModalOpen(false);
      setSelectedWorker(null);

      // Immediately update local available list
      setAvailableWorkers(prev => prev.filter(w => w.id !== targetWorkerId));
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to send invitation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWorkers = workers.filter(w => {
    if (workerFilter === 'available') {
      return !w.current_project_name;
    }
    if (workerFilter === 'assigned') {
      return !!w.current_project_name;
    }
    return true;
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const isSelectedWorkerAlreadyAssigned = selectedWorker && (
    selectedWorker.assigned_project_ids?.includes(selectedProjectId) ||
    selectedWorker.current_project_id === selectedProjectId
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Worker & Team Management" 
        description="View site trades, send project invitations, track attendance, and manage project team rosters."
        action={
          <div className="flex gap-3">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => handleOpenInviteModal(null)}
              className="gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs shadow-xs"
            >
              <Send className="w-4 h-4" /> Send Project Invitation
            </Button>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-xs font-semibold">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        }
      />

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionSuccess}
          </span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <SearchBar 
            placeholder="Search workers by name, trade skill or email..." 
            value={search} 
            onChange={setSearch} 
            className="flex-1 w-full max-w-md" 
          />

          <div className="flex items-center gap-2 border border-neutral-200 rounded-xl p-1 bg-neutral-50/70 text-xs font-semibold self-stretch sm:self-auto">
            <button
              onClick={() => setWorkerFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                workerFilter === 'all' ? 'bg-white shadow-2xs text-gold-700 font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Workers ({workers.length})
            </button>
            <button
              onClick={() => setWorkerFilter('available')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                workerFilter === 'available' ? 'bg-white shadow-2xs text-gold-700 font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Available / Unassigned ({workers.filter(w => !w.current_project_name).length})
            </button>
            <button
              onClick={() => setWorkerFilter('assigned')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                workerFilter === 'assigned' ? 'bg-white shadow-2xs text-gold-700 font-bold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Assigned ({workers.filter(w => !!w.current_project_name).length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={6} />
        ) : error ? (
          <ErrorState title="Unable to load site workers" description={error} onRetry={fetchData} />
        ) : filteredWorkers.length === 0 ? (
          <EmptyState 
            icon={Users}
            title="No workers found"
            description={search ? `No workers match "${search}".` : "No workers match the selected filter."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map(w => (
              <div key={w.id} className="p-4 rounded-xl border border-neutral-200 bg-white hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={w.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={w.name} className="w-12 h-12 rounded-full object-cover border border-neutral-200 shrink-0" />
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{w.name}</h4>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gold-50 text-gold-800 border border-gold-200">
                        {w.trade || 'General Worker'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-neutral-600 pt-2 border-t border-neutral-100">
                    <p><strong>Email:</strong> {w.email}</p>
                    <p><strong>Phone:</strong> {w.phone || 'N/A'}</p>
                    <p>
                      <strong>Active Assignment:</strong>{' '}
                      {w.current_project_name ? (
                        <span className="text-emerald-700 font-bold">✓ {w.current_project_name}</span>
                      ) : (
                        <span className="text-amber-700 font-semibold">Available for assignment</span>
                      )}
                    </p>
                    <p><strong>Attendance Today:</strong> <span className={w.attendance_today === 'Present' ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>{w.attendance_today}</span></p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleOpenInviteModal(w)}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5 justify-center"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Project Invitation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* INVITE WORKER MODAL */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={selectedWorker ? `Invite ${selectedWorker.name} to Project` : 'Send Project Invitation to Worker'}
      >
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Select Building Project *</label>
            <select
              value={selectedProjectId}
              onChange={e => {
                const pId = e.target.value;
                setSelectedProjectId(pId);
                fetchAvailableWorkers(pId);
              }}
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.project_name} ({p.project_code}) - {p.city}</option>
              ))}
            </select>
          </div>

          {!selectedWorker ? (
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Select Worker to Invite *</label>
              {isLoadingAvailable ? (
                <p className="text-xs text-neutral-500 animate-pulse p-2">Filtering eligible workers...</p>
              ) : availableWorkers.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium">
                  ⚠️ All registered workers are already assigned to this project or have a pending invitation.
                </div>
              ) : (
                <select
                  onChange={e => {
                    const w = availableWorkers.find(item => item.id === e.target.value);
                    setSelectedWorker(w || null);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
                >
                  <option value="">Choose an eligible worker (already assigned members are excluded)...</option>
                  {availableWorkers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.trade || 'Worker'}) - {w.email}</option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-neutral-900 block font-bold text-sm">{selectedWorker.name}</strong>
                  <span className="text-neutral-500">{selectedWorker.trade || 'Worker'} • {selectedWorker.email}</span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedWorker(null)} className="text-[11px]">
                  Change Worker
                </Button>
              </div>

              {isSelectedWorkerAlreadyAssigned && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{selectedWorker.name} is already an active assigned member of {selectedProject?.project_name || 'this project'}.</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Invitation Note / Message (Optional)</label>
            <textarea
              rows="3"
              value={invitationMessage}
              onChange={e => setInvitationMessage(e.target.value)}
              placeholder="Add site instructions, daily wage details, or project scope..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            Invitation workflow: The worker will receive a notification and can Accept or Reject this invitation before joining the project roster.
          </div>

          {modalError && (
            <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-200">{modalError}</p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" type="button" size="sm" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting || isSelectedWorkerAlreadyAssigned || (!selectedWorker && availableWorkers.length === 0)}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Sending Invitation...' : 'Send Project Invitation'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const ContractorWorkers = () => (
  <ErrorBoundary>
    <ContractorWorkersContent />
  </ErrorBoundary>
);
