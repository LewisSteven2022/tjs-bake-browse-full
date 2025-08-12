# API Documentation - TJ's Bake & Browse

## Overview

This document provides comprehensive documentation for all API endpoints in the TJ's Bake & Browse application. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## Authentication

Most endpoints require authentication via NextAuth.js JWT tokens. Admin endpoints require admin privileges.

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Common Response Format

### Success Response

```json
{
  "data": {...},
  "message": "Success message"
}
```

### Error Response

```json
{
	"error": "Error description",
	"status": "error",
	"code": "ERROR_CODE"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST `/api/auth/register`

Create a new user account.

**Request Body:**

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"mobile": "+447700900000",
	"password": "SecurePassword123!"
}
```

**Response (201):**

```json
{
	"ok": true,
	"id": "uuid-string"
}
```

**Validation Rules:**

- `name`: Required, non-empty string
- `email`: Required, valid email format, unique
- `mobile`: Optional, phone number format
- `password`: Required, minimum 8 characters

**Error Responses:**

- `400` - Missing required fields
- `409` - Email already exists
- `500` - Registration failed

---

### POST `/api/auth/[...nextauth]`

NextAuth.js authentication endpoint (handles login, logout, session management).

**Features:**

- JWT-based authentication
- Session management
- Role-based access control

---

## Product Catalogue Endpoints

### GET `/api/products`

Retrieve all visible products with stock.

**Query Parameters:**

- `category` (optional): Filter by category slug
- `limit` (optional): Maximum number of products (default: 50)

**Response (200):**

```json
{
	"products": [
		{
			"id": "uuid",
			"name": "Sourdough Bread",
			"sku": "SOUR-001",
			"short_description": "Traditional sourdough",
			"price_pence": 350,
			"pack_label": "500g",
			"allergens": ["gluten", "wheat"],
			"image_url": "https://...",
			"stock": 10,
			"category": {
				"id": "uuid",
				"name": "Baked Goods",
				"slug": "baked_goods"
			}
		}
	]
}
```

**Notes:**

- Only returns visible products with stock > 0
- Includes category information
- Allergens returned as array

---

### GET `/api/availability`

Check product availability and stock levels.

**Query Parameters:**

- `product_id`: Product UUID to check

**Response (200):**

```json
{
	"available": true,
	"stock": 15,
	"product_id": "uuid"
}
```

---

## Shopping Basket Endpoints

### GET `/api/cart`

Retrieve current user's shopping basket.

**Authentication:** Required

**Response (200):**

```json
{
	"items": [
		{
			"product_id": "uuid",
			"name": "Sourdough Bread",
			"price_pence": 350,
			"qty": 2
		}
	],
	"total_items": 2,
	"subtotal_pence": 700
}
```

**Error Responses:**

- `401` - User not authenticated

---

### POST `/api/cart`

Add item to shopping basket.

**Authentication:** Required

**Request Body:**

```json
{
	"product_id": "uuid",
	"name": "Sourdough Bread",
	"price_pence": 350,
	"qty": 1
}
```

**Response (200):**

```json
{
  "message": "Item added to basket",
  "basket": [...]
}
```

---

## Order Management Endpoints

### POST `/api/orders`

Place a new order.

**Authentication:** Required

**Request Body:**

```json
{
	"items": [
		{
			"product_id": "uuid",
			"name": "Sourdough Bread",
			"price_pence": 350,
			"qty": 2
		}
	],
	"bag_opt_in": true,
	"pickup_date": "2024-01-15",
	"pickup_time": "14:30",
	"customer_name": "John Doe",
	"customer_email": "john@example.com",
	"customer_phone": "+447700900000"
}
```

**Response (201):**

```json
{
	"order_id": "uuid",
	"order_number": 1001,
	"subtotal_pence": 700,
	"bag_pence": 70,
	"gst_pence": 46,
	"total_pence": 816,
	"status": "unpaid"
}
```

**Business Rules:**

- Pickup date must be within 7 days
- No Sunday pickups
- Same-day orders must be placed before 12:00
- Time slot capacity limits apply
- GST calculated at 6%

**Error Responses:**

- `400` - Invalid order data
- `409` - Time slot full
- `500` - Order creation failed

---

## Time Slot Management

### GET `/api/slots`

Get available pickup time slots.

**Response (200):**

```json
{
	"slots": [
		{
			"date": "2024-01-15",
			"times": [
				{
					"time": "09:00",
					"disabled": false,
					"remaining": 3
				},
				{
					"time": "09:30",
					"disabled": true,
					"remaining": 0
				}
			]
		}
	]
}
```

**Features:**

- 7-day rolling window
- 30-minute intervals (09:00-17:30)
- Sunday slots disabled
- Capacity checking per slot
- Same-day cutoff at 12:00

---

## Admin Endpoints

_All admin endpoints require admin authentication and are protected by middleware._

### Products Management

#### GET `/api/admin/products`

Retrieve all products for admin management.

**Response (200):**

```json
{
	"products": [
		{
			"id": "uuid",
			"name": "Sourdough Bread",
			"sku": "SOUR-001",
			"price_pence": 350,
			"stock": 10,
			"visible": true,
			"category": "baked_goods"
		}
	]
}
```

#### POST `/api/admin/products`

Create a new product.

**Request Body:**

```json
{
	"name": "New Product",
	"sku": "NEW-001",
	"price_pence": 250,
	"stock": 20,
	"visible": true,
	"category": "baked_goods"
}
```

**Response (201):**

```json
{
	"product": {
		"id": "uuid",
		"name": "New Product",
		"sku": "NEW-001",
		"price_pence": 250,
		"stock": 20,
		"visible": true,
		"created_at": "2024-01-15T10:00:00Z"
	}
}
```

---

### Inventory Management

#### GET `/api/admin/inventory`

Get inventory overview with category information.

**Response (200):**

```json
{
	"products": [
		{
			"id": "uuid",
			"name": "Sourdough Bread",
			"price_pence": 350,
			"stock": 10,
			"visible": true,
			"image_url": "https://...",
			"allergens": ["gluten"],
			"category": {
				"id": "uuid",
				"name": "Baked Goods",
				"slug": "baked_goods"
			}
		}
	]
}
```

#### PATCH `/api/admin/inventory`

Update product inventory details.

**Request Body:**

```json
{
	"id": "uuid",
	"stock": 15,
	"visible": true,
	"price_pence": 375,
	"allergens": ["gluten", "wheat"],
	"category_id": "uuid"
}
```

**Response (200):**

```json
{
  "product": {
    "id": "uuid",
    "name": "Sourdough Bread",
    "stock": 15,
    "visible": true,
    "price_pence": 375,
    "allergens": ["gluten", "wheat"],
    "category": {...}
  }
}
```

**Updateable Fields:**

- `stock`: Non-negative integer
- `visible`: Boolean
- `price_pence`: Non-negative integer
- `allergens`: Array of strings
- `category_id`: UUID reference

---

### Inventory Import/Export

#### GET `/api/admin/inventory/export`

Export inventory to CSV format.

**Response (200):**

```
Content-Type: text/csv
Content-Disposition: attachment; filename="products_export.csv"

id,name,category,price_pence,pack_label,allergens,ingredients,short_description,image_url,stock,visible
uuid,Sourdough Bread,baked_goods,350,500g,"gluten|wheat",Flour water salt,Traditional sourdough,https://...,10,true
```

**CSV Fields:**

- `id`: Product UUID
- `name`: Product name
- `category`: Category slug
- `price_pence`: Price in pence
- `pack_label`: Package size/weight
- `allergens`: Pipe-separated allergen list
- `ingredients`: Ingredients text
- `short_description`: Product description
- `image_url`: Product image URL
- `stock`: Current stock level
- `visible`: Visibility status

#### POST `/api/admin/inventory/import`

Import inventory from CSV file.

**Request:** `multipart/form-data`

- `file`: CSV file (max 2MB)

**Response (200):**

```json
{
	"ok": true,
	"inserted": 5,
	"updated": 2,
	"errors": []
}
```

**Import Rules:**

- CSV must include required headers
- Existing products updated by ID
- New products created if no ID
- Category slugs must exist
- Validation errors reported per row

---

### Category Management

#### GET `/api/admin/categories`

Retrieve all product categories.

**Response (200):**

```json
{
	"categories": [
		{
			"id": "uuid",
			"name": "Baked Goods",
			"slug": "baked_goods",
			"description": "Freshly baked breads and pastries",
			"created_at": "2024-01-15T10:00:00Z"
		}
	]
}
```

#### POST `/api/admin/categories`

Create a new category.

**Request Body:**

```json
{
	"name": "New Category",
	"slug": "new_category",
	"description": "Category description"
}
```

**Response (201):**

```json
{
	"category": {
		"id": "uuid",
		"name": "New Category",
		"slug": "new_category",
		"description": "Category description",
		"created_at": "2024-01-15T10:00:00Z"
	}
}
```

**Validation Rules:**

- `name`: Required, unique
- `slug`: Required, unique, lowercase with underscores only
- `description`: Optional

#### PATCH `/api/admin/categories`

Update an existing category.

**Request Body:**

```json
{
	"id": "uuid",
	"name": "Updated Category Name",
	"slug": "updated_slug",
	"description": "Updated description"
}
```

**Response (200):**

```json
{
	"category": {
		"id": "uuid",
		"name": "Updated Category Name",
		"slug": "updated_slug",
		"description": "Updated description",
		"updated_at": "2024-01-15T10:00:00Z"
	}
}
```

---

### Order Management

#### GET `/api/admin/orders`

Retrieve orders with filtering options.

**Query Parameters:**

- `status`: Filter by order status
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)
- `limit`: Maximum results (default: 500, max: 2000)

**Response (200):**

```json
{
	"orders": [
		{
			"id": "uuid",
			"order_number": 1001,
			"status": "unpaid",
			"pickup_date": "2024-01-15",
			"pickup_time": "14:30",
			"subtotal_pence": 700,
			"total_pence": 816,
			"bag": true,
			"customer_name": "John Doe",
			"customer_email": "john@example.com",
			"customer_phone": "+447700900000",
			"created_at": "2024-01-15T10:00:00Z"
		}
	]
}
```

**Available Statuses:**

- `unpaid`: Order placed, payment pending
- `preparing`: Payment received, order being prepared
- `ready`: Order ready for pickup
- `collected`: Order collected by customer
- `cancelled`: Order cancelled
- `rejected`: Order rejected

#### PATCH `/api/admin/orders`

Update order status.

**Request Body:**

```json
{
	"id": "uuid",
	"status": "ready"
}
```

**Response (200):**

```json
{
	"order": {
		"id": "uuid",
		"status": "ready",
		"updated_at": "2024-01-15T10:00:00Z"
	}
}
```

---

## Error Handling

### Common Error Codes

- `MISSING_FIELDS`: Required fields not provided
- `INVALID_DATA`: Data validation failed
- `UNAUTHORISED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate email)
- `VALIDATION_ERROR`: Input validation failed
- `INTERNAL_ERROR`: Server error

### Error Response Format

```json
{
	"error": "Human-readable error message",
	"code": "ERROR_CODE",
	"details": {
		"field": "Specific field error",
		"value": "Invalid value provided"
	}
}
```

---

## Rate Limiting

_To be implemented in production_

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 attempts per 15 minutes per IP
- **Order placement**: 10 orders per hour per user

---

## Webhooks

_Future enhancement for payment processing_

### Payment Webhook

```
POST /api/webhooks/stripe
Content-Type: application/json

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_...",
      "amount": 816,
      "metadata": {
        "order_id": "uuid"
      }
    }
  }
}
```

---

## Testing

### Test Environment

- **Base URL**: `http://localhost:3000/api`
- **Test Database**: Separate Supabase project
- **Test Users**: Pre-created test accounts

### Test Data

```json
{
	"test_user": {
		"email": "test@example.com",
		"password": "TestPass123!",
		"role": "customer"
	},
	"test_admin": {
		"email": "admin@example.com",
		"password": "AdminPass123!",
		"role": "admin"
	}
}
```

---

## Versioning

Current API version: **v1**

Future versions will be available at `/api/v2/` endpoints.

---

## Support

For API support and questions:

- **Technical Issues**: Development team
- **Business Rules**: Product owner
- **Documentation**: This document + inline code comments

---

_This API documentation should be kept updated as endpoints are modified or new ones are added._
