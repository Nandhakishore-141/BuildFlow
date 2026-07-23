import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { SearchBar } from '@/components/common/SearchBar';
import { TablePlaceholder } from '@/components/common/TablePlaceholder';
import { Button } from '@/components/common/Button';
import { Package, Plus } from 'lucide-react';

export const ContractorMaterials = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Materials & Inventory" 
        description="Manage your construction materials, stock levels, and suppliers."
        action={
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Request Material
          </Button>
        }
      />

      <SectionCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar placeholder="Search inventory..." className="flex-1" />
          <div className="flex gap-2">
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">All Categories</option>
              <option value="cement">Cement</option>
              <option value="steel">Steel</option>
              <option value="wood">Wood</option>
              <option value="tools">Tools</option>
            </select>
            <select className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500">
              <option value="">Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock Warning</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Highlight Low Stock logic placeholder */}
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <Package className="w-5 h-5" />
            <span className="text-sm font-semibold">Low Stock Alert: Portland Cement is critically low.</span>
          </div>
          <Button variant="outline" size="sm" className="bg-white">Reorder Now</Button>
        </div>

        <TablePlaceholder columns={5} rows={7} />
      </SectionCard>
    </div>
  );
};
