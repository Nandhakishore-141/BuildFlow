import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Megaphone, Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import * as adminService from '@/services/adminService';

export const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Normal', target_role: 'Everyone' });

  const fetchData = async () => {
    try {
      const res = await adminService.getAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createAnnouncement(formData);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 'Normal', target_role: 'Everyone' });
      fetchData();
    } catch (err) { alert('Failed to create announcement'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Announcements" 
        description="Broadcast messages to platform users."
        action={<Button variant="primary" className="gap-2" onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4"/>New Broadcast</Button>}
      />
      <SectionCard>
        {isLoading ? <TablePlaceholder columns={4} rows={4} /> : announcements.length === 0 ? <EmptyState icon={Megaphone} title="No Announcements" description="Create a broadcast to notify your users." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b bg-neutral-50"><th className="p-4">Title</th><th className="p-4">Target Role</th><th className="p-4">Priority</th><th className="p-4">Date</th></tr></thead>
              <tbody className="divide-y">
                {announcements.map(a => (
                  <tr key={a.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold">{a.title}<br/><span className="text-sm font-normal text-neutral-500">{a.description}</span></td>
                    <td className="p-4 text-sm font-semibold">{a.target_role}</td>
                    <td className="p-4"><span className={`px-2 py-1 text-xs rounded-full ${a.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{a.priority}</span></td>
                    <td className="p-4 text-sm text-neutral-500">{new Date(a.publish_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Title</label><input required className="w-full px-4 py-2 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="block text-sm font-medium mb-1">Message</label><textarea required rows={3} className="w-full px-4 py-2 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Priority</label><select className="w-full px-4 py-2 border rounded-lg" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}><option>Low</option><option>Normal</option><option>High</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Target Audience</label><select className="w-full px-4 py-2 border rounded-lg" value={formData.target_role} onChange={e => setFormData({...formData, target_role: e.target.value})}><option>Everyone</option><option>Contractor</option><option>Homeowner</option><option>Worker</option></select></div>
          </div>
          <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button type="submit" variant="primary">Publish</Button></div>
        </form>
      </Modal>
    </div>
  );
};
