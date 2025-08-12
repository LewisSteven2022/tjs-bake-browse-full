# Premium Notification System - Feature Documentation

## Overview

The Premium Notification System is a modern, professional notification framework that replaces the old `react-hot-toast` system throughout TJ's Bake & Browse. It provides a superior user experience with beautiful animations, smart positioning, and intelligent dismissal behavior.

## Key Features

### 🎨 **Visual Design**

- **Modern aesthetics**: Gradient borders, shimmer effects, and professional typography
- **Responsive sizing**: Compact yet readable notifications
- **Type-based styling**: Different colors and icons for success, error, info, warning, and basket notifications
- **Smooth animations**: Framer Motion-powered entry/exit animations

### 🧠 **Smart Behavior**

- **Scroll-based dismissal**: Automatically hides notifications when users scroll down
- **Configurable timing**: Auto-hide with customisable duration
- **Action buttons**: Interactive notifications with "View Basket" and "Continue Shopping" options
- **Bottom-right positioning**: Non-intrusive placement that doesn't block navigation

### 🔧 **Technical Features**

- **React Context**: Global state management for notifications
- **TypeScript support**: Full type safety and IntelliSense
- **Performance optimised**: Throttled scroll detection and efficient rendering
- **Memory management**: Proper cleanup and event listener management

## Implementation Details

### Core Components

#### 1. `PremiumNotification.tsx`

The main notification component with:

- **Props interface**: Configurable title, message, type, actions, and behavior
- **Scroll detection**: Monitors scroll events and dismisses on downward movement
- **Animation system**: Smooth slide-in/out with spring physics
- **Type system**: 5 notification types with distinct styling

#### 2. `NotificationManager.tsx`

Context provider and management system:

- **React Context**: Global notification state
- **CRUD operations**: Show, hide, and clear notifications
- **Convenience functions**: Pre-built notification types
- **Container management**: Fixed positioning and stacking

### Notification Types

| Type        | Icon            | Colors               | Use Case                             |
| ----------- | --------------- | -------------------- | ------------------------------------ |
| **Success** | ✅ CheckCircle  | Green gradient       | Successful operations, confirmations |
| **Error**   | ❌ AlertCircle  | Red gradient         | Errors, failures, validation issues  |
| **Info**    | ℹ️ Info         | Blue gradient        | General information, tips            |
| **Warning** | ⚠️ AlertCircle  | Yellow gradient      | Warnings, important notices          |
| **Basket**  | 🛒 ShoppingCart | Blue-purple gradient | Shopping cart operations             |

### Positioning & Layout

- **Container**: Fixed bottom-right (`bottom-4 right-4`)
- **Dimensions**: 280px-340px width, responsive height
- **Stacking**: Multiple notifications stack vertically with gaps
- **Z-index**: High priority (`z-50`) to appear above all content

## Usage Examples

### Basic Notifications

```typescript
import {
	useNotifications,
	showSuccessNotification,
} from "@/components/NotificationManager";

export default function MyComponent() {
	const { showNotification } = useNotifications();

	const handleSuccess = () => {
		showSuccessNotification(
			showNotification,
			"Operation Complete! 🎉",
			"Your action was successful."
		);
	};

	// Custom notification
	const handleCustom = () => {
		showNotification({
			title: "Custom Title",
			message: "Custom message content",
			type: "info",
			autoHide: true,
			duration: 5000,
			dismissOnScroll: true,
		});
	};
}
```

### Basket Notifications

```typescript
import { showBasketNotification } from "@/components/NotificationManager";

const handleAddToBasket = () => {
	showBasketNotification(
		showNotification,
		"Chocolate Cake",
		() => router.push("/basket"), // View Basket action
		() => console.log("Continue shopping") // Continue Shopping action
	);
};
```

### Error Handling

```typescript
import { showErrorNotification } from "@/components/NotificationManager";

const handleError = (error: Error) => {
	showErrorNotification(
		showNotification,
		"Operation Failed",
		error.message || "Something went wrong. Please try again."
	);
};
```

## Integration Points

### User-Facing Areas

1. **Product Cards** ✅

   - Add to basket confirmations
   - Error messages for failed operations

2. **Authentication** ✅

   - Login/register success/error messages
   - Form validation errors

3. **Checkout Process** ✅

   - Order placement confirmations
   - Validation errors
   - Time slot availability warnings

4. **Basket Management** ✅
   - Item quantity updates
   - Remove item confirmations

### Admin Areas

1. **Inventory Management** ✅

   - Product CRUD operations
   - Import/export results
   - Category management

2. **Order Management** ✅

   - Status updates
   - Bulk operations
   - Pickup confirmations

3. **Product Management** ✅
   - Create/edit/delete confirmations
   - Validation errors

## Configuration Options

### Notification Props

```typescript
interface NotificationProps {
	id: string; // Unique identifier
	title: string; // Notification title
	message: string; // Notification message
	type?: "success" | "info" | "warning" | "error" | "basket";
	showActions?: boolean; // Show action buttons
	onViewBasket?: () => void; // View basket callback
	onContinueShopping?: () => void; // Continue shopping callback
	onClose?: () => void; // Close callback
	autoHide?: boolean; // Auto-hide after duration
	duration?: number; // Auto-hide duration (ms)
	dismissOnScroll?: boolean; // Dismiss on scroll
}
```

### Global Settings

- **Position**: Bottom-right corner
- **Max width**: 340px
- **Animation duration**: 400ms
- **Scroll threshold**: 50px downward movement
- **Throttle rate**: 100ms for scroll events

## Best Practices

### 1. **Notification Timing**

- **Success messages**: 4-5 seconds duration
- **Error messages**: 6 seconds duration (longer for reading)
- **Info messages**: 4 seconds duration
- **Basket confirmations**: 5 seconds with action buttons

### 2. **Content Guidelines**

- **Titles**: Keep under 40 characters, use emojis sparingly
- **Messages**: Clear, actionable text under 120 characters
- **Tone**: Professional but friendly, avoid technical jargon

### 3. **User Experience**

- **Don't spam**: Limit to one notification per action
- **Clear actions**: Provide obvious next steps
- **Consistent positioning**: Always bottom-right for familiarity

### 4. **Performance**

- **Throttle events**: Scroll detection is throttled to 100ms
- **Cleanup**: Proper event listener removal
- **Memory management**: Automatic cleanup of dismissed notifications

## Migration from react-hot-toast

### What Was Replaced

- ❌ `toast.success()` → ✅ `showSuccessNotification()`
- ❌ `toast.error()` → ✅ `showErrorNotification()`
- ❌ `toast.info()` → ✅ `showInfoNotification()`
- ❌ `toast.warning()` → ✅ `showWarningNotification()`

### Benefits of Migration

1. **Better UX**: Professional appearance and smooth animations
2. **Smart dismissal**: Scroll-based auto-hide
3. **Action buttons**: Interactive notifications with clear next steps
4. **Consistent styling**: Unified design language across the site
5. **Better positioning**: Bottom-right placement doesn't block navigation
6. **Performance**: Optimised scroll detection and rendering

## Troubleshooting

### Common Issues

#### 1. **Notifications Not Appearing**

- Check `NotificationProvider` is wrapping the component
- Verify `useNotifications()` hook is called
- Ensure component is client-side (`"use client"`)

#### 2. **Scroll Dismissal Not Working**

- Verify `dismissOnScroll: true` is set
- Check for CSS conflicts affecting scroll events
- Ensure notification is mounted in DOM

#### 3. **Styling Issues**

- Check Tailwind CSS classes are available
- Verify Framer Motion is installed
- Check for CSS custom properties conflicts

#### 4. **Performance Issues**

- Limit concurrent notifications (max 5 recommended)
- Use appropriate duration values
- Avoid showing notifications in rapid succession

### Debug Mode

Enable debug logging by adding to component:

```typescript
const { showNotification } = useNotifications();

// Debug logging
console.log("Notification context available:", !!showNotification);
```

## Future Enhancements

### Planned Features

1. **Notification Queuing**: Handle multiple notifications gracefully
2. **Custom Themes**: User-selectable notification styles
3. **Sound Effects**: Audio feedback for important notifications
4. **Mobile Optimisation**: Touch-friendly interactions
5. **Accessibility**: Screen reader support and keyboard navigation

### Potential Integrations

1. **Analytics**: Track notification engagement
2. **A/B Testing**: Test different notification styles
3. **User Preferences**: Customisable notification settings
4. **Push Notifications**: Browser push for important updates

## Conclusion

The Premium Notification System provides a significant upgrade to the user experience at TJ's Bake & Browse. It replaces the basic toast system with a professional, interactive notification framework that enhances user engagement and provides clear feedback for all operations.

The system is designed to be:

- **User-friendly**: Clear, actionable notifications
- **Professional**: Consistent with modern web app standards
- **Performant**: Optimised for smooth operation
- **Maintainable**: Clean, well-documented code
- **Extensible**: Easy to add new features and types

This implementation sets the foundation for future notification enhancements and provides a solid user experience foundation for the entire application.
