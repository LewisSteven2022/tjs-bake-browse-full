# 🐛 Bug Investigation: Inventory Visibility Issue

## **Issue Description**

When admin sets a product to "not visible" via Admin > Inventory > Edit Product, the change appears to save successfully but the product still shows on customer-facing pages like `/baked-goods`.

## **Steps to Reproduce**

1. Login as admin
2. Navigate to Admin > Inventory
3. Click "Edit Product" button on chocolate cookies product
4. Set item visibility to "No" (uncheck the checkbox)
5. Save changes
6. Check `/baked-goods` page - product still shows (BUG)
7. Return to inventory and set visibility back to "Yes"
8. Check `/baked-goods` page - product should show (TEST)

## **Investigation Findings**

### **Frontend Data Flow (Admin Inventory)**

- **Type Definition**: Uses `visible: boolean` property (line 25)
- **Save Payload**: Sends `visible: p.visible` in payload (line 131)
- **UI Update**: Immediately updates local state (line 155-157)

### **Backend API Processing (/api/admin/inventory)**

- **Payload Transformation**: Correctly maps `visible` → `is_visible` (line 75)
- **Database Update**: Updates `is_visible` field in products table (line 107-110)
- **Response**: Returns updated data with backward compatibility (line 135-144)

### **Customer-Facing API (/api/products)**

- **Filtering**: Correctly filters by `is_visible: true` (line 42)
- **Cache Control**: Uses `force-dynamic` (line 5)
- **Response**: Should only return visible products

## **Potential Root Causes**

### **1. Data Mapping Issue**

- Frontend uses `visible` but database uses `is_visible`
- Backend correctly maps between them
- **Status**: ✅ Working correctly

### **2. Database Transaction Issue**

- Update might not be committed properly
- **Need to test**: Check if database actually updates

### **3. Cache Invalidation Issue**

- Products API might be serving cached results
- 30-second cache refresh might not be working
- **Need to test**: Check if delay resolves issue

### **4. Race Condition**

- Multiple updates happening simultaneously
- **Need to test**: Sequential updates

## **Debugging Steps**

### **Step 1: Verify Database Update**

- Check if `is_visible` field actually changes in database
- Use debug logs in backend API

### **Step 2: Test API Response**

- Call `/api/products` directly after update
- Check if product appears in response

### **Step 3: Check Cache Behavior**

- Test if waiting 30+ seconds resolves issue
- Check timestamp-based cache busting

### **Step 4: Verify Frontend State**

- Check if admin UI reflects the correct state
- Verify checkbox state after save

## **Current Status: INVESTIGATING**

**Next Action**: Run systematic test to reproduce issue and identify exact failure point.
