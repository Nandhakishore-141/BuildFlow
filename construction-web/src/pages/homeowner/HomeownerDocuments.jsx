import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchBar } from '@/components/common/SearchBar';
import { FileText, FileSearch } from 'lucide-react';

export const HomeownerDocuments = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Documents & Contracts" 
        description="Access blueprints, permits, contracts, and receipts in one place."
      />

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search documents..." className="flex-1" />
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Categories</option>
              <option value="contracts">Contracts</option>
              <option value="blueprints">Blueprints</option>
              <option value="permits">Permits</option>
              <option value="receipts">Receipts</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border border-neutral-200 rounded-xl hover:border-gold-300 hover:shadow-sm cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-gold-50 group-hover:text-gold-600 mb-3 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-neutral-900 text-sm">Contract_v{i}.pdf</h4>
              <p className="text-xs text-neutral-500 mt-1">2.4 MB • Updated Oct {i + 1}</p>
            </div>
          ))}
        </div>

        <EmptyState 
          icon={FileSearch}
          title="No more documents"
          description="Your contractor has not uploaded any additional documents."
        />
      </SectionCard>
    </div>
  );
};
