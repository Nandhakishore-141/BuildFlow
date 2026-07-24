import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { Modal } from '@/components/common/Modal';
import { Briefcase, ChevronLeft, ChevronRight, Eye, RefreshCw, DollarSign, Calendar, Filter } from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminProjectsContent = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getProjects({ 
        page: pagination.page, 
        limit: pagination.limit,
        search,
        status: statusFilter !== 'All' ? statusFilter : undefined
      });

      // Handle backend API envelopes safely
      let projectList = [];
      let pagInfo = { page: pagination.page, limit: 10, total: 0, totalPages: 1 };

      if (res && res.data) {
        if (res.data.projects && Array.isArray(res.data.projects)) {
          projectList = res.data.projects;
          pagInfo = res.data.pagination || pagInfo;
        } else if (Array.isArray(res.data)) {
          projectList = res.data;
          pagInfo = { page: 1, limit: projectList.length, total: projectList.length, totalPages: 1 };
        } else if (res.data.data && Array.isArray(res.data.data)) {
          projectList = res.data.data;
          pagInfo = res.data.pagination || pagInfo;
        }
      }

      setProjects(projectList);
      setPagination(pagInfo);
    } catch (err) {
      console.error("Failed to fetch admin projects:", err);
      setError(err.response?.data?.message || 'Failed to load projects list.');
    } finally { 
      setIsLoading(false); 
    }
  }, [pagination.page, pagination.limit, search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = (query) => {
    setSearch(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Suspended': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Global Projects" 
        description="Oversight of all active, planning, and completed construction projects across the platform." 
        action={
          <Button variant="outline" size="sm" onClick={fetchProjects} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      <SectionCard>
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <SearchBar 
              placeholder="Search by project name, code or city..." 
              value={search} 
              onChange={handleSearch} 
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status:</span>
            {['All', 'In Progress', 'Planning', 'Completed', 'Suspended'].map(st => (
              <button
                key={st}
                onClick={() => handleStatusFilterChange(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  statusFilter === st 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          <TablePlaceholder columns={8} rows={6} />
        ) : error ? (
          <ErrorState 
            title="Unable to load projects" 
            description={error} 
            onRetry={fetchProjects} 
          />
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={Briefcase} 
            title="No projects found" 
            description={search ? `No projects match "${search}". Try adjusting your filters.` : "No projects exist on the platform yet."} 
          />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                    <th className="p-4">Project Name / Code</th>
                    <th className="p-4">Contractor</th>
                    <th className="p-4">Homeowner</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Completion %</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-bold text-neutral-900">
                        {p.project_name}
                        <br />
                        <span className="text-xs font-mono font-normal text-neutral-500">{p.project_code}</span>
                      </td>
                      <td className="p-4 font-medium text-neutral-700">
                        {p.contractor_name || 'Unassigned'}
                        {p.contractor_company && <span className="block text-xs text-neutral-400 font-normal">{p.contractor_company}</span>}
                      </td>
                      <td className="p-4 text-neutral-600">
                        {p.owner_name || 'N/A'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-neutral-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gold-500 h-full rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(100, Math.max(0, p.completion_percentage || 0))}%` }}
                            />
                          </div>
                          <span className="font-bold text-xs text-neutral-800">{p.completion_percentage}%</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-neutral-900">
                        {formatCurrency(p.budget)}
                      </td>
                      <td className="p-4 text-xs text-neutral-500">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1 text-xs text-neutral-700 hover:text-neutral-900"
                          onClick={() => {
                            setSelectedProject(p);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 text-sm">
                <span className="text-neutral-500">
                  Showing {projects.length} of {pagination.total} projects (Page {pagination.page} of {pagination.totalPages})
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page <= 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>

      {/* Project Details Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title={selectedProject ? `${selectedProject.project_name} (${selectedProject.project_code})` : 'Project Details'}
      >
        {selectedProject && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase">Status</span>
                <p className="font-bold text-neutral-800">{selectedProject.status}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase">Completion %</span>
                <p className="font-bold text-gold-600">{selectedProject.completion_percentage}%</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase">Budget</span>
                <p className="font-bold text-neutral-800">{formatCurrency(selectedProject.budget)}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase">City / Location</span>
                <p className="font-medium text-neutral-700">{selectedProject.city || 'N/A'}, {selectedProject.state || ''}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong className="text-neutral-700">Contractor:</strong> {selectedProject.contractor_name || 'N/A'} {selectedProject.contractor_company ? `(${selectedProject.contractor_company})` : ''}</p>
              <p><strong className="text-neutral-700">Homeowner:</strong> {selectedProject.owner_name || 'N/A'} {selectedProject.owner_email ? `<${selectedProject.owner_email}>` : ''}</p>
              {selectedProject.description && (
                <div className="pt-2 border-t border-neutral-200">
                  <strong className="text-neutral-700">Description:</strong>
                  <p className="text-neutral-600 text-xs mt-1 leading-relaxed">{selectedProject.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <Button variant="primary" onClick={() => setIsDetailModalOpen(false)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export const AdminProjects = () => (
  <ErrorBoundary>
    <AdminProjectsContent />
  </ErrorBoundary>
);
