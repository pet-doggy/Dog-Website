import React, { useState, useEffect } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Database } from '@/types/supabase';

type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export default function CategoryForm() {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Partial<CategoryInsert>>({
    name: '',
    slug: '',
    image_url: '',
    banner_url: '',
    description: '',
    display_order: 1,
    status: 'active',
    seo_title: '',
    meta_description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && id && categories) {
      const existing = categories.find(c => c.id === id);
      if (existing) {
        setFormData({
          name: existing.name,
          slug: existing.slug,
          image_url: existing.image_url,
          banner_url: existing.banner_url,
          description: existing.description,
          display_order: existing.display_order,
          status: existing.status,
          seo_title: existing.seo_title,
          meta_description: existing.meta_description
        });
      }
    } else if (!isEditing && categories) {
       setFormData(prev => ({...prev, display_order: categories.length + 1}));
    }
  }, [id, isEditing, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: name === 'display_order' ? parseInt(value) || 0 : value };
      if (name === 'name' && !isEditing) {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    setIsSaving(true);
    try {
      if (isEditing && id) {
        await updateCategory.mutateAsync({ id, ...formData });
      } else {
        await createCategory.mutateAsync(formData as CategoryInsert);
      }
      setLocation('/admin-pet/categories');
    } catch (err) {
      console.error(err);
      alert('Error saving category');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingCategories && isEditing) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#12333B]" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => setLocation('/admin-pet/categories')} className="p-2 bg-white rounded-xl border border-border/50 hover:bg-[#F7F5F2] transition-colors">
          <ArrowLeft size={20} className="text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-serif text-[#12333B]">{isEditing ? 'Edit Category' : 'New Category'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-border/50 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-medium border-b border-border/50 pb-4">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#12333B]">Category Name *</label>
              <input 
                required
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#12333B]">Slug *</label>
              <input 
                required
                name="slug"
                value={formData.slug || ''}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#12333B]">Short Description</label>
            <textarea 
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full p-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#12333B]">Thumbnail Image URL</label>
              <input 
                type="url"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm"
              />
              {formData.image_url && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-border/50">
                   <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#12333B]">Banner Image URL</label>
              <input 
                type="url"
                name="banner_url"
                value={formData.banner_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm"
              />
               {formData.banner_url && (
                <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-border/50">
                   <img src={formData.banner_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-medium text-[#12333B]">Status</label>
              <select 
                name="status"
                value={formData.status || 'active'}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#12333B]">Display Order</label>
              <input 
                type="number"
                name="display_order"
                value={formData.display_order || 0}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/50 p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-medium border-b border-border/50 pb-4">SEO Details</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#12333B]">SEO Title</label>
            <input 
              name="seo_title"
              value={formData.seo_title || ''}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#12333B]">Meta Description</label>
            <textarea 
              name="meta_description"
              value={formData.meta_description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full p-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] outline-none text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-[#12333B] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#1a2015] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
