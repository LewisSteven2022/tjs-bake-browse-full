# 🔍 Admin Dashboard Save Debugging

## Issue

Product updates in admin dashboard are not persisting to the database or showing on customer pages.

## Step-by-Step Debugging Process

### 1. Test Admin Dashboard Save

1. Open your browser's **Developer Tools** (F12)
2. Go to the **Network** tab
3. Navigate to `/admin/inventory`
4. Edit a product (change price from £2.00 to £3.00 and add an image URL)
5. Click "Save Changes"
6. **Watch the Network tab** for API requests

**What to look for:**

- Should see a `PATCH` request to `/api/admin/inventory`
- Check the **request payload** - does it include `price_pence: 300` and `image_url`?
- Check the **response** - is it successful (200 status)?

### 2. Test Database Direct Query

After saving, run this in browser console:

```javascript
fetch("/api/products")
	.then((r) => r.json())
	.then((d) =>
		console.log(
			"Products:",
			d.products.find((p) => p.name === "Chocolate Cookies")
		)
	);
```

### 3. Check Browser Console for Errors

Look for any JavaScript errors that might prevent the save from working.

### 4. Test with Hard Refresh

After saving:

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Hard refresh** the baked-goods page
3. Check if changes appear

## Common Issues

### A. Save Request Failing

- **Symptoms**: No network request appears, or request returns error
- **Cause**: JavaScript error preventing form submission
- **Fix**: Check browser console for errors

### B. Database Connection Issues

- **Symptoms**: Request succeeds but changes don't persist
- **Cause**: Environment variables or Supabase connection
- **Fix**: Check environment variables and Supabase dashboard

### C. API Transformation Bug

- **Symptoms**: Admin shows changes, customer API doesn't
- **Cause**: Our recent API fix not applied
- **Fix**: Restart development server (already done)

### D. Caching Issues

- **Symptoms**: Changes eventually appear after time
- **Cause**: Browser or API caching
- **Fix**: Hard refresh, check cache headers

## Manual Test

To confirm our API fix is working, you can manually test:

```bash
curl -s "http://localhost:3000/api/products" | jq '.products[] | select(.name == "Chocolate Cookies")'
```

This should show the current database values.
