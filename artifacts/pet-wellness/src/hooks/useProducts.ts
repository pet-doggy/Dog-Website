import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          variants:product_variants(*),
          images:product_images(*)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          variants:product_variants(*),
          images:product_images(*),
          benefits:product_benefits(*),
          ingredients:product_ingredients(*),
          nutrition:nutrition(*),
          feeding_guides:feeding_guides(*),
          faqs:faqs(*),
          reviews:reviews(*),
          order_summary_items:order_summary_items(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug),
          variants:product_variants(*),
          images:product_images(*),
          benefits:product_benefits(*),
          ingredients:product_ingredients(*),
          nutrition:nutrition(*),
          feeding_guides:feeding_guides(*),
          faqs:faqs(*),
          reviews:reviews(*),
          order_summary_items:order_summary_items(*)
        `)
        .eq('slug', slug)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useSaveProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, isEditing, product, related }: { 
      id?: string, 
      isEditing: boolean, 
      product: any,
      related: any
    }) => {
      const payload = {
        product: { ...product, id },
        variants: related.variants?.map((v: any, i: number) => ({
          name: v.label || v.weight || v.name || `Tier ${i + 1}`,
          quantity: v.quantity,
          selling_price: v.price || v.selling_price || 0,
          original_price: v.originalPrice || v.mrp || 0,
          duration_days: v.duration_days,
          label: v.label,
          badge: v.badge,
          sort_order: v.sort_order || i
        })) || [],
        order_summary_items: related.orderSummaryItems?.map((item: any, i: number) => ({
          name: item.name,
          value: item.value,
          icon: item.icon,
          sort_order: item.sort_order || i,
          is_bonus_item: item.is_bonus_item
        })) || [],
        images: related.images?.map((url: string, i: number) => ({
          image_url: url,
          is_cover: i === 0,
          sort_order: i
        })) || [],
        ingredients: related.ingredients?.map((ing: any, i: number) => ({
          name: ing.name,
          description: ing.description,
          image_url: ing.image_url || ing.photo,
          sort_order: i
        })) || [],
        faqs: related.faqs?.map((faq: any, i: number) => ({
          question: faq.question,
          answer: faq.answer,
          sort_order: i
        })) || [],
        nutrition: related.nutrition?.map((nut: any, i: number) => ({
          nutrient: nut.nutrient || nut.name,
          our_value: nut.ourValue,
          avg_value: nut.avgValue,
          sort_order: i
        })) || [],
        reviews: related.reviews?.map((rev: any, i: number) => ({
          customer_name: rev.customer_name,
          pet_name: rev.pet_name,
          rating: rev.rating,
          review_text: rev.review_text,
          image_url: rev.image_url,
          is_verified: rev.is_verified
        })) || []
      };

      const { data, error } = await supabase.rpc('save_product_complete', { payload });
      if (error) throw error;
      const productId = data;

      // Update ratings separately since RPC doesn't handle them
      if (product.overall_rating !== undefined || product.total_reviews_count !== undefined) {
        await supabase.from('products').update({
          overall_rating: product.overall_rating,
          total_reviews_count: product.total_reviews_count
        }).eq('id', productId);
      }

      // Update quantity options in settings
      if (related.quantityOptions) {
        await supabase.from('settings').delete().eq('key', `product_quantities_${productId}`);
        if (related.quantityOptions.length > 0) {
          await supabase.from('settings').insert({
            key: `product_quantities_${productId}`,
            value: related.quantityOptions
          });
        }
      }
      
      return productId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
