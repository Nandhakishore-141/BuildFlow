import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { 
  Briefcase, 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Mail, 
  AlertCircle,
  RefreshCw,
  Building2,
  FileText
} from 'lucide-react';
import * as contractorService from '@/services/contractorService';

const ContractorOpportunitiesContent = () => {
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities' or 'invitations'
  const [opportunities, setOpportunities] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Proposal Modal State
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    estimated_budget: '',
    estimated_duration: '6 Months',
    cover_message: ''
  });
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalError, setProposalError] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [oppRes, invRes] = await Promise.all([
        contractorService.getOpportunities({ search }),
        contractorService.getInvitations()
      ]);
      setOpportunities(oppRes.data || []);
      setInvitations(invRes.data || []);
    } catch (err) {
      console.error("Failed to load contractor opportunities:", err);
      setError(err.response?.data?.message || 'Failed to load construction opportunities.');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleOpenProposal = (project) => {
    setSelectedProject(project);
    setProposalForm({
      estimated_budget: project.budget || '',
      estimated_duration: '6 Months',
      cover_message: ''
    });
    setProposalError(null);
    setIsProposalModalOpen(true);
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setProposalError(null);
    if (!proposalForm.estimated_budget || parseFloat(proposalForm.estimated_budget) <= 0) {
      return setProposalError('Please enter a valid estimated budget.');
    }
    if (!proposalForm.cover_message.trim()) {
      return setProposalError('Please provide a brief introduction/cover message.');
    }

    setIsSubmittingProposal(true);
    try {
      await contractorService.submitProposal({
        project_id: selectedProject.id,
        estimated_budget: parseFloat(proposalForm.estimated_budget),
        estimated_duration: proposalForm.estimated_duration,
        cover_message: proposalForm.cover_message
      });
      setIsProposalModalOpen(false);
      setActionSuccessMsg(`Proposal submitted successfully for "${selectedProject.project_name}".`);
      fetchData();
    } catch (err) {
      console.error("Failed to submit proposal:", err);
      setProposalError(err.response?.data?.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleRespondInvitation = async (invitationId, status) => {
    try {
      await contractorService.respondToInvitation(invitationId, status);
      setActionSuccessMsg(`Invitation ${status} successfully!`);
      fetchData();
    } catch (err) {
      console.error("Failed to respond to invitation:", err);
      setError(err.response?.data?.message || 'Failed to respond to invitation.');
    }
  };

  const pendingInvitationsCount = invitations.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Construction Opportunities" 
        description="Browse open project requirements and respond to homeowner direct invitations."
        action={
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-xs">
            <RefreshCw className="w-4 h-4" /> Refresh Opportunities
          </Button>
        }
      />

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center justify-between">
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Opportunities & Invitations Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-px">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-xs md:text-sm border-b-2 transition-colors ${
            activeTab === 'opportunities' 
              ? 'border-gold-500 text-gold-700 bg-gold-50/50 rounded-t-lg' 
              : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold-600" />
          Public Opportunities ({opportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-xs md:text-sm border-b-2 transition-colors relative ${
            activeTab === 'invitations' 
              ? 'border-gold-500 text-gold-700 bg-gold-50/50 rounded-t-lg' 
              : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
          }`}
        >
          <Mail className="w-4 h-4 text-gold-600" />
          Direct Homeowner Invitations
          {pendingInvitationsCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-gold-500 text-white rounded-full">
              {pendingInvitationsCount} New
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PUBLIC OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <SectionCard>
          <div className="mb-6 max-w-md">
            <SearchBar 
              placeholder="Search by building name, city, or code..." 
              value={search} 
              onChange={setSearch} 
            />
          </div>

          {isLoading ? (
            <TablePlaceholder columns={4} rows={4} />
          ) : error ? (
            <ErrorState title="Failed to load opportunities" description={error} onRetry={fetchData} />
          ) : opportunities.length === 0 ? (
            <EmptyState 
              icon={Sparkles}
              title="No Public Requirements Posted"
              description="There are currently no open building requirements seeking contractor proposals."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map(opp => (
                <div key={opp.id} className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-gold-100 text-gold-800 border border-gold-200 inline-block mb-1">
                          {opp.project_type || 'Building Project'}
                        </span>
                        <h3 className="font-bold text-lg text-neutral-900">{opp.project_name}</h3>
                        <p className="text-xs text-neutral-400 font-mono">Code: {opp.project_code}</p>
                      </div>

                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                        opp.priority === 'High' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {opp.priority || 'Medium'} Priority
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {opp.description || 'No detailed requirements specified by homeowner.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-neutral-100 text-neutral-700">
                      <div>
                        <span className="text-neutral-400 uppercase text-[10px] font-bold block">Estimated Budget</span>
                        <strong className="text-neutral-900 text-sm">{formatCurrency(opp.budget)}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-400 uppercase text-[10px] font-bold block">Location</span>
                        <strong className="text-neutral-900">{opp.city || 'Karnataka'}, India</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {opp.my_proposal_status ? (
                        <span className="font-bold text-emerald-600">Proposal Submitted ({opp.my_proposal_status})</span>
                      ) : (
                        `${opp.total_proposals || 0} Proposals Submitted`
                      )}
                    </span>

                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleOpenProposal(opp)}
                      className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1 text-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Proposal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* TAB 2: DIRECT HOMEOWNER INVITATIONS */}
      {activeTab === 'invitations' && (
        <SectionCard title="Direct Homeowner Invitations">
          {isLoading ? (
            <TablePlaceholder columns={4} rows={3} />
          ) : invitations.length === 0 ? (
            <EmptyState 
              icon={Mail}
              title="No Invitations Received"
              description="You have not received any direct project invitations from homeowners yet."
            />
          ) : (
            <div className="space-y-4">
              {invitations.map(inv => (
                <div key={inv.id} className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-neutral-900">{inv.project_name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                        inv.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : inv.status === 'declined' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Invited by: <strong className="text-neutral-900">{inv.owner_name}</strong> ({inv.owner_email})
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">
                      Budget: {formatCurrency(inv.budget)} • Location: {inv.city || 'N/A'} • Sent: {new Date(inv.sent_at).toLocaleDateString()}
                    </p>
                  </div>

                  {inv.status === 'pending' ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleRespondInvitation(inv.id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept Invitation
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRespondInvitation(inv.id, 'declined')}
                        className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs font-semibold gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-neutral-400 capitalize">Invitation {inv.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* SUBMIT PROPOSAL MODAL */}
      <Modal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        title={`Submit Proposal for ${selectedProject?.project_name}`}
      >
        <form onSubmit={handleSubmitProposal} className="space-y-4">
          {proposalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {proposalError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Estimated Cost / Total Budget (INR) *</label>
            <input
              type="number"
              value={proposalForm.estimated_budget}
              onChange={e => setProposalForm(p => ({ ...p, estimated_budget: e.target.value }))}
              placeholder="e.g. 24500000"
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Estimated Duration *</label>
            <input
              type="text"
              value={proposalForm.estimated_duration}
              onChange={e => setProposalForm(p => ({ ...p, estimated_duration: e.target.value }))}
              placeholder="e.g. 8 Months"
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Cover Message & Introduction *</label>
            <textarea
              rows={4}
              value={proposalForm.cover_message}
              onChange={e => setProposalForm(p => ({ ...p, cover_message: e.target.value }))}
              placeholder="Introduce your company experience, past similar projects, and proposed execution approach..."
              className="w-full p-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsProposalModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              type="submit" 
              disabled={isSubmittingProposal}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1 text-xs"
            >
              {isSubmittingProposal ? 'Submitting Proposal...' : 'Submit Official Proposal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const ContractorOpportunities = () => (
  <ErrorBoundary>
    <ContractorOpportunitiesContent />
  </ErrorBoundary>
);
