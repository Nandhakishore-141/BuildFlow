import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Users, Filter, RefreshCw, UserCheck, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import * as adminService from '@/services/adminService';

const AdminUsersContent = () => {
  const navigate = useNavigate();
  const { startImpersonation, isImpersonating } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impersonatingId, setImpersonatingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getUsers({
        search,
        role: roleFilter !== 'All' ? roleFilter : undefined
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError(err.response?.data?.message || 'Failed to load platform users.');
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus ? 'Suspended' : 'Active';
    if (window.confirm(`Are you sure you want to change user status to ${newStatus}?`)) {
      try {
        await adminService.updateUserStatus(id, newStatus);
        fetchUsers();
      } catch (e) {
        alert(e.response?.data?.message || 'Failed to update user status');
      }
    }
  };

  const handleLoginAs = async (targetUser) => {
    if (targetUser.role === 'Admin') {
      alert('Admin cannot impersonate another Admin user.');
      return;
    }

    if (window.confirm(`Initiate impersonation session as ${targetUser.name} (${targetUser.role})?`)) {
      setImpersonatingId(targetUser.id);
      const res = await startImpersonation(targetUser.id);
      setImpersonatingId(null);

      if (res.success) {
        const routeMap = {
          Contractor: '/contractor/dashboard',
          Worker: '/worker/dashboard',
          Homeowner: '/homeowner/dashboard'
        };
        const dest = routeMap[res.targetRole] || '/admin/dashboard';
        navigate(dest);
      } else {
        alert(res.error || 'Failed to start impersonation session');
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="User Management" 
        description="View, search, manage, and impersonate registered platform users."
        action={
          <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      <SectionCard>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-80">
            <SearchBar 
              placeholder="Search by name, email or company..." 
              value={search} 
              onChange={setSearch} 
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role:</span>
            {['All', 'Contractor', 'Homeowner', 'Worker', 'Admin'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  roleFilter === r 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={6} />
        ) : error ? (
          <ErrorState title="Unable to load users" description={error} onRetry={fetchUsers} />
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description={search ? `No users match "${search}".` : "No registered users in this role category."} />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">Name / Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Company / Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">
                      {u.name}
                      <span className="block text-xs font-normal text-neutral-500">{u.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-600">
                      {u.company_name || u.phone || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${u.is_verified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
                        {u.is_verified ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.role !== 'Admin' && !isImpersonating && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleLoginAs(u)}
                            disabled={impersonatingId === u.id}
                            className="bg-gold-500 hover:bg-gold-600 text-white font-bold gap-1 text-xs"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            {impersonatingId === u.id ? 'Connecting...' : 'Login As'}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStatusChange(u.id, u.is_verified)}
                          className={u.is_verified ? 'text-rose-600 hover:bg-rose-50 text-xs' : 'text-emerald-600 hover:bg-emerald-50 text-xs'}
                        >
                          {u.is_verified ? 'Suspend' : 'Activate'}
                        </Button>
                      </div>
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

export const AdminUsers = () => (
  <ErrorBoundary>
    <AdminUsersContent />
  </ErrorBoundary>
);
