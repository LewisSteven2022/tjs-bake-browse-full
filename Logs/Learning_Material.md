# Learning Material

## Recent Updates

### Comprehensive Button Styling Update (Latest)

**Date**: Current Session  
**Scope**: Site-wide button and input field styling consistency

**Changes Made**:

- **Button Styling Standardisation**: Updated all buttons across the site to use consistent `rounded-full` styling with blue color scheme (`bg-blue-800 hover:bg-blue-700`)
- **Input Field Consistency**: Standardised all input fields to use `rounded-full` styling for visual consistency
- **Color Scheme Unification**: Replaced various color schemes (gradients, different blues, primary colors) with consistent blue-800/blue-700 palette
- **Component Updates**: Updated buttons in all major components and pages:
  - Main pages: Homepage, About, Login, Register, Basket, Checkout, Order Success
  - Admin pages: Orders, Products, Inventory management
  - Test pages: Notifications, Scroll dismissal, Styling variations
  - Components: NavAuth, PremiumNotification, ProductCard

**Technical Details**:

- **Before**: Mixed styling with `rounded-lg`, `rounded-xl`, gradients, and various color schemes
- **After**: Consistent `rounded-full` styling with `bg-blue-800 hover:bg-blue-700` for primary actions
- **Border Styling**: Secondary buttons use `rounded-full border` with `hover:bg-gray-50`
- **Input Fields**: All form inputs now use `rounded-full border` for consistency

**Benefits**:

- **Visual Consistency**: Unified button appearance across all pages
- **Professional Look**: Clean, modern rounded design that matches the site's aesthetic
- **User Experience**: Consistent interaction patterns throughout the application
- **Maintainability**: Easier to maintain and update button styles in the future

**Files Modified**:

- `app/page.tsx` - Homepage CTA buttons
- `app/login/page.tsx` - Login form and button
- `app/register/page.tsx` - Registration form and button
- `app/basket/page.tsx` - Basket action buttons
- `app/checkout/page.tsx` - Checkout form and buttons
- `app/order-success/page.tsx` - Success page navigation buttons
- `app/admin/orders/page.tsx` - Admin order management buttons
- `app/admin/products/page.tsx` - Admin product management buttons
- `app/admin/inventory/page.tsx` - Admin inventory management buttons
- `components/NavAuth.tsx` - Navigation authentication buttons
- `components/PremiumNotification.tsx` - Notification action buttons
- `components/ProductCard.tsx` - Product card action buttons
- `app/test-notifications/page.tsx` - Test notification buttons
- `app/test-scroll-dismissal/page.tsx` - Test scroll dismissal buttons
- `app/test-styling/homepage/page.tsx` - Test homepage styling buttons
- `app/test-styling/baked-goods/page.tsx` - Test baked goods page buttons

**Design Philosophy**:

- **Primary Actions**: Blue buttons (`bg-blue-800 hover:bg-blue-700`) for main actions like "Sign In", "Checkout", "Save Changes"
- **Secondary Actions**: Bordered buttons (`border hover:bg-gray-50`) for secondary actions like "Clear basket", "Cancel"
- **Form Elements**: Consistent rounded styling for all input fields and form controls
- **Visual Hierarchy**: Clear distinction between primary and secondary actions through color and styling

---

## Previous Updates

This document contains explanations and examples of code patterns, libraries, and techniques used in the TJ's Bake & Browse project.

## Frontend

### Product Card Component Enhancements

**File:** `components/ProductCard.tsx`

**What was implemented:**

- Visual feedback when adding items to basket (button state changes, loading spinner, success checkmark)
- Accessibility improvements with ARIA live regions for screen readers
- Modern styling with rounded corners, shadows, and hover effects
- Consistent button positioning regardless of content length

**Key patterns:**

```typescript
// State management for button interactions
const [isAdding, setIsAdding] = useState(false);
const [isAdded, setIsAdded] = useState(false);

// ARIA live region for accessibility
<div aria-live="polite" className="sr-only">
  {isAdded && `${product.name} added to basket`}
</div>

// Consistent layout with fixed-height container
<div className="min-h-[60px] flex flex-col items-center justify-center space-y-2">
  {/* Optional content that maintains consistent spacing */}
</div>
```

**Why this approach:**

- Improves user experience with immediate visual feedback
- Ensures accessibility compliance for screen readers
- Creates professional, consistent appearance across all product cards
- Maintains performance while adding visual enhancements

### NextAuth Configuration Best Practices

**File:** `lib/auth.ts`

**What was implemented:**

- Separated NextAuth configuration from the API route handler
- Centralized authentication options in a dedicated configuration file

**Key patterns:**

```typescript
// lib/auth.ts - Centralized configuration
export const authOptions: NextAuthOptions = {
	// ... configuration
};

// API route - Clean import
import { authOptions } from "@/lib/auth";
const handler = NextAuth(authOptions);
```

**Why this approach:**

- App Router compliance (prevents "authOptions is not a valid Route export" error)
- Better code organisation and reusability
- Easier testing and maintenance
- Follows Next.js 13+ best practices

### Performance Optimization / Product Card Performance Best Practices

**File:** `components/ProductCard.tsx`, `components/ProductGrid.tsx`

**What was implemented:**

- Simplified animations and reduced CSS complexity
- Optimised grid layout with reduced gaps
- Balanced visual appeal with performance

**Key patterns:**

```typescript
// Simplified motion.div for better performance
<motion.div
  initial={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
>

// Reduced grid gaps for better performance
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

**Why this approach:**

- Heavy animations can cause performance issues on lower-end devices
- Simplified CSS reduces rendering complexity
- Better balance between visual appeal and performance
- Improved user experience across all device types

### Consistent Site Styling System

**File:** `app/test-styling/` directory

**What was implemented:**

- Comprehensive test page system for new styling approach
- Blue colour scheme with modern pastel aesthetics
- Professional premium feel with consistent design patterns
- Test pages for baked-goods, about, and disclaimers sections

**Key design patterns:**

```typescript
// Consistent background gradients
className =
	"min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50";

// Enhanced card containers with backdrop blur
className =
	"bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100";

// Gradient text for headings
className =
	"text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent";

// Consistent spacing and typography
className = "max-w-6xl mx-auto px-6 py-20";
```

**Design principles:**

- **Colour consistency:** Blue-based palette throughout all components
- **Visual hierarchy:** Clear distinction between sections and content levels
- **Modern aesthetics:** Rounded corners, subtle shadows, and gradient accents
- **Professional appearance:** Clean layouts with appropriate white space
- **Accessibility:** High contrast ratios and clear typography

**Test page structure:**

- `/test-styling` - Main navigation hub
- `/test-styling/baked-goods` - Enhanced product listing
- `/test-styling/about` - Company story and values
- `/test-styling/disclaimers` - Important information display

**Why this approach:**

- Allows testing new designs without affecting live site
- Demonstrates consistent styling across different content types
- Provides visual examples for stakeholder review
- Establishes design system foundation for future development

## Backend

### API Route Error Handling

**File:** `app/api/admin/inventory/route.ts`

**What was implemented:**

- Comprehensive error handling for PATCH requests
- Input validation with meaningful error messages
- Proper HTTP status codes for different error types

**Key patterns:**

```typescript
// Input validation with descriptive errors
if (typeof name !== "string" || name.trim().length === 0) {
	return NextResponse.json(
		{ error: "Name must be a non-empty string" },
		{ status: 400 }
	);
}

// Consistent error response format
return NextResponse.json(
	{ error: e?.message ?? "Failed to update product" },
	{ status: 500 }
);
```

**Why this approach:**

- Better debugging and user experience
- Consistent API response format
- Proper HTTP status codes for client handling
- Security through input validation

### Admin Orders Collection Slot Time Filtering Enhancement (December 2024)

**Objective**: Enhance admin orders page with time-based filtering to prioritise urgent orders needing collection.

**Key Implementation Details**:

1. **Time Filter State Management**:

   ```typescript
   const [timeFilter, setTimeFilter] = useState<string>("all");
   const TIME_FILTERS = [
   	{ value: "all", label: "All Times" },
   	{ value: "urgent", label: "🚨 Urgent (Next 2 hours)" },
   	{ value: "today", label: "📅 Today" },
   	{ value: "morning", label: "🌅 Morning (9AM-12PM)" },
   	{ value: "afternoon", label: "☀️ Afternoon (12PM-5PM)" },
   	{ value: "evening", label: "🌆 Evening (5PM-7PM)" },
   ] as const;
   ```

2. **Robust Time Parsing**:

   ```typescript
   const isUrgent = (pickupDate: string, pickupTime: string) => {
   	try {
   		const now = new Date();
   		const today = now.toISOString().split("T")[0];

   		if (pickupDate !== today) return false;

   		const timeParts = pickupTime.split(":");
   		if (timeParts.length !== 2) return false;

   		const hours = parseInt(timeParts[0], 10);
   		const minutes = parseInt(timeParts[1], 10);

   		if (isNaN(hours) || isNaN(minutes)) return false;

   		// ... time comparison logic
   	} catch (error) {
   		console.warn("Error checking if order is urgent:", error);
   		return false;
   	}
   };
   ```

3. **API Route Enhancement**:

   ```typescript
   if (time && time !== "all") {
   	try {
   		const now = new Date();
   		const today = now.toISOString().split("T")[0];

   		switch (time) {
   			case "urgent":
   				const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
   				const currentTimeStr = now.toTimeString().slice(0, 5);
   				const twoHoursTimeStr = twoHoursFromNow.toTimeString().slice(0, 5);

   				q = q
   					.eq("pickup_date", today)
   					.lte("pickup_time", twoHoursTimeStr)
   					.gte("pickup_time", currentTimeStr);
   				break;
   			// ... other time cases
   		}
   	} catch (error) {
   		console.warn("Error applying time filter:", error);
   		// Continue without time filtering if there's an error
   	}
   }
   ```

**Lessons Learned**:

1. **Error Handling**: Always wrap time parsing logic in try-catch blocks to prevent crashes from malformed data
2. **Input Validation**: Validate time format before parsing to ensure robust functionality
3. **Graceful Degradation**: If time filtering fails, continue without it rather than breaking the entire page
4. **User Experience**: Visual indicators (red backgrounds, urgent badges) make urgent orders immediately identifiable
5. **Quick Filters**: Pre-configured filter combinations improve admin workflow efficiency

**Testing Approach**:

- Test with various time formats and edge cases
- Verify API responses for different time filter combinations
- Test error handling with invalid time data
- Verify visual indicators appear correctly for urgent orders

## Database

### Supabase Integration

**File:** `lib/db.ts`

**What was implemented:**

- Centralized database connection and query functions
- Type-safe database operations
- Error handling for database operations

**Key patterns:**

```typescript
// Centralized client creation
export const db = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Type-safe query functions
export async function oneUserByEmail(email: string) {
	const { data, error } = await db
		.from("users")
		.select("*")
		.eq("email", email)
		.single();

	return { data, error };
}
```

**Why this approach:**

- Single source of truth for database operations
- Easier maintenance and updates
- Consistent error handling patterns
- Type safety for better development experience

## General Patterns

### Component State Management

**File:** Various component files

**What was implemented:**

- Local state for UI interactions
- Optimistic updates for better UX
- Proper cleanup and state reset

**Key patterns:**

```typescript
// Local state management
const [isAdding, setIsAdding] = useState(false);
const [isAdded, setIsAdded] = useState(false);

// Optimistic updates
setRows((prevRows) =>
	prevRows.map((row) => (row.id === p.id ? { ...row, ...payload } : row))
);

// State cleanup
useEffect(() => {
	if (isAdded) {
		const timer = setTimeout(() => setIsAdded(false), 2000);
		return () => clearTimeout(timer);
	}
}, [isAdded]);
```

**Why this approach:**

- Immediate user feedback
- Better perceived performance
- Proper memory management
- Consistent user experience

### Error Boundary and Fallback Patterns

**File:** `components/NavBasket.tsx`

**What was implemented:**

- Graceful degradation when external functions are unavailable
- Local fallback implementations for critical functionality
- Error handling that doesn't break the user experience

**Key patterns:**

```typescript
// Local fallback implementation
function getGuestCart(): CartItem[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem("guest-cart");
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

// Graceful error handling
try {
	// Primary implementation
} catch {
	// Fallback to local implementation
	const guestItems = getGuestCart();
	return guestItems.reduce(
		(s: number, i: CartItem) => s + (Number(i.qty) || 0),
		0
	);
}
```

**Why this approach:**

- Ensures functionality even when dependencies fail
- Better user experience during development
- Robust error handling
- Maintains core functionality under various conditions

### User-Requested Styling Updates

**Files:** `components/ParallaxHero.tsx`, `app/about/page.tsx`, `app/disclaimer/page.tsx`

**What was implemented:**

- Removed blue tinting from hero images as requested by user
- Applied gradient background from test-styling/about to the real about page
- Reduced padding on values cards section for better visual balance
- Completely redesigned disclaimer page using test-styling approach
- Updated dietary requirements content to remove healthcare consultation advice
- Corrected ordering information: same-day collection available before 12 PM, orders after 2 PM may be processed next day

**Key changes made:**

```typescript
// ParallaxHero - Removed blue tinting
// Before: <div className="absolute inset-0 bg-primaryDark/40" />
// After: {/* Removed blue tinting as requested by user */}

// About page - Added gradient background
className =
	"min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50";

// About page - Reduced values section padding
className = "bg-primaryLight/20 py-12"; // was py-16
className = "text-3xl font-bold text-primaryDark mb-8"; // was mb-10
className = "grid gap-6 sm:grid-cols-2 md:grid-cols-4"; // was gap-8

// Disclaimer page - Complete redesign with new styling
className =
	"min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50";
className =
	"bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100";
```

**Content updates:**

- **Dietary Requirements**: Removed "consult healthcare professionals" advice, focused on ingredient selection and protocols
- **Ordering Information**: Updated to reflect actual business practices (same-day collection before 12 PM, orders after 2 PM may be processed next day)
- **Allergen Information**: Maintained existing content with enhanced visual presentation

**Why this approach:**

- Respects user preferences while maintaining design consistency
- Applies successful test styling elements to live pages
- Improves visual hierarchy and readability
- Provides accurate business information to customers
- Maintains professional appearance while addressing user feedback

### Suggestions Form Implementation (December 2024)

**Objective**: Create a customer feedback system accessible to logged-in users to collect suggestions and improve business operations.

**Key Implementation Details**:

1. **Authentication Protection**:

   ```typescript
   // Check authentication in API route
   const session = await getServerSession(authOptions);
   if (!session?.user) {
   	return NextResponse.json(
   		{ error: "Authentication required" },
   		{ status: 401 }
   	);
   }
   ```

2. **Form State Management**:

   ```typescript
   const [formData, setFormData] = useState({
   	subject: "",
   	message: "",
   	category: "general",
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   ```

3. **Input Validation**:

   ```typescript
   // Validate required fields
   if (!subject || !message || !category) {
   	return NextResponse.json(
   		{ error: "Subject, message, and category are required" },
   		{ status: 400 }
   	);
   }

   // Validate lengths
   if (subject.length > 100 || message.length > 1000) {
   	return NextResponse.json(
   		{ error: "Input exceeds maximum length" },
   		{ status: 400 }
   	);
   }
   ```

4. **Email Integration**:

   ```typescript
   const emailSubject = `[Suggestion] ${subject}`;
   const emailBody = `
   New suggestion submitted by ${session.user.name} (${session.user.email})
   
   Category: ${category}
   Subject: ${subject}
   
   Message:
   ${message}
   `;

   await sendEmail({
   	to: "tjsbakeandbrowse@gmail.com",
   	subject: emailSubject,
   	text: emailBody,
   });
   ```

5. **Navigation Integration**:
   ```typescript
   // Add to NavAuth component
   <Link
   	href="/suggestions"
   	className="rounded-full border px-3 py-1 hover:bg-gray-50 text-sm">
   	💡 Suggestions
   </Link>
   ```

**Lessons Learned**:

1. **Authentication First**: Always implement authentication protection for user-generated content to prevent spam
2. **Input Validation**: Validate both client and server-side to ensure data quality and security
3. **User Experience**: Provide multiple access points (navigation + order success page) for better engagement
4. **Error Handling**: Comprehensive error handling with user-friendly messages improves reliability
5. **Email Integration**: Structured email format with clear subject lines helps business process feedback efficiently

**Testing Approach**:

- Test form submission with valid and invalid data
- Verify authentication protection works correctly
- Test email delivery and formatting
- Verify navigation integration across different pages
- Test responsive design on various screen sizes

**Business Value**:

- Direct customer feedback collection
- Improved customer engagement
- Business insights for product/service improvements
- Professional appearance and user experience
