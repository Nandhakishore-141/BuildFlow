import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Receipt, AlertCircle } from 'lucide-react';
import * as expenseService from '@/services/expenseService';

export const HomeownerExpenses = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await expenseService.getExpenses();
        setData(res.data || {});
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load financials.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financials" 
        description="Review invoices and budget summaries provided by your contractor."
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={4} rows={5} />
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Expenses (/api/expenses) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : !data?.invoices?.length ? (
          <EmptyState 
            icon={Receipt}
            title="No invoices found"
            description="There are no financials available for your projects."
          />
        ) : (
          <div>{/* Render real invoices here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
