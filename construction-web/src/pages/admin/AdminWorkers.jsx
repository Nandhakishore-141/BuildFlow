import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Users, RefreshCw } from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminWorkersContent = () => {
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({ role: 'Worker' });
      setWorkers(res.data || []);
    } catch (err) {
      console.error("Failed to load workers:", err);
      setError(err.response?.data?.message || 'Failed to load registered worker profiles.');
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchWorkers(); 
  }, [fetchWorkers]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Worker Management" 
        description="View global worker registrations, contact details, and account status." 
        action={
          <Button variant="outline" size="sm" onClick={fetchWorkers} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={4} rows={5} />
        ) : error ? (
          <ErrorState title="Unable to load workers" description={error} onRetry={fetchWorkers} />
        ) : workers.length === 0 ? (
          <EmptyState icon={Users} title="No Workers Found" description="No workers are currently registered on the platform." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">Worker Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {workers.map(w => (
                  <tr key={w.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">{w.name}</td>
                    <td className="p-4 text-neutral-600 font-medium">{w.email}</td>
                    <td className="p-4 text-neutral-500">{w.phone || 'N/A'}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${w.is_verified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                        {w.is_verified ? 'Active' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export const AdminWorkers = () => (
  <ErrorBoundary>
    <AdminWorkersContent />
  </ErrorBoundary>
);
