import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { FileText, Download } from 'lucide-react';
import * as documentService from '@/services/documentService';
import * as projectService from '@/services/projectService';

export const HomeownerDocuments = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [documents, setDocuments] = useState([]);
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
    
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await documentService.getHomeownerDocuments(selectedProjectId);
        setDocuments(res.data || []);
      } catch (err) {
        setError('Failed to load documents.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Documents" 
          description="Access contracts, permits, and blueprints."
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
          <TablePlaceholder columns={3} rows={4} />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No projects yet"
            description="You need an active project to view documents."
          />
        ) : documents.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No documents available"
            description="Your contractor has not uploaded any documents."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold">
                  <th className="pb-3 px-4">Title</th>
                  <th className="pb-3 px-4">Type</th>
                  <th className="pb-3 px-4">Uploaded By</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4 text-neutral-900 font-semibold">{doc.title}</td>
                    <td className="py-4 px-4 text-neutral-500">
                      <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-bold border border-neutral-200">
                        {doc.file_type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-500">{doc.uploader_name}</td>
                    <td className="py-4 px-4 text-neutral-600 font-medium">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-right">
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-gold-600 hover:text-gold-700 font-bold transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
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
