import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { CalendarCheck, AlertCircle } from 'lucide-react';
import * as attendanceService from '@/services/attendanceService';

export const WorkerAttendance = () => {
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
        else setError('Failed to load attendance records.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Attendance" 
        description="View your check-in history and total hours logged."
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={4} rows={5} />
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
            title="No records found"
            description="You don't have any attendance history yet."
          />
        ) : (
          <div>{/* Render real data here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
