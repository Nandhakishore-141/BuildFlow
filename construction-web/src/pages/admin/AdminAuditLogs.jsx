import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { ShieldAlert, RefreshCw, Filter } from 'lucide-react';
import * as adminService from '@/services/adminService';

const AdminAuditLogsContent = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAuditLogs({ search });
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError(err.response?.data?.message || 'Failed to load security audit logs.');
    } finally { 
      setIsLoading(false); 
    }
  }, [search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearch = (query) => {
    setSearch(query);
  };

  const getActionBadgeClass = (action) => {
    if (action.includes('LOGIN')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (action.includes('CREATED') || action.includes('ASSIGNED')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (action.includes('EXPENSE') || action.includes('UPDATE')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audit Logs" 
        description="Track security events, data modifications, user logins, and system activity history." 
        action={
          <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Logs
          </Button>
        }
      />

      <SectionCard>
        <div className="mb-6 w-full md:w-80">
          <SearchBar 
            placeholder="Search by action, user name or details..." 
            value={search} 
            onChange={handleSearch} 
          />
        </div>

        {isLoading ? (
          <TablePlaceholder columns={5} rows={10} />
        ) : error ? (
          <ErrorState title="Unable to load audit logs" description={error} onRetry={fetchLogs} />
        ) : logs.length === 0 ? (
          <EmptyState icon={ShieldAlert} title="No audit events found" description={search ? `No activity matching "${search}".` : "No system security logs recorded."} />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">Action</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-neutral-900">
                      {log.user_name || 'System'}
                      {log.user_email && <span className="block text-xs font-normal text-neutral-400">{log.user_email}</span>}
                    </td>
                    <td className="p-4 text-neutral-600 font-mono text-xs max-w-md truncate">
                      {log.details}
                    </td>
                    <td className="p-4 font-mono text-xs text-neutral-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="p-4 text-right text-xs text-neutral-500">
                      {new Date(log.created_at).toLocaleString()}
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

export const AdminAuditLogs = () => (
  <ErrorBoundary>
    <AdminAuditLogsContent />
  </ErrorBoundary>
);
