import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { useProduct, useSaveProduct } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';

export default function ProductForm() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const isEditing = Boolean(id && id !== 'new');
  const saveProductMutation = useSaveProduct();
  const { data: existingProduct, isLoading: isProductLoading } = useProduct(isEditing ? id! : '');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    richDescription: '',
    pricingTiers: [{ id: Date.now().toString(), quantity: 1, price: '' as any, originalPrice: '' as any, duration_days: '' as any, label: '', badge: '', sort_order: 0 }],
    images: [] as string[],
    newImageUrl: '',
    orderSummaryItems: [
      { id: '1', name: 'Main Product (x1)', value: '', icon: '', sort_order: 1, is_bonus_item: false },
      { id: '2', name: 'Made For You Product / Sample', value: '', icon: '', sort_order: 2, is_bonus_item: false },
      { id: '3', name: 'Consultation Document', value: '', icon: '', sort_order: 3, is_bonus_item: false },
      { id: '4', name: 'Extended Support Voucher', value: '', icon: '', sort_order: 4, is_bonus_item: false }
    ],
    discountAmount: '' as number | string,
    ingredientsList: [] as any[],
    nutrition: [] as any[],
    faqs: [] as any[],
    reviews: [] as any[],
    reviews: [] as any[],
    rating: 5.0,
    reviewCount: 0,
    quantityOptions: [
      { label: 'Small Pets', packs: 1 },
      { label: 'Medium Pets', packs: 2 },
      { label: 'Large Pets', packs: 3, recommended: true }
    ],
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData(prev => ({
        ...prev,
        name: existingProduct.name || '',
        slug: existingProduct.slug || '',
        richDescription: existingProduct.rich_description || existingProduct.description || '',
        pricingTiers: existingProduct.variants?.map((v: any) => ({
          id: v.id || Date.now().toString() + Math.random(),
          quantity: v.quantity || 1,
          price: v.selling_price || '',
          originalPrice: v.mrp || '',
          duration_days: v.duration_days || '',
          label: v.label || '',
          badge: v.badge || '',
          sort_order: v.sort_order || 0
        })) || [],
        images: existingProduct.images?.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => img.image_url) || [],
        newImageUrl: '',
        orderSummaryItems: existingProduct.order_summary_items?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((item: any) => ({
          id: item.id || Date.now().toString() + Math.random(),
          name: item.name || '',
          value: item.value || '',
          icon: item.icon || '',
          sort_order: item.sort_order || 0,
          is_bonus_item: item.is_bonus_item || false
        })) || [],
        discountAmount: existingProduct.discount_amount || '',
        ingredientsList: existingProduct.ingredients?.sort((a: any, b: any) => a.display_order - b.display_order).map((ing: any) => ({
          id: ing.id || Date.now().toString() + Math.random(),
          name: ing.name || '',
          description: ing.description || '',
          photo: ing.image_url || ''
        })) || [],
        nutrition: existingProduct.nutrition?.map((n: any) => ({
          id: n.id || Date.now().toString() + Math.random(),
          nutrient: n.nutrient || '',
          ourValue: n.our_value || '',
          avgValue: n.avg_value || ''
        })) || [],
        faqs: existingProduct.faqs || [],
        reviews: existingProduct.reviews?.map((r: any) => ({
          id: r.id || Date.now().toString() + Math.random(),
          customerName: r.customer_name || '',
          rating: r.rating || 5,
          comment: r.comment || '',
          date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : ''
        })) || [],
        rating: existingProduct.overall_rating || 5.0,
        reviewCount: existingProduct.total_reviews_count || 0,
      }));
    }
  }, [existingProduct]);

  useEffect(() => {
    if (isEditing && id) {
      const fetchQuantities = async () => {
        try {
          const { data } = await supabase
            .from('settings')
            .select('value')
            .eq('key', `product_quantities_${id}`)
            .maybeSingle();
          if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
            setFormData(prev => ({ ...prev, quantityOptions: data.value as any[] }));
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchQuantities();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'name' && !isEditing) {
        next.slug = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return next;
    });
  };

  const handleRichText = (value: string) => {
    setFormData(prev => ({ ...prev, richDescription: value }));
  };

  // Generic List Handlers
  const addItem = (field: keyof typeof formData, defaultItem: any) => {
    setFormData(prev => {
      const currentList = prev[field] as any[];
      if (field === 'pricingTiers' && currentList.length >= 10) {
        toast.error('Maximum 10 pricing choices allowed.');
        return prev;
      }
      return {
        ...prev,
        [field]: [...currentList, { id: Date.now().toString(), ...defaultItem }]
      };
    });
  };

  const updateItem = (field: keyof typeof formData, index: number, itemField: string, value: any) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as any[])];
      newArray[index] = { ...newArray[index], [itemField]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const removeItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleAddImageUrl = () => {
    const url = formData.newImageUrl.trim();
    if (!url) return;
    
    // Validate image URL
    const img = new Image();
    img.onload = () => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url],
        newImageUrl: ''
      }));
      toast.success('Image added');
    };
    img.onerror = () => {
      toast.error('Invalid image URL or failed to load image');
    };
    img.src = url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Product Name and Slug are required');
      return;
    }
    
    try {
      const data = await saveProductMutation.mutateAsync({
        id: isEditing ? id : undefined,
        isEditing,
        product: {
          name: formData.name,
          slug: formData.slug,
          description: formData.richDescription,
          short_description: formData.richDescription.substring(0, 200),
          discount_amount: formData.discountAmount || 0,
          status: 'Active',
          overall_rating: formData.rating,
          total_reviews_count: formData.reviewCount
        },
        related: {
          variants: formData.pricingTiers,
          orderSummaryItems: formData.orderSummaryItems,
          images: formData.images,
          ingredients: formData.ingredientsList,
          nutrition: formData.nutrition,
          faqs: formData.faqs,
          reviews: formData.reviews,
          quantityOptions: formData.quantityOptions
        }
      });
      toast.success(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
      if (!isEditing && data) {
        setLocation(`/admin-panel-user/products/edit/${data}`);
      }
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation('/admin-panel-user/products')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#12333B]">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
            </div>
          </div>
          <button disabled={saveProductMutation.isPending} onClick={handleSubmit} className="h-10 px-6 bg-[#12333B] text-white rounded-full font-medium hover:bg-[#1a2115] flex items-center gap-2 disabled:opacity-50">
            {saveProductMutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />} 
            {saveProductMutation.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <form className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-8">
          
          {/* 1. Basic Info */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <h2 className="text-lg font-medium text-[#12333B] mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-11 px-4 bg-[#F8F9FA] border border-border/50 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full h-11 px-4 bg-[#F8F9FA] border border-border/50 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <div className="bg-white rounded-xl overflow-hidden border border-border/50">
                  <ReactQuill theme="snow" value={formData.richDescription} onChange={handleRichText} className="h-[200px] mb-12" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Pricing & Tiers */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#12333B]">Pricing & Tiers</h2>
              <button type="button" onClick={() => addItem('pricingTiers', { quantity: 1, price: '', originalPrice: '', duration_days: '', label: '', badge: '', sort_order: formData.pricingTiers.length })} className="text-sm font-medium text-blue-600 flex items-center gap-1 disabled:opacity-50" disabled={formData.pricingTiers.length >= 10}>
                <Plus size={16} /> Add Choice (Max 10)
              </button>
            </div>
            <div className="space-y-4">
              {formData.pricingTiers.map((tier, i) => (
                <div key={tier.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-20">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Quantity</label>
                    <input type="number" min="1" value={tier.quantity} onChange={e => updateItem('pricingTiers', i, 'quantity', e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full h-10 px-3 border rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Selling (₹)</label>
                    <input type="number" min="0" value={tier.price} onChange={e => updateItem('pricingTiers', i, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full h-10 px-3 border rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Original (₹)</label>
                    <input type="number" min="0" value={tier.originalPrice} onChange={e => updateItem('pricingTiers', i, 'originalPrice', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full h-10 px-3 border rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Days</label>
                    <input type="number" min="0" value={tier.duration_days} onChange={e => updateItem('pricingTiers', i, 'duration_days', e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full h-10 px-3 border rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Label</label>
                    <input type="text" placeholder="e.g. Most Popular" value={tier.label} onChange={e => updateItem('pricingTiers', i, 'label', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Badge</label>
                    <input type="text" placeholder="e.g. Save 15%" value={tier.badge} onChange={e => updateItem('pricingTiers', i, 'badge', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                  </div>
                  <button type="button" onClick={() => removeItem('pricingTiers', i)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Gallery Images */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <h2 className="text-lg font-medium text-[#12333B] mb-6">Gallery Images</h2>
            <div className="flex gap-2 mb-6">
              <input type="text" placeholder="Paste image URL here..." value={formData.newImageUrl} onChange={e => setFormData(prev => ({ ...prev, newImageUrl: e.target.value }))} className="flex-1 h-11 px-4 border rounded-xl" />
              <button type="button" onClick={handleAddImageUrl} className="h-11 px-4 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl">Add URL</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl border overflow-hidden group">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeItem('images', i)} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Order Summary / Value Breakdown */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-[#12333B]">Order Summary / Value Breakdown</h2>
                <p className="text-xs text-gray-500">Edit the line items shown in the summary box.</p>
              </div>
              <button type="button" onClick={() => addItem('orderSummaryItems', { name: '', value: '', icon: '', sort_order: formData.orderSummaryItems.length + 1, is_bonus_item: false })} className="text-sm font-medium text-blue-600 flex items-center gap-1">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="space-y-4 mb-4">
              {formData.orderSummaryItems.map((item, i) => (
                <div key={item.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Item Name</label>
                    <input type="text" value={item.name} onChange={e => updateItem('orderSummaryItems', i, 'name', e.target.value)} placeholder="e.g. Consultation Document" className="w-full h-10 px-3 border rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Icon (URL or Name)</label>
                    <input type="text" value={item.icon} onChange={e => updateItem('orderSummaryItems', i, 'icon', e.target.value)} placeholder="e.g. Gift" className="w-full h-10 px-3 border rounded-lg" />
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Value (₹)</label>
                    <input type="number" min="0" value={item.value} onChange={e => updateItem('orderSummaryItems', i, 'value', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full h-10 px-3 border rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                  <div className="w-32 flex items-center h-10 gap-2 px-2">
                    <input type="checkbox" checked={item.is_bonus_item} onChange={e => updateItem('orderSummaryItems', i, 'is_bonus_item', e.target.checked)} className="w-4 h-4 rounded text-blue-600" id={`bonus-${i}`} />
                    <label htmlFor={`bonus-${i}`} className="text-xs font-medium text-gray-700 cursor-pointer">Bonus Item</label>
                  </div>
                  <button type="button" onClick={() => removeItem('orderSummaryItems', i)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-center text-gray-700 font-medium">
                <span>Total Value:</span>
                <span>₹{formData.orderSummaryItems.reduce((sum, item) => sum + Number(item.value), 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-medium">Discount Amount (₹):</span>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.discountAmount} 
                    onChange={e => setFormData(prev => ({ ...prev, discountAmount: e.target.value === '' ? '' : parseFloat(e.target.value) }))} 
                    className="w-32 h-10 px-3 border border-green-200 rounded-lg text-right font-medium text-green-700 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
              </div>
              <div className="h-px bg-gray-200 w-full my-1"></div>
              <div className="flex justify-between items-center text-[#12333B] font-bold text-lg">
                <span>Final Payable Amount:</span>
                <span>₹{formData.orderSummaryItems.reduce((sum, item) => sum + Number(item.value || 0), 0) - Number(formData.discountAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* 5. Ingredients */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#12333B]">Premium Human-Grade Ingredients</h2>
              <button type="button" onClick={() => addItem('ingredientsList', { name: '', description: '', photo: '' })} className="text-sm font-medium text-blue-600 flex items-center gap-1">
                <Plus size={16} /> Add Ingredient
              </button>
            </div>
            <div className="space-y-4">
              {formData.ingredientsList.map((item, i) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4 relative">
                   <button type="button" onClick={() => removeItem('ingredientsList', i)} className="absolute top-4 right-4 text-red-500 p-1 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Ingredient Name</label>
                        <input type="text" value={item.name} onChange={e => updateItem('ingredientsList', i, 'name', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Photo URL</label>
                        <input type="text" value={item.photo} onChange={e => updateItem('ingredientsList', i, 'photo', e.target.value)} placeholder="Paste image link here" className="w-full h-10 px-3 border rounded-lg" />
                      </div>
                    </div>
                    {item.photo && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden border">
                        <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                    <textarea value={item.description} onChange={e => updateItem('ingredientsList', i, 'description', e.target.value)} className="w-full p-3 border rounded-lg min-h-[80px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Nutrition Profile */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#12333B]">Nutrition Profile</h2>
              <button type="button" onClick={() => addItem('nutrition', { nutrient: '', ourValue: '', avgValue: '' })} className="text-sm font-medium text-blue-600 flex items-center gap-1">
                <Plus size={16} /> Add Nutrient
              </button>
            </div>
            <div className="space-y-4">
              {formData.nutrition.map((item, i) => (
                <div key={item.id} className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nutrient Name</label>
                    <input type="text" value={item.nutrient} onChange={e => updateItem('nutrition', i, 'nutrient', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Our Brand</label>
                    <input type="text" value={item.ourValue} onChange={e => updateItem('nutrition', i, 'ourValue', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Avg Brand</label>
                    <input type="text" value={item.avgValue} onChange={e => updateItem('nutrition', i, 'avgValue', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                  </div>
                  <button type="button" onClick={() => removeItem('nutrition', i)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 7. FAQs */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#12333B]">FAQs</h2>
              <button type="button" onClick={() => addItem('faqs', { question: '', answer: '' })} className="text-sm font-medium text-blue-600 flex items-center gap-1">
                <Plus size={16} /> Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {formData.faqs.map((item, i) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                  <button type="button" onClick={() => removeItem('faqs', i)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded">
                    <Trash2 size={18} />
                  </button>
                  <div className="pr-10 space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Question</label>
                      <input type="text" value={item.question} onChange={e => updateItem('faqs', i, 'question', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Answer</label>
                      <textarea value={item.answer} onChange={e => updateItem('faqs', i, 'answer', e.target.value)} className="w-full p-3 border rounded-lg min-h-[80px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Manual Review Control */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-[#12333B]">Manual Reviews</h2>
              <button type="button" onClick={() => addItem('reviews', { customerName: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] })} className="text-sm font-medium text-blue-600 flex items-center gap-1">
                <Plus size={16} /> Add Review
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-[#F8F9FA] rounded-2xl border">
              <div>
                <label className="text-sm font-medium text-[#12333B] mb-2 block">Overall Display Rating (e.g. 4.9)</label>
                <input type="number" step="0.1" min="1" max="5" value={formData.rating || 5.0} onChange={e => setFormData(p => ({ ...p, rating: parseFloat(e.target.value) || 5.0 }))} className="w-full h-12 px-4 border rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#12333B] mb-2 block">Total Review Count (e.g. 3000 for 3k)</label>
                <input type="number" value={formData.reviewCount || 0} onChange={e => setFormData(p => ({ ...p, reviewCount: parseInt(e.target.value) || 0 }))} className="w-full h-12 px-4 border rounded-xl" />
              </div>
            </div>

            <div className="space-y-4">
              {formData.reviews.map((item, i) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                  <button type="button" onClick={() => removeItem('reviews', i)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded">
                    <Trash2 size={18} />
                  </button>
                  <div className="pr-10 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Reviewer Name</label>
                        <input type="text" value={item.customerName} onChange={e => updateItem('reviews', i, 'customerName', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                      </div>
                      <div className="w-32">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Rating (1-5)</label>
                        <input type="number" min="1" max="5" value={item.rating} onChange={e => updateItem('reviews', i, 'rating', parseFloat(e.target.value) || 5)} className="w-full h-10 px-3 border rounded-lg" />
                      </div>
                      <div className="w-40">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Date</label>
                        <input type="date" value={item.date} onChange={e => updateItem('reviews', i, 'date', e.target.value)} className="w-full h-10 px-3 border rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Review Content</label>
                      <textarea value={item.comment} onChange={e => updateItem('reviews', i, 'comment', e.target.value)} className="w-full p-3 border rounded-lg min-h-[80px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. Quantity Options (Protocols) */}
          <div className="bg-white rounded-3xl border border-border/60 p-7 shadow-sm mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-[#12333B]">Product Quantities (Protocols)</h2>
                <p className="text-xs text-gray-500">Configure the quantity options shown on the product page.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setFormData(prev => ({ ...prev, quantityOptions: [...prev.quantityOptions, { label: '', packs: 1 }] }))} 
                className="text-sm font-medium text-blue-600 flex items-center gap-1"
              >
                <Plus size={16} /> Add Option
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.quantityOptions.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Label (e.g. Small Pets)</label>
                    <input 
                      type="text" 
                      value={item.label} 
                      onChange={e => {
                        const newOpts = [...formData.quantityOptions];
                        newOpts[i] = { ...newOpts[i], label: e.target.value };
                        setFormData(prev => ({ ...prev, quantityOptions: newOpts }));
                      }} 
                      className="w-full h-10 px-3 border rounded-lg" 
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Packs</label>
                    <input 
                      type="number" 
                      min="1"
                      value={item.packs} 
                      onChange={e => {
                        const newOpts = [...formData.quantityOptions];
                        newOpts[i] = { ...newOpts[i], packs: parseInt(e.target.value) || 1 };
                        setFormData(prev => ({ ...prev, quantityOptions: newOpts }));
                      }} 
                      className="w-full h-10 px-3 border rounded-lg" 
                    />
                  </div>
                  <div className="w-32 flex items-center h-10 gap-2 px-2 mt-4">
                    <input 
                      type="checkbox" 
                      checked={item.recommended || false} 
                      onChange={e => {
                        const newOpts = formData.quantityOptions.map((opt: any, idx: number) => 
                          idx === i ? { ...opt, recommended: e.target.checked } : { ...opt, recommended: false }
                        );
                        setFormData(prev => ({ ...prev, quantityOptions: newOpts }));
                      }} 
                      className="w-4 h-4 rounded text-blue-600" 
                      id={`rec-${i}`} 
                    />
                    <label htmlFor={`rec-${i}`} className="text-xs font-medium text-gray-700 cursor-pointer">Recommended</label>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const newOpts = [...formData.quantityOptions];
                      newOpts.splice(i, 1);
                      setFormData(prev => ({ ...prev, quantityOptions: newOpts }));
                    }} 
                    className="w-10 h-10 mt-4 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
