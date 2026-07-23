import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/common/Button';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { GalleryPlaceholder } from '@/components/common/GalleryPlaceholder';

export const WorkerUploadProgress = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Upload Progress" 
        description="Submit photos of your completed work for supervisor review."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-12 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Take or Upload Photos</h3>
              <p className="text-sm text-neutral-500 mt-1 max-w-sm text-center">Supported formats: JPG, PNG, MP4. Max size: 25MB.</p>
              <Button variant="primary" className="mt-6 gap-2">
                <Upload className="w-4 h-4" />
                Select Files
              </Button>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Description of Work</label>
              <textarea 
                rows={3} 
                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                placeholder="E.g., Completed the first floor wiring..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <Button variant="primary">Submit Progress</Button>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-4">Recent Uploads</h2>
            <GalleryPlaceholder count={4} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
