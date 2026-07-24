import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { HomeownerCreateBuildingWizard } from '@/components/homeowner/HomeownerCreateBuildingWizard';
import { Building2, Filter, ArrowRight, RefreshCw, Eye, LayoutGrid, List, Plus } from 'lucide-react';
import * as homeownerService from '@/services/homeownerService';

const PROJECT_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'
];

const HomeownerBuildingsContent = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const fetchBuildings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await homeownerService.getProjects();
      setBuildings(res.data || []);
    } catch (err) {
      console.error("Failed to load homeowner buildings:", err);
      setError(err.response?.data?.message || 'Failed to load buildings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Contractor Selected': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Looking for Contractor': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Waiting for Contractor Acceptance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Suspended': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const filteredBuildings = buildings.filter(b => {
    const matchesSearch = !search || 
      b.project_name.toLowerCase().includes(search.toLowerCase()) || 
      b.project_code.toLowerCase().includes(search.toLowerCase()) ||
      (b.contractor_name && b.contractor_name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Buildings" 
        description="View building cards and open workspaces for your property construction sites."
        action={
          <div className="flex items-center gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => setIsWizardOpen(true)} 
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1.5 text-xs shadow-xs"
            >
              <Plus className="w-4 h-4" /> New Building
            </Button>
            <Button variant="outline" size="sm" onClick={fetchBuildings} className="gap-2 text-xs font-semibold">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        }
      />

      <SectionCard>
        {/* Search, Status Filter Tabs & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <SearchBar 
              placeholder="Search by building name, code or contractor..." 
              value={search} 
              onChange={setSearch} 
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-4 h-4 text-neutral-400 shrink-0 mr-1" />
              {['All', 'Looking for Contractor', 'In Progress', 'Planning', 'Completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
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

            <div className="flex items-center border border-neutral-200 rounded-lg p-0.5 bg-neutral-50">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          <TablePlaceholder columns={4} rows={4} />
        ) : error ? (
          <ErrorState title="Unable to load buildings" description={error} onRetry={fetchBuildings} />
        ) : filteredBuildings.length === 0 ? (
          <EmptyState 
            icon={Building2}
            title="No buildings found"
            description={search ? `No buildings match "${search}".` : "You don't have any registered property buildings."}
            action={
              <Button variant="primary" size="sm" onClick={() => setIsWizardOpen(true)} className="gap-1.5 bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs mt-2">
                <Plus className="w-4 h-4" /> Create New Building
              </Button>
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBuildings.map((b, idx) => {
              const coverImg = PROJECT_COVER_IMAGES[idx % PROJECT_COVER_IMAGES.length];
              return (
                <div 
                  key={b.id} 
                  onClick={() => navigate(`/homeowner/buildings/${b.id}`)}
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                      <img src={coverImg} alt={b.project_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 text-xs font-extrabold rounded-full border shadow-xs ${getStatusBadgeClass(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-mono text-white">
                        {b.project_code}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-900 group-hover:text-gold-600 transition-colors">
                          {b.project_name}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">
                          Contractor: <strong className="text-neutral-700">{b.contractor_name || 'Awaiting Contractor'}</strong>
                          {b.contractor_company && ` (${b.contractor_company})`}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-neutral-500">Progress</span>
                          <span className="text-gold-600 font-bold">{b.completion_percentage}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-gold-500 h-full rounded-full transition-all duration-300" style={{ width: `${b.completion_percentage}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-neutral-100 text-neutral-600">
                        <div>
                          <span className="text-neutral-400 block font-medium">Allocated Budget</span>
                          <strong className="text-neutral-900">{formatCurrency(b.budget)}</strong>
                        </div>
                        <div>
                          <span className="text-neutral-400 block font-medium">Completion Target</span>
                          <strong className="text-neutral-900">{b.planned_end_date ? new Date(b.planned_end_date).toLocaleDateString() : 'N/A'}</strong>
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
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">Building</th>
                  <th className="p-4">Contractor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Completion</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {filteredBuildings.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">
                      {b.project_name}
                      <span className="block text-xs font-mono font-normal text-neutral-500">{b.project_code}</span>
                    </td>
                    <td className="p-4 text-neutral-700">
                      {b.contractor_name || 'Awaiting Contractor'}
                      {b.contractor_company && <span className="block text-xs text-neutral-400">{b.contractor_company}</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gold-600">{b.completion_percentage}%</td>
                    <td className="p-4 font-bold text-neutral-900">{formatCurrency(b.budget)}</td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => navigate(`/homeowner/buildings/${b.id}`)}
                        className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Workspace
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Creation Wizard */}
      <HomeownerCreateBuildingWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onSuccess={fetchBuildings} 
      />
    </div>
  );
};

export const HomeownerBuildings = () => (
  <ErrorBoundary>
    <HomeownerBuildingsContent />
  </ErrorBoundary>
);

export const HomeownerProjects = HomeownerBuildings;
