import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Briefcase, Plus, Filter } from 'lucide-react';

export const ContractorProjects = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Projects" 
        description="Manage your active construction projects and bids."
        action={
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        }
      />

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search projects..." className="flex-1" />
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Since we don't have real data yet, we show an empty state or a placeholder */}
        <div className="hidden">
          <EmptyState 
            icon={Briefcase}
            title="No projects found"
            description="You haven't created any projects yet. Click the button above to get started."
          />
        </div>

        <TablePlaceholder columns={5} rows={6} />
      </SectionCard>
    </div>
  );
};
