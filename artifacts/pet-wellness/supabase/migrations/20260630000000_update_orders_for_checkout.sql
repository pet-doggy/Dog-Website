-- Migration: Update orders and abandoned_carts for the new checkout flow

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS state TEXT;

ALTER TABLE public.abandoned_carts
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
