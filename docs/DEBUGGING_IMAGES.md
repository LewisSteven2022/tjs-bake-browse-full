# 🔍 Data Flow Debugging Guide

## ✅ RESOLVED: Images and Prices Show in Admin but Not on Product Cards

**Problem**: Image URLs and prices updated in database, visible in admin inventory, but not showing on customer-facing product cards.

**Root Cause**: `/api/products` transformation not explicitly preserving critical fields.

**Resolution**: Added explicit field preservation in transformation object.

## Debugging Steps

### 1. **Check Database Directly**

```sql
-- Find the specific product and check image_url
SELECT id, name, image_url, is_visible, stock_quantity, category_id
FROM products
WHERE name LIKE '%your-product-name%';
```

### 2. **Test API Endpoints Directly**

#### Admin Inventory API (Working)

```
GET /api/admin/inventory
```

**Expected**: Should show image_url in response

#### Customer Products API (Potentially Issues)

```
GET /api/products
```

**Check**: Does this response include the image_url field for your product?

### 3. **Check API Response Format**

The `/api/products` endpoint does this transformation:

```javascript
const transformed = {
	...product,
	// Backward compatibility mapping
	stock: product.stock_quantity,
	visible: product.is_visible,
	category: product.category_id,
	description: product.short_description,
	categories: categoriesArray,
};
```

**⚠️ FIXED ISSUE**: `image_url` and `price_pence` were not explicitly preserved in this transformation!

### 4. **Browser DevTools Check**

1. Open baked-goods or groceries page
2. Open Network tab
3. Look for `/api/products` request
4. Check response - does it contain `image_url` for your product?

### 5. **Category Filtering Issue**

Check if your product has the correct category assignment:

- **Baked Goods**: Should have category with `slug = "baked_goods"`
- **Groceries**: Should have category with `slug = "groceries"`

## ✅ Root Cause Identified and Fixed

**The transformation in `/api/products` was losing critical fields!**

**Fixed code in `/app/api/products/route.ts`:**

```javascript
const transformed = {
	...product,
	// Backward compatibility mapping
	stock: product.stock_quantity,
	visible: product.is_visible,
	category: product.category_id,
	description: product.short_description,
	// Explicitly preserve critical fields to ensure they're not lost
	image_url: product.image_url, // ← Fixed!
	price_pence: product.price_pence, // ← Fixed!
	categories: categoriesArray,
};
```

**Resolution**: While the `...product` spread should include all fields, explicit preservation was needed to prevent data loss during transformation.
