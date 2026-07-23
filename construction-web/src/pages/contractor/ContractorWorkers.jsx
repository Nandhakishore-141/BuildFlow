import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Users, UserPlus, Filter } from 'lucide-react';

export const ContractorWorkers = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Workers" 
        description="Manage your workforce, view skills, and assign workers to projects."
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
              <option value="laborer">General Labor</option>
            </select>
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">Any Availability</option>
              <option value="available">Available Now</option>
              <option value="busy">Assigned</option>
            </select>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        <TablePlaceholder columns={6} rows={8} />
      </SectionCard>
    </div>
  );
};
