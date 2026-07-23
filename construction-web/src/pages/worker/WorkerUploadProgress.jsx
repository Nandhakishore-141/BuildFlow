import { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import * as progressService from '@/services/progressService';

export const WorkerUploadProgress = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await progressService.createProgress({ file, description, projectId });
      setSuccess(true);
    } catch (err) {
      if (err.response && err.response.status === 404) setError('404');
      else setError('Failed to upload progress.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Upload Progress" 
        description="Submit photos and updates for your current tasks."
      />

      <SectionCard>
        {error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Progress Uploads (POST /api/progress) is not yet implemented."
          />
        ) : success ? (
          <EmptyState 
            icon={Upload}
            title="Upload Successful"
            description="Your progress update has been sent to the contractor."
          />
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Select Project</label>
              <select 
                required
                value={projectId} 
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Choose a project...</option>
                <option value="1">Downtown Skyscraper</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Photo Upload</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:bg-neutral-50 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-900">Click to upload or drag and drop</p>
                <p className="text-xs text-neutral-500 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description / Notes</label>
              <textarea 
                required
                rows="4"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what was completed..."
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500"
              ></textarea>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button variant="primary" type="submit" disabled={isSubmitting} className="w-full justify-center">
              {isSubmitting ? 'Uploading...' : 'Submit Progress Update'}
            </Button>
          </form>
        )}
      </SectionCard>
    </div>
  );
};
