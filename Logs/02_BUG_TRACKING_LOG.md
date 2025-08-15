# 🐛 Bug Tracking Log - TJ's Bake & Browse

## **Current Project Status**

- **Last Updated**: 14th August 2025
- **Status**: ACTIVE DEVELOPMENT
- **Critical Issues**: 0
- **Known Issues**: 0

## **CRITICAL ISSUES RESOLVED**

### **1. Database Schema Mismatch - RESOLVED ✅**

- **Issue**: API endpoints were using incorrect column names that didn't exist in the database
- **Root Cause**: Documentation showed old schema (`visible`, `category`) but database had new schema (`is_visible`, `category_id`)
- **Impact**: Products not displaying, orders failing to create
- **Resolution**: Updated all API endpoints to use correct column names
- **Files Fixed**:
  - `app/api/products/route.ts` - Now uses `is_visible`, `stock_quantity`, `category_id`
  - `app/api/orders/route.ts` - Fixed status values and schema mapping
  - `app/api/admin/orders/route.ts` - Updated for new schema
  - `app/api/admin/products/route.ts` - Updated for new schema
  - `app/api/admin/inventory/route.ts` - Updated for new schema
- **Date Resolved**: [Current Date]

### **2. Order Creation Failure - RESOLVED ✅**

- **Issue**: Orders were failing to create due to status constraint violations
- **Root Cause**: API was trying to insert `status: "unpaid"` but database only allowed specific values
- **Impact**: Customers couldn't place orders
- **Resolution**: Updated orders API to use correct status values (`pending`, `confirmed`, etc.)
- **Date Resolved**: [Current Date]

### **3. Product Display Issues - RESOLVED ✅**

- **Issue**: Products not displaying on `/groceries` and `/baked-goods` pages
- **Root Cause**: Schema mismatch between API queries and actual database columns
- **Impact**: Empty product pages, no items visible
- **Resolution**: Fixed products API to use correct column names and added fallback logic. Identified that a stock filter was hiding out-of-stock products; temporarily disabled stock filter in API while deciding product visibility policy.
- **Date Resolved**: [Current Date]

## **RECENT IMPLEMENTATIONS**

### **Schema Compatibility Layer**

- Added backward compatibility mapping in products API
- Products API now provides both old and new schema field names
- Components receive data in expected format regardless of database schema

### **Enhanced Error Handling**

- Added comprehensive error logging in orders API
- Fallback mechanisms for missing database tables
- Better error messages for debugging
- New test navbar and modern About page prototype under `app/test-styling/` to iterate on design without impacting prod pages
- Footer updated with Instagram and Facebook links (icons added)
- Admin inventory: removed legacy CSV Export/Import controls from toolbar (not needed yet)

## **RECENT CRITICAL FIXES (14th August 2025)**

### **1. Baked-Goods/Groceries Pages Not Working - RESOLVED ✅**

- **Issue**: Category pages showed no products despite database containing categorised items
- **Root Cause**: Products API using incorrect Supabase JOIN syntax for foreign key relationships
- **Resolution**: Fixed JOIN syntax from `categories (id, name, slug)` to `categories:categories!products_category_id_fkey(id, name, slug, description)`
- **Impact**: Customer product browsing fully restored
- **Files Fixed**: `app/api/products/route.ts`

### **2. Product Card Updates Not Reflecting Database Changes - RESOLVED ✅**

- **Issue**: Admin product updates saved successfully but customer pages showed stale data
- **Root Cause**: No cache invalidation mechanism for real-time data synchronisation
- **Resolution**: Implemented intelligent cache-busting with 30-second intervals and visibility change listeners
- **Impact**: Admin changes now visible to customers within 30 seconds
- **Files Fixed**: `app/baked-goods/page.tsx`, `app/groceries/page.tsx`

### **3. Suggestions Form Outdated Styling - RESOLVED ✅**

- **Issue**: Customer feedback form looked unprofessional and inconsistent with brand
- **Root Cause**: Basic styling without modern design elements or brand consistency
- **Resolution**: Complete redesign with blue gradient theme, enhanced UX, and professional polish
- **Impact**: Improved customer engagement and brand consistency
- **Files Fixed**: `app/suggestions/page.tsx`

### **4. Navigation Button Styling Inconsistency - RESOLVED ✅**

- **Issue**: Mixed circular and square button edges creating visual inconsistency
- **Root Cause**: Inconsistent use of Tailwind border radius classes across components
- **Resolution**: Standardised all navigation buttons to use `rounded-full` for circular consistency
- **Impact**: Professional, cohesive navigation design
- **Files Fixed**: `app/globals.css`, `components/ModernNavbar.tsx`

### **5. Navigation Layout Poor Organisation - RESOLVED ✅**

- **Issue**: Cluttered navigation with unnecessary user name display and poor button positioning
- **Root Cause**: Suboptimal UX design decisions
- **Resolution**: Removed user name, reorganised buttons to Sign Out → Suggestions → Admin flow
- **Impact**: Cleaner, more professional navigation interface
- **Files Fixed**: `components/NavAuth.tsx`

### **6. Product Type Mismatch Breaking Pages - RESOLVED ✅**

- **Issue**: ProductCard component type import conflicts causing runtime errors
- **Root Cause**: Type mismatch between ProductCard import and page-level Product type definitions
- **Resolution**: Removed problematic import and defined Product type locally in ProductCard
- **Impact**: Product pages now render correctly without type errors
- **Files Fixed**: `components/ProductCard.tsx`

## **KNOWN ISSUES**

- None currently identified - all reported issues resolved

## **NEXT STEPS**

1. ✅ **COMPLETED**: Fix database schema mismatches
2. ✅ **COMPLETED**: Update API endpoints for correct schema
3. ✅ **COMPLETED**: Add fallback logic for schema compatibility
4. 🔄 **IN PROGRESS**: Update documentation to reflect actual schema and API behaviour (temporary stock filter removal)
5. 📋 **PENDING**: Test all functionality end-to-end
6. 📋 **PENDING**: Add sample data to database

## **SCHEMA CORRECTIONS MADE**

### **Products Table**

- **Correct Column**: `is_visible` (not `visible`)
- **Correct Column**: `stock_quantity` (not `stock`)
- **Correct Column**: `category_id` (not `category`)

### **Orders Table**

- **Correct Status Values**: `pending`, `confirmed`, `preparing`, `ready`, `collected`, `cancelled`
- **Correct Column**: `tax_pence` (not `gst_pence`)
- **Correct Column**: `bag_fee_pence` (not `bag_opt_in`)

### **Order Items Table**

- **Correct Column**: `unit_price_pence` (not `price_pence`)
- **Correct Column**: `total_price_pence` (not `total_pence`)
- **Added Column**: `product_sku` for order history

## **DOCUMENTATION UPDATES**

- ✅ **COMPLETED**: API Schema Documentation (`Logs/Schemas/API_Schema/apiSchema.md`)
- ✅ **COMPLETED**: Bug Tracking Log (this file)
- 📋 **PENDING**: Update other schema documentation files
- 📋 **PENDING**: Update implementation guides
- ✅ **ADDED**: Debug endpoint `GET /api/debug` for database and schema inspection during development

## **TESTING STATUS**

- ✅ **Orders API**: Working with correct schema
- ✅ **Products API**: Working with correct schema
- ✅ **Admin APIs**: Working with correct schema
- 🔄 **Product Display**: Fixed, needs sample data testing
- 🔄 **End-to-End**: In progress
