# TJ's Bake & Browse - Project Documentation

## Project Overview

**TJ's Bake & Browse** is a Next.js-based click & collect e-commerce platform designed for a Jersey-based bakery business. The application allows customers to browse products, add items to their basket, and place orders for pickup at specified time slots.

## Technology Stack

### Frontend

- **Next.js 14.2.5** with App Router
- **React 18.2.0** with TypeScript
- **TailwindCSS 3.4.10** for styling
- **React Hot Toast** for notifications
- **NextAuth.js 4.24.7** for authentication

### Backend

- **Supabase** (PostgreSQL) for database and serverless functions
- **Next.js API Routes** for backend logic
- **bcrypt** for password hashing
- **Zod** for data validation

### Development & Testing

- **Vitest** for unit testing
- **ESLint** for code quality
- **TypeScript 5.4.5** for type safety

## Architecture Overview

### Database Schema

The application uses a PostgreSQL database with the following core tables:

- **users**: Customer accounts with role-based access (customer, staff, admin)
- **products**: Product catalogue with inventory management
- **categories**: Product categorization system
- **orders**: Customer orders with pickup scheduling
- **order_items**: Individual items within orders
- **audit_logs**: System activity tracking
- **suggestions**: Customer feedback system

### Key Features

#### Customer Features

1. **Product Browsing**: Browse baked goods and groceries by category
2. **Shopping Basket**: Add/remove items with localStorage persistence
3. **User Authentication**: Registration and login system
4. **Order Placement**: Schedule pickup times with capacity management
5. **Order Tracking**: View order status and history

#### Admin Features

1. **Inventory Management**: Add, edit, and manage product stock
2. **Order Management**: Process orders and update statuses
3. **Category Management**: Organize products into categories
4. **Data Import/Export**: CSV-based inventory management
5. **User Management**: Customer account oversight

#### Technical Features

1. **Role-Based Access Control**: Secure admin routes
2. **Time Slot Management**: Dynamic pickup scheduling
3. **Capacity Control**: Prevent overbooking
4. **Responsive Design**: Mobile-first approach
5. **Real-time Validation**: Form and business logic validation

## File Structure

```
tjs-bake-browse-full/
├── app/                          # Next.js App Router
│   ├── api/                     # API endpoints
│   │   ├── admin/              # Admin-only APIs
│   │   ├── auth/               # Authentication
│   │   ├── orders/             # Order management
│   │   ├── products/           # Product catalogue
│   │   └── slots/              # Time slot management
│   ├── admin/                   # Admin dashboard pages
│   ├── baked-goods/            # Product category pages
│   ├── groceries/              # Product category pages
│   ├── basket/                 # Shopping basket
│   ├── checkout/               # Order placement
│   └── layout.tsx              # Root layout
├── components/                  # Reusable UI components
├── lib/                        # Utility functions and database
├── Logs/                       # Project documentation and learning
└── public/                     # Static assets
```

## Core Business Logic

### Order Flow

1. Customer browses products and adds items to basket
2. Customer proceeds to checkout and selects pickup time
3. System validates slot availability and capacity
4. Order is created with status "unpaid"
5. Admin processes order and updates status
6. Customer collects order at scheduled time

### Time Slot Management

- **Operating Hours**: 09:00-17:30 (Monday-Saturday)
- **Slot Duration**: 30-minute intervals
- **Capacity**: Configurable per slot (default: 5 orders)
- **Cutoff**: Same-day orders must be placed before 12:00
- **Sunday Closure**: No orders accepted for Sundays

### Pricing Structure

- **Base Price**: Stored in pence (integer)
- **Bag Fee**: £0.70 (optional)
- **GST Rate**: 6% (Jersey tax rate)
- **Total Calculation**: Base + Bag + GST

## Security Features

### Authentication & Authorization

- **JWT-based sessions** with NextAuth.js
- **Role-based access control** (customer, staff, admin)
- **Admin route protection** via middleware
- **Password hashing** with bcrypt (salt rounds: 10)

### Data Protection

- **Row Level Security** (RLS) enabled on all tables
- **Input validation** with Zod schemas
- **SQL injection prevention** via Supabase client
- **CSRF protection** via Next.js built-in features

### API Security

- **Admin-only endpoints** protected by middleware
- **Authentication required** for order placement
- **Rate limiting** considerations (to be implemented)
- **Input sanitization** on all endpoints

## Performance Considerations

### Frontend Optimisation

- **Static generation** for product pages
- **Image optimisation** with Next.js Image component
- **Code splitting** via Next.js App Router
- **Responsive images** for different screen sizes

### Backend Optimisation

- **Database indexing** on frequently queried fields
- **Connection pooling** via Supabase
- **Caching strategies** for product data
- **Efficient queries** with proper joins

## Development Workflow

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code standards
- **Prettier** for code formatting
- **Git hooks** for pre-commit validation

### Testing Strategy

- **Unit tests** with Vitest
- **Component testing** with React Testing Library
- **API testing** with integration tests
- **E2E testing** (to be implemented)

### Deployment

- **Environment-based configuration**
- **Database migrations** via SQL scripts
- **CI/CD pipeline** (to be implemented)
- **Monitoring and logging** (to be implemented)

## Business Rules & Constraints

### Order Management

- Maximum 7 days advance booking
- No same-day orders after 12:00
- Sunday closure enforced
- Capacity limits per time slot

### Product Management

- Stock levels must be non-negative
- Products can be hidden from customers
- Allergen information required
- Category-based organisation

### User Management

- Email addresses must be unique
- Passwords minimum 8 characters
- Role-based permissions
- Marketing opt-in tracking

## Integration Points

### External Services

- **Supabase**: Database and authentication
- **Resend**: Email delivery (configured but not fully implemented)
- **NextAuth.js**: Session management

### Future Integrations

- **Payment processing** (Stripe/PayPal)
- **SMS notifications** (Twilio)
- **Analytics** (Google Analytics)
- **Customer support** (Zendesk/Intercom)

## Monitoring & Analytics

### Current Implementation

- **API request logging** via middleware
- **Error tracking** in API responses
- **User activity** via audit logs

### Planned Enhancements

- **Performance monitoring** (Vercel Analytics)
- **Error tracking** (Sentry)
- **User behaviour analytics**
- **Business metrics dashboard**

## Compliance & Legal

### Data Protection

- **GDPR compliance** considerations
- **Data retention policies**
- **User consent management**
- **Privacy policy implementation**

### Business Compliance

- **Tax calculation** (GST 6%)
- **Order record keeping**
- **Customer data protection**
- **Terms of service**

## Future Roadmap

### Phase 1 (Current)

- Core e-commerce functionality
- Admin management system
- Basic user authentication

### Phase 2 (Next 3 months)

- Payment processing integration
- Email notifications
- Advanced inventory management
- Customer loyalty programme

### Phase 3 (6-12 months)

- Mobile app development
- Advanced analytics
- Multi-location support
- API for third-party integrations

## Support & Maintenance

### Documentation

- **API documentation** (to be created)
- **User manuals** for admin staff
- **Technical specifications**
- **Deployment guides**

### Training Materials

- **Admin user training**
- **Customer support procedures**
- **Troubleshooting guides**
- **Best practices documentation**

---

_This document serves as the primary reference for the development team. Please keep it updated as the project evolves._
