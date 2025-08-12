# Premium Notification System - Complete Usage Guide

## 🎯 **Quick Start - Adding Notifications to New Pages**

### **Step 1: Import the Hook**

```typescript
import { useNotifications } from "@/components/NotificationManager";
```

### **Step 2: Use the Hook in Your Component**

```typescript
export default function NewPage() {
	const { showNotification } = useNotifications();

	// Your component logic here
}
```

### **Step 3: Show Notifications**

```typescript
// Success notification
showNotification({
	title: "Success! 🎉",
	message: "Your action was completed successfully.",
	type: "success",
});

// Error notification
showNotification({
	title: "Oops!",
	message: "Something went wrong. Please try again.",
	type: "error",
});
```

---

## 🚀 **Implementation Examples by Use Case**

### **1. Form Submissions**

```typescript
const handleSubmit = async (formData: FormData) => {
	try {
		const response = await fetch("/api/submit", {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			showNotification({
				title: "Form Submitted! ✅",
				message: "Your information has been saved successfully.",
				type: "success",
				duration: 4000,
			});
		} else {
			showNotification({
				title: "Submission Failed",
				message: "Please check your information and try again.",
				type: "error",
				duration: 6000,
			});
		}
	} catch (error) {
		showNotification({
			title: "Network Error",
			message: "Unable to connect. Please check your internet connection.",
			type: "error",
			duration: 6000,
		});
	}
};
```

### **2. Data Loading States**

```typescript
const [isLoading, setIsLoading] = useState(false);

const loadData = async () => {
	setIsLoading(true);
	try {
		const data = await fetchData();
		showNotification({
			title: "Data Loaded",
			message: `Successfully loaded ${data.length} items.`,
			type: "info",
			duration: 3000,
		});
	} catch (error) {
		showNotification({
			title: "Load Failed",
			message: "Failed to load data. Please refresh the page.",
			type: "error",
		});
	} finally {
		setIsLoading(false);
	}
};
```

### **3. User Actions with Confirmation**

```typescript
const handleDelete = async (itemId: string) => {
	if (confirm("Are you sure you want to delete this item?")) {
		try {
			await deleteItem(itemId);
			showNotification({
				title: "Item Deleted",
				message: "The item has been removed successfully.",
				type: "success",
			});
			// Refresh the list
			loadItems();
		} catch (error) {
			showNotification({
				title: "Delete Failed",
				message: "Unable to delete item. Please try again.",
				type: "error",
			});
		}
	}
};
```

---

## 🎨 **Customization Guide**

### **Changing Notification Wording**

#### **Current Notifications You Can Customize:**

**Login Success:**

```typescript
// File: app/login/page.tsx (line ~71)
showSuccessNotification(
	showNotification,
	"Welcome Back! 🎉", // ← Change this title
	"Successfully signed in. Welcome back to TJ's Bake & Browse!" // ← Change this message
);
```

**Registration Success:**

```typescript
// File: app/register/page.tsx (line ~47)
showSuccessNotification(
	showNotification,
	"Welcome to TJ's! 🎉", // ← Change this title
	"Account created successfully! You're now signed in and ready to shop." // ← Change this message
);
```

**Add to Basket:**

```typescript
// File: components/ProductCard.tsx (line ~35)
showBasketNotification(
	showNotification,
	product.name, // ← This shows the product name
	() => {
		/* View Basket action */
	},
	() => {
		/* Continue Shopping action */
	}
);
```

**Order Placement:**

```typescript
// File: app/checkout/page.tsx (line ~162)
showSuccessNotification(
	showNotification,
	"Order Placed Successfully! 🎉", // ← Change this title
	"Your order has been confirmed. You'll receive a confirmation email shortly." // ← Change this message
);
```

### **Customizing Notification Styles**

#### **1. Changing Colors by Type**

**File:** `components/PremiumNotification.tsx`

**Success Notifications (Green):**

```typescript
// Lines ~120-130
const getIconBg = () => {
	switch (type) {
		case "success":
			return "bg-gradient-to-br from-green-500 to-emerald-600"; // ← Change these colors
		// ... other cases
	}
};

const getBorderColor = () => {
	switch (type) {
		case "success":
			return "border-l-green-500"; // ← Change this border color
		// ... other cases
	}
};
```

**Error Notifications (Red):**

```typescript
case "error":
  return "bg-gradient-to-br from-red-500 to-pink-600"; // ← Change error colors
  // ...
  return "border-l-red-500"; // ← Change error border
```

**Basket Notifications (Blue-Purple):**

```typescript
case "basket":
  return "bg-gradient-to-br from-blue-500 to-purple-600"; // ← Change basket colors
  // ...
  return "border-l-blue-500"; // ← Change basket border
```

#### **2. Changing Overall Appearance**

**Notification Size:**

```typescript
// File: components/PremiumNotification.tsx (line ~140)
style={{ minWidth: "280px", maxWidth: "340px" }} // ← Adjust these values
```

**Padding and Spacing:**

```typescript
// File: components/PremiumNotification.tsx (line ~145)
<div className="p-4"> // ← Change padding (p-2, p-3, p-5, p-6)
```

**Border Radius:**

```typescript
// File: components/PremiumNotification.tsx (line ~135)
className = "relative bg-white rounded-xl shadow-lg border-l-4"; // ← Change rounded-xl to rounded-lg, rounded-2xl, etc.
```

**Shadow:**

```typescript
// File: components/PremiumNotification.tsx (line ~135)
className = "relative bg-white rounded-xl shadow-lg border-l-4"; // ← Change shadow-lg to shadow-sm, shadow-md, shadow-xl, shadow-2xl
```

#### **3. Changing Animation Behavior**

**Animation Speed:**

```typescript
// File: components/PremiumNotification.tsx (line ~125-130)
transition={{
  type: "spring",
  stiffness: 300, // ← Increase for faster animation
  damping: 30,    // ← Decrease for bouncier animation
  duration: 0.4,  // ← Change overall duration
}}
```

**Scroll Dismissal Threshold:**

```typescript
// File: components/PremiumNotification.tsx (line ~55)
if (currentScrollY > lastScrollY + 50) {
	// ← Change 50 to adjust sensitivity
	handleClose();
}
```

---

## 🔧 **Troubleshooting Guide**

### **Common Issues and Solutions**

#### **1. Notifications Not Appearing**

**Problem:** Notifications don't show up at all.

**Checklist:**

- ✅ Is `NotificationProvider` wrapping your app in `app/providers.tsx`?
- ✅ Are you using `"use client"` at the top of your component?
- ✅ Is the `useNotifications()` hook called correctly?
- ✅ Are there any console errors?

**Solution:**

```typescript
// Make sure your component looks like this:
"use client";

import { useNotifications } from "@/components/NotificationManager";

export default function MyComponent() {
	const { showNotification } = useNotifications();

	// Test with a simple notification
	const testNotification = () => {
		showNotification({
			title: "Test",
			message: "This is a test notification",
			type: "info",
		});
	};

	return <button onClick={testNotification}>Test Notification</button>;
}
```

#### **2. Scroll Dismissal Not Working**

**Problem:** Notifications don't dismiss when scrolling.

**Checklist:**

- ✅ Is `dismissOnScroll: true` set?
- ✅ Are you testing on a page with scrollable content?
- ✅ Are there CSS conflicts affecting scroll events?

**Solution:**

```typescript
// Make sure dismissOnScroll is enabled
showNotification({
	title: "Test",
	message: "This will dismiss on scroll",
	type: "info",
	dismissOnScroll: true, // ← This must be true
});

// Test on a page with lots of content to scroll
```

#### **3. Notifications Appearing in Wrong Position**

**Problem:** Notifications appear in top-right instead of bottom-right.

**Checklist:**

- ✅ Is the old `react-hot-toast` completely removed?
- ✅ Are you using the new `NotificationProvider`?

**Solution:**

```typescript
// In app/providers.tsx, make sure it looks like this:
import { NotificationProvider } from "@/components/NotificationManager";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<NotificationProvider>{children}</NotificationProvider>
		</SessionProvider>
	);
}
```

#### **4. Performance Issues**

**Problem:** Notifications feel slow or cause lag.

**Checklist:**

- ✅ Are you showing too many notifications at once?
- ✅ Are notifications staying visible too long?
- ✅ Is scroll detection working efficiently?

**Solution:**

```typescript
// Limit concurrent notifications
const maxNotifications = 3;
if (notifications.length >= maxNotifications) {
	// Remove oldest notification
	hideNotification(notifications[0].id);
}

// Use appropriate durations
showNotification({
	title: "Quick Info",
	message: "Brief message",
	type: "info",
	duration: 3000, // ← Shorter duration for better performance
	dismissOnScroll: true,
});
```

#### **5. Styling Issues**

**Problem:** Notifications look broken or unstyled.

**Checklist:**

- ✅ Is Tailwind CSS loading correctly?
- ✅ Is Framer Motion installed?
- ✅ Are there CSS conflicts?

**Solution:**

```bash
# Reinstall dependencies
npm install framer-motion

# Check Tailwind is working
npm run build
```

---

## 📱 **Mobile and Responsive Considerations**

### **Mobile-Specific Adjustments**

**Touch-Friendly Sizing:**

```typescript
// For mobile, you might want smaller notifications
// File: components/PremiumNotification.tsx
const isMobile = window.innerWidth < 768;

style={{
  minWidth: isMobile ? "260px" : "280px",
  maxWidth: isMobile ? "300px" : "340px"
}}
```

**Mobile Positioning:**

```typescript
// File: components/NotificationManager.tsx
// Adjust positioning for mobile
<div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3 max-w-xs">
```

---

## 🎭 **Advanced Customization**

### **Creating Custom Notification Types**

**1. Add New Type to Interface:**

```typescript
// File: components/PremiumNotification.tsx
export interface NotificationProps {
	type?: "success" | "info" | "warning" | "error" | "basket" | "custom"; // ← Add new type
	// ... other props
}
```

**2. Add Styling for New Type:**

```typescript
// File: components/PremiumNotification.tsx
const getIconBg = () => {
	switch (type) {
		case "custom":
			return "bg-gradient-to-br from-indigo-500 to-purple-600"; // ← Custom colors
		// ... other cases
	}
};

const getBorderColor = () => {
	switch (type) {
		case "custom":
			return "border-l-indigo-500"; // ← Custom border
		// ... other cases
	}
};
```

**3. Add Icon for New Type:**

```typescript
// File: components/PremiumNotification.tsx
import { Star } from "lucide-react"; // ← Import new icon

const getIcon = () => {
	switch (type) {
		case "custom":
			return <Star size={15} />; // ← Custom icon
		// ... other cases
	}
};
```

### **Custom Animation Patterns**

**Bounce Animation:**

```typescript
// File: components/PremiumNotification.tsx
<motion.div
  initial={{ x: 400, y: 100, opacity: 0, scale: 0.8, rotate: 10 }}
  animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
  exit={{ x: 400, y: 100, opacity: 0, scale: 0.8, rotate: -10 }}
  transition={{
    type: "spring",
    stiffness: 400, // ← Higher stiffness for bouncy effect
    damping: 20,    // ← Lower damping for more bounce
    duration: 0.6
  }}>
```

**Slide from Different Direction:**

```typescript
// Slide from bottom instead of bottom-right
initial={{ x: 0, y: 100, opacity: 0, scale: 0.8 }}
animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
exit={{ x: 0, y: 100, opacity: 0, scale: 0.8 }}
```

---

## 🧪 **Testing and Debugging**

### **Test Page Setup**

**Create a test page for notifications:**

```typescript
// File: app/test-notifications/page.tsx
"use client";

import { useNotifications } from "@/components/NotificationManager";

export default function TestNotificationsPage() {
	const { showNotification } = useNotifications();

	const testAllTypes = () => {
		// Test success
		setTimeout(() => {
			showNotification({
				title: "Success Test",
				message: "This is a success notification",
				type: "success",
			});
		}, 0);

		// Test error
		setTimeout(() => {
			showNotification({
				title: "Error Test",
				message: "This is an error notification",
				type: "error",
			});
		}, 1000);

		// Test basket
		setTimeout(() => {
			showNotification({
				title: "Basket Test",
				message: "This is a basket notification",
				type: "basket",
				showActions: true,
				onViewBasket: () => alert("View Basket clicked"),
				onContinueShopping: () => alert("Continue Shopping clicked"),
			});
		}, 2000);
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Notification Testing</h1>
			<button
				onClick={testAllTypes}
				className="bg-blue-500 text-white px-4 py-2 rounded">
				Test All Notification Types
			</button>
		</div>
	);
}
```

### **Debug Mode**

**Enable debug logging:**

```typescript
// Add this to any component to debug
const { showNotification } = useNotifications();

useEffect(() => {
	console.log("Notification context available:", !!showNotification);
	console.log("Notification functions:", {
		showNotification: typeof showNotification,
		hideNotification: typeof hideNotification,
		clearAllNotifications: typeof clearAllNotifications,
	});
}, [showNotification]);
```

---

## 📋 **Best Practices Checklist**

### **Before Going Live**

- ✅ **Test all notification types** on different devices
- ✅ **Verify scroll dismissal** works on all pages
- ✅ **Check mobile responsiveness** and touch interactions
- ✅ **Test notification stacking** with multiple notifications
- ✅ **Verify cleanup** when components unmount
- ✅ **Check performance** with many notifications
- ✅ **Test accessibility** with screen readers

### **Content Guidelines**

- ✅ **Titles**: Keep under 40 characters, use emojis sparingly
- ✅ **Messages**: Clear, actionable text under 120 characters
- ✅ **Tone**: Professional but friendly, avoid technical jargon
- ✅ **Actions**: Provide clear next steps when possible
- ✅ **Timing**: Use appropriate durations for different types

### **Performance Guidelines**

- ✅ **Limit concurrent notifications** to maximum of 5
- ✅ **Use appropriate durations** (4-6 seconds max)
- ✅ **Enable scroll dismissal** for better UX
- ✅ **Clean up event listeners** properly
- ✅ **Throttle scroll events** for performance

---

## 🆘 **Emergency Fixes**

### **Quick Recovery Steps**

**If notifications completely break:**

1. **Check providers.tsx:**

```typescript
// Make sure this is correct
<NotificationProvider>{children}</NotificationProvider>
```

2. **Verify imports:**

```typescript
// Check this import works
import { useNotifications } from "@/components/NotificationManager";
```

3. **Restart development server:**

```bash
npm run dev
```

4. **Clear browser cache** and refresh

5. **Check console errors** for any JavaScript issues

### **Fallback to Basic Notifications**

**If you need a quick fix, you can temporarily use:**

```typescript
// Simple alert fallback
const showBasicNotification = (title: string, message: string) => {
	alert(`${title}: ${message}`);
};

// Use this instead of the premium system temporarily
showBasicNotification("Success", "Operation completed");
```

---

## 📚 **Reference Tables**

### **Notification Types and Defaults**

| Type    | Icon | Colors          | Duration | Auto-hide | Scroll Dismiss |
| ------- | ---- | --------------- | -------- | --------- | -------------- |
| Success | ✅   | Green gradient  | 4000ms   | ✅        | ✅             |
| Error   | ❌   | Red gradient    | 6000ms   | ✅        | ✅             |
| Info    | ℹ️   | Blue gradient   | 4000ms   | ✅        | ✅             |
| Warning | ⚠️   | Yellow gradient | 5000ms   | ✅        | ✅             |
| Basket  | 🛒   | Blue-purple     | 5000ms   | ✅        | ✅             |

### **Available Props**

| Prop                 | Type     | Default   | Description                     |
| -------------------- | -------- | --------- | ------------------------------- |
| `title`              | string   | -         | Notification title (required)   |
| `message`            | string   | -         | Notification message (required) |
| `type`               | enum     | "success" | Notification type               |
| `showActions`        | boolean  | false     | Show action buttons             |
| `onViewBasket`       | function | -         | View basket callback            |
| `onContinueShopping` | function | -         | Continue shopping callback      |
| `onClose`            | function | -         | Close callback                  |
| `autoHide`           | boolean  | true      | Auto-hide after duration        |
| `duration`           | number   | 5000      | Auto-hide duration (ms)         |
| `dismissOnScroll`    | boolean  | true      | Dismiss on scroll               |

### **Common Use Cases**

| Use Case           | Type    | Duration | Actions | Example                        |
| ------------------ | ------- | -------- | ------- | ------------------------------ |
| Form success       | Success | 4000ms   | No      | "Profile updated successfully" |
| Form error         | Error   | 6000ms   | No      | "Please check your input"      |
| Add to basket      | Basket  | 5000ms   | Yes     | "Item added to basket"         |
| Order confirmation | Success | 5000ms   | No      | "Order placed successfully"    |
| System info        | Info    | 4000ms   | No      | "New features available"       |
| Warning            | Warning | 5000ms   | No      | "Low stock remaining"          |

---

## 🎯 **Quick Reference Commands**

### **Common Notification Patterns**

**Success:**

```typescript
showNotification({
	title: "Success! 🎉",
	message: "Operation completed successfully.",
	type: "success",
});
```

**Error:**

```typescript
showNotification({
	title: "Error",
	message: "Something went wrong. Please try again.",
	type: "error",
});
```

**Info:**

```typescript
showNotification({
	title: "Information",
	message: "Here's what you need to know.",
	type: "info",
});
```

**Basket with Actions:**

```typescript
showNotification({
	title: "Added to Basket! 🛒",
	message: "Item has been added to your basket.",
	type: "basket",
	showActions: true,
	onViewBasket: () => router.push("/basket"),
	onContinueShopping: () => console.log("Continue shopping"),
});
```

---

This guide covers everything you need to implement, customize, and troubleshoot the premium notification system. Keep it handy for quick reference when working with notifications on new pages or debugging issues! 🚀✨
