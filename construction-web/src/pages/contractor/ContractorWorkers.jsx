import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Users, UserPlus, Filter, AlertCircle } from 'lucide-react';
import * as workerService from '@/services/workerService';

export const ContractorWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await workerService.getWorkers();
        setWorkers(res.data?.workers || []);
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load workers.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Workforce" 
        description="Manage your tradesmen, assign roles, and view availability."
        action={
          <Button variant="primary" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite Worker
          </Button>
        }
      />

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search workers by name or skill..." className="flex-1" />
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Skills</option>
              <option value="electrician">Electrician</option>
              <option value="plumber">Plumber</option>
              <option value="carpenter">Carpenter</option>
              <option value="mason">Mason</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={6} />
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Workers (/api/workers) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : workers.length === 0 ? (
          <EmptyState 
            icon={Users}
            title="No workers found"
            description="You don't have any workers in your team yet. Invite them to get started."
          />
        ) : (
          <div>{/* Render workers table here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
