import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Briefcase, Plus, Filter, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import * as projectService from '@/services/projectService';

export const ContractorProjects = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  
  const [formData, setFormData] = useState({
    project_name: '', project_code: '', description: '', budget: '',
    planned_start_date: '', planned_end_date: '', address: '', city: '', state: '', country: ''
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await projectService.getProjects({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status
      });
      setProjects(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, limit: 10, totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [pagination.page, filters]); // Re-fetch on page or filter change

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.createProject(formData);
      setIsCreateModalOpen(false);
      setFormData({
        project_name: '', project_code: '', description: '', budget: '',
        planned_start_date: '', planned_end_date: '', address: '', city: '', state: '', country: ''
      });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error creating project');
    }
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setFormData({
      project_name: project.project_name || '',
      project_code: project.project_code || '',
      description: project.description || '',
      budget: project.budget || '',
      planned_start_date: project.planned_start_date ? project.planned_start_date.split('T')[0] : '',
      planned_end_date: project.planned_end_date ? project.planned_end_date.split('T')[0] : '',
      address: project.address || '',
      city: project.city || '',
      state: project.state || '',
      country: project.country || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.updateProject(currentProject.id, formData);
      setIsEditModalOpen(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error updating project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive/delete this project?')) {
      try {
        await projectService.deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Error deleting project');
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await projectService.updateProjectStatus(id, status);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error updating status');
    }
  };

  const handleUpdateProgress = async (id, progress) => {
    try {
      await projectService.updateProjectProgress(id, progress);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error updating progress');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Projects" 
        description="Manage your active construction projects and bids."
        action={
          <Button variant="primary" className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        }
      />

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar 
            placeholder="Search projects..." 
            className="flex-1"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={6} />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={Briefcase}
            title="No projects found"
            description="You haven't created any projects yet. Click the button above to get started."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-sm">
                    <th className="p-4 font-semibold text-neutral-600">Project Details</th>
                    <th className="p-4 font-semibold text-neutral-600">Owner</th>
                    <th className="p-4 font-semibold text-neutral-600">Status</th>
                    <th className="p-4 font-semibold text-neutral-600">Progress</th>
                    <th className="p-4 font-semibold text-neutral-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-neutral-900">{project.project_name}</p>
                        <p className="text-sm text-neutral-500">{project.project_code} • {project.city}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-neutral-700">{project.owner_name || 'Unassigned'}</p>
                      </td>
                      <td className="p-4">
                        <select 
                          value={project.status} 
                          onChange={(e) => handleUpdateStatus(project.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer
                            ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                              'bg-neutral-100 text-neutral-700 border-neutral-200'}
                          `}
                        >
                          <option value="Planning">Planning</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Suspended">Suspended</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-neutral-100 rounded-full h-2">
                            <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${project.completion_percentage}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-neutral-700">{project.completion_percentage}%</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="px-2 py-0.5 text-xs h-auto"
                            onClick={() => {
                              const prog = prompt('Enter new completion percentage (0-100):', project.completion_percentage);
                              if (prog !== null && !isNaN(prog)) handleUpdateProgress(project.id, parseFloat(prog));
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(project)} className="p-2 text-neutral-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(project.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4">
                <span className="text-sm text-neutral-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Project Name *</label>
              <input required name="project_name" value={formData.project_name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Project Code *</label>
              <input required name="project_code" value={formData.project_code} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Budget</label>
              <input name="budget" value={formData.budget} onChange={handleInputChange} type="number" step="0.01" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
              <input name="planned_start_date" value={formData.planned_start_date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
              <input name="planned_end_date" value={formData.planned_end_date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Project Name *</label>
              <input required name="project_name" value={formData.project_name} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Project Code *</label>
              <input required name="project_code" value={formData.project_code} onChange={handleInputChange} type="text" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Budget</label>
              <input name="budget" value={formData.budget} onChange={handleInputChange} type="number" step="0.01" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
              <input name="planned_start_date" value={formData.planned_start_date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
              <input name="planned_end_date" value={formData.planned_end_date} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
