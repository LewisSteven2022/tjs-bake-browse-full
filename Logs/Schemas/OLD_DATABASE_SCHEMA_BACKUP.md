# 🗄️ OLD DATABASE SCHEMA BACKUP - TJ's Bake & Browse

## 📋 **BACKUP INFORMATION**

- **Date Created**: 2024-01-13
- **Purpose**: Backup of current database schema before fresh redesign
- **Status**: ARCHIVED - DO NOT USE FOR NEW DEVELOPMENT
- **Reason**: Fresh start to resolve RLS and schema conflicts

---

## 🏗️ **CURRENT DATABASE SCHEMA (ARCHIVED)**

### **Core Tables**

#### **1. Products Table**

```sql
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price_pence INTEGER NOT NULL,
    image_url VARCHAR(500),
    pack_label VARCHAR(100),
    allergens JSONB,
    sku VARCHAR(100) UNIQUE,
    stock INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    category UUID REFERENCES public.categories(id),
    category_id UUID, -- Legacy field, will be removed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **2. Categories Table**

```sql
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **3. Orders Table**

```sql
CREATE TABLE public.orders (
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
```

#### **4. Order Items Table**

```sql
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price_pence INTEGER NOT NULL,
    total_pence INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **5. Configurable Fees Table**

```sql
CREATE TABLE public.configurable_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_pence INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **6. Users Table**

```sql
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','staff','admin')),
    marketing_opt_in BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚨 **KNOWN ISSUES WITH OLD SCHEMA**

### **1. Dual Foreign Key Conflicts**

- **Problem**: Both `category` and `category_id` columns referencing categories table
- **Impact**: PostgREST cannot resolve ambiguous relationships
- **Error**: "Could not embed because more than one relationship was found"

### **2. RLS Policy Complexity**

- **Problem**: Complex RLS policies causing infinite recursion
- **Impact**: Database queries failing with recursion errors
- **Error**: "infinite recursion detected in policy for relation 'users'"

### **3. Schema Inconsistencies**

- **Problem**: Multiple schema versions and fallback logic
- **Impact**: Confusing development and maintenance
- **Error**: Various schema mismatch errors

### **4. Missing Cart Tables**

- **Problem**: Cart functionality using localStorage only
- **Impact**: No persistent cart data, limited functionality
- **Error**: Cannot implement server-side cart features

---

## 📚 **CURRENT API ENDPOINTS (ARCHIVED)**

### **Public APIs**

- `/api/products` - Product catalog
- `/api/categories` - Category listing
- `/api/slots` - Time slot availability
- `/api/orders` - Order placement
- `/api/fees` - Configurable fees

### **Admin APIs**

- `/api/admin/products` - Product management
- `/api/admin/categories` - Category management
- `/api/admin/orders` - Order management
- `/api/admin/inventory` - Inventory overview

### **Auth APIs**

- `/api/auth/register` - User registration
- `/api/auth/[...nextauth]` - NextAuth.js integration

---

## 🔒 **CURRENT RLS POLICIES (ARCHIVED)**

### **Products Table**

```sql
CREATE POLICY "Public read access" ON public.products FOR SELECT USING (true);
```

### **Categories Table**

```sql
CREATE POLICY "Public read access" ON public.categories FOR SELECT USING (true);
```

### **Orders Table**

```sql
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid()::text = customer_email OR customer_email IS NULL);

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid()::text = customer_email OR customer_email IS NULL);
```

---

## 📊 **CURRENT DATA FLOW (ARCHIVED)**

### **Product Browsing**

1. User visits `/groceries` or `/baked-goods`
2. Page fetches from `/api/products`
3. Client-side filtering by category
4. Products displayed with ProductCard components

### **Cart Management**

1. User adds items via ProductCard
2. Cart data stored in localStorage
3. CartContext manages state across components
4. Basket page displays cart contents

### **Checkout Process**

1. User proceeds to checkout
2. Form validation and time slot selection
3. Order placed via `/api/orders`
4. Cart cleared and order confirmed

---

## 🎯 **WHY FRESH START IS NEEDED**

### **1. RLS Policy Issues**

- Current policies too complex and causing recursion
- Need simpler, more maintainable security model
- Better separation of public vs authenticated access

### **2. Schema Conflicts**

- Dual foreign keys causing PostgREST issues
- Multiple schema versions creating confusion
- Need single, clear schema design

### **3. Missing Features**

- No persistent cart system
- Limited user profile management
- No order history tracking
- Missing payment integration tables

### **4. Performance Issues**

- Complex joins causing timeouts
- Missing indexes for common queries
- Inefficient data retrieval patterns

---

## 📝 **MIGRATION NOTES**

### **Data to Preserve**

- User accounts and authentication
- Product catalog and categories
- Existing orders (if any)
- Configuration settings

### **Data to Recreate**

- RLS policies (simplified)
- Indexes (optimized)
- Cart system (database-backed)
- User profiles and preferences

### **New Features to Add**

- Persistent cart system
- User profile management
- Order history tracking
- Payment integration tables
- Better audit logging

---

**⚠️ IMPORTANT: This schema is archived and should not be used for new development. Use the new schema design instead.**
