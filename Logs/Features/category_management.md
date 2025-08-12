# Category Management Feature - Complete Guide

## Overview

The category management system allows administrators to create, edit, and manage product categories through a user-friendly interface in the admin dashboard. This replaces the old hardcoded category system with a flexible, database-driven approach.

## How It Works

### Database Structure

- **Categories Table**: `public.categories` stores all category information
- **Products Table**: `public.products` now has `category_id` instead of `category` string
- **Foreign Key**: `products.category_id` references `categories.id`
- **Automatic Migration**: Existing products are automatically migrated from old category strings

### Data Flow

1. **Admin Interface**: Loads categories and products with joins
2. **Category Selection**: Dropdown shows all available categories
3. **Database Updates**: Changes are saved via API endpoints
4. **Frontend Display**: Product pages show category names from database

## Features

### 1. Category Table Structure

- **Table**: `public.categories`
- **Fields**:
  - `id`: UUID primary key (auto-generated)
  - `name`: Human-readable category name (e.g., "Baked Goods")
  - `slug`: URL-friendly identifier (e.g., "baked_goods")
  - `description`: Optional description
  - `created_at`: Timestamp
  - `updated_at`: Timestamp

### 2. Admin Interface

- **Location**: Admin → Inventory
- **Category Column**: Shows category name with Edit button
- **Edit Button**: Opens modal to change product category
- **Add New Category**: Link to create new categories

### 3. Category Management Modals

#### Edit Category Modal

- Dropdown to select from existing categories
- Option to remove category (set to "No category")
- Link to add new category

#### New Category Modal

- **Name**: Human-readable category name
- **Slug**: URL-friendly identifier (lowercase, numbers, underscores only)
- **Description**: Optional description
- Validation for required fields
- Automatic slug format validation

### 4. API Endpoints

#### GET /api/admin/categories

Returns all categories for the management UI.

#### POST /api/admin/categories

Creates a new category.

```json
{
	"name": "Beverages",
	"slug": "beverages",
	"description": "Drinks and beverages"
}
```

#### PATCH /api/admin/categories

Updates an existing category.

```json
{
	"id": "uuid",
	"name": "Updated Name",
	"slug": "updated_slug",
	"description": "Updated description"
}
```

### 5. Database Migration

The system automatically:

- Creates the categories table if it doesn't exist
- Inserts default categories (Baked Goods, Groceries)
- Migrates existing products to use category_id instead of category string
- Maintains referential integrity with foreign key constraints

### 6. CSV Import/Export

- **Import**: Accepts category slugs, automatically resolves to category_id
- **Export**: Returns category slugs for easy editing
- **Validation**: Ensures categories exist before import

## How to Use

### Creating a New Category

#### Method 1: Through Admin Interface (Recommended)

1. Go to **Admin → Inventory**
2. Click **"Edit"** on any product's category column
3. Click **"+ Add new category"**
4. Fill in the form:
   - **Name**: "Fresh Produce" (human-readable)
   - **Slug**: "fresh_produce" (lowercase, underscores only)
   - **Description**: "Fresh fruits and vegetables" (optional)
5. Click **"Create Category"**
6. The new category is immediately available for selection

#### Method 2: Direct Database Insert

```sql
INSERT INTO public.categories (name, slug, description)
VALUES ('Fresh Produce', 'fresh_produce', 'Fresh fruits and vegetables');
```

### Assigning Categories to Products

1. **Single Product**:

   - Click **"Edit"** on a product's category column
   - Select from dropdown or choose "No category"
   - Click **"Save"**

2. **Bulk Update via CSV**:
   - Export current inventory
   - Edit category column (use category slugs)
   - Import updated CSV

### Editing Existing Categories

1. Go to **Admin → Inventory**
2. Click **"Edit"** on any product's category
3. Select the category you want to edit
4. Click **"+ Add new category"**
5. Use the same name but different slug (e.g., "beverages_v2")
6. Update all products to use the new category
7. Delete the old category if no longer needed

## File Structure & Code Changes

### Core Files (Don't Modify)

- `schema_additions.sql` - Database schema and migration
- `app/api/admin/categories/route.ts` - Category API endpoints
- `app/api/admin/inventory/route.ts` - Updated inventory API
- `app/admin/inventory/page.tsx` - Admin interface

### Files That May Need Updates

#### 1. Product Display Pages

If you add new categories, you may want to create new product listing pages:

**File**: `app/[category-name]/page.tsx`

```typescript
import { createClient } from "@supabase/supabase-js";
import ProductGrid from "@/components/ProductGrid";

type Product = {
	id: string;
	name: string;
	price_pence: number;
	image_url?: string | null;
	pack_label?: string | null;
	allergens?: string[] | null;
	category?: {
		id: string;
		name: string;
		slug: string;
	} | null;
};

async function fetchProducts(categorySlug: string): Promise<Product[]> {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{ auth: { persistSession: false } }
	);

	const { data, error } = await supabase
		.from("products")
		.select(
			`
      id,
      name,
      price_pence,
      image_url,
      pack_label,
      allergens,
      category_id,
      categories!inner(id, name, slug)
    `
		)
		.eq("categories.slug", categorySlug)
		.eq("visible", true)
		.gt("stock", 0)
		.order("name", { ascending: true });

	if (error) {
		console.error(`fetchProducts for ${categorySlug}:`, error);
		return [];
	}

	// Transform and normalize data
	const products = (data ?? []).map((product) => {
		// Normalize allergens to string array
		let normalizedAllergens: string[] | null = null;
		if (Array.isArray(product.allergens)) {
			normalizedAllergens = product.allergens;
		} else if (
			typeof product.allergens === "string" &&
			product.allergens.trim() !== ""
		) {
			try {
				const parsed = JSON.parse(product.allergens);
				normalizedAllergens = Array.isArray(parsed)
					? parsed
					: [product.allergens];
			} catch {
				normalizedAllergens = product.allergens
					.split(",")
					.map((s: string) => s.trim())
					.filter(Boolean);
			}
		}

		return {
			...product,
			allergens: normalizedAllergens,
			category:
				product.categories &&
				Array.isArray(product.categories) &&
				product.categories.length > 0
					? {
							id: product.categories[0].id,
							name: product.categories[0].name,
							slug: product.categories[0].slug,
					  }
					: null,
		};
	});

	return products as Product[];
}

export default async function CategoryPage({
	params,
}: {
	params: { "category-name": string };
}) {
	const products = await fetchProducts(params["category-name"]);
	const categoryName = products[0]?.category?.name || "Products";

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="mb-8 text-3xl font-bold text-gray-900">{categoryName}</h1>
			<ProductGrid products={products} />
		</div>
	);
}
```

#### 2. Navigation Updates

If you want to add category links to navigation:

**File**: `components/Navigation.tsx` (if it exists)

```typescript
// Add category links to your navigation
const categoryLinks = [
	{ name: "Baked Goods", href: "/baked-goods" },
	{ name: "Groceries", href: "/groceries" },
	{ name: "Fresh Produce", href: "/fresh-produce" }, // New category
	{ name: "Beverages", href: "/beverages" }, // New category
];
```

#### 3. Homepage Category Display

If you want to show categories on the homepage:

**File**: `app/page.tsx`

```typescript
// Fetch and display categories
const { data: categories } = await supabase
	.from("categories")
	.select("name, slug, description")
	.order("name");

// Render category cards/links
```

### 3. CSV Import/Export

The system automatically handles new categories in CSV operations:

- **Import**: Just use the new category slug in your CSV
- **Export**: New categories will appear in the exported data

## Troubleshooting

### Common Issues & Solutions

#### 1. "Category not found" Error During CSV Import

**Problem**: CSV contains a category slug that doesn't exist in the database.

**Solution**:

1. Create the category first through the admin interface
2. Or check your CSV for typos in category names
3. Ensure category slugs match exactly (case-sensitive)

#### 2. Products Showing "—" Instead of Category Name

**Problem**: Products exist but have no category assigned.

**Solution**:

1. Check if the category was deleted
2. Reassign products to existing categories
3. Verify the category_id foreign key relationship

#### 3. New Category Not Appearing in Dropdown

**Problem**: Category was created but doesn't show in the edit modal.

**Solution**:

1. Refresh the admin page (categories are loaded on page load)
2. Check browser console for errors
3. Verify the category was saved successfully

#### 4. Category Changes Not Saving

**Problem**: Clicking Save doesn't persist category changes.

**Solution**:

1. Check browser console for API errors
2. Verify you're logged in as admin
3. Check network tab for failed requests
4. Ensure the product has other required fields (stock, visible)

#### 5. CSV Import Fails with Category Errors

**Problem**: Import process stops due to category validation.

**Solution**:

1. Export current data to see existing category slugs
2. Create missing categories through admin interface
3. Ensure CSV uses exact category slugs (not names)
4. Check CSV format (commas, quotes, etc.)

### Debug Steps

#### 1. Check Database State

```sql
-- View all categories
SELECT * FROM public.categories ORDER BY name;

-- View products with category info
SELECT p.name, c.name as category_name, c.slug
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
ORDER BY p.name;

-- Check for orphaned products (no category)
SELECT name FROM public.products WHERE category_id IS NULL;
```

#### 2. Check API Responses

1. Open browser DevTools → Network tab
2. Perform category operations
3. Check response status and content
4. Look for error messages in response body

#### 3. Check Console Logs

1. Open browser DevTools → Console tab
2. Look for JavaScript errors
3. Check for API call failures
4. Verify data loading success

### Performance Issues

#### 1. Slow Category Loading

**Cause**: Large number of categories or products.

**Solution**:

- Categories are cached per page load
- Consider pagination for very large inventories
- Optimize database queries if needed

#### 2. Slow CSV Operations

**Cause**: Large datasets or complex category lookups.

**Solution**:

- Process CSV in smaller batches
- Ensure categories exist before import
- Use efficient database indexes

## Best Practices

### 1. Category Naming

- **Names**: Use clear, descriptive names (e.g., "Fresh Produce" not "FP")
- **Slugs**: Use lowercase with underscores (e.g., "fresh_produce")
- **Consistency**: Follow the same pattern for all categories

### 2. Category Management

- **Create First**: Always create categories before importing products
- **Backup**: Export data before making bulk changes
- **Test**: Test category changes on a few products first

### 3. CSV Operations

- **Template**: Use the export function to get the correct format
- **Validation**: Check category slugs exist before import
- **Backup**: Keep original CSV files as backup

### 4. Database Maintenance

- **Regular Checks**: Periodically verify category relationships
- **Cleanup**: Remove unused categories if needed
- **Monitoring**: Watch for orphaned products

## Advanced Usage

### 1. Category Hierarchies

While not currently supported, you could extend the system:

```sql
-- Add parent_id to categories table
ALTER TABLE public.categories ADD COLUMN parent_id UUID REFERENCES public.categories(id);

-- Create subcategories
INSERT INTO categories (name, slug, parent_id) VALUES
('Bread', 'bread', (SELECT id FROM categories WHERE slug = 'baked_goods')),
('Pastries', 'pastries', (SELECT id FROM categories WHERE slug = 'baked_goods'));
```

### 2. Category-Specific Settings

Extend categories with additional fields:

```sql
-- Add category-specific settings
ALTER TABLE public.categories ADD COLUMN tax_rate DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE public.categories ADD COLUMN display_order INTEGER DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN is_active BOOLEAN DEFAULT true;
```

### 3. Bulk Category Operations

Create scripts for bulk operations:

```typescript
// Example: Bulk category reassignment
async function bulkReassignCategory(oldSlug: string, newSlug: string) {
	const { data: oldCategory } = await supabase
		.from("categories")
		.select("id")
		.eq("slug", oldSlug)
		.single();

	const { data: newCategory } = await supabase
		.from("categories")
		.select("id")
		.eq("slug", newSlug)
		.single();

	if (oldCategory && newCategory) {
		await supabase
			.from("products")
			.update({ category_id: newCategory.id })
			.eq("category_id", oldCategory.id);
	}
}
```

## Support & Maintenance

### 1. Regular Tasks

- **Weekly**: Check for orphaned products
- **Monthly**: Review category usage and cleanup
- **Quarterly**: Optimize category structure

### 2. Monitoring

- **API Errors**: Watch for category-related API failures
- **Performance**: Monitor category loading times
- **Data Integrity**: Verify foreign key relationships

### 3. Updates

- **Schema Changes**: Test in development first
- **API Updates**: Maintain backward compatibility
- **Documentation**: Keep this guide updated

## Conclusion

The category management system provides a flexible, user-friendly way to organize your products. By following this guide, you can effectively manage categories, troubleshoot issues, and extend the system as needed. The system is designed to be robust and maintainable, with automatic migration handling the transition from the old system.

For additional support or feature requests, refer to the project documentation or contact the development team.
