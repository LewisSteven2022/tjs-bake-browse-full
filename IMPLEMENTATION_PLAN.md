# TJ's Bake & Browse - Implementation Plan

## 🎯 Project Overview

**Goal:** Transform TJ's Bake & Browse into a production-ready, professional bakery website  
**Timeline:** 3-4 weeks  
**Total Effort:** 30-48 hours  
**Approach:** Fix critical issues first, then deliver quick wins, followed by core functionality and advanced features

---

## 🚨 PHASE 1: CRITICAL FIXES & QUICK WINS (TODAY)

**Duration:** 3-4.5 hours  
**Priority:** CRITICAL - Must complete before any other work  
**Goal:** Restore admin functionality and deliver immediate user experience improvements

### Step 1: Fix Critical Bugs (0.5-1 hour)

#### 1.1 Fix Product Name Updates (0.5-1 hour)

**File:** `app/api/admin/inventory/route.ts`  
**Issue:** PATCH endpoint missing `name` field handling  
**Fix:**

```typescript
// Add this to the PATCH method after line 130
if (name !== undefined) {
	if (typeof name !== "string" || name.trim().length === 0) {
		return NextResponse.json(
			{ error: "Name must be a non-empty string" },
			{ status: 400 }
		);
	}
	updates.name = name.trim();
}
```

**Test:** Update a product name in admin inventory and verify it saves

### Step 2: Quick Wins (2.5-3.5 hours)

#### 2.1 Better Toast for Wrong Credentials (0.5 hour)

**File:** `app/api/auth/[...nextauth]/route.ts`  
**Enhancement:** Improve error messages for failed login attempts  
**Implementation:** Add custom error handling for invalid credentials

#### 2.3 Product Images Scaling Fix (1 hour)

**File:** `components/ProductCard.tsx`  
**Issue:** Images scaling outside card boundaries  
**Fix:** Add proper CSS containment and modern spacing

#### 2.4 Fix Admin Inventory SaveRow Function (0.5 hour)

**File:** `app/admin/inventory/page.tsx`  
**Enhancement:** Ensure local state updates immediately after save  
**Implementation:** Update local state before calling load() for better UX

#### 2.5 Add to Basket Visual Feedback (1 hour)

**File:** `components/ProductCard.tsx`  
**Enhancement:** Visual feedback when items added to basket  
**Implementation:** Button micro-animation + ARIA live region

#### 2.6 Quick CSS Fixes for Product Cards (0.5 hour)

**File:** `components/ProductCard.tsx`  
**Enhancement:** Fix product card spacing, image containment, and modern styling  
**Implementation:** Simple CSS updates that will make the site look more professional immediately

---

## 🔧 PHASE 2: CORE FUNCTIONALITY (THIS WEEK)

**Duration:** 8-15 hours  
**Priority:** HIGH - Essential features for production  
**Goal:** Implement core business functionality and admin tools

### Step 3: Design & Styling (5-8 hours)

#### 7.1 Consistent Site Styling (5-8 hours)

**Files:** Create test pages first (DO NOT modify current pages)  
**Enhancement:** Blue colour scheme, modern pastel look, professional feel  
**Implementation:** Create test pages that mirror baked-goods, about, disclaimers

### Step 4: Additional Features (2-4 hours)

#### 4.1 Suggestions Form (2-3 hours)

**Files:** Create new component and API endpoint  
**Enhancement:** Form that emails business address  
**Implementation:** Simple form with email integration

#### 4.2 Mailing List Opt-in (1.5-2.5 hours)

Í<!-- Œ -->
**Files:** User registration system  
**Enhancement:** Tick box for marketing opt-in  
**Implementation:** DB column marketing_opt_in, RLS, export functionality

---

## 📊 PHASE 3: ADVANCED FEATURES (NEXT WEEK)

**Duration:** 20-30 hours  
**Priority:** MEDIUM - Production enhancements  
**Goal:** Professional features and business tools

### Step 5: Data Management (6-9 hours)

#### 5.1 CSV Import/Export - Products (4-6 hours)

**Files:** `app/api/admin/inventory/export/route.ts`, `app/api/admin/inventory/import/route.ts`  
**Enhancement:** Full CSV functionality for products  
**Implementation:** Column validation, storage image mapping, admin UI

#### 5.2 CSV Import/Export - Orders (2-3 hours)

**Files:** `app/api/admin/orders/route.ts`  
**Enhancement:** CSV export for orders with date range filters  
**Implementation:** CSV streaming and filtering

### Step 6: Email System (4-6 hours)

#### 6.1 Email Flows

**Files:** `lib/email.ts`, `app/api/admin/orders/[id]/route.ts`  
**Enhancement:** Order confirmed, ready to collect, cancelled emails  
**Implementation:** Centralised templates and admin "resend" functionality

### Step 7: Configuration & Settings (4-6 hours)

#### 7.1 Configurable Slot Capacity (2-3 hours)

**Files:** Database schema, admin UI  
**Enhancement:** Database setting + UI in admin + backend check  
**Implementation:** Single settings row for max_per_slot

#### 7.2 Bag Cost & GST Configuration (2-3 hours)

**Files:** Database schema, admin UI  
**Enhancement:** Frontend management dashboard for pricing  
**Implementation:** Database values for dynamic pricing

### Step 8: Documentation & Production (6-8 hours)

#### 8.1 Production Deployment Guide (3-4 hours)

**Files:** Create new documentation  
**Enhancement:** Detailed deployment instructions  
**Implementation:** Every file, Supabase, 3rd party apps, production readiness

#### 8.2 CSV Import Instructions (1-2 hours)

**Files:** Create new documentation  
**Enhancement:** Admin training documentation  
**Implementation:** Column schema, data format, image handling

### Step 9: Performance & Mobile (6-10 hours)

#### 9.1 Mobile Responsiveness Audit (3-5 hours)

**Files:** All components and pages  
**Enhancement:** Mobile optimisation for majority of customers  
**Implementation:** Nav, grids, forms, tables, admin pages

#### 9.2 Performance Optimisation (3-5 hours)

**Files:** Database queries, image optimisation, caching  
**Enhancement:** Identify and fix performance bottlenecks  
**Implementation:** Database indexes, query optimisation, caching

---

## 🚀 IMPLEMENTATION STRATEGY

### Development Approach

1. **Test Pages First:** Create test pages for design changes (DO NOT modify current pages)
2. **Incremental Delivery:** Each phase delivers working functionality
3. **Continuous Testing:** Test each feature before moving to the next
4. **Documentation:** Update to-dos.md and bug tracking as we progress

### Quality Assurance

1. **Bug Fixes:** Test thoroughly before marking as complete
2. **User Experience:** Ensure each feature improves the overall experience
3. **Performance:** Monitor for any performance regressions
4. **Mobile First:** Test on mobile devices throughout development

### Success Metrics

1. **Phase 1:** Admin functionality restored, immediate UX improvements
2. **Phase 2:** Core business features working, professional appearance
3. **Phase 3:** Production-ready with advanced features and optimisations

---

## 📅 TIMELINE

**Week 1 (Today):** Phase 1 - Critical fixes + quick wins (3-4.5 hours)  
**Week 2:** Phase 2 - Core functionality (8-15 hours)  
**Week 3-4:** Phase 3 - Advanced features (20-30 hours)

**Total Project Duration:** 3-4 weeks  
**Daily Commitment:** 2-4 hours per day

---

## 🔄 PROGRESS TRACKING

- **Update to-dos.md** after each task completion
- **Update bug tracking log** when issues are resolved
- **Test each feature** before marking as complete
- **Document lessons learned** for future reference

---

_This plan should be updated as we progress through each phase. Each step builds upon the previous one, ensuring a solid foundation for the next phase._
