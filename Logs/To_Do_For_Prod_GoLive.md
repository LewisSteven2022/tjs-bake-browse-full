# Production Go-Live Checklist - TJ's Bake & Browse

## 🚨 CRITICAL: Pre-Launch Security & Compliance

### 1. Environment Variables & Secrets Management

**Priority: CRITICAL**
**Estimated Time: 2-3 hours**

#### 1.1 Production Environment Variables

```bash
# Create .env.production.local file (NEVER commit this)
NEXTAUTH_SECRET=your-super-secure-random-string-64-chars
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com,owner@yourdomain.com
NEXT_PUBLIC_SLOT_CAPACITY=5
```

**Steps:**

1. Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 64
   ```
2. Update Supabase project settings with production domain
3. Create new Supabase service role key for production
4. Set admin emails for production access
5. Verify all environment variables are set correctly

#### 1.2 Remove Development Dependencies

```bash
# Remove from package.json and reinstall
npm uninstall @testing-library/jest-dom @testing-library/react vitest happy-dom whatwg-fetch
npm install --production
```

### 2. Database Security & Production Setup

**Priority: CRITICAL**
**Estimated Time: 3-4 hours**

#### 2.1 Supabase Production Security

1. **Enable Row Level Security (RLS)** on all tables:

   ```sql
   -- Verify RLS is enabled
   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   ```

2. **Review and tighten RLS policies**:

   ```sql
   -- Example: Tighten products policy
   DROP POLICY IF EXISTS catalogue_read ON public.products;
   CREATE POLICY catalogue_read ON public.products
   FOR SELECT USING (visible = true AND stock > 0);
   ```

3. **Create production admin user**:
   ```sql
   INSERT INTO public.users (email, password_hash, name, role, mobile)
   VALUES (
     'admin@yourdomain.com',
     '$2b$10$...', -- bcrypt hash of secure password
     'Production Admin',
     'admin',
     '+447700900000'
   );
   ```

#### 2.2 Database Backup & Recovery

1. **Set up automated backups** in Supabase dashboard
2. **Test backup restoration** process
3. **Document recovery procedures** for team

#### 2.3 Remove Test Data

```sql
-- Clean up any test data
DELETE FROM public.orders WHERE customer_email LIKE '%test%';
DELETE FROM public.products WHERE name LIKE '%test%';
DELETE FROM public.users WHERE email LIKE '%test%';
```

### 3. Authentication & User Management

**Priority: CRITICAL**
**Estimated Time: 2-3 hours**

#### 3.1 NextAuth.js Production Configuration

1. **Update auth configuration** in `app/api/auth/[...nextauth]/route.ts`:

   ```typescript
   export const authOptions: NextAuthOptions = {
   	session: {
   		strategy: "jwt",
   		maxAge: 30 * 24 * 60 * 60, // 30 days
   	},
   	providers: [
   		Credentials({
   			// ... existing config
   		}),
   	],
   	callbacks: {
   		// ... existing callbacks
   	},
   	// Add production security
   	secret: process.env.NEXTAUTH_SECRET,
   	debug: false, // Disable debug in production
   };
   ```

2. **Implement password complexity requirements**:
   ```typescript
   // In register route
   const passwordRegex =
   	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   if (!passwordRegex.test(password)) {
   	return NextResponse.json(
   		{
   			error:
   				"Password must be at least 8 characters with uppercase, lowercase, number, and special character",
   		},
   		{ status: 400 }
   	);
   }
   ```

#### 3.2 User Registration Security

1. **Add email verification** requirement
2. **Implement rate limiting** on registration/login
3. **Add CAPTCHA** for bot prevention

### 4. API Security & Rate Limiting

**Priority: HIGH**
**Estimated Time: 4-5 hours**

#### 4.1 Implement Rate Limiting

1. **Install rate limiting package**:

   ```bash
   npm install express-rate-limit
   ```

2. **Create rate limiting middleware**:

   ```typescript
   // lib/rateLimit.ts
   import rateLimit from "express-rate-limit";

   export const apiLimiter = rateLimit({
   	windowMs: 15 * 60 * 1000, // 15 minutes
   	max: 100, // limit each IP to 100 requests per windowMs
   	message: "Too many requests from this IP, please try again later.",
   	standardHeaders: true,
   	legacyHeaders: false,
   });

   export const authLimiter = rateLimit({
   	windowMs: 15 * 60 * 1000,
   	max: 5, // 5 attempts per 15 minutes
   	message: "Too many authentication attempts, please try again later.",
   });
   ```

3. **Apply to sensitive endpoints**:

   ```typescript
   // In API routes
   import { authLimiter } from "@/lib/rateLimit";

   export const POST = authLimiter(async (req: Request) => {
   	// ... existing code
   });
   ```

#### 4.2 Input Validation & Sanitisation

1. **Enhance Zod schemas** for all API inputs
2. **Add SQL injection protection** checks
3. **Implement request size limits**

#### 4.3 CORS Configuration

1. **Configure CORS** for production domain only
2. **Remove development CORS** settings
3. **Test CORS** from production domain

### 5. Error Handling & Logging

**Priority: HIGH**
**Estimated Time: 3-4 hours**

#### 5.1 Production Error Handling

1. **Remove development error details** from API responses
2. **Implement structured logging**:

   ```typescript
   // lib/logger.ts
   export const logger = {
   	info: (message: string, meta?: any) => {
   		console.log(
   			JSON.stringify({
   				level: "info",
   				message,
   				meta,
   				timestamp: new Date().toISOString(),
   			})
   		);
   	},
   	error: (message: string, error?: any, meta?: any) => {
   		console.error(
   			JSON.stringify({
   				level: "error",
   				message,
   				error: error?.message,
   				meta,
   				timestamp: new Date().toISOString(),
   			})
   		);
   	},
   };
   ```

3. **Add error tracking** (Sentry integration):
   ```bash
   npm install @sentry/nextjs
   ```

#### 5.2 API Logging Enhancement

1. **Improve middleware logging** with structured data
2. **Add performance monitoring** for slow queries
3. **Implement audit trail** for admin actions

### 6. Performance Optimisation

**Priority: MEDIUM**
**Estimated Time: 4-5 hours**

#### 6.1 Frontend Optimisation

1. **Enable Next.js production optimisations**:

   ```typescript
   // next.config.mjs
   const nextConfig = {
   	reactStrictMode: true,
   	swcMinify: true,
   	compress: true,
   	poweredByHeader: false,
   	generateEtags: false,
   };
   ```

2. **Implement image optimisation**:

   ```typescript
   // Add to next.config.mjs
   const nextConfig = {
   	images: {
   		domains: ["yourdomain.com"],
   		formats: ["image/webp", "image/avif"],
   	},
   };
   ```

3. **Add loading states** and skeleton screens

#### 6.2 Database Optimisation

1. **Add database indexes** for common queries:

   ```sql
   -- Add indexes for performance
   CREATE INDEX IF NOT EXISTS idx_orders_pickup_date_time ON public.orders(pickup_date, pickup_time);
   CREATE INDEX IF NOT EXISTS idx_products_category_visible ON public.products(category_id, visible);
   CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
   ```

2. **Optimise slow queries** identified in development
3. **Implement query result caching** where appropriate

### 7. Email & Notifications

**Priority: MEDIUM**
**Estimated Time: 3-4 hours**

#### 7.1 Email Configuration

1. **Configure Resend** with production domain
2. **Set up email templates** for:

   - Order confirmation
   - Order status updates
   - Password reset
   - Welcome emails

3. **Test email delivery** to multiple email providers
4. **Implement email queue** for reliability

#### 7.2 SMS Notifications (Future Enhancement)

1. **Research SMS providers** (Twilio, MessageBird)
2. **Plan SMS integration** for order updates
3. **Budget for SMS costs**

### 8. Payment Processing Integration

**Priority: HIGH**
**Estimated Time: 6-8 hours**

#### 8.1 Stripe Integration

1. **Install Stripe packages**:

   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Create Stripe account** and get API keys
3. **Implement payment flow**:

   - Create payment intent
   - Handle payment confirmation
   - Update order status
   - Handle payment failures

4. **Test payment flow** with Stripe test cards
5. **Implement webhook handling** for payment events

#### 8.2 Order Status Updates

1. **Update order statuses** based on payment:
   - `pending_payment` → `paid` → `preparing` → `ready`
2. **Add payment tracking** to orders table
3. **Implement refund handling**

### 9. Monitoring & Analytics

**Priority: MEDIUM**
**Estimated Time: 3-4 hours**

#### 9.1 Application Monitoring

1. **Set up Vercel Analytics** (if using Vercel)
2. **Implement health check endpoints**:

   ```typescript
   // app/api/health/route.ts
   export async function GET() {
   	try {
   		// Check database connection
   		const { data, error } = await admin
   			.from("products")
   			.select("count")
   			.limit(1);
   		if (error) throw error;

   		return NextResponse.json({
   			status: "healthy",
   			timestamp: new Date().toISOString(),
   			database: "connected",
   		});
   	} catch (error) {
   		return NextResponse.json(
   			{
   				status: "unhealthy",
   				timestamp: new Date().toISOString(),
   				error: error.message,
   			},
   			{ status: 500 }
   		);
   	}
   }
   ```

3. **Add uptime monitoring** (UptimeRobot, Pingdom)

#### 9.2 Business Analytics

1. **Implement Google Analytics 4**
2. **Track key business metrics**:
   - Orders placed
   - Revenue
   - Popular products
   - Customer retention

### 10. Legal & Compliance

**Priority: CRITICAL**
**Estimated Time: 4-6 hours**

#### 10.1 Privacy Policy & Terms

1. **Create comprehensive privacy policy**
2. **Draft terms of service**
3. **Implement cookie consent** banner
4. **Add GDPR compliance** features:
   - Data export
   - Data deletion
   - Consent management

#### 10.2 Business Compliance

1. **Verify tax calculation** accuracy (GST 6%)
2. **Implement order record keeping** (7 years minimum)
3. **Add business registration** information
4. **Create returns policy**

### 11. Testing & Quality Assurance

**Priority: HIGH**
**Estimated Time: 8-10 hours**

#### 11.1 Production Testing

1. **End-to-end testing** of complete user journey
2. **Load testing** with realistic user numbers
3. **Security testing**:

   - SQL injection attempts
   - XSS vulnerability testing
   - Authentication bypass attempts
   - Admin privilege escalation

4. **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
5. **Mobile device testing** (iOS, Android)

#### 11.2 User Acceptance Testing

1. **Create test scenarios** for admin users
2. **Test customer journey** from registration to order
3. **Verify all business rules** are enforced
4. **Test edge cases** and error conditions

### 12. Deployment & Infrastructure

**Priority: HIGH**
**Estimated Time: 4-6 hours**

#### 12.1 Production Deployment

1. **Choose hosting platform** (Vercel, Netlify, AWS)
2. **Set up production domain** and SSL certificate
3. **Configure CDN** for static assets
4. **Set up staging environment** for testing

#### 12.2 Environment Configuration

1. **Create production build**:

   ```bash
   npm run build
   npm run start
   ```

2. **Verify environment variables** are loaded correctly
3. **Test production build** locally before deployment

### 13. Documentation & Training

**Priority: MEDIUM**
**Estimated Time: 3-4 hours**

#### 13.1 User Documentation

1. **Create admin user manual**
2. **Write customer FAQ**
3. **Document troubleshooting** procedures
4. **Create video tutorials** for admin tasks

#### 13.2 Technical Documentation

1. **API documentation** (Swagger/OpenAPI)
2. **Database schema** documentation
3. **Deployment procedures**
4. **Maintenance schedules**

### 14. Go-Live Checklist

**Priority: CRITICAL**
**Estimated Time: 2-3 hours**

#### 14.1 Final Pre-Launch Checks

- [ ] All environment variables set correctly
- [ ] Database security policies active
- [ ] SSL certificate installed and working
- [ ] All admin accounts created and tested
- [ ] Payment processing tested end-to-end
- [ ] Email notifications working
- [ ] Error monitoring active
- [ ] Backup procedures tested
- [ ] Legal documents in place
- [ ] Team trained on admin procedures

#### 14.2 Launch Day

- [ ] Deploy to production
- [ ] Verify all functionality working
- [ ] Monitor error logs
- [ ] Test admin functions
- [ ] Verify customer registration works
- [ ] Test order placement
- [ ] Confirm payment processing
- [ ] Verify email notifications

#### 14.3 Post-Launch Monitoring

- [ ] Monitor system performance for 24 hours
- [ ] Check error logs every 2 hours
- [ ] Verify all business processes working
- [ ] Monitor customer feedback
- [ ] Track key metrics

## 🚀 Post-Launch Enhancements (Next 30 Days)

### 15. Customer Experience Improvements

1. **Order tracking** system
2. **Customer reviews** and ratings
3. **Loyalty programme** implementation
4. **Personalised recommendations**

### 16. Admin Efficiency Tools

1. **Bulk operations** for inventory
2. **Advanced reporting** dashboard
3. **Automated notifications** for low stock
4. **Customer communication** tools

### 17. Business Intelligence

1. **Sales analytics** dashboard
2. **Customer behaviour** insights
3. **Inventory forecasting**
4. **Performance benchmarking**

---

## 📋 Summary of Critical Path Items

**Week 1 (Critical Security & Setup):**

- Environment variables and secrets
- Database security and RLS policies
- Authentication hardening
- Basic security testing

**Week 2 (Core Functionality):**

- Payment processing integration
- Email notifications
- Error handling and logging
- Performance optimisation

**Week 3 (Testing & Compliance):**

- Comprehensive testing
- Legal compliance
- User documentation
- Final deployment preparation

**Week 4 (Launch & Monitoring):**

- Production deployment
- Go-live monitoring
- Post-launch support
- Enhancement planning

---

_This checklist should be completed in order of priority. Critical items must be completed before any production deployment. Each item should be signed off by the development team lead before proceeding to the next phase._
