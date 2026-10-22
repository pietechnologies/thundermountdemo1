# Production Scope — Thunder Mounts Website & Digital Commerce System

This document describes the proposed production build that the prototype represents. It is a proposal for discussion; integrations, hosting and dealer rules are confirmed with Thunder Mounts before development.

## 1. Goals

1. A premium, product-focused storefront that makes it immediately clear what Thunder Mounts sells and why it is different (Value · Symmetry · Safety).
2. A professional dealer channel: application, approval, dealer pricing, bulk ordering and order history.
3. A single back office for products, inventory, orders, customers, dealers and reviews.
4. A CMS so the owner controls pages, menus, blog, galleries, settings and SEO without editing code.
5. Secure, provider-hosted payments and server-side transactional email.
6. A maintainable platform Thunder Mounts owns, with backups, audit logs and room to grow.

## 2. Architecture (high level)

```
Browser (storefront · dealer portal · admin)
        │  HTTPS
        ▼
Web/application server
  • server-rendered storefront pages (SEO)
  • REST/JSON API for admin and portal interactions
  • authentication & role-based authorization
  • business rules: pricing tiers, inventory, order workflow
        │
        ├── Relational database (PostgreSQL or equivalent)
        │     products · variations · categories · inventory · pricing tiers
        │     customers · dealers · applications · orders · payments · shipments
        │     pages · sections · navigation · posts · media · reviews · settings · audit log
        ├── Object storage (images, PDFs, dealer documents)
        ├── Email service (SMTP / transactional API)
        └── Third-party integrations
              PayPal · Stripe · shipping/tracking API · GA4 · Search Console · Merchant Center (optional) · email marketing (optional)
```

**Why a full-stack application:** dealer approval and pricing, order management, secure authentication, persistent CMS content and server-side SEO cannot be delivered by a static site. The prototype is static only so it can be reviewed easily on GitHub Pages.

**Technology direction:** a modern server-rendered web framework with a typed codebase, an ORM over a relational database, and a component-based design system derived from this prototype. The exact stack and hosting provider are recommended after reviewing Thunder Mounts' current domain, hosting and Wix store setup so that migration, email deliverability and DNS are handled correctly.

## 3. Functional scope

### 3.1 Storefront
- Home, catalog, category pages, product pages, request-a-quote, cart, checkout, confirmation
- About, Dealer Program, Resources (downloads), Blog, Contact, FAQ, Shipping & Returns, Privacy, Terms, Warranty
- Search, filters (category, length, availability, brand), sort, quick view, related products, reviews
- Responsive layouts; accessibility (WCAG 2.1 AA target); optimised images; cookie notice

### 3.2 Checkout & payments
- Guest and account checkout; address book for logged-in customers/dealers
- Shipping methods from carrier rates or configured flat rates; tax calculation
- Discount codes (percentage, fixed, free shipping; limits and expiry)
- **PayPal** and **card payments via Stripe** using provider-hosted / tokenized components. Card data never touches the Thunder Mounts server; PCI scope is minimised (SAQ A).
- Webhooks for payment confirmation, failures and refunds; idempotent order creation
- Optional dealer invoice / purchase-order terms with approval and credit limits

### 3.3 Dealer portal
- Application form with business details and resale/tax document upload
- Admin review: pending → approved / rejected, with reasons and notifications
- Pricing tiers or price lists per dealer (configurable by Thunder Mounts), minimum order quantities, payment terms
- Dealer catalog, bulk order (grid + optional CSV), reorder, order history, tracking, invoices/documents
- Multiple users per dealer account (optional), saved addresses, account manager contact

### 3.4 Admin — commerce
- Dashboard with real KPIs, date ranges, exports
- Products: CRUD, categories, variations (e.g. length/finish), images, inventory with low-stock alerts, regular/sale/dealer pricing, specifications, shipping attributes, SEO, featured, draft/publish, import/export
- Orders: workflow (new → processing → fulfilled → shipped → completed; on-hold/cancelled), payment status, tracking, packing slips, internal notes, refunds/cancellations through the provider, customer notifications
- Customers: profiles, order history, type (homeowner/installer/dealer), status
- Dealers: queue, profile, documents, tier, account contact, notes, order history
- Reviews: moderation, featured, product association

### 3.5 CMS
- Pages with reusable sections (hero, content, feature grid, before/after, gallery, FAQ, CTA, product grid), draft/publish, preview, revisions
- Navigation manager for header, footer and dropdowns with ordering and visibility
- Blog/resources with categories, tags, authors, scheduling, featured and social images, related products
- Gallery with categories (before/after, projects, products) and media library with alt text, captions, usage tracking
- Global settings: logo, favicon, brand colours, typography, tagline, contact, social, header/footer, cookie notice, legal links, default SEO/OG, analytics IDs, notification rules, SMTP (credentials stored as server secrets)

### 3.6 SEO
- Clean indexable URLs (e.g. `/products/tmgt-12`, `/shop/track-mount-sets`, `/blog/...`)
- Server-rendered title, meta description, canonical, robots directives, Open Graph/Twitter tags per page/product/category/post
- Automatic XML sitemap, editable robots.txt, 301 redirect manager (seeded from a crawl of the current Wix URLs)
- Structured data: Organization, Product (with offers/availability/reviews), BreadcrumbList, Article, FAQPage; LocalBusiness if a public address is confirmed
- Breadcrumbs, image alt text enforcement, SEO completeness checks in the editor
- Google Search Console and GA4 integration; optional Merchant Center product feed

### 3.7 Notifications (configurable)
New order · payment status updates · dealer application · dealer approval/rejection · contact inquiry · low inventory · order fulfillment/shipping · password recovery. Each with admin and/or customer templates, sent through a configurable SMTP or transactional email service.

### 3.8 Security, operations & compliance
- HTTPS, secure cookies, hashed passwords, optional 2FA for admins, rate limiting, CSRF/XSS protections
- Role-based permissions (Owner, Sales, Editor; custom roles optional) and an audit log of admin actions
- Automated daily backups with tested restore; staging environment; dependency and security update policy
- Privacy: data minimisation, customer data export/deletion on request, cookie consent

## 4. Integrations requiring client approval
| Integration | Purpose | Status |
|---|---|---|
| PayPal | Checkout option, refunds | Proposed |
| Stripe | Card payments via hosted fields | Proposed |
| Shipping/tracking API (carrier accounts) | Rates, labels, tracking updates | Proposed |
| Google Analytics 4 | Traffic & e-commerce events | Proposed |
| Google Search Console | Indexing & search performance | Proposed |
| Google Merchant Center | Product feed | Optional |
| Email marketing platform | Newsletter sync | Optional |
| SMTP / transactional email provider | Notifications | Required (provider to confirm) |

## 5. Information needed from Thunder Mounts
- Verified product specifications: dimensions, materials, finish, load guidance, compatibility per model; correct SKUs (e.g. TMMRT-24 vs TMMRT-29 label)
- Installation instruction PDFs; additional product/project photography
- Dealer program rules: eligibility, tiers/discounts or price lists, minimums, payment terms, approval criteria
- Shipping origins, zones, rates, carriers; tax handling approach
- Policies: shipping & returns, privacy, terms, warranty, dealer terms
- Business details: address (if public), hours, email, social links
- Access: domain/DNS, current hosting, Wix exports (products, customers, orders), Google accounts

## 6. Hosting
A managed cloud environment with separate staging and production, HTTPS, monitoring and automated backups is proposed. The final recommendation is made after confirming compatibility with Thunder Mounts' current domain, email and commerce setup. **A static host such as GitHub Pages cannot run the production system** — it is used only for reviewing this prototype.

## 7. Delivery approach
1. Review & feedback on this prototype → 2. Discovery, content and data collection, URL audit → 3. Design sign-off → 4. Build & integrate (storefront, dealer portal, admin/CMS, payments, email, SEO) → 5. QA on devices, migration, redirects, training, launch and support.

Acceptance is measured against the production feature checklist in `handover-notes.md`.
