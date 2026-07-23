import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Package, Plus, Filter, AlertCircle } from 'lucide-react';
import * as materialService from '@/services/materialService';

export const ContractorMaterials = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await materialService.getMaterials();
        setData(res.data || []);
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load materials.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Materials & Inventory" 
        description="Track site deliveries, material usage, and stock levels."
        action={
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Order Materials
          </Button>
        }
      />

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search materials..." className="flex-1" />
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Projects</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Status
            </Button>
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={6} />
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Materials (/api/materials) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : data.length === 0 ? (
          <EmptyState 
            icon={Package}
            title="No materials logged"
            description="You haven't added any material orders yet."
          />
        ) : (
          <div>{/* Render real data here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
