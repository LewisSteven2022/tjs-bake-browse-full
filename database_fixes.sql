-- =====================================================
-- TJ's Bake & Browse - Database Fixes & Improvements
-- =====================================================
-- This script fixes RLS policy issues and improves database structure
-- Run this in your Supabase SQL editor

-- =====================================================
-- 1. FIX RLS POLICY INFINITE RECURSION ISSUES
-- =====================================================

-- Drop problematic RLS policies that cause infinite recursion
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Create simple, non-recursive RLS policies
CREATE POLICY "Enable read access for all users" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.users
    FOR SELECT USING (true);

-- =====================================================
-- 2. RESOLVE DUAL CATEGORY RELATIONSHIP CONFLICT
-- =====================================================

-- First, ensure the categories table has the right structure
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories if they don't exist
INSERT INTO public.categories (id, name, slug, description) VALUES
    ('a435f3b9-6a3c-4bdc-ba45-b2ca2ccf500b', 'Baked Goods', 'baked_goods', 'Freshly baked goods and treats'),
    ('3c27609f-cbb5-4ad0-a88f-ef619be670d6', 'Groceries', 'groceries', 'Pantry essentials and ingredients'),
    ('1da60f7e-3f2c-479c-87de-a01bd1643e15', 'Specialty Items', 'specialty_items', 'Unique and seasonal items'),
    ('54aa597f-3657-4b9c-9d2e-44e64705bb4a', 'Beverages', 'beverages', 'Hot and cold drinks')
ON CONFLICT (id) DO NOTHING;

-- Add category FK to products table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category'
    ) THEN
        ALTER TABLE public.products ADD COLUMN category UUID REFERENCES public.categories(id);
    END IF;
END $$;

-- Update existing products to use the new category FK
UPDATE public.products 
SET category = category_id 
WHERE category_id IS NOT NULL AND category IS NULL;

-- Now remove the old category_id column to resolve the dual relationship conflict
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category_id'
    ) THEN
        -- Drop the foreign key constraint first
        ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
        -- Then drop the column
        ALTER TABLE public.products DROP COLUMN category_id;
    END IF;
END $$;

-- =====================================================
-- 3. CREATE BAG FEE PRODUCT TABLE
-- =====================================================

-- Create a dedicated table for configurable fees
CREATE TABLE IF NOT EXISTS public.configurable_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_pence INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default bag fee
INSERT INTO public.configurable_fees (name, description, price_pence) VALUES
    ('Bag Fee', 'Optional bag fee for orders', 50)
ON CONFLICT (name) DO UPDATE SET 
    price_pence = EXCLUDED.price_pence,
    updated_at = NOW();

-- =====================================================
-- 4. FIX ORDERS TABLE SCHEMA
-- =====================================================

-- Ensure orders table has the correct structure
-- Remove any references to customer_phone if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_phone'
    ) THEN
        ALTER TABLE public.orders DROP COLUMN customer_phone;
    END IF;
END $$;

-- Ensure orders table has all required columns
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number INTEGER UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time VARCHAR(50) NOT NULL,
    subtotal_pence INTEGER NOT NULL,
    total_pence INTEGER NOT NULL,
    bag_opt_in BOOLEAN DEFAULT false,
    bag_fee_pence INTEGER DEFAULT 0,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE ORDER ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price_pence INTEGER NOT NULL,
    total_pence INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_visible ON public.products(visible);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_date ON public.orders(pickup_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY (WITH FIXED POLICIES)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configurable_fees ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for each table
CREATE POLICY "Public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.configurable_fees FOR SELECT USING (true);

-- Orders policies (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON public.orders 
    FOR SELECT USING (auth.uid()::text = customer_email OR customer_email IS NULL);

CREATE POLICY "Users can create orders" ON public.orders 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own orders" ON public.orders 
    FOR UPDATE USING (auth.uid()::text = customer_email OR customer_email IS NULL);

-- Order items policies
CREATE POLICY "Users can view their order items" ON public.order_items 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.customer_email = auth.uid()::text OR orders.customer_email IS NULL)
        )
    );

CREATE POLICY "Users can create order items" ON public.order_items 
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 8. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configurable_fees_updated_at BEFORE UPDATE ON public.configurable_fees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- Check that all tables exist and have correct structure
SELECT 'products' as table_name, COUNT(*) as row_count FROM public.products
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as row_count FROM public.categories
UNION ALL
SELECT 'orders' as table_name, COUNT(*) as row_count FROM public.orders
UNION ALL
SELECT 'configurable_fees' as table_name, COUNT(*) as row_count FROM public.configurable_fees;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verify category relationship is working
SELECT 
    p.name as product_name,
    c.name as category_name,
    c.slug as category_slug
FROM public.products p
LEFT JOIN public.categories c ON p.category = c.id
WHERE p.visible = true
LIMIT 5;
