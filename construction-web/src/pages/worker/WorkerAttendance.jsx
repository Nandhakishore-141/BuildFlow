import { useState, useEffect, useCallback } from 'react';
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
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  Building2,
  Calendar,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  FileText,
  Send
} from 'lucide-react';
import * as workerService from '@/services/workerService';

const WorkerAttendanceContent = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAcceptingId, setIsAcceptingId] = useState(null);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Absence Reason Modal States
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedAbsenceRecord, setSelectedAbsenceRecord] = useState(null);
  const [reasonCategory, setReasonCategory] = useState('Medical Leave / Health Illness');
  const [customReasonNote, setCustomReasonNote] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);
  const [reasonError, setReasonError] = useState(null);

  const fetchAttendanceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const attRes = await workerService.getAttendance();
      setAttendanceRecords(attRes.data || []);
    } catch (err) {
      console.error("Failed to load attendance data:", err);
      setError(err.response?.data?.message || 'Failed to load attendance records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleAcceptTiming = async (attendanceId) => {
    setIsAcceptingId(attendanceId);
    try {
      await workerService.acceptAttendanceTiming(attendanceId);
      setActionSuccess('Shift timing accepted! Your attendance is now marked as Present.');
      fetchAttendanceData();
    } catch (err) {
      console.error("Failed to accept attendance timing:", err);
      setError(err.response?.data?.message || 'Failed to accept timing.');
    } finally {
      setIsAcceptingId(null);
    }
  };

  const handleOpenReasonModal = (record) => {
    setSelectedAbsenceRecord(record);
    setReasonCategory('Medical Leave / Health Illness');
    setCustomReasonNote('');
    setReasonError(null);
    setIsReasonModalOpen(true);
  };

  const handleSubmitAbsenceReason = async (e) => {
    e.preventDefault();
    if (!selectedAbsenceRecord) return;
    
    const fullReason = customReasonNote.trim() 
      ? `${reasonCategory} - ${customReasonNote.trim()}`
      : reasonCategory;

    setIsSubmittingReason(true);
    setReasonError(null);
    try {
      await workerService.submitAbsenceReason(selectedAbsenceRecord.id, fullReason);
      setActionSuccess('Absence reason submitted successfully to your contractor.');
      setIsReasonModalOpen(false);
      fetchAttendanceData();
    } catch (err) {
      console.error("Failed to submit absence reason:", err);
      setReasonError(err.response?.data?.message || 'Failed to submit reason.');
    } finally {
      setIsSubmittingReason(false);
    }
  };

  // Calculate stats
  const presentCount = attendanceRecords.filter(r => r.status === 'Present' || r.worker_acceptance === 'Accepted').length;
  const pendingReviews = attendanceRecords.filter(r => r.status === 'Awaiting' || (r.status !== 'Absent' && r.worker_acceptance === 'Pending')).length;
  const absentRecords = attendanceRecords.filter(r => r.status === 'Absent').length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Attendance & Shift Review" 
        description="Review shift timings logged by your lead contractor. Accept timings to confirm Present status, or submit valid reasons if absent."
        action={
          <Button variant="outline" size="sm" onClick={fetchAttendanceData} className="gap-2 text-xs font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh Register
          </Button>
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

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Confirmed Present" value={`${presentCount} Days`} icon={ShieldCheck} color="green" subtitle="Accepted Shifts" />
        <StatCard title="Awaiting Acceptance" value={`${pendingReviews} Shifts`} icon={Clock} color="gold" subtitle="Click Accept Timing below" />
        <StatCard title="Absences Logged" value={`${absentRecords} Days`} icon={AlertCircle} color="red" subtitle="Valid Reason Required" />
      </div>

      {/* Info Card */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3 text-blue-900 text-xs">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-sm font-bold mb-0.5">Contractor-Managed Attendance Verification</strong>
          <span>Your site attendance and shift timings are recorded by your Contractor. Your attendance will turn to <strong>Present</strong> once you review and click <strong>Accept Timing</strong>. If marked absent, please submit a valid reason.</span>
        </div>
      </div>

      {/* Shift Register Table */}
      <SectionCard title="Attendance Register & Shift Records">
        {isLoading ? (
          <TablePlaceholder columns={6} rows={6} />
        ) : error ? (
          <ErrorState title="Unable to load attendance" description={error} onRetry={fetchAttendanceData} />
        ) : attendanceRecords.length === 0 ? (
          <EmptyState 
            icon={CalendarCheck}
            title="No Attendance Records"
            description="Your contractor has not logged any shift attendance for you yet."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-semibold text-xs uppercase">
                  <th className="p-4">Shift Date</th>
                  <th className="p-4">Building Project</th>
                  <th className="p-4">Logged In Time</th>
                  <th className="p-4">Logged Out Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Confirmation / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {attendanceRecords.map((r, idx) => {
                  const clockInDate = r.clock_in ? new Date(r.clock_in) : null;
                  const inTimeStr = r.clock_in && r.status !== 'Absent' ? r.clock_in.substring(11, 16) : '—';
                  const outTimeStr = r.clock_out && r.status !== 'Absent' ? r.clock_out.substring(11, 16) : (r.status === 'Present' || r.status === 'Awaiting' ? 'On Site' : '—');
                  
                  const isConfirmedPresent = r.status === 'Present' || r.worker_acceptance === 'Accepted';
                  const isAwaiting = r.status === 'Awaiting' || (r.status !== 'Absent' && r.worker_acceptance === 'Pending');
                  const isAbsent = r.status === 'Absent';

                  return (
                    <tr key={r.id || idx} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-bold text-neutral-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-600" />
                        {clockInDate ? clockInDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="p-4 font-medium text-neutral-800">
                        {r.project_name} <span className="text-xs text-neutral-400 font-mono">({r.project_code || 'Site'})</span>
                      </td>
                      <td className="p-4 font-mono text-xs text-neutral-700">
                        {inTimeStr}
                      </td>
                      <td className="p-4 font-mono text-xs text-neutral-700">
                        {outTimeStr}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                          isConfirmedPresent ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          isAwaiting ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {isConfirmedPresent ? 'Present' : isAwaiting ? 'Awaiting Confirmation' : 'Absent'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {isConfirmedPresent ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Confirmed Present
                          </span>
                        ) : isAwaiting ? (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            disabled={isAcceptingId === r.id}
                            onClick={() => handleAcceptTiming(r.id)}
                            className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isAcceptingId === r.id ? 'Confirming...' : 'Accept Timing (Mark Present)'}
                          </Button>
                        ) : isAbsent ? (
                          r.absence_reason ? (
                            <span className="inline-block text-xs text-neutral-700 italic max-w-xs text-right">
                              Reason: "{r.absence_reason}"
                            </span>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenReasonModal(r)}
                              className="text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50 gap-1.5 shadow-2xs"
                            >
                              <FileText className="w-3.5 h-3.5 text-rose-600" />
                              Submit Absence Reason
                            </Button>
                          )
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* ABSENCE REASON MODAL */}
      <Modal
        isOpen={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        title="Submit Reason for Absence"
      >
        <form onSubmit={handleSubmitAbsenceReason} className="space-y-4">
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
            <p><strong>Project:</strong> {selectedAbsenceRecord?.project_name}</p>
            <p><strong>Date:</strong> {selectedAbsenceRecord?.clock_in ? new Date(selectedAbsenceRecord.clock_in).toLocaleDateString() : 'Today'}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Reason Category *</label>
            <select
              value={reasonCategory}
              onChange={e => setReasonCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm font-medium focus:ring-2 focus:ring-gold-500"
            >
              <option value="Medical Leave / Health Illness">Medical Leave / Health Illness</option>
              <option value="Family Emergency / Urgent Personal Matter">Family Emergency / Urgent Personal Matter</option>
              <option value="Transportation Breakdown / Travel Delay">Transportation Breakdown / Travel Delay</option>
              <option value="Weather / Natural Condition">Weather / Natural Condition</option>
              <option value="Authorized Prior Leave">Authorized Prior Leave</option>
              <option value="Other Valid Reason">Other Valid Reason</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Detailed Explanation (Optional)</label>
            <textarea
              rows="3"
              value={customReasonNote}
              onChange={e => setCustomReasonNote(e.target.value)}
              placeholder="Provide any additional details or doctor note summary for your contractor..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium"
            />
          </div>

          {reasonError && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-lg border border-rose-200">{reasonError}</p>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsReasonModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmittingReason}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmittingReason ? 'Submitting...' : 'Submit Absence Reason'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const WorkerAttendance = () => (
  <ErrorBoundary>
    <WorkerAttendanceContent />
  </ErrorBoundary>
);
