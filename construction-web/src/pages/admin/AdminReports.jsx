import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { 
  FileText, 
  Download, 
  Printer, 
  DollarSign, 
  Briefcase, 
  Users, 
  Package, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminReportsContent = () => {
  const [reports, setReports] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getReports();
      setReports(res.data || null);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError(err.response?.data?.message || 'Failed to generate administrative reports.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reports) return;
    const { projectsSummary, financialSummary, workforceSummary, materialsSummary } = reports;
    const csvRows = [
      ['Report Category', 'Metric', 'Value'],
      ['Projects', 'Total Projects', projectsSummary?.totalProjects || 0],
      ['Projects', 'Total Budget', projectsSummary?.totalBudget || 0],
      ['Projects', 'Avg Completion %', `${projectsSummary?.avgCompletion || 0}%`],
      ['Financials', 'Total Budget', financialSummary?.totalBudget || 0],
      ['Financials', 'Total Expenses Logged', financialSummary?.totalExpenses || 0],
      ['Financials', 'Net Budget Remaining', financialSummary?.netRemaining || 0],
      ['Workforce', 'Total Workers', workforceSummary?.totalWorkers || 0],
      ['Workforce', 'Total Assignments', workforceSummary?.totalAssignments || 0],
      ['Workforce', 'Attendance Logs', workforceSummary?.totalAttendanceLogs || 0],
      ['Materials', 'Total Items', materialsSummary?.totalMaterials || 0],
      ['Materials', 'Inventory Value', materialsSummary?.inventoryValue || 0],
      ['Materials', 'Low Stock Count', materialsSummary?.lowStockCount || 0],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ConstructIQ_Platform_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Platform Reports" description="Executive summaries, financial audits, and operational benchmarks." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-100 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Platform Reports" description="Executive summaries, financial audits, and operational benchmarks." />
        <ErrorState title="Unable to generate reports" description={error} onRetry={fetchReports} />
      </div>
    );
  }

  const {
    projectsSummary = {},
    financialSummary = {},
    workforceSummary = {},
    materialsSummary = {}
  } = reports || {};

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Platform Reports" 
        description="Executive summaries, financial audits, and operational benchmarks."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Summary Report */}
        <SectionCard title="Projects & Construction Report">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Projects Portfolio Status</h3>
              <p className="text-xs text-neutral-500">Live operational metric aggregated across all active sites</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Total Platform Projects</span>
              <span className="font-bold text-neutral-900">{projectsSummary.totalProjects || 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Total Planned Capital</span>
              <span className="font-bold text-neutral-900">{formatCurrency(projectsSummary.totalBudget)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-600 font-medium">Average Portfolio Completion</span>
              <span className="font-bold text-gold-600">{projectsSummary.avgCompletion || 0}%</span>
            </div>
          </div>
        </SectionCard>

        {/* Financial Summary Report */}
        <SectionCard title="Financial Audit & Expenses Report">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Capital & Expense Ledger</h3>
              <p className="text-xs text-neutral-500">Total project budgets versus logged site expenditure</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Total Allocated Budget</span>
              <span className="font-bold text-emerald-700">{formatCurrency(financialSummary.totalBudget)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Total Logged Expenditures</span>
              <span className="font-bold text-rose-600">{formatCurrency(financialSummary.totalExpenses)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-600 font-medium">Net Capital Surplus / Margin</span>
              <span className={`font-bold ${financialSummary.netRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(financialSummary.netRemaining)}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Workforce Report */}
        <SectionCard title="Workforce & Attendance Benchmark">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Labor Deployment Metrics</h3>
              <p className="text-xs text-neutral-500">Registered skilled workers and site assignments</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Registered Workers</span>
              <span className="font-bold text-neutral-900">{workforceSummary.totalWorkers || 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Active Project Assignments</span>
              <span className="font-bold text-purple-700">{workforceSummary.totalAssignments || 0}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-600 font-medium">Total Clock-In Attendance Logs</span>
              <span className="font-bold text-neutral-900">{workforceSummary.totalAttendanceLogs || 0}</span>
            </div>
          </div>
        </SectionCard>

        {/* Materials & Inventory Report */}
        <SectionCard title="Materials Inventory & Supply Chain">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">Inventory Health Audit</h3>
              <p className="text-xs text-neutral-500">Stock valuations and material procurement status</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Catalogued Material Line Items</span>
              <span className="font-bold text-neutral-900">{materialsSummary.totalMaterials || 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-50">
              <span className="text-neutral-600 font-medium">Estimated Inventory Valuation</span>
              <span className="font-bold text-amber-700">{formatCurrency(materialsSummary.inventoryValue)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-600 font-medium">Low Stock Warning Items</span>
              <span className={`font-bold ${materialsSummary.lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {materialsSummary.lowStockCount || 0} Items
              </span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export const AdminReports = () => (
  <ErrorBoundary>
    <AdminReportsContent />
  </ErrorBoundary>
);
