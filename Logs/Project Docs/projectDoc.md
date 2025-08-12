Project Context
We’ve been building TJ’s Bake & Browse, a Next.js App Router app with Supabase backend, MSSQL for some logic, and localStorage for basket persistence.

Stack: Next.js (App Router), Supabase (Postgres), TailwindCSS, localStorage basket, serverless API routes.

Major Tasks & Issues We Worked On

1. Admin Route Access Control
   Problem: /api/admin/orders was accessible even if not logged in as admin.
   Cause: Admin protection was only implemented in one API endpoint, not middleware.
   Fix:

Moved admin check to a middleware so all /api/admin/\* routes are protected globally.

Removed WithAdmin wrapper (no longer needed after middleware).

2. Order Creation API (/api/orders)
   Initial Problems & Fixes:

Error: "total_pence must be a non-negative number"

Cause: Calculations were failing because we weren’t summing prices correctly.

Fix: Calculate subtotal_pence and total_pence on the server, never trusting client values.

Error: "Could not find the 'bag' column of 'orders'"

Cause: Supabase table schema didn’t match API insert payload.

Fix: Added bag column in Supabase (boolean NOT NULL).

Error: "invalid input syntax for type bigint: 'TJ-...'"

Cause: order_number column was bigint identity but we were trying to insert a custom string order number.

Fix: Removed all TJ- generation from backend — now DB auto-increments order_number.

Error: "null value in column 'items' violates not-null constraint"

Cause: We were trying to store items in the orders table, but items live in order_items.

Fix: Changed flow: insert into orders first, then insert items into order_items.

Error: "new row violates check constraint 'orders_status_check'"

Cause: status was not set or was invalid.

Fix: Default status to "unpaid" on insert.

Decision:

We eventually dropped and recreated the orders table with:

id (uuid PK)

order_number (bigint identity)

status default 'unpaid'

pickup_date, pickup_time

subtotal_pence, total_pence

bag boolean

customer_name, customer_email, customer_phone

created_at default now()

3. Supabase Schema Alignment
   Created matching order_items table:

id bigint identity

order_id uuid

product_id uuid

name text

price_pence int

quantity int

created_at timestamp

Enforced foreign key to orders.id.

4. Checkout Page
   Problems:

Initially, checkout/page.tsx threw compile errors due to using £ as a variable name (invalid in JS).

Fix: Renamed to formatGBP().

Logic:

Loads basket from localStorage (basket_v1 fallback to basket).

Allows bag opt-in.

Sends POST request to /api/orders.

5. Basket Page
   Problems:

Items were being added in product pages, but basket showed empty.

Causes:

Different key names (id vs product_id, qty vs quantity).

LocalStorage version mismatch — older pages wrote to basket, new code read from basket_v1.

Fix:

Normalised all item shapes in basket/page.tsx.

Added fallback read: if basket_v1 is empty, read from basket.

Added cross-tab sync using storage and visibilitychange events.

6. Miscellaneous Fixes
   Added proper status default in DB.

Switched all currency display to formatGBP().

Added resync button in basket page.

Added server-side calculation for totals (security).

Bag cost (+70p) only applied if bag_opt_in is true.

Current Working State
✅ /api/orders inserts orders + order items correctly.
✅ Orders table has correct schema with defaults.
✅ Admin routes now protected via middleware.
✅ Basket loads from localStorage, syncs across tabs, and persists changes.
✅ Checkout posts correct payload to backend.
⚠ Remaining issue: Basket sometimes appears empty if product pages save under mismatched shape/keys — needs full alignment of addToBasket() function across the app.

Next Logical Steps
Unify addToBasket() logic in all product list/detail components so they store:

ts
Copy
Edit
{ product_id: string, name: string, price_pence: number, qty: number }
Test basket → checkout → order creation with multiple products and bag opt-in.

Implement order confirmation page with order summary + number.

Admin orders page should list new orders and allow status updates.
