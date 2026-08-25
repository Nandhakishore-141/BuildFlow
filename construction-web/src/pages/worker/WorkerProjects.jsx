import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { SearchBar } from '@/components/common/SearchBar';
import { Building2, ChevronLeft, ChevronRight, ArrowRight, Eye, RefreshCw, Filter } from 'lucide-react';
import * as projectService from '@/services/projectService';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'
];

const WorkerBuildingsContent = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuildings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await projectService.getProjects({ page: pagination.page, limit: pagination.limit, search });
      const rawProjects = res.data?.data?.data || res.data?.data || res.data || [];
      const projsList = Array.isArray(rawProjects) ? rawProjects : (Array.isArray(rawProjects?.data) ? rawProjects.data : []);
      setBuildings(projsList);
      
      const paginationData = res.data?.data?.pagination || res.data?.pagination;
      setPagination(paginationData || { page: 1, limit: 10, totalPages: 1 });
    } catch (err) {
      console.error("Failed to load worker assigned buildings:", err);
      setError('Failed to load your assigned building sites.');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, search]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Buildings" 
        description="View details and open workspaces for the construction buildings and sites assigned to you."
        action={
          <Button variant="outline" size="sm" onClick={fetchBuildings} className="gap-2 text-xs">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        }
      />

      <SectionCard>
        <div className="mb-6 w-full md:w-80">
          <SearchBar 
            placeholder="Search assigned buildings..." 
            value={search} 
            onChange={setSearch} 
          />
        </div>

        {isLoading ? (
          <TablePlaceholder columns={3} rows={3} />
        ) : error ? (
          <ErrorState title="Unable to load buildings" description={error} onRetry={fetchBuildings} />
        ) : buildings.length === 0 ? (
          <EmptyState 
            icon={Building2}
            title="No assigned buildings"
            description={search ? `No building sites match "${search}".` : "You are not currently assigned to any active building sites."}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buildings.map((building, idx) => {
                const coverImg = PROJECT_COVER_IMAGES[idx % PROJECT_COVER_IMAGES.length];
                return (
                  <div 
                    key={building.id} 
                    onClick={() => navigate(`/worker/buildings/${building.id}`)}
                    className="border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                        <img src={coverImg} alt={building.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 text-xs font-extrabold rounded-full border shadow-xs ${
                            building.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                            building.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                            'bg-neutral-100 text-neutral-800 border-neutral-200'
                          }`}>
                            {building.status}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                          {building.project_code}
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                            {building.project_name}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1 font-medium">
                            Supervisor: <strong className="text-neutral-700">{building.contractor_name || building.contractor_company || 'Lead Contractor'}</strong>
                          </p>
                          <p className="text-xs text-neutral-500">{building.address}, {building.city}</p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-neutral-500">Building Completion</span>
                            <span className="text-gold-600 font-bold">{building.completion_percentage}%</span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gold-500 h-full rounded-full transition-all duration-300" style={{ width: `${building.completion_percentage}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-gold-700 group-hover:bg-gold-50 transition-colors">
                      <span>Open Building Workspace</span>
                      <ArrowRight className="w-4 h-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
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
    </div>
  );
};

export const WorkerBuildings = () => (
  <ErrorBoundary>
    <WorkerBuildingsContent />
  </ErrorBoundary>
);

export const WorkerProjects = WorkerBuildings;
