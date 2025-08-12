I need you to review my current to-do list for this project and sort it into an order where the quickest items get done first, as this will bring more value to the site quickly. I have two bugs in there currently that need addressing. Anything that has been ticked off already does not need to be included. Review all of our previous chats and understand what we have done and implemented. Once you have a clear list outlining what needs to be done, create a step by step plan, wih some rough total hours it will take to complete next to it. Please create a new file in the root of the project called to-dos.md which will be used to save all of this information in, and you can update each one everytime we complete or implement something. Everytime you think of an enhancement that may add value, please add it to the to-dos.md file under a new heading called 'Future Improvements by LLM'. Here is my list of to-dos:

IMPORTANT: ANY CHANGES TO PAGES SHOULD BE STAGED ON TEST PAGES THAT MIRROR OUR REAL PAGES. THIS IS SO WE CAN JUST DELETE THE FEATURES/PAGES AND REVERT EASIER WHILST KEEPING OUR REAL PAGES UNTOUCHED.

Current Issues To Resolve

- [ ] admin/management/inventory dashboard - update product name not working. - test update category / allergies.
- [ ] style to be consistent all across the site. It should have the same blue colour scheme as the notifications, but look more modern, pastel like, and not too genZ. I would like it to look professional and feel premium. Please create a few test pages that mirror our baked-goods, about and disclaimers etc in this new colour scheme. DO NOT AMEND OUR CURRENT SITE PAGES YET. THIS IS JUST TO SEE IF WE LIKE THIS OPTION.
- [ ] Implement a Suggestions form implemented on the website, emails the business email address. [tjsbakeandbrowse@gmail.com](mailto:tjsbakeandbrowse@gmail.com)
- [ ] Update app/legal/page.tsx with business address & phone number (if needed). - STEVE TO GET FROM TOM & JESS
- [ ] The product images scale exceeds outside the card, I would like this to have a margin around the product card that looks modern and professional.
- [ ] in the order management dashboard, have the option to filter orders out based on status (processing, ready, collected, rejected, cancelled)
- [ ] Tick box to be included when signing up that will allow us to start a mailing list for future products and special offers.
- [ ] option to display remaining unit quantity on the product card/ or in a visual dashboard in the management tab. - is this a good idea?
- [ ] admin/orders - Option to send email to customer once order is ready to collect. new feature to implement.
- [ ] Provide me with a document that explains how to do the following:
  - [ ] Change the maximum amount of customers that can use a time slot (currently set to 1)
  - [ ] Add products via csv file (what information is needed and in what order. How to upload photos too)
  - [ ] How to update the amount we charge for a bag, and GST based on our code. This would be good to amend via front end like management dashboard and have it upload the correct area (maybe a value in the supabase database)
  - [ ] A separate developer file with detailed step by step instructions on how to get every file in this project, along with supabase and all 3rd party apps ready for production. scan every file and ensure it is ready for my client for prod. outline EVERYTHING extremely clearly in detailed steps on what needs to be done and how to do it.
  - [ ] When user clicks “add to basket’, there is nothing to state the item was actually added to the basket. There needs to be a visual change, either an animation, button colour change for a few seconds or something along them lines.
  - [ ] Time slots should be in 30 min windows not 15 min windows.
  - [ ] The website must be optimised for mobile responsiveness as the majority of customers will be visiting on their mobiles/ipads.
  - [ ] **CSV import/export** (for products and orders).
  - [ ] **Email flows**:
    - account verification (optional),
    - order confirmed,
    - ready to collect,
    - cancelled.
  - [ ] **Legal pages**: generate a generic legal page for UK businesses that deal with cooking food in a commercial unit
  - [ ] **Cookie banner** if you later add analytics.
  - [ ] **QR code**: once your final domain is live, I’ll generate a QR PNG that points to the homepage
  - [ ] Confirm emails send (if you call `sendOrderConfirmation` later
  - [ ] Verify **robots.txt/sitemap** (we can add next)

---

# **Phase 3 – Bigger additions**

---

- [ ] CSV import/export: **products** (columns validation, storage image mapping guidance, admin UI) — **4–6h**
- [ ] CSV export: **orders** (date range filters, CSV streaming) — **2–3h**
- [ ] Email flows via Resend (order confirmed, ready, cancelled; server templates + admin “resend”) — **4–6h**
- [ ] Modern theme options (two clean themes behind a feature flag; Tailwind tokens; non-destructive) — **5–8h**
- [ ] Configurable capacity per time slot (DB setting + UI in admin + backend check) — **2–3h**
- [ ] Developer doc for production (Vercel, Supabase, envs, DNS, Resend, cron, RLS, backups) — **3–4h**
- [ ] Mobile responsiveness audit & fixes (nav, grids, forms, tables, admin pages) — **3–5h**

**Phase 3 subtotal: 23–35h**

---

## **Optional/Follow-ups (can slip between phases)**

- [ ] Cookie banner (once analytics added) — **1–1.5h**
- [ ] QR code PNG for final domain — **0.25h**
- [ ] Confirm email send hook on order creation (logs + retry UI) — **1–2h**
- [ ] robots.txt/sitemap verification (Next SEO pass) — **0.5–1h**

**Follow-up subtotal: 10h**

---

## **Dependencies & sequencing notes**

- **(11) Mailing list tick box** adds DB field (or a separate marketing_subscribers table). Confirm if you want a **double opt-in** flow (PECR-friendly).
- **(14–15) CSV**: set the column schema now to avoid churn later (I’ll provide a canonical template).
- **(16) Email flows**: we’ll centralise templates and call them from admin/status changes + order creation.
- **(20) Mobile audit** should run after any theme/spacing changes to avoid rework.
