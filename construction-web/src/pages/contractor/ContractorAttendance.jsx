import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { 
  CalendarCheck, 
  Users, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  FileText,
  Building2,
  Save
} from 'lucide-react';
import * as contractorService from '@/services/contractorService';

const ContractorAttendanceContent = () => {
  const [attendance, setAttendance] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('muster'); // 'muster' or 'history'
  
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayDateStr);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Muster Sheet Row States: { [workerId]: { status: 'Present'|'Half Day'|'Absent', inTime: '09:00', outTime: '17:30', isSaving: false } }
  const [musterRows, setMusterRows] = useState({});
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [attRes, wrkRes, prjRes] = await Promise.all([
        contractorService.getAttendance(selectedDate, selectedProjectId),
        contractorService.getContractorWorkers(),
        contractorService.getProjects()
      ]);
      const attList = attRes.data || [];
      const wrkList = wrkRes.data || [];
      const prjList = prjRes.data || [];

      setAttendance(attList);
      setWorkers(wrkList);
      setProjects(prjList);

      const targetProjId = selectedProjectId || (prjList.length > 0 ? prjList[0].id : '');
      if (!selectedProjectId && targetProjId) {
        setSelectedProjectId(targetProjId);
      }

      // Initialize muster row state for all workers based on existing attendance logs for this date
      const initialMuster = {};
      wrkList.forEach(w => {
        const existingAtt = attList.find(a => a.worker_id === w.id);
        if (existingAtt) {
          const inTime = existingAtt.clock_in ? existingAtt.clock_in.substring(11, 16) : '09:00';
          const outTime = existingAtt.clock_out ? existingAtt.clock_out.substring(11, 16) : '17:30';
          initialMuster[w.id] = {
            status: existingAtt.status === 'Absent' ? 'Absent' : (existingAtt.status === 'Half Day' ? 'Half Day' : 'Present'),
            inTime: inTime || '09:00',
            outTime: outTime || '17:30',
            savedRecord: existingAtt,
            isSaving: false
          };
        } else {
          initialMuster[w.id] = {
            status: 'Present',
            inTime: '09:00',
            outTime: '17:30',
            savedRecord: null,
            isSaving: false
          };
        }
      });
      setMusterRows(initialMuster);

    } catch (err) {
      console.error("Failed to load attendance:", err);
      setError(err.response?.data?.message || 'Failed to fetch attendance logs.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowChange = (workerId, field, value) => {
    setMusterRows(prev => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [field]: value
      }
    }));
  };

  const handleSaveWorkerAttendance = async (workerId) => {
    const row = musterRows[workerId];
    if (!row || !selectedProjectId) return;

    setMusterRows(prev => ({ ...prev, [workerId]: { ...prev[workerId], isSaving: true } }));
    try {
      const clockInISO = row.status === 'Absent' ? `${selectedDate}T00:00:00` : `${selectedDate}T${row.inTime || '09:00'}:00`;
      const clockOutISO = (row.status === 'Absent' || !row.outTime) ? null : `${selectedDate}T${row.outTime}:00`;

      await contractorService.markAttendance({
        project_id: selectedProjectId,
        worker_id: workerId,
        status: row.status,
        clock_in: clockInISO,
        clock_out: clockOutISO
      });

      const workerObj = workers.find(w => w.id === workerId);
      setActionSuccess(`Attendance & timings logged for ${workerObj?.name || 'Worker'} (Status: ${row.status === 'Absent' ? 'Absent' : 'Awaiting Worker Acceptance'}).`);
      fetchData();
    } catch (err) {
      console.error("Failed to save worker attendance:", err);
      setError(err.response?.data?.message || 'Failed to save attendance log.');
    } finally {
      setMusterRows(prev => ({ ...prev, [workerId]: { ...prev[workerId], isSaving: false } }));
    }
  };

  const handleSaveAllWorkers = async () => {
    if (!selectedProjectId) return;
    setIsLoading(true);
    try {
      const savePromises = workers.map(w => {
        const row = musterRows[w.id] || { status: 'Present', inTime: '09:00', outTime: '17:30' };
        const clockInISO = row.status === 'Absent' ? `${selectedDate}T00:00:00` : `${selectedDate}T${row.inTime || '09:00'}:00`;
        const clockOutISO = (row.status === 'Absent' || !row.outTime) ? null : `${selectedDate}T${row.outTime}:00`;
        return contractorService.markAttendance({
          project_id: selectedProjectId,
          worker_id: w.id,
          status: row.status,
          clock_in: clockInISO,
          clock_out: clockOutISO
        });
      });
      await Promise.all(savePromises);
      setActionSuccess(`Daily muster roll attendance saved for all ${workers.length} workers.`);
      fetchData();
    } catch (err) {
      console.error("Failed to save all attendance:", err);
      setError(err.response?.data?.message || 'Failed to save all attendance records.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWorkers = workers.filter(w => {
    return !search || 
      w.name.toLowerCase().includes(search.toLowerCase()) || 
      (w.trade && w.trade.toLowerCase().includes(search.toLowerCase())) ||
      w.email.toLowerCase().includes(search.toLowerCase());
  });

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const awaitingCount = attendance.filter(a => a.status === 'Awaiting' || (a.status !== 'Absent' && a.worker_acceptance === 'Pending')).length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Muster Roll & Attendance Sheet" 
        description="Select shift timings and mark daily attendance for site workers. Workers confirm their shift hours to turn attendance Present."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-xs font-semibold">
              <RefreshCw className="w-4 h-4" /> Refresh Sheet
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Confirmed Present" value={presentCount} icon={ShieldCheck} color="green" subtitle="Accepted by Workers" />
        <StatCard title="Awaiting Acceptance" value={awaitingCount} icon={Clock} color="gold" subtitle="Logged Hours Pending Review" />
        <StatCard title="Marked Absent" value={absentCount} icon={AlertCircle} color="red" subtitle="Requires Worker Reason" />
      </div>

      {/* Sheet Selection Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Building Project</label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-gold-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.project_name} ({p.project_code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Muster Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border border-neutral-200 rounded-xl p-1 bg-neutral-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('muster')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'muster' ? 'bg-white shadow-2xs text-gold-700 font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Daily Muster Sheet ({workers.length} Workers)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'history' ? 'bg-white shadow-2xs text-gold-700 font-bold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Attendance Register ({attendance.length} Logs)
          </button>
        </div>
      </div>

      {activeTab === 'muster' ? (
        <SectionCard 
          title="Daily Muster Roll Sheet" 
          subtitle="Set shift timings and attendance for each site worker. Click Save Row or Save All to publish timings."
          action={
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSaveAllWorkers}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5 shadow-2xs"
            >
              <Save className="w-4 h-4" /> Save All Workers
            </Button>
          }
        >
          <div className="mb-4">
            <SearchBar 
              placeholder="Filter workers by name, trade or email..." 
              value={search} 
              onChange={setSearch} 
              className="max-w-md" 
            />
          </div>

          {isLoading ? (
            <TablePlaceholder columns={5} rows={6} />
          ) : error ? (
            <ErrorState title="Unable to load muster roll" description={error} onRetry={fetchData} />
          ) : filteredWorkers.length === 0 ? (
            <EmptyState 
              icon={Users}
              title="No Site Workers Found"
              description="No workers match the filter or are registered in the system."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 text-neutral-600 font-semibold text-xs uppercase">
                    <th className="p-4">Worker & Trade</th>
                    <th className="p-4">Attendance Status</th>
                    <th className="p-4">Shift Timings (In ➔ Out)</th>
                    <th className="p-4">Live Confirmation Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {filteredWorkers.map(w => {
                    const row = musterRows[w.id] || { status: 'Present', inTime: '09:00', outTime: '17:30' };
                    const savedRecord = row.savedRecord;
                    const isAbsent = row.status === 'Absent';

                    return (
                      <tr key={w.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={w.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} 
                              alt={w.name} 
                              className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" 
                            />
                            <div>
                              <strong className="block text-neutral-900 font-bold text-sm">{w.name}</strong>
                              <span className="text-xs text-gold-700 font-semibold">{w.trade || 'General Worker'}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
                            <button
                              type="button"
                              onClick={() => handleRowChange(w.id, 'status', 'Present')}
                              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                                row.status === 'Present' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRowChange(w.id, 'status', 'Half Day')}
                              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                                row.status === 'Half Day' ? 'bg-amber-600 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              Half Day
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRowChange(w.id, 'status', 'Absent')}
                              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                                row.status === 'Absent' ? 'bg-rose-600 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>

                        <td className="p-4">
                          {isAbsent ? (
                            <span className="text-xs text-rose-700 font-semibold italic bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                              Marked Absent (Worker will submit valid reason)
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={row.inTime}
                                onChange={e => handleRowChange(w.id, 'inTime', e.target.value)}
                                className="h-9 px-2 text-xs font-mono font-bold rounded-lg border border-neutral-300 bg-white focus:ring-2 focus:ring-gold-500"
                              />
                              <span className="text-neutral-400 font-bold">➔</span>
                              <input
                                type="time"
                                value={row.outTime}
                                onChange={e => handleRowChange(w.id, 'outTime', e.target.value)}
                                className="h-9 px-2 text-xs font-mono font-bold rounded-lg border border-neutral-300 bg-white focus:ring-2 focus:ring-gold-500"
                              />
                            </div>
                          )}
                        </td>

                        <td className="p-4">
                          {savedRecord ? (
                            savedRecord.status === 'Present' || savedRecord.worker_acceptance === 'Accepted' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Present (Worker Accepted)
                              </span>
                            ) : savedRecord.status === 'Absent' ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                  Absent
                                </span>
                                {savedRecord.absence_reason ? (
                                  <span className="block text-xs text-neutral-700 italic font-medium">
                                    Reason: "{savedRecord.absence_reason}"
                                  </span>
                                ) : (
                                  <span className="block text-[11px] text-amber-700 font-medium">
                                    ⏳ Reason not yet submitted
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                Awaiting Worker Acceptance
                              </span>
                            )
                          ) : (
                            <span className="text-xs text-neutral-400 italic">Not logged for today yet</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={row.isSaving}
                            onClick={() => handleSaveWorkerAttendance(w.id)}
                            className="text-xs font-bold hover:bg-neutral-100 gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            {row.isSaving ? 'Saving...' : 'Save Row'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      ) : (
        /* HISTORY REGISTER TAB */
        <SectionCard title="Attendance Register & Audit History">
          <div className="mb-4">
            <SearchBar 
              placeholder="Search by worker name, trade or project..." 
              value={search} 
              onChange={setSearch} 
              className="max-w-md" 
            />
          </div>

          {filteredWorkers.length === 0 ? (
            <EmptyState 
              icon={CalendarCheck}
              title="No Attendance Logs"
              description="No attendance records match the selected criteria."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 text-neutral-600 font-semibold text-xs uppercase">
                    <th className="p-4">Worker</th>
                    <th className="p-4">Building Project</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Logged Timings</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Confirmation / Absence Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {attendance.map(a => {
                    const shiftDate = a.clock_in ? new Date(a.clock_in).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                    const inTime = a.clock_in ? a.clock_in.substring(11, 16) : '—';
                    const outTime = a.clock_out ? a.clock_out.substring(11, 16) : (a.status === 'Present' ? 'On Site' : '—');

                    return (
                      <tr key={a.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="p-4 font-bold text-neutral-900">
                          {a.worker_name}
                          <span className="block text-xs font-semibold text-gold-700">{a.trade || 'Worker'}</span>
                        </td>
                        <td className="p-4 text-neutral-800 font-medium">{a.project_name}</td>
                        <td className="p-4 text-neutral-700 text-xs font-medium">{shiftDate}</td>
                        <td className="p-4 font-mono text-xs">
                          {a.status === 'Absent' ? '—' : `${inTime} ➔ ${outTime}`}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                            a.status === 'Present' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            a.status === 'Awaiting' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            a.status === 'Half Day' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {a.status === 'Present' || a.worker_acceptance === 'Accepted' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Accepted by Worker
                            </span>
                          ) : a.status === 'Absent' ? (
                            <span className="text-xs text-neutral-700">
                              {a.absence_reason ? `Reason: "${a.absence_reason}"` : '⚠️ Awaiting worker reason'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                              Awaiting Worker Acceptance
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
};

export const ContractorAttendance = () => (
  <ErrorBoundary>
    <ContractorAttendanceContent />
  </ErrorBoundary>
);
