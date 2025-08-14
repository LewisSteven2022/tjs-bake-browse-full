# 🔧 TJ's Bake & Browse - Technical Guide

## 📋 **Overview**

This technical guide maps out the complete process of how product images flow from database storage to display on the website. Understanding this process is essential for troubleshooting image issues and implementing future enhancements.

## 🗄️ **Database Layer**

### **Products Table Schema**

```sql
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price_pence INTEGER NOT NULL CHECK (price_pence >= 0),
    pack_label TEXT,
    allergens TEXT[] DEFAULT '{}',
    ingredients TEXT,
    image_url TEXT,                          -- ← Image URL stored here
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    category_id UUID REFERENCES public.categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Points:**

- `image_url` field stores the path or URL to the product image
- Examples: `/images/products/sourdough-bread.jpg` or `https://supabase.co/storage/v1/...`
- Field is optional (`TEXT` allows `NULL`)
- No file validation at database level

### **Product Images Table (Future Enhancement)**

```sql
CREATE TABLE public.product_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:**

- Support multiple images per product
- Currently created but not used in the application
- Ready for future implementation

## 🔌 **API Layer**

### **1. Products API (`/app/api/products/route.ts`)**

**Purpose:** Provides product data to customer-facing pages

**Database Query:**

```sql
SELECT
    id, name, sku, short_description, price_pence, pack_label,
    allergens, ingredients, image_url, stock_quantity, is_visible,
    category_id, created_at, updated_at,
    categories (id, name, slug, description)
FROM products
WHERE is_visible = true
ORDER BY name
```

**Key Features:**

- **Visibility Filter**: Only returns products where `is_visible = true`
- **Stock Filter**: Currently commented out (`stock_quantity > 0`)
- **Category Join**: Attempts to join with categories table
- **Fallback Logic**: If category join fails, fetches products without categories
- **Cache Control**: Sets `Cache-Control: no-store` to prevent caching

**Response Transformation:**

```javascript
const transformed = {
	...product,
	// Backward compatibility mapping
	stock: product.stock_quantity,
	visible: product.is_visible,
	category: product.category_id,
	description: product.short_description,
	// Explicitly preserve critical fields to ensure they're not lost
	image_url: product.image_url,
	price_pence: product.price_pence,
	categories: categoriesArray, // Always an array
};
```

**Critical Fields:** `image_url` and `price_pence` are explicitly preserved in transformation to prevent data loss

### **2. Admin Inventory API (`/app/api/admin/inventory/route.ts`)**

**Purpose:** Provides product data for admin interface management

**Database Query:**

```sql
SELECT
    id, name, price_pence, stock_quantity, is_visible,
    image_url, category_id, allergens,
    categories:categories!products_category_id_fkey(id, name, slug)
FROM products
ORDER BY name ASC
```

**PATCH Endpoint for Updates:**

```javascript
const updateData = {
	// ... other fields
	image_url: updates.image_url !== undefined ? updates.image_url : undefined,
	// ... remove undefined values
};

await supabase.from("products").update(updateData).eq("id", id);
```

**Key Features:**

- **Admin Only**: Protected by middleware
- **Full Data Access**: Returns all products regardless of visibility
- **Image URL Updates**: Supports updating `image_url` field
- **Category Management**: Includes category relationship data

## 🖥️ **Frontend Layer**

### **1. Product Pages (`/app/baked-goods/page.tsx`, `/app/groceries/page.tsx`)**

**Data Fetching Process:**

1. **API Call:**

   ```javascript
   const response = await fetch(`/api/products?t=${Date.now()}`, {
   	cache: "no-store",
   });
   ```

2. **Cache Busting:** `?t=${Date.now()}` prevents caching issues

3. **Category Filtering:**

   ```javascript
   const bakedGoodsProducts = products.filter((product) => {
   	const cats = product?.categories || [];
   	return cats.some((cat) => cat.slug === "baked_goods");
   });
   ```

4. **Component Rendering:**
   ```javascript
   <ProductCard
   	key={product.id}
   	product={{
   		id: product.id,
   		name: product.name,
   		price_pence: product.price_pence,
   		image_url: product.image_url, // ← Image URL passed here
   		pack_label: product.pack_label,
   		allergens: product.allergens,
   	}}
   />
   ```

### **2. Product Card Component (`/components/ProductCard.tsx`)**

**Image Rendering Logic:**

```javascript
{
	/* Product Image */
}
<div className="w-full h-48 relative">
	{product.image_url ? (
		<Image
			src={product.image_url} // ← Next.js Image component
			alt={product.name}
			fill
			className="object-cover"
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
		/>
	) : (
		<div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
			{/* Fallback placeholder SVG */}
			<svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
				<path
					fillRule="evenodd"
					d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
					clipRule="evenodd"
				/>
			</svg>
		</div>
	)}
</div>;
```

**Key Features:**

- **Conditional Rendering**: Shows image if `image_url` exists, placeholder otherwise
- **Next.js Image**: Automatic optimization and lazy loading
- **Responsive Sizing**: `sizes` attribute optimizes loading for different screen sizes
- **Fallback UI**: Gray background with placeholder icon when no image

### **3. Product Grid Component (`/components/ProductGrid.tsx`)**

**Type Definition:**

```typescript
export type Product = {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string | null; // ← Optional image URL
	pack_label?: string | null;
	allergens?: string[] | null;
};
```

**Rendering:**

```javascript
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{products.map((p) => (
		<ProductCard key={p.id} product={p} />
	))}
</div>
```

## 🖼️ **Image Configuration**

### **Next.js Image Optimization (`/next.config.mjs`)**

```javascript
images: {
    domains: [
        "dknzebbrpsecloomozzj.supabase.co", // Supabase storage domain
        "yourdomain.com",                    // Production domain
        "staging.yourdomain.com",            // Staging domain
    ],
    formats: ["image/webp", "image/avif"],   // Modern formats
    minimumCacheTTL: 60,                     // Cache for 60 seconds
},
```

**Benefits:**

- **Automatic Optimization**: Converts to WebP/AVIF formats
- **Responsive Images**: Generates multiple sizes
- **Lazy Loading**: Images load as they come into view
- **Domain Whitelist**: Security feature to prevent unauthorized image loading

### **File Storage Options**

#### **Option 1: Public Folder (Current)**

- **Path**: `/public/images/products/`
- **URL Format**: `/images/products/filename.jpg`
- **Pros**: Simple, no external dependencies
- **Cons**: Manual upload required, limited scalability

#### **Option 2: Supabase Storage (Configured but not used)**

- **Path**: Supabase storage bucket
- **URL Format**: `https://project.supabase.co/storage/v1/object/public/products/filename.jpg`
- **Pros**: Automatic backup, CDN delivery, upload API
- **Cons**: Requires implementation

#### **Option 3: External URLs**

- **Path**: Any external image hosting service
- **URL Format**: `https://example.com/image.jpg`
- **Pros**: Can use existing image hosting
- **Cons**: Must be added to Next.js domains whitelist

## 🔄 **Complete Data Flow**

### **Customer Viewing Products**

```
1. Customer visits /baked-goods
   ↓
2. page.tsx calls fetchBakedGoods()
   ↓
3. fetch('/api/products') with cache busting
   ↓
4. API queries Supabase: SELECT ... image_url ... FROM products
   ↓
5. Database returns products with image_url field
   ↓
6. API transforms data and adds backward compatibility
   ↓
7. Frontend filters by category (slug = 'baked_goods')
   ↓
8. ProductCard renders with image_url
   ↓
9. Next.js Image component loads image from URL
   ↓
10. Browser displays optimized image or fallback placeholder
```

### **Admin Updating Product Image**

```
1. Admin opens Edit Product modal
   ↓
2. Image URL field populated from product.image_url
   ↓
3. Admin updates image URL (e.g., /images/products/new-image.jpg)
   ↓
4. Click "Save Changes" triggers saveProductChanges()
   ↓
5. Frontend calls PATCH /api/admin/inventory with image_url
   ↓
6. API updates database: UPDATE products SET image_url = ? WHERE id = ?
   ↓
7. Database stores new image_url
   ↓
8. Next customer page load shows new image
```

## 🛠️ **Admin Interface Integration**

### **Edit Product Modal (`/app/admin/inventory/page.tsx`)**

**Image URL Input Field:**

```javascript
<div>
	<label className="block text-sm font-medium text-gray-700 mb-1">
		Image URL
	</label>
	<input
		type="url"
		value={editingProduct.image_url || ""}
		onChange={(e) =>
			setEditingProduct({
				...editingProduct,
				image_url: e.target.value,
			})
		}
		className="w-full rounded-lg border px-3 py-2"
		placeholder="/images/products/your-image.jpg"
	/>
	<p className="text-xs text-gray-500 mt-1">
		Use format: /images/products/filename.jpg
	</p>
</div>
```

**Save Function:**

```javascript
async function saveProductChanges() {
	if (!editingProduct) return;
	try {
		await saveRow(editingProduct); // Includes image_url in payload
		setEditingProduct(null);
		await load(); // Refresh the data
	} catch (e) {
		// Error handling
	}
}
```

**Payload Construction:**

```javascript
const payload = {
	id: p.id,
	name: p.name,
	stock: p.stock,
	visible: p.visible,
	price_pence: p.price_pence,
	allergens: p.allergens,
	image_url: p.image_url, // ← Image URL included
	...(hasNewSchema && { category_id: p.category?.id || null }),
};
```

## 🔍 **Troubleshooting Guide**

### **Common Image Issues**

#### **1. Image Not Showing (Broken Image Icon)**

**Possible Causes:**

- Incorrect file path in `image_url` field
- Image file doesn't exist at specified location
- File permissions issue
- Domain not whitelisted in Next.js config

**Debugging Steps:**

1. **Check Database**: Verify `image_url` field contains correct path

   ```sql
   SELECT id, name, image_url FROM products WHERE id = 'product-id';
   ```

2. **Check File Exists**: Verify file exists in `/public/images/products/`

   ```bash
   ls -la /public/images/products/filename.jpg
   ```

3. **Check Browser Network Tab**: Look for 404 errors when loading image

4. **Test Direct URL**: Try accessing image directly: `yoursite.com/images/products/filename.jpg`

#### **2. Image Loads Slowly or Not at All**

**Possible Causes:**

- Large file size (>2MB)
- Poor network connection
- Next.js image optimization issues
- Caching problems

**Solutions:**

- Optimize image file size
- Check Next.js image domains configuration
- Clear browser cache
- Test with different image format

#### **3. Image Shows on Admin but Not Customer Pages**

**Possible Causes:**

- Product marked as `is_visible = false`
- Stock quantity is 0 (when stock filter is enabled)
- Category filtering issue
- Caching problem

**Debugging Steps:**

1. **Check Product Visibility**:

   ```sql
   SELECT is_visible, stock_quantity FROM products WHERE id = 'product-id';
   ```

2. **Check API Response**: Visit `/api/products` directly and search for product

3. **Check Category Assignment**: Ensure product has correct `category_id`

### **Image Upload Process**

#### **Current Method (Manual Upload)**

1. **Prepare Image**:

   - Resize to 800x800 pixels minimum
   - Optimize file size (<2MB)
   - Use descriptive filename

2. **Upload to Server**:

   - Contact technical support
   - File placed in `/public/images/products/`
   - Note exact filename and path

3. **Update Database**:

   - Edit product in admin interface
   - Add image URL: `/images/products/filename.jpg`
   - Save changes

4. **Verify Display**:
   - Check product on customer pages
   - Test image loading and fallback

#### **Future Enhancement: Direct Upload**

**Planned Implementation:**

- Drag-and-drop interface in admin
- Automatic file upload to Supabase storage
- Image resizing and optimization
- Multiple images per product support
- Integration with existing `product_images` table

## 🔐 **Security Considerations**

### **Image URL Validation**

**Current State**: No validation on image URLs
**Risks**: Admin could enter malicious URLs
**Recommendation**: Add URL validation and domain whitelist

### **File Upload Security**

**Future Implementation Should Include:**

- File type validation (only images)
- File size limits
- Virus scanning
- Secure file naming
- Access controls

## 📈 **Performance Optimization**

### **Current Optimizations**

1. **Next.js Image Component**:

   - Automatic format conversion (WebP, AVIF)
   - Lazy loading
   - Responsive sizing

2. **Cache Control**:
   - API responses marked as no-cache
   - Image caching via Next.js

### **Future Optimizations**

1. **CDN Integration**: Serve images from global CDN
2. **Progressive Loading**: Show low-quality placeholder first
3. **Image Preloading**: Preload above-the-fold images
4. **WebP Fallbacks**: Automatic format detection

## 🔗 **Related Files**

### **Frontend Components**

- `/components/ProductCard.tsx` - Main image display component
- `/components/ProductGrid.tsx` - Product grid layout
- `/app/baked-goods/page.tsx` - Baked goods page
- `/app/groceries/page.tsx` - Groceries page

### **API Routes**

- `/app/api/products/route.ts` - Customer product data
- `/app/api/admin/inventory/route.ts` - Admin product management

### **Admin Interface**

- `/app/admin/inventory/page.tsx` - Product management interface

### **Configuration**

- `/next.config.mjs` - Image optimization settings
- `/lib/cart.ts` - Cart system (includes image_url)

### **Database**

- `products` table - Primary image storage
- `product_images` table - Future multi-image support

---

**Last Updated:** 14/08/2025  
**Technical Version:** 2.0.0  
**Maintained By:** Development Team
