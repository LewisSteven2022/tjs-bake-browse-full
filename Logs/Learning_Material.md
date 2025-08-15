# 📚 Learning Material - TJ's Bake & Browse

## **Recent Critical Learnings (Schema Mismatch Resolution)**

### **Database Schema Documentation vs Reality - CRITICAL LESSON**

**Date**: 14th August 2025  
**Issue**: Major schema mismatch between documentation and actual database  
**Impact**: Complete system failure - products not displaying, orders not working

### **Supabase JOIN Syntax and Foreign Key Relationships - CRITICAL LESSON**

**Date**: 14th August 2025  
**Issue**: Products API failing to return category data despite having foreign key relationships  
**Impact**: Category-based filtering completely broken, pages showed no products

#### **What Happened**

- Products API used generic JOIN syntax: `categories (id, name, slug)`
- Supabase requires explicit foreign key syntax: `categories:categories!products_category_id_fkey(id, name, slug)`
- Without proper syntax, the JOIN silently failed and returned empty arrays
- Pages filtering by category slug found no matches and displayed no products

#### **Root Causes**

1. **Assumption about SQL Standards**: Assumed standard SQL JOIN syntax would work
2. **Silent Failures**: Supabase didn't throw errors, just returned empty category arrays
3. **Insufficient Testing**: Didn't verify actual data structure returned by API
4. **Documentation Gap**: Supabase foreign key JOIN syntax not well documented

#### **Resolution Process**

1. **API Response Analysis**: Examined actual JSON returned by products API
2. **Foreign Key Investigation**: Checked database schema for relationship names
3. **Syntax Correction**: Updated to proper Supabase JOIN syntax with foreign key name
4. **Data Verification**: Confirmed categories now populated correctly

#### **Key Learnings**

- **Supabase JOIN syntax is specific** - requires explicit foreign key naming
- **Silent JOIN failures** are harder to debug than error exceptions
- **Always verify API response structure** matches expected data
- **Test category filtering logic** with actual data, not assumptions

#### **What Happened**

- Documentation showed old schema: `visible`, `stock`, `category`
- Actual database had new schema: `is_visible`, `stock_quantity`, `category_id`
- API endpoints were querying non-existent columns
- System appeared broken despite code being "correct"

#### **Root Causes**

1. **Documentation Lag**: Schema was updated but documentation wasn't
2. **Assumption Trap**: Assumed documentation matched reality
3. **No Schema Validation**: No verification that API queries matched actual database

#### **Resolution Process**

1. **Error Analysis**: Identified column not found errors
2. **Schema Discovery**: Checked actual database structure
3. **API Updates**: Fixed all endpoints to use correct column names
4. **Documentation Sync**: Updated docs to match reality

#### **Key Learnings**

- **Always verify schema** before writing API queries
- **Documentation can be wrong** - trust the database, not the docs
- **Schema mismatches cause complete failures** - not partial issues
- **Column name changes** have cascading effects across entire system

### **Schema Compatibility Strategy**

#### **Backward Compatibility Layer**

- Products API now provides both old and new schema field names
- Components receive data in expected format regardless of database schema
- Allows gradual migration without breaking existing code

#### **Fallback Mechanisms**

- Orders API handles missing `order_items` table gracefully
- Products API works with various column name combinations
- Products API temporarily removed `stock_quantity > 0` filter to surface out-of-stock items while validating category filtering and visibility rules
- System remains functional even with partial schema implementations

### **Real-Time Data Synchronisation - IMPLEMENTATION LESSON**

**Date**: 14th August 2025  
**Issue**: Admin product updates not reflecting on customer pages despite successful database saves  
**Impact**: Data inconsistency between admin changes and customer experience

#### **Cache Invalidation Strategy Implemented**

1. **Interval-Based Refresh**: 30-second automatic data refresh for real-time updates
2. **Visibility Change Detection**: Page data refreshes when user returns to tab
3. **Timestamp-Based Cache Busting**: API calls include timestamp parameters to prevent caching
4. **Graceful Error Handling**: Failed refresh attempts don't break existing functionality

#### **Code Pattern for Real-Time Updates**

```typescript
useEffect(() => {
	const loadProducts = async () => {
		/* fetch logic */
	};

	loadProducts(); // Initial load

	// 30-second intervals for real-time updates
	const interval = setInterval(loadProducts, 30000);

	// Refresh when user returns to tab
	const handleVisibilityChange = () => {
		if (!document.hidden) loadProducts();
	};
	document.addEventListener("visibilitychange", handleVisibilityChange);

	return () => {
		clearInterval(interval);
		document.removeEventListener("visibilitychange", handleVisibilityChange);
	};
}, []);
```

#### **Key Benefits**

- **Admin workflow efficiency**: Changes visible within 30 seconds
- **User experience**: Fresh data when returning to tabs
- **Battery efficiency**: Only refreshes on visibility, not background
- **Error resilience**: Failed updates don't break existing data display

### **Modern UI/UX Design Implementation - DESIGN LESSON**

**Date**: 14th August 2025  
**Issue**: Suggestions form appeared outdated compared to rest of site branding  
**Impact**: Inconsistent brand experience and poor user engagement

#### **Design System Approach**

1. **Colour Palette Consistency**: Used blue gradient theme matching about page
2. **Visual Hierarchy**: Clear information architecture with icons and emojis
3. **Interaction Design**: Enhanced focus states and hover effects
4. **Accessibility**: Proper contrast ratios and keyboard navigation
5. **Professional Polish**: Backdrop blur effects and subtle animations

#### **UI Component Enhancement Pattern**

```tsx
// ❌ Basic Form Styling
<input className="w-full rounded-full border-gray-300" />

// ✅ Enhanced Brand-Consistent Styling
<input className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50/50 px-6 py-4 text-blue-900 font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md" />
```

#### **Visual Design Principles Applied**

- **Consistent Border Radius**: Standardised to `rounded-full` for all navigation elements
- **Brand Colour Integration**: Blue gradients and consistent colour temperature
- **Micro-Interactions**: Hover states and focus rings for better user feedback
- **Information Density**: Balanced white space and content organisation

## **Technical Architecture Decisions**

### **Database Schema Design**

- **Normalized Structure**: Separate tables for orders and order items
- **Consistent Naming**: `is_visible` instead of `visible`, `stock_quantity` instead of `stock`
- **Proper Constraints**: Check constraints for status values, foreign key relationships
- **Performance Indexes**: Strategic indexing for common query patterns

### **API Design Patterns**

- **Schema Abstraction**: APIs hide database complexity from frontend
- **Error Handling**: Comprehensive error logging and user-friendly messages
- **Data Transformation**: Consistent data format regardless of underlying schema
- **Fallback Logic**: Graceful degradation when expected features aren't available

## **Code Quality Improvements**

### **Error Handling**

- Added comprehensive error logging in all API endpoints
- User-friendly error messages with actionable information
- Proper HTTP status codes for different error types
- Prototype safely: Build new UI/UX in test routes and isolated components (`app/test-styling/**`, `components/test/**`) so production pages remain stable. Once validated, promote to global layout.

### **Type Safety**

- Updated TypeScript types to match actual database schema
- Proper interface definitions for API responses
- Consistent data structures across components

### **Testing Strategy**

- End-to-end testing of critical user flows
- Schema validation before deployment
- Regular database structure verification

## **Prevention Strategies**

### **Schema Validation**

- Automated schema checks in CI/CD pipeline
- Database migration scripts with rollback capability
- Regular schema documentation updates
- Include data policy checks in automated tests (e.g., verify that category pages render expected products given various `stock_quantity` and `is_visible` combinations)

### **Development Workflow**

- Schema-first development approach
- Database changes require documentation updates
- API endpoint testing against actual database

## **Future Improvements**

### **Schema Management**

- Database migration tooling
- Automated schema documentation generation
- Schema versioning and compatibility tracking
- Theme/system design rollout plan: define a single source of truth for colours, spacings, and button styles; migrate incrementally sitewide to match `test-styling/about-modern`.

### **API Evolution**

- Versioned API endpoints for breaking changes
- Schema validation middleware
- Automated API documentation generation

---

## **Previous Learnings**

### **RLS Policy Complexity (2024-01-12)**

- Complex RLS policies can cause infinite recursion
- Simple policies are often more effective than complex ones
- Performance impact of RLS on public data access

### **Cart System Implementation (2024-01-12)**

- localStorage provides good user experience for cart persistence
- Event-driven updates ensure real-time UI synchronization
- Fallback mechanisms important for offline scenarios
