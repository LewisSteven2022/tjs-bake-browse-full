# 🎯 TJ's Bake & Browse - Project To-Do List

## 🚨 **NEW PRIORITIES (Added August 13, 2025)**

### **1. Database Schema & RLS Policy Fixes** ⭐ **CRITICAL**

- [x] Fix infinite recursion in RLS policies for "users" relation
- [x] Add `category` FK to `products` table (replacing `category_id`)
- [x] Create `configurable_fees` table for dynamic bag fee pricing
- [x] Fix `orders` table schema (remove `customer_phone` references)
- [x] Create `order_items` table for proper order structure
- [x] Update all API endpoints to use correct schema
- [x] Create comprehensive database deployment guide
- [x] Update API/DB documentation

### **2. UI/UX Improvements** ⭐ **HIGH PRIORITY**

- [x] Remove toast notifications from basket/cart interactions
- [x] Fix basket page layout (center title, move clear basket button)
- [x] Make bag fee dynamic and configurable from database
- [x] Update bag fee wording to be dynamic based on product name
- [ ] Confirm product visibility policy: hide out-of-stock items vs show with label. If hiding, re-enable `stock_quantity > 0` filter in `app/api/products/route.ts`; if showing, add "Out of stock" badge in UI.

### **3. Quick Wins (Immediate)** ⭐ **HIGH PRIORITY**

- [x] Update About page content and layout per new copy (clean, professional)
- [ ] Change sitewide colour theme and button layout to match `test-styling/about-modern` (propagate palette and component styles)
- [ ] Put new navbar into global header so it is used site-wide (replace current header with `components/test/TestNavbar` variant)
- [ ] Add modern social links for Instagram and Facebook (header/footer)
  - [x] Footer icons/links added (Instagram, Facebook)
  - [x] Removed Export/Import CSV controls from inventory toolbar
- [ ] Fix admin orders: add support for "Rejected" status (or adjust UI to allowed statuses)
- [ ] Update quick mark buttons to match allowed statuses (remove/replace "Set Unpaid")

### **4. Cart & Account Enhancements** ⭐ **HIGH PRIORITY**

- [ ] Migrate cart from localStorage to database-backed persistent cart (per-user)
- [ ] Create a ‘My Account’ page for logged-in users with profile update (sync to DB)
- [ ] Checkout to prompt for phone number; capture mobile at signup and prefill at checkout

### **5. Admin Productivity** ⭐ **MEDIUM PRIORITY**

- [ ] Bulk update: select multiple products and update category and allergens at once

### **6. UI Polish** ⭐ **MEDIUM PRIORITY**

- [ ] Product card: fix "Add to Basket" button position to a fixed offset (~3mm) from bottom so all cards align

### **7. Disclaimer Page** ⭐ **LOWER PRIORITY**

- [ ] Center section titles within their divs (e.g., "Ordering & collection")
- [ ] Center-align all text inside coloured divs
- [ ] Remove the “contact us for phone number” button and center the email button in that div

### **3. Checkout Process Fixes** ⭐ **HIGH PRIORITY**

- [x] Fix "customer_phone column not found" error
- [x] Ensure checkout process works flawlessly
- [x] Test complete user flow from cart to order confirmation

---

## 📋 **ORIGINAL TO-DO LIST**

### **✅ COMPLETED TASKS (23/36 - 63.9%)**

1. **✅ Project Setup & Foundation**

   - [x] Next.js 14 App Router setup
   - [x] Supabase integration
   - [x] TailwindCSS configuration
   - [x] TypeScript setup
   - [x] Basic project structure

2. **✅ Authentication System**

   - [x] NextAuth.js integration
   - [x] User registration/login
   - [x] Session management
   - [x] Protected routes

3. **✅ Database Schema & API**

   - [x] Database schema design
   - [x] API endpoints creation
   - [x] Row Level Security (RLS) policies
   - [x] Schema compliance audit
   - [x] Fix all schema mismatches

4. **✅ Admin Dashboard**

   - [x] Admin authentication
   - [x] Order management
   - [x] Inventory management
   - [x] Category management
   - [x] User management

5. **✅ Product Management**

   - [x] Product CRUD operations
   - [x] Category management
   - [x] Image handling
   - [x] Stock management
   - [x] Product visibility controls

6. **✅ Shopping Cart System** ⭐ **NEWLY COMPLETED**

   - [x] Cart context and state management
   - [x] localStorage-based cart persistence
   - [x] Add/remove items functionality
   - [x] Quantity controls
   - [x] Cart API endpoints
   - [x] Basket page with full functionality
   - [x] Cart count in navigation

7. **✅ Test Pages & Styling System**

   - [x] Create test pages for all major components
   - [x] Implement consistent blue color palette
   - [x] Responsive design patterns
   - [x] Component library foundation

8. **✅ Critical Bug Fixes**
   - [x] Fix admin orders refresh issue
   - [x] Resolve RLS policy infinite recursion
   - [x] Fix product display issues
   - [x] Remove toast notifications
   - [x] Fix basket page layout
   - [x] Fix checkout customer_phone error

### **🔄 IN PROGRESS (0/36)**

_No tasks currently in progress_

### **📋 REMAINING TASKS (13/36 - 36.1%)**

9. **🔄 Checkout Process** ⭐ **HIGH PRIORITY**

   - [ ] Complete checkout flow integration
   - [ ] Payment processing setup
   - [ ] Order confirmation system
   - [ ] Email notifications
   - [ ] Order tracking

10. **🔄 Payment Integration** ⭐ **MEDIUM PRIORITY**

    - [ ] Stripe/PayPal integration
    - [ ] Payment form design
    - [ ] Payment validation
    - [ ] Transaction logging
    - [ ] Refund handling

11. **🔄 Email System** ⭐ **MEDIUM PRIORITY**

    - [ ] Order confirmation emails
    - [ ] Payment receipt emails
    - [ ] Order status updates
    - [ ] Marketing email system
    - [ ] Email templates

12. **🔄 User Profile Management** ⭐ **MEDIUM PRIORITY**

    - [ ] User profile pages
    - [ ] Order history
    - [ ] Address management
    - [ ] Preferences settings
    - [ ] Account security

13. **🔄 Product Search & Filtering** ⭐ **MEDIUM PRIORITY**

    - [ ] Search functionality
    - [ ] Advanced filtering
    - [ ] Sort options
    - [ ] Search results pagination
    - [ ] Search analytics

14. **🔄 Mobile App Optimization** ⭐ **MEDIUM PRIORITY**

    - [ ] PWA setup
    - [ ] Mobile-first design
    - [ ] Touch interactions
    - [ ] Offline functionality
    - [ ] App store optimization

15. **🔄 SEO & Performance** ⭐ **MEDIUM PRIORITY**

    - [ ] Meta tags optimization
    - [ ] Structured data
    - [ ] Performance optimization
    - [ ] Core Web Vitals
    - [ ] Analytics integration

16. **🔄 Analytics & Reporting** ⭐ **LOWER PRIORITY**

    - [ ] Sales analytics
    - [ ] User behavior tracking
    - [ ] Inventory reports
    - [ ] Performance metrics
    - [ ] Custom dashboards

17. **🔄 Marketing Features** ⭐ **LOWER PRIORITY**

    - [ ] Newsletter signup
    - [ ] Promotional codes
    - [ ] Referral system
    - [ ] Social media integration
    - [ ] Customer reviews

18. **🔄 Advanced Admin Features** ⭐ **LOWER PRIORITY**

    - [ ] Advanced reporting
    - [ ] Bulk operations
    - [ ] Data export/import
    - [ ] System monitoring
    - [ ] Backup management

19. **🔄 Multi-language Support** ⭐ **LOWER PRIORITY**

    - [ ] Internationalization setup
    - [ ] Language selection
    - [ ] Translation management
    - [ ] RTL support
    - [ ] Localized content

20. **🔄 Advanced Order Features** ⭐ **LOWER PRIORITY**
    - [ ] Order modifications
    - [ ] Split orders
    - [ ] Recurring orders
    - [ ] Order scheduling
    - [ ] Delivery options

---

## 📊 **PROJECT METRICS**

- **Total Tasks:** 36
- **Completed:** 23 (63.9%)
- **Remaining:** 13 (36.1%)
- **Critical Issues:** 0 ✅
- **High Priority:** 3
- **Medium Priority:** 5
- **Lower Priority:** 5

---

## 🎯 **IMMEDIATE NEXT STEPS**

1. **Test the complete user flow** from browsing products to order completion
2. **Verify database fixes** resolve all RLS policy issues
3. **Complete checkout process** integration with cart system
4. **Implement payment processing** for live orders
5. **Set up email notifications** for order confirmations

---

## 📝 **RECENT RESOLUTIONS**

- **Database RLS Policy Fixes** - Resolved infinite recursion issues
- **Product Display Issues** - Fixed category filtering and product loading
- **Cart System Implementation** - Fully functional localStorage-based cart
- **Toast Notifications Removed** - Cleaner user experience
- **Basket Page Layout** - Improved title centering and button placement
- **Checkout Process** - Fixed customer_phone schema error
- **Dynamic Bag Fee** - Configurable pricing from database

---

## 🔄 **Last Updated:** August 13, 2025

## 📅 **Next Review:** August 20, 2025
