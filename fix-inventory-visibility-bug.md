# 🔧 Fix: Inventory Visibility Bug

## **Root Cause Analysis**

After systematic investigation, the bug in admin inventory product visibility has been identified:

### **Issue Location: Export Route Schema Mismatch**

**File**: `app/api/admin/inventory/export/route.ts`
**Lines**: 22-23

```typescript
// ❌ INCORRECT - Using old schema fields
stock, visible;
```

**Should be**:

```typescript
// ✅ CORRECT - Using new schema fields
stock_quantity, is_visible;
```

### **Root Cause**

The export route is still using the old database schema field names (`stock`, `visible`) instead of the new schema names (`stock_quantity`, `is_visible`). This causes database query failures that may affect the overall inventory management system.

## **Primary Fix Required**

### **1. Fix Export Route Schema (CRITICAL)**

Update `app/api/admin/inventory/export/route.ts`:

```typescript
// Line 8-25: Fix the select query
const { data, error } = await admin
	.from("products")
	.select(
		`
        id,
        name,
        category_id,
        categories!inner(id, name, slug),
        price_pence,
        pack_label,
        allergens,
        ingredients,
        short_description,
        image_url,
        stock_quantity,    // ✅ Fixed: was 'stock'
        is_visible         // ✅ Fixed: was 'visible'
    `
	)
	.order("name", { ascending: true });
```

### **2. Secondary Issues Identified**

#### **Cache Invalidation Enhancement**

The products API has a 30-second cache refresh mechanism. For immediate admin changes, we may need to enhance the cache invalidation:

**File**: `app/baked-goods/page.tsx`, `app/groceries/page.tsx`

Current cache strategy works, but consider adding immediate cache bust on admin changes.

## **Implementation Plan**

### **Step 1: Fix Export Route Schema**

```bash
# Update app/api/admin/inventory/export/route.ts
# Change 'stock' to 'stock_quantity'
# Change 'visible' to 'is_visible'
```

### **Step 2: Test Visibility Toggle**

1. Admin > Inventory > Edit Chocolate Cookies
2. Set visibility to "No"
3. Save changes
4. Check `/baked-goods` page (should not show)
5. Set visibility to "Yes"
6. Check `/baked-goods` page (should show)

### **Step 3: Verify Debug Logs**

Console should show:

```
🔍 PATCH DEBUG - Product ID: 3e8640e8-c4dd-40f0-bd51-929b660b9a9d
🔍 PATCH DEBUG - Update data to send: { is_visible: false }
✅ PATCH SUCCESS - Data returned from DB: { ..., is_visible: false }
```

## **Verification Steps**

### **Before Fix**

- Export route may cause database errors
- Potential interference with inventory system

### **After Fix**

- Export route works correctly
- Product visibility changes reflect immediately
- Debug logs confirm proper data flow

## **Additional Recommendations**

### **1. Schema Consistency Audit**

Review all API routes to ensure consistent use of new schema:

- ✅ `app/api/products/route.ts` - Uses correct schema
- ✅ `app/api/admin/inventory/route.ts` - Uses correct schema
- ❌ `app/api/admin/inventory/export/route.ts` - Needs fix
- ❓ Other routes may need review

### **2. Enhanced Testing**

Add automated tests for:

- Product visibility toggle
- Schema consistency across APIs
- Cache invalidation timing

### **3. Documentation Updates**

Update API documentation to reflect schema changes and troubleshooting procedures.

## **Success Criteria**

✅ Admin can hide products and they disappear from customer pages immediately  
✅ Admin can show products and they appear on customer pages immediately  
✅ Export functionality works without database errors  
✅ Debug logs confirm proper data transformation  
✅ No schema inconsistencies remain in codebase
