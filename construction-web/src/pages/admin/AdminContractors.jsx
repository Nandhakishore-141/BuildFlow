import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import * as adminService from '@/services/adminService';

export const AdminContractors = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data?.filter(u => u.role === 'Contractor') || []);
    } catch (err) {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVerify = async (id) => {
    try {
      await adminService.verifyContractor(id);
      fetchData();
    } catch (e) { alert('Failed to verify'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contractor Management" description="Approve and verify registered contractors." />
      <SectionCard>
        {isLoading ? <TablePlaceholder columns={5} rows={4} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b bg-neutral-50"><th className="p-4">Contractor</th><th className="p-4">Company</th><th className="p-4">Verification</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4 text-sm text-neutral-600">{u.company_name}</td>
                    <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${u.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-gold-100 text-gold-800'}`}>{u.is_verified ? 'Verified' : 'Pending'}</span></td>
                    <td className="p-4 text-right">
                      {!u.is_verified && <Button variant="outline" size="sm" onClick={() => handleVerify(u.id)}>Approve</Button>}
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
