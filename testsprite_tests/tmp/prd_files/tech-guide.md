# 🔧 TJ's Bake & Browse - Complete Technical Guide

## 📋 **System Architecture Overview**

TJ's Bake & Browse is a modern Next.js 14 bakery e-commerce platform with Supabase backend, featuring minimal-elegance design, real-time data synchronization, and comprehensive order management.

**Tech Stack:**

- **Frontend**: Next.js 14.2.5, React 18, TypeScript
- **Styling**: TailwindCSS with custom design system
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: NextAuth.js with Supabase adapter
- **Email**: Resend API for notifications
- **Deployment**: Vercel (recommended)
- **Animation**: Framer Motion
- **Icons**: Lucide React + Custom SVGs

---

## 🏗️ **Application Architecture**

### **Directory Structure**

```
tjs-bake-browse-full/
├── app/                          # Next.js 14 App Router
│   ├── (pages)/
│   │   ├── page.tsx             # Homepage
│   │   ├── about/page.tsx       # About page
│   │   ├── baked-goods/page.tsx # Product category page
│   │   ├── groceries/page.tsx   # Product category page
│   │   ├── basket/page.tsx      # Shopping cart
│   │   ├── checkout/page.tsx    # Order placement
│   │   ├── login/page.tsx       # Authentication
│   │   ├── register/page.tsx    # User registration
│   │   └── suggestions/page.tsx # Customer feedback
│   ├── admin/                   # Admin interface
│   │   ├── layout.tsx          # Admin layout wrapper
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── orders/page.tsx     # Order management
│   │   ├── inventory/page.tsx  # Product management
│   │   └── products/page.tsx   # Advanced product editing
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── admin/              # Admin-only endpoints
│   │   ├── products/           # Product data API
│   │   ├── orders/             # Order management API
│   │   ├── cart/               # Shopping cart API
│   │   ├── slots/              # Time slot API
│   │   └── suggestions/        # Customer feedback API
│   ├── globals.css             # Global styles & design system
│   ├── layout.tsx              # Root layout
│   └── providers.tsx           # Context providers
├── components/                  # Reusable React components
├── lib/                        # Utility functions
├── public/                     # Static assets
├── docs/                       # Documentation
└── types.ts                    # TypeScript type definitions
```

### **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │ ←→ │   Next.js API    │ ←→ │   Supabase DB   │
│                 │    │     Routes       │    │                 │
│ React Components│    │                  │    │ PostgreSQL +    │
│ TailwindCSS     │    │ Middleware       │    │ Row Level       │
│ localStorage    │    │ Authentication   │    │ Security        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ↓                       ↓                       ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ State Management│    │  Business Logic  │    │  Data Storage   │
│                 │    │                  │    │                 │
│ CartContext     │    │ Order Processing │    │ Products        │
│ Notifications   │    │ Price Calculation│    │ Orders          │
│ Real-time Sync  │    │ Slot Generation  │    │ Categories      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🗄️ **Complete Database Schema**

### **Products Table**

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
    nutritional_info JSONB,
    image_url TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    is_visible BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    category_id UUID REFERENCES public.categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Categories Table**

```sql
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Orders Table**

```sql
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number BIGINT GENERATED BY DEFAULT AS IDENTITY UNIQUE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'collected', 'cancelled', 'rejected')),
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    subtotal_pence INTEGER NOT NULL,
    tax_pence INTEGER NOT NULL DEFAULT 0,
    bag_fee_pence INTEGER NOT NULL DEFAULT 0,
    total_pence INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    special_instructions TEXT,
    bag_opt_in BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Order Items Table**

```sql
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_pence INTEGER NOT NULL CHECK (unit_price_pence >= 0),
    total_price_pence INTEGER NOT NULL CHECK (total_price_pence >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 **API Documentation**

### **Products API** (`/api/products`)

**GET /api/products**

- **Purpose**: Fetch all visible products with category information
- **Authentication**: None required
- **Caching**: No cache (`Cache-Control: no-store`)
- **Real-time**: 30-second refresh cycle

**Query Logic:**

```sql
SELECT
    id, name, sku, short_description, price_pence, pack_label,
    allergens, ingredients, image_url, stock_quantity, is_visible,
    category_id, created_at, updated_at,
    categories:categories!products_category_id_fkey(
        id, name, slug, description
    )
FROM products
WHERE is_visible = true
ORDER BY name;
```

**Response Format:**

```typescript
interface ProductResponse {
	products: Array<{
		id: string;
		name: string;
		sku: string;
		price_pence: number;
		image_url?: string;
		pack_label?: string;
		allergens: string[];
		stock_quantity: number;
		is_visible: boolean;
		category_id: string;
		categories: Array<{
			id: string;
			name: string;
			slug: string;
			description?: string;
		}>;
		// Backward compatibility fields
		stock: number;
		visible: boolean;
		description: string;
	}>;
}
```

### **Orders API** (`/api/orders`)

**POST /api/orders**

- **Purpose**: Create new customer order
- **Authentication**: Optional (supports guest orders)
- **Validation**: Zod schema validation

**Request Schema:**

```typescript
interface CreateOrderRequest {
	pickup_date: string; // YYYY-MM-DD format
	pickup_time: string; // HH:MM format
	customer_name: string;
	customer_email: string;
	customer_phone?: string;
	bag_opt_in: boolean;
	special_instructions?: string;
	items: Array<{
		product_id: string;
		quantity: number;
		price_pence: number;
	}>;
}
```

---

## 🎨 **Minimal-Elegance Design System**

### **Core Principles**

- **Minimalism**: Clean, uncluttered interfaces
- **Elegance**: Sophisticated, professional appearance
- **Functionality**: Form follows function
- **Accessibility**: WCAG 2.1 AA compliance
- **Consistency**: Unified experience across all touchpoints

### **Typography Classes**

```css
.text-elegance-heading {
	@apply text-neutral-900 font-light tracking-wide;
}

.text-elegance-body {
	@apply text-neutral-600 font-light leading-relaxed;
}

.text-elegance-caption {
	@apply text-neutral-400 text-xs tracking-wider uppercase;
}
```

### **Component Classes**

```css
.btn-elegance-primary {
	@apply bg-black text-white px-8 py-3 text-sm font-medium tracking-wider uppercase 
           hover:bg-neutral-800 transition-all duration-300 border-none;
}

.card-elegance {
	@apply bg-white border-none shadow-none;
}

.input-elegance {
	@apply w-full px-0 py-3 text-neutral-800 placeholder-neutral-400 bg-transparent 
           border-0 border-b border-neutral-200 focus:border-neutral-400 focus:ring-0 
           transition-colors duration-300;
}
```

---

## 🧩 **Component Architecture**

### **Core Components**

#### **ProductCard Component**

```typescript
interface ProductCardProps {
	product: {
		id: string;
		name: string;
		price_pence: number;
		image_url?: string | null;
		pack_label?: string | null;
		allergens?: string[] | null;
	};
}

// Features:
// - Minimal-elegance styling
// - Framer Motion animations
// - AllergenIcons integration
// - Add to cart functionality
// - Fallback image handling
```

#### **AllergenIcons Component**

```typescript
interface AllergenIconsProps {
	allergens: unknown; // Flexible input handling
	variant?: "default" | "minimal";
}

// Features:
// - Click-to-reveal functionality
// - Scandinavian-style SVG icons
// - Mobile-optimized interactions
// - 15 supported allergens
// - Accessibility compliant
```

---

## 🔐 **Security Implementation**

### **Authentication System**

- NextAuth.js with credentials provider
- Supabase integration
- JWT session strategy
- Role-based access control

### **Route Protection**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/admin")) {
		return adminAuthMiddleware(request);
	}
}
```

### **Input Validation**

```typescript
const CreateOrderSchema = z.object({
	pickup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	pickup_time: z.string().regex(/^\d{2}:\d{2}$/),
	customer_name: z.string().min(1).max(255),
	customer_email: z.string().email(),
});
```

---

## 📊 **Performance Optimization**

### **Frontend Optimization**

- Next.js Image optimization
- Automatic WebP/AVIF conversion
- Lazy loading
- Cache busting for real-time data

### **Backend Optimization**

- Proper database indexing
- Efficient query patterns
- Connection pooling via Supabase
- Real-time update system

---

## 🚀 **Deployment Configuration**

### **Vercel Deployment**

```bash
# Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_ADMIN_EMAILS=
NEXT_PUBLIC_SLOT_CAPACITY=5
RESEND_API_KEY=
```

### **Build Configuration**

```javascript
// next.config.mjs
export default {
	images: {
		domains: ["dknzebbrpsecloomozzj.supabase.co"],
		formats: ["image/webp", "image/avif"],
	},
};
```

---

## 🔗 **External Documentation**

**Framework Resources:**

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

**Project Resources:**

- [User Guide](./user-guide.md) - Complete operational guide
- [Data Models](./data-models.md) - Database schema reference
- [Deployment Guide](./deployment-guide.md) - Setup procedures

---

**Last Updated**: Current Date  
**Version**: 3.0 (Minimal-Elegance Implementation)  
**Technical Lead**: Steve Lewis (lewis.s2021@outlook.com)
