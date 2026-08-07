import React, { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { Link } from 'wouter';
import { Plus, Edit2, Trash2, Search, Loader2, Package } from 'lucide-react';

export default function ProductList() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct.mutateAsync(productToDelete);
      } catch (err) {
        alert('Failed to delete product');
      } finally {
        setProductToDelete(null);
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
          <h1 className="text-3xl font-serif text-[#12333B] tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your storefront's product catalog</p>
        </div>
        <Link href="/admin-panel-user/products/new">
          <button className="bg-[#12333B] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#12333B] transition-all duration-300 text-sm font-medium shadow-md shadow-[#12333B]/10 hover:shadow-lg hover:-translate-y-0.5">
            <Plus size={18} />
            Add Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-border/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-sm">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input 
              type="text" 
              placeholder="Search by product name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] border border-border/50 rounded-xl outline-none text-sm focus:border-[#12333B]/30 focus:ring-4 focus:ring-[#12333B]/5 transition-all"
            />
          </div>
          <div className="text-sm font-medium text-muted-foreground bg-[#F8F9FA] px-3 py-1.5 rounded-lg border border-border/50">
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F8F9FA]/80 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                <th className="px-6 py-4 border-b border-border/60">Product</th>
                <th className="px-6 py-4 border-b border-border/60">Price</th>
                <th className="px-6 py-4 border-b border-border/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-[#F8F9FA] rounded-full flex items-center justify-center text-muted-foreground/50">
                        <Package size={24} />
                      </div>
                      <div className="text-lg font-medium text-[#12333B]">No products found</div>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        {searchTerm ? "We couldn't find anything matching your search." : "You haven't added any products yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const coverImage = product.images?.find((img: any) => img.is_cover) || product.images?.[0];
                  const firstVariant = product.variants?.[0];

                  return (
                    <tr key={product.id} className="hover:bg-[#F8F9FA]/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {coverImage ? (
                            <div className="w-12 h-12 rounded-xl bg-[#F7F5F2] overflow-hidden border border-border/50 shadow-sm flex-shrink-0">
                              <img src={coverImage.image_url} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground/30 flex-shrink-0">
                              <Package size={20} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-[#12333B] text-base">{product.name}</div>
                            <div className="text-xs text-muted-foreground truncate w-48 xl:w-64">{product.short_description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#12333B]">
                          {firstVariant ? `₹${firstVariant.selling_price}` : <span className="text-muted-foreground font-normal">Not set</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin-panel-user/products/edit/${product.id}`}>
                            <button className="p-2 text-muted-foreground hover:text-[#12333B] hover:bg-[#12333B]/10 transition-colors rounded-lg tooltip-trigger" title="Edit Product">
                              <Edit2 size={18} />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg tooltip-trigger" title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Are you absolutely sure you want to delete this product? This action cannot be undone and will permanently remove it from your catalog.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50/80 flex items-center justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm hover:shadow transition-all"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
