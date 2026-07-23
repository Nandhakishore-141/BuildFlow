import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Briefcase } from 'lucide-react';
import * as projectService from '@/services/projectService';

export const HomeownerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getProjects();
        setProjects(res.data.projects || []);
      } catch (err) {
        setError('Failed to load your projects.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Properties" 
        description="View details and completion estimates for your ongoing construction projects."
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={3} rows={3} />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={Briefcase}
            title="No projects found"
            description="You don't have any active projects linked to your account yet."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map(project => (
              <div key={project.id} className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{project.project_name}</h3>
                    <p className="text-neutral-500 text-sm mt-1">{project.address}, {project.city} • Contractor: {project.contractor_name || project.contractor_company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">Status</p>
                    <p className={`font-bold ${
                      project.status === 'Completed' ? 'text-emerald-600' : 
                      project.status === 'In Progress' ? 'text-blue-600' : 
                      'text-gold-600'
                    }`}>
                      {project.status}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-neutral-700">Overall Completion</span>
                    <span className="font-bold text-gold-600">{project.completion_percentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2.5">
                    <div className="bg-gold-500 h-2.5 rounded-full" style={{ width: `${project.completion_percentage}%` }}></div>
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
