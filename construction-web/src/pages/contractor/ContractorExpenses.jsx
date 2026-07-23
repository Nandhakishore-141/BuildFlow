import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { Receipt, Plus, Download, AlertCircle } from 'lucide-react';
import * as expenseService from '@/services/expenseService';

export const ContractorExpenses = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await expenseService.getExpenses();
        setData(res.data || []);
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load expenses.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financials & Expenses" 
        description="Monitor budgets, track site expenses, and manage invoices."
        action={
          <div className="flex gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Expenses (YTD)" value="$0.00" icon={Receipt} color="neutral" />
      </div>

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search invoices or descriptions..." className="flex-1" />
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Categories</option>
              <option value="labor">Labor</option>
              <option value="materials">Materials</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={6} />
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Expenses (/api/expenses) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : data.length === 0 ? (
          <EmptyState 
            icon={Receipt}
            title="No expenses logged"
            description="You haven't logged any project expenses yet."
          />
        ) : (
          <div>{/* Render real data here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
