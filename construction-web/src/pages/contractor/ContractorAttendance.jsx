import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { CalendarCheck, Users, AlertCircle, Clock } from 'lucide-react';
import * as attendanceService from '@/services/attendanceService';

export const ContractorAttendance = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await attendanceService.getAttendance();
        setData(res.data || []);
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load attendance.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attendance & Time" 
        description="Track worker hours, daily check-ins, and site presence."
        action={
          <Button variant="outline" className="gap-2">
            Export Timesheets
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Checked In Today" value="0" icon={Users} color="green" />
        <StatCard title="Absent" value="0" icon={AlertCircle} color="red" />
        <StatCard title="Total Hours This Week" value="0" icon={Clock} color="blue" />
      </div>

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search by worker name..." className="flex-1" />
          <div className="flex gap-2">
            <input type="date" className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500" />
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Projects</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={6} />
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Attendance (/api/attendance) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : data.length === 0 ? (
          <EmptyState 
            icon={CalendarCheck}
            title="No attendance records"
            description="There are no attendance logs for the selected date."
          />
        ) : (
          <div>{/* Render real data here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
