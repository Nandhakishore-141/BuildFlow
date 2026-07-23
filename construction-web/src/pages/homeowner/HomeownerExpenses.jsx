import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatCard } from '@/components/common/StatCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { CreditCard, Download } from 'lucide-react';

export const HomeownerExpenses = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Financials & Payments" 
        description="Track your budget, view invoices, and manage payments."
        action={
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download Summary
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Budget" value="$450,000" color="neutral" />
        <StatCard title="Amount Paid" value="$125,400" color="green" />
        <StatCard title="Next Payment Due" value="$25,000" color="red" />
      </div>

      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Payment History & Invoices</h2>
          <Button variant="primary" size="sm" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Make Payment
          </Button>
        </div>

        <TablePlaceholder columns={5} rows={5} />
      </SectionCard>
    </div>
  );
};
