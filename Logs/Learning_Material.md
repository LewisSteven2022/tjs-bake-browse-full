# Learning Material - TJ's Bake & Browse

## Project Management

### To-Do System

**Pattern**: Comprehensive, prioritized task management with time estimates and progress tracking

```markdown
# Task Structure

### [Task Number]: [Task Title]

**Status:** 🟡 TODO / 🟢 IN PROGRESS / ✅ COMPLETED  
**Priority:** CRITICAL / HIGH / MEDIUM / LOW  
**Estimated Time:** [Time estimate]  
**Impact:** [Impact description]  
**Description:** [Detailed description]  
**Dependencies:** [Any dependencies]  
**Notes:** [Additional context]
```

**Why this pattern**:

- **Prioritization**: Critical bugs and high-impact features are addressed first
- **Time estimation**: Realistic planning and resource allocation
- **Progress tracking**: Clear status indicators and completion metrics
- **Dependency management**: Understanding what blocks what
- **Impact assessment**: Focus on high-value improvements

**Key Features**:

- **Phase-based implementation**: Critical fixes → Quick wins → Core functionality → Advanced features
- **Bug tracking integration**: Dedicated bug log with detailed analysis
- **Future improvements**: LLM-generated enhancement ideas with value assessment
- **Progress metrics**: Total tasks, completion rates, time estimates

**Implementation**:

- **to-dos.md**: Main project task list in root directory
- **Logs/02_BUG_TRACKING_LOG.md**: Detailed bug tracking and resolution
- **Status indicators**: 🔴 BUG, 🟡 TODO, 🟢 IN PROGRESS, ✅ COMPLETED

---

### Product Card Component Enhancements

**Pattern**: Modern, responsive product cards with enhanced user experience

```typescript
// Enhanced ProductCard with visual feedback and modern styling
export default function ProductCard({ product }: { product: Product }) {
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	return (
		<>
			{/* ARIA live region for screen readers */}
			<div aria-live="polite" className="sr-only">
				{isAdded && `${product.name} added to basket`}
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full">
				{/* Enhanced image container */}
				<div className="w-full h-48 relative overflow-hidden">
					<Image
						src={product.image_url}
						alt={product.name}
						fill
						className="object-cover transition-transform duration-300 hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>

				{/* Enhanced button states */}
				<button
					onClick={addToBasket}
					disabled={isAdding || isAdded}
					className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
						isAdding
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: isAdded
							? "bg-green-500 text-white cursor-default"
							: "bg-primary hover:bg-primaryDark text-white shadow-md hover:shadow-lg transform hover:scale-105"
					}`}>
					{isAdding ? (
						<>
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Adding...
						</>
					) : isAdded ? (
						<>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
							Added to Basket!
						</>
					) : (
						<>
							<ShoppingCart size={20} />
							Add to Basket
						</>
					)}
				</button>
			</motion.div>
		</>
	);
}
```

**Why this pattern**: Modern product cards provide better user experience with visual feedback, accessibility features, and professional styling.

**Key Features**:

- **Visual States**: Loading spinner, success state, and disabled states
- **Accessibility**: ARIA live regions for screen readers
- **Modern Styling**: Rounded corners, shadows, hover effects, and smooth transitions
- **Responsive Images**: Proper image sizing and hover effects
- **Grid Layout**: Improved spacing and responsive grid system

**Implementation Details**:

- **State Management**: Multiple states for adding, success, and error handling
- **Animation**: Framer Motion for smooth entrance animations and hover effects
- **CSS Classes**: TailwindCSS for consistent, responsive styling
- **Image Optimization**: Next.js Image component with proper sizing and hover effects

---

### NextAuth Configuration Best Practices

**Pattern**: Separate auth configuration from route handlers

```typescript
// lib/auth.ts - Centralized auth configuration
export const authOptions: NextAuthOptions = {
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			// ... provider configuration
		}),
	],
	callbacks: {
		// ... JWT and session callbacks
	},
};

// app/api/auth/[...nextauth]/route.ts - Clean route handler
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Why this pattern**: Next.js App Router requires clean separation between configuration and route handlers. Exporting `authOptions` from route files causes build errors.

**Key Benefits**:

- **Build Compliance**: Avoids Next.js App Router export restrictions
- **Reusability**: Auth configuration can be imported by other parts of the application
- **Maintainability**: Centralized configuration in a dedicated library file
- **Type Safety**: Proper TypeScript types for NextAuth configuration

**Implementation Notes**:

- **File Location**: Place auth configuration in `lib/auth.ts`
- **Route Handler**: Keep route handlers minimal and focused
- **Import Updates**: Update all files that previously imported from route handlers
- **Type Safety**: Use proper NextAuth types for better development experience

---

## Frontend

### React Components

#### Component Structure

**Pattern**: Functional components with hooks and TypeScript

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MyComponent() {
	const [state, setState] = useState("");

	useEffect(() => {
		// Side effects
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="bg-white rounded-lg shadow">
			{/* Component content */}
		</motion.div>
	);
}
```

**Why this pattern**: Modern React with hooks provides clean, readable code. TypeScript adds type safety, and Framer Motion enables smooth animations.

#### Premium Notification System

**Pattern**: Context-based notification management with scroll dismissal

```typescript
// Using the notification system
import {
	useNotifications,
	showSuccessNotification,
} from "@/components/NotificationManager";

export default function MyComponent() {
	const { showNotification } = useNotifications();

	const handleSuccess = () => {
		showSuccessNotification(
			showNotification,
			"Success! 🎉",
			"Operation completed successfully."
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

**Why this pattern**:

- **Professional appearance**: Modern design with gradients and animations
- **Smart behavior**: Auto-dismisses on scroll for better UX
- **Global state**: Context API provides app-wide notification management
- **Type safety**: Full TypeScript support with proper interfaces
- **Performance**: Throttled scroll detection and efficient rendering

**Key Features**:

- **5 notification types**: Success, Error, Info, Warning, Basket
- **Scroll dismissal**: Automatically hides when users scroll down
- **Action buttons**: Interactive notifications with clear next steps
- **Bottom-right positioning**: Non-intrusive placement
- **Smooth animations**: Framer Motion-powered transitions

**Implementation**:

```typescript
// PremiumNotification.tsx - Main component
// NotificationManager.tsx - Context provider
// useNotifications hook - Easy access to notification functions
```

### Styling with Tailwind CSS

#### Responsive Design

**Pattern**: Mobile-first responsive design with breakpoint prefixes

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	<div className="p-4 md:p-6 lg:p-8">
		<h2 className="text-lg md:text-xl lg:text-2xl font-bold">
			Responsive Title
		</h2>
	</div>
</div>
```

**Why this pattern**: CSS Grid provides flexible, responsive layouts that adapt to different screen sizes. The `md:` prefix ensures the grid only applies on medium screens and larger.

## Security

### Input Validation

#### Client and Server Validation

**Pattern**: Validating data on both client and server sides

```typescript
// Client-side validation
if (
	!editingProduct.name ||
	!editingProduct.sku ||
	editingProduct.price_pence < 0
)
	return;

// Server-side validation (in API route)
if (!body || !body.name || !body.sku || typeof body.price_pence !== "number") {
	return NextResponse.json(
		{ error: "Missing required fields" },
		{ status: 400 }
	);
}
```

**Why this pattern**: Client-side validation provides immediate feedback, while server-side validation ensures data integrity regardless of client-side bypasses.

## Performance

### Optimistic Updates

#### Immediate UI Updates

**Pattern**: Updating the UI immediately while API calls are in progress

```typescript
// Update local state immediately
setForm({ name: "", sku: "", price_pence: 0, stock: 0, visible: true });

// Then refresh from server
await load();
```

**Why this pattern**: This provides a snappy user experience by updating the UI immediately, then syncing with the server to ensure consistency.

## Best Practices

### Error Handling

#### Try-Catch with Finally

**Pattern**: Ensuring cleanup operations always execute

```typescript
setIsLoading(true);
try {
	const r = await fetch("/api/admin/products", {
		/* ... */
	});
	if (r.ok) {
		/* ... */
	}
} finally {
	setIsLoading(false);
}
```

**Why this pattern**: The `finally` block ensures that loading states are always reset, even if errors occur, preventing the UI from getting stuck in a loading state.

### State Management

#### Immutable State Updates

**Pattern**: Using spread operator for state updates

```typescript
onChange={(e) =>
	setEditingProduct({ ...editingProduct, name: e.target.value })
}
```

**Why this pattern**: Immutable updates prevent unexpected side effects and make state changes predictable and debuggable.

### Notification Management

#### Context-Based Global State

**Pattern**: Using React Context for app-wide notification management

```typescript
// Provider setup
<NotificationProvider>
	<App />
</NotificationProvider>;

// Usage in components
const { showNotification } = useNotifications();

// Show notifications
showSuccessNotification(showNotification, "Title", "Message");
showErrorNotification(showNotification, "Error", "Details");
```

**Why this pattern**:

- **Global access**: Any component can show notifications
- **Centralised state**: Single source of truth for all notifications
- **Performance**: Efficient re-rendering and state updates
- **Type safety**: Full TypeScript support with proper interfaces

#### Scroll-Based Dismissal

**Pattern**: Automatically dismissing notifications when users scroll

```typescript
useEffect(() => {
	if (!dismissOnScroll) return;

	let lastScrollY = window.scrollY;
	let scrollTimeout: NodeJS.Timeout;

	const handleScroll = () => {
		const currentScrollY = window.scrollY;

		// If scrolling down more than 50px, dismiss notification
		if (currentScrollY > lastScrollY + 50) {
			handleClose();
		}

		lastScrollY = currentScrollY;
	};

	// Throttle scroll events for better performance
	const throttledScroll = () => {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(handleScroll, 100);
	};

	window.addEventListener("scroll", throttledScroll, { passive: true });

	return () => {
		window.removeEventListener("scroll", throttledScroll);
		clearTimeout(scrollTimeout);
	};
}, [dismissOnScroll]);
```

**Why this pattern**:

- **Better UX**: Notifications don't block content reading
- **Performance**: Throttled events prevent excessive function calls
- **Memory management**: Proper cleanup of event listeners
- **Smart threshold**: 50px threshold prevents accidental dismissal

## User Experience

### Notification Design

#### Professional Appearance

**Pattern**: Modern notification design with gradients and animations

```typescript
// Notification styling with Tailwind
<motion.div
	className="relative bg-white rounded-xl shadow-lg border-l-4 border-l-blue-500 overflow-hidden border border-gray-100"
	style={{ minWidth: "280px", maxWidth: "340px" }}>
	{/* Shimmer effect */}
	<div className="h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 animate-pulse" />

	{/* Content */}
	<div className="p-4">
		<div className="flex items-center gap-3">
			<div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
				<ShoppingCart size={15} />
			</div>
			<h3 className="font-bold text-gray-900 text-base tracking-tight">
				{title}
			</h3>
		</div>
	</div>
</motion.div>
```

**Why this pattern**:

- **Visual hierarchy**: Clear distinction between title, message, and actions
- **Brand consistency**: Unified design language across the application
- **Accessibility**: High contrast and readable typography
- **Modern feel**: Gradients and shadows create premium appearance

#### Action Buttons

**Pattern**: Interactive notifications with clear next steps

```typescript
{
	showActions && (
		<div className="flex gap-3">
			{onViewBasket && (
				<button
					onClick={onViewBasket}
					className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
					View Basket
				</button>
			)}
			{onContinueShopping && (
				<button
					onClick={onContinueShopping}
					className="flex-1 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border border-gray-200">
					Continue Shopping
				</button>
			)}
		</div>
	);
}
```

**Why this pattern**:

- **Clear actions**: Users know exactly what to do next
- **Primary/secondary**: Visual hierarchy guides user decisions
- **Hover effects**: Interactive feedback for better engagement
- **Consistent styling**: Matches the overall design system

---

## Performance Optimization

### Product Card Performance Best Practices

**Pattern**: Balance visual enhancements with performance considerations

```typescript
// ❌ Performance-Heavy Approach (Avoid)
<motion.div
	initial={{ opacity: 0, scale: 0.95 }}
	whileInView={{ opacity: 1, scale: 1 }}
	className="transform hover:-translate-y-2 transition-all duration-300">
	<Image
		className="hover:scale-105 transition-transform duration-300"
		// Heavy hover effects on every image
	/>
</motion.div>

// ✅ Performance-Optimized Approach
<motion.div
	initial={{ opacity: 0 }}
	whileInView={{ opacity: 1 }}
	transition={{ duration: 0.2 }}
	className="transition-shadow duration-200">
	<Image
		className="object-cover"
		// Simple, fast image rendering
	/>
</motion.div>
```

**Why this pattern**: Performance is critical for user experience. Heavy animations and complex CSS can significantly slow down page rendering and navigation.

**Key Performance Principles**:

- **Minimize Transforms**: Avoid complex hover effects on multiple elements
- **Simplify Animations**: Use lightweight entrance animations only
- **Optimize CSS**: Reduce dynamic class generation and complex transitions
- **Image Performance**: Avoid heavy image effects that trigger layout recalculation
- **Grid Optimization**: Use appropriate spacing that doesn't cause layout thrashing

**Performance Impact Examples**:

- **Heavy Hover Effects**: Can cause 2-3x slower page rendering
- **Complex Transforms**: May trigger layout recalculation on every interaction
- **Excessive CSS Classes**: Increases bundle size and parsing time
- **Large Grid Gaps**: Can cause unnecessary layout calculations

**Implementation Guidelines**:

- **Test Performance**: Always measure before/after performance impact
- **Progressive Enhancement**: Start with basic functionality, add effects gradually
- **Mobile First**: Ensure performance on slower devices
- **Monitor Metrics**: Watch for layout thrashing and rendering delays
