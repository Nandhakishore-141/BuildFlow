import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TimelinePlaceholder } from '@/components/common/TimelinePlaceholder';
import { Camera, AlertCircle } from 'lucide-react';
import * as progressService from '@/services/progressService';
import * as projectService from '@/services/projectService';

export const HomeownerProgress = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getHomeownerProjects();
        const projectList = res.data.data || [];
        setProjects(projectList);
        if (projectList.length > 0) {
          setSelectedProjectId(projectList[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setError('Failed to load projects.');
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    
    const fetchProgress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await progressService.getHomeownerProgress(selectedProjectId);
        setData(res.data || []);
      } catch (err) {
        setError('Failed to load progress tracking.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Live Progress" 
          description="View live photos and timeline updates from your contractor."
        />
        {projects.length > 0 && (
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full sm:w-auto h-10 px-4 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 font-semibold shadow-sm"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.project_name}</option>
            ))}
          </select>
        )}
      </div>

      <SectionCard>
        {isLoading ? (
          <TimelinePlaceholder steps={4} />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={Camera}
            title="No projects yet"
            description="You need an active project to track progress."
          />
        ) : data.length === 0 ? (
          <EmptyState 
            icon={Camera}
            title="No updates yet"
            description="Your contractor has not uploaded any progress photos or timeline updates."
          />
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
            {data.map((update, idx) => (
              <div key={update.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gold-100 text-gold-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                  <Camera className="w-4 h-4" />
                </div>
                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-neutral-900">{update.uploader_name}</span>
                    <span className="text-xs font-semibold text-neutral-500">{new Date(update.created_at).toLocaleString()}</span>
                  </div>
                  {update.description && <p className="text-sm text-neutral-600 mb-3">{update.description}</p>}
                  {update.file_url && update.file_type === 'Photo' && (
                    <img src={update.file_url} alt="Progress update" className="w-full rounded-lg object-cover max-h-48" />
                  )}
                  {update.file_url && update.file_type === 'Video' && (
                    <video src={update.file_url} controls className="w-full rounded-lg max-h-48" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
