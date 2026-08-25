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
import { Modal } from '@/components/common/Modal';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  Building2, 
  CreditCard,
  Truck,
  FileText,
  Calendar,
  Layers,
  Wallet
} from 'lucide-react';
import * as contractorService from '@/services/contractorService';

const ContractorExpensesContent = () => {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expense Modal States (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    project_id: '',
    title: '',
    category: 'Materials',
    amount: '',
    vendor: '',
    payment_method: 'Bank Transfer',
    date: todayStr,
    receipt_url: '',
    description: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [expRes, prjRes] = await Promise.all([
        contractorService.getExpenses(selectedProjectId),
        contractorService.getProjects()
      ]);
      const expList = expRes.data || [];
      const prjList = prjRes.data || [];

      setExpenses(expList);
      setProjects(prjList);

      if (prjList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjList[0].id);
      }
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError(err.response?.data?.message || 'Failed to fetch financial expenses.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setFormData({
      project_id: selectedProjectId || (projects[0]?.id || ''),
      title: '',
      category: 'Materials',
      amount: '',
      vendor: '',
      payment_method: 'Bank Transfer',
      date: todayStr,
      receipt_url: '',
      description: '',
      notes: ''
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditingExpense(exp);
    setFormData({
      project_id: exp.project_id,
      title: exp.title || '',
      category: exp.category || 'Materials',
      amount: exp.amount || '',
      vendor: exp.vendor || '',
      payment_method: exp.payment_method || 'Bank Transfer',
      date: exp.date ? exp.date.substring(0, 10) : todayStr,
      receipt_url: exp.receipt_url || '',
      description: exp.description || '',
      notes: exp.notes || ''
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (exp) => {
    setExpenseToDelete(exp);
    setIsDeleteModalOpen(true);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!formData.project_id) {
      setModalError('Please select a building project.');
      return;
    }
    if (!formData.title.trim()) {
      setModalError('Please enter an expense title / description.');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setModalError('Please enter a valid expense amount.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      if (editingExpense) {
        await contractorService.updateExpense(editingExpense.id, formData);
        setActionSuccess(`Expense "${formData.title}" updated successfully.`);
      } else {
        await contractorService.createExpense(formData);
        setActionSuccess(`Expense "${formData.title}" logged successfully.`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save expense:", err);
      setModalError(err.response?.data?.message || 'Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await contractorService.deleteExpense(expenseToDelete.id);
      setActionSuccess(`Expense "${expenseToDelete.title}" removed successfully.`);
      setIsDeleteModalOpen(false);
      setExpenseToDelete(null);
      fetchData();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setError(err.response?.data?.message || 'Failed to delete expense.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const categories = ['All', 'Materials', 'Labor', 'Equipment', 'Permits', 'Site Utilities', 'Transport', 'Other'];

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = !search || 
      (e.title && e.title.toLowerCase().includes(search.toLowerCase())) ||
      (e.project_name && e.project_name.toLowerCase().includes(search.toLowerCase())) ||
      (e.vendor && e.vendor.toLowerCase().includes(search.toLowerCase())) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase())) ||
      (e.category && e.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const materialsSpent = expenses.filter(e => e.category === 'Materials').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const laborSpent = expenses.filter(e => e.category === 'Labor').reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financials & Site Expenses" 
        description="Log and monitor building project expenditures, track vendor payments, materials procurement, and operational costs."
        action={
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleOpenAddModal}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-2 text-xs shadow-xs px-3.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Add Expense
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

      {/* Financial Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Cumulative Spent" value={formatCurrency(totalSpent)} icon={Wallet} color="neutral" subtitle={`${expenses.length} Logged Transactions`} />
        <StatCard title="Materials Procurement" value={formatCurrency(materialsSpent)} icon={Layers} color="amber" subtitle="Raw Material Expenses" />
        <StatCard title="Labor & On-Site Operations" value={formatCurrency(laborSpent)} icon={DollarSign} color="green" subtitle="Wages & Site Work" />
      </div>

      <SectionCard
        title="Project Expense Register"
        subtitle="Detailed log of all recorded expenditures, invoices, and payment methods."
        action={
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleOpenAddModal}
            className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1.5 text-xs shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Log Expense
          </Button>
        }
      >
        {/* Filters and Search Toolbar */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <SearchBar 
              placeholder="Search expenses by title, vendor, description, or project..." 
              value={search} 
              onChange={setSearch} 
              className="flex-1 w-full max-w-md" 
            />

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase text-neutral-400 shrink-0">Building:</label>
                <select 
                  value={selectedProjectId}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  className="h-10 px-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-gold-500"
                >
                  <option value="">All Projects</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.project_name} ({p.project_code})</option>)}
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddModal}
                className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1.5 text-xs h-10 px-3.5 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Add Expense
              </Button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses Table */}
        {isLoading ? (
          <TablePlaceholder columns={6} rows={6} />
        ) : error ? (
          <ErrorState title="Unable to load expenses" description={error} onRetry={fetchData} />
        ) : filteredExpenses.length === 0 ? (
          <EmptyState 
            icon={Receipt}
            title="No expenses logged"
            description={search || selectedCategory !== 'All' ? "No expenses match your search or filter criteria." : "No expenses recorded for this building project."}
            action={
              <Button variant="primary" size="sm" onClick={handleOpenAddModal} className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5 mt-2">
                <Plus className="w-4 h-4" /> Log First Expense
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="p-4">Expense Details & Vendor</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {filteredExpenses.map(e => {
                  const expDate = e.date ? new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                  
                  return (
                    <tr key={e.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4 max-w-xs">
                        <strong className="block text-neutral-900 font-bold text-sm">{e.title}</strong>
                        {e.vendor && (
                          <span className="text-xs text-neutral-600 font-medium flex items-center gap-1 mt-0.5">
                            <Truck className="w-3.5 h-3.5 text-neutral-400" />
                            Vendor: {e.vendor}
                          </span>
                        )}
                        {e.description && (
                          <span className="block text-xs text-neutral-500 italic mt-0.5 line-clamp-1">
                            {e.description}
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-medium text-neutral-800">
                        {e.project_name}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                          e.category === 'Materials' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          e.category === 'Labor' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          e.category === 'Equipment' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-neutral-100 text-neutral-800 border-neutral-200'
                        }`}>
                          {e.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-xs text-neutral-600">
                        {expDate}
                      </td>

                      <td className="p-4 text-xs font-semibold text-neutral-700">
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                          {e.payment_method || 'Bank Transfer'}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-rose-700 text-sm">
                        {formatCurrency(e.amount)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Edit Expense"
                            onClick={() => handleOpenEditModal(e)}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Remove Expense"
                            onClick={() => handleOpenDeleteModal(e)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* CREATE / EDIT EXPENSE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? `Edit Expense: ${editingExpense.title}` : 'Log Project Expenditure'}
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Building Project *</label>
            <select
              value={formData.project_id}
              onChange={e => setFormData(p => ({ ...p, project_id: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.project_name} ({p.project_code})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Expense Title / Item *</label>
              <input
                type="text"
                required
                placeholder="e.g. Concrete Pump Rental Fee"
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Expense Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              >
                <option value="Materials">Materials & Supplies</option>
                <option value="Labor">Labor & Wages</option>
                <option value="Equipment">Equipment & Machinery Rental</option>
                <option value="Permits">Permits & Approvals</option>
                <option value="Site Utilities">Site Utilities & Fuel</option>
                <option value="Transport">Transport & Logistics</option>
                <option value="Other">Other Operational</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="45000"
                value={formData.amount}
                onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Expense Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Vendor / Payee</label>
              <input
                type="text"
                placeholder="e.g. Apex Heavy Machinery Works"
                value={formData.vendor}
                onChange={e => setFormData(p => ({ ...p, vendor: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Payment Method</label>
              <select
                value={formData.payment_method}
                onChange={e => setFormData(p => ({ ...p, payment_method: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              >
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                <option value="UPI / Digital">UPI / Digital Payment</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
                <option value="Corporate Card">Corporate Card</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Description / Notes</label>
            <textarea
              rows={2}
              placeholder="Provide context, invoice reference, or site delivery location..."
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              className="w-full p-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {modalError && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-lg border border-rose-200">{modalError}</p>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              size="sm" 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              {isSubmitting ? 'Saving...' : editingExpense ? 'Update Expense' : 'Save Expense'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Expense Removal"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            Are you sure you want to delete <strong className="text-neutral-900">{expenseToDelete?.title}</strong> ({formatCurrency(expenseToDelete?.amount)})?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
            ⚠️ This will remove this expenditure from the project financial balance sheet.
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              size="sm" 
              disabled={isDeleting}
              onClick={handleDeleteExpense}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? 'Deleting...' : 'Delete Expense'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* FLOATING ACTION PLUS BUTTON */}
      <button
        type="button"
        onClick={handleOpenAddModal}
        title="Log New Expense"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-600 active:scale-95 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 z-30 focus:outline-none focus:ring-4 focus:ring-gold-500/30"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};

export const ContractorExpenses = () => (
  <ErrorBoundary>
    <ContractorExpensesContent />
  </ErrorBoundary>
);
