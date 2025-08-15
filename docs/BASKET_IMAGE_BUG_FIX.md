# Basket Page Image Display Bug - Analysis & Fix

## Issue Summary
Product images were not displaying on the basket page (`/basket`), showing only fallback shopping bag icons instead of product photos.

## Root Cause Analysis

### Problem #1: Missing image_url in cart items
**Location**: `components/ProductCard.tsx:30-35`

When adding items to the cart via the "Add to Cart" button, the `addItem()` function call was missing the `image_url` parameter:

```typescript
// ❌ Before (missing image_url)
await addItem({
    product_id: product.id,
    name: product.name,
    price_pence: product.price_pence,
    qty: 1,
    // Missing: image_url: product.image_url
});
```

**Result**: Cart items stored in localStorage had no `image_url` property, causing basket page to show fallback icons.

### Problem #2: Incomplete data merging in addItem()
**Location**: `lib/cart.ts:49-65`

When adding an existing product to cart, the function only updated quantity but didn't merge other properties like `image_url`:

```typescript
// ❌ Before (incomplete merging)
if (existingItem) {
    existingItem.qty += newItem.qty; // Only updates quantity
} else {
    items.push(newItem);
}
```

**Result**: Existing cart items never got updated with image URLs even when the fix was applied.

### Problem #3: setCart() missing image_url
**Location**: `lib/cart.ts:137-143`

The `setCart()` utility function used for cart migration was missing `image_url` when re-adding items:

```typescript
// ❌ Before (missing image_url)
addItem({
    product_id: i.product_id,
    name: i.name,
    price_pence: i.price_pence,
    qty: i.qty,
    // Missing: image_url: i.image_url
});
```

## Solutions Implemented

### Fix #1: Include image_url in ProductCard
**File**: `components/ProductCard.tsx:34`

```typescript
// ✅ After (includes image_url)
await addItem({
    product_id: product.id,
    name: product.name,
    price_pence: product.price_pence,
    image_url: product.image_url,  // ← Added this line
    qty: 1,
});
```

### Fix #2: Enhanced addItem() data merging
**File**: `lib/cart.ts:49-65`

```typescript
// ✅ After (complete property merging)
if (existingItem) {
    // Update quantity and merge other properties if item already exists
    existingItem.qty += newItem.qty;
    // Update image_url and other properties if they're provided
    if (newItem.image_url !== undefined) {
        existingItem.image_url = newItem.image_url;
    }
    if (newItem.name) {
        existingItem.name = newItem.name;
    }
    if (newItem.price_pence) {
        existingItem.price_pence = newItem.price_pence;
    }
} else {
    items.push(newItem);
}
```

### Fix #3: Include image_url in setCart()
**File**: `lib/cart.ts:147-155`

```typescript
// ✅ After (includes image_url)
addItem({
    product_id: i.product_id,
    name: i.name,
    price_pence: i.price_pence,
    image_url: i.image_url,  // ← Added this line
    qty: i.qty,
});
```

### Fix #4: Enhanced basket page image handling
**File**: `app/basket/page.tsx:129-143`

```typescript
// ✅ Enhanced image rendering with error handling
<div className="w-16 h-16 bg-neutral-50 flex items-center justify-center overflow-hidden rounded">
    {item.image_url ? (
        <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
            }}
        />
    ) : null}
    <ShoppingBag className={`w-6 h-6 text-neutral-400 ${item.image_url ? 'hidden' : ''}`} />
</div>
```

## Additional Improvements

### Basket Page Spacing Optimization
Condensed spacing throughout the basket page for better visual density:

- Header margin: `mb-12` → `mb-8`
- Item spacing: `space-y-6 mb-12` → `space-y-4 mb-8`
- Item padding: `pb-6` → `pb-4`
- Item gaps: `space-x-6` → `space-x-4`
- Image size: `w-20 h-20` → `w-16 h-16`
- Quantity controls: `space-x-3` → `space-x-2`
- Quantity display: `w-12` → `w-10`
- Order summary: `p-8 mb-8` → `p-6 mb-6`

## Testing & Verification

### For existing cart items (before fix):
1. Clear browser localStorage: `localStorage.removeItem('tjs-cart')`
2. Add new products to cart
3. Verify images display correctly in basket

### For new cart items (after fix):
1. Add products to cart from product pages
2. Navigate to `/basket`
3. Confirm product images display properly
4. Test error handling by using invalid image URLs

## Data Migration Note

**Important**: Users with existing cart items (added before this fix) will need to:
1. Clear their cart and re-add items, OR
2. The system will automatically update image URLs when users add the same products again due to Fix #2

## Files Modified

1. `components/ProductCard.tsx` - Added image_url to addItem call
2. `lib/cart.ts` - Enhanced addItem() merging and fixed setCart()
3. `app/basket/page.tsx` - Improved image handling and spacing
4. `docs/BASKET_IMAGE_BUG_FIX.md` - This documentation

## Type Definitions

The `CartItem` type already supported `image_url` as an optional field:

```typescript
export type CartItem = {
    product_id: string;
    name: string;
    price_pence: number;
    image_url?: string | null;  // ← Was already defined correctly
    qty: number;
};
```

## Prevention

To prevent similar issues in the future:

1. **Always include all CartItem properties** when calling `addItem()`
2. **Test cart functionality** after modifying product display components
3. **Verify localStorage data structure** matches TypeScript types
4. **Consider automated tests** for cart operations

## Status
✅ **RESOLVED** - All basket page image display issues have been fixed and spacing optimized.