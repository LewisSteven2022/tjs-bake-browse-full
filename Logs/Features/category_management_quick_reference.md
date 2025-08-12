# Category Management - Quick Reference Guide

## Quick Start

### 1. Add New Category

1. Go to **Admin → Inventory**
2. Click **"Edit"** on any product's category
3. Click **"+ Add new category"**
4. Fill in: Name, Slug, Description (optional)
5. Click **"Create Category"**

### 2. Change Product Category

1. Click **"Edit"** on product's category column
2. Select new category from dropdown
3. Click **"Save"**

### 3. Bulk Update via CSV

1. Export current inventory
2. Edit category column (use category slugs)
3. Import updated CSV

## Common Category Slugs

| Name          | Slug            | Description                |
| ------------- | --------------- | -------------------------- |
| Baked Goods   | `baked_goods`   | Breads, pastries, desserts |
| Groceries     | `groceries`     | General grocery items      |
| Fresh Produce | `fresh_produce` | Fruits and vegetables      |
| Beverages     | `beverages`     | Drinks and beverages       |
| Dairy         | `dairy`         | Milk, cheese, yogurt       |
| Meat          | `meat`          | Fresh meat products        |
| Pantry        | `pantry`        | Dry goods, canned items    |

## File Locations

### Core Files (Don't Modify)

- `schema_additions.sql` - Database schema
- `app/api/admin/categories/route.ts` - Category API
- `app/admin/inventory/page.tsx` - Admin interface

### Files You May Need to Update

- `app/[category-name]/page.tsx` - New category pages
- `components/Navigation.tsx` - Navigation links
- `app/page.tsx` - Homepage category display

## Common Issues

### Category Not Found in CSV Import

**Solution**: Create category first through admin interface

### Products Show "—" Instead of Category

**Solution**: Reassign products to existing categories

### New Category Not in Dropdown

**Solution**: Refresh admin page

### Category Changes Not Saving

**Solution**: Check browser console for errors

## SQL Commands

### View All Categories

```sql
SELECT * FROM public.categories ORDER BY name;
```

### View Products with Categories

```sql
SELECT p.name, c.name as category_name, c.slug
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
ORDER BY p.name;
```

### Check Orphaned Products

```sql
SELECT name FROM public.products WHERE category_id IS NULL;
```

### Add Category Manually

```sql
INSERT INTO public.categories (name, slug, description)
VALUES ('Category Name', 'category_slug', 'Description');
```

## API Endpoints

### Get Categories

```
GET /api/admin/categories
```

### Create Category

```
POST /api/admin/categories
{
  "name": "Category Name",
  "slug": "category_slug",
  "description": "Description"
}
```

### Update Category

```
PATCH /api/admin/categories
{
  "id": "uuid",
  "name": "New Name",
  "slug": "new_slug"
}
```

## CSV Format

### Import Format

- **Category Column**: Use category slugs (e.g., `baked_goods`, `groceries`)
- **Example**: `Fresh Bread,baked_goods,250,Stock description,true`

### Export Format

- **Category Column**: Returns category slugs
- **Example**: `Fresh Bread,baked_goods,250,Stock description,true`

## Best Practices

1. **Create categories first** before importing products
2. **Use consistent naming** for categories
3. **Backup data** before bulk changes
4. **Test changes** on a few products first
5. **Use category slugs** in CSV (not names)

## Troubleshooting Checklist

- [ ] Category exists in database
- [ ] Category slug matches exactly (case-sensitive)
- [ ] Admin user is logged in
- [ ] Browser console shows no errors
- [ ] Network requests are successful
- [ ] CSV format is correct
- [ ] All required fields are filled

## Need Help?

1. Check browser console for errors
2. Verify category exists in database
3. Check network tab for failed requests
4. Ensure proper admin permissions
5. Review this documentation
6. Contact development team if issues persist
