# Deployment Guide - TJ's Bake & Browse

## Overview

This guide provides step-by-step instructions for deploying TJ's Bake & Browse from development to production. It covers all environments, hosting options, and deployment strategies.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Hosting Platform Options](#hosting-platform-options)
4. [Database Deployment](#database-deployment)
5. [Application Deployment](#application-deployment)
6. [Domain & SSL Configuration](#domain--ssl-configuration)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Rollback Procedures](#rollback-procedures)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Development Complete

- [ ] All features tested and working
- [ ] Code review completed
- [ ] Security audit passed
- [ ] Performance testing completed
- [ ] Browser compatibility verified
- [ ] Mobile responsiveness tested

### ✅ Production Readiness

- [ ] Environment variables configured
- [ ] Database schema finalised
- [ ] SSL certificates obtained
- [ ] Domain names registered
- [ ] Backup procedures established
- [ ] Monitoring tools configured

### ✅ Team Preparation

- [ ] Deployment team assigned
- [ ] Rollback procedures documented
- [ ] Support team briefed
- [ ] Customer communication plan ready
- [ ] Maintenance window scheduled

---

## Environment Setup

### Environment Variables

#### Production Environment File (`.env.production.local`)

```bash
# Never commit this file to version control
NEXTAUTH_SECRET=your-super-secure-random-string-64-chars
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com,owner@yourdomain.com
NEXT_PUBLIC_SLOT_CAPACITY=5

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Email (if using Resend)
RESEND_API_KEY=your-resend-api-key

# Payment Processing (if using Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
```

#### Staging Environment File (`.env.staging.local`)

```bash
# Staging-specific configuration
NEXTAUTH_URL=https://staging.yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
# ... other staging-specific variables
```

### Environment-Specific Builds

#### Next.js Configuration

```typescript
// next.config.mjs
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	compress: true,
	poweredByHeader: false,
	generateEtags: false,

	// Environment-specific settings
	env: {
		CUSTOM_KEY: process.env.CUSTOM_KEY,
	},

	// Image optimization
	images: {
		domains: ["yourdomain.com", "staging.yourdomain.com"],
		formats: ["image/webp", "image/avif"],
	},

	// Security headers
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		];
	},
};

export default nextConfig;
```

---

## Hosting Platform Options

### Option 1: Vercel (Recommended for Next.js)

#### Advantages

- **Next.js Optimised**: Built specifically for Next.js applications
- **Zero Configuration**: Automatic deployments from Git
- **Global CDN**: Fast loading worldwide
- **Automatic SSL**: Free SSL certificates
- **Preview Deployments**: Automatic staging environments

#### Setup Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod

# 4. Set environment variables
vercel env add NEXTAUTH_SECRET
vercel env add SUPABASE_SERVICE_ROLE
# ... add all required variables
```

#### Vercel Configuration (`vercel.json`)

```json
{
	"version": 2,
	"builds": [
		{
			"src": "package.json",
			"use": "@vercel/next"
		}
	],
	"env": {
		"NEXTAUTH_URL": "https://yourdomain.com"
	},
	"functions": {
		"app/api/**/*.ts": {
			"maxDuration": 30
		}
	}
}
```

### Option 2: Netlify

#### Advantages

- **Static Site Optimisation**: Great for static exports
- **Form Handling**: Built-in form processing
- **Git Integration**: Automatic deployments
- **Free Tier**: Generous free hosting

#### Setup Steps

```bash
# 1. Build for static export
npm run build
npm run export

# 2. Deploy to Netlify
netlify deploy --prod --dir=out
```

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build && npm run export"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Option 3: AWS (Full Control)

#### Advantages

- **Complete Control**: Full infrastructure management
- **Scalability**: Enterprise-grade scaling
- **Cost Control**: Pay-per-use pricing
- **Integration**: AWS service ecosystem

#### Setup Steps

```bash
# 1. Install AWS CLI
aws configure

# 2. Create S3 bucket for static assets
aws s3 mb s3://your-app-bucket

# 3. Configure CloudFront distribution
aws cloudfront create-distribution --distribution-config file://dist-config.json

# 4. Deploy application
aws s3 sync out/ s3://your-app-bucket --delete
```

#### AWS Configuration Files

```json
// dist-config.json
{
	"CallerReference": "your-app-distribution",
	"Comment": "Your app distribution",
	"DefaultRootObject": "index.html",
	"Origins": {
		"Quantity": 1,
		"Items": [
			{
				"Id": "S3-your-app-bucket",
				"DomainName": "your-app-bucket.s3.amazonaws.com",
				"S3OriginConfig": {
					"OriginAccessIdentity": ""
				}
			}
		]
	}
}
```

### Option 4: Self-Hosted (VPS/Dedicated Server)

#### Advantages

- **Complete Control**: Full server access
- **Cost Effective**: Fixed monthly costs
- **Custom Configuration**: Tailored setup
- **Data Sovereignty**: Keep data on-premises

#### Setup Steps

```bash
# 1. Server setup (Ubuntu 22.04 LTS recommended)
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 for process management
npm install -g pm2

# 4. Install Nginx
sudo apt install nginx

# 5. Configure firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

#### Nginx Configuration (`/etc/nginx/sites-available/your-app`)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location /_next/static/ {
        alias /var/www/your-app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Database Deployment

### Supabase Production Setup

#### 1. Create Production Project

```bash
# 1. Go to Supabase dashboard
# 2. Create new project
# 3. Choose production region (closest to your customers)
# 4. Set up production database
```

#### 2. Database Migration

```sql
-- 1. Run production schema
\i schema.sql

-- 2. Run additional schema changes
\i schema_additions.sql

-- 3. Verify all tables created
\dt

-- 4. Check RLS policies
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

#### 3. Production Data Setup

```sql
-- 1. Create production admin user
INSERT INTO public.users (email, password_hash, name, role, mobile)
VALUES (
  'admin@yourdomain.com',
  '$2b$10$...', -- bcrypt hash of secure password
  'Production Admin',
  'admin',
  '+447700900000'
);

-- 2. Set up initial categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Baked Goods', 'baked_goods', 'Freshly baked breads, pastries, and desserts'),
  ('Groceries', 'groceries', 'General grocery items and ingredients')
ON CONFLICT (slug) DO NOTHING;

-- 3. Add sample products (if needed)
INSERT INTO public.products (name, sku, price_pence, stock, visible, category_id)
SELECT
  'Sample Product',
  'SAMPLE-001',
  250,
  10,
  true,
  c.id
FROM public.categories c
WHERE c.slug = 'baked_goods'
LIMIT 1;
```

#### 4. Backup Configuration

```sql
-- 1. Enable automated backups in Supabase dashboard
-- 2. Set backup retention period (7-30 days recommended)
-- 3. Test backup restoration process
-- 4. Document recovery procedures
```

---

## Application Deployment

### Build Process

#### 1. Production Build

```bash
# 1. Install dependencies
npm ci --production

# 2. Build application
npm run build

# 3. Test production build locally
npm run start

# 4. Verify all functionality works
```

#### 2. Build Optimisation

```typescript
// next.config.mjs - Production optimisations
const nextConfig = {
	// ... existing config

	// Production optimisations
	swcMinify: true,
	compress: true,
	poweredByHeader: false,
	generateEtags: false,

	// Bundle analyser (optional)
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
			};
		}
		return config;
	},

	// Image optimisation
	images: {
		domains: ["yourdomain.com"],
		formats: ["image/webp", "image/avif"],
		minimumCacheTTL: 60,
	},
};
```

### Deployment Scripts

#### 1. Automated Deployment (`deploy.sh`)

```bash
#!/bin/bash

# Deployment script for TJ's Bake & Browse
set -e

echo "🚀 Starting deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# 3. Build application
echo "🔨 Building application..."
npm run build

# 4. Test build
echo "🧪 Testing build..."
npm run start &
PID=$!
sleep 10

# 5. Run health check
echo "🏥 Running health check..."
curl -f http://localhost:3000/api/health || exit 1

# 6. Stop test server
kill $PID

# 7. Deploy to production
echo "🚀 Deploying to production..."
# Add your deployment command here
# For Vercel: vercel --prod
# For Netlify: netlify deploy --prod --dir=out
# For AWS: aws s3 sync out/ s3://your-bucket --delete

echo "✅ Deployment completed successfully!"
```

#### 2. Environment-Specific Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Deploy with specific environment
NODE_ENV=production npm run deploy
```

### Package.json Scripts

```json
{
	"scripts": {
		"build": "next build",
		"start": "next start",
		"export": "next export",
		"deploy:staging": "NODE_ENV=staging vercel --target staging",
		"deploy:production": "NODE_ENV=production vercel --prod",
		"deploy:aws": "npm run build && npm run export && aws s3 sync out/ s3://your-bucket --delete",
		"health:check": "curl -f http://localhost:3000/api/health"
	}
}
```

---

## Domain & SSL Configuration

### Domain Setup

#### 1. Domain Registration

```bash
# 1. Register domain (if not already done)
# 2. Configure DNS settings
# 3. Set up subdomains (staging, api, etc.)
```

#### 2. DNS Configuration

```bash
# A Records
yourdomain.com     -> Your server IP or hosting provider
www.yourdomain.com -> CNAME to yourdomain.com
staging.yourdomain.com -> Staging server IP

# CNAME Records
api.yourdomain.com -> Your hosting provider's API endpoint

# MX Records (for email)
yourdomain.com     -> mail.yourdomain.com (priority 10)
```

### SSL Certificate Setup

#### 1. Let's Encrypt (Free SSL)

```bash
# 1. Install Certbot
sudo apt install certbot python3-certbot-nginx

# 2. Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 3. Test automatic renewal
sudo certbot renew --dry-run

# 4. Set up automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 2. Commercial SSL (if required)

```bash
# 1. Purchase SSL certificate
# 2. Download certificate files
# 3. Install on server
# 4. Configure Nginx/Apache
```

---

## Post-Deployment Verification

### Health Checks

#### 1. Application Health Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
	try {
		// Database connectivity check
		const { data, error } = await admin
			.from("products")
			.select("count")
			.limit(1);
		if (error) throw error;

		// System health checks
		const health = {
			status: "healthy",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			database: "connected",
			environment: process.env.NODE_ENV,
			version: process.env.npm_package_version || "unknown",
			memory: process.memoryUsage(),
		};

		return NextResponse.json(health);
	} catch (error) {
		return NextResponse.json(
			{
				status: "unhealthy",
				timestamp: new Date().toISOString(),
				error: error.message,
				uptime: process.uptime(),
			},
			{ status: 500 }
		);
	}
}
```

#### 2. Automated Health Monitoring

```bash
# 1. Set up monitoring service (UptimeRobot, Pingdom, etc.)
# 2. Configure health check endpoint
# 3. Set up alerting for failures
# 4. Monitor response times
```

### Functionality Testing

#### 1. Core Feature Tests

```bash
# 1. User registration
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!"}'

# 2. Product listing
curl https://yourdomain.com/api/products

# 3. Time slot availability
curl https://yourdomain.com/api/slots

# 4. Admin access (with auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://yourdomain.com/api/admin/products
```

#### 2. User Journey Testing

```bash
# 1. Complete customer journey
# 2. Admin functionality
# 3. Error handling
# 4. Mobile responsiveness
# 5. Cross-browser compatibility
```

### Performance Testing

#### 1. Load Testing

```bash
# Install Artillery for load testing
npm install -g artillery

# Run load test
artillery run load-test.yml
```

#### 2. Load Test Configuration (`load-test.yml`)

```yaml
config:
  target: "https://yourdomain.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Browse products"
    weight: 70
    flow:
      - get:
          url: "/api/products"
      - think: 2
      - get:
          url: "/baked-goods"

  - name: "User registration"
    weight: 30
    flow:
      - post:
          url: "/api/auth/register"
          json:
            name: "Test User"
            email: "{{ $randomString() }}@example.com"
            password: "TestPass123!"
```

---

## Monitoring & Maintenance

### Application Monitoring

#### 1. Error Tracking (Sentry)

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	environment: process.env.NODE_ENV,
	tracesSampleRate: 1.0,
	integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
});

export { Sentry };
```

#### 2. Performance Monitoring

```typescript
// lib/performance.ts
export const performanceMonitor = {
	startTimer: (name: string) => {
		const start = performance.now();
		return () => {
			const duration = performance.now() - start;
			console.log(`${name} took ${duration}ms`);
			// Send to monitoring service
		};
	},

	trackApiCall: async (name: string, fn: () => Promise<any>) => {
		const timer = performanceMonitor.startTimer(`API: ${name}`);
		try {
			const result = await fn();
			timer();
			return result;
		} catch (error) {
			timer();
			throw error;
		}
	},
};
```

### Database Monitoring

#### 1. Performance Queries

```sql
-- Slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

#### 2. Automated Maintenance

```sql
-- Create maintenance function
CREATE OR REPLACE FUNCTION maintenance_cleanup()
RETURNS void AS $$
BEGIN
  -- Clean up old audit logs (older than 1 year)
  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '1 year';

  -- Clean up old suggestions (older than 6 months)
  DELETE FROM public.suggestions
  WHERE created_at < NOW() - INTERVAL '6 months';

  -- Vacuum tables
  VACUUM ANALYZE;
END;
$$ LANGUAGE plpgsql;

-- Schedule maintenance (run weekly)
-- Add to cron or use pg_cron extension
```

### Log Management

#### 1. Structured Logging

```typescript
// lib/logger.ts
export const logger = {
	info: (message: string, meta?: any) => {
		const logEntry = {
			level: "info",
			message,
			meta,
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV,
			version: process.env.npm_package_version,
		};

		console.log(JSON.stringify(logEntry));

		// Send to log aggregation service (if configured)
		if (process.env.LOG_SERVICE_URL) {
			fetch(process.env.LOG_SERVICE_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(logEntry),
			}).catch(() => {}); // Don't fail if logging fails
		}
	},

	error: (message: string, error?: any, meta?: any) => {
		const logEntry = {
			level: "error",
			message,
			error: error?.message,
			stack: error?.stack,
			meta,
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV,
			version: process.env.npm_package_version,
		};

		console.error(JSON.stringify(logEntry));

		// Send to error tracking service
		if (process.env.SENTRY_DSN) {
			Sentry.captureException(error, { extra: meta });
		}
	},
};
```

#### 2. Log Rotation

```bash
# Set up logrotate for application logs
sudo nano /etc/logrotate.d/your-app

# Configuration
/var/log/your-app/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

---

## Rollback Procedures

### Quick Rollback

#### 1. Code Rollback

```bash
# 1. Revert to previous commit
git revert HEAD

# 2. Rebuild and redeploy
npm run build
npm run deploy:production

# 3. Verify rollback successful
npm run health:check
```

#### 2. Database Rollback

```sql
-- 1. Restore from backup
-- 2. Run rollback migrations
-- 3. Verify data integrity
-- 4. Update application if needed
```

### Emergency Rollback

#### 1. Emergency Script (`emergency-rollback.sh`)

```bash
#!/bin/bash

echo "🚨 EMERGENCY ROLLBACK INITIATED"

# 1. Stop application
echo "🛑 Stopping application..."
sudo systemctl stop your-app

# 2. Revert to last known good version
echo "⏪ Reverting to last known good version..."
git checkout HEAD~1

# 3. Restore database from backup
echo "🗄️ Restoring database..."
# Add your database restore command here

# 4. Restart application
echo "🔄 Restarting application..."
sudo systemctl start your-app

# 5. Verify functionality
echo "✅ Verifying rollback..."
sleep 10
curl -f http://localhost:3000/api/health || echo "❌ Health check failed"

echo "🚨 Emergency rollback completed"
```

#### 2. Rollback Checklist

- [ ] Stop application
- [ ] Revert code changes
- [ ] Restore database (if needed)
- [ ] Restart application
- [ ] Verify functionality
- [ ] Notify stakeholders
- [ ] Document incident
- [ ] Plan fix for next deployment

---

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Clear cache
rm -rf .next
rm -rf node_modules
npm ci

# Check environment variables
echo $NODE_ENV
cat .env.production.local
```

#### 2. Runtime Errors

```bash
# Check application logs
pm2 logs your-app
# or
sudo journalctl -u your-app -f

# Check system resources
htop
df -h
free -h

# Check network connectivity
curl -v https://yourdomain.com/api/health
```

#### 3. Database Issues

```sql
-- Check connection
SELECT version();

-- Check table structure
\d+ public.products

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### Performance Issues

#### 1. Slow Response Times

```bash
# Check database performance
EXPLAIN ANALYZE SELECT * FROM products WHERE visible = true;

# Check application performance
curl -w "@curl-format.txt" -o /dev/null -s "https://yourdomain.com/api/products"

# curl-format.txt content:
#      time_namelookup:  %{time_namelookup}\n
#         time_connect:  %{time_connect}\n
#      time_appconnect:  %{time_appconnect}\n
#     time_pretransfer:  %{time_pretransfer}\n
#        time_redirect:  %{time_redirect}\n
#   time_starttransfer:  %{time_starttransfer}\n
#                      ----------\n
#           time_total:  %{time_total}\n
```

#### 2. Memory Issues

```bash
# Check memory usage
ps aux --sort=-%mem | head -10

# Check for memory leaks
node --inspect app.js

# Monitor garbage collection
node --trace-gc app.js
```

### Security Issues

#### 1. Authentication Problems

```bash
# Check JWT configuration
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL

# Verify database policies
SELECT * FROM pg_policies WHERE tablename = 'users';

# Check user roles
SELECT email, role FROM users WHERE role = 'admin';
```

#### 2. CORS Issues

```typescript
// Check CORS configuration
// Verify allowed origins in Next.js config
// Check browser console for CORS errors
```

---

## Maintenance Schedule

### Daily Tasks

- [ ] Check application health
- [ ] Monitor error logs
- [ ] Verify backup completion
- [ ] Check system resources

### Weekly Tasks

- [ ] Review performance metrics
- [ ] Update dependencies (if needed)
- [ ] Clean up old logs
- [ ] Database maintenance

### Monthly Tasks

- [ ] Security audit
- [ ] Performance review
- [ ] Backup restoration test
- [ ] SSL certificate renewal check

### Quarterly Tasks

- [ ] Full system review
- [ ] Disaster recovery test
- [ ] Performance optimisation
- [ ] Security updates

---

## Support & Resources

### Team Contacts

- **Development Lead**: [Contact Information]
- **DevOps Engineer**: [Contact Information]
- **System Administrator**: [Contact Information]
- **Business Owner**: [Contact Information]

### External Support

- **Vercel Support**: [Support URL]
- **Supabase Support**: [Support URL]
- **Domain Provider**: [Support URL]
- **SSL Certificate Provider**: [Support URL]

### Documentation

- **Project Documentation**: `PROJECT_DOCUMENTATION.md`
- **API Documentation**: `API_DOCUMENTATION.md`
- **Technical Architecture**: `TECHNICAL_ARCHITECTURE.md`
- **Production Checklist**: `To_Do_For_Prod_GoLive.md`

---

## Conclusion

This deployment guide provides comprehensive coverage of all aspects needed to successfully deploy TJ's Bake & Browse to production. Follow the steps in order, complete all checklists, and ensure proper testing at each stage.

**Remember**: Production deployment is a critical process. Take your time, test thoroughly, and have rollback procedures ready. When in doubt, consult the team before proceeding.

---

_This deployment guide should be updated whenever deployment procedures change or new hosting options are added._
