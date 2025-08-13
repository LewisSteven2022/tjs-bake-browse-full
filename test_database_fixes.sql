-- =====================================================
-- Test Database Fixes - Run this after database_fixes.sql
-- =====================================================

-- Test 1: Check if RLS policies are working
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test 2: Check if products table has correct structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 3: Check if category relationship is working
SELECT
    p.name as product_name,
    c.name as category_name,
    c.slug as category_slug
FROM public.products p
    LEFT JOIN public.categories c ON p.category = c.id
WHERE p.visible = true
LIMIT 5;

-- Test 4: Check if configurable_fees table exists
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'configurable_fees'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 5: Check if orders table has correct structure
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 6: Verify no dual relationships exist
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'products'
    AND ccu.table_name = 'categories';
