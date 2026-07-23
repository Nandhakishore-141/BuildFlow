import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Users, Filter } from 'lucide-react';
import { Button } from '@/components/common/Button';
import * as adminService from '@/services/adminService';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if (window.confirm(`Are you sure you want to change user status to ${newStatus}?`)) {
      try {
        await adminService.updateUserStatus(id, newStatus);
        fetchData();
      } catch (e) {
        alert('Failed to update status');
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="View and manage all registered users on the platform."
      />
      <SectionCard>
        {isLoading ? <TablePlaceholder columns={5} rows={6} /> : error ? <div className="text-red-500">{error}</div> : users.length === 0 ? <EmptyState icon={Users} title="No users found" description="" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-neutral-50 text-sm">
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Company/Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50">
                    <td className="p-4">{u.name}<br/><span className="text-xs text-neutral-500">{u.email}</span></td>
                    <td className="p-4 font-semibold text-neutral-700">{u.role}</td>
                    <td className="p-4 text-sm text-neutral-600">{u.company_name || u.phone}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${u.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {u.is_verified ? 'Active' : 'Pending/Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(u.id, u.is_verified ? 'Active' : 'Suspended')}>
                        {u.is_verified ? 'Suspend' : 'Activate'}
                      </Button>
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
