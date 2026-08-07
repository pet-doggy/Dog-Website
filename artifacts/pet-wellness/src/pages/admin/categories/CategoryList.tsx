import React, { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { Link } from 'wouter';
import { Plus, Edit2, Trash2, Search, Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoryList() {
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory.mutateAsync(id);
        toast.success('Category deleted successfully');
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#12333B]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#12333B]">Categories</h1>
          <p className="text-muted-foreground text-sm">Manage your product categories</p>
        </div>
        <Link href="/admin-pet/categories/new">
          <button className="bg-[#12333B] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#1a2015] transition-colors text-sm font-medium">
            <Plus size={16} />
            Add Category
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center gap-2 bg-[#F8F9FA]">
          <Search size={18} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8F9FA] text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium border-b border-border/50">Image</th>
                <th className="px-6 py-4 font-medium border-b border-border/50">Category Details</th>
                <th className="px-6 py-4 font-medium border-b border-border/50">Products</th>
                <th className="px-6 py-4 font-medium border-b border-border/50">Status</th>
                <th className="px-6 py-4 font-medium border-b border-border/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#F8F9FA]/50 transition-colors">
                    <td className="px-6 py-4">
                      {category.image_url ? (
                        <div className="w-12 h-12 rounded-xl bg-[#F7F5F2] overflow-hidden border border-border/50">
                          <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#F7F5F2] border border-dashed border-border/50 flex items-center justify-center text-muted-foreground">
                          <Package size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#12333B]">{category.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">/{category.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Package size={14} />
                        <span>{(category as any).product_count || 0} items</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium inline-block w-fit ${
                          category.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {category.status}
                        </span>
                        <span className="text-xs text-muted-foreground">Order: {category.display_order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin-pet/categories/edit/${category.id}`}>
                          <button className="p-2 text-muted-foreground hover:text-[#12333B] transition-colors rounded-lg hover:bg-[#F7F5F2]">
                            <Edit2 size={16} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-muted-foreground hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
