## 🎯 TJ's Bake & Browse - Project To-Do List

## 🚨 **CURRENT PRIORITIES**

### **1. UI/UX Improvements** ⭐ **HIGH PRIORITY**

- [ ] **BUG**: Product price updates via admin/inventory not reflecting on website (price changes in DB but not displayed to customers) - date logged: 2025-08-14
- [ ] **BUG**: Product image URL shows in admin inventory but not on customer product cards (API data flow issue) - date logged: 2025-08-14
- [x] **FEATURE**: Add Image URL field to product edit modal in admin interface - date logged: 2025-08-14
- [x] **DOCUMENTATION**: Create technical guide mapping complete image rendering process - date logged: 2025-08-14
- [ ] Confirm product visibility policy: hide out-of-stock items vs show with label. If hiding, re-enable `stock_quantity > 0` filter in `app/api/products/route.ts`; if showing, add "Out of stock" badge in UI. - date logged: 2025-08-14
- [ ] Add dropdown filter to Orders dashboard to filter by order status - date logged: 2025-08-14

### **2. Operating Hours Configuration** ⭐ **HIGH PRIORITY**

- [ ] Review the enhancements.md file in /docs and start planning out and implementing the task 'Configurable Operating Hours & Schedule Management' - date logged: 2025-08-14
- [ ] Connect existing `business_hours` database table to slot generation system - date logged: 2025-08-14
- [ ] Create admin interface for managing daily operating hours - date logged: 2025-08-14
- [ ] Update `/app/api/slots/route.ts` to read from database instead of hardcoded values - date logged: 2025-08-14
- [ ] Update `/lib/slots.ts` to accept database-driven hours - date logged: 2025-08-14
- [ ] Add holiday/closure date management functionality - date logged: 2025-08-14
- [ ] Test slot generation with configurable hours - date logged: 2025-08-14

### **3. Quick Wins (Immediate)** ⭐ **HIGH PRIORITY**

- [x] Change sitewide colour theme and button layout to match `test-styling/about-modern` (propagate palette and component styles) - date logged: 2025-08-14 (COMPLETED)
- [x] Put new navbar into global header so it is used site-wide (replace current header with `components/test/TestNavbar` variant) - date logged: 2025-08-14 (COMPLETED)
- [x] Fix admin orders: add support for "Rejected" status - date logged: 2025-08-14 (COMPLETED)
- [x] Update quick mark buttons to include "Set Unpaid" - date logged: 2025-08-14 (COMPLETED)
- [x] Add modern social links for Instagram and Facebook (header/footer) - date logged: 2025-08-14 (COMPLETED)

### **4. Admin Orders – Details & Amendments** ⭐ **HIGH PRIORITY**

- [ ] Expose full order details (with items) to Admin UI - date logged: 2025-08-14
  - [ ] Backend: Extend `GET /api/admin/orders/[id]` to include `order_items` (fields: `product_id`, `product_name`, `product_sku`, `quantity`, `unit_price_pence`, `total_price_pence`) - date logged: 2025-08-14
  - [ ] Backend: Include `bag_opt_in` and compute bag fee via fees repo (already dynamic) when returning the order - date logged: 2025-08-14
  - [ ] Backend: Add lightweight `GET /api/admin/orders/:id/summary` (optional) for list views - date logged: 2025-08-14
- [ ] Allow admins to edit orders safely (phase 1) - date logged: 2025-08-14
  - [ ] Backend: `PATCH /api/admin/orders/[id]` accept updates for `status`, `pickup_date`, `pickup_time`, `customer_name`, `customer_email`, `customer_phone`, `bag_opt_in`, `special_instructions` - date logged: 2025-08-14
  - [ ] Backend: Recalculate `bag_fee_pence`, `tax_pence`, `total_pence` server-side using current fees and GST rules - date logged: 2025-08-14
  - [ ] Validation: forbid edits on `collected` (or require explicit override) - date logged: 2025-08-14
  - [ ] Return updated order with same shape as GET - date logged: 2025-08-14
- [ ] Items editing (phase 2) - date logged: 2025-08-14
  - [ ] Define operations API: `PATCH /api/admin/orders/[id]/items` with `{ ops: Array< { type: 'updateQuantity' | 'addItem' | 'removeItem', item_id?, product_id?, product_name?, product_sku?, quantity?, unit_price_pence? } > }` - date logged: 2025-08-14
  - [ ] Perform atomically (preferred): create a Postgres RPC `admin_edit_order(…)` to apply ops and recalc `subtotal_pence`, `tax_pence`, `total_pence` in a single transaction - date logged: 2025-08-14
  - [ ] Fallback (temporary): sequential supabase-js ops with compensating rollback on failure - date logged: 2025-08-14
  - [ ] Return updated order (including items) - date logged: 2025-08-14
- [ ] Audit and notifications (Phase 3) - date logged: 2025-08-14
  - [ ] Insert into `audit_logs` on any admin edit (old_values vs new_values, user_id, action, table_name='orders') - date logged: 2025-08-14
  - [ ] Optional: send email to customer if `pickup_date/time` or items changed - date logged: 2025-08-14
- [ ] Access and safety - date logged: 2025-08-14
  - [ ] Ensure only admins can call new endpoints (middleware + RLS where applicable) - date logged: 2025-08-14
  - [ ] Add server-side validation to stop edits on `collected` orders (or require override) - date logged: 2025-08-14
- [ ] Documentation & tests - date logged: 2025-08-14
  - [ ] Update `Logs/API_Documentation/apiDocumentation.md.md` with new endpoints, payloads, and examples - date logged: 2025-08-14
  - [ ] Update `Logs/Schemas/API_Schema/apiSchema.md` to show order-items relationship in admin responses - date logged: 2025-08-14
  - [ ] Add tests for: details fetch, bag toggle, status change, item quantity edit, add/remove item - date logged: 2025-08-14

### **5. Admin Configuration Features** ⭐ **HIGH PRIORITY**

- [ ] **FEATURE**: Add admin dashboard interface to change bag fee price (update `configurable_fees` table and reflect on checkout/orders) - date logged: 2025-08-14
- [ ] **FEATURE**: Implement direct image upload functionality for products in admin interface - date logged: 2025-08-14
- [ ] Create admin page for managing configurable fees - date logged: 2025-08-14
- [ ] Build image upload component with drag-and-drop support - date logged: 2025-08-14
- [ ] Integrate Supabase storage for reliable image hosting - date logged: 2025-08-14
- [ ] Add automatic image resizing and optimisation - date logged: 2025-08-14
- [ ] Update checkout process to dynamically fetch bag fee from database - date logged: 2025-08-14
- [ ] Ensure bag fee changes reflect immediately on all order/checkout pages - date logged: 2025-08-14
- [ ] Add validation for fee price changes (min/max limits) - date logged: 2025-08-14
- [ ] Support multiple images per product (use existing `product_images` table) - date logged: 2025-08-14
- [ ] Test fee updates across different order scenarios - date logged: 2025-08-14

### **6. Cart & Account Enhancements** ⭐ **HIGH PRIORITY**

- [ ] Migrate cart from localStorage to database-backed persistent cart (per-user) - date logged: 2025-08-14
- [ ] Add user account pages for order history - date logged: 2025-08-14
- [ ] Implement persistent user preferences - date logged: 2025-08-14
- [ ] Checkout to prompt for phone number; capture mobile at signup and prefill at checkout - date logged: 2025-08-14

### **7. Suggestions System** ⭐ **HIGH PRIORITY**

- [ ] Bug: Suggestions form does not post to DB; no `suggestions` table exists. - date logged: 2025-08-14
  - [x] Decide on schema: `id`, `user_id`, `user_name`, `user_email`, `category`, `subject`, `message`, `created_at` - date logged: 2025-08-14
  - [x] Add idempotent SQL to create table and RLS in `database_fixes.sql` - date logged: 2025-08-14
  - [x] Insert into DB from `app/api/suggestions/route.ts` - date logged: 2025-08-14
  - [x] Add tests to confirm successful submission and DB insert - date logged: 2025-08-14
  - [ ] Deploy DB changes and verify in Supabase - date logged: 2025-08-14

---

## 🎉 **RECENTLY COMPLETED**

- **Modern UI Implementation** - Complete theme modernization matching about-modern design
  - Implemented modern blue color palette with gradient backgrounds
  - Replaced global navbar with ModernNavbar component
  - Updated all button styles and spacing for modern look
  - Fixed TypeScript build errors and added Suspense boundaries
- **Admin Orders** - Added "Rejected" status to options; updated quick mark buttons to include "Set Unpaid"
- **Social Links** - Added modern social links (header/footer)

---

**Last Updated:** 2025-08-14  
**Status:** ACTIVE DEVELOPMENT  
**Next Review:** Weekly
