import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const ContractorReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports & Analytics" 
        description="Generate comprehensive reports for your projects, financials, and workforce."
        action={
          <Button variant="primary" className="gap-2">
            <Download className="w-4 h-4" />
            Export All Data
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Financial Overview</h2>
          <div className="h-64 bg-neutral-50 rounded-lg border border-dashed border-neutral-300 flex items-center justify-center">
            <p className="text-neutral-400 font-medium">Financial Chart Placeholder</p>
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Workforce Productivity</h2>
          <div className="h-64 bg-neutral-50 rounded-lg border border-dashed border-neutral-300 flex items-center justify-center">
            <p className="text-neutral-400 font-medium">Productivity Graph Placeholder</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Generated Reports</h2>
        <EmptyState 
          icon={FileText}
          title="No reports generated yet"
          description="Select a project and date range to generate a new report."
          action={<Button variant="outline">Generate Report</Button>}
        />
      </SectionCard>
    </div>
  );
};
