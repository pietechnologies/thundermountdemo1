/* Cart drawer + cart page + simulated checkout + confirmation (no real payments) */
(function (global) {
  'use strict';
  var TM = global.TM, db = TM.db, ui = TM.ui, esc = ui.esc, I = ui.I, $ = ui.$, $$ = ui.$$;
  var views = TM.views = TM.views || {};
  var KEY = 'tm_demo_cart';
  var items = [];     // [{id, qty}]
  var coupon = null;  // {code, pct}
  var COUPONS = { 'DEMO10': { pct: 0.10, label: '10% off (demo coupon)' }, 'INSTALLER': { pct: 0.05, label: '5% installer promo (demo)' } };
  var SHIP = [{ id: 'ground', name: 'Ground shipping', desc: '5–7 business days (placeholder rate)', price: 24 }, { id: 'expedited', name: 'Expedited', desc: '2–3 business days (placeholder rate)', price: 58 }, { id: 'pickup', name: 'Local pickup', desc: 'Pick up in California (by arrangement)', price: 0 }];

  function persist() { try { localStorage.setItem(KEY, JSON.stringify({ items: items, coupon: coupon })); } catch (e) { /* ignore */ } }
  function init() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) { items = s.items || []; coupon = s.coupon || null; } } catch (e) { items = []; } ensureDrawer(); }
  function count() { return items.reduce(function (a, i) { return a + i.qty; }, 0); }
  function unitPrice(p) { return db.effectivePrice(p) * (1 - TM.app.dealer.discount()); }
  function lines() { return items.map(function (i) { var p = db.product(i.id); return p ? { p: p, qty: i.qty, unit: unitPrice(p), total: unitPrice(p) * i.qty } : null; }).filter(Boolean); }
  function totals(shipId) {
    var sub = lines().reduce(function (a, l) { return a + l.total; }, 0);
    var disc = coupon ? sub * coupon.pct : 0;
    var ship = shipId ? (SHIP.filter(function (s) { return s.id === shipId; })[0] || SHIP[0]).price : 0;
    var tax = (sub - disc) * 0.0725; // placeholder CA-style rate for illustration only
    return { sub: sub, disc: disc, ship: ship, tax: tax, total: sub - disc + ship + tax };
  }
  function add(id, qty, silent) {
    var p = db.product(id); if (!p) return;
    var ex = items.filter(function (i) { return i.id === id; })[0];
    if (ex) ex.qty += qty; else items.push({ id: id, qty: qty });
    persist(); refresh();
    if (!silent) { ui.toast('<strong>' + esc(p.name) + '</strong> × ' + qty + ' added. <a href="#/cart" style="text-decoration:underline">View cart</a>', 'success', 'Added to cart'); open(); }
  }
  function setQty(id, qty) { qty = Math.max(0, parseInt(qty, 10) || 0); items = items.map(function (i) { return i.id === id ? { id: id, qty: qty } : i; }).filter(function (i) { return i.qty > 0; }); persist(); refresh(); }
  function remove(id) { items = items.filter(function (i) { return i.id !== id; }); persist(); refresh(); }
  function clear() { items = []; coupon = null; persist(); refresh(); }
  function applyCoupon(code) {
    code = String(code || '').trim().toUpperCase();
    if (!code) return { ok: false, msg: 'Enter a code.' };
    if (COUPONS[code]) { coupon = { code: code, pct: COUPONS[code].pct, label: COUPONS[code].label }; persist(); refresh(); return { ok: true, msg: COUPONS[code].label + ' applied.' }; }
    return { ok: false, msg: '“' + code + '” is not a valid demo code. Try DEMO10.' };
  }
  function refresh() { TM.app.renderHeader(); drawDrawer(); var cp = $('#cart-page'); if (cp) TM.app.render(); var cs = $('#co-summary'); if (cs) cs.innerHTML = summaryHtml($('input[name=ship]:checked') ? $('input[name=ship]:checked').value : 'ground'); }

  // ---------- drawer ----------
  function ensureDrawer() {
    var d = document.createElement('div'); d.className = 'drawer-wrap'; d.id = 'cart-drawer'; d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<div class="backdrop"></div><aside class="drawer" role="dialog" aria-label="Shopping cart"><div class="drawer-head"><h3 style="margin:0">Your cart <span class="muted small" id="dr-count"></span></h3><button class="close-x" aria-label="Close cart">×</button></div><div class="drawer-body" id="dr-body"></div><div class="drawer-foot" id="dr-foot"></div></aside>';
    document.body.appendChild(d);
    d.querySelector('.backdrop').onclick = close; d.querySelector('.close-x').onclick = close;
    ui.on(d, 'click', '[data-rm]', function (e, t) { remove(t.getAttribute('data-rm')); });
    ui.on(d, 'click', '[data-q]', function (e, t) { var id = t.getAttribute('data-id'); var cur = items.filter(function (i) { return i.id === id; })[0]; setQty(id, (cur ? cur.qty : 0) + parseInt(t.getAttribute('data-q'), 10)); });
    ui.on(d, 'change', 'input[data-qty]', function (e, t) { setQty(t.getAttribute('data-qty'), t.value); });
    ui.on(d, 'click', 'a', close);
  }
  function drawDrawer() {
    var d = $('#cart-drawer'); if (!d) return; var ls = lines(); var t = totals();
    $('#dr-count', d).textContent = count() ? '(' + count() + ')' : '';
    $('#dr-body', d).innerHTML = ls.length ? ls.map(lineHtml).join('') : '<div class="empty">' + I.cart + '<h4>Your cart is empty</h4><p>Add a mount set or opener to get started.</p><a class="btn btn-dark btn-sm" href="#/shop">Shop products</a></div>';
    $('#dr-foot', d).innerHTML = ls.length ? '<div class="totals-row"><span>Subtotal</span><strong>' + db.money(t.sub) + '</strong></div>' + (coupon ? '<div class="totals-row red"><span>' + esc(coupon.code) + '</span><span>−' + db.money(t.disc) + '</span></div>' : '') + '<p class="tiny muted">Shipping and tax calculated at checkout.</p><a class="btn btn-primary btn-block" href="#/checkout">Proceed to Checkout</a><a class="btn btn-outline btn-block mt-1" href="#/cart">View cart</a>' : '';
  }
  function lineHtml(l) {
    return '<div class="cart-line"><img src="' + l.p.images[0] + '" alt=""><div><div class="name"><a href="#/product/' + l.p.id + '">' + esc(l.p.name) + '</a></div><div class="meta">' + esc(l.p.sku) + ' · ' + db.money(l.unit) + ' each</div><div class="qty qty-sm mt-1"><button data-q="-1" data-id="' + l.p.id + '" aria-label="Decrease">−</button><input type="number" value="' + l.qty + '" min="0" data-qty="' + l.p.id + '" aria-label="Quantity"><button data-q="1" data-id="' + l.p.id + '" aria-label="Increase">+</button></div></div><div style="text-align:right"><strong>' + db.money(l.total) + '</strong><br><button class="remove" data-rm="' + l.p.id + '">Remove</button></div></div>';
  }
  function open() { var d = $('#cart-drawer'); drawDrawer(); d.classList.add('open'); d.setAttribute('aria-hidden', 'false'); }
  function close() { var d = $('#cart-drawer'); d.classList.remove('open'); d.setAttribute('aria-hidden', 'true'); }

  // ---------- cart page ----------
  views.cart = function () {
    var ls = lines(); var t = totals();
    var html = '<div class="page-head"><div class="container"><div class="crumbs"><a href="#/">Home</a><span>/</span>Cart</div><h1>Shopping cart</h1></div></div><section class="section-tight" id="cart-page"><div class="container checkout">' +
      (ls.length ? '<div><div class="card"><div class="table-wrap" style="border:0"><table class="table"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th class="num">Total</th><th></th></tr></thead><tbody>' + ls.map(function (l) { return '<tr><td><div class="cell-product"><img class="thumb" src="' + l.p.images[0] + '" alt=""><div><strong><a href="#/product/' + l.p.id + '">' + esc(l.p.name) + '</a></strong><span>' + esc(l.p.sku) + '</span></div></div></td><td>' + db.money(l.unit) + '</td><td><div class="qty qty-sm"><button data-q="-1" data-id="' + l.p.id + '" aria-label="Decrease">−</button><input type="number" value="' + l.qty + '" min="0" data-qty="' + l.p.id + '" aria-label="Quantity"><button data-q="1" data-id="' + l.p.id + '" aria-label="Increase">+</button></div></td><td class="num bold">' + db.money(l.total) + '</td><td class="actions"><button class="btn btn-ghost btn-xs" data-rm="' + l.p.id + '" aria-label="Remove">' + I.trash + '</button></td></tr>'; }).join('') + '</tbody></table></div></div><div class="flex between mt-3 wrap"><a class="btn btn-outline" href="#/shop">← Continue shopping</a><button class="btn btn-ghost" id="cart-clear">Clear cart</button></div></div>' +
        '<div class="card card-body summary-sticky"><h3>Order summary</h3><div class="totals-row"><span>Subtotal (' + count() + ' items)</span><strong>' + db.money(t.sub) + '</strong></div>' + (coupon ? '<div class="totals-row red"><span>Coupon ' + esc(coupon.code) + '</span><span>−' + db.money(t.disc) + '</span></div>' : '') + '<div class="totals-row"><span>Estimated shipping</span><span class="muted">Calculated at checkout</span></div><div class="totals-row"><span>Estimated tax</span><span class="muted">Calculated at checkout</span></div><div class="totals-row total"><span>Estimated total</span><span>' + db.money(t.sub - t.disc) + '</span></div><form class="flex mt-3" id="coupon-form"><input class="input" id="coupon-code" placeholder="Coupon code (try DEMO10)" aria-label="Coupon code"><button class="btn btn-outline" type="submit">Apply</button></form><div id="coupon-msg" class="small mt-1"></div><a class="btn btn-primary btn-block btn-lg mt-3" href="#/checkout">Proceed to Checkout</a><div class="trust-row" style="grid-template-columns:1fr"><div>' + I.lock + ' Production checkout uses PayPal / Stripe hosted payment components</div></div></div>'
        : '<div class="empty card" style="grid-column:1/-1">' + I.cart + '<h4>Your cart is empty</h4><p>Browse mounts, track sets and openers.</p><a class="btn btn-primary" href="#/shop">Shop products</a></div>') + '</div></section>';
    return { html: html, title: 'Cart', mount: function (root) {
      ui.on(root, 'click', '[data-rm]', function (e, t) { remove(t.getAttribute('data-rm')); });
      ui.on(root, 'click', '[data-q]', function (e, t) { var id = t.getAttribute('data-id'); var cur = items.filter(function (i) { return i.id === id; })[0]; setQty(id, (cur ? cur.qty : 0) + parseInt(t.getAttribute('data-q'), 10)); });
      ui.on(root, 'change', 'input[data-qty]', function (e, t) { setQty(t.getAttribute('data-qty'), t.value); });
      var cc = $('#cart-clear', root); if (cc) cc.onclick = function () { ui.confirm({ title: 'Clear cart?', message: 'Remove all items from your cart?', ok: 'Clear cart', danger: true }, clear); };
      var cf = $('#coupon-form', root); if (cf) cf.onsubmit = function (e) { e.preventDefault(); var r = applyCoupon($('#coupon-code', root).value); if (!r.ok) { $('#coupon-msg', root).innerHTML = '<span class="red">' + esc(r.msg) + '</span>'; } else ui.toast(r.msg, 'success', 'Coupon applied'); };
    } };
  };

  // ---------- checkout ----------
  function summaryHtml(shipId) {
    var ls = lines(); var t = totals(shipId);
    return '<h3>Order summary</h3>' + ls.map(function (l) { return '<div class="cart-line" style="grid-template-columns:56px 1fr auto"><img src="' + l.p.images[0] + '" alt=""><div><div class="name">' + esc(l.p.name) + '</div><div class="meta">Qty ' + l.qty + ' · ' + esc(l.p.sku) + '</div></div><strong>' + db.money(l.total) + '</strong></div>'; }).join('') +
      '<form class="flex mt-2" id="co-coupon"><input class="input" id="co-code" placeholder="Discount code" aria-label="Discount code" value="' + (coupon ? esc(coupon.code) : '') + '"><button class="btn btn-outline" type="submit">Apply</button></form><div id="co-coupon-msg" class="small mt-1"></div><div class="divider"></div>' +
      '<div class="totals-row"><span>Subtotal</span><span>' + db.money(t.sub) + '</span></div>' + (coupon ? '<div class="totals-row red"><span>Discount (' + esc(coupon.code) + ')</span><span>−' + db.money(t.disc) + '</span></div>' : '') + '<div class="totals-row"><span>Shipping</span><span>' + (t.ship ? db.money(t.ship) : 'Free') + '</span></div><div class="totals-row"><span>Tax <span class="tiny muted">(placeholder 7.25%)</span></span><span>' + db.money(t.tax) + '</span></div><div class="totals-row total"><span>Total</span><span>' + db.money(t.total) + '</span></div><p class="tiny muted mt-2">Shipping rates and tax are placeholders. Production will use carrier rates and a tax service / provider tax calculation.</p>';
  }
  views.checkout = function () {
    if (!lines().length) return { html: '<div class="empty section">' + I.cart + '<h2>Nothing to check out</h2><p>Your cart is empty.</p><a class="btn btn-primary" href="#/shop">Shop products</a></div>', title: 'Checkout' };
    var session = TM.app.dealer.get();
    var html = '<div class="page-head"><div class="container"><div class="crumbs"><a href="#/">Home</a><span>/</span><a href="#/cart">Cart</a><span>/</span>Checkout</div><h1>Checkout</h1><div class="steps"><span class="done"><i>✓</i> Cart</span><span class="current"><i>2</i> Details &amp; payment</span><span><i>3</i> Confirmation</span></div></div></div>' +
      '<section class="section-tight"><div class="container"><div class="notice notice-warn mb-3">' + I.warn + '<div><strong>Demonstration checkout.</strong> No payment is processed and no data is sent anywhere. Do not enter real card numbers. In production, payments are handled by PayPal and/or Stripe hosted or tokenized components — the website never stores raw card data.</div></div><form class="checkout" id="co-form" novalidate><div class="stack" style="--gap:20px">' +
      '<div class="card card-body"><h3>1. Contact information</h3><div class="form-row"><div class="field"><label for="co-email">Email *</label><input class="input" id="co-email" type="email" required value="' + (session ? 'demo-dealer@example.com' : '') + '"></div><div class="field"><label for="co-phone">Phone *</label><input class="input" id="co-phone" type="tel" required></div></div><label class="check"><input type="checkbox" checked> Email me order updates and installer resources</label></div>' +
      '<div class="card card-body"><h3>2. Shipping address</h3><div class="form-row"><div class="field"><label for="co-fn">First name *</label><input class="input" id="co-fn" required></div><div class="field"><label for="co-ln">Last name *</label><input class="input" id="co-ln" required></div></div><div class="field"><label for="co-co">Company (optional)</label><input class="input" id="co-co" value="' + (session ? esc(session.company) : '') + '"></div><div class="field"><label for="co-a1">Address *</label><input class="input" id="co-a1" required></div><div class="form-row-3"><div class="field"><label for="co-city">City *</label><input class="input" id="co-city" required></div><div class="field"><label for="co-st">State *</label><select class="select" id="co-st"><option>CA</option><option>AZ</option><option>NV</option><option>OR</option><option>WA</option><option>TX</option><option>Other</option></select></div><div class="field"><label for="co-zip">ZIP *</label><input class="input" id="co-zip" required></div></div><label class="check" id="co-same-wrap"><input type="checkbox" id="co-same" checked> Billing address is the same as shipping</label><div id="co-billing" class="hidden mt-2"><h4>Billing address</h4><div class="field"><label for="co-b1">Address</label><input class="input" id="co-b1"></div><div class="form-row-3"><div class="field"><label for="co-bcity">City</label><input class="input" id="co-bcity"></div><div class="field"><label for="co-bst">State</label><input class="input" id="co-bst"></div><div class="field"><label for="co-bzip">ZIP</label><input class="input" id="co-bzip"></div></div></div></div>' +
      '<div class="card card-body"><h3>3. Shipping method</h3><div class="option-list">' + SHIP.map(function (s, i) { return '<label class="option"><input type="radio" name="ship" value="' + s.id + '" ' + (i === 0 ? 'checked' : '') + '><div class="opt-body"><strong>' + s.name + '</strong><span>' + s.desc + '</span></div><span class="opt-price">' + (s.price ? db.money(s.price) : 'Free') + '</span></label>'; }).join('') + '</div></div>' +
      '<div class="card card-body"><h3>4. Payment</h3><div class="option-list"><label class="option"><input type="radio" name="pay" value="card" checked><div class="opt-body"><strong>Credit / debit card</strong><span>Processed by a PCI-compliant provider (proposed: Stripe) using hosted card fields</span></div><span class="pay-logo stripe">stripe</span></label><label class="option"><input type="radio" name="pay" value="paypal"><div class="opt-body"><strong>PayPal</strong><span>Redirect to PayPal to approve payment, then return to confirm</span></div><span class="pay-logo paypal">PayPal</span></label>' + (session && session.status === 'approved' ? '<label class="option"><input type="radio" name="pay" value="invoice"><div class="opt-body"><strong>Dealer invoice / purchase order</strong><span>Proposed Net-30 terms for approved dealers (configured by Thunder Mounts)</span></div><span class="badge badge-blue">Dealer</span></label>' : '') + '</div>' +
      '<div class="card-mock" id="pay-card"><div class="flex between mb-2"><strong class="small">Secure card entry (visual placeholder)</strong><span class="badge badge-gray">' + I.lock + ' Hosted fields</span></div><div class="field"><label>Card number</label><input class="input" value="•••• •••• •••• 4242 (sample — not editable)" readonly></div><div class="form-row-3"><div class="field"><label>Expiry</label><input class="input" value="MM / YY" readonly></div><div class="field"><label>CVC</label><input class="input" value="•••" readonly></div><div class="field"><label>ZIP</label><input class="input" value="93010" readonly></div></div><p class="tiny muted mb-0">In production these fields are rendered by the payment provider inside a secure iframe; card data never touches the Thunder Mounts server.</p></div>' +
      '<div class="card-mock hidden" id="pay-paypal"><p class="small mb-0">You will be redirected to PayPal to complete payment. <strong>(Simulated in this demo.)</strong></p></div><div class="card-mock hidden" id="pay-invoice"><div class="field"><label>PO number</label><input class="input" placeholder="Optional"></div></div></div>' +
      '<label class="check"><input type="checkbox" id="co-terms" required> I agree to the <a href="#/page/terms" class="bold">Terms &amp; Conditions</a>, <a href="#/page/privacy" class="bold">Privacy Policy</a> and <a href="#/page/shipping-returns" class="bold">Return Policy</a>.</label>' +
      '<button class="btn btn-primary btn-lg btn-block" type="submit" id="co-submit">' + I.lock + ' Place order (simulated)</button><p class="tiny muted center">By placing this demo order you are not making a purchase.</p></div>' +
      '<div><div class="card card-body summary-sticky" id="co-summary">' + summaryHtml('ground') + '</div></div></form></div></section>';
    return { html: html, title: 'Checkout', mount: function (root) {
      $('#co-same', root).onchange = function () { $('#co-billing', root).classList.toggle('hidden', this.checked); };
      $$('input[name=ship]', root).forEach(function (r) { r.onchange = function () { $('#co-summary', root).innerHTML = summaryHtml(r.value); bindCoupon(); }; });
      $$('input[name=pay]', root).forEach(function (r) { r.onchange = function () { ['card', 'paypal', 'invoice'].forEach(function (k) { var el = $('#pay-' + k, root); if (el) el.classList.toggle('hidden', k !== r.value); }); }; });
      function bindCoupon() { var cf = $('#co-coupon', root); if (cf) cf.onsubmit = function (e) { e.preventDefault(); var res = applyCoupon($('#co-code', root).value); $('#co-summary', root).innerHTML = summaryHtml($('input[name=ship]:checked', root).value); bindCoupon(); $('#co-coupon-msg', root).innerHTML = '<span class="' + (res.ok ? 'price-dealer' : 'red') + '">' + esc(res.msg) + '</span>'; }; }
      bindCoupon();
      $('#co-form', root).onsubmit = function (e) {
        e.preventDefault(); var ok = true;
        $$('[required]', root).forEach(function (f) { var bad = f.type === 'checkbox' ? !f.checked : !f.value.trim(); f.classList.toggle('invalid', bad); if (bad) ok = false; });
        if (!ok) { ui.toast('Please complete the required fields.', 'error', 'Missing information'); var first = $('.invalid', root); if (first) first.focus(); return; }
        var btn = $('#co-submit', root); btn.disabled = true; btn.innerHTML = 'Processing (simulated)…';
        var pay = $('input[name=pay]:checked', root).value; var ship = $('input[name=ship]:checked', root).value; var t = totals(ship);
        ui.simulate(function () {
          var id = 'TM-' + (10242 + db.get('orders').length - 10);
          var name = $('#co-fn', root).value + ' ' + $('#co-ln', root).value;
          var st = db.load();
          st.orders.unshift({ id: id, customer: name, email: $('#co-email', root).value, date: new Date().toISOString().slice(0, 10), items: items.map(function (i) { return { id: i.id, qty: i.qty }; }), total: Math.round(t.total * 100) / 100, shipping: t.ship, payment: pay === 'invoice' ? 'invoice' : 'paid', fulfillment: 'new', method: pay === 'paypal' ? 'PayPal (demo)' : pay === 'invoice' ? 'Net-30 invoice (proposed)' : 'Card (demo)', address: $('#co-a1', root).value + ', ' + $('#co-city', root).value + ', ' + $('#co-st', root).value + ' ' + $('#co-zip', root).value, tracking: '', notes: ['Placed through the prototype checkout (simulated payment).'], dealer: !!(TM.app.dealer.get() && TM.app.dealer.get().status === 'approved') });
          st.activity.unshift({ t: 'Just now', text: 'Order <strong>' + id + '</strong> placed via prototype checkout (' + (pay === 'paypal' ? 'PayPal demo' : pay === 'invoice' ? 'invoice' : 'card demo') + ').' });
          db.save(); clear(); TM.app.navigate('#/confirmation/' + id);
        }, 1400);
      };
    } };
  };

  views.confirmation = function (r) {
    var o = db.get('orders').filter(function (x) { return x.id === r.segs[1]; })[0];
    if (!o) return views.notfound();
    return { html: '<section class="section"><div class="container" style="max-width:760px"><div class="card"><div class="confirm-hero"><div class="ok">' + I.check + '</div><span class="demo-tag">Simulated order — no payment was taken</span><h1 class="mt-2">Thank you, ' + esc(o.customer.split(' ')[0]) + '!</h1><p class="muted">Order <strong>' + o.id + '</strong> has been received. A confirmation email would be sent to <strong>' + esc(o.email) + '</strong> in production.</p></div><div class="card-body"><div class="wf"><div class="current">Order received</div><div>Processing</div><div>Fulfilled</div><div>Shipped</div><div>Completed</div></div><div class="divider"></div>' + o.items.map(function (i) { var p = db.product(i.id); return '<div class="cart-line" style="grid-template-columns:56px 1fr auto"><img src="' + p.images[0] + '" alt=""><div><div class="name">' + esc(p.name) + '</div><div class="meta">Qty ' + i.qty + '</div></div><strong>' + db.money(db.effectivePrice(p) * i.qty) + '</strong></div>'; }).join('') + '<div class="totals-row total"><span>Total charged (simulated)</span><span>' + db.money(o.total) + '</span></div><dl class="kv mt-3"><dt>Payment</dt><dd>' + esc(o.method) + '</dd><dt>Ship to</dt><dd>' + esc(o.address) + '</dd><dt>Status</dt><dd>' + ui.badge('new') + '</dd></dl><div class="flex mt-3 wrap"><a class="btn btn-primary" href="#/shop">Continue shopping</a><a class="btn btn-outline" href="admin.html#orders">See this order in the admin demo →</a></div></div></div></div></section>', title: 'Order confirmed' };
  };

  // Order detail modal shared by dealer portal
  function orderModal(o) {
    ui.modal({ size: 'lg', title: 'Order ' + o.id, body: '<div class="detail-grid"><div>' + o.items.map(function (i) { var p = db.product(i.id); return p ? '<div class="cart-line" style="grid-template-columns:56px 1fr auto"><img src="' + p.images[0] + '" alt=""><div><div class="name">' + esc(p.name) + '</div><div class="meta">' + esc(p.sku) + ' · Qty ' + i.qty + '</div></div><strong>' + db.money(db.effectivePrice(p) * i.qty) + '</strong></div>' : ''; }).join('') + '<div class="totals-row total"><span>Total</span><span>' + db.money(o.total) + '</span></div></div><div><dl class="kv"><dt>Date</dt><dd>' + ui.fmtDate(o.date) + '</dd><dt>Payment</dt><dd>' + ui.badge(o.payment) + '</dd><dt>Status</dt><dd>' + ui.badge(o.fulfillment) + '</dd><dt>Ship to</dt><dd>' + esc(o.address) + '</dd><dt>Tracking</dt><dd>' + (o.tracking ? esc(o.tracking) : '<span class="muted">Not yet shipped</span>') + '</dd></dl><div class="wf" style="grid-template-columns:1fr 1fr 1fr">' + ['new', 'processing', 'shipped', 'completed'].map(function (s, i, arr) { var idx = arr.indexOf(o.fulfillment); return '<div class="' + (i < idx ? 'done' : i === idx ? 'current' : '') + '">' + s + '</div>'; }).join('') + '</div></div></div>', footer: '<button class="btn btn-outline" data-close>Close</button><button class="btn btn-dark" id="om-invoice">' + I.download + ' Invoice (placeholder)</button>', onMount: function (ov) { ov.querySelector('#om-invoice').onclick = function () { ui.toast('Invoice PDF generation is a production feature.', 'info'); }; } });
  }

  TM.cart = { init: init, add: add, remove: remove, setQty: setQty, count: count, open: open, close: close, lines: lines, totals: totals, clear: clear, orderModal: orderModal };
})(window);
