import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import * as homeownerService from '@/services/homeownerService';

const PROJECT_TYPES = [
  'House', 'Villa', 'Apartment', 'Commercial', 'Office', 'Warehouse', 'Factory', 'Other'
];

const INITIAL_FORM_STATE = {
  project_name: '',
  project_type: 'House',
  description: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  postal_code: '',
  budget: '',
  planned_start_date: '',
  planned_end_date: '',
  hiringMethod: 'invite', // 'invite' or 'publish'
  selectedContractorId: null
};

export const HomeownerCreateBuildingWizard = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Contractor Search for Option 1
  const [contractorSearch, setContractorSearch] = useState('');
  const [contractors, setContractors] = useState([]);
  const [isLoadingContractors, setIsLoadingContractors] = useState(false);

  // Reset form to clean state
  const resetWizardState = useCallback(() => {
    setStep(1);
    setIsSubmitting(false);
    setError(null);
    setFormData(INITIAL_FORM_STATE);
    setContractorSearch('');
    setContractors([]);
    setIsLoadingContractors(false);
  }, []);

  // Reset automatically whenever wizard is opened
  useEffect(() => {
    if (isOpen) {
      resetWizardState();
    }
  }, [isOpen, resetWizardState]);

  useEffect(() => {
    if (isOpen && step === 4 && formData.hiringMethod === 'invite') {
      fetchContractors();
    }
  }, [isOpen, step, formData.hiringMethod, contractorSearch]);

  const fetchContractors = async () => {
    setIsLoadingContractors(true);
    try {
      const res = await homeownerService.getVerifiedContractors(contractorSearch);
      setContractors(res.data || []);
    } catch (err) {
      console.error("Failed to search contractors:", err);
    } finally {
      setIsLoadingContractors(false);
    }
  };

  const updateForm = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleClose = () => {
    resetWizardState();
    onClose();
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.project_name.trim()) {
        return setError('Please enter a building name.');
      }
    } else if (step === 2) {
      if (!formData.city.trim()) {
        return setError('Please enter the city location.');
      }
    } else if (step === 3) {
      if (!formData.budget || parseFloat(formData.budget) <= 0) {
        return setError('Estimated budget must be a positive number.');
      }
      if (formData.planned_start_date && formData.planned_end_date) {
        if (new Date(formData.planned_end_date) <= new Date(formData.planned_start_date)) {
          return setError('Completion date must be after the start date.');
        }
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setError(null);
    if (formData.hiringMethod === 'invite' && !formData.selectedContractorId) {
      return setError('Please select a verified contractor to send an invitation, or switch to "Find a Contractor".');
    }

    setIsSubmitting(true);
    try {
      await homeownerService.createBuilding(formData);
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error("Failed to create building:", err);
      setError(err.response?.data?.message || 'Failed to create building requirement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Building Requirement">
      <div className="space-y-6">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 text-xs font-bold">
          {[
            { s: 1, name: 'Basic Info' },
            { s: 2, name: 'Location' },
            { s: 3, name: 'Planning' },
            { s: 4, name: 'Acquisition' }
          ].map(st => (
            <div key={st.s} className={`flex items-center gap-1.5 ${step === st.s ? 'text-gold-600' : step > st.s ? 'text-emerald-600' : 'text-neutral-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                step === st.s ? 'border-gold-500 bg-gold-50 text-gold-700' : step > st.s ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 bg-neutral-50'
              }`}>
                {step > st.s ? <Check className="w-3.5 h-3.5" /> : st.s}
              </div>
              <span className="hidden sm:inline">{st.name}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* STEP 1: BASIC INFORMATION */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Building / Project Name *</label>
              <input
                type="text"
                placeholder="e.g. Sunset Heights Villa #4"
                value={formData.project_name}
                onChange={e => updateForm('project_name', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Project Type *</label>
              <select
                value={formData.project_type}
                onChange={e => updateForm('project_type', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              >
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Project Overview & Requirements</label>
              <textarea
                rows={3}
                placeholder="Describe key requirements, architectural details, or special requests..."
                value={formData.description}
                onChange={e => updateForm('description', e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Street Address</label>
              <input
                type="text"
                placeholder="e.g. 124 MG Road, Phase 2"
                value={formData.address}
                onChange={e => updateForm('address', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">City *</label>
                <input
                  type="text"
                  placeholder="Bengaluru"
                  value={formData.city}
                  onChange={e => updateForm('city', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">State / Region</label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  value={formData.state}
                  onChange={e => updateForm('state', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => updateForm('country', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  placeholder="560001"
                  value={formData.postal_code}
                  onChange={e => updateForm('postal_code', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROJECT PLANNING */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Estimated Budget (INR) *</label>
              <input
                type="number"
                placeholder="25000000"
                value={formData.budget}
                onChange={e => updateForm('budget', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Expected Start Date</label>
                <input
                  type="date"
                  value={formData.planned_start_date}
                  onChange={e => updateForm('planned_start_date', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Expected Completion</label>
                <input
                  type="date"
                  value={formData.planned_end_date}
                  onChange={e => updateForm('planned_end_date', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONTRACTOR ACQUISITION METHOD */}
        {step === 4 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase text-neutral-700">Select Contractor Acquisition Method *</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Direct Invitation */}
              <div
                onClick={() => updateForm('hiringMethod', 'invite')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.hiringMethod === 'invite'
                    ? 'border-gold-500 bg-gold-50/60 shadow-sm ring-2 ring-gold-400'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-5 h-5 text-gold-600" />
                  <h4 className="font-bold text-neutral-900 text-sm">Option 1: Invite My Contractor</h4>
                </div>
                <p className="text-xs text-neutral-600">"I already know who will build my project."</p>
                <span className="inline-block mt-3 px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                  Status: Waiting for Acceptance
                </span>
              </div>

              {/* Option 2: Public Posting */}
              <div
                onClick={() => updateForm('hiringMethod', 'publish')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.hiringMethod === 'publish'
                    ? 'border-gold-500 bg-gold-50/60 shadow-sm ring-2 ring-gold-400'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                  <h4 className="font-bold text-neutral-900 text-sm">Option 2: Find a Contractor</h4>
                </div>
                <p className="text-xs text-neutral-600">"I want verified contractors to submit proposals."</p>
                <span className="inline-block mt-3 px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 rounded-full">
                  Status: Looking for Contractor
                </span>
              </div>
            </div>

            {/* Contractor Selection List for Option 1 */}
            {formData.hiringMethod === 'invite' && (
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <SearchBar
                  placeholder="Search contractor by company or name..."
                  value={contractorSearch}
                  onChange={setContractorSearch}
                />

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {isLoadingContractors ? (
                    <p className="text-xs text-neutral-400 py-4 text-center">Searching verified contractors...</p>
                  ) : contractors.length === 0 ? (
                    <p className="text-xs text-neutral-400 py-4 text-center">No verified contractors match search.</p>
                  ) : (
                    contractors.map(c => (
                      <div
                        key={c.id}
                        onClick={() => updateForm('selectedContractorId', c.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          formData.selectedContractorId === c.id
                            ? 'border-gold-500 bg-gold-100/50 font-bold'
                            : 'border-neutral-200 bg-white hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {c.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-xs text-neutral-900 font-bold">
                              <span>{c.name}</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <p className="text-[11px] text-gold-700 font-semibold">{c.company_name}</p>
                            <p className="text-[10px] text-neutral-400">{c.completed_projects} Completed • {c.active_projects} Active</p>
                          </div>
                        </div>

                        {formData.selectedContractorId === c.id && (
                          <Check className="w-5 h-5 text-gold-600" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          {step > 1 ? (
            <Button variant="outline" size="sm" onClick={handleBack} className="gap-1 text-xs">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleClose} className="gap-1 text-xs">
              Cancel
            </Button>
          )}

          {step < 4 ? (
            <Button variant="primary" size="sm" onClick={handleNext} className="gap-1 text-xs font-bold">
              Next Step <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1 text-xs"
            >
              {isSubmitting ? 'Publishing Building...' : 'Create & Publish Building'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
