import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/common/Button';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  Users, 
  Flag, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  Paperclip,
  Building2,
  FileText,
  Briefcase,
  Layers,
  Save,
  AlertTriangle
} from 'lucide-react';

const PRIORITY_OPTIONS = [
  { id: 'Low', label: 'Low Priority', icon: '🟢', color: 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100' },
  { id: 'Medium', label: 'Medium Priority', icon: '🟡', color: 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100' },
  { id: 'High', label: 'High Priority', icon: '🟠', color: 'border-orange-300 bg-orange-50 text-orange-900 hover:bg-orange-100' },
  { id: 'Critical', label: 'Critical / Urgent', icon: '🔴', color: 'border-rose-300 bg-rose-50 text-rose-900 hover:bg-rose-100' }
];

export const TaskCreationDrawer = ({
  isOpen,
  onClose,
  project,
  eligibleWorkers = [],
  milestones = [],
  editingTask = null,
  onSaveTask,
  isSaving = false
}) => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
    estimated_duration: '1 Day',
    assigned_worker_ids: [],
    milestone_id: '',
    attachments: ''
  });

  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setTaskForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'Medium',
        due_date: editingTask.due_date ? editingTask.due_date.substring(0, 10) : '',
        estimated_duration: editingTask.estimated_duration || '1 Day',
        assigned_worker_ids: editingTask.assigned_workers ? editingTask.assigned_workers.map(w => w.id) : [],
        milestone_id: editingTask.milestone_id || '',
        attachments: editingTask.attachments || ''
      });
    } else {
      setTaskForm({
        title: '',
        description: '',
        priority: 'Medium',
        due_date: '',
        estimated_duration: '1 Day',
        assigned_worker_ids: eligibleWorkers.length > 0 ? [eligibleWorkers[0].worker_id || eligibleWorkers[0].id] : [],
        milestone_id: '',
        attachments: ''
      });
    }
    setIsDirty(false);
    setShowDiscardConfirm(false);
    setFormError(null);
    setToastMessage(null);
  }, [editingTask, eligibleWorkers, isOpen]);

  const updateFormField = (field, value) => {
    setTaskForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  // Handle ESC Key navigation protection
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleAttemptClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleAttemptClose]);

  if (!isOpen) return null;

  const toggleWorkerSelection = (workerId) => {
    setTaskForm(prev => {
      const exists = prev.assigned_worker_ids.includes(workerId);
      const newIds = exists
        ? prev.assigned_worker_ids.filter(id => id !== workerId)
        : [...prev.assigned_worker_ids, workerId];
      return { ...prev, assigned_worker_ids: newIds };
    });
    setIsDirty(true);
  };

  const executeSave = async (isDraft = false, closeAfterSave = false) => {
    if (!taskForm.title.trim()) {
      setFormError('Please enter a task title.');
      setShowDiscardConfirm(false);
      return;
    }
    if (taskForm.assigned_worker_ids.length === 0) {
      setFormError('Please select at least one eligible project worker.');
      setShowDiscardConfirm(false);
      return;
    }

    setFormError(null);
    setIsDirty(false);
    setShowDiscardConfirm(false);

    try {
      await onSaveTask({
        ...taskForm,
        isDraft
      });

      setToastMessage('✓ Task saved successfully.');

      if (closeAfterSave) {
        setTimeout(() => {
          onClose();
        }, 300);
      }
    } catch (err) {
      setFormError(err.message || 'Failed to save task.');
    }
  };

  const selectedWorkers = eligibleWorkers.filter(w => 
    taskForm.assigned_worker_ids.includes(w.worker_id || w.id)
  );

  const selectedMilestone = milestones.find(m => m.id === taskForm.milestone_id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/60 backdrop-blur-xs flex justify-end transition-opacity">
      
      {/* SUCCESS TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          {toastMessage}
        </div>
      )}

      {/* UNSAVED CHANGES PROTECTION CONFIRMATION DIALOG */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-neutral-900">Discard Changes?</h3>
                <p className="text-xs text-neutral-500 font-medium">You have unsaved task modifications.</p>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100">
              You have unsaved changes. What would you like to do before closing?
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="primary"
                onClick={() => executeSave(true, true)}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-extrabold text-xs justify-center py-2.5"
              >
                <Save className="w-4 h-4 mr-1.5" /> Save & Close
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="w-full text-xs font-bold justify-center"
                >
                  Continue Editing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDirty(false);
                    setShowDiscardConfirm(false);
                    onClose();
                  }}
                  className="w-full text-xs font-bold border-rose-300 text-rose-700 hover:bg-rose-50 justify-center"
                >
                  Discard Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full md:w-[80vw] max-w-6xl h-full bg-neutral-50 flex flex-col shadow-2xl border-l border-neutral-200 animate-in slide-in-from-right duration-300 relative">
        
        {/* STICKY DRAWER HEADER WITH PROMINENT SAVE & CLOSE BUTTON */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800 shrink-0 sticky top-0 z-30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-gold-500/20 text-gold-400 border border-gold-500/30 text-[11px] font-extrabold uppercase tracking-wider">
                Procore Task Studio
              </span>
              {project && (
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  Building: <strong className="text-white">{project.project_name}</strong> ({project.project_code})
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1 text-white">
              {editingTask ? `Edit Task: ${editingTask.title}` : 'Create & Assign Site Task'}
            </h2>
          </div>

          {/* TOP RIGHT HEADER ACTIONS: SAVE & CLOSE BUTTON + CLOSE ICON */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => executeSave(true, true)}
              disabled={isSaving}
              className="bg-gold-500 hover:bg-gold-600 text-white font-extrabold text-xs px-4 py-2 gap-1.5 shadow-md shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save & Close</span>
            </Button>

            <button
              onClick={handleAttemptClose}
              title="Close Task Drawer"
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* DRAWER BODY (TWO-COLUMN RESPONSIVE WORKSPACE) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
          
          {/* LEFT 2 COLS: MAIN TASK FORM */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SECTION 1: TASK DETAILS */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <FileText className="w-4 h-4 text-gold-600" />
                <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Section 1 — Task Details</h3>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-neutral-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={e => updateFormField('title', e.target.value)}
                  placeholder="e.g., Concrete Pouring for First Floor Column B"
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-neutral-700 mb-1">
                  Task Scope & Detailed Instructions
                </label>
                <textarea
                  rows="4"
                  value={taskForm.description}
                  onChange={e => updateFormField('description', e.target.value)}
                  placeholder="Specify construction specifications, safety rules, material grades, or execution guidelines..."
                  className="w-full p-4 rounded-xl border border-neutral-300 text-sm font-medium text-neutral-800 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {/* SECTION 2: WORKER SELECTION (CARD GRID) */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold-600" />
                  <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Section 2 — Assign Workers</h3>
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {taskForm.assigned_worker_ids.length} Selected
                </span>
              </div>

              <p className="text-xs text-neutral-500 font-medium">
                Click worker cards to select one or multiple assigned tradespeople. Only accepted project members are listed.
              </p>

              {eligibleWorkers.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
                  ⚠️ No accepted workers on this project team yet. Please invite workers and await their acceptance before assigning tasks.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eligibleWorkers.map(w => {
                    const wId = w.worker_id || w.id;
                    const isSelected = taskForm.assigned_worker_ids.includes(wId);
                    return (
                      <div
                        key={wId}
                        onClick={() => toggleWorkerSelection(wId)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-gold-500 bg-gold-50/60 ring-2 ring-gold-500/20 shadow-xs' 
                            : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={w.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                            alt={w.worker_name || w.name}
                            className="w-11 h-11 rounded-full object-cover border border-neutral-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-neutral-900 text-xs truncate">{w.worker_name || w.name}</h4>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold-100 text-gold-800 border border-gold-200 block w-max mt-0.5">
                              {w.trade || 'Worker'}
                            </span>
                            <span className="text-[11px] text-neutral-500 block mt-0.5 font-mono">
                              Today: <strong className={w.attendance_today === 'Present' ? 'text-emerald-600' : 'text-neutral-400'}>{w.attendance_today || 'Active'}</strong>
                            </span>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-gold-500 border-gold-600 text-white' : 'border-neutral-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 3: SCHEDULE */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Calendar className="w-4 h-4 text-gold-600" />
                <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Section 3 — Schedule & Time Estimation</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-neutral-700 mb-1">
                    Target Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={taskForm.due_date}
                    onChange={e => updateFormField('due_date', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-neutral-700 mb-1">
                    Estimated Execution Duration
                  </label>
                  <input
                    type="text"
                    value={taskForm.estimated_duration}
                    onChange={e => updateFormField('estimated_duration', e.target.value)}
                    placeholder="e.g. 2 Days / 6 Hours"
                    className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: PRIORITY BUTTONS */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <AlertCircle className="w-4 h-4 text-gold-600" />
                <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Section 4 — Task Priority Level</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRIORITY_OPTIONS.map(p => {
                  const isSelected = taskForm.priority === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => updateFormField('priority', p.id)}
                      className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all ${p.color} ${
                        isSelected ? 'ring-2 ring-neutral-900 shadow-md font-extrabold scale-[1.02]' : 'opacity-80'
                      }`}
                    >
                      <span className="text-base">{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 5: MILESTONE CARDS */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gold-600" />
                  <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Section 5 — Link Project Milestone</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* No Milestone Card */}
                <div
                  onClick={() => updateFormField('milestone_id', '')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-1 ${
                    taskForm.milestone_id === ''
                      ? 'border-gold-500 bg-gold-50/60 ring-2 ring-gold-500/20 font-bold'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <strong className="block text-neutral-900">No Milestone</strong>
                  <span className="text-[11px] text-neutral-400 block">General task assignment</span>
                </div>

                {milestones.map(m => (
                  <div
                    key={m.id}
                    onClick={() => updateFormField('milestone_id', m.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-1 ${
                      taskForm.milestone_id === m.id
                        ? 'border-gold-500 bg-gold-50/60 ring-2 ring-gold-500/20 font-bold'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <strong className="block text-neutral-900 truncate">{m.name}</strong>
                    <span className="text-[11px] text-neutral-500 block">Due: {m.due_date ? new Date(m.due_date).toLocaleDateString() : 'TBD'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: ATTACHMENTS */}
            <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Paperclip className="w-4 h-4 text-gold-600" />
                <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Section 6 — Attachments & Reference Files</h3>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-neutral-700 mb-1">
                  Attachment Blueprint / Reference Image URL
                </label>
                <input
                  type="url"
                  value={taskForm.attachments}
                  onChange={e => updateFormField('attachments', e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7"
                  className="w-full h-10 px-3 rounded-xl border border-neutral-300 text-xs font-medium text-neutral-900 focus:ring-2 focus:ring-gold-500"
                />
              </div>

              {taskForm.attachments && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold text-neutral-500 block mb-1">Preview Attachment Media:</span>
                  <img src={taskForm.attachments} alt="Attachment Preview" className="w-full h-36 object-cover rounded-lg border" />
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COL: LIVE SUMMARY SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-20 bg-gradient-to-b from-neutral-900 to-neutral-800 text-white p-5 rounded-2xl shadow-lg border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gold-400" />
                  <h4 className="font-extrabold text-sm tracking-wide text-white">Live Task Summary</h4>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-gold-500 text-white">
                  Real-Time
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Building Project</span>
                  <strong className="text-white text-sm block">{project?.project_name || 'Selected Project'}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">Assigned Workers ({selectedWorkers.length})</span>
                  {selectedWorkers.length === 0 ? (
                    <span className="text-neutral-500 italic">No workers selected</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedWorkers.map(w => (
                        <span key={w.worker_id || w.id} className="px-2 py-1 bg-neutral-800 text-gold-300 rounded-md font-bold text-[11px] border border-neutral-700">
                          {w.worker_name || w.name} ({w.trade || 'Worker'})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-700">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Priority</span>
                    <strong className="text-gold-400">{taskForm.priority}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Target Due Date</span>
                    <strong className="text-white">{taskForm.due_date || 'Not Set'}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-700">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Linked Milestone</span>
                    <strong className="text-white">{selectedMilestone ? selectedMilestone.name : 'None'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Est. Duration</span>
                    <strong className="text-white">{taskForm.estimated_duration}</strong>
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-red-400 font-bold bg-red-950/60 p-3 rounded-xl border border-red-800">
                  ⚠️ {formError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ALWAYS VISIBLE STICKY FOOTER */}
        <div className="sticky bottom-0 left-0 right-0 z-40 px-6 py-4 bg-white border-t border-neutral-200 flex items-center justify-between shadow-2xl">
          <span className="text-xs text-neutral-500 font-medium hidden sm:block">
            {isDirty ? '⚠️ Unsaved changes in progress' : 'Assigning will notify selected workers immediately.'}
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="outline"
              type="button"
              onClick={handleAttemptClose}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => executeSave(true, false)}
              disabled={isSaving}
              className="text-xs font-bold border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={() => executeSave(false, true)}
              disabled={isSaving}
              className="bg-gold-500 hover:bg-gold-600 text-white font-extrabold text-xs px-6 py-2.5 shadow-md gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSaving ? 'Assigning Task...' : 'Assign Task'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
