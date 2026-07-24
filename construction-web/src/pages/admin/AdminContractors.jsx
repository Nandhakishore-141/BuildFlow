import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Button } from '@/components/common/Button';
import { Briefcase, CheckCircle2, RefreshCw } from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminContractorsContent = () => {
  const [contractors, setContractors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContractors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({ role: 'Contractor' });
      setContractors(res.data || []);
    } catch (err) {
      console.error("Failed to load contractors:", err);
      setError(err.response?.data?.message || 'Failed to load contractor profiles.');
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchContractors(); 
  }, [fetchContractors]);

  const handleVerify = async (id) => {
    try {
      await adminService.verifyContractor(id);
      fetchContractors();
    } catch (e) { 
      alert(e.response?.data?.message || 'Failed to verify contractor'); 
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contractor Management" 
        description="Review, verify, and approve platform construction companies and contractors." 
        action={
          <Button variant="outline" size="sm" onClick={fetchContractors} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={5} rows={5} />
        ) : error ? (
          <ErrorState title="Unable to load contractors" description={error} onRetry={fetchContractors} />
        ) : contractors.length === 0 ? (
          <EmptyState icon={Briefcase} title="No Contractors Found" description="No contractors are currently registered on the platform." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">Contractor Name</th>
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {contractors.map(c => (
                  <tr key={c.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">
                      {c.name}
                      <span className="block text-xs font-normal text-neutral-500">{c.email}</span>
                    </td>
                    <td className="p-4 font-medium text-neutral-800">
                      {c.company_name || 'N/A'}
                    </td>
                    <td className="p-4 text-neutral-600">
                      {c.phone || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${c.is_verified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                        {c.is_verified ? 'Verified & Active' : 'Pending Verification'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {!c.is_verified ? (
                        <Button variant="outline" size="sm" onClick={() => handleVerify(c.id)} className="text-emerald-700 hover:bg-emerald-50 gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Approved
                        </span>
                      )}
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

export const AdminContractors = () => (
  <ErrorBoundary>
    <AdminContractorsContent />
  </ErrorBoundary>
);
