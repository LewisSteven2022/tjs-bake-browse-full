# Basket & Checkout Page Improvements

## Summary
This document outlines the improvements made to the basket and checkout pages for better layout density, alignment, and functionality.

## Changes Made

### 1. Basket Page Layout Tightening (`/app/basket/page.tsx`)

**Spacing Improvements:**
- Header margin: `mb-8` → `mb-6`, link margin: `mb-6` → `mb-4`
- Items container: `space-y-4 mb-8` → `space-y-3 mb-6`
- Individual items: `pb-4` → `pb-3`, item gaps: `space-x-4` → `space-x-3`
- Product images: `w-16 h-16` → `w-14 h-14`, icons: `w-6 h-6` → `w-5 h-5`
- Quantity controls: `space-x-2` and quantity width: `w-12` → `w-10`
- Order Summary: `p-6 mb-6` → `p-5 mb-5`, spacing: `space-y-3` → `space-y-2`

**Result:** More condensed layout without being cramped, better visual density throughout.

### 2. Checkout Page Alignment Fixes (`/app/checkout/page.tsx`)

**Your Details Section Alignment:**
```typescript
// Fixed indentation issue by adding negative margin
<section className="card-elegance border border-neutral-200 p-8 -ml-1">
```

**Pickup Section Alignment:**
```typescript
// Applied same alignment fix for consistency
<section className="card-elegance border border-neutral-200 p-8 -ml-1">
```

**Result:** "Your Details" and "Pickup" sections now align perfectly with the checkbox start position.

### 3. Contact Number Field Addition

**Customer Type Updated:**
```typescript
type Customer = {
    name: string;
    email: string;
    mobile: string;  // ← Added this
};
```

**New Input Field Added:**
```jsx
<div>
    <label className="label-elegance">Contact Number</label>
    <input
        type="tel"
        value={customer.mobile}
        onChange={(e) =>
            setCustomer({ ...customer, mobile: e.target.value })
        }
        className="input-elegance"
        placeholder={customer.mobile || "07123 456 789"}
    />
</div>
```

**Database Integration:**
- Modified `/api/user/preferences` to fetch `mobile` field from database
- Updated checkout page to populate mobile field from user's database record
- Added mobile field to form validation and order payload

### 4. API Enhancements (`/app/api/user/preferences/route.ts`)

**Database Query Updated:**
```typescript
// Before
const { data, error } = await admin.from("users").select("bag_pref").eq("id", userId).maybeSingle();

// After  
const { data, error } = await admin.from("users").select("bag_pref, mobile").eq("id", userId).maybeSingle();
```

**Response Enhanced:**
```typescript
// Before
return NextResponse.json({ bag_pref: data?.bag_pref ?? null });

// After
return NextResponse.json({ 
    bag_pref: data?.bag_pref ?? null, 
    mobile: data?.mobile ?? null 
});
```

### 5. Form Validation & Order Processing

**Validation Added:**
```typescript
const validateForm = () => {
    // ... existing validations
    if (!customer.mobile.trim()) return "Please enter your contact number.";
    // ... rest of validations
};
```

**Order Payload Updated:**
```typescript
const payload = {
    items,
    bag_opt_in: bag,
    pickup_date: date,
    pickup_time: time,
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.mobile,  // ← Added this
};
```

## Database Schema Reference

The user's contact number is stored in the `users` table under the `mobile` column:
```sql
CREATE TABLE users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    name text NOT NULL,
    mobile text NOT NULL,  -- ← This field is used
    role text DEFAULT 'user',
    -- ... other fields
);
```

## User Experience Improvements

1. **Tighter Layout**: Basket page feels more compact and efficient
2. **Perfect Alignment**: All form sections align correctly with interactive elements
3. **Auto-populated Fields**: User's mobile number automatically appears from their account
4. **Required Field**: Mobile number is now mandatory for order completion
5. **Better Validation**: Clear error messages for all required fields

## Technical Notes

- Mobile number is fetched asynchronously from the `/api/user/preferences` endpoint
- If user has no mobile number in database, placeholder shows example format
- The mobile field is preserved in localStorage with other customer details
- TypeScript types updated to include mobile field throughout the flow
- API backend already supported `customer_phone` field from the order route

## Files Modified

1. `/app/basket/page.tsx` - Layout tightening and spacing improvements
2. `/app/checkout/page.tsx` - Alignment fixes and mobile field addition
3. `/app/api/user/preferences/route.ts` - Database query enhancement
4. `/docs/BASKET_CHECKOUT_IMPROVEMENTS.md` - This documentation

## Testing

- ✅ Build compilation successful
- ✅ TypeScript type checking passes
- ✅ Form validation includes mobile field
- ✅ Database integration for mobile field works
- ✅ Layout improvements applied correctly
- ✅ Alignment issues resolved

## Next Steps

Users will now see:
1. A more compact, professional-looking basket page
2. Properly aligned form sections on checkout
3. Their mobile number pre-filled from their account
4. Required mobile number validation before order completion

The improvements maintain the elegant design language while making the interface more efficient and user-friendly.