# 🚀 TJ's Bake & Browse - Database Deployment Guide

## 📋 **Prerequisites**

- Supabase account and project
- Access to Supabase SQL Editor
- Basic understanding of PostgreSQL

## 🔧 **Step 1: Database Setup**

### **1.1 Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down your project URL and anon key

### **1.2 Run Database Fixes**

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `database_fixes.sql`
3. Click "Run" to execute all fixes

### **1.3 Verify Setup**

Run these verification queries in SQL Editor:

```sql
-- Check table counts
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
```

## 🌐 **Step 2: Environment Variables**

### **2.1 Production Environment**

Create `.env.production` with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# Database Configuration
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### **2.2 Local Development**

Create `.env.local` with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-secret-key
```

## 📊 **Step 3: Data Population**

### **3.1 Insert Sample Categories**

```sql
INSERT INTO public.categories (id, name, slug, description) VALUES
    ('a435f3b9-6a3c-4bdc-ba45-b2ca2ccf500b', 'Baked Goods', 'baked_goods', 'Freshly baked goods and treats'),
    ('3c27609f-cbb5-4ad0-a88f-ef619be670d6', 'Groceries', 'groceries', 'Pantry essentials and ingredients'),
    ('1da60f7e-3f2c-479c-87de-a01bd1643e15', 'Specialty Items', 'specialty_items', 'Unique and seasonal items'),
    ('54aa597f-3657-4b9c-9d2e-44e64705bb4a', 'Beverages', 'beverages', 'Hot and cold drinks')
ON CONFLICT (id) DO NOTHING;
```

### **3.2 Insert Sample Products**

```sql
-- Baked Goods (corrected columns)
INSERT INTO public.products (name, price_pence, image_url, pack_label, allergens, sku, stock_quantity, is_visible, category_id) VALUES
    ('Gluten-Free Sourdough Bread', 450, '/images/products/sourdough.jpg', '500g', ARRAY['none'], 'GF-SOUR-001', 15, true, 'a435f3b9-6a3c-4bdc-ba45-b2ca2ccf500b'),
    ('Chocolate Chip Cookies', 250, '/images/products/chocolate-cookies.jpg', '6-pack', ARRAY['milk','eggs'], 'COOK-CHOC-001', 25, true, 'a435f3b9-6a3c-4bdc-ba45-b2ca2ccf500b'),
    ('Blueberry Muffins', 300, '/images/products/blueberry-muffins.jpg', '4-pack', ARRAY['eggs','tree_nuts'], 'MUFF-BLUE-001', 20, true, 'a435f3b9-6a3c-4bdc-ba45-b2ca2ccf500b');

-- Groceries (corrected columns)
INSERT INTO public.products (name, price_pence, image_url, pack_label, allergens, sku, stock_quantity, is_visible, category_id) VALUES
    ('Organic Almond Flour', 800, '/images/products/almond-flour.jpg', '500g', ARRAY['tree_nuts'], 'FLOUR-ALM-001', 30, true, '3c27609f-cbb5-4ad0-a88f-ef619be670d6'),
    ('Coconut Sugar', 450, '/images/products/coconut-sugar.jpg', '500g', ARRAY['none'], 'SUGAR-COCO-001', 25, true, '3c27609f-cbb5-4ad0-a88f-ef619be670d6');
```

### **3.3 Set Bag Fee**

```sql
INSERT INTO public.configurable_fees (name, description, price_pence) VALUES
    ('Bag Fee', 'Optional bag fee for orders', 50)
ON CONFLICT (name) DO UPDATE SET
    price_pence = EXCLUDED.price_pence,
    updated_at = NOW();
```

## 🔒 **Step 4: Security Configuration**

### **4.1 RLS Policies**

The database fixes script creates proper RLS policies:

- **Products**: Public read access
- **Categories**: Public read access
- **Orders**: Users can only see their own orders
- **Order Items**: Users can only see items from their orders

### **4.2 Authentication**

- NextAuth.js handles user authentication
- Supabase handles database authentication
- RLS policies enforce data access control

## 🚀 **Step 5: Deployment**

### **5.1 Build Application**

```bash
npm run build
```

### **5.2 Deploy to Platform**

Choose your deployment platform:

**Vercel (Recommended):**

```bash
npm install -g vercel
vercel --prod
```

**Netlify:**

```bash
npm run build
# Upload dist folder to Netlify
```

**Self-hosted:**

```bash
npm run build
npm start
```

### **5.3 Post-Deployment Verification**

1. Check all pages load correctly
2. Test product browsing (note: `/api/products` currently returns all visible products regardless of `stock_quantity` until product visibility policy is finalised)
3. Test cart functionality
4. Test order creation
5. Verify RLS policies work

## 🐛 **Step 6: Troubleshooting**

### **Common Issues:**

**1. RLS Policy Errors**

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Disable RLS temporarily for debugging
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
```

**2. Connection Issues**

- Verify environment variables
- Check Supabase project status
- Verify network connectivity

**3. Schema Mismatches**

```sql
-- Check table structure
\d public.products
\d public.orders
```

## 📚 **Step 7: Monitoring & Maintenance**

### **7.1 Database Monitoring**

- Monitor query performance
- Check RLS policy effectiveness
- Review access logs

### **7.2 Regular Maintenance**

- Update product prices
- Manage inventory levels
- Review and update RLS policies

### **7.3 Backup Strategy**

- Enable Supabase point-in-time recovery
- Regular database exports
- Test restore procedures

## 🔗 **Useful Links**

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## 📞 **Support**

For deployment issues:

1. Check Supabase project status
2. Review application logs
3. Verify environment variables
4. Test database connectivity

---

**Last Updated:** August 13, 2025  
**Version:** 1.0.0  
**Author:** TJ's Bake & Browse Development Team
