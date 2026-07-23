import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { FileText, Download, AlertCircle } from 'lucide-react';
import * as documentService from '@/services/documentService';

export const HomeownerDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await documentService.getDocuments();
        setDocuments(res.data?.documents || []);
      } catch (err) {
        if (err.response && err.response.status === 404) setError('404');
        else setError('Failed to load documents.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Documents" 
        description="Access contracts, permits, and blueprints."
      />

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={3} rows={4} />
        ) : error === '404' ? (
          <EmptyState 
            icon={AlertCircle}
            title="Feature Not Yet Connected"
            description="The backend endpoint for Documents (/api/documents) is not yet implemented."
          />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : documents.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No documents available"
            description="Your contractor has not uploaded any documents."
          />
        ) : (
          <div>{/* Render real documents here */}</div>
        )}
      </SectionCard>
    </div>
  );
};
