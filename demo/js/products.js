/* Catalog listing (filters, sort, search, load more), quick view, product detail page */
(function (global) {
  'use strict';
  var TM = global.TM, db = TM.db, ui = TM.ui, esc = ui.esc, I = ui.I, $ = ui.$, $$ = ui.$$;
  var views = TM.views = TM.views || {};
  var PAGE = 9;

  function visibleProducts() { return db.get('products').filter(function (p) { return p.status === 'published'; }); }

  views.shop = function (r) {
    var state = { cat: r.q.cat || 'all', q: r.q.q || '', sort: 'featured', avail: 'all', shown: PAGE };
    var cats = db.get('categories');
    var html = '<div class="page-head"><div class="container"><div class="crumbs"><a href="#/">Home</a><span>/</span>Shop</div><h1 id="shop-title">All Products</h1><p class="muted">Product names, models and list prices reflect the current thundermounts.com catalog. Specifications marked “to verify” await client confirmation.</p></div></div>' +
      '<section class="section-tight"><div class="container shop-layout"><aside class="filters" aria-label="Filters"><div><h4>Category</h4><div class="flist" id="f-cat"><button data-cat="all" class="active">All products <span>' + visibleProducts().length + '</span></button>' + cats.map(function (c) { return '<button data-cat="' + c.id + '">' + esc(c.name) + ' <span>' + visibleProducts().filter(function (p) { return p.category === c.id; }).length + '</span></button>'; }).join('') + '</div></div>' +
      '<div><h4>Availability</h4><div class="flist" id="f-avail"><button data-avail="all" class="active">Any</button><button data-avail="in-stock">In stock</button><button data-avail="low-stock">Low stock</button><button data-avail="pre-order">Coming soon</button><button data-avail="quote">Quote only</button></div></div>' +
      '<div><h4>Max length</h4><div class="flex wrap" id="f-len"><button class="chip" data-len="12">12 in.</button><button class="chip" data-len="19">19 in.</button><button class="chip" data-len="24">24 in.</button><button class="chip" data-len="29">29 in.</button></div></div>' +
      '<div class="panel mt-3 small"><strong>Need help choosing?</strong><p class="muted mb-0">See the <a href="#/blog/choosing-mount-length" class="bold red">sizing guide</a> or call 805-338-6680.</p></div></aside>' +
      '<div><div class="toolbar"><div class="search-box" style="flex:1;max-width:360px">' + I.search + '<input class="input" id="shop-search" placeholder="Search name, model or SKU" value="' + esc(state.q) + '" aria-label="Search products"></div><div class="flex"><span class="small muted" id="shop-count"></span><label class="sr-only" for="shop-sort">Sort</label><select class="select" id="shop-sort"><option value="featured">Sort: Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name-asc">Name: A–Z</option><option value="name-desc">Name: Z–A</option></select></div></div>' +
      '<div class="product-grid" id="shop-grid"></div><div class="load-more" id="shop-more"></div></div></div></section>';
    return { html: html, title: 'Shop', mount: function (root) {
      var lens = {};
      function filtered() {
        var list = visibleProducts();
        if (state.cat !== 'all') list = list.filter(function (p) { return p.category === state.cat; });
        if (state.avail !== 'all') list = list.filter(function (p) { return p.availability === state.avail; });
        var activeLens = Object.keys(lens).filter(function (k) { return lens[k]; });
        if (activeLens.length) list = list.filter(function (p) { return activeLens.some(function (l) { return p.model.indexOf('-' + l) > -1 || p.sku.indexOf('-' + l) > -1; }); });
        if (state.q) { var q = state.q.toLowerCase(); list = list.filter(function (p) { return (p.name + ' ' + p.sku + ' ' + p.model + ' ' + p.short).toLowerCase().indexOf(q) > -1; }); }
        var s = state.sort;
        list.sort(function (a, b) {
          if (s === 'price-asc') return db.effectivePrice(a) - db.effectivePrice(b);
          if (s === 'price-desc') return db.effectivePrice(b) - db.effectivePrice(a);
          if (s === 'name-asc') return a.name.localeCompare(b.name);
          if (s === 'name-desc') return b.name.localeCompare(a.name);
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });
        return list;
      }
      function draw() {
        var grid = $('#shop-grid', root); var list = filtered();
        grid.innerHTML = '<div class="skeleton" style="height:320px"></div><div class="skeleton" style="height:320px"></div><div class="skeleton" style="height:320px"></div>';
        setTimeout(function () {
          if (!document.body.contains(grid) || !$('#shop-count', root)) return; // view was replaced
          grid.innerHTML = list.length ? list.slice(0, state.shown).map(TM.app.productCard).join('') : '<div class="empty" style="grid-column:1/-1">' + I.search + '<h4>No products match these filters</h4><p>Try clearing the search or choosing another category.</p><button class="btn btn-outline btn-sm" id="shop-clear">Clear filters</button></div>';
          $('#shop-count', root).textContent = list.length + ' product' + (list.length === 1 ? '' : 's');
          $('#shop-more', root).innerHTML = list.length > state.shown ? '<button class="btn btn-outline" id="load-more">Load more (' + (list.length - state.shown) + ' remaining)</button>' : '';
          var c = db.category(state.cat); $('#shop-title', root).textContent = c ? c.name : 'All Products';
          var lm = $('#load-more', root); if (lm) lm.onclick = function () { state.shown += PAGE; draw(); };
          var cl = $('#shop-clear', root); if (cl) cl.onclick = function () { state.q = ''; state.cat = 'all'; state.avail = 'all'; lens = {}; $('#shop-search', root).value = ''; $$('#f-cat button', root).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-cat') === 'all'); }); $$('#f-avail button', root).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-avail') === 'all'); }); $$('.chip', root).forEach(function (b) { b.classList.remove('active'); }); draw(); };
        }, 180);
      }
      $$('#f-cat button', root).forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-cat') === state.cat); b.onclick = function () { state.cat = b.getAttribute('data-cat'); state.shown = PAGE; $$('#f-cat button', root).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); draw(); }; });
      $$('#f-avail button', root).forEach(function (b) { b.onclick = function () { state.avail = b.getAttribute('data-avail'); $$('#f-avail button', root).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); draw(); }; });
      $$('#f-len .chip', root).forEach(function (b) { b.onclick = function () { var l = b.getAttribute('data-len'); lens[l] = !lens[l]; b.classList.toggle('active', lens[l]); draw(); }; });
      $('#shop-sort', root).onchange = function () { state.sort = this.value; draw(); };
      var t; $('#shop-search', root).oninput = function () { clearTimeout(t); var v = this.value; t = setTimeout(function () { state.q = v; state.shown = PAGE; draw(); }, 200); };
      TM.app.bindProductCards(root);
      draw();
    } };
  };

  // ---------- quick view ----------
  function priceBlock(p) {
    var disc = TM.app.dealer.discount(); var price = db.effectivePrice(p);
    if (p.availability === 'quote') return '<span class="price">Request a quote</span>';
    if (disc) return '<span class="price price-dealer">' + db.money(price * (1 - disc)) + '</span> <span class="price-old">' + db.money(price) + ' retail</span> <span class="badge badge-green">Dealer price (proposed)</span>';
    return '<span class="price">' + db.money(price) + '</span>' + (p.salePrice && p.salePrice < p.price ? ' <span class="price-old">' + db.money(p.price) + '</span> <span class="badge badge-red">Save ' + db.money(p.price - p.salePrice) + '</span>' : '');
  }
  function quickView(id) {
    var p = db.product(id); if (!p) return; var av = db.availabilityLabel(p);
    ui.modal({ size: 'lg', title: 'Quick view', body: '<div class="pdp" style="gap:28px"><div class="gallery"><div class="main"><img src="' + p.images[0] + '" alt="' + esc(p.name) + '"></div></div><div class="pdp-info"><span class="eyebrow">' + esc((db.category(p.category) || {}).name) + '</span><h2>' + esc(p.name) + '</h2><p class="muted small">Model ' + esc(p.model) + ' · SKU ' + esc(p.sku) + '</p><div class="mb-2">' + priceBlock(p) + '</div><span class="stock ' + av[1] + '"><i class="dot"></i>' + av[0] + '</span><p class="mt-2">' + esc(p.short) + '</p>' +
      (p.availability !== 'quote' && p.availability !== 'pre-order' ? '<div class="flex mt-3"><div class="qty"><button type="button" id="qv-dec" aria-label="Decrease">−</button><input type="number" id="qv-qty" value="1" min="1" aria-label="Quantity"><button type="button" id="qv-inc" aria-label="Increase">+</button></div><button class="btn btn-primary" id="qv-add" style="flex:1">Add to Cart</button></div>' : '<a class="btn btn-outline mt-3" href="#/contact?subject=' + encodeURIComponent(p.name) + '">Contact us about this product</a>') +
      '<a href="#/product/' + p.id + '" class="bold small mt-3" style="display:inline-block" id="qv-full">View full details →</a></div></div>', onMount: function (ov) {
        var q = ov.querySelector('#qv-qty'); if (!q) { ov.querySelector('#qv-full').onclick = ui.closeModal; return; }
        ov.querySelector('#qv-dec').onclick = function () { q.value = Math.max(1, +q.value - 1); };
        ov.querySelector('#qv-inc').onclick = function () { q.value = +q.value + 1; };
        ov.querySelector('#qv-add').onclick = function () { TM.cart.add(p.id, +q.value || 1); ui.closeModal(); };
        ov.querySelector('#qv-full').onclick = ui.closeModal;
      } });
  }

  // ---------- product detail ----------
  views.product = function (r) {
    var p = db.product(r.segs[1]); if (!p || p.status !== 'published') return views.notfound();
    var cat = db.category(p.category) || {}; var av = db.availabilityLabel(p);
    var related = visibleProducts().filter(function (x) { return x.id !== p.id && x.category === p.category; }).slice(0, 4);
    if (related.length < 4) related = related.concat(visibleProducts().filter(function (x) { return x.id !== p.id && x.category !== p.category && x.featured; })).slice(0, 4);
    var reviews = db.get('reviews').filter(function (rv) { return rv.product === p.id && rv.status === 'approved'; });
    var canBuy = p.availability !== 'quote' && p.availability !== 'pre-order' && p.availability !== 'out-of-stock';
    var specRows = Object.keys(p.specs || {}).map(function (k) { return '<tr><td>' + esc(k) + '</td><td>' + esc(p.specs[k]) + '</td></tr>'; }).join('') + '<tr><td>Material</td><td>' + esc(p.material) + '</td></tr><tr><td>Finish</td><td>' + esc(p.finish) + '</td></tr><tr><td>Brand</td><td>' + esc(p.brand) + '</td></tr>';
    var faqs = [['Is the opener or door included?', 'No. Mounts are not sold with openers or doors attached.'], ['How do I choose the right length?', 'Measure from the ceiling to the opener flange or track mounting point and choose the model whose maximum length covers that distance. Sizing guidance will be confirmed by Thunder Mounts.'], ['Do you offer dealer pricing?', 'Installers and distributors can apply for a dealer account. Pricing tiers are proposed and will be configured by Thunder Mounts.'], ['What is the return policy?', 'Sample policy: unused products in original packaging may be returned within 30 days. Final terms to be supplied by Thunder Mounts.']];
    var html = '<div class="page-head"><div class="container"><div class="crumbs"><a href="#/">Home</a><span>/</span><a href="#/shop">Shop</a><span>/</span><a href="#/shop?cat=' + p.category + '">' + esc(cat.name) + '</a><span>/</span>' + esc(p.name) + '</div></div></div>' +
      '<section class="section-tight"><div class="container"><div class="pdp"><div class="gallery"><div class="main"><img id="pdp-main" src="' + p.images[0] + '" alt="' + esc(p.name) + '"></div><div class="thumbs">' + p.images.map(function (src, i) { return '<button class="' + (i === 0 ? 'active' : '') + '" data-img="' + src + '" aria-label="View image ' + (i + 1) + '"><img src="' + src + '" alt=""></button>'; }).join('') + '</div></div>' +
      '<div class="pdp-info"><span class="eyebrow">' + esc(cat.name) + '</span><h1>' + esc(p.name) + '</h1><p class="muted">Model <strong>' + esc(p.model) + '</strong> · SKU ' + esc(p.sku) + (reviews.length ? ' · ' + ui.stars(Math.round(reviews.reduce(function (a, x) { return a + x.rating; }, 0) / reviews.length)) + ' <span class="small">(' + reviews.length + ' sample review' + (reviews.length > 1 ? 's' : '') + ')</span>' : '') + '</p><div class="mb-2">' + priceBlock(p) + '</div><span class="stock ' + av[1] + '"><i class="dot"></i>' + av[0] + (p.availability === 'low-stock' ? ' — only ' + p.stock + ' left' : '') + '</span><p class="mt-2" style="font-size:1.02rem">' + esc(p.short) + '</p>' +
      (canBuy ? '<div class="buy-row"><div class="qty"><button type="button" id="pdp-dec" aria-label="Decrease quantity">−</button><input type="number" id="pdp-qty" value="1" min="1" aria-label="Quantity"><button type="button" id="pdp-inc" aria-label="Increase quantity">+</button></div><button class="btn btn-primary btn-lg" id="pdp-add">Add to Cart</button></div>' : p.availability === 'quote' ? '<div class="buy-row"><a class="btn btn-primary btn-lg" href="#/contact?subject=' + encodeURIComponent('Quote request: ' + p.name) + '">Request a quote</a></div>' : '<div class="buy-row"><button class="btn btn-dark btn-lg" id="pdp-notify">Notify me when available</button></div>') +
      '<div class="trust-row"><div>' + I.truck + ' Ships from California</div><div>' + I.shield + ' Secure checkout (production)</div><div>' + I.download + ' Online instructions</div></div>' +
      '<div class="divider"></div><div class="small"><strong>Compatibility:</strong> <span class="muted">' + esc(p.compat) + '</span></div><div class="small mt-1"><strong>Shipping:</strong> <span class="muted">' + esc(p.shipping) + '</span></div></div></div>' +
      '<div class="tabs" role="tablist"><button class="active" data-tab="desc" role="tab">Description</button><button data-tab="specs" role="tab">Specifications</button><button data-tab="box" role="tab">What\'s in the box</button><button data-tab="install" role="tab">Installation</button><button data-tab="ship" role="tab">Shipping &amp; returns</button><button data-tab="faq" role="tab">FAQ</button><button data-tab="reviews" role="tab">Reviews (' + reviews.length + ')</button></div>' +
      '<div class="tab-panel active" data-panel="desc" style="max-width:820px;font-size:1.02rem"><p>' + esc(p.description) + '</p>' + (p.promo ? '<div class="notice notice-warn">' + I.warn + '<div><strong>' + esc(p.promo) + ':</strong> the sale price on this item demonstrates the promotion feature and is not a real offer.</div></div>' : '') + '</div>' +
      '<div class="tab-panel" data-panel="specs" style="max-width:820px">' + (!p.specsVerified ? '<div class="notice notice-warn mb-2">' + I.warn + '<div>Specifications marked “to verify” are placeholders. Dimensions, materials, load ratings and finish must be confirmed by Thunder Mounts before launch.</div></div>' : '') + '<table class="spec-list">' + specRows + '</table></div>' +
      '<div class="tab-panel" data-panel="box" style="max-width:820px"><ul class="checklist">' + (p.box || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="tab-panel" data-panel="install" style="max-width:820px"><div class="card card-body flex between wrap"><div><h4 class="mb-0">' + esc(p.model) + ' installation instructions</h4><p class="muted small mb-0">PDF · Placeholder until Thunder Mounts supplies the document</p></div><button class="btn btn-outline" id="pdp-pdf">' + I.download + ' Download PDF</button></div><p class="mt-3 muted">Production product pages can also embed installation videos and link to the full resources library.</p></div>' +
      '<div class="tab-panel" data-panel="ship" style="max-width:820px"><p><strong>Shipping:</strong> ' + esc(p.shipping) + '</p><p><strong>Returns:</strong> Sample policy — unused products in original packaging may be returned within 30 days of delivery. Final policy text to be supplied by Thunder Mounts. <a href="#/page/shipping-returns" class="bold red">Full policy →</a></p></div>' +
      '<div class="tab-panel faq" data-panel="faq" style="max-width:820px">' + faqs.map(function (f) { return '<details><summary>' + f[0] + '</summary><p>' + f[1] + '</p></details>'; }).join('') + '</div>' +
      '<div class="tab-panel" data-panel="reviews"><span class="demo-tag mb-2">Sample reviews — not verified customer testimonials</span><div class="grid grid-3 mt-2">' + (reviews.length ? reviews.map(function (rv) { return '<div class="review-card">' + ui.stars(rv.rating) + '<blockquote>“' + esc(rv.text) + '”</blockquote><div class="who"><strong>' + esc(rv.name) + '</strong> · ' + ui.fmtDate(rv.date) + '</div></div>'; }).join('') : '<div class="empty" style="grid-column:1/-1"><h4>No reviews yet</h4><p>Be the first to review this product.</p></div>') + '</div><button class="btn btn-outline mt-3" id="pdp-review">Write a review</button></div>' +
      '</div></section>' +
      '<section class="section section-gray"><div class="container"><div class="section-head"><div><span class="eyebrow">You may also need</span><h2>Related products</h2></div><a class="btn btn-outline" href="#/shop?cat=' + p.category + '">More in ' + esc(cat.name) + '</a></div><div class="product-grid cols-4">' + related.map(TM.app.productCard).join('') + '</div></div></section>';
    return { html: html, title: p.name, mount: function (root) {
      $$('.thumbs button', root).forEach(function (b) { b.onclick = function () { $('#pdp-main', root).src = b.getAttribute('data-img'); $$('.thumbs button', root).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); }; });
      $$('.tabs button', root).forEach(function (b) { b.onclick = function () { $$('.tabs button', root).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); $$('.tab-panel', root).forEach(function (pn) { pn.classList.toggle('active', pn.getAttribute('data-panel') === b.getAttribute('data-tab')); }); }; });
      var q = $('#pdp-qty', root);
      if (q) { $('#pdp-dec', root).onclick = function () { q.value = Math.max(1, +q.value - 1); }; $('#pdp-inc', root).onclick = function () { q.value = +q.value + 1; }; $('#pdp-add', root).onclick = function () { TM.cart.add(p.id, +q.value || 1); }; }
      var n = $('#pdp-notify', root); if (n) n.onclick = function () { ui.toast('A launch notification would be scheduled for this product.', 'info', 'Notify me (demo)'); };
      $('#pdp-pdf', root).onclick = function () { ui.toast('Placeholder — the production site will serve the real PDF.', 'info', 'Download'); };
      $('#pdp-review', root).onclick = function () { ui.modal({ title: 'Write a review', body: '<div class="field"><label>Your name</label><input class="input" id="rv-name"></div><div class="field"><label>Rating</label><select class="select" id="rv-rating"><option value="5">5 — Excellent</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select></div><div class="field"><label>Review</label><textarea class="textarea" id="rv-text"></textarea></div><p class="tiny muted">Submitted reviews are held for moderation in the admin dashboard (demo).</p>', footer: '<button class="btn btn-outline" data-close>Cancel</button><button class="btn btn-primary" id="rv-send">Submit review</button>', onMount: function (ov) { ov.querySelector('#rv-send').onclick = function () { var st = db.load(); st.reviews.unshift({ id: db.uid('r'), name: ov.querySelector('#rv-name').value || 'Anonymous', rating: +ov.querySelector('#rv-rating').value, product: p.id, text: ov.querySelector('#rv-text').value || '(no text)', status: 'pending', featured: false, date: new Date().toISOString().slice(0, 10) }); db.save(); ui.closeModal(); ui.toast('Thanks! Your review is pending approval in the admin.', 'success'); }; } }); };
      TM.app.bindProductCards(root);
    } };
  };

  TM.products = { quickView: quickView, priceBlock: priceBlock };
})(window);
