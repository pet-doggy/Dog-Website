CREATE OR REPLACE FUNCTION save_product_complete(payload jsonb)
RETURNS uuid
SECURITY DEFINER
AS $$
DECLARE
    v_product_id uuid;
    v_product_data jsonb;
BEGIN
    -- Extract product data
    v_product_data := payload->'product';
    
    -- Insert or Update Main Product
    IF (v_product_data->>'id') IS NULL THEN
        INSERT INTO products (
            name, slug, rich_description, short_description, status, category_id, discount_amount
        ) VALUES (
            v_product_data->>'name',
            v_product_data->>'slug',
            v_product_data->>'description',
            v_product_data->>'short_description',
            COALESCE(v_product_data->>'status', 'Draft'),
            NULLIF(v_product_data->>'category_id', '')::uuid,
            COALESCE((v_product_data->>'discount_amount')::decimal, 0)
        ) RETURNING id INTO v_product_id;
    ELSE
        v_product_id := (v_product_data->>'id')::uuid;
        UPDATE products SET
            name = v_product_data->>'name',
            slug = v_product_data->>'slug',
            rich_description = v_product_data->>'description',
            short_description = v_product_data->>'short_description',
            status = COALESCE(v_product_data->>'status', 'Draft'),
            category_id = NULLIF(v_product_data->>'category_id', '')::uuid,
            discount_amount = COALESCE((v_product_data->>'discount_amount')::decimal, 0),
            updated_at = now()
        WHERE id = v_product_id;
    END IF;

    -- Clear existing relations (this allows a simple replace-all strategy for the form)
    DELETE FROM product_variants WHERE product_id = v_product_id;
    DELETE FROM order_summary_items WHERE product_id = v_product_id;
    DELETE FROM product_images WHERE product_id = v_product_id;
    DELETE FROM product_ingredients WHERE product_id = v_product_id;
    DELETE FROM faqs WHERE product_id = v_product_id;
    DELETE FROM nutrition WHERE product_id = v_product_id;
    DELETE FROM reviews WHERE product_id = v_product_id;
    
    -- Insert Variants (Pricing Tiers)
    IF payload ? 'variants' THEN
        INSERT INTO product_variants (product_id, weight, quantity, selling_price, mrp, sort_order, duration_days, label, badge, sku)
        SELECT 
            v_product_id,
            v->>'name',
            COALESCE((v->>'quantity')::integer, 1),
            COALESCE((v->>'selling_price')::decimal, 0),
            COALESCE((v->>'original_price')::decimal, 0),
            COALESCE((v->>'sort_order')::integer, 0),
            (v->>'duration_days')::integer,
            v->>'label',
            v->>'badge',
            v_product_id::text || '-' || COALESCE((v->>'sort_order')::text, '0') -- generate dummy sku to satisfy NOT NULL constraint
        FROM jsonb_array_elements(payload->'variants') AS v;
    END IF;

    -- Insert Order Summary Items
    IF payload ? 'order_summary_items' THEN
        INSERT INTO order_summary_items (product_id, name, value, icon, sort_order, is_bonus_item)
        SELECT 
            v_product_id,
            v->>'name',
            COALESCE((v->>'value')::decimal, 0),
            v->>'icon',
            COALESCE((v->>'sort_order')::integer, 0),
            COALESCE((v->>'is_bonus_item')::boolean, false)
        FROM jsonb_array_elements(payload->'order_summary_items') AS v;
    END IF;
    
    -- Insert Images
    IF payload ? 'images' THEN
        INSERT INTO product_images (product_id, image_url, is_cover, display_order)
        SELECT 
            v_product_id,
            v->>'image_url',
            COALESCE((v->>'is_cover')::boolean, false),
            COALESCE((v->>'sort_order')::integer, 0)
        FROM jsonb_array_elements(payload->'images') AS v;
    END IF;
    
    -- Insert Ingredients
    IF payload ? 'ingredients' THEN
        INSERT INTO product_ingredients (product_id, name, description, image_url, display_order)
        SELECT 
            v_product_id,
            v->>'name',
            v->>'description',
            v->>'image_url',
            COALESCE((v->>'sort_order')::integer, 0)
        FROM jsonb_array_elements(payload->'ingredients') AS v;
    END IF;

    -- Insert FAQs
    IF payload ? 'faqs' THEN
        INSERT INTO faqs (product_id, question, answer, display_order)
        SELECT 
            v_product_id,
            v->>'question',
            v->>'answer',
            COALESCE((v->>'sort_order')::integer, 0)
        FROM jsonb_array_elements(payload->'faqs') AS v;
    END IF;

    -- Insert Nutrition
    IF payload ? 'nutrition' THEN
        INSERT INTO nutrition (product_id, nutrient, our_value, avg_value, display_order)
        SELECT 
            v_product_id,
            v->>'nutrient',
            v->>'our_value',
            v->>'avg_value',
            COALESCE((v->>'sort_order')::integer, 0)
        FROM jsonb_array_elements(payload->'nutrition') AS v;
    END IF;

    -- Insert Reviews
    IF payload ? 'reviews' THEN
        INSERT INTO reviews (product_id, customer_name, pet_name, rating, review_text, image_url, is_verified)
        SELECT 
            v_product_id,
            v->>'customer_name',
            v->>'pet_name',
            COALESCE((v->>'rating')::integer, 5),
            v->>'review_text',
            v->>'image_url',
            COALESCE((v->>'is_verified')::boolean, false)
        FROM jsonb_array_elements(payload->'reviews') AS v;
    END IF;

    -- Reload schema cache to fix any pending cache issues
    NOTIFY pgrst, 'reload schema';

    RETURN v_product_id;
END;
$$ LANGUAGE plpgsql;
