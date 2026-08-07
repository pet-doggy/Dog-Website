-- Migration: Add manual rating controls to products table

ALTER TABLE public.products
ADD COLUMN overall_rating numeric(3,1) DEFAULT 5.0,
ADD COLUMN total_reviews_count integer DEFAULT 0;

-- Update the existing products if any
UPDATE public.products
SET overall_rating = 5.0,
    total_reviews_count = 0
WHERE overall_rating IS NULL;

-- Add age_group and notes to feeding_guides
ALTER TABLE public.feeding_guides
ADD COLUMN age_group text,
ADD COLUMN notes text;
