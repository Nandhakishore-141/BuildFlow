import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { ErrorState } from '@/components/common/ErrorState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Megaphone, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import * as adminService from '@/services/adminService';

const AdminAnnouncementsContent = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Normal', target_role: 'Everyone' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setError(err.response?.data?.message || 'Failed to load system announcements.');
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchAnnouncements(); 
  }, [fetchAnnouncements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminService.createAnnouncement(formData);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 'Normal', target_role: 'Everyone' });
      fetchAnnouncements();
    } catch (err) { 
      alert(err.response?.data?.message || 'Failed to publish announcement'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Announcements" 
        description="Broadcast platform notice messages and safety mandates to users."
        action={
          <Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4"/>
            New Broadcast
          </Button>
        }
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={4} rows={4} />
        ) : error ? (
          <ErrorState title="Unable to load announcements" description={error} onRetry={fetchAnnouncements} />
        ) : announcements.length === 0 ? (
          <EmptyState icon={Megaphone} title="No Announcements" description="Create a broadcast message to notify contractors, homeowners, or workers." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-neutral-600 font-medium">
                  <th className="p-4">Title & Message</th>
                  <th className="p-4">Target Audience</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Published Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {announcements.map(a => (
                  <tr key={a.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-neutral-900 block">{a.title}</span>
                      <span className="text-xs text-neutral-600 leading-relaxed block mt-0.5 max-w-xl">{a.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {a.target_role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getPriorityBadgeClass(a.priority)}`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="p-4 text-right text-xs text-neutral-500">
                      {a.publish_date ? new Date(a.publish_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Platform Broadcast">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Announcement Title</label>
            <input 
              required 
              type="text"
              placeholder="e.g. Site Safety & Helmet Mandate"
              className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Message Details</label>
            <textarea 
              required 
              rows={3} 
              placeholder="Detailed description or instructions..."
              className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Priority</label>
              <select 
                className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Target Audience</label>
              <select 
                className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500" 
                value={formData.target_role} 
                onChange={e => setFormData({...formData, target_role: e.target.value})}
              >
                <option value="Everyone">Everyone</option>
                <option value="Contractor">Contractor</option>
                <option value="Homeowner">Homeowner</option>
                <option value="Worker">Worker</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const AdminAnnouncements = () => (
  <ErrorBoundary>
    <AdminAnnouncementsContent />
  </ErrorBoundary>
);
