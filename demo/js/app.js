/* =====================================================================
   Storefront application: router, layout, homepage, pages, dealer portal
   ===================================================================== */
(function (global) {
  'use strict';
  var TM = global.TM, db = TM.db, ui = TM.ui, esc = ui.esc, I = ui.I, $ = ui.$, $$ = ui.$$;
  var views = TM.views = TM.views || {};
  var DEALER_KEY = 'tm_demo_dealer_session';

  // ---------------- dealer session (demo only) ----------------
  var dealer = {
    get: function () { try { return JSON.parse(localStorage.getItem(DEALER_KEY)); } catch (e) { return null; } },
    set: function (s) { localStorage.setItem(DEALER_KEY, JSON.stringify(s)); renderHeader(); },
    clear: function () { localStorage.removeItem(DEALER_KEY); renderHeader(); },
    discount: function () { var s = dealer.get(); return (s && s.status === 'approved') ? (s.discount || 0.10) : 0; }
  };

  // ---------------- routing ----------------
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('?'); var path = parts[0].replace(/\/$/, ''); var q = {};
    if (parts[1]) parts[1].split('&').forEach(function (kv) { var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    var segs = path ? path.split('/') : [];
    return { path: path, segs: segs, q: q };
  }
  function navigate(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  function render() {
    var r = parseHash(); var root = $('#app'); var name = r.segs[0] || 'home'; var view;
    if (name === 'dealer') { view = views['dealer-' + (r.segs[1] || 'login')] || views['dealer-login']; }
    else view = views[name] || views.notfound;
    var out = view(r) || {};
    // mount each view in a fresh wrapper so delegated listeners are discarded with the view
    root.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'view';
    wrap.innerHTML = typeof out === 'string' ? out : out.html;
    root.appendChild(wrap);
    window.scrollTo(0, 0);
    if (out.mount) out.mount(wrap);
    renderHeader(r);
    $('#mobile-nav').classList.remove('open');
    document.title = (out.title ? out.title + ' | ' : '') + db.get('settings').brand.name + ' — Proposal Prototype';
  }
  window.addEventListener('hashchange', render);

  // ---------------- layout ----------------
  function applyBrand() {
    var b = db.get('settings').brand;
    document.documentElement.style.setProperty('--red', b.primary || '#C82026');
    document.documentElement.style.setProperty('--ink', b.dark || '#181818');
    if (b.font && b.font !== 'Inter') document.documentElement.style.setProperty('--font', "'" + b.font + "',Inter,system-ui,sans-serif");
  }
  function renderHeader(r) {
    r = r || parseHash();
    var s = db.get('settings'); var nav = db.get('navigation').filter(function (n) { return n.location === 'header' && n.enabled; });
    var session = dealer.get(); var cartCount = TM.cart ? TM.cart.count() : 0;
    var ann = $('#announce');
    ann.innerHTML = s.header.showAnnouncement && s.header.announcement ? '<div class="container">' + esc(s.header.announcement) + ' <a href="#/dealer/apply">Learn more</a></div>' : '';
    ann.style.display = s.header.showAnnouncement && s.header.announcement ? '' : 'none';
    var current = '#/' + (r.segs[0] || '');
    var navHtml = nav.map(function (n) {
      var kids = (n.children || []).filter(function (c) { return c.enabled; });
      var active = n.href.indexOf(current) === 0 && current !== '#/' ? ' active' : '';
      if (kids.length) {
        return '<div class="has-drop"><a href="' + esc(n.href) + '" class="' + active + '" aria-haspopup="true">' + esc(n.label) + ' ▾</a><div class="drop">' + kids.map(function (c) { return '<a href="' + esc(c.href) + '">' + esc(c.label) + '</a>'; }).join('') + '</div></div>';
      }
      return '<a href="' + esc(n.href) + '" class="' + active + '">' + esc(n.label) + '</a>';
    }).join('');
    $('#site-header').innerHTML = '<div class="container inner">' +
      '<a class="brand" href="#/" aria-label="Thunder Mounts home"><img src="' + esc(s.brand.logo) + '" alt="Thunder Mounts logo"></a>' +
      '<nav class="nav-main" aria-label="Main navigation">' + navHtml + '</nav>' +
      '<div class="header-actions">' +
      (s.header.showPhone ? '<a class="btn btn-ghost btn-sm" href="tel:' + esc(s.contact.phone) + '">' + I.phone + ' <span>' + esc(s.contact.phone) + '</span></a>' : '') +
      '<button class="icon-btn" id="open-search" aria-label="Search products">' + I.search + '</button>' +
      '<button class="icon-btn" id="open-cart" aria-label="Open cart">' + I.cart + (cartCount ? '<span class="count-badge">' + cartCount + '</span>' : '') + '</button>' +
      (session ? '<a class="btn btn-dark btn-sm btn-dealer" href="#/dealer/account">' + I.user + ' ' + esc(session.company.split(' ')[0]) + '</a>' : '<a class="btn btn-outline btn-sm btn-dealer" href="#/dealer/login">Dealer Login</a>') +
      '<button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false">' + I.menu + '</button>' +
      '</div></div>';
    $('#mobile-nav').innerHTML = nav.map(function (n) {
      var kids = (n.children || []).filter(function (c) { return c.enabled; });
      return '<a href="' + esc(n.href) + '">' + esc(n.label) + '</a>' + kids.map(function (c) { return '<a href="' + esc(c.href) + '" style="padding-left:18px;font-weight:500">↳ ' + esc(c.label) + '</a>'; }).join('');
    }).join('') + '<div class="mobile-cta"><a class="btn btn-primary" href="#/shop">Shop Products</a><a class="btn btn-outline" href="' + (session ? '#/dealer/account' : '#/dealer/login') + '">' + (session ? 'Dealer Account' : 'Dealer Login') + '</a></div>';
    $('#menu-toggle').onclick = function () { var m = $('#mobile-nav'); m.classList.toggle('open'); this.setAttribute('aria-expanded', m.classList.contains('open')); };
    $('#open-cart').onclick = function () { TM.cart.open(); };
    $('#open-search').onclick = function () {
      ui.modal({ title: 'Search products', body: '<div class="search-box">' + I.search + '<input class="input" id="hdr-search" placeholder="Search by name, model or SKU…" autocomplete="off"></div><div id="hdr-results" class="mt-2"></div>',
        onMount: function (ov) {
          var inp = ov.querySelector('#hdr-search'); var res = ov.querySelector('#hdr-results');
          inp.addEventListener('input', function () {
            var q = inp.value.toLowerCase().trim(); if (!q) { res.innerHTML = ''; return; }
            var hits = db.get('products').filter(function (p) { return p.status === 'published' && (p.name + ' ' + p.sku + ' ' + p.model).toLowerCase().indexOf(q) > -1; }).slice(0, 6);
            res.innerHTML = hits.length ? hits.map(function (p) { return '<a href="#/product/' + p.id + '" class="cart-line" style="grid-template-columns:48px 1fr auto"><img src="' + p.images[0] + '" alt=""><div><div class="name">' + esc(p.name) + '</div><div class="meta">' + esc(p.sku) + '</div></div><strong>' + (p.price ? db.money(db.effectivePrice(p)) : 'Quote') + '</strong></a>'; }).join('') : '<div class="empty"><h4>No matches</h4><p>Try a model number such as TMS-12 or TMGT.</p></div>';
            $$('a', res).forEach(function (a) { a.addEventListener('click', ui.closeModal); });
          });
          inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { ui.closeModal(); navigate('#/shop?q=' + encodeURIComponent(inp.value)); } });
        } });
    };
    renderFooter();
  }
  function renderFooter() {
    var s = db.get('settings'); var fnav = db.get('navigation').filter(function (n) { return n.location === 'footer' && n.enabled; });
    var cats = db.get('categories');
    $('#site-footer').innerHTML = '<div class="container">' +
      (s.footer.showNewsletter ? '<div class="newsletter" style="margin-bottom:56px"><div><h2 style="color:#fff">Stay up to date on new products and installer resources.</h2><p class="muted" style="color:#C9CED4;margin:0">Receive product updates, installation guides and dealer program news. <span class="tiny">(Demo form — no email is sent.)</span></p></div><form id="newsletter-form"><label class="sr-only" for="nl-email">Email</label><input class="input" id="nl-email" type="email" placeholder="you@company.com" required><button class="btn btn-primary" type="submit">Subscribe</button></form></div>' : '') +
      '<div class="cols"><div class="footer-brand"><img src="' + esc(s.brand.logo) + '" alt="Thunder Mounts"><p>' + esc(s.brand.tagline) + '</p><p class="small">Call or text <a href="tel:' + esc(s.contact.phone) + '" style="display:inline;color:#fff;font-weight:700">' + esc(s.contact.phone) + '</a><br>' + esc(s.contact.hours) + '</p></div>' +
      '<div><h4>Shop</h4>' + cats.map(function (c) { return '<a href="#/shop?cat=' + c.id + '">' + esc(c.name) + '</a>'; }).join('') + '</div>' +
      '<div><h4>Company</h4><a href="#/about">About</a><a href="#/dealer">Dealer Program</a><a href="#/resources">Resources</a><a href="#/blog">Blog</a><a href="#/contact">Contact</a></div>' +
      '<div><h4>Support</h4>' + fnav.map(function (n) { return '<a href="' + esc(n.href) + '">' + esc(n.label) + '</a>'; }).join('') + '<a href="#/dealer/login">Dealer Login</a></div></div>' +
      '<div class="legal"><span>' + esc(s.footer.text) + '</span><span>' + fnav.slice(0, 3).map(function (n) { return '<a href="' + esc(n.href) + '">' + esc(n.label) + '</a>'; }).join('') + '</span></div></div>';
    var nf = $('#newsletter-form'); if (nf) nf.onsubmit = function (e) { e.preventDefault(); ui.toast('Thanks — in production this would subscribe <strong>' + esc($('#nl-email').value) + '</strong> via the email platform.', 'success', 'Subscribed (demo)'); nf.reset(); };
  }

  // ---------------- shared pieces ----------------
  function productCard(p) {
    var av = db.availabilityLabel(p); var disc = dealer.discount(); var price = db.effectivePrice(p);
    var priceHtml = p.availability === 'quote' ? '<span class="price">Request a quote</span>' :
      (disc ? '<span class="price price-dealer">' + db.money(price * (1 - disc)) + '</span><span class="price-old">' + db.money(price) + '</span>' :
        '<span class="price">' + db.money(price) + '</span>' + (p.salePrice && p.salePrice < p.price ? '<span class="price-old">' + db.money(p.price) + '</span>' : ''));
    var canBuy = p.availability !== 'quote' && p.availability !== 'out-of-stock' && p.availability !== 'pre-order';
    return '<article class="product-card">' +
      '<div class="media"><div class="ribbons">' + (p.salePrice && p.salePrice < p.price ? '<span class="badge badge-red">Sale</span>' : '') + (p.featured ? '<span class="badge badge-dark">Featured</span>' : '') + (p.availability === 'pre-order' ? '<span class="badge badge-blue">Coming soon</span>' : '') + '</div>' +
      '<a href="#/product/' + p.id + '"><img src="' + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
      '<button class="btn btn-light btn-sm quick" data-quick="' + p.id + '">' + I.eye + ' Quick view</button></div>' +
      '<div class="body"><span class="cat">' + esc((db.category(p.category) || {}).name || '') + '</span><div class="name"><a href="#/product/' + p.id + '">' + esc(p.name) + '</a></div><span class="sku">Model ' + esc(p.model) + ' · SKU ' + esc(p.sku) + '</span>' +
      '<div class="price-row">' + priceHtml + '</div><span class="stock ' + av[1] + '"><i class="dot"></i>' + av[0] + '</span></div>' +
      '<div class="foot">' + (canBuy ? '<button class="btn btn-primary btn-sm" data-add="' + p.id + '">Add to Cart</button>' : p.availability === 'quote' ? '<a class="btn btn-outline btn-sm" href="#/contact?subject=' + encodeURIComponent('Quote: ' + p.name) + '">Request Quote</a>' : '<button class="btn btn-outline btn-sm" data-notify="' + p.id + '">Notify me</button>') + '</div></article>';
  }
  function bindProductCards(root) {
    ui.on(root, 'click', '[data-add]', function (e, t) { TM.cart.add(t.getAttribute('data-add'), 1); });
    ui.on(root, 'click', '[data-quick]', function (e, t) { TM.products.quickView(t.getAttribute('data-quick')); });
    ui.on(root, 'click', '[data-notify]', function () { ui.toast('In production, a back-in-stock / launch notification would be scheduled.', 'info', 'Notify me (demo)'); });
  }
  TM.app = { navigate: navigate, render: render, productCard: productCard, bindProductCards: bindProductCards, dealer: dealer, renderHeader: renderHeader };

  // ---------------- HOME ----------------
  views.home = function () {
    var page = db.page('home') || {}; var prods = db.get('products').filter(function (p) { return p.featured && p.status === 'published'; }).slice(0, 4);
    var cats = db.get('categories'); var reviews = db.get('reviews').filter(function (r) { return r.status === 'approved' && r.featured; }).slice(0, 3);
    var posts = db.get('blog').filter(function (b) { return b.status === 'published'; }).slice(0, 3);
    var html = '<section class="hero"><div class="container inner"><div class="hero-copy"><span class="eyebrow" style="color:#F3A1A4">Built for today. Ready for tomorrow.</span><h1>' + esc(page.heading || '').replace(/installation standard/i, '<span>installation standard</span>') + '</h1><p class="lead">' + esc(page.subheading || '') + '</p>' +
      '<div class="cta-row"><a class="btn btn-primary btn-lg" href="' + esc(page.ctaLink || '#/shop') + '">' + esc(page.ctaText || 'Shop Products') + ' ' + I.arrow + '</a><a class="btn btn-outline-light btn-lg" href="' + esc(page.ctaLink2 || '#/dealer/apply') + '">' + esc(page.ctaText2 || 'Become a Dealer') + '</a></div>' +
      '<div class="hero-stats"><div><strong>4 lengths</strong><span>12 · 19 · 24 · 29 in.</span></div><div><strong>5 series</strong><span>TMS · TMX · TML · TMMRT · TMGT</span></div><div><strong>Made for installers</strong><span>Homeowners welcome</span></div></div></div>' +
      '<div class="hero-media"><img src="' + esc(page.hero || db.IMG + 'hero-dual-sets.jpg') + '" alt="Thunder Mounts dual sets installed in a white garage"><span class="photo-cap">Actual Thunder Mounts installation</span></div></div></section>' +
      '<section class="vss-strip"><div class="container inner"><div class="item"><span class="num">V</span><div><strong>Value</strong><span>An engineered mount that elevates the whole installation.</span></div></div><div class="item"><span class="num">S</span><div><strong>Symmetry</strong><span>Clean, balanced lines instead of improvised angle iron.</span></div></div><div class="item"><span class="num">S</span><div><strong>Safety</strong><span>Purpose-built strength for doors and openers.</span></div></div></div></section>' +
      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Shop by category</span><h2>Find the right mount for the job</h2></div><a class="btn btn-outline" href="#/shop">View all products</a></div><div class="cat-grid">' + cats.slice(0, 5).map(function (c) { return '<a class="cat-card" href="#/shop?cat=' + c.id + '"><img src="' + c.image + '" alt="" loading="lazy"><div class="cap"><strong>' + esc(c.name) + '</strong><span>' + db.get('products').filter(function (p) { return p.category === c.id && p.status === 'published'; }).length + ' products</span></div></a>'; }).join('') + '</div></div></section>' +
      '<section class="section section-gray"><div class="container"><div class="section-head"><div><span class="eyebrow">Featured products</span><h2>Installer favorites</h2></div><a class="btn btn-outline" href="#/shop">Shop all</a></div><div class="product-grid cols-4" id="home-featured">' + prods.map(productCard).join('') + '</div></div></section>' +
      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Before &amp; after</span><h2>The difference is easy to see.</h2></div><p class="muted">Actual installation photos from Thunder Mounts. Conventional angle iron on the left; Thunder Mounts on the right.</p></div><div class="compare"><figure><img src="' + db.IMG + 'before.jpg" alt="Before: garage opener hung with angle iron" loading="lazy"><figcaption>Before</figcaption></figure><figure class="after"><img src="' + db.IMG + 'after.jpg" alt="After: Thunder Mounts installed" loading="lazy"><figcaption>After</figcaption></figure></div></div></section>' +
      '<section class="section section-dark"><div class="container"><div class="section-head"><div><span class="eyebrow">Why Thunder Mounts</span><h2 style="color:#fff">Engineered for strength, clean aesthetics and reliable results</h2></div></div><div class="grid grid-3">' +
      [['bolt', 'Built to replace angle iron', 'For years, installations relied on angle iron — common but outdated. Thunder Mounts is a modern solution tailored for today\'s garages.'], ['layers', 'Symmetry on every job', 'Consistent, balanced mounting for openers and door track so every installation looks intentional.'], ['shield', 'Safety first', 'Purpose-designed mounts for the loads garage doors and openers place on the ceiling.'], ['box', 'Sets for one door', 'TMGT track sets include chrome ring, hardware and online instructions.'], ['truck', 'Ships from California', 'Retail and dealer orders with order tracking in the proposed system.'], ['users', 'Dealer program', 'Installers and distributors can apply for a dealer account with proposed dealer pricing and bulk ordering.']].map(function (b) { return '<div class="benefit" style="background:var(--graphite);border-color:rgba(255,255,255,.08)"><div class="ico">' + I[b[0]] + '</div><h3 style="color:#fff">' + b[1] + '</h3><p style="color:#C9CED4">' + b[2] + '</p></div>'; }).join('') + '</div></div></section>' +
      '<section class="section"><div class="container split"><img src="' + db.IMG + 'set.jpg" alt="Thunder Mounts set installed" loading="lazy"><div><span class="eyebrow">Installation &amp; compatibility</span><h2>Choose the length, mount at the flange or the track.</h2><p class="muted">Opener mounts (TMS, TMX, TML, TMMRT) attach at the opener motor flanges. Track mount sets (TMGT) support the overhead door track and ship as a set for one door. Mounts are not sold with openers or doors attached.</p><ul class="checklist"><li>Four maximum lengths: 12, 19, 24 and 29 inches</li><li>Online installation instructions included</li><li>Marantec-style mounts available (TMMRT series)</li><li>Compatibility details confirmed by Thunder Mounts for each model <span class="demo-tag">to verify</span></li></ul><div class="flex wrap"><a class="btn btn-dark" href="#/resources">Installation resources</a><a class="btn btn-outline" href="#/blog/choosing-mount-length">Sizing guide</a></div></div></div></section>' +
      '<section class="section section-gray"><div class="container"><div class="section-head"><div><span class="eyebrow">What customers say</span><h2>Reviews</h2></div><span class="demo-tag">Sample reviews — illustrative only</span></div><div class="grid grid-3">' + reviews.map(function (r) { var p = db.product(r.product); return '<div class="review-card">' + ui.stars(r.rating) + '<blockquote>“' + esc(r.text) + '”</blockquote><div class="who"><strong>' + esc(r.name) + '</strong>' + (p ? ' · ' + esc(p.model) : '') + '</div></div>'; }).join('') + '</div></div></section>' +
      '<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Resources</span><h2>Guides for installers and homeowners</h2></div><a class="btn btn-outline" href="#/blog">All articles</a></div><div class="grid grid-3">' + posts.map(function (b) { return '<a class="resource-card" href="#/blog/' + b.slug + '"><img src="' + b.image + '" alt="" loading="lazy"><div class="body"><span class="eyebrow" style="font-size:.65rem">' + esc(b.category) + '</span><h3>' + esc(b.title) + '</h3><p>' + esc(b.excerpt) + '</p><span class="bold small">Read article →</span></div></a>'; }).join('') + '</div></div></section>';
    return { html: html, title: 'Home', mount: bindProductCards };
  };

  // ---------------- generic CMS page ----------------
  function pageShell(p, extra) {
    return '<div class="page-head"><div class="container"><div class="crumbs"><a href="#/">Home</a><span>/</span>' + esc(p.title) + '</div><h1>' + esc(p.heading || p.title) + '</h1>' + (p.status === 'draft' ? '<span class="demo-tag">Draft — visible only in preview</span>' : '') + '</div></div>' +
      (p.hero ? '<div class="container"><img src="' + esc(p.hero) + '" alt="" style="border-radius:10px;aspect-ratio:21/8;object-fit:cover;width:100%"></div>' : '') +
      '<section class="section-tight"><div class="container" style="max-width:860px"><div class="stack" style="font-size:1.05rem">' + (p.content || '') + '</div>' + (extra || '') + '</div></section>';
  }
  views.page = function (r) { var p = db.page(r.segs[1]); if (!p) return views.notfound(); return { html: pageShell(p), title: p.title }; };
  views.about = function () { var p = db.page('about'); return { html: pageShell(p, '<div class="divider"></div><div class="grid grid-3"><div class="benefit"><div class="ico">' + I.bolt + '</div><h3>Value</h3><p>An engineered mount that elevates the whole installation.</p></div><div class="benefit"><div class="ico">' + I.layers + '</div><h3>Symmetry</h3><p>Balanced, intentional lines on every job.</p></div><div class="benefit"><div class="ico">' + I.shield + '</div><h3>Safety</h3><p>Purpose-built for garage doors and openers.</p></div></div><div class="mt-4 center"><a class="btn btn-primary btn-lg" href="#/shop">Shop Products</a></div>'), title: 'About' }; };
  views.faq = function () { return views.page({ segs: ['page', 'faq'] }); };
  views.resources = function () {
    var posts = db.get('blog').filter(function (b) { return b.status === 'published'; });
    return { html: pageShell(db.page('resources'), '<div class="grid grid-2 mt-3"><div class="card card-body"><h3>' + I.download + ' Mounting instructions</h3><p class="muted">Downloadable PDF instructions for each series. <span class="demo-tag">Placeholder — PDFs supplied by Thunder Mounts</span></p><div class="stack">' + ['TMS / TMX / TML opener mounts', 'TMMRT Marantec mounts', 'TMGT track mount sets'].map(function (t) { return '<button class="btn btn-outline btn-block" data-dl="' + esc(t) + '" style="justify-content:space-between">' + esc(t) + ' <span class="small muted">PDF</span></button>'; }).join('') + '</div></div><div class="card card-body"><h3>' + I.info + ' Sizing &amp; compatibility</h3><p class="muted">Pick a maximum length based on the distance from ceiling to mounting point.</p><table class="spec-list"><tr><td>12 in.</td><td>TMS-12 · TMMRT-12 · TMGT-12</td></tr><tr><td>19 in.</td><td>TMX-19 · TMMRT-19 · TMGT-19</td></tr><tr><td>24 in.</td><td>TML-24 · TMMRT-24 · TMGT-24</td></tr><tr><td>29 in.</td><td>TML-29 · TMGT-29</td></tr></table><p class="tiny muted mt-2">Length guidance to be confirmed by Thunder Mounts.</p></div></div><h2 class="mt-4">Articles</h2><div class="grid grid-3">' + posts.map(function (b) { return '<a class="resource-card" href="#/blog/' + b.slug + '"><img src="' + b.image + '" alt=""><div class="body"><h3>' + esc(b.title) + '</h3><p>' + esc(b.excerpt) + '</p></div></a>'; }).join('') + '</div>'), title: 'Resources', mount: function (root) { ui.on(root, 'click', '[data-dl]', function (e, t) { ui.toast('In production this downloads the PDF for <strong>' + esc(t.getAttribute('data-dl')) + '</strong>.', 'info', 'Download (placeholder)'); }); } };
  };
  views.contact = function (r) {
    var s = db.get('settings').contact;
    return { html: pageShell(db.page('contact'), '<div class="grid grid-2 mt-3" style="grid-template-columns:1.3fr 1fr"><form class="card card-body" id="contact-form"><div class="form-row"><div class="field"><label for="cf-name">Name</label><input class="input" id="cf-name" required></div><div class="field"><label for="cf-email">Email</label><input class="input" id="cf-email" type="email" required></div></div><div class="field"><label for="cf-subject">Subject</label><input class="input" id="cf-subject" value="' + esc(r.q.subject || '') + '"></div><div class="field"><label for="cf-msg">Message</label><textarea class="textarea" id="cf-msg" required></textarea></div><button class="btn btn-primary" type="submit">Send inquiry</button><p class="tiny muted mt-2">Demo form — nothing is transmitted. In production, inquiries are emailed via SMTP and logged in the admin.</p></form><div class="stack"><div class="card card-body"><h4>' + I.phone + ' Call or text</h4><p class="bold" style="font-size:1.3rem">' + esc(s.phone) + '</p><p class="muted small">' + esc(s.hours) + '</p></div><div class="card card-body"><h4>' + I.mail + ' Email</h4><p>' + esc(s.email) + '</p></div><div class="card card-body"><h4>' + I.briefcase + ' Dealers</h4><p class="small muted">Installers and distributors: apply for a dealer account.</p><a class="btn btn-dark btn-sm" href="#/dealer/apply">Dealer application</a></div></div></div>'), title: 'Contact', mount: function (root) { $('#contact-form', root).onsubmit = function (e) { e.preventDefault(); ui.toast('Your inquiry would be sent to Thunder Mounts and logged in the admin.', 'success', 'Inquiry received (demo)'); this.reset(); }; } };
  };
  views.blog = function (r) {
    var posts = db.get('blog').filter(function (b) { return b.status === 'published'; });
    if (r.segs[1]) {
      var b = db.get('blog').filter(function (x) { return x.slug === r.segs[1]; })[0]; if (!b) return views.notfound();
      var rel = (b.related || []).map(db.product).filter(Boolean);
      return { html: '<div class="page-head"><div class="container" style="max-width:860px"><div class="crumbs"><a href="#/">Home</a><span>/</span><a href="#/blog">Blog</a><span>/</span>' + esc(b.category) + '</div><h1>' + esc(b.title) + '</h1><p class="muted">' + esc(b.author) + ' · ' + ui.fmtDate(b.date) + (b.status === 'draft' ? ' · <span class="demo-tag">Draft preview</span>' : '') + '</p></div></div><div class="container" style="max-width:860px"><img src="' + b.image + '" alt="" style="border-radius:10px;aspect-ratio:21/9;object-fit:cover;width:100%"><div class="section-tight" style="font-size:1.05rem">' + b.content + '<div class="mt-3">' + (b.tags || []).map(function (t) { return '<span class="badge badge-gray" style="margin-right:6px">#' + esc(t) + '</span>'; }).join('') + '</div></div>' + (rel.length ? '<h3>Related products</h3><div class="product-grid">' + rel.map(productCard).join('') + '</div>' : '') + '<div class="mt-4"></div></div>', title: b.title, mount: bindProductCards };
    }
    return { html: '<div class="page-head"><div class="container"><div class="crumbs"><a href="#/">Home</a><span>/</span>Blog</div><h1>Blog &amp; resources</h1><p class="muted">Installation guidance, product comparisons and garage ideas. <span class="demo-tag">Sample articles — proposed content</span></p></div></div><section class="section-tight"><div class="container grid grid-3">' + posts.map(function (b) { return '<a class="resource-card" href="#/blog/' + b.slug + '"><img src="' + b.image + '" alt=""><div class="body"><span class="eyebrow" style="font-size:.65rem">' + esc(b.category) + '</span><h3>' + esc(b.title) + '</h3><p>' + esc(b.excerpt) + '</p><span class="small muted">' + ui.fmtDate(b.date) + '</span></div></a>'; }).join('') + '</div></section>', title: 'Blog' };
  };
  views.notfound = function () { return { html: '<div class="empty section"><h2>Page not found</h2><p>This prototype route does not exist.</p><a class="btn btn-dark" href="#/">Back to home</a></div>', title: 'Not found' }; };

  // ---------------- DEALER PORTAL ----------------
  function authLayout(side, form) {
    return '<div class="auth-wrap"><div class="auth-side"><span class="eyebrow" style="color:#F3A1A4">Thunder Mounts Dealer Portal</span>' + side + '</div><div class="auth-form"><div class="card"><div class="card-body">' + form + '</div></div></div></div>';
  }
  var dealerSide = '<h2>Built for installers, distributors and door companies.</h2><p style="color:#C9CED4">A dedicated account for ordering Thunder Mounts at proposed dealer pricing, reordering in bulk and tracking every shipment.</p><ul class="checklist"><li>Proposed dealer pricing tiers (configured by Thunder Mounts)</li><li>Bulk ordering and one-click reorders</li><li>Order history, tracking and invoices</li><li>Saved shipping addresses and account contacts</li></ul><div class="notice notice-warn" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff">' + I.warn + '<div><strong>Demonstration only.</strong> No real authentication, passwords or confidential pricing. Any email and password opens the demo account.</div></div>';

  views['dealer-login'] = function () {
    return { html: authLayout(dealerSide, '<h2>Dealer login</h2><p class="muted">Sign in to your dealer account.</p><form id="dl-form"><div class="field"><label for="dl-email">Business email</label><input class="input" id="dl-email" type="email" value="demo-dealer@example.com" autocomplete="off"></div><div class="field"><label for="dl-pass">Password</label><input class="input" id="dl-pass" type="password" value="demo-only" autocomplete="off"><span class="hint">Sample field — do not enter a real password.</span></div><div class="flex between mb-2"><label class="check"><input type="checkbox" checked> Remember me</label><a href="#/dealer/forgot" class="small bold">Forgot password?</a></div><button class="btn btn-primary btn-block btn-lg" type="submit" id="dl-submit">Sign in</button></form><div class="divider"></div><p class="small center">Not a dealer yet? <a href="#/dealer/apply" class="bold red">Apply for a dealer account →</a></p><div class="divider"></div><p class="tiny muted">Demo states:</p><div class="state-switch"><button data-state="approved" class="active">Approved dealer</button><button data-state="pending">Pending</button><button data-state="rejected">Rejected</button></div>'), title: 'Dealer login', mount: function (root) {
      var st = 'approved';
      $$('[data-state]', root).forEach(function (b) { b.onclick = function () { $$('[data-state]', root).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); st = b.getAttribute('data-state'); }; });
      $('#dl-form', root).onsubmit = function (e) {
        e.preventDefault(); var btn = $('#dl-submit', root); btn.disabled = true; btn.textContent = 'Signing in…';
        ui.simulate(function () {
          var map = { approved: { company: 'Coastline Door Co. (Demo)', contact: 'Renee Alvarez', status: 'approved', tier: 'Tier 2 — 10% (proposed)', discount: 0.10 }, pending: { company: 'Valley Garage Pros (Demo)', contact: 'Dana Kim', status: 'pending' }, rejected: { company: 'QuickFix Handyman LLC (Demo)', contact: 'Sam Patel', status: 'rejected' } };
          dealer.set(map[st]); ui.toast('Signed in as a <strong>demo</strong> dealer — no real authentication.', 'success', 'Welcome back');
          navigate(st === 'approved' ? '#/dealer/account' : '#/dealer/status');
        }, 700);
      };
    } };
  };
  views['dealer-forgot'] = function () {
    return { html: authLayout(dealerSide, '<h2>Reset your password</h2><p class="muted">Enter your business email and we will send a secure reset link. <span class="tiny">(Demo — no email is sent.)</span></p><form id="df-form"><div class="field"><label for="df-email">Business email</label><input class="input" id="df-email" type="email" required placeholder="you@company.com"></div><button class="btn btn-primary btn-block" type="submit">Send reset link</button></form><div id="df-done" class="hidden notice notice-success mt-2">' + I.check + '<div>If an account exists for that address, a reset link has been sent. Links expire after 30 minutes in the production system.</div></div><p class="small center mt-3"><a href="#/dealer/login" class="bold">← Back to login</a></p>'), title: 'Password recovery', mount: function (root) { $('#df-form', root).onsubmit = function (e) { e.preventDefault(); $('#df-done', root).classList.remove('hidden'); ui.toast('Password recovery email simulated.', 'info'); }; } };
  };
  views['dealer-apply'] = function () {
    var form = '<h2>Dealer application</h2><p class="muted">Tell us about your business. Applications are reviewed by Thunder Mounts before dealer pricing is enabled.</p><form id="da-form"><div class="form-row"><div class="field"><label for="da-company">Company name *</label><input class="input" id="da-company" required></div><div class="field"><label for="da-contact">Contact name *</label><input class="input" id="da-contact" required></div></div><div class="form-row"><div class="field"><label for="da-email">Business email *</label><input class="input" id="da-email" type="email" required></div><div class="field"><label for="da-phone">Phone *</label><input class="input" id="da-phone" type="tel" required></div></div><div class="field"><label for="da-address">Business address *</label><input class="input" id="da-address" required placeholder="Street, City, State, ZIP"></div><div class="form-row"><div class="field"><label for="da-web">Business website</label><input class="input" id="da-web" placeholder="https://"></div><div class="field"><label for="da-type">Business type</label><select class="select" id="da-type"><option>Garage door installer</option><option>Distributor / wholesaler</option><option>General contractor</option><option>Home builder</option><option>Other</option></select></div></div><div class="field"><label>Tax / resale documentation</label><div class="upload-box" id="da-upload" tabindex="0">' + I.upload + '<div class="bold mt-1">Upload resale certificate or seller\'s permit</div><div class="tiny">PDF, JPG or PNG · Placeholder — files are not uploaded in this demo</div></div><span class="hint" id="da-file"></span></div><label class="check mb-2"><input type="checkbox" required> I confirm the information provided is accurate and agree to the <a href="#/page/terms" class="bold">dealer terms</a>.</label><button class="btn btn-primary btn-block btn-lg" type="submit" id="da-submit">Submit application</button></form>';
    return { html: authLayout(dealerSide, form), title: 'Dealer application', mount: function (root) {
      var up = $('#da-upload', root); up.onclick = function () { $('#da-file', root).textContent = '✓ resale-certificate-sample.pdf attached (simulated)'; };
      up.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') up.click(); };
      $('#da-form', root).onsubmit = function (e) {
        e.preventDefault(); var btn = $('#da-submit', root); btn.disabled = true; btn.textContent = 'Submitting…';
        var company = $('#da-company', root).value;
        ui.simulate(function () {
          var st = db.load(); st.dealers.unshift({ id: db.uid('d'), company: company, contact: $('#da-contact', root).value, email: $('#da-email', root).value, phone: $('#da-phone', root).value, address: $('#da-address', root).value, website: $('#da-web', root).value, status: 'pending', tier: '', manager: '', applied: new Date().toISOString().slice(0, 10), docs: 'resale-certificate-sample.pdf', notes: ['Submitted via website (demo).'], orders: [] }); db.save();
          dealer.set({ company: company, contact: $('#da-contact', root).value, status: 'pending' });
          ui.toast('Application submitted — it now appears in the admin dealer queue.', 'success', 'Thank you');
          navigate('#/dealer/status');
        }, 900);
      };
    } };
  };
  views['dealer-status'] = function () {
    var s = dealer.get(); if (!s) return views['dealer-login']();
    var tl = { pending: 1, approved: 2, rejected: 2 }[s.status];
    var body = s.status === 'pending' ? '<div class="notice notice-warn">' + I.warn + '<div><strong>Pending approval.</strong> Thunder Mounts reviews each application and resale documentation. You will receive an email once a decision is made. Meanwhile you can shop at retail pricing.</div></div>' :
      s.status === 'approved' ? '<div class="notice notice-success">' + I.check + '<div><strong>Approved.</strong> Your dealer pricing tier is active: ' + esc(s.tier || '') + '.</div></div><a class="btn btn-primary mt-3" href="#/dealer/account">Go to dealer dashboard</a>' :
        '<div class="notice notice-danger">' + I.warn + '<div><strong>Application not approved.</strong> Based on the information provided, this account does not meet the dealer program criteria at this time. You are welcome to purchase at retail pricing or contact us with additional documentation.</div></div><a class="btn btn-outline mt-3" href="#/contact">Contact Thunder Mounts</a>';
    return { html: '<section class="section"><div class="container" style="max-width:720px"><span class="demo-tag">Demo account — ' + esc(s.company) + '</span><h1 class="mt-2">Application status</h1><div class="card card-body"><div class="status-timeline"><div class="done">Submitted</div><div class="' + (tl >= 1 ? (tl === 1 ? 'current' : 'done') : '') + '">Under review</div><div class="' + (tl >= 2 ? 'done' : '') + '">' + (s.status === 'rejected' ? 'Decision' : 'Approved') + '</div><div class="' + (s.status === 'approved' ? 'done' : '') + '">Dealer pricing active</div></div>' + body + '<div class="divider"></div><button class="btn btn-ghost btn-sm" id="dl-out">Sign out of demo account</button></div></div></section>', title: 'Application status', mount: function (root) { $('#dl-out', root).onclick = function () { dealer.clear(); navigate('#/dealer/login'); }; } };
  };
  views['dealer-account'] = function (r) {
    var s = dealer.get(); if (!s) return views['dealer-login'](); if (s.status !== 'approved') return views['dealer-status']();
    var section = r.segs[2] || 'overview'; var orders = db.get('orders').filter(function (o) { return o.dealer; }); var prods = db.get('products').filter(function (p) { return p.status === 'published' && p.category !== 'doors' && p.price; });
    var navItems = [['overview', 'Overview', 'home'], ['catalog', 'Dealer catalog', 'grid'], ['bulk', 'Bulk order', 'box'], ['orders', 'Order history', 'file'], ['addresses', 'Saved addresses', 'truck'], ['invoices', 'Invoices & documents', 'download'], ['support', 'Support', 'msg'], ['settings', 'Account settings', 'settings']];
    var disc = dealer.discount();
    function orderRow(o) { return '<tr class="clickable" data-order="' + o.id + '"><td class="bold">' + o.id + '</td><td>' + ui.fmtDate(o.date) + '</td><td>' + o.items.reduce(function (a, i) { return a + i.qty; }, 0) + ' items</td><td class="num">' + db.money(o.total) + '</td><td>' + ui.badge(o.payment) + '</td><td>' + ui.badge(o.fulfillment) + '</td><td class="actions"><button class="btn btn-xs btn-outline" data-reorder="' + o.id + '">Reorder</button></td></tr>'; }
    var content = {
      overview: '<div class="page-title"><div><h1>Welcome back, ' + esc(s.contact) + '</h1><p>' + esc(s.company) + ' · ' + ui.badge('approved') + ' · ' + esc(s.tier) + '</p></div><a class="btn btn-primary" href="#/dealer/account/bulk">' + I.plus + ' New bulk order</a></div><div class="stat-grid"><div class="stat"><div class="lbl">Open orders</div><div class="val">2</div><div class="trend">1 processing · 1 awaiting PO</div></div><div class="stat"><div class="lbl">Orders (12 mo)</div><div class="val">' + orders.length + '</div><div class="trend">Sample data</div></div><div class="stat"><div class="lbl">Dealer discount</div><div class="val">' + Math.round(disc * 100) + '%</div><div class="trend">Proposed tier — set by Thunder Mounts</div></div><div class="stat"><div class="lbl">Account contact</div><div class="val" style="font-size:1.05rem">Thunder Mounts Sales</div><div class="trend">805-338-6680</div></div></div><div class="card mt-3"><div class="card-head"><h3>Recent orders</h3><a href="#/dealer/account/orders" class="small bold">View all</a></div><div class="table-wrap" style="border:0"><table class="table"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead><tbody>' + orders.slice(0, 3).map(orderRow).join('') + '</tbody></table></div></div><div class="grid grid-2 mt-3"><div class="card card-body"><h4>Quick reorder</h4><p class="small muted">Your most-ordered products.</p>' + ['tms-12', 'tmx-19', 'tmgt-12'].map(function (id) { var p = db.product(id); return '<div class="cart-line" style="grid-template-columns:48px 1fr auto"><img src="' + p.images[0] + '" alt=""><div><div class="name">' + esc(p.name) + '</div><div class="meta">' + esc(p.sku) + ' · <span class="price-dealer">' + db.money(p.price * (1 - disc)) + '</span> dealer</div></div><button class="btn btn-xs btn-dark" data-add="' + p.id + '">Add</button></div>'; }).join('') + '</div><div class="card card-body"><h4>Account notices</h4><div class="notice notice-info">' + I.info + '<div>Dealer prices shown are <strong>proposed examples</strong>. Actual tiers, minimums and payment terms (e.g. Net-30) will be configured by Thunder Mounts in the production system.</div></div></div></div>',
      catalog: '<div class="page-title"><div><h1>Dealer catalog</h1><p>Your tier pricing is applied automatically. Retail price shown for reference.</p></div></div><div class="product-grid">' + prods.map(productCard).join('') + '</div>',
      bulk: '<div class="page-title"><div><h1>Bulk order</h1><p>Enter quantities for multiple products and add them to your cart in one step.</p></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th>SKU</th><th class="num">Retail</th><th class="num">Dealer price</th><th style="width:140px">Qty</th><th class="num">Line total</th></tr></thead><tbody>' + prods.map(function (p) { return '<tr><td><div class="cell-product"><img class="thumb" src="' + p.images[0] + '" alt=""><div><strong>' + esc(p.name) + '</strong><span>' + esc((db.category(p.category) || {}).name) + '</span></div></div></td><td>' + esc(p.sku) + '</td><td class="num price-old">' + db.money(p.price) + '</td><td class="num price-dealer">' + db.money(p.price * (1 - disc)) + '</td><td><div class="qty qty-sm"><button type="button" data-bq="-1" aria-label="Decrease">−</button><input type="number" min="0" value="0" data-bulk="' + p.id + '" data-price="' + (p.price * (1 - disc)) + '" aria-label="Quantity"><button type="button" data-bq="1" aria-label="Increase">+</button></div></td><td class="num bulk-line">$0.00</td></tr>'; }).join('') + '</tbody></table></div><div class="card card-body mt-3 flex between wrap"><div><span class="muted small">Bulk subtotal</span><div class="price" style="font-size:1.4rem" id="bulk-total">$0.00</div></div><div class="flex"><button class="btn btn-outline" id="bulk-csv">' + I.upload + ' Import CSV (placeholder)</button><button class="btn btn-primary" id="bulk-add">Add all to cart</button></div></div>',
      orders: '<div class="page-title"><div><h1>Order history</h1><p>All orders placed on this dealer account.</p></div><div class="search-box">' + I.search + '<input class="input" placeholder="Search orders" id="do-search"></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead><tbody id="do-body">' + orders.map(orderRow).join('') + '</tbody></table></div>',
      addresses: '<div class="page-title"><div><h1>Saved addresses</h1></div><button class="btn btn-dark" id="add-addr">' + I.plus + ' Add address</button></div><div class="grid grid-3" id="addr-grid">' + [['Main warehouse', '2200 Harbor Blvd, Ventura, CA 93001', true], ['Job site — Ojai', '410 E Ojai Ave, Ojai, CA 93023', false], ['Billing', 'PO Box 1181, Ventura, CA 93002', false]].map(function (a) { return '<div class="card card-body"><div class="flex between"><h4>' + a[0] + '</h4>' + (a[2] ? '<span class="badge badge-green">Default</span>' : '') + '</div><p class="muted small">' + a[1] + '</p><div class="flex"><button class="btn btn-xs btn-outline" data-demo="Edit address">Edit</button><button class="btn btn-xs btn-ghost" data-demo="Remove address">Remove</button></div></div>'; }).join('') + '</div>',
      invoices: '<div class="page-title"><div><h1>Invoices &amp; documents</h1><p>Download invoices, packing slips and dealer resources. <span class="demo-tag">Placeholders</span></p></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Document</th><th>Related order</th><th>Date</th><th>Type</th><th></th></tr></thead><tbody>' + orders.map(function (o) { return '<tr><td class="bold">Invoice INV-' + o.id.replace('TM-', '') + '</td><td>' + o.id + '</td><td>' + ui.fmtDate(o.date) + '</td><td>PDF</td><td class="actions"><button class="btn btn-xs btn-outline" data-demo="Download invoice">' + I.download + ' Download</button></td></tr>'; }).join('') + '<tr><td class="bold">Dealer price list (proposed)</td><td>—</td><td>' + ui.fmtDate('2026-02-01') + '</td><td>PDF</td><td class="actions"><button class="btn btn-xs btn-outline" data-demo="Download price list">' + I.download + ' Download</button></td></tr><tr><td class="bold">W-9 / resale certificate on file</td><td>—</td><td>' + ui.fmtDate('2025-07-15') + '</td><td>PDF</td><td class="actions"><button class="btn btn-xs btn-outline" data-demo="View document">View</button></td></tr></tbody></table></div>',
      support: '<div class="page-title"><div><h1>Support</h1></div></div><div class="grid grid-2"><div class="card card-body"><h4>Your account contact</h4><p class="bold mb-0">Thunder Mounts Sales</p><p class="muted small">Call or text 805-338-6680</p><a class="btn btn-outline btn-sm" href="#/contact">Send a message</a></div><div class="card card-body"><h4>Resources</h4><a href="#/resources" class="bold small" style="display:block;padding:4px 0">Installation instructions →</a><a href="#/blog/choosing-mount-length" class="bold small" style="display:block;padding:4px 0">Sizing guide →</a><a href="#/page/shipping-returns" class="bold small" style="display:block;padding:4px 0">Shipping &amp; returns →</a></div></div>',
      settings: '<div class="page-title"><div><h1>Account settings</h1></div></div><div class="grid grid-2"><form class="card card-body" id="ds-form"><h4>Business profile</h4><div class="field"><label>Company name</label><input class="input" value="' + esc(s.company) + '"></div><div class="form-row"><div class="field"><label>Contact name</label><input class="input" value="' + esc(s.contact) + '"></div><div class="field"><label>Phone</label><input class="input" value="(805) 555-0190"></div></div><div class="field"><label>Business email</label><input class="input" value="demo-dealer@example.com"></div><button class="btn btn-dark" type="submit">Save changes</button></form><div class="stack"><div class="card card-body"><h4>Dealer status</h4><dl class="kv"><dt>Status</dt><dd>' + ui.badge('approved') + '</dd><dt>Pricing tier</dt><dd>' + esc(s.tier) + '</dd><dt>Payment terms</dt><dd>Card / PayPal · Net-30 (proposed)</dd><dt>Account manager</dt><dd>Thunder Mounts Sales</dd></dl><p class="tiny muted mt-2">Tier and terms are managed by Thunder Mounts administrators.</p></div><div class="card card-body"><h4>Security</h4><button class="btn btn-outline btn-sm" data-demo="Change password">Change password</button> <button class="btn btn-ghost btn-sm" id="dl-out">Sign out</button></div></div></div>'
    }[section] || '<div class="empty"><h4>Section not found</h4></div>';
    return { html: '<div class="dealer-shell"><aside class="dealer-side"><div class="who"><span class="demo-tag">Demo dealer</span><strong class="mt-1" style="display:block">' + esc(s.company) + '</strong><span>' + esc(s.tier) + '</span></div><nav class="side-nav">' + navItems.map(function (n) { return '<a href="#/dealer/account/' + n[0] + '" class="' + (section === n[0] ? 'active' : '') + '">' + I[n[2]] + ' ' + n[1] + '</a>'; }).join('') + '</nav></aside><main class="dealer-main">' + content + '</main></div>', title: 'Dealer dashboard', mount: function (root) {
      bindProductCards(root);
      ui.on(root, 'click', '[data-demo]', function (e, t) { ui.toast('<strong>' + esc(t.getAttribute('data-demo')) + '</strong> is a production feature shown for demonstration.', 'info'); });
      ui.on(root, 'click', '[data-reorder]', function (e, t) { e.stopPropagation(); var o = db.get('orders').filter(function (x) { return x.id === t.getAttribute('data-reorder'); })[0]; o.items.forEach(function (i) { TM.cart.add(i.id, i.qty, true); }); TM.cart.open(); ui.toast('Items from ' + o.id + ' added to your cart.', 'success', 'Reorder'); });
      ui.on(root, 'click', 'tr[data-order]', function (e, t) { var o = db.get('orders').filter(function (x) { return x.id === t.getAttribute('data-order'); })[0]; TM.cart.orderModal(o); });
      var so = $('#do-search', root); if (so) so.oninput = function () { var q = so.value.toLowerCase(); $$('#do-body tr', root).forEach(function (tr) { tr.style.display = tr.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none'; }); };
      var out = $('#dl-out', root); if (out) out.onclick = function () { dealer.clear(); ui.toast('Signed out of demo dealer account.', 'info'); navigate('#/'); };
      var ds = $('#ds-form', root); if (ds) ds.onsubmit = function (e) { e.preventDefault(); ui.toast('Profile changes saved locally (demo).', 'success'); };
      var aa = $('#add-addr', root); if (aa) aa.onclick = function () { ui.modal({ title: 'Add address', body: '<div class="field"><label>Label</label><input class="input" id="na-l" placeholder="e.g. Job site"></div><div class="field"><label>Address</label><input class="input" id="na-a" placeholder="Street, City, State, ZIP"></div>', footer: '<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-dark" id="na-save">Save</button>', onMount: function (ov) { ov.querySelector('#na-save').onclick = function () { var l = ov.querySelector('#na-l').value || 'New address', a = ov.querySelector('#na-a').value || '—'; $('#addr-grid', root).insertAdjacentHTML('beforeend', '<div class="card card-body"><h4>' + esc(l) + '</h4><p class="muted small">' + esc(a) + '</p><div class="flex"><button class="btn btn-xs btn-outline" data-demo="Edit address">Edit</button></div></div>'); ui.closeModal(); ui.toast('Address added (demo).', 'success'); }; } }); };
      // bulk order
      function recalc() { var tot = 0; $$('[data-bulk]', root).forEach(function (inp) { var q = parseInt(inp.value, 10) || 0; var lt = q * parseFloat(inp.getAttribute('data-price')); tot += lt; inp.closest('tr').querySelector('.bulk-line').textContent = db.money(lt); }); var bt = $('#bulk-total', root); if (bt) bt.textContent = db.money(tot); }
      ui.on(root, 'input', '[data-bulk]', recalc);
      ui.on(root, 'click', '[data-bq]', function (e, t) { var inp = t.parentNode.querySelector('input'); inp.value = Math.max(0, (parseInt(inp.value, 10) || 0) + parseInt(t.getAttribute('data-bq'), 10)); recalc(); });
      var ba = $('#bulk-add', root); if (ba) ba.onclick = function () { var n = 0; $$('[data-bulk]', root).forEach(function (inp) { var q = parseInt(inp.value, 10) || 0; if (q > 0) { TM.cart.add(inp.getAttribute('data-bulk'), q, true); n += q; } }); if (!n) { ui.toast('Enter at least one quantity.', 'error'); return; } TM.cart.open(); ui.toast(n + ' units added to cart.', 'success', 'Bulk order'); };
      var bc = $('#bulk-csv', root); if (bc) bc.onclick = function () { ui.toast('CSV import of SKU/quantity lists is a proposed production feature.', 'info'); };
    } };
  };
  views.dealer = views['dealer-login'];

  // ---------------- boot ----------------
  document.addEventListener('DOMContentLoaded', function () {
    applyBrand();
    TM.cart.init();
    render();
    var reset = $('#proto-reset'); if (reset) reset.onclick = function () { ui.confirm({ title: 'Reset demo data?', message: 'This clears all locally saved prototype changes (cart, dealer session, admin edits) and restores the sample data.', ok: 'Reset demo' }, function () { db.reset(); localStorage.removeItem(DEALER_KEY); localStorage.removeItem('tm_demo_cart'); location.reload(); }); };
  });
})(window);
