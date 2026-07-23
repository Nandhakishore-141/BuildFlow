import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { EmptyState } from '@/components/common/EmptyState';
import { Briefcase } from 'lucide-react';
import * as adminService from '@/services/adminService';

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.getProjects();
        setProjects(res.data || []);
      } catch (err) {} finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Global Projects" description="Oversight of all active and completed construction projects." />
      <SectionCard>
        {isLoading ? <TablePlaceholder columns={5} rows={6} /> : projects.length === 0 ? <EmptyState icon={Briefcase} title="No projects" description="" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b bg-neutral-50"><th className="p-4">Project</th><th className="p-4">Contractor</th><th className="p-4">Owner</th><th className="p-4">Status</th><th className="p-4">Progress</th></tr></thead>
              <tbody className="divide-y">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold">{p.project_name}<br/><span className="text-xs font-normal text-neutral-500">{p.project_code}</span></td>
                    <td className="p-4 text-sm">{p.contractor_name}</td>
                    <td className="p-4 text-sm">{p.owner_name || 'N/A'}</td>
                    <td className="p-4"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{p.status}</span></td>
                    <td className="p-4 font-bold text-gold-600">{p.completion_percentage}%</td>
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
