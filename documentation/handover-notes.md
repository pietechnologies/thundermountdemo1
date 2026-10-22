# Client Handover Notes — Thunder Mounts Prototype

**Purpose:** explain exactly what the prototype does, what is simulated, and what must be built for production. This document should be read alongside the deck (`presentation/index.html`) and the demo (`demo/index.html`, `demo/admin.html`).

> **This is a demonstration, not a live commerce platform.** No payments are processed, no emails are sent, no data is stored on any server, and no changes affect the live thundermounts.com website.

---

## 1. What is functional in the prototype (front-end, in-browser)

All of the following work with real JavaScript logic and local browser state:

### Storefront (`demo/index.html`)
| # | Interaction | Where |
|---|---|---|
| 1 | Navigation between home, catalog, product detail, cart, checkout, dealer portal, blog, content pages and the admin dashboard | Header, footer, floating “Demo” bar |
| 2 | Product category, availability and max-length filtering; sorting by price and name; keyword search; “Load more” pagination | `#/shop` |
| 3 | Product quick view modal | Hover a product card → **Quick view** |
| 4 | Add to cart / remove from cart (grid, quick view, product page, cart drawer, cart page) | Everywhere |
| 5 | Cart quantity changes with live subtotal, discount, shipping, tax placeholder and total calculations | Cart drawer, `#/cart`, `#/checkout` |
| 6 | Coupon code with simulated response (`DEMO10`, `INSTALLER`; invalid codes return an error) | Cart page, checkout |
| 7 | Simulated checkout with required-field validation, shipping method, PayPal / card / dealer-invoice selection and an order confirmation screen; the order is written to local state and appears in the admin | `#/checkout` → `#/confirmation/…` |
| 8 | Demo dealer login (any email/password) with selectable **approved / pending / rejected** states, password-recovery screen | `#/dealer/login`, `#/dealer/forgot` |
| 9 | Dealer application form with upload placeholder and submission confirmation; the application appears in the admin dealer queue as **pending** | `#/dealer/apply` → `#/dealer/status` |
| 10 | Dealer dashboard: overview, dealer catalog with proposed tier pricing, bulk order form (live totals, add all to cart), order history with search and detail modal, quick reorder, saved addresses (add), invoices list, support, settings, sign-out | `#/dealer/account/…` |
| 11 | Header search modal, mobile navigation toggle, announcement bar, newsletter and contact forms (simulated), product review submission (goes to admin moderation) | Site-wide |
| 12 | CMS-driven storefront: header/footer menus, page titles/headings/content, home hero copy and CTAs, brand colour, announcement bar, phone display and footer text all render from the shared demo state edited in the admin | Site-wide |

### Admin dashboard (`demo/admin.html`)
| # | Interaction | Section |
|---|---|---|
| 13 | Sidebar navigation with pending-count badges, global search (Enter), notifications panel, account menu, date-range dialog, mobile sidebar | Shell |
| 14 | Overview KPIs, CSS sales-trend chart, order-status donut, recent orders, best sellers, activity feed — all computed from demo state | Overview |
| 15 | Products: search, category/status filters, **add / edit / delete** with confirmation, image selection from the media library, specification rows, SEO fields with live Google snippet preview and character counters, featured/draft toggles, storefront card preview | Products |
| 16 | Orders: status tabs, search, payment filter, order detail with workflow advance (new → processing → fulfilled → shipped → completed), tracking entry, internal notes, simulated refund/cancel dialog | Orders |
| 17 | Customers: list, search, type/status filters, profile with order history | Customers |
| 18 | Dealers: pending/approved/rejected tabs, quick approve/reject with confirmation, detail view with business info, document placeholder, pricing tier and account-contact assignment, notes, dealer order history | Dealers |
| 19 | Pages: list with SEO completeness meters, **include-in-navigation toggles**, create/edit/delete, hero fields, demo rich-text editor, section list, SEO fields with snippet preview, local preview modal, publish/draft/unpublish | Website pages |
| 20 | Navigation: header/footer tabs, add/edit/remove links, dropdown child links, reorder with arrows, enable/disable, live preview | Navigation |
| 21 | SEO: overview scores, global title/description/template, per-item metadata table with filters, Open Graph defaults with share-card preview, sitemap preview, robots.txt editor, redirect add/remove, structured-data toggles, checklists | SEO |
| 22 | Blog: list, status tabs, create/edit/delete, draft editing, featured image, tags, related products, SEO preview | Blog & resources |
| 23 | Gallery: category filtering, edit caption/alt/category/featured, delete, upload mockup | Gallery |
| 24 | Media library: searchable file table | Media library |
| 25 | Reviews: approve / reject / unpublish, featured toggle (reflected on the homepage), delete | Reviews |
| 26 | Settings: brand colour swatches / pickers, typography and tagline with **live brand preview** (saved colour applies to storefront), business info, header/footer, notification toggles and thresholds, SMTP mockup with masked password and simulated test email, integrations list, admin users table | Settings |

State persists in `localStorage` so a presenter can prepare a scenario in advance and reset at any time.

---

## 2. What is simulated (visual or placeholder only)

| Feature | How it is simulated | Production requirement |
|---|---|---|
| Payments (card, PayPal, invoice) | Fake read-only card fields; “Place order” waits 1.4 s then shows confirmation | PayPal / Stripe integration with hosted or tokenized components, webhooks, server-side order creation |
| Authentication (dealer login, admin) | Any credentials accepted; no session security | Server-side auth, hashed passwords, sessions/tokens, password reset emails, optional 2FA |
| Emails & notifications | Toast messages describing what would be sent | SMTP/transactional email service with templates and logging |
| File uploads (product images, dealer documents, media library, gallery) | Click shows a toast or inserts an existing sample image | Object storage, upload API, image processing, virus scanning for documents |
| Refunds / cancellations / payment capture | Dialog changes local status and adds a note | Provider API calls with permissions and audit trail |
| Shipping rates, tax | Fixed placeholder amounts (ground $24, expedited $58, 7.25 % tax) | Carrier/shipping API and tax calculation (provider or tax service) |
| Tracking numbers | Sample strings | Carrier integration / manual entry with validation |
| Sales figures, orders, customers, dealers, reviews, activity | Fictional seed data in `demo/js/data.js` | Real database records |
| SEO analysis, sitemap, robots.txt, redirects, structured data | Previews and local settings; nothing is generated or submitted | Server-side metadata rendering, sitemap generation, redirect middleware, JSON-LD output, Search Console |
| Analytics / Search Console / Merchant Center / email marketing | Placeholder fields and “Configure” buttons | Account connections and server-side configuration |
| PDF downloads (instructions, invoices, packing slips, price list) | Toast | Document storage and PDF generation |
| CSV import / export, report export | Toast | Server-side jobs |
| Date-range filter in admin | Dialog only; data does not change | Server queries |
| Rich-text editor | Basic `contenteditable` toolbar | Full block/rich-text editor with media embedding and revisions |
| Drag-and-drop navigation reordering | Up/down arrows | Drag-and-drop UI |
| Product variations, category CRUD, admin user invitations, template editor, cookie banner | Described in the UI with “proposed” labels | Backend models and screens |

Nothing in the prototype should be presented as a live, secure or persistent capability.

---

## 3. Items that require backend, database, authentication or payment-provider configuration

- **Backend application server** (API + server-rendered pages) and a **relational database** for products, categories, variations, pricing tiers, inventory, customers, dealers, orders, content, media metadata, reviews, settings and audit logs.
- **Secure authentication & roles** for admins (owner, sales, editor) and dealers; password recovery; session management; rate limiting.
- **Payment providers**: PayPal and/or Stripe merchant accounts, business verification, webhook endpoints, refund permissions. No raw card data is ever stored by the website.
- **Dealer approval & pricing engine**: configurable tiers/discounts/price lists, minimum orders, payment terms (e.g. Net-30), per-dealer overrides.
- **Order & fulfillment pipeline**: status transitions, inventory decrement, shipping provider integration, tracking sync, packing slips and invoices.
- **Transactional email** via SMTP/API with templates for all notification types listed in the Settings → Notifications screen.
- **Media & document storage** with secure access for dealer documents.
- **Persistent CMS**: pages, reusable sections, navigation, blog, gallery, reviews, global settings, with draft/publish and revision history.
- **SEO infrastructure**: indexable URLs, server-rendered metadata, canonical/OG tags, sitemap, robots.txt, 301 redirects from existing Wix URLs, structured data, Search Console and GA4.
- **Operations**: hosting with staging + production, HTTPS, backups, monitoring, dependency/security updates, audit logs, data export.

---

## 4. Proposed production feature checklist

Use this list during scoping and acceptance testing.

### Storefront
- [ ] Responsive homepage with announcement bar, hero, VSS strip, categories, featured products, before/after, benefits, installation & compatibility, reviews, resources, newsletter, footer
- [ ] Catalog with filters (category, length, availability, brand), search, sort, pagination/load more, quick view
- [ ] Product pages: gallery, pricing (regular/sale/dealer), availability, quantity, specs, box contents, installation PDF, compatibility, shipping & returns, FAQs, related products, reviews
- [ ] Request-a-quote flow for door products without fixed pricing
- [ ] Cart (drawer + page) with coupons; checkout with addresses, shipping methods, tax, PayPal + card, terms links, confirmation page + email
- [ ] Content pages, blog, resources/downloads, contact form with spam protection
- [ ] Accessibility (WCAG AA contrast, keyboard navigation), performance budget, image optimisation

### Dealer portal
- [ ] Application form with document upload; pending/approved/rejected states and notifications
- [ ] Secure login, password recovery, profile and saved addresses
- [ ] Dealer catalog with tier pricing; bulk order; reorder; order history and tracking; invoices and documents
- [ ] Optional invoice/PO payment terms and credit limits

### Admin / e-commerce
- [ ] Dashboard KPIs and reports (real data, date ranges, exports)
- [ ] Product CRUD with categories, variations, images, inventory, SEO, featured, draft/publish, import/export
- [ ] Order management workflow, notes, refunds/cancellations via provider, packing slips, tracking
- [ ] Customer management and dealer management with approvals, tiers, account contacts
- [ ] Review moderation

### CMS & SEO
- [ ] Page builder with reusable sections, navigation manager (header/footer/dropdowns), media library, gallery, blog editor with scheduling
- [ ] Global settings: brand, contact, social, header/footer, cookie notice, legal links, analytics, notifications, SMTP (secrets server-side)
- [ ] SEO suite: metadata per item, previews, canonical, index controls, OG images, sitemap, robots, redirects, structured data, breadcrumbs, completeness checks

### Platform
- [ ] Roles & permissions, audit log, 2FA option
- [ ] Hosting, HTTPS, staging, backups, monitoring, update policy
- [ ] Data migration from Wix (products, customers, orders where available) and URL redirect map
- [ ] Training session and admin documentation

---

## 5. Known limitations of the prototype

- Hash-based routing (`#/…`) is used so the demo runs from a file or GitHub Pages; production will use real, indexable URLs.
- Browser `localStorage` is per-device; the presenter’s edits are not visible on another device.
- `execCommand`-based rich-text editing is intentionally minimal.
- The product image set is limited to the photographs available on the current website; some mounts therefore share photos (as they do on the live site today).
- Specifications marked “to verify” and all policy text are placeholders awaiting Thunder Mounts’ input.
