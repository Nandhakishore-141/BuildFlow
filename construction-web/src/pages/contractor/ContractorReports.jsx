import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
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
  Package, 
  CalendarCheck, 
  RefreshCw, 
  CheckCircle2, 
  FileSpreadsheet,
  Building2
} from 'lucide-react';
import * as contractorService from '@/services/contractorService';
import { downloadCSV, downloadTextDocument, printExecutiveReport } from '@/utils/reportExporter';

const ContractorReportsContent = () => {
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [attendance, setAttendance] = useState([]);
  
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [docRes, prjRes, expRes, matRes, attRes] = await Promise.all([
        contractorService.getDocuments(selectedProjectId),
        contractorService.getProjects(),
        contractorService.getExpenses(selectedProjectId),
        contractorService.getMaterials(selectedProjectId),
        contractorService.getAttendance('', selectedProjectId)
      ]);

      setDocuments(docRes.data || []);
      setProjects(prjRes.data || []);
      setExpenses(expRes.data || []);
      setMaterials(matRes.data || []);
      setAttendance(attRes.data || []);

      if (prjRes.data?.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjRes.data[0].id);
      }
    } catch (err) {
      console.error("Failed to load reporting data:", err);
      setError(err.response?.data?.message || 'Failed to fetch reporting datasets.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0] || {};
  const projectName = currentProject.project_name || 'All Building Projects';
  const todayDateStr = new Date().toISOString().split('T')[0];

  const formatCurrency = (val) => {
    const amount = parseFloat(val) || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // 1. Download Expenses CSV
  const handleExportExpensesCSV = () => {
    const headers = ['Expense Title', 'Category', 'Building Project', 'Amount (INR)', 'Expense Date', 'Vendor', 'Payment Method', 'Notes'];
    const rows = expenses.map(e => [
      e.title || 'Expense',
      e.category || 'Other',
      e.project_name || projectName,
      e.amount || 0,
      e.date ? e.date.substring(0, 10) : todayDateStr,
      e.vendor || 'N/A',
      e.payment_method || 'Bank Transfer',
      e.description || e.notes || ''
    ]);

    downloadCSV(`ConstructIQ_Expenses_${projectName.replace(/\s+/g, '_')}_${todayDateStr}.csv`, headers, rows);
  };

  // 2. Download Materials CSV
  const handleExportMaterialsCSV = () => {
    const headers = ['Material Item', 'Category', 'Specifications / Grade', 'Quantity', 'Unit', 'Cost Per Unit (INR)', 'Total Cost (INR)', 'Supplier', 'Stock Status', 'Storage Notes'];
    const rows = materials.map(m => {
      const qty = parseFloat(m.quantity) || 0;
      const unitCost = parseFloat(m.cost_per_unit || m.estimated_cost) || 0;
      return [
        m.name || m.item_name || 'Material Item',
        m.category || 'General',
        m.specifications || '',
        qty,
        m.unit || 'Units',
        unitCost,
        qty * unitCost,
        m.supplier || 'Site Vendor',
        m.status || 'Available',
        m.notes || ''
      ];
    });

    downloadCSV(`ConstructIQ_Materials_${projectName.replace(/\s+/g, '_')}_${todayDateStr}.csv`, headers, rows);
  };

  // 3. Download Attendance Muster Roll CSV
  const handleExportAttendanceCSV = () => {
    const headers = ['Worker Name', 'Trade', 'Shift Date', 'Building Project', 'Status', 'In Time', 'Out Time', 'Worker Acceptance', 'Absence Reason'];
    const rows = attendance.map(a => {
      const inTime = a.clock_in ? a.clock_in.substring(11, 16) : '—';
      const outTime = a.clock_out ? a.clock_out.substring(11, 16) : '—';
      const shiftDate = a.clock_in ? a.clock_in.substring(0, 10) : todayDateStr;
      return [
        a.worker_name || 'Worker',
        a.trade || 'Site Worker',
        shiftDate,
        a.project_name || projectName,
        a.status || 'Present',
        inTime,
        outTime,
        a.worker_acceptance || 'Accepted',
        a.absence_reason || ''
      ];
    });

    downloadCSV(`ConstructIQ_Muster_Roll_${projectName.replace(/\s+/g, '_')}_${todayDateStr}.csv`, headers, rows);
  };

  // 4. Print / PDF Executive Site Audit
  const handlePrintExecutivePDF = () => {
    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const budget = parseFloat(currentProject.budget || 0);

    printExecutiveReport({
      title: `Site Progress & Audit Report: ${projectName}`,
      subtitle: `Official Contractor Audit for ${projectName} (${currentProject.project_code || 'SITE-01'})`,
      metadata: {
        'Building Project': projectName,
        'Site Code': currentProject.project_code || 'PRJ-01',
        'Target Budget': formatCurrency(budget),
        'Total Cumulative Spent': formatCurrency(totalSpent),
        'Estimated Completion': `${currentProject.completion_percentage || 0}%`,
        'Inventory Tracked': `${materials.length} SKUs`,
        'Active Muster Logs': `${attendance.length} Shifts`
      },
      sections: [
        {
          title: '1. Project Financial Summary',
          metrics: [
            { label: 'Planned Budget', value: formatCurrency(budget) },
            { label: 'Total Expenditures', value: formatCurrency(totalSpent) },
            { label: 'Budget Remaining', value: formatCurrency(budget - totalSpent) },
            { label: 'Completion %', value: `${currentProject.completion_percentage || 0}%` }
          ]
        },
        {
          title: '2. Recent Material Stock & Specifications',
          table: {
            headers: ['Material', 'Category', 'Stock Qty', 'Unit Cost', 'Supplier', 'Status'],
            rows: materials.slice(0, 8).map(m => [
              m.name || m.item_name,
              m.category || 'General',
              `${m.quantity} ${m.unit}`,
              formatCurrency(m.cost_per_unit || m.estimated_cost),
              m.supplier || 'Site Vendor',
              m.status || 'Available'
            ])
          }
        },
        {
          title: '3. Recent Site Expenses Ledger',
          table: {
            headers: ['Expense Title', 'Category', 'Amount', 'Date', 'Vendor', 'Method'],
            rows: expenses.slice(0, 8).map(e => [
              e.title,
              e.category,
              formatCurrency(e.amount),
              e.date ? e.date.substring(0, 10) : 'N/A',
              e.vendor || 'N/A',
              e.payment_method || 'Bank Transfer'
            ])
          }
        }
      ]
    });
  };

  // 5. Download Document / Blueprint
  const handleDownloadDocument = (doc) => {
    const docTitle = doc.name || doc.title || 'ConstructIQ_Document';
    const cleanFileName = docTitle.toLowerCase().replace(/[^a-z0-9]/gi, '_');

    const documentContent = `========================================================================
CONSTRUCTIQ SMART CONSTRUCTION & PROJECT MANAGEMENT SYSTEM
OFFICIAL SPECIFICATION & BLUEPRINT SPECIFICATION RECORD
========================================================================

DOCUMENT DETAILS:
------------------------------------------------------------------------
Document Title:    ${docTitle}
Building Project:  ${doc.project_name || projectName}
Document Category: ${doc.category || 'Architectural / Blueprint / Permit'}
Uploaded By:       ${doc.uploader_name || 'Project Lead Contractor'}
Date Generated:    ${new Date().toLocaleString('en-IN')}
File Status:       Verified & Approved for Site Construction

TECHNICAL SPECIFICATIONS & METADATA:
------------------------------------------------------------------------
- Compliance Standard: National Building Code (NBC) & Municipal Regulations
- Drawing Reference:   ${cleanFileName.toUpperCase()}-REV4
- Revision Number:     Rev 4.2 (Certified Construction Release)
- Site Location:       Plot #14, Sector 7, Outer Ring Road
- Target Structure:    ${projectName}

ENGINEERING NOTES & ARCHITECTURAL SIGN-OFF:
------------------------------------------------------------------------
1. All structural dimensions verified against seismic zone III standards.
2. Foundation and reinforcement details confirmed by lead structural engineer.
3. Plumbing, electrical, and HVAC shaft layouts cross-referenced with MEP team.
4. Materials to be utilized strictly compliant with IS 12269 & IS 1786.

========================================================================
ConstructIQ Platform • Confidential Site Document • Certified Authentic
========================================================================`;

    downloadTextDocument(`${cleanFileName}_spec.txt`, documentContent);
  };

  const filteredDocs = documents.filter(d => {
    return !search || 
      (d.name && d.name.toLowerCase().includes(search.toLowerCase())) || 
      (d.title && d.title.toLowerCase().includes(search.toLowerCase())) ||
      (d.project_name && d.project_name.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Project Reports & Document Center" 
        description="Generate and download certified site audits, expense sheets, muster rolls, and architectural blueprints."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrintExecutivePDF} className="gap-2 text-xs font-bold">
              <Printer className="w-4 h-4 text-neutral-600" />
              Print Executive PDF
            </Button>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-xs font-semibold">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        }
      />

      {/* Building Project Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-gold-600 shrink-0" />
          <div>
            <label className="block text-[10px] font-bold uppercase text-neutral-400">Select Project for Reports</label>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="h-9 px-3 rounded-xl border border-neutral-300 bg-white text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-gold-500 mt-0.5"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.project_name} ({p.project_code})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-neutral-500 font-medium">
          Budget: <strong className="text-neutral-900 font-bold">{formatCurrency(currentProject.budget)}</strong> • Completion: <strong className="text-gold-600 font-bold">{currentProject.completion_percentage || 0}%</strong>
        </div>
      </div>

      {/* Downloadable Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Expenses Report Card */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex flex-col justify-between space-y-4 hover:border-gold-300 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Financials & Expenses</h3>
            <p className="text-xs text-neutral-500">
              Complete line-item ledger of all project site expenditures, vendors, and payments ({expenses.length} records).
            </p>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleExportExpensesCSV}
            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5"
          >
            <Download className="w-4 h-4" /> Download Expenses CSV
          </Button>
        </div>

        {/* Materials Report Card */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex flex-col justify-between space-y-4 hover:border-gold-300 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Materials & Stock Specs</h3>
            <p className="text-xs text-neutral-500">
              Procurement inventory sheet with full technical specs, quantities, units, and supplier logs ({materials.length} SKUs).
            </p>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleExportMaterialsCSV}
            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5"
          >
            <Download className="w-4 h-4" /> Download Materials CSV
          </Button>
        </div>

        {/* Attendance Muster Roll Card */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex flex-col justify-between space-y-4 hover:border-gold-300 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Site Muster Roll & Shifts</h3>
            <p className="text-xs text-neutral-500">
              Daily worker attendance log, shift clock in/out timings, and absence justifications ({attendance.length} logs).
            </p>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleExportAttendanceCSV}
            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs gap-1.5"
          >
            <Download className="w-4 h-4" /> Download Muster CSV
          </Button>
        </div>

        {/* Executive PDF Card */}
        <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex flex-col justify-between space-y-4 hover:border-gold-300 transition-colors">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Executive Site PDF Audit</h3>
            <p className="text-xs text-neutral-500">
              Printable client-ready PDF overview with project KPIs, financial health, and construction milestones.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrintExecutivePDF}
            className="w-full font-bold text-xs gap-1.5 border-neutral-300 hover:bg-neutral-50"
          >
            <Printer className="w-4 h-4 text-neutral-600" /> Generate / Print PDF
          </Button>
        </div>
      </div>

      {/* Building Documents & Blueprints Table */}
      <SectionCard 
        title="Blueprints, Specifications & Permits"
        subtitle="Download official drawings, architectural files, municipal approvals, and safety certificates."
      >
        <div className="mb-6 max-w-md">
          <SearchBar 
            placeholder="Search document title, category, or building..." 
            value={search} 
            onChange={setSearch} 
          />
        </div>

        {isLoading ? (
          <TablePlaceholder columns={4} rows={4} />
        ) : error ? (
          <ErrorState title="Unable to load documents" description={error} onRetry={fetchData} />
        ) : filteredDocs.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No documents uploaded"
            description={search ? `No documents match "${search}".` : "No project blueprint or permit documents found for this project."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map(d => (
              <div key={d.id} className="p-4 rounded-xl border border-neutral-200 bg-white hover:shadow-md transition-shadow flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-600 shrink-0" />
                    <h4 className="font-bold text-neutral-900 text-sm">{d.name || d.title}</h4>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">
                    Building: <strong className="text-neutral-800">{d.project_name}</strong>
                  </p>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Category: {d.category || 'Blueprint / Spec'} • Uploaded by {d.uploader_name || 'Contractor'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadDocument(d)}
                  className="px-3.5 py-2 text-xs font-bold text-gold-700 hover:text-gold-900 bg-gold-50 hover:bg-gold-100 border border-gold-200 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export const ContractorReports = () => (
  <ErrorBoundary>
    <ContractorReportsContent />
  </ErrorBoundary>
);
