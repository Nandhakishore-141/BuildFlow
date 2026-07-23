import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/common/StatCard';
import { Receipt, Plus, Download } from 'lucide-react';

export const ContractorExpenses = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Expenses" 
        description="Track project budgets, invoices, and payments."
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="primary" className="gap-2">
              <Plus className="w-4 h-4" />
              Log Expense
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Budget" value="$450,000" color="neutral" />
        <StatCard title="Total Spent" value="$125,400" color="blue" />
        <StatCard title="Pending Invoices" value="$12,300" color="gold" />
        <StatCard title="Remaining" value="$312,300" color="green" />
      </div>

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search invoices or descriptions..." className="flex-1" />
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Categories</option>
              <option value="materials">Materials</option>
              <option value="labor">Labor</option>
              <option value="equipment">Equipment</option>
              <option value="permits">Permits</option>
            </select>
          </div>
        </div>

        <div className="w-full h-48 bg-neutral-50 border border-neutral-200 border-dashed rounded-lg flex items-center justify-center mb-6">
          <p className="text-neutral-400 font-medium">Expense Chart Placeholder</p>
        </div>

        <TablePlaceholder columns={6} rows={6} />
      </SectionCard>
    </div>
  );
};
