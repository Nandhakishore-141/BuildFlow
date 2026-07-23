import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { ShieldAlert } from 'lucide-react';
import * as adminService from '@/services/adminService';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getAuditLogs();
        setLogs(res.data || []);
      } catch (err) {} finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Track system events and user actions." />
      <SectionCard>
        {isLoading ? <TablePlaceholder columns={4} rows={10} /> : logs.length === 0 ? <EmptyState icon={ShieldAlert} title="No Logs" description="No audit events found." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b bg-neutral-50 text-sm"><th className="p-4">Action</th><th className="p-4">User</th><th className="p-4">Details</th><th className="p-4">Timestamp</th></tr></thead>
              <tbody className="divide-y text-sm">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold text-neutral-800">{log.action}</td>
                    <td className="p-4 text-neutral-600">{log.user_name || 'System'}</td>
                    <td className="p-4 text-neutral-500">{log.details}</td>
                    <td className="p-4 text-neutral-500">{new Date(log.created_at).toLocaleString()}</td>
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
