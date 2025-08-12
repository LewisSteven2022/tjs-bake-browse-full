-- Category Management Migration Script
-- Run this in your Supabase SQL editor to enable full category management

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Baked Goods', 'baked_goods', 'Freshly baked breads, pastries, and desserts'),
  ('Groceries', 'groceries', 'General grocery items and ingredients')
ON CONFLICT (slug) DO NOTHING;

-- 3. Add category_id column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id);

-- 4. Migrate existing category data
UPDATE public.products 
SET category_id = c.id
FROM public.categories c
WHERE products.category = c.slug;

-- 5. Make category_id not null after migration (optional - uncomment if you want to enforce this)
-- ALTER TABLE public.products ALTER COLUMN category_id SET NOT NULL;

-- 6. Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 7. Create policy for categories (read-only for now)
CREATE POLICY IF NOT EXISTS categories_read ON public.categories FOR SELECT USING (true);

-- 8. Verify migration
SELECT 
  'Categories table created' as status,
  COUNT(*) as category_count
FROM public.categories;

SELECT 
  'Products with categories' as status,
  COUNT(*) as product_count
FROM public.products 
WHERE category_id IS NOT NULL;

SELECT 
  'Products without categories' as status,
  COUNT(*) as product_count
FROM public.products 
WHERE category_id IS NULL;
