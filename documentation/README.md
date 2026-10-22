# Thunder Mounts — Website Redesign Proposal & Interactive Prototype

This folder contains everything prepared for the Thunder Mounts website redesign proposal:

| Folder | Deliverable | Open |
|---|---|---|
| `presentation/` | **A. Client presentation** — 16-slide HTML deck (14 core slides + appendix + closing), screen-share ready and printable to PDF | `presentation/index.html` |
| `demo/` | **B. Interactive website demo** — storefront, product catalog, product pages, cart, checkout, dealer portal | `demo/index.html` |
| `demo/admin.html` | **C. Admin dashboard demo** — overview, products, orders, customers, dealers, pages, navigation, SEO, blog, gallery, media, reviews, settings | `demo/admin.html` |
| `documentation/` | **D. Client handover notes**, production scope and this README | `documentation/handover-notes.md`, `documentation/production-scope.md` |

Everything is plain **HTML5, CSS3 and vanilla JavaScript**. There is no build step, no framework, no backend and no database.

---

## 1. Running the demo locally

**Option A — just open the files**

1. Download / clone the `thunder-mounts-proposal` folder.
2. Double-click `demo/index.html` (storefront), `demo/admin.html` (admin) or `presentation/index.html` (deck).

Everything works from the `file://` protocol because all navigation uses relative paths and hash routes (`#/shop`, `#/product/tms-12`, `#orders`, …).

> The only external request is the Inter font from Google Fonts. Without internet access the prototype falls back to the system font and still works.

**Option B — serve it (recommended for the most accurate preview)**

```bash
cd thunder-mounts-proposal
# Python 3
python3 -m http.server 8080
# or Node
npx serve .
```

Then open `http://localhost:8080/demo/index.html`.

## 2. Resetting demo data

The prototype stores its sample state (cart, dealer session, admin edits) in the browser's `localStorage` under the keys `tm_proposal_state_v1`, `tm_demo_cart` and `tm_demo_dealer_session`.

- Storefront: click **Reset** in the floating “Demo” bar (bottom-left).
- Admin: click **Reset** in the sidebar footer.
- Or clear site data in the browser.

No data ever leaves the browser.

## 3. Publishing to GitHub Pages

1. Create a new GitHub repository (for example `thunder-mounts-proposal`).
2. Copy the contents of this folder to the repository root so you have `/presentation`, `/demo` and `/documentation` at the top level. (Optionally keep the included root `index.html` hub page.)
3. Commit and push:
   ```bash
   git init
   git add .
   git commit -m "Thunder Mounts proposal prototype"
   git branch -M main
   git remote add origin https://github.com/<your-account>/thunder-mounts-proposal.git
   git push -u origin main
   ```
4. In the repository go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save.
5. After a minute the site is live at `https://<your-account>.github.io/thunder-mounts-proposal/`.
   - Storefront: `/demo/index.html`
   - Admin: `/demo/admin.html`
   - Deck: `/presentation/index.html`

All internal links are relative, so the project works under a repository sub-path without changes. Add a `.nojekyll` file at the root if you ever add folders that start with an underscore.

## 4. Exporting the presentation to PDF

1. Open `presentation/index.html` in Chrome or Edge.
2. Click **Print / PDF** in the floating toolbar (or press `Ctrl/Cmd + P`).
3. Choose **Save as PDF**, set margins to **None**, enable **Background graphics**. The page size is preset to 16:9 (13.33 × 7.5 in) and each slide prints on its own page.

Keyboard shortcuts in the deck: `→` / `←` navigate, `F` toggles full-screen present mode, `Esc` exits, `Home` / `End` jump.

## 5. Project structure

```
thunder-mounts-proposal/
├── index.html                  # hub page linking all deliverables
├── presentation/
│   ├── index.html              # 16-slide deck
│   ├── styles.css
│   └── presentation.js
├── demo/
│   ├── index.html              # storefront + dealer portal (hash routed SPA)
│   ├── admin.html              # admin dashboard + CMS
│   ├── css/styles.css          # shared design system
│   ├── js/
│   │   ├── data.js             # seed data + localStorage state store
│   │   ├── ui.js               # toasts, modals, confirm dialogs, icons
│   │   ├── app.js              # storefront router, layout, home, pages, dealer portal
│   │   ├── products.js         # catalog, filters, quick view, product detail
│   │   ├── cart.js             # cart drawer/page, checkout, confirmation
│   │   ├── dashboard.js        # admin shell, overview, products, orders, customers, dealers
│   │   └── cms.js              # pages, navigation, SEO, blog, gallery, media, reviews, settings
│   └── assets/img/             # official logo + product/installation photos from thundermounts.com
└── documentation/
    ├── README.md
    ├── handover-notes.md       # what is functional vs. simulated, production checklist
    └── production-scope.md     # proposed production architecture and scope
```

## 6. Brand assets and accuracy

- The logo and all product / installation photographs were downloaded from the public thundermounts.com website for proposal purposes only. They remain the property of Thunder Mounts.
- Product names, models, SKUs and list prices reflect the public catalog at the time of preparation. Specifications labelled **“to verify”** are placeholders.
- All orders, customers, dealers, reviews, blog articles and analytics figures are **fictional sample data** and are clearly labelled as such in the interface.
- The accent colour (`#D11F2B`) was tuned to the red used in the official logo; the remaining palette follows the proposed direction (charcoal `#17191C`, graphite `#272B30`, light gray `#F3F4F6`, steel `#A7ADB4`).

## 7. Feature list

See `handover-notes.md` for the full list of demonstrated interactions, simulations and production-only features.
