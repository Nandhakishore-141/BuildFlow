import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { UserCircle, RefreshCw } from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminHomeownersContent = () => {
  const [homeowners, setHomeowners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeowners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({ role: 'Homeowner' });
      setHomeowners(res.data || []);
    } catch (err) {
      console.error("Failed to load homeowners:", err);
      setError(err.response?.data?.message || 'Failed to load homeowner accounts.');
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchHomeowners(); 
  }, [fetchHomeowners]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Homeowner Management" 
        description="View and oversee registered property owners across projects." 
        action={
          <Button variant="outline" size="sm" onClick={fetchHomeowners} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={4} rows={5} />
        ) : error ? (
          <ErrorState title="Unable to load homeowners" description={error} onRetry={fetchHomeowners} />
        ) : homeowners.length === 0 ? (
          <EmptyState icon={UserCircle} title="No Homeowners Found" description="No property owners are currently registered." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">Homeowner Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {homeowners.map(h => (
                  <tr key={h.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">{h.name}</td>
                    <td className="p-4 text-neutral-600 font-medium">{h.email}</td>
                    <td className="p-4 text-neutral-500">{h.phone || 'N/A'}</td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${h.is_verified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                        {h.is_verified ? 'Active' : 'Pending'}
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

export const AdminHomeowners = () => (
  <ErrorBoundary>
    <AdminHomeownersContent />
  </ErrorBoundary>
);
