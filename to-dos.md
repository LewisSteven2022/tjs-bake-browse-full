# TJ's Bake & Browse - Fresh To-Do List

## 📋 QUICK SUMMARY

**🚨 Critical Bugs:** 1 (Fix in 0.5-1 hour)  
**🚀 Quick Wins:** 5 (Complete in 2.5-3.5 hours)  
**🔧 Core Features:** 8 (Complete in 8-15 hours)  
**📊 Advanced Features:** 8 (Complete in 20-30 hours)  
**🆕 Future Ideas:** 5 (LLM-generated enhancements)

**Total Project Time:** 30-48 hours  
**Phase 1 (Today):** 3-4.5 hours - Critical fixes + quick wins  
**Phase 2 (This Week):** 8-15 hours - Core functionality  
**Phase 3 (Next Week):** 20-30 hours - Advanced features

---

## 🚨 CRITICAL BUGS (Fix First - High Impact)

### 1. Admin Inventory - Product Name Update Not Working

**Status:** ✅ COMPLETED  
**Priority:** CRITICAL  
**Estimated Time:** 0.5-1 hour  
**Impact:** High - Admin functionality broken  
**Description:** Product name updates in admin inventory dashboard are not working properly  
**Dependencies:** None  
**Notes:** **RESOLVED**: Added name field handling to PATCH method in `/api/admin/inventory/route.ts`. Product name updates now work correctly.

---

## 🚀 QUICK WINS (High Value, Low Effort)

### 3. Better Toast for Wrong Credentials

**Status:** ✅ COMPLETED  
**Priority:** HIGH  
**Estimated Time:** 0.5 hours  
**Impact:** Medium - User experience improvement  
**Description:** Change toast notification for wrong login credentials to something more meaningful  
**Dependencies:** None  
**Notes:** **RESOLVED**: NextAuth error handling already implemented with friendly error messages for wrong credentials

### 5. Product Images Scaling Fix

**Status:** ✅ COMPLETED  
**Priority:** HIGH  
**Estimated Time:** 1 hour  
**Impact:** Medium - Visual consistency  
**Description:** Product images scale outside the card, need margin around product cards for modern, professional look  
**Dependencies:** None  
**Notes:** **RESOLVED**: Fixed product image scaling, improved card spacing, added modern styling with hover effects and better visual hierarchy

### 6. Fix Admin Inventory SaveRow Function

**Status:** ✅ COMPLETED  
**Priority:** HIGH  
**Estimated Time:** 0.5 hours  
**Impact:** Medium - Admin efficiency  
**Description:** The saveRow function calls `load()` after save but this may not be updating the local state properly  
**Dependencies:** None  
**Notes:** **RESOLVED**: Added immediate local state update after successful save for better UX, eliminating the need to reload from server

### 7. Add to Basket Visual Feedback

**Status:** ✅ COMPLETED  
**Priority:** HIGH  
**Estimated Time:** 1 hour  
**Impact:** Medium - User experience  
**Description:** Visual change when item added to basket (animation, button colour change, etc.)  
**Dependencies:** None  
**Notes:** **RESOLVED**: Added button micro-animations, success state with green button, loading spinner, and ARIA live region for accessibility

### 8. Quick CSS Fixes for Product Cards

**Status:** ✅ COMPLETED  
**Priority:** HIGH  
**Estimated Time:** 0.5 hours  
**Impact:** Medium - Visual consistency  
**Description:** Fix product card spacing, image containment, and modern styling  
**Dependencies:** None  
**Notes:** **RESOLVED**: Implemented modern card design with rounded corners, better shadows, improved spacing, and professional styling

---

## 🔧 CORE FUNCTIONALITY (Medium Priority)

---

## 🎨 DESIGN & STYLING (Medium Priority)

### 13. Consistent Site Styling

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 5-8 hours  
**Impact:** Medium - Brand consistency  
**Description:** Style to be consistent across site with blue colour scheme from notifications, modern pastel look, professional and premium feel  
**Dependencies:** None  
**Notes:** Create test pages first (baked-goods, about, disclaimers) - DO NOT amend current site yet

### 14. Modern Site Look and Feel

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 5-8 hours  
**Impact:** Medium - User experience  
**Description:** Nicer, more modern look and feel to the site  
**Dependencies:** None  
**Notes:** Would be ideal to see a few test options before changing current files

---

## 🛠️ ADMIN FUNCTIONALITY (Medium Priority)

### 18. Admin Orders - Status Filtering

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours  
**Impact:** Medium - Admin efficiency  
**Description:** Filter orders by status (processing, ready, collected, rejected, cancelled)  
**Dependencies:** None  
**Notes:** Simple filter UI implementation

### 19. Admin Orders - Email Customer When Ready

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 3-4 hours  
**Impact:** Medium - Customer communication  
**Description:** Option to send email to customer when order is ready to collect  
**Dependencies:** Email system (already implemented)  
**Notes:** New feature to implement

---

## 📧 FEATURES & INTEGRATIONS (Lower Priority)

### 20. Suggestions Form

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Customer feedback  
**Description:** Implement suggestions form on website that emails business address (tjsbakeandbrowse@gmail.com)  
**Dependencies:** Email system (already implemented)  
**Notes:** Simple form with email integration

### 21. Mailing List Opt-in

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 1.5-2.5 hours  
**Impact:** Low - Marketing  
**Description:** Tick box during signup for mailing list (future products and special offers)  
**Dependencies:** User registration system (already implemented)  
**Notes:** DB column marketing_opt_in, RLS, export functionality

### 22. Legal Pages Update

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Compliance  
**Description:** Update app/legal/page.tsx with business address & phone number  
**Dependencies:** STEVE TO GET FROM TOM & JESS  
**Notes:** Business information needed

---

## 📊 DATA MANAGEMENT (Lower Priority)

### 25. CSV Import/Export - Products

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 4-6 hours  
**Impact:** Medium - Admin efficiency  
**Description:** CSV import/export functionality for products  
**Dependencies:** None  
**Notes:** Column validation, storage image mapping guidance, admin UI

### 26. CSV Import/Export - Orders

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Admin efficiency  
**Description:** CSV export functionality for orders  
**Dependencies:** None  
**Notes:** Date range filters, CSV streaming

---

## 📱 MOBILE & PERFORMANCE (Lower Priority)

### 28. Mobile Responsiveness Audit

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 3-5 hours  
**Impact:** Medium - User experience  
**Description:** Website must be optimised for mobile as majority of customers use mobile/tablets  
**Dependencies:** None  
**Notes:** Nav, grids, forms, tables, admin pages

### 29. Performance Optimisation

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 4-5 hours  
**Impact:** Low - Technical  
**Description:** Identify and fix performance bottlenecks  
**Dependencies:** None  
**Notes:** Database queries, image optimisation, caching

---

## 🔧 CONFIGURATION & SETTINGS (Lower Priority)

### 30. Configurable Slot Capacity

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Business flexibility  
**Description:** Change maximum customers per time slot (currently set to 1)  
**Dependencies:** None  
**Notes:** Database setting + UI in admin + backend check

### 31. Bag Cost & GST Configuration

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Business flexibility  
**Description:** Frontend management dashboard to update bag cost and GST rate  
**Dependencies:** None  
**Notes:** Database values for dynamic pricing

---

## 📚 DOCUMENTATION (Lower Priority)

### 32. Production Deployment Guide

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 3-4 hours  
**Impact:** Low - Developer support  
**Description:** Detailed step-by-step instructions for production deployment  
**Dependencies:** None  
**Notes:** Every file, Supabase, 3rd party apps, production readiness

### 33. CSV Import Instructions

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 1-2 hours  
**Impact:** Low - Admin training  
**Description:** Document CSV import process, required information, photo upload process  
**Dependencies:** None  
**Notes:** Column schema, data format, image handling

---

## 🚀 FUTURE IMPROVEMENTS BY LLM

### Email Flow System

**Description:** Comprehensive email automation for order lifecycle  
**Potential Value:** High - Improved customer communication and retention  
**Implementation:** Order confirmed, ready to collect, cancelled emails via Resend  
**Estimated Time:** 4-6 hours

### Advanced Analytics Dashboard

**Description:** Business intelligence and reporting system  
**Potential Value:** High - Data-driven business decisions  
**Implementation:** Sales analytics, customer behaviour insights, inventory forecasting  
**Estimated Time:** 8-12 hours

### Customer Loyalty Programme

**Description:** Points system and rewards for repeat customers  
**Potential Value:** Medium - Customer retention and increased orders  
**Implementation:** Points tracking, reward tiers, special offers  
**Estimated Time:** 10-15 hours

### Inventory Forecasting

**Description:** AI-powered stock prediction based on historical data  
**Potential Value:** Medium - Reduced waste and improved stock management  
**Implementation:** Machine learning model for demand prediction  
**Estimated Time:** 15-20 hours

---

## 📋 IMPLEMENTATION PHASES

### Phase 1: Critical Fixes & Quick Wins (Today)

**Total Time:** 3-4.5 hours  
**Priority:** CRITICAL  
**Tasks:** 1, 3, 4, 5, 6, 7

### Phase 2: Core Functionality (This Week)

**Total Time:** 8-15 hours  
**Priority:** HIGH  
**Tasks:** 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22

### Phase 3: Advanced Features (Next Week)

**Total Time:** 20-30 hours  
**Priority:** MEDIUM  
**Tasks:** 23, 24, 25, 26, 27, 28, 29, 30, 31

---

## 📊 PROGRESS TRACKING

**Total Tasks:** 22  
**Completed:** 6  
**In Progress:** 0  
**Pending:** 16  
**Total Estimated Time:** 24.5-42 hours

**Critical Bugs:** 0  
**High Priority:** 1  
**Medium Priority:** 8  
**Low Priority:** 7

---

## 🔄 UPDATE LOG

**Created:** [Current Date]  
**Last Updated:** [Current Date]  
**Next Review:** [Weekly]

---

_This document should be updated every time a task is completed or implemented. Use the status indicators to track progress: 🔴 BUG, 🟡 TODO, 🟢 IN PROGRESS, ✅ COMPLETED_
