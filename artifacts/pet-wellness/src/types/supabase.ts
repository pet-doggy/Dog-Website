export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image_url: string | null
          banner_url: string | null
          description: string | null
          display_order: number
          status: 'active' | 'inactive'
          seo_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['categories']['Row']>
        Update: Partial<Database['public']['Tables']['categories']['Row']>
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          brand: string | null
          short_description: string | null
          rich_description: string | null
          badges: string[]
          seo_title: string | null
          meta_description: string | null
          og_image_url: string | null
          overall_rating: number
          total_reviews_count: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['products']['Row']>
        Update: Partial<Database['public']['Tables']['products']['Row']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          weight: string
          mrp: number
          selling_price: number
          sku: string
          barcode: string | null
          stock_quantity: number
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['product_variants']['Row']>
        Update: Partial<Database['public']['Tables']['product_variants']['Row']>
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          display_order: number
          is_cover: boolean
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['product_images']['Row']>
        Update: Partial<Database['public']['Tables']['product_images']['Row']>
      }
      product_benefits: {
        Row: {
          id: string
          product_id: string
          icon_url: string | null
          title: string
          description: string | null
          display_order: number
        }
        Insert: Partial<Database['public']['Tables']['product_benefits']['Row']>
        Update: Partial<Database['public']['Tables']['product_benefits']['Row']>
      }
      product_ingredients: {
        Row: {
          id: string
          product_id: string
          image_url: string | null
          name: string
          description: string | null
          display_order: number
        }
        Insert: Partial<Database['public']['Tables']['product_ingredients']['Row']>
        Update: Partial<Database['public']['Tables']['product_ingredients']['Row']>
      }
      nutrition: {
        Row: {
          id: string
          product_id: string
          nutrient: string
          value: string
          display_order: number
        }
        Insert: Partial<Database['public']['Tables']['nutrition']['Row']>
        Update: Partial<Database['public']['Tables']['nutrition']['Row']>
      }
      feeding_guides: {
        Row: {
          id: string
          product_id: string
          pet_weight: string
          daily_quantity: string
          age_group: string | null
          notes: string | null
          display_order: number
        }
        Insert: Partial<Database['public']['Tables']['feeding_guides']['Row']>
        Update: Partial<Database['public']['Tables']['feeding_guides']['Row']>
      }
      faqs: {
        Row: {
          id: string
          product_id: string
          question: string
          answer: string
          display_order: number
        }
        Insert: Partial<Database['public']['Tables']['faqs']['Row']>
        Update: Partial<Database['public']['Tables']['faqs']['Row']>
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_name: string
          pet_name: string | null
          rating: number
          review_text: string | null
          image_url: string | null
          review_date: string
          is_verified: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['reviews']['Row']>
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          phone: string
          address: string
          city: string
          pin_code: string
          total_amount: number
          payment_status: 'pending' | 'paid' | 'failed'
          order_status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
          cashfree_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['orders']['Row']>
        Update: Partial<Database['public']['Tables']['orders']['Row']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          quantity: number
          price_at_time: number
        }
        Insert: Partial<Database['public']['Tables']['order_items']['Row']>
        Update: Partial<Database['public']['Tables']['order_items']['Row']>
      }
      abandoned_carts: {
        Row: {
          id: string
          customer_name: string
          phone: string
          product_id: string | null
          variant_id: string | null
          status: 'abandoned' | 'recovered'
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['abandoned_carts']['Row']>
        Update: Partial<Database['public']['Tables']['abandoned_carts']['Row']>
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['settings']['Row']>
        Update: Partial<Database['public']['Tables']['settings']['Row']>
      }
      trust_badges: {
        Row: {
          id: string
          icon_url: string
          title: string
          display_order: number
        }
        Insert: Partial<Database['public']['Tables']['trust_badges']['Row']>
        Update: Partial<Database['public']['Tables']['trust_badges']['Row']>
      }
    }
  }
}
