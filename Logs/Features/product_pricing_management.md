# Product Pricing Management Feature

## Overview

The Product Pricing Management feature allows administrators to efficiently manage product information including pricing, stock levels, and visibility directly from the admin dashboard. This feature provides modal-based editing capabilities for quick updates with an intuitive user interface.

## Key Features

### 1. Modal-Based Product Editing

- **Edit Mode**: Click the "Edit" button on any product row to open a dedicated editing modal
- **Real-time Updates**: Changes are saved immediately to the database
- **Field Validation**: Ensures data integrity with proper validation
- **User-Friendly Interface**: Large, clear input fields that are easy to use

### 2. Editable Fields

- **Product Name**: Text input for product name updates
- **SKU**: Stock Keeping Unit identifier
- **Price (pounds)**: Text input for price in pounds format (e.g., "2.99" for £2.99)
- **Stock Level**: Numeric input for inventory quantity
- **Visibility**: Checkbox to toggle product visibility

### 3. User Interface Elements

- **Create Product Form**: Dedicated section for adding new products
- **Products Table**: Clean view of all products with edit and delete actions
- **Edit Modal**: Comprehensive editing interface with proper form layout
- **Loading States**: Visual feedback during API operations

## Technical Implementation

### State Management

```typescript
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
const [isLoading, setIsLoading] = useState(false);
```

### Key Functions

#### startEditing(product: Product)

- Sets the current editing product
- Opens the editing modal
- Populates the form with current product data

#### saveChanges()

- Validates form data before submission
- Sends PATCH request to update product
- Refreshes the product list after successful update
- Handles loading states and error scenarios

#### cancelEditing()

- Closes the editing modal
- Resets editing state
- Returns to view-only mode

#### deleteProduct(productId: string)

- Confirms deletion with user
- Sends DELETE request to remove product
- Refreshes product list after successful deletion

### Price Input Handling

#### handlePriceChange(newPrice: string)

```typescript
const handlePriceChange = (newPrice: string) => {
	if (!editingProduct) return;

	// Convert price string to pence (e.g., "2.99" -> 299)
	const priceMatch = newPrice.match(/£?(\d+\.?\d*)/);
	if (priceMatch) {
		const pounds = parseFloat(priceMatch[1]);
		const pence = Math.round(pounds * 100);
		setEditingProduct({ ...editingProduct, price_pence: pence });
	}
};
```

**Why this pattern**: This allows users to enter prices in the familiar pounds format (e.g., "2.99") while automatically converting to pence for storage. The regex handles both formats with or without the pound symbol.

### API Integration

- **GET /api/admin/products**: Retrieves all products
- **POST /api/admin/products**: Creates new products
- **PATCH /api/admin/products/[id]**: Updates existing products
- **DELETE /api/admin/products/[id]**: Removes products

## User Experience Features

### 1. Modal Design

- **Overlay**: Semi-transparent black background for focus
- **Centred Layout**: Modal appears in the centre of the screen
- **Responsive**: Adapts to different screen sizes
- **Clear Actions**: Prominent Save and Cancel buttons

### 2. Form Layout

- **Labelled Fields**: Clear labels for each input field
- **Proper Spacing**: Consistent spacing between form elements
- **Helpful Text**: Guidance text for price input format
- **Validation Feedback**: Visual indicators for required fields

### 3. Price Input Experience

- **Pounds Format**: Users enter prices as "2.99" for £2.99
- **Real-time Conversion**: Automatically converts to pence
- **Visual Feedback**: Shows both pounds and pence values
- **Format on Blur**: Validates and formats when leaving the field

### 4. Data Validation

- **Required Fields**: Name and SKU are mandatory
- **Price Validation**: Ensures positive price values
- **Stock Validation**: Prevents negative stock levels
- **Form Submission**: Prevents saving with invalid data

## Best Practices

### 1. Data Entry

- **Price Format**: Always enter prices in pounds (e.g., "2.99" not "299")
- **SKU Consistency**: Use consistent naming conventions
- **Stock Accuracy**: Regularly update stock levels
- **Validation**: Review all fields before saving

### 2. User Workflow

- **Edit Process**: Click Edit → Modify fields → Save Changes
- **Price Updates**: Enter new price in pounds format
- **Quick Edits**: Use the modal for any product changes
- **Bulk Operations**: Consider future bulk edit capabilities

### 3. Error Handling

- **Network Issues**: Check connectivity if changes don't save
- **Validation Errors**: Ensure all required fields are completed
- **Permission Issues**: Verify admin access is active

## Future Enhancements

### 1. Bulk Operations

- **Multi-Select**: Select multiple products for batch updates
- **Bulk Price Changes**: Percentage or fixed amount adjustments
- **Mass Visibility Toggle**: Update multiple products at once

### 2. Advanced Features

- **Price History**: Track price change history
- **Bulk Import**: CSV import for multiple products
- **Advanced Search**: Filter and search products
- **Category Management**: Organise products by categories

### 3. User Experience

- **Keyboard Shortcuts**: Power user navigation
- **Auto-Save**: Save changes automatically
- **Undo/Redo**: Revert recent changes
- **Mobile Optimisation**: Better mobile experience

## Troubleshooting

### Common Issues

#### 1. Price Not Updating

- **Verify Format**: Enter price as "2.99" not "299"
- **Check Validation**: Ensure price is a valid number
- **Save Changes**: Click "Save Changes" button
- **Refresh Page**: Reload if changes don't appear

#### 2. Modal Not Opening

- **Check Permissions**: Verify admin access
- **Browser Issues**: Try refreshing the page
- **JavaScript Errors**: Check browser console
- **Network Issues**: Ensure API connectivity

#### 3. Changes Not Saving

- **Required Fields**: Complete name and SKU fields
- **Validation**: Check for error messages
- **Network**: Verify internet connection
- **Permissions**: Confirm admin status

### Debug Information

- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API requests
- **Response Codes**: Verify API success status
- **Error Messages**: Read detailed error information

## Security Considerations

### 1. Authentication

- **Admin Routes**: Ensure proper access control
- **Session Management**: Implement timeout handling
- **User Permissions**: Validate admin status

### 2. Data Validation

- **Input Sanitisation**: Prevent malicious input
- **Server Validation**: Validate on backend
- **Type Checking**: Ensure proper data types

### 3. Audit Logging

- **Change Tracking**: Log all modifications
- **User Attribution**: Track who made changes
- **Timestamp Recording**: Record when changes occurred

## Performance Optimisations

### 1. API Efficiency

- **Single Requests**: Update one product at a time
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful failure handling

### 2. User Interface

- **Modal Rendering**: Only render when needed
- **State Management**: Efficient state updates
- **Form Validation**: Real-time validation feedback

## Conclusion

The Product Pricing Management feature provides a robust, user-friendly interface for managing product information. Its modal-based editing capabilities significantly improve workflow efficiency while maintaining data integrity and providing comprehensive validation. The feature is designed with scalability in mind, allowing for future enhancements and integrations.

The modal approach eliminates the usability issues of inline editing, providing a much better experience for updating product details, especially pricing information.
