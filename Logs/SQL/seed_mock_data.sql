-- Mock Data Seeding Script for TJ's Bake & Browse
-- Run this in your Supabase SQL editor to populate the database with sample data

-- Start transaction for data consistency
BEGIN;

-- 1. First, let's fix the RLS policies to allow proper access
-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS deny_by_default_orders ON public.orders;
DROP POLICY IF EXISTS users_read_own ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
DROP POLICY IF EXISTS users_admin_all ON public.users;
DROP POLICY IF EXISTS products_read_all ON public.products;
DROP POLICY IF EXISTS products_admin_all ON public.products;
DROP POLICY IF EXISTS orders_read_own ON public.orders;
DROP POLICY IF EXISTS orders_insert_own ON public.orders;
DROP POLICY IF EXISTS orders_update_own ON public.orders;
DROP POLICY IF EXISTS orders_admin_all ON public.orders;
DROP POLICY IF EXISTS categories_read_all ON public.categories;
DROP POLICY IF EXISTS categories_admin_all ON public.categories;
DROP POLICY IF EXISTS audit_logs_admin_read ON public.audit_logs;

-- Create proper RLS policies for all tables
-- Users table policies
CREATE POLICY users_read_own ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY users_admin_all ON public.users 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Products table policies
CREATE POLICY products_read_all ON public.products 
  FOR SELECT USING (true);

CREATE POLICY products_admin_all ON public.products 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Orders table policies
CREATE POLICY orders_read_own ON public.orders 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY orders_insert_own ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY orders_update_own ON public.orders 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY orders_admin_all ON public.orders 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Categories table policies
CREATE POLICY categories_read_all ON public.categories 
  FOR SELECT USING (true);

CREATE POLICY categories_admin_all ON public.categories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Audit logs policies
CREATE POLICY audit_logs_admin_read ON public.audit_logs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- 2. Create categories table (drop and recreate to ensure clean state)
DROP TABLE IF EXISTS public.categories CASCADE;
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Add category_id to products (drop and recreate column to ensure clean state)
ALTER TABLE public.products DROP COLUMN IF EXISTS category_id;
ALTER TABLE public.products ADD COLUMN category_id uuid REFERENCES public.categories(id);

-- 4. Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 5. Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Baked Goods', 'baked_goods', 'Freshly baked breads, pastries, and desserts'),
  ('Groceries', 'groceries', 'General grocery items and ingredients'),
  ('Specialty Items', 'specialty_items', 'Unique and seasonal products'),
  ('Beverages', 'beverages', 'Hot and cold drinks');

-- 6. Insert mock users (clear existing users first for clean slate)
DELETE FROM public.users WHERE email IN (
  'lewis.s2021@outlook.com',
  'jess@tjsbake.com', 
  'sarah.jones@email.com',
  'mike.smith@email.com',
  'emma.wilson@email.com'
);

INSERT INTO public.users (email, password_hash, name, mobile, role, marketing_opt_in) VALUES
  -- Admin user (password: admin123)
  ('lewis.s2021@outlook.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Steve Lewis', '07700900123', 'admin', true),
  -- Staff user (password: staff123)
  ('jess@tjsbake.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jess Baker', '07700900456', 'staff', false),
  -- Customer users (password: customer123)
  ('sarah.jones@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Jones', '07700900789', 'customer', true),
  ('mike.smith@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike Smith', '07700900112', 'customer', false),
  ('emma.wilson@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emma Wilson', '07700900334', 'customer', true);

-- 7. Insert mock products (clear existing products first for clean slate)
DELETE FROM public.products WHERE sku IN (
  'GF-SOUR-001', 'COOK-CHOC-001', 'MUFF-BLUE-001', 'ROLL-CINN-001', 'BREAD-BANA-001',
  'FLOUR-ALM-001', 'SUGAR-COCO-001', 'SEEDS-CHIA-001', 'EXTRACT-VAN-001', 'CHOC-CHIPS-001',
  'CAKE-FRUIT-001', 'CHEESE-BOARD-001', 'TEA-HERBAL-001', 'COFFEE-COLD-001'
);

INSERT INTO public.products (name, sku, short_description, description, price_pence, pack_label, allergens, ingredients, image_url, stock, visible, category_id) VALUES
  -- Baked Goods
  ('Gluten-Free Sourdough Bread', 'GF-SOUR-001', 'Artisan sourdough made with ancient grains', 'Our signature sourdough bread is made with a blend of gluten-free flours including rice, tapioca, and potato starch. Fermented for 24 hours for maximum flavour and digestibility.', 450, '500g', ARRAY['none'], 'Rice flour, tapioca starch, potato starch, water, salt, active dry yeast, olive oil', '/images/products/sourdough.jpg', 15, true, (SELECT id FROM public.categories WHERE slug = 'baked_goods')),
  
  ('Chocolate Chip Cookies', 'COOK-CHOC-001', 'Classic chocolate chip cookies', 'Buttery, chewy cookies loaded with dark chocolate chips. Made with premium butter and Belgian chocolate for the perfect texture and taste.', 250, '6-pack', ARRAY['milk', 'eggs'], 'Butter, sugar, eggs, flour, chocolate chips, vanilla extract, baking soda, salt', '/images/products/chocolate-cookies.jpg', 25, true, (SELECT id FROM public.categories WHERE slug = 'baked_goods')),
  
  ('Blueberry Muffins', 'MUFF-BLUE-001', 'Fresh blueberry muffins', 'Moist, fluffy muffins bursting with fresh blueberries. Made with almond flour for a nutty flavour and gluten-free diet compatibility.', 300, '4-pack', ARRAY['eggs', 'tree_nuts'], 'Almond flour, eggs, butter, sugar, blueberries, vanilla extract, baking powder, salt', '/images/products/blueberry-muffins.jpg', 20, true, (SELECT id FROM public.categories WHERE slug = 'baked_goods')),
  
  ('Cinnamon Rolls', 'ROLL-CINN-001', 'Sweet cinnamon rolls with cream cheese frosting', 'Soft, fluffy rolls swirled with cinnamon sugar and topped with rich cream cheese frosting. Perfect for breakfast or dessert.', 400, '4-pack', ARRAY['milk', 'eggs', 'wheat'], 'Flour, milk, butter, eggs, sugar, cinnamon, yeast, cream cheese, vanilla extract', '/images/products/cinnamon-rolls.jpg', 12, true, (SELECT id FROM public.categories WHERE slug = 'baked_goods')),
  
  ('Banana Bread', 'BREAD-BANA-001', 'Moist banana bread with walnuts', 'Classic banana bread made with ripe bananas and crunchy walnuts. Moist, flavourful, and perfect with a cup of tea.', 350, '500g', ARRAY['eggs', 'tree_nuts'], 'Bananas, flour, eggs, butter, sugar, walnuts, vanilla extract, baking soda, salt', '/images/products/banana-bread.jpg', 18, true, (SELECT id FROM public.categories WHERE slug = 'baked_goods')),
  
  -- Groceries
  ('Organic Almond Flour', 'FLOUR-ALM-001', 'Fine ground almond flour', 'Premium blanched almond flour perfect for gluten-free baking. High in protein and healthy fats, ideal for cakes, cookies, and breads.', 800, '500g', ARRAY['tree_nuts'], '100% blanched almonds', '/images/products/almond-flour.jpg', 30, true, (SELECT id FROM public.categories WHERE slug = 'groceries')),
  
  ('Coconut Sugar', 'SUGAR-COCO-001', 'Natural coconut sugar', 'Unrefined coconut sugar with a rich caramel flavour. Lower glycemic index than regular sugar and perfect for baking.', 450, '500g', ARRAY['none'], '100% coconut palm sugar', '/images/products/coconut-sugar.jpg', 25, true, (SELECT id FROM public.categories WHERE slug = 'groceries')),
  
  ('Chia Seeds', 'SEEDS-CHIA-001', 'Premium chia seeds', 'Nutrient-rich chia seeds packed with omega-3 fatty acids, fibre, and protein. Perfect for smoothies, puddings, and baking.', 350, '250g', ARRAY['none'], '100% chia seeds', '/images/products/chia-seeds.jpg', 40, true, (SELECT id FROM public.categories WHERE slug = 'groceries')),
  
  ('Vanilla Extract', 'EXTRACT-VAN-001', 'Pure vanilla extract', 'Premium Madagascar vanilla extract with rich, complex flavour. Perfect for all your baking needs.', 650, '100ml', ARRAY['none'], 'Vanilla beans, alcohol, water', '/images/products/vanilla-extract.jpg', 15, true, (SELECT id FROM public.categories WHERE slug = 'groceries')),
  
  ('Dark Chocolate Chips', 'CHOC-CHIPS-001', '70% dark chocolate chips', 'Premium dark chocolate chips with 70% cocoa content. Rich, intense flavour perfect for cookies, muffins, and other baked goods.', 550, '200g', ARRAY['milk'], 'Cocoa mass, sugar, cocoa butter, vanilla, lecithin', '/images/products/chocolate-chips.jpg', 35, true, (SELECT id FROM public.categories WHERE slug = 'groceries')),
  
  -- Specialty Items
  ('Seasonal Fruit Cake', 'CAKE-FRUIT-001', 'Traditional fruit cake', 'Rich fruit cake made with dried fruits, nuts, and warm spices. Perfect for special occasions and holiday celebrations.', 1200, '1kg', ARRAY['eggs', 'tree_nuts'], 'Mixed dried fruits, nuts, flour, eggs, butter, sugar, spices, brandy', '/images/products/fruit-cake.jpg', 8, true, (SELECT id FROM public.categories WHERE slug = 'specialty_items')),
  
  ('Artisan Cheese Board', 'CHEESE-BOARD-001', 'Curated cheese selection', 'Carefully selected artisan cheeses with crackers, nuts, and dried fruits. Perfect for entertaining and special occasions.', 1800, 'Serves 6-8', ARRAY['milk', 'tree_nuts'], 'Various artisan cheeses, crackers, nuts, dried fruits', '/images/products/cheese-board.jpg', 5, true, (SELECT id FROM public.categories WHERE slug = 'specialty_items')),
  
  -- Beverages
  ('Herbal Tea Blend', 'TEA-HERBAL-001', 'Calming herbal tea', 'Soothing blend of chamomile, lavender, and mint. Perfect for relaxation and evening enjoyment.', 280, '20 tea bags', ARRAY['none'], 'Chamomile, lavender, mint, natural flavours', '/images/products/herbal-tea.jpg', 50, true, (SELECT id FROM public.categories WHERE slug = 'beverages')),
  
  ('Cold Brew Coffee', 'COFFEE-COLD-001', 'Smooth cold brew coffee', 'Smooth, low-acid cold brew coffee made with premium beans. Perfect for hot summer days.', 450, '500ml', ARRAY['none'], 'Coffee beans, water', '/images/products/cold-brew.jpg', 20, true, (SELECT id FROM public.categories WHERE slug = 'beverages'));

-- 8. Insert mock orders (clear existing orders first for clean slate)
DELETE FROM public.orders;
DELETE FROM public.audit_logs;
DELETE FROM public.suggestions;

INSERT INTO public.orders (user_id, items, subtotal_pence, bag_opt_in, bag_fee_pence, total_pence, status, pickup_date, pickup_time) VALUES
  -- Order 1: Sarah's order
  ((SELECT id FROM public.users WHERE email = 'sarah.jones@email.com'), 
   '[{"product_id": "1", "name": "Gluten-Free Sourdough Bread", "quantity": 2, "price_pence": 450, "total_pence": 900}, {"product_id": "2", "name": "Chocolate Chip Cookies", "quantity": 1, "price_pence": 250, "total_pence": 250}]', 
   1150, true, 50, 1200, 'ready', 
   CURRENT_DATE + INTERVAL '1 day', '14:00:00'),
  
  -- Order 2: Mike's order
  ((SELECT id FROM public.users WHERE email = 'mike.smith@email.com'), 
   '[{"product_id": "3", "name": "Blueberry Muffins", "quantity": 2, "price_pence": 300, "total_pence": 600}, {"product_id": "6", "name": "Organic Almond Flour", "quantity": 1, "price_pence": 800, "total_pence": 800}]', 
   1400, false, 0, 1400, 'unpaid', 
   CURRENT_DATE + INTERVAL '2 days', '16:00:00'),
  
  -- Order 3: Emma's order
  ((SELECT id FROM public.users WHERE email = 'emma.wilson@email.com'), 
   '[{"product_id": "4", "name": "Cinnamon Rolls", "quantity": 1, "price_pence": 400, "total_pence": 400}, {"product_id": "5", "name": "Banana Bread", "quantity": 1, "price_pence": 350, "total_pence": 350}, {"product_id": "10", "name": "Dark Chocolate Chips", "quantity": 2, "price_pence": 550, "total_pence": 1100}]', 
   1850, true, 50, 1900, 'collected', 
   CURRENT_DATE - INTERVAL '1 day', '10:00:00'),
  
  -- Order 4: Another order from Sarah
  ((SELECT id FROM public.users WHERE email = 'sarah.jones@email.com'), 
   '[{"product_id": "11", "name": "Seasonal Fruit Cake", "quantity": 1, "price_pence": 1200, "total_pence": 1200}, {"product_id": "13", "name": "Herbal Tea Blend", "quantity": 2, "price_pence": 280, "total_pence": 560}]', 
   1760, false, 0, 1760, 'ready', 
   CURRENT_DATE + INTERVAL '3 days', '15:00:00'),
  
  -- Order 5: Mike's second order
  ((SELECT id FROM public.users WHERE email = 'mike.smith@email.com'), 
   '[{"product_id": "7", "name": "Coconut Sugar", "quantity": 1, "price_pence": 450, "total_pence": 450}, {"product_id": "8", "name": "Chia Seeds", "quantity": 1, "price_pence": 350, "total_pence": 350}, {"product_id": "9", "name": "Vanilla Extract", "quantity": 1, "price_pence": 650, "total_pence": 650}]', 
   1450, true, 50, 1500, 'unpaid', 
   CURRENT_DATE + INTERVAL '4 days', '11:00:00');

-- 9. Insert mock audit logs
INSERT INTO public.audit_logs (actor_id, action, target, metadata) VALUES
  ((SELECT id FROM public.users WHERE email = 'lewis.s2021@outlook.com'), 'product_created', 'Gluten-Free Sourdough Bread', '{"sku": "GF-SOUR-001", "price": 450, "stock": 15}'),
  ((SELECT id FROM public.users WHERE email = 'lewis.s2021@outlook.com'), 'product_updated', 'Chocolate Chip Cookies', '{"stock_change": "+10", "previous_stock": 15, "new_stock": 25}'),
  ((SELECT id FROM public.users WHERE email = 'jess@tjsbake.com'), 'order_status_changed', 'Order #1', '{"previous_status": "unpaid", "new_status": "ready", "notes": "Bread is ready"}'),
  ((SELECT id FROM public.users WHERE email = 'jess@tjsbake.com'), 'order_status_changed', 'Order #3', '{"previous_status": "ready", "new_status": "collected", "notes": "Customer collected"}'),
  ((SELECT id FROM public.users WHERE email = 'lewis.s2021@outlook.com'), 'product_created', 'Blueberry Muffins', '{"sku": "MUFF-BLUE-001", "price": 300, "stock": 20}');

-- 10. Insert mock suggestions
INSERT INTO public.suggestions (user_id, name, email, message) VALUES
  ((SELECT id FROM public.users WHERE email = 'sarah.jones@email.com'), 'Sarah Jones', 'sarah.jones@email.com', 'Would love to see more vegan options in the baked goods section!'),
  (NULL, 'Anonymous Customer', 'customer@email.com', 'The gluten-free bread is amazing! Could you make it available in larger sizes?'),
  ((SELECT id FROM public.users WHERE email = 'emma.wilson@email.com'), 'Emma Wilson', 'emma.wilson@email.com', 'Love the seasonal fruit cake! Any chance of a smaller version for smaller gatherings?'),
  (NULL, 'John Doe', 'john.doe@email.com', 'Great selection of products! Would love to see more organic options.'),
  ((SELECT id FROM public.users WHERE email = 'mike.smith@email.com'), 'Mike Smith', 'mike.smith@email.com', 'The almond flour is perfect for my baking needs. Any plans to stock coconut flour as well?');

-- 11. Verification queries
SELECT 'Database Seeding Complete!' as status;

SELECT 
  'Users' as table_name,
  COUNT(*) as record_count
FROM public.users
UNION ALL
SELECT 
  'Products' as table_name,
  COUNT(*) as record_count
FROM public.products
UNION ALL
SELECT 
  'Categories' as table_name,
  COUNT(*) as record_count
FROM public.categories
UNION ALL
SELECT 
  'Orders' as table_name,
  COUNT(*) as record_count
FROM public.orders
UNION ALL
SELECT 
  'Audit Logs' as table_name,
  COUNT(*) as record_count
FROM public.audit_logs
UNION ALL
SELECT 
  'Suggestions' as table_name,
  COUNT(*) as record_count
FROM public.suggestions;

-- 12. Sample data preview
SELECT 'Sample Products' as section, name, price_pence, stock FROM public.products LIMIT 5;
SELECT 'Sample Orders' as section, order_number, status, total_pence FROM public.orders LIMIT 5;
SELECT 'Sample Users' as section, name, email, role FROM public.users LIMIT 5;

-- Commit the transaction
COMMIT;
