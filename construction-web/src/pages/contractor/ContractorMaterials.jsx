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
  Package, 
  Plus, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  FileText, 
  DollarSign, 
  Building2,
  Boxes,
  Truck
} from 'lucide-react';
import * as contractorService from '@/services/contractorService';

const ContractorMaterialsContent = () => {
  const [materials, setMaterials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Material Modal States (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    project_id: '',
    name: '',
    category: 'Structural',
    specifications: '',
    quantity: '',
    unit: 'Bags',
    cost_per_unit: '',
    supplier: '',
    status: 'Available',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [matRes, prjRes] = await Promise.all([
        contractorService.getMaterials(selectedProjectId),
        contractorService.getProjects()
      ]);
      const matList = matRes.data || [];
      const prjList = prjRes.data || [];

      setMaterials(matList);
      setProjects(prjList);

      if (prjList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjList[0].id);
      }
    } catch (err) {
      console.error("Failed to load materials:", err);
      setError(err.response?.data?.message || 'Failed to fetch materials data.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAddModal = () => {
    setEditingMaterial(null);
    setFormData({
      project_id: selectedProjectId || (projects[0]?.id || ''),
      name: '',
      category: 'Structural',
      specifications: '',
      quantity: '',
      unit: 'Bags',
      cost_per_unit: '',
      supplier: '',
      status: 'Available',
      notes: ''
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mat) => {
    setEditingMaterial(mat);
    setFormData({
      project_id: mat.project_id,
      name: mat.name || mat.item_name || '',
      category: mat.category || 'Structural',
      specifications: mat.specifications || '',
      quantity: mat.quantity || '',
      unit: mat.unit || 'Units',
      cost_per_unit: mat.cost_per_unit || mat.estimated_cost || '',
      supplier: mat.supplier || '',
      status: mat.status || 'Available',
      notes: mat.notes || ''
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (mat) => {
    setMaterialToDelete(mat);
    setIsDeleteModalOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.project_id) {
      setModalError('Please enter the material name and select a building project.');
      return;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setModalError('Please enter a valid material quantity.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);
    try {
      if (editingMaterial) {
        await contractorService.updateMaterial(editingMaterial.id, formData);
        setActionSuccess(`Material "${formData.name}" updated successfully.`);
      } else {
        await contractorService.createMaterial(formData);
        setActionSuccess(`Material "${formData.name}" added to project inventory.`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save material:", err);
      setModalError(err.response?.data?.message || 'Failed to save material record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!materialToDelete) return;
    setIsDeleting(true);
    try {
      await contractorService.deleteMaterial(materialToDelete.id);
      setActionSuccess(`Material "${materialToDelete.name || materialToDelete.item_name}" removed from inventory.`);
      setIsDeleteModalOpen(false);
      setMaterialToDelete(null);
      fetchData();
    } catch (err) {
      console.error("Failed to delete material:", err);
      setError(err.response?.data?.message || 'Failed to remove material.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = !search || 
      (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
      (m.item_name && m.item_name.toLowerCase().includes(search.toLowerCase())) || 
      (m.specifications && m.specifications.toLowerCase().includes(search.toLowerCase())) ||
      (m.supplier && m.supplier.toLowerCase().includes(search.toLowerCase())) ||
      (m.category && m.category.toLowerCase().includes(search.toLowerCase())) ||
      (m.project_name && m.project_name.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = materials.reduce((sum, m) => {
    const q = parseFloat(m.quantity) || 0;
    const c = parseFloat(m.cost_per_unit || m.estimated_cost) || 0;
    return sum + (q * c);
  }, 0);

  const availableCount = materials.filter(m => m.status === 'Available').length;
  const orderedCount = materials.filter(m => m.status === 'Ordered' || m.status === 'Requested' || m.status === 'Pending').length;

  const categories = ['All', 'Structural', 'Cement & Concrete', 'Steel & Rebar', 'Masonry & Bricks', 'Finishing & Tiles', 'Plumbing & Electrical', 'Timber & Wood', 'Chemicals & Paint', 'General'];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Materials & Supplies Inventory" 
        description="Add, update, and manage on-site material stock with detailed technical specifications, quantities, and supplier records."
        action={
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleOpenAddModal}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-2 text-xs shadow-xs px-3.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Add Material
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Materials Tracked" value={`${materials.length} Items`} icon={Boxes} color="blue" subtitle="Across Building Projects" />
        <StatCard title="Available In Stock" value={availableCount} icon={Package} color="green" subtitle="Ready for Construction" />
        <StatCard title="Total Inventory Value" value={formatCurrency(totalValue)} icon={DollarSign} color="gold" subtitle="Estimated Material Assets" />
      </div>

      <SectionCard
        title="Site Materials & Specifications"
        subtitle="Manage inventory items, specifications, and supplier deliveries."
        action={
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleOpenAddModal}
            className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1.5 text-xs shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> New Material
          </Button>
        }
      >
        {/* Filters and Search Bar */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <SearchBar 
              placeholder="Search by material item, specifications, supplier, brand..." 
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
                <Plus className="w-4 h-4 stroke-[2.5]" /> Add Material
              </Button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full font-bold transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Materials Table */}
        {isLoading ? (
          <TablePlaceholder columns={6} rows={6} />
        ) : error ? (
          <ErrorState title="Unable to load materials" description={error} onRetry={fetchData} />
        ) : filteredMaterials.length === 0 ? (
          <EmptyState 
            icon={Package}
            title="No materials logged"
            description={search || categoryFilter !== 'All' ? "No materials match your current search or category filter." : "No material stock items logged for this building project."}
            action={
              <Button variant="primary" size="sm" onClick={handleOpenAddModal} className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5 mt-2">
                <Plus className="w-4 h-4" /> Add First Material
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="p-4">Material Details & Specifications</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock Quantity</th>
                  <th className="p-4">Unit Cost & Total</th>
                  <th className="p-4">Supplier & Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {filteredMaterials.map(m => {
                  const name = m.name || m.item_name;
                  const unitCost = parseFloat(m.cost_per_unit || m.estimated_cost || 0);
                  const qty = parseFloat(m.quantity || 0);
                  const lineTotal = unitCost * qty;

                  return (
                    <tr key={m.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4 max-w-xs">
                        <strong className="block text-neutral-900 font-bold text-sm">{name}</strong>
                        {m.specifications && (
                          <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2 font-medium">
                            <span className="font-bold text-neutral-500">Spec:</span> {m.specifications}
                          </p>
                        )}
                        <span className="text-[11px] text-neutral-400 font-mono block mt-1">
                          Project: {m.project_name}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {m.category || 'General'}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-neutral-900 text-sm">{m.quantity}</span>{' '}
                        <span className="text-xs text-neutral-500 font-semibold">{m.unit}</span>
                      </td>

                      <td className="p-4">
                        <div className="text-xs">
                          <span className="font-bold text-neutral-900 block">{formatCurrency(unitCost)} / {m.unit}</span>
                          <span className="text-neutral-500 font-semibold">Total: {formatCurrency(lineTotal)}</span>
                        </div>
                      </td>

                      <td className="p-4 text-xs">
                        <span className="font-bold text-neutral-800 block flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-neutral-400" />
                          {m.supplier || 'Site Vendor'}
                        </span>
                        {m.notes && <span className="text-neutral-500 italic block">{m.notes}</span>}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                          m.status === 'Available' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          m.status === 'Ordered' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          m.status === 'Low Stock' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                          'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {m.status || 'Available'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Edit Material Specifications"
                            onClick={() => handleOpenEditModal(m)}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Remove Material"
                            onClick={() => handleOpenDeleteModal(m)}
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

      {/* CREATE / EDIT MATERIAL MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMaterial ? `Edit Material: ${editingMaterial.name || editingMaterial.item_name}` : 'Add Material with Specifications'}
      >
        <form onSubmit={handleSaveMaterial} className="space-y-4">
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
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Material Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. UltraTech Super Cement 53 Grade"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              >
                <option value="Structural">Structural</option>
                <option value="Cement & Concrete">Cement & Concrete</option>
                <option value="Steel & Rebar">Steel & Rebar</option>
                <option value="Masonry & Bricks">Masonry & Bricks</option>
                <option value="Finishing & Tiles">Finishing & Tiles</option>
                <option value="Plumbing & Electrical">Plumbing & Electrical</option>
                <option value="Timber & Wood">Timber & Wood</option>
                <option value="Chemicals & Paint">Chemicals & Paint</option>
                <option value="General">General Supplies</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Technical Specifications / Grade / Brand</label>
            <textarea
              rows="2"
              placeholder="e.g. IS 12269:2013 compliant, 53 Grade OPC, compressive strength 53 MPa, 50kg moisture-sealed packaging"
              value={formData.specifications}
              onChange={e => setFormData(p => ({ ...p, specifications: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Quantity *</label>
              <input
                type="number"
                step="any"
                required
                placeholder="500"
                value={formData.quantity}
                onChange={e => setFormData(p => ({ ...p, quantity: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              >
                <option value="Bags">Bags</option>
                <option value="Tons">Tons</option>
                <option value="Kg">Kg</option>
                <option value="Cu. M">Cu. M</option>
                <option value="Sq. Ft">Sq. Ft</option>
                <option value="Pieces">Pieces</option>
                <option value="Liters">Liters</option>
                <option value="Truckloads">Truckloads</option>
                <option value="Units">Units</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Cost Per Unit (₹)</label>
              <input
                type="number"
                step="any"
                placeholder="390"
                value={formData.cost_per_unit}
                onChange={e => setFormData(p => ({ ...p, cost_per_unit: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Supplier / Vendor</label>
              <input
                type="text"
                placeholder="e.g. Shree Ram Cement Agency"
                value={formData.supplier}
                onChange={e => setFormData(p => ({ ...p, supplier: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Stock Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
              >
                <option value="Available">Available (In Stock)</option>
                <option value="Ordered">Ordered / In Transit</option>
                <option value="Requested">Requested</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Consumed">Consumed / Used</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Storage Location / Site Notes</label>
            <input
              type="text"
              placeholder="e.g. Stored in North Warehouse Shed 2"
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-neutral-300 bg-white text-sm focus:ring-2 focus:ring-gold-500 font-medium"
            />
          </div>

          {modalError && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-3 rounded-lg border border-rose-200">{modalError}</p>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              size="sm" 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              {isSubmitting ? 'Saving...' : editingMaterial ? 'Update Material' : 'Save Material'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Material Removal"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            Are you sure you want to remove <strong className="text-neutral-900">{materialToDelete?.name || materialToDelete?.item_name}</strong> from the project materials inventory?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
            ⚠️ This will delete this material stock record from the site inventory.
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              size="sm" 
              disabled={isDeleting}
              onClick={handleDeleteMaterial}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? 'Removing...' : 'Remove Material'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* FLOATING ACTION PLUS BUTTON */}
      <button
        type="button"
        onClick={handleOpenAddModal}
        title="Add New Material"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-600 active:scale-95 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 z-30 focus:outline-none focus:ring-4 focus:ring-gold-500/30"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
};

export const ContractorMaterials = () => (
  <ErrorBoundary>
    <ContractorMaterialsContent />
  </ErrorBoundary>
);
