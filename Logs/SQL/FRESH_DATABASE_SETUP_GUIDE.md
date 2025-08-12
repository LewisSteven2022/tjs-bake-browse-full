# 🗄️ Fresh Database Setup Guide - TJ's Bake & Browse

## 🚨 **CURRENT SITUATION**

Your Supabase database has RLS policies that are too restrictive, causing authentication failures. Starting fresh will resolve all issues.

## 🔄 **FRESH START PROCESS**

### **Step 1: Delete Current Database**

1. **Go to Supabase Dashboard** → Your Project
2. **Settings** → **Database**
3. **Scroll to bottom** → **Danger Zone**
4. **Click "Delete Database"** → Confirm deletion
5. **Wait for deletion** to complete (may take a few minutes)

### **Step 2: Recreate Database**

1. **Settings** → **Database**
2. **Click "Create Database"**
3. **Choose region** (same as before)
4. **Wait for creation** to complete

### **Step 3: Run Complete Setup Script**

1. **Go to SQL Editor** in your new database
2. **Copy entire contents** of `COMPLETE_DATABASE_SETUP.sql`
3. **Paste into SQL Editor**
4. **Click "Run"**
5. **Wait for completion** (should take 30-60 seconds)

## 📋 **WHAT THE SCRIPT CREATES**

### **✅ Tables:**

- `users` - User accounts and authentication
- `categories` - Product categories (Baked Goods, Groceries)
- `products` - Product catalog with stock management
- `orders` - Customer orders with pickup scheduling
- `audit_logs` - System activity tracking
- `suggestions` - Customer feedback system

### **✅ Functions:**

- `place_order_atomic` - Secure order placement with stock updates

### **✅ Security:**

- **Row Level Security (RLS)** enabled on all tables
- **Proper policies** for user access control
- **Admin privileges** for management functions

### **✅ Default Data:**

- **Admin user**: `lewis.s2021@outlook.com` (password: `admin123`)
- **Categories**: Baked Goods, Groceries
- **Sample products** (optional, commented out)

## 🔐 **RLS POLICIES EXPLAINED**

### **Users Table:**

- Users can read/update their own profile
- Admins can read all users

### **Products Table:**

- Public can see visible products with stock
- Admins have full access

### **Orders Table:**

- Users can see/create their own orders
- Admins have full access

### **Suggestions Table:**

- Anyone can create suggestions
- Users can read their own
- Admins can read/delete all

### **Categories Table:**

- Public read access
- Admin full access

## 🧪 **TESTING AFTER SETUP**

### **1. Test Authentication:**

- Go to `/login`
- Login with `lewis.s2021@outlook.com` / `admin123`
- Should work without "Loading..." state

### **2. Test Suggestions Page:**

- Go to `/suggestions`
- Should load properly (not stuck in loading)

### **3. Test Admin Functions:**

- Go to `/admin/orders`
- Should display orders dashboard

### **4. Test Product Pages:**

- Go to `/baked-goods` and `/groceries`
- Should display category pages

## ⚠️ **IMPORTANT NOTES**

### **Password Security:**

- **Change admin password** after first login
- **Use strong password** for production

### **Data Loss:**

- **All existing data will be lost**
- **Orders, users, products gone**
- **Start with clean slate**

### **Environment Variables:**

- **Keep your `.env.local`** - API keys still valid
- **No changes needed** to environment variables

## 🚀 **EXPECTED RESULTS**

After running the script:

1. **✅ Authentication works** - No more loading issues
2. **✅ All pages load** - Suggestions, admin, products
3. **✅ RLS policies work** - Proper security without blocking
4. **✅ Fresh start** - Clean, working database

## 🔧 **TROUBLESHOOTING**

### **If Script Fails:**

1. **Check error messages** in SQL Editor
2. **Ensure database is fully created** before running
3. **Run in sections** if needed (tables first, then policies)

### **If Authentication Still Fails:**

1. **Verify policies were created** (check verification queries)
2. **Restart development server**
3. **Clear browser cache/cookies**

## 📁 **FILES CREATED**

- ✅ `COMPLETE_DATABASE_SETUP.sql` - Complete database setup script
- ✅ `FRESH_DATABASE_SETUP_GUIDE.md` - This guide

## 🎯 **NEXT STEPS**

1. **Delete current database**
2. **Create new database**
3. **Run setup script**
4. **Test authentication**
5. **Continue development**

---

**Status**: 🚀 **READY FOR FRESH START**

**Estimated Time**: 10-15 minutes total
**Risk Level**: Low (clean slate approach)
**Expected Outcome**: Fully functional, secure database
