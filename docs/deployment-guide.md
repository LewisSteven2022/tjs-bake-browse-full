# 🚀 TJ's Bake & Browse - Production Deployment Guide

## 📋 **Prerequisites**

- Supabase account and project
- Vercel/Netlify account (or other hosting platform)
- Access to domain DNS settings
- Node.js 18+ and npm installed locally
- Git repository access
- Resend account for email functionality

## 🔧 **Phase 1: Database Setup**

### **1.1 Create Supabase Project**

1. **Create New Project**

   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organisation and project name
   - Set strong database password
   - Select region (closest to your users)

2. **Note Configuration Details**
   ```
   Project URL: https://[your-project-ref].supabase.co
   Anon Key: [your-anon-key]
   Service Role Key: [your-service-key] (keep secret)
   Database Password: [your-db-password]
   ```

### **1.2 Deploy Database Schema**

1. **Open Supabase SQL Editor**

   - Navigate to your Supabase dashboard
   - Go to SQL Editor

2. **Run Database Setup**

   - Copy entire contents of `NEW_DATABASE_SCHEMA_IMPLEMENTATION.sql`
   - Paste into SQL Editor
   - Click "Run" to execute

3. **Verify Schema Creation**

   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;

   -- Check RLS is enabled
   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   AND rowsecurity = true;
   ```

### **1.3 Seed Initial Data**

1. **Add Categories**

   ```sql
   INSERT INTO public.categories (id, name, slug, description) VALUES
       ('a435f3b9-6a3c-4bdc-ba45-b2ca2ccf500b', 'Baked Goods', 'baked_goods', 'Freshly baked goods and treats'),
       ('3c27609f-cbb5-4ad0-a88f-ef619be670d6', 'Groceries', 'groceries', 'Pantry essentials and ingredients'),
       ('1da60f7e-3f2c-479c-87de-a01bd1643e15', 'Specialty Items', 'specialty_items', 'Unique and seasonal items'),
       ('54aa597f-3657-4b9c-9d2e-44e64705bb4a', 'Beverages', 'beverages', 'Hot and cold drinks')
   ON CONFLICT (id) DO NOTHING;
   ```

2. **Set Bag Fee**
   ```sql
   INSERT INTO public.configurable_fees (name, description, amount_pence) VALUES
       ('Bag Fee', 'Optional bag fee for orders', 50)
   ON CONFLICT (name) DO UPDATE SET
       amount_pence = EXCLUDED.amount_pence,
       updated_at = NOW();
   ```

## 🌐 **Phase 2: Environment Configuration**

### **2.1 Production Environment Variables**

Create `.env.production` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_BASE_URL=https://[your-domain].com

# NextAuth Configuration
NEXTAUTH_URL=https://[your-domain].com
NEXTAUTH_SECRET=[generate-strong-secret-key]

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourbakery.com,manager@yourbakery.com

# Email Configuration (Resend)
RESEND_API_KEY=[your-resend-api-key]

# Optional: Database URL for migrations
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### **2.2 Local Development Environment**

Create `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[local-development-secret]

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourbakery.com

# Email Configuration (Resend)
RESEND_API_KEY=[your-resend-api-key]
```

### **2.3 Generate Secure Secrets**

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🏗️ **Phase 3: Application Deployment**

### **3.1 Pre-Deployment Checklist**

1. **Test Locally**

   ```bash
   npm install
   npm run build
   npm run dev
   ```

2. **Verify Database Connection**

   - Visit `/api/debug` locally
   - Check database connectivity
   - Verify RLS policies working

3. **Test Core Functionality**
   - Browse products by category
   - Add items to cart
   - Create test order
   - Access admin dashboard
   - Test email functionality

### **3.2 Vercel Deployment (Recommended)**

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**

   ```bash
   # First deployment
   vercel --prod

   # Follow prompts:
   # - Link to existing project or create new
   # - Set build command: npm run build
   # - Set output directory: .next
   ```

3. **Configure Environment Variables**

   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all production environment variables
   - Ensure they're set for "Production" environment

4. **Set Custom Domain**
   - Go to Vercel Dashboard → Project Settings → Domains
   - Add your custom domain
   - Configure DNS as instructed

### **3.3 Alternative: Netlify Deployment**

1. **Build Application**

   ```bash
   npm run build
   npm run export  # If using static export
   ```

2. **Deploy to Netlify**

   - Drag and drop `out` folder to Netlify
   - Or connect Git repository for automatic deployments

3. **Configure Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all production environment variables

### **3.4 Self-Hosted Deployment**

1. **Server Requirements**

   - Node.js 18+
   - PM2 or similar process manager
   - Reverse proxy (Nginx recommended)
   - SSL certificate

2. **Deployment Steps**

   ```bash
   # On server
   git clone [your-repository]
   cd tjs-bake-browse-full
   npm install
   npm run build

   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start npm --name "tjs-bakery" -- start
   pm2 save
   pm2 startup
   ```

## 🔒 **Phase 4: Security Configuration**

### **4.1 Supabase Security**

1. **RLS Policies**

   - Verify all tables have appropriate RLS policies
   - Test policies with different user roles
   - Ensure no data leakage between customers

2. **API Rate Limiting**
   - Configure Supabase rate limits
   - Monitor for unusual API usage
   - Set up alerts for exceeded limits

### **4.2 Application Security**

1. **Admin Access**

   - Configure admin emails in environment variables
   - Use strong passwords for admin accounts
   - Consider 2FA for admin accounts (future enhancement)

2. **Environment Secrets**
   - Never commit `.env` files to Git
   - Use platform-specific secret management
   - Rotate secrets regularly

## 📊 **Phase 5: Post-Deployment Verification**

### **5.1 Functionality Testing**

1. **Customer Journey**

   - [ ] Homepage loads correctly
   - [ ] Product categories display products
   - [ ] Add items to cart
   - [ ] Proceed through checkout
   - [ ] Place test order
   - [ ] Verify order in admin dashboard
   - [ ] Test email notifications

2. **Admin Functions**

   - [ ] Admin login works
   - [ ] Product management functions
   - [ ] Order status updates
   - [ ] Inventory management

3. **API Endpoints**
   ```bash
   # Test key endpoints
   curl https://[your-domain]/api/products
   curl https://[your-domain]/api/slots?date=2025-08-20
   curl https://[your-domain]/api/debug  # Should show database status
   ```

### **5.2 Performance Verification**

1. **Page Load Times**

   - Homepage: < 2 seconds
   - Product pages: < 3 seconds
   - Admin dashboard: < 4 seconds

2. **Database Performance**
   - Check Supabase dashboard for query performance
   - Monitor for slow queries
   - Verify RLS policies don't cause performance issues

## 🔧 **Phase 6: Ongoing Maintenance**

### **6.0 Email System Configuration**

1. **Set up Resend Account**

   - Create account at [resend.com](https://resend.com)
   - Generate API key
   - Add key to environment variables as `RESEND_API_KEY`

2. **Configure Domain**

   - Verify your domain with Resend
   - Update `lib/email.ts` with your domain:
     ```typescript
     // Change from
     from: "noreply@tjsbakeandbrowse.example";
     // To your verified domain
     from: "noreply@yourdomain.com";
     ```

3. **Test Email Configuration**

   ```bash
   # Test endpoint (requires authentication)
   curl -X POST https://[your-domain]/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"to": "your-test-email@example.com"}'
   ```

4. **Email Features Using Resend**

   - Order confirmations
   - Customer suggestions/feedback
   - Admin notifications
   - Password reset emails (if implemented)

5. **Common Email Issues**

   - **Issue**: Emails not sending

     - Check `RESEND_API_KEY` is set correctly
     - Verify domain configuration in Resend
     - Check email logs in Resend dashboard

   - **Issue**: Emails going to spam
     - Complete domain verification
     - Set up DKIM, SPF records
     - Use consistent "from" addresses

### **6.1 Monitoring Setup**

1. **Supabase Monitoring**

   - Enable database alerts
   - Monitor connection limits
   - Track query performance

2. **Application Monitoring**
   - Set up error tracking (Sentry recommended)
   - Monitor application performance
   - Track user behaviour analytics

### **6.2 Backup Strategy**

1. **Database Backups**

   - Enable Supabase point-in-time recovery
   - Schedule regular database exports
   - Test restore procedures monthly

2. **Code Backups**
   - Ensure Git repository is backed up
   - Tag stable releases
   - Maintain development/staging environments

## 🚨 **Troubleshooting Common Issues**

### **Database Connection Issues**

```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test database connectivity
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

### **RLS Policy Errors**

```sql
-- Temporarily disable RLS for debugging
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
```

### **Build Failures**

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

## 🎯 **Gotchas & Common Pitfalls**

### **1. Supabase RLS Policies**

- **Issue**: Policies can cause infinite recursion
- **Prevention**: Keep policies simple, avoid circular references
- **Fix**: Simplify policy logic, test thoroughly

### **2. Environment Variable Caching**

- **Issue**: Changes to environment variables not reflected
- **Prevention**: Restart application after env changes
- **Fix**: Clear platform cache, redeploy

### **3. Database Schema Mismatches**

- **Issue**: API using old column names
- **Prevention**: Always update documentation with schema changes
- **Fix**: Run schema audit, update all references

### **4. NextAuth Configuration**

- **Issue**: Authentication not working in production
- **Prevention**: Ensure NEXTAUTH_URL matches production domain
- **Fix**: Update environment variables, redeploy

### **5. Table Sync Issues**

- **Issue**: Local database out of sync with production
- **Prevention**: Use migration scripts for all changes
- **Fix**: Export production schema, import to local

### **6. Email Configuration Issues**

- **Issue**: Emails not being sent or going to spam
- **Prevention**: Complete domain verification, use consistent from addresses
- **Fix**: Check Resend dashboard, verify API key and domain setup

## 📞 **Support & Escalation**

### **Deployment Issues**

1. Check deployment logs for specific errors
2. Verify all environment variables are set correctly
3. Test database connectivity separately
4. Contact platform support (Vercel/Netlify) if needed

### **Database Issues**

1. Check Supabase dashboard for errors
2. Review RLS policies for conflicts
3. Monitor database performance metrics
4. Contact Supabase support for infrastructure issues

### **Application Issues**

1. Check browser console for client-side errors
2. Review server logs for API errors
3. Test in private/incognito mode
4. Verify DNS and SSL certificate status

### **Email Issues**

1. Check Resend dashboard for delivery status
2. Verify API key and domain configuration
3. Review email templates and from addresses
4. Contact Resend support for delivery issues

## 📚 **Post-Deployment Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [User Guide](./user-guide.md) - For daily operations
- [Bug Tracking](./bugs.md) - For reporting issues

---

**Last Updated**: Current Date  
**Version**: 2.0.0  
**Next Review**: After major releases  
**Support Contact**: [Technical Support Email]
