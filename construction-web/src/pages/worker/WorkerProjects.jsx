import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Briefcase } from 'lucide-react';
import * as projectService from '@/services/projectService';

export const WorkerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getProjects();
        setProjects(res.data.projects || []);
      } catch (err) {
        setError('Failed to load your assigned projects.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assigned Projects" 
        description="View details for the construction projects you are currently assigned to."
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={3} rows={3} />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={Briefcase}
            title="No assigned projects"
            description="You are not currently assigned to any active projects."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map(project => (
              <div key={project.id} className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{project.project_name}</h3>
                    <p className="text-neutral-500 text-sm mt-1">{project.address}, {project.city} • Supervisor: {project.contractor_name || project.contractor_company}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                      project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}>
                      {project.status}
                    </span>
                    <Button variant="outline" size="sm">View Instructions</Button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-sm text-neutral-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <p><span className="font-semibold text-neutral-900">Project Code:</span> {project.project_code}</p>
                      <p className="mt-1"><span className="font-semibold text-neutral-900">Completion:</span> {project.completion_percentage}%</p>
                    </div>
                    {project.planned_end_date && (
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">Target End</p>
                        <p className="text-neutral-600">{new Date(project.planned_end_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
