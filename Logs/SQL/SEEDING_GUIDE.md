# 🗄️ Database Seeding Guide

## 📋 What This Script Does

The `seed_mock_data.sql` script will populate your Supabase database with comprehensive mock data for testing and development purposes.

## 🚀 How to Run

1. **Open Supabase Dashboard**

   - Go to your Supabase project dashboard
   - Navigate to the **SQL Editor** section

2. **Run the Script**

   - Copy the entire contents of `seed_mock_data.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute

3. **Verify Success**
   - The script will show verification queries at the end
   - You should see counts for all tables
   - Sample data previews will be displayed

## ⚠️ **IMPORTANT: This Script Will Clear Existing Data**

**The script is designed to provide a clean slate and will:**

- Drop and recreate all RLS policies
- Clear existing users, products, orders, and other data
- Insert fresh mock data
- Use transaction handling for data consistency

**If you have important data you want to keep, please backup first!**

## 📊 What Gets Created

### 👥 **Users (5 total)**

- **Admin**: `lewis.s2021@outlook.com` / `admin123`
- **Staff**: `jess@tjsbake.com` / `staff123`
- **Customers**: 3 customer accounts with password `customer123`

### 🍞 **Products (14 total)**

- **Baked Goods**: Sourdough bread, cookies, muffins, cinnamon rolls, banana bread
- **Groceries**: Almond flour, coconut sugar, chia seeds, vanilla extract, chocolate chips
- **Specialty Items**: Fruit cake, cheese board
- **Beverages**: Herbal tea, cold brew coffee

### 📦 **Categories (4 total)**

- Baked Goods
- Groceries
- Specialty Items
- Beverages

### 🛒 **Orders (5 total)**

- Various order statuses (unpaid, ready, collected)
- Different pickup dates and times
- Realistic order items and totals

### 📝 **Audit Logs (5 total)**

- Product creation and updates
- Order status changes
- Admin actions tracking

### 💡 **Suggestions (5 total)**

- Customer feedback and requests
- Both authenticated and anonymous suggestions

## 🔐 **Login Credentials**

After running the script, you can test the system with these accounts:

| Role         | Email                     | Password      | Purpose                  |
| ------------ | ------------------------- | ------------- | ------------------------ |
| **Admin**    | `lewis.s2021@outlook.com` | `admin123`    | Full system access       |
| **Staff**    | `jess@tjsbake.com`        | `staff123`    | Order management         |
| **Customer** | `sarah.jones@email.com`   | `customer123` | Test customer experience |

## 🛡️ **Security Features**

The script also sets up proper **Row Level Security (RLS)** policies:

- Users can only see their own data
- Admins have access to everything
- Products are publicly readable
- Orders are user-specific

## 🔧 **Technical Improvements**

**The script handles common Supabase issues:**

- **No `IF NOT EXISTS`** - Uses explicit DROP statements instead
- **Policy conflicts** - Drops all existing policies before creating new ones
- **Data conflicts** - Clears existing data for a clean slate
- **Transaction safety** - Wraps everything in a transaction for consistency
- **Cascade handling** - Properly handles table dependencies

## 🔍 **Verification Queries**

After running, you can verify the data with these simple queries:

```sql
-- Check user counts
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Check product categories
SELECT c.name, COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name;

-- Check order statuses
SELECT status, COUNT(*) FROM orders GROUP BY status;
```

## ⚠️ **Important Notes**

- **This is test data** - Don't use in production
- **Passwords are simple** - Change them for production use
- **Images are placeholders** - Replace with real product images
- **Prices are in pence** - £4.50 = 450 pence

## 🎯 **Next Steps**

After seeding:

1. Test login with different user roles
2. Browse products on the website
3. Test the admin dashboard
4. Verify order management works
5. Check that RLS policies are working correctly

## 🆘 **Troubleshooting**

If you encounter issues:

- Check the Supabase logs for error messages
- Verify your database connection
- Ensure you have the necessary permissions
- Check that all tables exist before running

---

**Happy Testing! 🎉**
`
