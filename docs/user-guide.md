# 👥 TJ's Bake & Browse - User Guide

## 📋 **Overview**

This guide provides client-facing instructions for managing content, prices, and day-to-day operations of the TJ's Bake & Browse platform.

## 🏪 **Admin Dashboard Access**

### **1. Logging In**

1. Navigate to your website URL followed by `/admin`
2. Enter your admin email and password
3. You'll be redirected to the admin dashboard

### **2. Admin Access Requirements**

- Your email must be configured as an admin account in .env file for the NEXT_PUBLIC_ADMIN_EMAILS value.
- Contact your technical support if you cannot access admin features

## 📦 **Managing Products & Inventory**

### **Adding New Products**

1. **Navigate to Inventory Management**

   - Go to Admin Dashboard → Inventory
   - Click "Add New Product" button

2. **Fill in Product Details**

   - **Product Name**: Full product name (e.g., "Gluten-Free Sourdough Bread")
   - **SKU**: Unique product code (e.g., "GF-SOUR-001")
   - **Price**: Enter in pounds (e.g., 4.50 for £4.50)
   - **Stock**: Current quantity available
   - **Category**: Select appropriate category (Baked Goods, Groceries, etc.)
   - **Description**: Brief description for customers
   - **Pack Label**: Size/weight information (e.g., "500g", "6-pack")
   - **Allergens**: Select all applicable allergens
   - **Image**: Upload product photo (recommended: 400x400px minimum)

3. **Save Product**
   - Click "Save" to add the product
   - Product will appear on the website immediately if marked as visible

### **Updating Existing Products**

1. **Find the Product**

   - Go to Admin Dashboard → Inventory
   - Use search or browse the product list

2. **Edit Product Information**

   - Click the edit icon next to the product
   - Update any fields as needed
   - **Price Changes**: Simply update the price field
   - **Stock Updates**: Adjust the stock quantity
   - **Image URL**: Add or update product image paths
   - **Visibility**: Toggle "Visible" to show/hide from customers

3. **Save Changes**
   - Click "Save" to apply updates
   - **Real-Time Updates**: Changes now appear on the customer website within 30 seconds
   - **Automatic Refresh**: Customer pages automatically refresh when users return to tabs
   - **Cache Invalidation**: Product updates include intelligent cache-busting for immediate visibility

### **Managing Stock Levels**

1. **Quick Stock Updates**

   - In the Inventory page, stock levels are displayed in a dedicated column
   - Click on the stock number to edit directly
   - Enter new quantity and press Enter to save

2. **Stock Alerts**

   - Low stock items are highlighted in the inventory list
   - Set custom low stock thresholds for each product
   - Consider reordering when items reach their threshold

3. **Hiding Out-of-Stock Items**
   - Toggle the "Visible" checkbox to hide items from customers
   - Alternatively, set stock to 0 (current policy pending)

## 🛍️ **Managing Product Categories**

### **Creating New Categories**

1. **Access Category Management**

   - Go to Admin Dashboard → Inventory
   - Look for "Manage Categories" section

2. **Add Category**

   - Click "Add New Category"
   - **Name**: Category display name (e.g., "Seasonal Specials")
   - **Slug**: URL-friendly version (auto-generated, e.g., "seasonal_specials")
   - **Description**: Brief category description
   - **Sort Order**: Number to control display order (lower numbers appear first)

3. **Assign Products**
   - Edit existing products to assign them to the new category
   - Products can only belong to one category at a time

### **Current Categories**

- **Baked Goods**: Fresh breads, cakes, pastries, cookies
- **Groceries**: Pantry staples, ingredients, specialty items
- **Specialty Items**: Seasonal or unique products
- **Beverages**: Drinks and liquid refreshments

## 📋 **Managing Customer Orders**

### **Viewing Orders**

1. **Access Order Management**

   - Go to Admin Dashboard → Customer Orders
   - Orders are displayed with most recent first

2. **Order Information**
   - **Order Number**: Unique identifier for customer reference
   - **Customer Details**: Name, email, phone (if provided)
   - **Items**: List of products and quantities
   - **Pickup Details**: Date and time slot
   - **Total**: Including any bag fees
   - **Status**: Current order stage

### **Processing Orders**

1. **Order Status Flow**

   - **Pending**: New order, needs confirmation
   - **Confirmed**: Order accepted, payment received
   - **Preparing**: Items being prepared/baked
   - **Ready**: Order ready for customer pickup
   - **Collected**: Customer has collected order
   - **Cancelled**: Order cancelled (if needed)

2. **Updating Order Status**

   - Click on an order to view details
   - Use the status dropdown to change order stage
   - Click "Update Status" to save changes
   - Customer will see status updates (future enhancement: email notifications)

3. **Quick Actions**
   - Use bulk selection to update multiple orders at once
   - Filter orders by status, date, or time slot
   - Search for specific orders by customer name or order number

### **Managing Pickup Times**

1. **Operating Hours Configuration**

   **Current Setup**:

   - **Days**: Monday-Saturday (Sunday closed)
   - **Hours**: 9:00 AM - 5:00 PM
   - **Slot Duration**: 30-minute intervals
   - **Capacity**: 5 orders per slot (configurable)

   **How Operating Hours Are Controlled**:

   - Operating hours are currently **hardcoded in the application code**
   - Main configuration locations:
     - `/app/api/slots/route.ts` - Line 8: `generateSlots(now, 7, "09:00", "17:00", 30)`
     - `/lib/slots.ts` - Function parameters set opening/closing times
     - `/app/checkout/page.tsx` - Line 71: `buildSlots("09:00", "17:30", 30)`

   **Database Table Available (Not Yet Used)**:

   - A `business_hours` table exists in the database with configurable hours per day
   - This table is set up but not currently connected to the slot generation system
   - **Future Enhancement**: Connect this table to make hours easily configurable

2. **To Change Operating Hours (Current Method)**

   **⚠️ Important**: Changing operating hours currently requires code changes and redeployment.

   **Steps Required**:

   1. **Contact your technical support team** - operating hours cannot be changed through the admin interface
   2. **Provide new hours** in this format:
      - Opening time: "HH:MM" (24-hour format, e.g., "08:30")
      - Closing time: "HH:MM" (24-hour format, e.g., "18:00")
      - Which days to operate (currently Monday-Saturday)
   3. **Development team will update**:
      - `/app/api/slots/route.ts` - Update the generateSlots parameters
      - `/lib/slots.ts` - Update default parameters if needed
      - `/app/checkout/page.tsx` - Update buildSlots parameters
      - Any other references to opening/closing times
   4. **Redeploy the application** for changes to take effect

3. **Slot Capacity Management**

   **Adjustable via Environment Variable**:

   - Slot capacity can be changed without code changes
   - Set `NEXT_PUBLIC_SLOT_CAPACITY` environment variable
   - Default: 5 orders per time slot
   - Contact technical support to modify this value

4. **Slot Availability Rules**

   - **Cutoff Time**: Orders placed after 12:00 PM can only book slots from the next day onwards
   - **Sunday Closure**: All Sundays automatically disabled (hardcoded)
   - **Capacity Control**: Slots automatically become unavailable when booking limit reached
   - **Status Exclusions**: Cancelled and rejected orders don't count towards capacity

## 💰 **Managing Pricing & Fees**

### **Product Pricing**

1. **Price Updates**

   - Edit products in the Inventory section
   - Enter prices in pounds and pence (e.g., 4.50 for £4.50)
   - Prices update immediately on the website

2. **Bulk Price Changes**
   - Currently done individually per product
   - Future enhancement: bulk pricing operations

### **Bag Fees**

1. **Current Bag Fee**

   - Optional £0.70 bag fee for customer orders
   - Customers can opt-in during checkout

2. **Updating Bag Fee**

   **🚧 Future Enhancement**: Admin interface for bag fee management is planned

   **Current Method**:

   - Contact technical support to modify bag fee amount
   - Fee is stored in the database and can be changed without code updates

   **Planned Admin Interface**:

   - Direct admin dashboard control for bag fee pricing
   - Real-time updates reflected on checkout pages
   - Validation controls for reasonable fee ranges
   - This feature is currently in development roadmap

## 🎨 **Managing Website Content**

### **About Page**

- Contact technical support for about page content updates
- Include business information, values, and contact details

### **Product Images**

**✅ Image URL Field Available**: You can now add image URLs directly through the admin interface!

**⚠️ Current Limitation**: Direct image upload is not yet available. Images must be manually uploaded to the server first.

#### **Current Image Management Process**

1. **Image Requirements**:

   - **Size**: Minimum 400x400 pixels (recommended: 800x800 for high quality)
   - **Format**: JPG, PNG, or WebP
   - **File size**: Under 2MB recommended
   - **Quality**: Good lighting and clear product visibility
   - **Style**: Consistent background preferred (white/neutral backgrounds work best)

2. **How to Add Product Images (Current Method)**:

   **Step 1: Prepare Your Images**

   - Resize images to at least 400x400 pixels
   - Optimise file size (under 2MB)
   - Name files descriptively (e.g., `sourdough-bread.jpg`, `chocolate-cookies.webp`)

   **Step 2: Upload to Server**

   - **Contact your technical support team** to upload images
   - Images need to be placed in `/public/images/products/` folder on the server
   - Technical team will provide you with the final URL path

   **Step 3: Add Image URL to Product**

   - Go to Admin Dashboard → Inventory
   - Click "Edit Product" for an existing product, or create a new product
   - In the "Image URL" field, enter the path: `/images/products/your-image-name.jpg`
   - **Example**: `/images/products/sourdough-bread.jpg`
   - Click "Save Changes" to update the product

3. **Image URL Format**:

   - **Local images**: `/images/products/filename.jpg`
   - **External images**: `https://example.com/your-image.jpg` (if hosted elsewhere)
   - **Supabase storage**: `https://your-project.supabase.co/storage/v1/object/public/products/filename.jpg` (if configured)

4. **Troubleshooting Image Issues**:
   - **Image not showing**: Check the exact file path and spelling
   - **Broken image icon**: Verify the image file exists in the correct folder
   - **Slow loading**: Optimise image file size
   - **Wrong size**: Check image dimensions are at least 400x400 pixels

#### **🚧 Planned Enhancement: Direct Image Upload**

**Future features being developed**:

- Direct image upload through admin interface
- Automatic image resizing and optimisation
- Multiple images per product
- Drag-and-drop image management
- Integration with Supabase storage for reliable hosting

**Current Workaround**:
Until the upload feature is implemented, you'll need to coordinate with technical support for new product images. Have your images ready and properly named to streamline this process.

#### **Best Practices for Product Images**

1. **Photography Tips**:

   - Use natural lighting when possible
   - Keep backgrounds simple and clean
   - Show products from the best angle
   - Include size reference if helpful (hand, coin, etc.)

2. **Consistency**:

   - Use similar lighting across all product photos
   - Maintain consistent background style
   - Keep the same general composition style

3. **File Management**:
   - Keep original high-resolution versions
   - Use descriptive file names
   - Organise images by category or date

### **Social Media Links**

- Instagram and Facebook links are in the footer
- Contact technical support to update social media URLs

## 📊 **Understanding Customer Behaviour**

### **Order Patterns**

- Monitor which products are popular
- Track peak ordering times
- Identify seasonal trends
- Use this data to inform inventory decisions

### **Customer Feedback**

- **Enhanced Suggestions System**: Modern, professional feedback form with improved user experience
- **Blue Gradient Design**: Form now matches brand identity with consistent styling
- **Improved Usability**: Enhanced visual hierarchy with icons, emojis, and professional polish
- **Better Engagement**: Micro-interactions and hover effects encourage customer participation
- **Accessibility**: Proper contrast ratios and keyboard navigation support
- Review feedback regularly for improvement opportunities
- Consider feedback when planning new products or services

## 🔧 **Troubleshooting Common Issues**

### **Product Not Appearing on Website**

1. Check that product is marked as "Visible"
2. Verify product has a category assigned (Baked Goods or Groceries)
3. Ensure stock quantity is greater than 0 (current policy pending)
4. **Wait 30 seconds** - changes now auto-refresh every 30 seconds
5. **Return to tab** - pages refresh automatically when users return from other tabs
6. Clear browser cache if issue persists
7. Check the category pages directly (/baked-goods or /groceries)

### **Order Status Not Updating**

1. Ensure you clicked "Update Status" after changing dropdown
2. Check your internet connection
3. Refresh the admin dashboard
4. Contact support if issues persist

### **Images Not Displaying**

1. Verify image was uploaded successfully
2. Check image file size (should be under 2MB)
3. Ensure image format is supported (JPG, PNG, WebP)
4. Contact support for image hosting issues

### **Stock Levels Incorrect**

1. Verify you saved changes after updating stock
2. Check if multiple admin users are updating simultaneously
3. Review recent orders that may have reduced stock
4. Manually reconcile with physical inventory

## 📞 **Getting Help**

### **Technical Support**

- **For urgent issues**: Contact Steve Lewis - (lewis.s2021@outlook.com)
- **For general questions**: Email Steve Lewis - (lewis.s2021@outlook.com)
- **For training**: Email Steve Lewis - (lewis.s2021@outlook.com)

### **Common Support Requests**

- Adding new admin users
- Updating operating hours or slot capacity
- Modifying bag fees or other charges
- Website content updates
- Integration with external systems

### **Before Contacting Support**

1. Note the exact error message (if any)
2. Document steps you took before the issue occurred
3. Include screenshots if helpful
4. Try refreshing the page and logging out/in again

## 📚 **Best Practices**

### **Daily Operations**

1. **Morning**: Review new orders and update status
2. **Throughout Day**: Monitor stock levels and update as needed
3. **Evening**: Process completed orders and mark as collected

### **Weekly Tasks**

1. Review inventory levels and reorder as needed
2. Update product visibility based on availability
3. Check for customer feedback and suggestions
4. Review order patterns for insights

### **Monthly Tasks**

1. Analyse product performance and popularity
2. Consider seasonal product additions/removals
3. Review and update product prices if needed
4. Clean up old or discontinued products

## 🔗 **Related Resources**

- [Bug Reporting](./bugs.md) - Report technical issues
- [Enhancement Requests](./enhancements.md) - Suggest new features
- [Data Models](./data-models.md) - Technical reference (for developers)
- [Deployment Guide](./deployment-guide.md) - Technical setup (for developers)

---

**Last Updated**: 14/08/2025
**Next Review**: Quarterly  
**Support Contact**: [Your Support Email]
