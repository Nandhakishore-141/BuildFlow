import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { Camera, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as workerService from '@/services/workerService';
import * as projectService from '@/services/projectService';

export const WorkerUploadProgress = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getProjects({ limit: 50 });
        const rawProjects = res.data?.data?.data || res.data?.data || res.data || [];
        const list = Array.isArray(rawProjects) ? rawProjects : (Array.isArray(rawProjects?.data) ? rawProjects.data : []);
        setProjects(list);
        if (list.length > 0) setProjectId(list[0].id);
      } catch (err) {
        console.error("Failed to load assigned projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectId) {
      setError('Please select a project site.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await workerService.createProgress({
        project_id: projectId,
        description,
        file_url: fileUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800',
        file_type: 'Photo'
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload progress update.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader 
        title="Upload Work Progress" 
        description="Submit site photos, videos, and completion logs for contractor approval."
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/worker/dashboard')} className="gap-2 text-xs font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        }
      />

      <SectionCard>
        {success ? (
          <EmptyState 
            icon={CheckCircle2}
            title="Upload Successful!"
            description="Your work progress update and photos have been submitted for your contractor and homeowner to view."
            action={
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setSuccess(false); setDescription(''); setFileUrl(''); }}>
                  Upload Another Update
                </Button>
                <Button variant="primary" onClick={() => navigate('/worker/dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            }
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Select Building Site</label>
              <select 
                required
                value={projectId} 
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 font-medium text-sm"
              >
                <option value="">Choose an assigned project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.project_name} ({p.project_code}) - {p.city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Site Progress Photo / Media URL</label>
              <input 
                type="url"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7"
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium"
              />
              <p className="text-[11px] text-neutral-400 mt-1">If left blank, a default site progress capture will be generated.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Description / Work Notes</label>
              <textarea 
                required
                rows="4"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what work was completed today, materials installed, or current site status..."
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-gold-500 text-sm font-medium"
              ></textarea>
            </div>

            {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

            <Button variant="primary" type="submit" disabled={isSubmitting} className="w-full justify-center font-bold bg-gold-600 hover:bg-gold-700 text-white">
              {isSubmitting ? 'Uploading Work Update...' : 'Submit Progress Update'}
            </Button>
          </form>
        )}
      </SectionCard>
    </div>
  );
};
