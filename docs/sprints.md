# 🏃‍♂️ TJ's Bake & Browse - Sprint Planning & Management

## 📊 **Sprint Overview**

- **Current Sprint Planning Date**: 15th August 2025
- **Sprint Duration**: 2 weeks (standard)
- **Team Capacity**: Estimated based on priority and complexity
- **Last Updated**: 15th August 2025

---

## 🚨 **SPRINT 1: Critical Security & Bug Fixes**

**Priority**: IMMEDIATE | **Duration**: 1-2 weeks | **Status**: READY

### **Sprint Goals**

- Resolve all critical bugs affecting user experience
- Implement essential security measures identified by TestSprite
- Fix UI inconsistencies on key pages

### **Sprint Backlog**

#### **🔥 Critical Bugs (Must Complete)**

- [ ] **CRITICAL**: Admin inventory product visibility checkbox updates database but product still visible on customer pages
- [ ] **BUG**: Center text inside divs on disclaimer page
- [ ] **BUG**: Reduce excessive spacing in top div on disclaimer page
- [ ] **BUG**: Remove 'contact us for phone number' button and center email button on disclaimer page
- [ ] **BUG**: Reduce excessive spacing on basket page to look more professional

#### **🛡️ Security Implementations (High Priority)**

- [ ] **SECURITY**: Secure /api/debug endpoint - Add admin-only authentication
- [ ] **SECURITY**: Implement comprehensive input sanitization across all endpoints
- [ ] **SECURITY**: Implement API rate limiting for production environments
- [ ] **SECURITY**: Strengthen admin authentication beyond current NextAuth setup

#### **🎨 Quick UI Wins (If Time Permits)**

- [ ] **QUICK WIN**: Apply minimal-elegance theme to admin pages
- [ ] **QUICK WIN**: Apply minimal-elegance theme to Legal, Privacy Policy, Cookie Policy pages
- [ ] **QUICK WIN**: Modernize collection time and date picker dropdowns

### **Sprint Success Criteria**

- All critical bugs resolved and tested
- Debug endpoint secured with admin authentication
- Input sanitization implemented and tested
- API rate limiting deployed to production
- Admin pages styling updated to minimal-elegance theme

### **Estimated Story Points**: 21 points

### **Risk Level**: LOW (well-defined tasks)

---

## 🔧 **SPRINT 2: Performance & Notification System**

**Priority**: HIGH | **Duration**: 2 weeks | **Status**: PLANNED

### **Sprint Goals**

- Optimize application performance for scalability
- Modernize notification system across the application
- Implement audit logging for better security

### **Sprint Backlog**

#### **⚡ Performance Optimizations**

- [ ] **PERFORMANCE**: Add pagination to product listings (/api/products) for scalability
- [ ] **PERFORMANCE**: Review and enhance caching mechanisms for frequently accessed data
- [ ] **PERFORMANCE**: Review and optimize database indexes for query performance
- [ ] **AUDIT**: Implement audit logging for product modifications

#### **🔔 Notification System Updates**

- [ ] Update order success toast notification to match minimal-elegance theme
- [ ] Update user registration success toast notification to match minimal-elegance theme
- [ ] Update user login success toast notification to match minimal-elegance theme
- [ ] Replace default browser notification on suggestion submission with themed toasts

#### **📧 Email & Communication Enhancements**

- [ ] **ENHANCEMENT**: Implement retry mechanisms and logging for email notifications
- [ ] **ENHANCEMENT**: Add versioning support for configurable fees

### **Sprint Success Criteria**

- Product listings support pagination with 20 items per page
- Caching strategy documented and optimized
- Database performance improved with proper indexing
- All notifications use consistent minimal-elegance theming
- Email reliability improved with retry mechanisms

### **Estimated Story Points**: 18 points

### **Risk Level**: MEDIUM (performance work requires testing)

---

## 🏗️ **SPRINT 3: Advanced Admin Features**

**Priority**: HIGH | **Duration**: 2-3 weeks | **Status**: PLANNED

### **Sprint Goals**

- Enhance admin dashboard with advanced order management
- Implement comprehensive product and inventory features
- Add business configuration capabilities

### **Sprint Backlog**

#### **📋 Admin Orders Enhancement**

- [ ] Expose full order details (with items) to Admin UI
- [ ] Backend: Extend `GET /api/admin/orders/[id]` to include `order_items`
- [ ] Backend: Include `bag_opt_in` and compute bag fee dynamically
- [ ] Allow admins to edit orders safely (phase 1)
- [ ] Backend: `PATCH /api/admin/orders/[id]` for status, dates, customer info
- [ ] Items editing (phase 2) with atomic operations
- [ ] Add dropdown filter to Orders dashboard by status

#### **🔧 Admin Configuration Features**

- [ ] **FEATURE**: Add admin dashboard interface to change bag fee price
- [ ] **FEATURE**: Implement direct image upload functionality for products
- [ ] Create admin page for managing configurable fees
- [ ] Build image upload component with drag-and-drop support
- [ ] Integrate Supabase storage for reliable image hosting

#### **⏱️ Operating Hours Management**

- [ ] Connect existing `business_hours` database table to slot generation system
- [ ] Create admin interface for managing daily operating hours
- [ ] Update `/app/api/slots/route.ts` to read from database instead of hardcoded values
- [ ] Add holiday/closure date management functionality

### **Sprint Success Criteria**

- Admin can view complete order details including line items
- Admin can edit order information and recalculate totals
- Image upload functionality working with Supabase storage
- Business hours configurable through admin interface
- Bag fee and other charges configurable via admin dashboard

### **Estimated Story Points**: 34 points

### **Risk Level**: HIGH (complex business logic and integrations)

---

## 🛒 **SPRINT 4: Customer Experience & Cart Enhancement**

**Priority**: HIGH | **Duration**: 2-3 weeks | **Status**: PLANNED

### **Sprint Goals**

- Improve customer shopping experience
- Implement persistent cart system
- Add customer account features

### **Sprint Backlog**

#### **🛍️ Enhanced Shopping Experience**

- [ ] Create submission-received page for suggestions with clean confirmation
- [ ] Create 'Where to Find Us' page with map and business address
- [ ] Change add to basket button text to include quantity amendment information
- [ ] Add editable quantity option for customers in basket page
- [ ] Confirm product visibility policy for out-of-stock items

#### **💾 Cart & Account Enhancements**

- [ ] Migrate cart from localStorage to database-backed persistent cart
- [ ] Add user account pages for order history
- [ ] Implement persistent user preferences
- [ ] Checkout to prompt for phone number; capture mobile at signup

#### **💬 Suggestions System Completion**

- [ ] Deploy DB changes for suggestions table and verify in Supabase
- [ ] **ENHANCEMENT**: Add CAPTCHA or similar protection to suggestion forms
- [ ] **ENHANCEMENT**: Improve handling of session expiration scenarios

### **Sprint Success Criteria**

- Cart persists across browser sessions and devices
- Customers can view order history in account dashboard
- Improved basket page with quantity editing
- Suggestions system fully functional with spam protection
- Phone number collection integrated into checkout flow

### **Estimated Story Points**: 28 points

### **Risk Level**: MEDIUM (requires database migration planning)

---

## 🧪 **SPRINT 5: Testing & Quality Assurance**

**Priority**: MEDIUM | **Duration**: 1-2 weeks | **Status**: PLANNED

### **Sprint Goals**

- Implement comprehensive testing based on TestSprite recommendations
- Ensure application quality and reliability
- Document testing procedures

### **Sprint Backlog**

#### **🔍 TestSprite Testing Recommendations**

- [ ] **TESTING**: Add tests for duplicate registrations and password complexity
- [ ] **TESTING**: Test concurrent cart updates and session handling
- [ ] **TESTING**: Implement performance testing for high-traffic scenarios
- [ ] **TESTING**: Add comprehensive frontend-backend integration tests

#### **📚 Documentation & Investigation**

- [ ] Investigate and document potential uses for 'is_featured' column
- [ ] Document allergen options, icon mapping, and edit modal process
- [ ] Backend agent verification of code vs schema alignment

#### **✅ Quality Assurance**

- [ ] End-to-end testing of all user journeys
- [ ] Performance benchmarking and optimization validation
- [ ] Security testing of all implemented features
- [ ] Browser compatibility testing

### **Sprint Success Criteria**

- Comprehensive test suite covering all major functionality
- Performance benchmarks established and documented
- All TestSprite recommendations implemented and tested
- Documentation updated with testing procedures

### **Estimated Story Points**: 15 points

### **Risk Level**: LOW (testing and documentation)

---

## 🚀 **SPRINT 6: Future Feature Foundation**

**Priority**: LOW | **Duration**: 2-3 weeks | **Status**: BACKLOG

### **Sprint Goals**

- Prepare foundation for advanced features
- Implement nice-to-have enhancements
- Set up infrastructure for future growth

### **Sprint Backlog**

#### **🔮 Future Feature Preparation**

- [ ] Implement comprehensive user account system with order history
- [ ] Add online payment processing preparation (Stripe/PayPal research)
- [ ] Implement automated email notifications for order status updates
- [ ] Add product search functionality with filtering

#### **📊 Analytics & Reporting Foundation**

- [ ] Basic analytics dashboard setup
- [ ] Customer behaviour tracking implementation
- [ ] Sales reporting foundation
- [ ] Inventory analytics preparation

### **Sprint Success Criteria**

- Foundation laid for advanced features
- User account system expanded
- Basic analytics in place
- Payment processing research completed

### **Estimated Story Points**: 25 points

### **Risk Level**: LOW (foundational work)

---

## 📈 **Sprint Planning Guidelines**

### **Sprint Sizing Framework**

- **Small Story**: 1-3 points (1-2 days)
- **Medium Story**: 5-8 points (3-5 days)
- **Large Story**: 13+ points (1+ weeks)

### **Sprint Capacity Planning**

- **Individual Capacity**: ~15-20 points per 2-week sprint
- **Team Capacity**: Adjust based on team size
- **Buffer**: Always include 20% buffer for unexpected issues

### **Sprint Review Criteria**

- All sprint goals achieved
- No critical bugs introduced
- Documentation updated
- Tests passing
- Stakeholder approval obtained

### **Definition of Done**

- [ ] Feature implemented and tested
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Deployed to staging environment
- [ ] User acceptance testing completed
- [ ] No critical bugs identified

---

## 🔄 **Sprint Management Process**

### **Sprint Planning (Week 1, Day 1)**

1. Review previous sprint outcomes
2. Assess current priorities from todos.md
3. Update sprint backlog based on new requirements
4. Estimate story points for new items
5. Commit to sprint goals and backlog

### **Daily Standups**

- What was completed yesterday?
- What will be worked on today?
- Any blockers or impediments?
- Sprint goal progress check

### **Mid-Sprint Review (Week 1, Day 5)**

- Progress assessment against sprint goals
- Adjust scope if necessary
- Identify and resolve blockers
- Update stakeholders on progress

### **Sprint Review & Retrospective (Week 2, Day 5)**

- Demo completed features
- Review sprint metrics and outcomes
- Identify what went well and what could improve
- Plan improvements for next sprint
- Update sprint documentation

---

## 📊 **Sprint Metrics & Tracking**

### **Key Performance Indicators**

- **Velocity**: Average story points completed per sprint
- **Burn-down**: Daily progress toward sprint goals
- **Quality**: Bugs introduced vs. features delivered
- **Scope Creep**: Changes to sprint backlog mid-sprint

### **Success Metrics**

- Sprint goals achieved: Target 90%+
- On-time delivery: Target 95%+
- Quality score: Zero critical bugs
- Stakeholder satisfaction: Target 4.5/5

---

## 🔗 **Related Documentation**

- [Project Todos](./todos.md) - Source of sprint backlog items
- [Bug Tracking](./bugs.md) - Current issues and resolutions
- [Enhancement Ideas](./enhancements.md) - Future feature planning
- [User Guide](./user-guide.md) - Feature documentation
- [Data Models](./data-models.md) - Technical specifications

---

**Last Updated**: 15th August 2025  
**Next Sprint Planning**: Weekly Review Cycle  
**Sprint Master**: Development Team Lead  
**Stakeholder Review**: After each sprint completion
