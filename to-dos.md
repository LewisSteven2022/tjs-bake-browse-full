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

### 4. Product Card Layout Consistency

**Status:** ✅ COMPLETED  
**Priority:** HIGH  
**Estimated Time:** 0.5 hours  
**Impact:** Medium - Visual consistency  
**Description:** Ensure Add to Basket button is always in the same position on all product cards regardless of allergen/pack label content  
**Dependencies:** None  
**Notes:** **RESOLVED**: Fixed layout inconsistency by adding fixed-height container for optional elements, ensuring uniform button positioning across all cards

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

### 9. Product Card Performance Optimisation

**Status:** ✅ COMPLETED  
**Priority:** HIGH  
**Estimated Time:** 0.5 hours  
**Impact:** Medium - Performance improvement  
**Description:** Optimise product card performance by reducing heavy animations and CSS complexity  
**Dependencies:** None  
**Notes:** **RESOLVED**: Removed heavy hover effects, simplified animations, reduced CSS complexity, and optimised grid layout for better performance

---

## 🔧 CORE FUNCTIONALITY (Medium Priority)

---

## 🎨 DESIGN & STYLING (Medium Priority)

### 13. Consistent Site Styling

**Status:** ✅ COMPLETED  
**Priority:** MEDIUM  
**Estimated Time:** 5-8 hours  
**Impact:** Medium - Brand consistency  
**Description:** Style to be consistent across site with blue colour scheme from notifications, modern pastel look, professional and premium feel  
**Dependencies:** None  
**Notes:** ✅ Test pages created and user feedback incorporated. Applied gradient background to about page, redesigned disclaimer page, and removed hero blue tinting as requested

### 14. Modern Site Look and Feel

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 5-8 hours  
**Impact:** Medium - User experience  
**Description:** Nicer, more modern look and feel to the site  
**Dependencies:** None  
**Notes:** Would be ideal to see a few test options before changing current files

### 15. Hero Image Styling Update

**Status:** ✅ COMPLETED  
**Priority:** MEDIUM  
**Estimated Time:** 0.5 hours  
**Impact:** Low - Visual consistency  
**Description:** Remove blue tinting from hero images as requested by user  
**Dependencies:** None  
**Notes:** ✅ Removed blue tinting from ParallaxHero component to restore original image appearance

### 16. About Page Background Enhancement

**Status:** ✅ COMPLETED  
**Priority:** MEDIUM  
**Estimated Time:** 0.5 hours  
**Impact:** Low - Visual appeal  
**Description:** Apply gradient background from test-styling to real about page  
**Dependencies:** None  
**Notes:** ✅ Applied gradient background and reduced padding on values cards section for better visual balance

### 17. Disclaimer Page Complete Redesign

**Status:** ✅ COMPLETED  
**Priority:** MEDIUM  
**Estimated Time:** 1 hour  
**Impact:** Medium - User experience  
**Description:** Redesign disclaimer page using test-styling approach and update content  
**Dependencies:** None  
**Notes:** ✅ Complete redesign with new styling, updated dietary requirements content, and corrected ordering information

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

### 23. Legal Pages Styling Update

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 2-3 hours  
**Impact:** Medium - Visual consistency  
**Description:** Update legal, Privacy Policy & Cookie Policy styling to match the rest of the website  
**Dependencies:** None  
**Notes:** Must look very professional and clean, apply consistent styling from other pages

### 24. Footer Disclaimer Link

**Status:** ✅ COMPLETED  
**Priority:** LOW  
**Estimated Time:** 0.5 hours  
**Impact:** Low - Navigation  
**Description:** Add a link to the disclaimer page in the footer  
**Dependencies:** None  
**Notes:** **RESOLVED**: Added disclaimer link to footer navigation and updated all footer link colours to match site's blue scheme

### 25. NavBar Responsiveness & Styling Update

**Status:** ✅ COMPLETED  
**Priority:** MEDIUM  
**Estimated Time:** 2-3 hours  
**Impact:** Medium - User experience and visual consistency  
**Description:** Fix NavBar responsiveness issues on smaller screens and update colours to match the site's blue scheme  
**Dependencies:** None  
**Notes:** **RESOLVED**: Updated NavBar with responsive design (flex-col on mobile, flex-row on larger screens), improved mobile layout, updated colours to match site's blue scheme (blue-800), added hover effects and better visual hierarchy

### 26. Mobile Responsiveness Improvements - NavBar & Footer

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours  
**Impact:** Medium - Mobile user experience  
**Description:** The navbar in mobile view looks better, but I am not too sure this is the best scale for mainly iPhone users. If you think it should be changed, please change it, but to me, it still looks like its aligned to the left too much. I am viewing at 375x812 dimensions. Is this correct? The footer is doing the same too. Please change and centre as its all too aligned to the left.  
**Dependencies:** None  
**Notes:** User feedback indicates mobile layout still needs improvement for iPhone users, particularly with left alignment issues

### 27. Disclaimer Page Mobile Responsiveness

**Status:** 🟡 TODO  
**Priority:** MEDIUM  
**Estimated Time:** 1-2 hours  
**Impact:** Medium - Mobile user experience  
**Description:** Running responsiveness at 360\*414, the disclaimer page does not hold up well. The email address is not responsive in the Questions or Concerns section. The main text inside the divs are not centered so they look like they zig zag. The homepage is a good one to try and replicate the responsiveness off as that looks pretty good besides the footer not being the best scale.  
**Dependencies:** None  
**Notes:** Disclaimer page needs mobile responsiveness improvements, particularly for email display and text centering on small screens

---

## 📊 DATA MANAGEMENT (Lower Priority)

### 28. CSV Import/Export - Products

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 4-6 hours  
**Impact:** Medium - Admin efficiency  
**Description:** CSV import/export functionality for products  
**Dependencies:** None  
**Notes:** Column validation, storage image mapping guidance, admin UI

### 29. CSV Import/Export - Orders

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Admin efficiency  
**Description:** CSV export functionality for orders  
**Dependencies:** None  
**Notes:** Date range filters, CSV streaming

---

## 📱 MOBILE & PERFORMANCE (Lower Priority)

### 30. Mobile Responsiveness Audit

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 3-5 hours  
**Impact:** Medium - User experience  
**Description:** Website must be optimised for mobile as majority of customers use mobile/tablets  
**Dependencies:** None  
**Notes:** Nav, grids, forms, tables, admin pages

### 31. Performance Optimisation

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 4-5 hours  
**Impact:** Low - Technical  
**Description:** Identify and fix performance bottlenecks  
**Dependencies:** None  
**Notes:** Database queries, image optimisation, caching

---

## 🔧 CONFIGURATION & SETTINGS (Lower Priority)

### 32. Configurable Slot Capacity

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Business flexibility  
**Description:** Change maximum customers per time slot (currently set to 1)  
**Dependencies:** None  
**Notes:** Database setting + UI in admin + backend check

### 33. Bag Cost & GST Configuration

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Impact:** Low - Business flexibility  
**Description:** Frontend management dashboard to update bag cost and GST rate  
**Dependencies:** None  
**Notes:** Database values for dynamic pricing

---

## 📚 DOCUMENTATION (Lower Priority)

### 34. Production Deployment Guide

**Status:** 🟡 TODO  
**Priority:** LOW  
**Estimated Time:** 3-4 hours  
**Impact:** Low - Developer support  
**Description:** Detailed step-by-step instructions for production deployment  
**Dependencies:** None  
**Notes:** Every file, Supabase, 3rd party apps, production readiness

### 35. CSV Import Instructions

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

### Phase 1: Critical Fixes & Quick Wins (Today) ✅ COMPLETED

**Total Time:** 3-4.5 hours  
**Priority:** CRITICAL  
**Tasks:** 1, 3, 4, 5, 6, 7, 8, 9

### Phase 2: Core Functionality (This Week) 🟢 IN PROGRESS

**Total Time:** 8-15 hours  
**Priority:** HIGH  
**Tasks:** 8 ✅, 9 ✅, 10 ✅, 11 ✅, 12 ✅, 13 ✅, 14, 15 ✅, 16 ✅, 17 ✅, 18, 19, 20, 21, 22, 23, 24 ✅, 25 ✅, 26, 27

### Phase 3: Advanced Features (Next Week)

**Total Time:** 20-30 hours  
**Priority:** MEDIUM  
**Tasks:** 23, 24, 25, 26, 27, 28, 29, 30, 31

---

## 📊 PROGRESS TRACKING

**Total Tasks:** 30  
**Completed:** 13  
**In Progress:** 0  
**Pending:** 17  
**Total Estimated Time:** 24-39 hours

**Critical Bugs:** 0  
**High Priority:** 0  
**Medium Priority:** 7  
**Low Priority:** 10

---

## 🔄 UPDATE LOG

**Created:** [Current Date]  
**Last Updated:** [Current Date]  
**Next Review:** [Weekly]

---

_This document should be updated every time a task is completed or implemented. Use the status indicators to track progress: 🔴 BUG, 🟡 TODO, 🟢 IN PROGRESS, ✅ COMPLETED_
