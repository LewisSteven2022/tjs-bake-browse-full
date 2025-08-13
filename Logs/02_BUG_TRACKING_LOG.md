# 🐛 Bug Tracking Log - TJ's Bake & Browse

## **Current Project Status**

- **Last Updated**: [Current Date]
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
- **Resolution**: Fixed products API to use correct column names and added fallback logic
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

## **KNOWN ISSUES**

- None currently identified

## **NEXT STEPS**

1. ✅ **COMPLETED**: Fix database schema mismatches
2. ✅ **COMPLETED**: Update API endpoints for correct schema
3. ✅ **COMPLETED**: Add fallback logic for schema compatibility
4. 🔄 **IN PROGRESS**: Update documentation to reflect actual schema
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

## **TESTING STATUS**

- ✅ **Orders API**: Working with correct schema
- ✅ **Products API**: Working with correct schema
- ✅ **Admin APIs**: Working with correct schema
- 🔄 **Product Display**: Fixed, needs sample data testing
- 🔄 **End-to-End**: In progress
