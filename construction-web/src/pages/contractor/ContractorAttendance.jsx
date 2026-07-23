import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';

export const ContractorAttendance = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attendance" 
        description="Track daily worker attendance and hours."
        action={
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Present Today" value="42" color="green" />
        <StatCard title="Absent" value="3" color="red" />
        <StatCard title="Late" value="5" color="gold" />
      </div>

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
              />
            </div>
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Projects</option>
              <option value="1">Downtown Skyscraper</option>
              <option value="2">Residential Complex</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Present</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Absent</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gold-500"></div> Late</span>
          </div>
        </div>

        <TablePlaceholder columns={6} rows={10} />
      </SectionCard>
    </div>
  );
};
