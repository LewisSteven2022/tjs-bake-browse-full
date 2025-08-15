# 👥 TJ's Bake & Browse - Complete User Guide

## 📋 **Overview**

TJ's Bake & Browse is a modern bakery e-commerce platform featuring minimal-elegance design, real-time inventory management, and comprehensive order tracking. This guide covers all client-facing operations and admin management.

**Key Features:**

- Real-time product updates (30-second refresh cycle)
- Minimal-elegance UI design with Scandinavian allergen icons
- Click-to-reveal allergen information system
- Persistent shopping cart with cross-tab synchronization
- Advanced order status tracking
- Mobile-responsive design

---

## 🏪 **Admin Dashboard Access**

### **1. Logging In**

1. Navigate to your website URL followed by `/admin`
2. Enter your admin email and password (NextAuth.js authentication)
3. You'll be redirected to the admin dashboard

### **2. Admin Access Requirements**

- Your email must be configured as an admin account in the system
- Admin access is enforced by middleware protection
- Contact technical support if you cannot access admin features
- All admin routes are protected: `/admin/*` and `/api/admin/*`

### **3. Admin Navigation**

**Dashboard Sections:**

- **Customer Orders**: Order management and status updates
- **Inventory**: Product and stock management
- **Products**: Advanced product editing (legacy)

---

## 📦 **Managing Products & Inventory**

### **Product Data Structure**

**Core Fields:**

- **ID**: Unique UUID identifier
- **Name**: Full product name (TEXT, required)
- **SKU**: Unique stock keeping unit (TEXT, required)
- **Price**: Stored in pence (INTEGER, ≥0)
- **Stock Quantity**: Current inventory level (INTEGER, default 0)
- **Visibility**: Customer-facing visibility (BOOLEAN, default true)
- **Category**: Product categorization (UUID foreign key)
- **Image URL**: Product image path (TEXT, optional)
- **Pack Label**: Size/weight information (TEXT, optional)
- **Allergens**: Array of allergen codes (TEXT[], default {})

### **Adding New Products**

1. **Navigate to Inventory Management**
   - Go to Admin Dashboard → Inventory
   - Click "+ Add Product" button
2. **Fill in Product Details**
   - Name, Price (£), Stock (required)
   - Select a Category (required for products to appear on category pages)
   - Optional: Pack Label, Allergens, Image URL, Short/Full Description, Ingredients
   - Toggle "Product visible to customers" to publish immediately
3. **Save Product**
   - Click "Create Product"
   - Verify appearance on:
     - Baked goods → `/baked-goods`
     - Groceries → `/groceries`

### **Hiding/Showing Products**

1. Admin → Inventory → Edit Product
2. Toggle "Product visible to customers"
3. Save changes
4. Hidden products will no longer appear on customer category pages; showing them restores visibility immediately

### **Deleting Products**

1. Admin → Inventory → Edit Product → Delete
2. Confirm deletion (cannot be undone)
3. If the product has existing orders, deletion may be blocked for safety
4. Verify the product no longer appears on the relevant category page

### **Troubleshooting Visibility & Categories**

- New product not appearing: ensure Category is selected and Visible is ON
- Hidden product still visible: refresh; if persists, contact technical support
- Deleted product still visible: refresh; if persists, contact technical support

---

## 🛍️ **Managing Product Categories**

### **Category System**

**Schema:**

```sql
categories (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
)
```

### **Predefined Categories**

1. **Baked Goods** (`baked_goods`)
   - Fresh breads, cakes, pastries, cookies
   - Displayed on `/baked-goods` page
2. **Groceries** (`groceries`)

   - Pantry staples, ingredients, specialty items
   - Displayed on `/groceries` page

3. **Specialty Items** (`specialty_items`)
   - Seasonal or unique products
4. **Beverages** (`beverages`)
   - Hot and cold drinks

### **Category Management**

**Current Limitation**: Category management through admin interface not yet implemented.

**Current Method**:

- Contact technical support for category changes
- Categories controlled via database operations
- Products assigned to categories via `category_id` foreign key

---

## 📋 **Managing Customer Orders**

### **Order Data Structure**

**Orders Table Schema:**

```sql
orders (
    id UUID PRIMARY KEY,
    order_number BIGINT UNIQUE,
    user_id UUID (optional),
    status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'collected', 'cancelled')),
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    subtotal_pence INTEGER NOT NULL,
    tax_pence INTEGER DEFAULT 0,
    bag_fee_pence INTEGER DEFAULT 0,
    total_pence INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    special_instructions TEXT
)
```

### **Viewing Orders**

1. **Access Order Management**

   - Go to Admin Dashboard → Customer Orders
   - Orders displayed with most recent first
   - Real-time status updates

2. **Order Information Display**
   - **Order Number**: Unique sequential identifier
   - **Customer Details**: Name, email, phone (if provided)
   - **Items**: Product list with quantities and prices
   - **Pickup Details**: Date and time slot
   - **Pricing**: Subtotal, bag fee, tax, total (all in pence)
   - **Status**: Current order stage with color coding

### **Order Status Management**

**Status Flow:**

1. **Pending** → New order, needs confirmation
2. **Confirmed** → Order accepted, payment received
3. **Preparing** → Items being prepared/baked
4. **Ready** → Order ready for customer pickup
5. **Collected** → Customer has collected order
6. **Cancelled** → Order cancelled (if needed)
7. **Rejected** → Order rejected (added enhancement)

**Status Update Process:**

1. Click on an order to view details
2. Use the status dropdown to change order stage
3. Click "Update Status" to save changes
4. Status changes reflect immediately in customer view

**Quick Actions:**

- **Mark as Confirmed**: Single-click status update
- **Mark as Ready**: Single-click status update
- **Mark as Collected**: Single-click status update
- **Set Unpaid**: Reset to pending status

### **Order Item Management**

**Order Items Schema:**

```sql
order_items (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price_pence INTEGER NOT NULL,
    total_price_pence INTEGER NOT NULL
)
```

**Current Capability**: View-only
**Planned Enhancement**: Full order editing (add/remove items, quantity changes)

---

## ⏰ **Managing Pickup Times & Operating Hours**

### **Current Time Slot System**

**Operating Schedule:**

- **Days**: Monday-Saturday (Sunday closed)
- **Hours**: 09:00-17:30
- **Slot Duration**: 30-minute intervals
- **Capacity**: 5 orders per slot (configurable via environment variable)

**Slot Generation Logic:**

- Slots generated 7 days in advance
- Cutoff time: 12:00 PM (orders after this time start from next day)
- Automatic Sunday exclusion
- Capacity enforcement (slots become unavailable when full)
- Cancelled/rejected orders don't count towards capacity

### **Time Slot Configuration**

**Current Implementation Locations:**

1. `/app/api/slots/route.ts` - Main slot generation API
2. `/lib/slots.ts` - Slot building utility functions
3. `/app/checkout/page.tsx` - Client-side slot handling

**Environment Variables:**

- `NEXT_PUBLIC_SLOT_CAPACITY`: Orders per time slot (default: 5)

**Database Table (Prepared but not connected):**

```sql
business_hours (
    id UUID PRIMARY KEY,
    day_of_week INTEGER (0-6),
    opening_time TIME,
    closing_time TIME,
    is_closed BOOLEAN DEFAULT false
)
```

### **Changing Operating Hours**

**Current Method** (Requires code changes):

1. Contact technical support team
2. Provide new hours in 24-hour format
3. Specify which days to operate
4. Technical team updates code and redeploys

**Future Enhancement**: Admin interface for hour management

---

## 💰 **Managing Pricing & Fees**

### **Product Pricing**

**Price Storage**: All prices stored in pence (whole numbers)

- Example: £4.50 = 4500 pence
- Automatic conversion in admin interface
- Prevents floating-point precision issues

**Price Update Process:**

1. Edit product in Inventory section
2. Enter price in pounds (e.g., 4.50)
3. System automatically converts to pence for storage
4. Prices update immediately on website
5. Real-time cache invalidation ensures consistency

### **Configurable Fees**

**Fees Table Schema:**

```sql
configurable_fees (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    fee_type TEXT CHECK (fee_type IN ('fixed', 'percentage')),
    amount_pence INTEGER DEFAULT 0,
    percentage_rate DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    applies_to TEXT[] DEFAULT '{}'
)
```

**Current Fees:**

- **Bag Fee**: £0.50 (optional, customer opt-in during checkout)

**Fee Management:**

- **Current**: Database-stored but admin interface not implemented
- **Contact**: Technical support for fee modifications
- **Future**: Direct admin control planned

---

## 🎨 **Managing Website Content & Design**

### **Design System: Minimal-Elegance**

**Theme Characteristics:**

- Clean Scandinavian-inspired design
- Neutral color palette (neutral-50 to neutral-900)
- Light typography with wide tracking
- Subtle shadows and minimal borders
- Professional, sophisticated appearance

**Typography Classes:**

- `text-elegance-heading`: Main headings
- `text-elegance-subheading`: Section subheadings
- `text-elegance-body`: Body text
- `text-elegance-caption`: Small text and labels
- `text-elegance-price`: Price display

**Component Classes:**

- `btn-elegance-primary`: Primary action buttons
- `btn-elegance-secondary`: Secondary buttons
- `btn-elegance-ghost`: Subtle text buttons
- `card-elegance`: Content cards
- `input-elegance`: Form inputs
- `nav-elegance-link`: Navigation links

### **Product Images**

**Image Management System:**

**Current Process:**

1. **Prepare Images**:

   - Minimum size: 400x400 pixels (recommended: 800x800)
   - Formats: JPG, PNG, WebP
   - File size: Under 2MB
   - Consistent lighting and background

2. **Upload Process**:

   - Contact technical support for file upload
   - Images placed in `/public/images/products/` directory
   - Note exact filename for admin interface

3. **Admin Interface Update**:
   - Edit product in Inventory section
   - Enter image URL: `/images/products/filename.jpg`
   - Save changes

**Image URL Formats:**

- **Local images**: `/images/products/filename.jpg`
- **External images**: `https://example.com/image.jpg`
- **Supabase storage**: `https://project.supabase.co/storage/...` (configured but not used)

**Next.js Image Optimization:**

- Automatic format conversion (WebP, AVIF)
- Responsive sizing with `sizes` attribute
- Lazy loading for performance
- Domain whitelist security

**Future Enhancement**: Direct drag-and-drop upload interface

### **Allergen Information System**

**Allergen Icon System:**

- Clean Scandinavian-style SVG icons
- Click-to-reveal functionality (prevents overlapping tooltips)
- Mobile-optimized interaction
- Support for 15 common allergens

**Allergen Management:**

- Stored as TEXT[] array in database
- Multi-select interface in admin
- Automatic icon display on product cards
- Consistent iconography across platform

**Supported Allergens:**

- Gluten/Cereals, Milk, Eggs, Nuts, Peanuts, Soya, Fish, Crustaceans, Molluscs, Celery, Mustard, Sesame, Sulphur Dioxide, Lupin

---

## 🛒 **Understanding Customer Experience**

### **Shopping Cart System**

**Storage**: localStorage with cross-tab synchronization
**Persistence**: Cart maintains state across browser sessions
**Real-time Updates**: Automatic synchronization between open tabs

**Cart Data Structure:**

```typescript
interface CartItem {
	product_id: string;
	name: string;
	price_pence: number;
	qty: number;
	image_url?: string;
}
```

### **Checkout Process**

**Checkout Flow:**

1. **Cart Review**: Product list with quantities and pricing
2. **Customer Information**: Name, email, phone (optional)
3. **Pickup Selection**: Date and time slot choice
4. **Bag Option**: Optional £0.50 bag fee
5. **Order Confirmation**: Final review and submission

**Pricing Calculation:**

- Subtotal: Sum of all item prices
- Bag Fee: £0.50 if opted in
- Tax: Currently set to 0%
- Total: Subtotal + Bag Fee + Tax

### **Order Status Tracking**

**Customer View**: Order status updates visible immediately
**Status Indicators**: Color-coded status display
**Real-time Updates**: 30-second refresh cycle ensures current information

---

## 📊 **Understanding Data & Analytics**

### **Order Patterns**

**Monitoring Capabilities:**

- Product popularity tracking
- Peak ordering times analysis
- Seasonal trend identification
- Stock level optimization data

**Business Intelligence:**

- Order volume by time slot
- Product performance metrics
- Customer ordering behavior
- Revenue analysis by product category

### **Performance Metrics**

**Real-time Updates:**

- Customer pages refresh every 30 seconds
- Admin changes visible immediately
- Intelligent cache invalidation
- Cross-tab synchronization

**System Performance:**

- API response times optimized
- Image optimization via Next.js
- Efficient database queries with proper indexing
- CDN-ready for global delivery

---

## 🔧 **Troubleshooting & Maintenance**

### **Common Issues & Solutions**

#### **Product Not Appearing on Website**

1. Check product visibility setting (must be `true`)
2. Verify category assignment (required for page filtering)
3. Confirm stock quantity (policy pending: may need stock > 0)
4. Wait 30 seconds for cache refresh

#### **Images Not Displaying**

1. Verify image URL path accuracy
2. Check file exists in `/public/images/products/`
3. Confirm image file size under 2MB
4. Test image URL directly in browser

#### **Order Status Not Updating**

1. Ensure "Update Status" button was clicked
2. Check internet connection stability
3. Refresh admin dashboard
4. Verify order ID accuracy

#### **Stock Levels Incorrect**

1. Confirm changes were saved
2. Check for concurrent admin users
3. Review recent orders affecting stock
4. Manually reconcile with physical inventory

### **System Health Monitoring**

**Automatic Systems:**

- Real-time cache invalidation
- Cross-tab cart synchronization
- Automatic order status updates
- Session management via NextAuth.js

**Manual Checks:**

- Weekly inventory reconciliation
- Monthly order pattern review
- Quarterly customer feedback analysis
- Seasonal menu planning

---

## 🚀 **Advanced Features & Future Enhancements**

### **Implemented Advanced Features**

1. **Real-time Data Synchronization**

   - 30-second automatic refresh
   - Visibility change detection
   - Cross-tab cart synchronization
   - Intelligent cache busting

2. **Minimal-Elegance Design System**

   - Comprehensive UI component library
   - Scandinavian allergen icons
   - Mobile-responsive design
   - Accessibility compliant

3. **Advanced Order Management**
   - Status tracking with notifications
   - Quick action buttons
   - Bulk operations support
   - Comprehensive order history

### **Planned Enhancements**

**High Priority:**

1. **Configurable Operating Hours** - Admin interface for hour management
2. **Direct Image Upload** - Drag-and-drop image management
3. **Advanced Order Editing** - Modify orders post-creation
4. **Email Notifications** - Automated customer communications

**Medium Priority:**

1. **User Account System** - Customer profiles and order history
2. **Advanced Analytics** - Detailed reporting dashboard
3. **Multi-image Products** - Multiple photos per product
4. **Seasonal Menu Management** - Automated seasonal product cycling

**Low Priority:**

1. **Payment Integration** - Online payment processing
2. **Delivery Options** - Delivery scheduling system
3. **Loyalty Program** - Customer rewards system
4. **Advanced Inventory** - Automated reorder points

---

## 📞 **Support & Contact Information**

### **Technical Support**

**Primary Contact**: Steve Lewis

- **Email**: lewis.s2021@outlook.com
- **Response Time**: Within 24 hours for non-urgent issues
- **Emergency Response**: Same day for critical issues

### **Support Request Types**

**Immediate Response Required:**

- Website completely down
- Payment system failures
- Order system not working
- Security concerns

**Standard Response (24-48 hours):**

- Feature requests
- Content updates
- Operating hour changes
- New product setup assistance

**Planned Updates (Weekly):**

- Design modifications
- New feature implementations
- Performance optimizations
- System upgrades

### **Before Contacting Support**

**Information to Include:**

1. Exact error message (if any)
2. Steps taken before issue occurred
3. Screenshots of the problem
4. Browser and device information
5. Time and date issue started

**First Steps to Try:**

1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache and cookies
3. Try a different browser or device
4. Log out and log back in

---

## 📚 **Best Practices & Operational Guidelines**

### **Daily Operations Checklist**

**Morning (Opening):**

- [ ] Review overnight orders
- [ ] Update order statuses for ready items
- [ ] Check stock levels for day's production
- [ ] Verify operating status of website

**Throughout Day:**

- [ ] Monitor incoming orders every 2 hours
- [ ] Update order statuses as items are prepared
- [ ] Adjust stock levels for completed productions
- [ ] Respond to any customer inquiries

**Evening (Closing):**

- [ ] Mark collected orders as complete
- [ ] Update stock for tomorrow's availability
- [ ] Review day's order patterns
- [ ] Prepare production list for next day

### **Weekly Maintenance Tasks**

**Inventory Management:**

- [ ] Full stock reconciliation
- [ ] Update product visibility based on availability
- [ ] Review low-stock alerts and reorder
- [ ] Clean up discontinued products

**Customer Service:**

- [ ] Review customer feedback and suggestions
- [ ] Analyze order patterns and popular products
- [ ] Update product descriptions if needed
- [ ] Plan seasonal menu changes

**System Health:**

- [ ] Check website performance
- [ ] Review error logs with technical support
- [ ] Verify backup systems are working
- [ ] Test admin functions and features

### **Monthly Strategic Reviews**

**Business Analysis:**

- [ ] Review sales data and trends
- [ ] Analyze customer ordering patterns
- [ ] Evaluate product performance
- [ ] Plan promotional activities

**System Optimization:**

- [ ] Review and optimize product categories
- [ ] Update product images and descriptions
- [ ] Plan new feature implementations
- [ ] Assess system performance and capacity

**Quality Assurance:**

- [ ] Customer satisfaction survey review
- [ ] Website functionality testing
- [ ] Order accuracy assessment
- [ ] System security review

---

## 🔗 **Related Documentation**

**Technical Documentation:**

- [Technical Guide](./tech-guide.md) - Complete system architecture
- [Data Models](./data-models.md) - Database schema and API reference
- [Deployment Guide](./deployment-guide.md) - Technical setup procedures

**Operational Documentation:**

- [Bug Tracking](./bugs.md) - Known issues and resolutions
- [Enhancement Requests](./enhancements.md) - Future feature roadmap
- [To-Do List](./todos.md) - Current development priorities

**External Resources:**

- NextAuth.js Documentation
- Supabase Documentation
- Next.js Image Optimization Guide
- TailwindCSS Documentation

---

**Last Updated**: Current Date  
**Version**: 3.0 (Minimal-Elegance Implementation)  
**Next Review**: Monthly  
**Maintained By**: Development Team  
**Support Contact**: lewis.s2021@outlook.com
