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
import { LineChart, Camera, CheckCircle2, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import * as contractorService from '@/services/contractorService';

const ContractorProgressContent = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Approval Modal State
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [completionInput, setCompletionInput] = useState('');
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [progRes, prjRes] = await Promise.all([
        contractorService.getProgressUpdates(selectedProjectId),
        contractorService.getProjects()
      ]);
      setProgressUpdates(progRes.data || []);
      setProjects(prjRes.data || []);
    } catch (err) {
      console.error("Failed to load progress updates:", err);
      setError(err.response?.data?.message || 'Failed to fetch progress feed.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenApproveModal = (update) => {
    setSelectedUpdate(update);
    setCompletionInput(update.completion_percentage || 50);
    setIsApproveModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedUpdate) return;
    try {
      await contractorService.approveProgressUpdate(selectedUpdate.id, parseFloat(completionInput));
      setActionSuccess(`Progress update approved and project completion updated to ${completionInput}%.`);
      setIsApproveModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to approve update:", err);
      setError(err.response?.data?.message || 'Failed to approve update.');
    }
  };

  const filteredUpdates = progressUpdates.filter(pu => {
    return !search || 
      pu.uploader_name.toLowerCase().includes(search.toLowerCase()) || 
      pu.description.toLowerCase().includes(search.toLowerCase()) ||
      (pu.project_name && pu.project_name.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Site Progress Updates & Approvals" 
        description="Review chronological site progress photo/video uploads from workers and verify completion rates."
        action={
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-xs font-semibold">
            <RefreshCw className="w-4 h-4" /> Refresh Progress Feed
          </Button>
        }
      />

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      <SectionCard title="Chronological Site Progress Feed">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar 
            placeholder="Search progress logs, worker name, or building..." 
            value={search} 
            onChange={setSearch} 
            className="flex-1" 
          />
          <select 
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
          >
            <option value="">All Buildings</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.project_name}</option>)}
          </select>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={4} rows={4} />
        ) : error ? (
          <ErrorState title="Unable to load progress updates" description={error} onRetry={fetchData} />
        ) : filteredUpdates.length === 0 ? (
          <EmptyState 
            icon={LineChart}
            title="No progress logs submitted"
            description={search ? `No progress updates match "${search}".` : "No worker progress photo/video uploads found for this building."}
          />
        ) : (
          <div className="space-y-6">
            {filteredUpdates.map(pu => (
              <div key={pu.id} className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900">{pu.uploader_name}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gold-50 text-gold-800 border border-gold-200 font-semibold">
                      {pu.uploader_trade || 'Worker'}
                    </span>
                    <span className="text-xs text-neutral-400">• {pu.project_name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-neutral-400 font-mono">{new Date(pu.created_at).toLocaleString()}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
                      pu.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {pu.approval_status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed">{pu.description}</p>

                {pu.file_url && (
                  <div className="rounded-xl overflow-hidden border border-neutral-200 max-w-xl">
                    <img src={pu.file_url} alt="Progress update site photo" className="w-full h-64 object-cover" />
                  </div>
                )}

                {pu.approval_status === 'Pending' && (
                  <div className="flex justify-end pt-3 border-t border-neutral-100">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleOpenApproveModal(pu)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Update & Set Completion %
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* APPROVE PROGRESS MODAL */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Site Progress Update"
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-600">
            Verify progress update submitted by <strong>{selectedUpdate?.uploader_name}</strong> for <strong>{selectedUpdate?.project_name}</strong>.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Update Building Completion Rate (%) *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={completionInput}
              onChange={e => setCompletionInput(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              Confirm & Approve
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const ContractorProgress = () => (
  <ErrorBoundary>
    <ContractorProgressContent />
  </ErrorBoundary>
);
