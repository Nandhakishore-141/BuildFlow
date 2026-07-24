import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Receipt } from 'lucide-react';
import * as expenseService from '@/services/expenseService';
import * as projectService from '@/services/projectService';

export const HomeownerExpenses = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [data, setData] = useState(null);
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
    
    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await expenseService.getHomeownerExpenses(selectedProjectId);
        setData(res.data || null);
      } catch (err) {
        setError('Failed to load financials.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Financials" 
          description="Review invoices and budget summaries provided by your contractor."
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

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-semibold text-neutral-500 mb-1">Total Budget</p>
            <p className="text-3xl font-black text-neutral-900">${data.budget?.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-semibold text-neutral-500 mb-1">Total Spent</p>
            <p className="text-3xl font-black text-red-600">${data.spent?.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col justify-center">
            <p className="text-sm font-semibold text-neutral-500 mb-1">Remaining Budget</p>
            <p className="text-3xl font-black text-emerald-600">${data.remaining?.toLocaleString()}</p>
          </div>
        </div>
      )}

      <SectionCard>
        {isLoading ? (
          <TablePlaceholder columns={4} rows={5} />
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-medium">{error}</div>
        ) : projects.length === 0 ? (
          <EmptyState 
            icon={Receipt}
            title="No projects yet"
            description="You need an active project to view financials."
          />
        ) : !data?.transactions?.length ? (
          <EmptyState 
            icon={Receipt}
            title="No expenses found"
            description="No transactions have been logged for this project yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold">
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Description</th>
                  <th className="pb-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-4 text-neutral-600 font-medium">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="py-4 px-4 text-neutral-900 font-semibold">{tx.category}</td>
                    <td className="py-4 px-4 text-neutral-500">{tx.description}</td>
                    <td className="py-4 px-4 text-right font-bold text-neutral-900">${parseFloat(tx.amount).toLocaleString()}</td>
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
