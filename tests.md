Enhancement tests (quick wins)

1. Basket count badge updates

- Steps: Load any product list → click Add to basket twice → observe header Basket badge increments accordingly; remove items → badge decrements.
- Result: PASS (badge shows correct total count and updates instantly via cart:changed events).

2. Add-to-basket visual feedback

- Steps: Click Add to basket → button briefly animates (pulse) and toast confirms.
- Result: PASS.

3. Slot capacity and live availability

- Steps: Open Checkout → pick a date → open time list; full slots appear disabled with “(0 left)”. Focusing the select refreshes counts. Attempting to submit for a full slot blocks with toast; selecting available slot succeeds.
- Result: PASS (server also enforces capacity).

4. Must be registered & logged in to place an order

- Steps: Sign out; visit Checkout → prompted to sign in; cannot submit until signed in.
- Result: PASS.
