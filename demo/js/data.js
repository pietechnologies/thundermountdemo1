/* =====================================================================
   THUNDER MOUNTS — Prototype seed data + local state store
   ---------------------------------------------------------------------
   Product names, SKUs and list prices were taken from the public
   catalog at thundermounts.com at the time the proposal was prepared.
   Specifications marked "to verify" are placeholders for client review.
   ALL orders, customers, dealers, reviews, analytics and blog posts are
   fictional demonstration data.  Nothing here is persisted to a server;
   state lives only in this browser's localStorage.
   ===================================================================== */
(function (global) {
  'use strict';

  var IMG = 'assets/img/';
  var STATE_KEY = 'tm_proposal_state_v1';

  var money = function (n) {
    return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  var categories = [
    { id: 'opener-mounts', name: 'Opener Mounts', slug: 'opener-mounts', image: IMG + 'tm-mount-1.jpg', blurb: 'Mounts that attach at the opener motor flanges (TMS / TMX / TML series).' },
    { id: 'marantec-mounts', name: 'Marantec Mounts', slug: 'marantec-mounts', image: IMG + 'tmmrt-2.jpg', blurb: 'TMMRT series mounts for Marantec-style openers.' },
    { id: 'track-mounts', name: 'Track Mount Sets', slug: 'track-mount-sets', image: IMG + 'tmgt-1.jpg', blurb: 'TMGT sets for overhead door track — one set per door.' },
    { id: 'openers', name: 'Garage Door Openers', slug: 'openers', image: 'https://static.wixstatic.com/media/424d86_dd648faf921945909e5f43911b5dec1e~mv2.jpg', blurb: 'Opener models currently listed in the catalog.' },
    { id: 'doors', name: 'Garage Doors', slug: 'garage-doors', image: 'https://static.wixstatic.com/media/424d86_6c95a7ed84aa4aee9e79e974cfe43b71~mv2.jpg', blurb: 'Frameless and aluminum door options.' },
    { id: 'lighting', name: 'Lighting & Accessories', slug: 'lighting', image: 'https://static.wixstatic.com/media/424d86_f452ae18e27842b6ac4a6864c09bb7fdf002.jpg', blurb: 'Thunder Lights ring lights (in development).' }
  ];

  var commonBox = ['Mount set (quantity per listing)', 'Mounting hardware', 'Chrome finishing ring (TMGT sets, per current listing)', 'Online installation instructions'];

  function mount(o) {
    return Object.assign({
      category: 'opener-mounts',
      brand: 'Thunder Mounts',
      status: 'published',
      featured: false,
      stock: 24,
      availability: 'in-stock',
      material: 'Powder-coated steel (to verify)',
      finish: 'Black powder coat (to verify)',
      box: commonBox,
      compat: 'Mounts are not sold with openers or doors attached. Compatibility with specific opener models to be confirmed by Thunder Mounts.',
      shipping: 'Ships from California. Carrier and transit estimates will be configured in production.',
      images: [IMG + 'tm-mount-1.jpg', IMG + 'tm-mount-2.jpg', IMG + 'tm-mount-3.jpg'],
      specsVerified: false,
      seo: {}
    }, o);
  }

  var products = [
    mount({ id: 'tms-12', sku: 'TMS-12', name: 'TMS-12 Opener Mount', model: 'TMS-12', price: 490, salePrice: null, featured: true,
      short: 'Easy to assemble and install overhead garage door opener mount that attaches at the flanges of the motor. 12-inch maximum length.',
      description: 'Easy to assemble and install overhead garage door opener mount that attaches at the flanges of the motor. Replaces conventional angle iron with a clean, symmetrical, engineered mounting solution. 12 inches max length. (Opener not included.)',
      specs: { 'Maximum length': '12 in.', 'Attachment': 'At opener motor flanges', 'Series': 'TMS', 'Opener included': 'No' },
      seo: { title: 'TMS-12 Garage Door Opener Mount | Thunder Mounts', description: 'TMS-12 overhead garage door opener mount — 12 in. max length, attaches at the motor flanges. A modern, symmetrical alternative to angle iron.' } }),
    mount({ id: 'tmx-19', sku: 'TMX-19', name: 'TMX-19 Opener Mount', model: 'TMX-19', price: 523, salePrice: null, featured: true,
      short: 'Opener mount attaching at the motor flanges. 19-inch maximum length.',
      description: 'Easy to assemble and install overhead garage door opener mount that attaches at the flanges of the motor. 19 inches max length. (Opener not included.)',
      specs: { 'Maximum length': '19 in.', 'Attachment': 'At opener motor flanges', 'Series': 'TMX', 'Opener included': 'No' },
      images: [IMG + 'tm-mount-2.jpg', IMG + 'tm-mount-1.jpg', IMG + 'tm-mount-3.jpg'] }),
    mount({ id: 'tml-24', sku: 'TML-24', name: 'TML-24 Opener Mount', model: 'TML-24', price: 523, salePrice: null,
      short: 'Opener mount attaching at the motor flanges. 24-inch maximum length.',
      description: 'Easy to assemble and install overhead garage door opener mount that attaches at the flanges. 24 inches max length. (Opener not included.)',
      specs: { 'Maximum length': '24 in.', 'Attachment': 'At opener motor flanges', 'Series': 'TML', 'Opener included': 'No' },
      images: [IMG + 'tm-mount-3.jpg', IMG + 'tm-mount-1.jpg', IMG + 'tm-mount-2.jpg'] }),
    mount({ id: 'tml-29', sku: 'TML-29', name: 'TML-29 Opener Mount', model: 'TML-29', price: 523, salePrice: null, stock: 6, availability: 'low-stock',
      short: 'Opener mount attaching at the motor flanges. 29-inch maximum length.',
      description: 'Easy to assemble and install overhead garage door opener mount that attaches at the flanges. 29 inches max length. (Opener not included.)',
      specs: { 'Maximum length': '29 in.', 'Attachment': 'At opener motor flanges', 'Series': 'TML', 'Opener included': 'No' },
      images: [IMG + 'tml-29.jpg', IMG + 'tm-mount-1.jpg'] }),
    mount({ id: 'tmmrt-12', sku: 'TMMRT-12', name: 'TMMRT-12 Marantec Mount', model: 'TMMRT-12', price: 490, salePrice: null, category: 'marantec-mounts',
      short: 'Thunder Mounts mount for Marantec-style openers. 12-inch maximum length.',
      description: 'Thunder Mounts TMMRT series mount designed for Marantec-style overhead openers. 12 inches max length. (Opener not included.) Compatibility details to be confirmed by Thunder Mounts.',
      specs: { 'Maximum length': '12 in.', 'Series': 'TMMRT', 'Intended opener style': 'Marantec (to verify)', 'Opener included': 'No' },
      images: [IMG + 'tmmrt-2.jpg', IMG + 'tm-mount-1.jpg'] }),
    mount({ id: 'tmmrt-19', sku: 'TMMRT-19', name: 'TMMRT-19 Marantec Mount', model: 'TMMRT-19', price: 527, salePrice: null, category: 'marantec-mounts',
      short: 'Thunder Mounts mount for Marantec-style openers. 19-inch maximum length.',
      description: 'Thunder Mounts TMMRT series mount designed for Marantec-style overhead openers. 19 inches max length. (Opener not included.)',
      specs: { 'Maximum length': '19 in.', 'Series': 'TMMRT', 'Intended opener style': 'Marantec (to verify)', 'Opener included': 'No' },
      images: [IMG + 'tmmrt-2.jpg', IMG + 'tm-mount-1.jpg'] }),
    mount({ id: 'tmmrt-24', sku: 'TMMRT-24', name: 'TMMRT-24 Marantec Mount', model: 'TMMRT-24', price: 527, salePrice: null, category: 'marantec-mounts',
      short: 'Thunder Mounts mount for Marantec-style openers. 24-inch maximum length.',
      description: 'Thunder Mounts TMMRT series mount designed for Marantec-style overhead openers. 24 inches max length. (Opener not included.) Note: the current listing shows SKU "TMMRT-29" — to confirm with client.',
      specs: { 'Maximum length': '24 in.', 'Series': 'TMMRT', 'Intended opener style': 'Marantec (to verify)', 'Opener included': 'No' },
      images: ['https://static.wixstatic.com/media/424d86_63007af6d4d74b33888cee384f3ba24c~mv2.jpg', IMG + 'tmmrt-24-2.jpg'] }),
    mount({ id: 'tmgt-12', sku: 'TMGT-12', name: 'TMGT-12 Track Mount Set', model: 'TMGT-12', price: 715, salePrice: null, category: 'track-mounts', featured: true,
      short: 'Overhead garage door track mount set for one door. 12-inch maximum length. Instructions, chrome ring and hardware included.',
      description: 'Thunder Mounts TMGT-12 has a maximum length of twelve inches. These come as a set for one overhead door. Online instructions, chrome ring and hardware included.',
      specs: { 'Maximum length': '12 in.', 'Sold as': 'Set for one overhead door', 'Series': 'TMGT (track)', 'Included': 'Chrome ring, hardware, online instructions' },
      images: [IMG + 'tmgt-1.jpg', 'https://static.wixstatic.com/media/424d86_f452ae18e27842b6ac4a6864c09bb7fdf002.jpg', 'https://static.wixstatic.com/media/424d86_3e984c2f7e47496380359795b1abbd96~mv2.jpg'],
      seo: { title: 'TMGT-12 Garage Door Track Mount Set | Thunder Mounts', description: 'TMGT-12 overhead garage door track mount set for one door. Includes chrome ring, hardware and online instructions.' } }),
    mount({ id: 'tmgt-19', sku: 'TMGT-19', name: 'TMGT-19 Track Mount Set', model: 'TMGT-19', price: 743, salePrice: null, category: 'track-mounts',
      short: 'Overhead garage door track mount set for one door. 19-inch maximum length.',
      description: 'Thunder Mounts TMGT-19 has a maximum length of nineteen inches. Sold as a set for one overhead door. Online instructions, chrome ring and hardware included.',
      specs: { 'Maximum length': '19 in.', 'Sold as': 'Set for one overhead door', 'Series': 'TMGT (track)' },
      images: ['https://static.wixstatic.com/media/424d86_3e984c2f7e47496380359795b1abbd96~mv2.jpg', IMG + 'tmgt-1.jpg'] }),
    mount({ id: 'tmgt-24', sku: 'TMGT-24', name: 'TMGT-24 Track Mount Set', model: 'TMGT-24', price: 743, salePrice: null, category: 'track-mounts', featured: true,
      short: 'Overhead garage door track mount set for one door. 24-inch maximum length.',
      description: 'Thunder Mounts TMGT-24 has a maximum length of twenty-four inches. Sold as a set for one overhead door. Online instructions, chrome ring and hardware included.',
      specs: { 'Maximum length': '24 in.', 'Sold as': 'Set for one overhead door', 'Series': 'TMGT (track)' },
      images: [IMG + 'tmgt-1.jpg', IMG + 'tm-mount-3.jpg'] }),
    mount({ id: 'tmgt-29', sku: 'TMGT-29', name: 'TMGT-29 Track Mount Set', model: 'TMGT-29', price: 754, salePrice: 699, promo: 'Sample promotion', category: 'track-mounts',
      short: 'Overhead garage door track mount set for one door. 29-inch maximum length.',
      description: 'Thunder Mounts TMGT-29 has a maximum length of twenty-nine inches. Sold as a set for one overhead door. Online instructions, chrome ring and hardware included. (Sale price shown is a demo-only example of the promotion feature.)',
      specs: { 'Maximum length': '29 in.', 'Sold as': 'Set for one overhead door', 'Series': 'TMGT (track)' },
      images: ['https://static.wixstatic.com/media/424d86_f9b34a9280da426a925d7658e9e51b65~mv2.jpeg', IMG + 'tm-mount-3.jpg'] }),
    mount({ id: 'thunder-lights', sku: 'TMRLED', name: 'Thunder Lights Ring Light', model: 'TMRLED', price: 149.99, salePrice: null, category: 'lighting', availability: 'pre-order', stock: 0,
      short: 'In development: low-voltage ring lights made for Thunder Mounts, connecting to openers with a connection port.',
      description: 'In Development: Thunder Lights are a new line of low-voltage ring lights made for Thunder Mounts to connect to openers that have a connection port. Shown as a "coming soon / notify me" product in the prototype.',
      specs: { 'Type': 'Low-voltage LED ring light', 'Power': 'Opener connection port (to verify)', 'Status': 'In development' },
      box: ['Ring light', 'Connection lead (to verify)'],
      images: ['https://static.wixstatic.com/media/424d86_f452ae18e27842b6ac4a6864c09bb7fdf002.jpg', 'https://static.wixstatic.com/media/424d86_3e984c2f7e47496380359795b1abbd96~mv2.jpg'] }),
    mount({ id: 'sommer-overhead-opener', sku: 'SOMMER-OH', name: 'Sommer Overhead Opener', model: 'Sommer', brand: 'Sommer', price: 450, salePrice: null, category: 'openers', stock: 5, availability: 'low-stock',
      short: 'Sommer overhead garage door opener as listed in the current catalog.',
      description: 'Sommer overhead garage door opener. Model details, horsepower, drive type and warranty to be supplied by Thunder Mounts for the production catalog.',
      specs: { 'Brand': 'Sommer', 'Type': 'Overhead opener', 'Drive / HP': 'To verify' }, box: ['Opener unit', 'Manufacturer accessories (to verify)'],
      compat: 'Pairs with Thunder Mounts opener mounts — confirm model fitment with Thunder Mounts.',
      images: ['https://static.wixstatic.com/media/424d86_dd648faf921945909e5f43911b5dec1e~mv2.jpg', 'https://static.wixstatic.com/media/424d86_136828a391a645ee897809715196672e~mv2.jpg'] }),
    mount({ id: '6690l', sku: '6690L', name: '6690L Overhead Opener', model: '6690L', brand: 'To verify', price: 650, salePrice: null, category: 'openers',
      short: 'Model 6690L overhead garage door opener as listed in the current catalog.',
      description: 'Model 6690L overhead garage door opener. Manufacturer, specifications and warranty to be supplied by Thunder Mounts.',
      specs: { 'Model': '6690L', 'Type': 'Overhead opener', 'Specifications': 'To verify' }, box: ['Opener unit', 'Manufacturer accessories (to verify)'],
      images: ['https://static.wixstatic.com/media/424d86_0d559b229f754f6b9130371c66330e0a~mv2.png', 'https://static.wixstatic.com/media/424d86_29eeadaa34c3483b9fc3dba4064c9576~mv2.png'] }),
    mount({ id: 'liftmaster-98032', sku: 'LM-98032', name: 'LiftMaster 98032 DC Heavy-Duty Side-Mount', model: '98032', brand: 'LiftMaster', price: 999.99, salePrice: null, category: 'openers',
      short: 'LiftMaster 98032 DC Heavy Duty Premium Series side-mount sectional opener.',
      description: 'LiftMaster 98032 DC Heavy Duty Premium Series Side-Mount Sectional opener as listed in the current catalog. Full manufacturer specifications to be added in production.',
      specs: { 'Brand': 'LiftMaster', 'Model': '98032', 'Type': 'Side-mount (jackshaft) sectional' }, box: ['Opener unit', 'Manufacturer accessories (to verify)'],
      images: ['https://static.wixstatic.com/media/424d86_6f0119b3074f45a38235d84eb2e7e624~mv2.jpg'] }),
    mount({ id: 'marantec-synergy-380', sku: 'Marantec380', name: 'Marantec Synergy 380', model: 'Synergy 380', brand: 'Marantec', price: 750, salePrice: null, category: 'openers',
      short: 'Marantec Synergy 380 overhead garage door opener.',
      description: 'Marantec Synergy 380 overhead garage door opener as listed in the current catalog. Manufacturer specifications to be added in production.',
      specs: { 'Brand': 'Marantec', 'Model': 'Synergy 380', 'Type': 'Overhead opener' }, box: ['Opener unit', 'Manufacturer accessories (to verify)'],
      compat: 'Suggested pairing: TMMRT series mounts (to be confirmed by Thunder Mounts).',
      images: ['https://static.wixstatic.com/media/424d86_158bd39bcc63455d95c56b5306ee6e97~mv2.jpg'] }),
    mount({ id: 'genie-edge', sku: 'Genie #41410W', name: 'Genie Edge Mounted Opener', model: '41410W', brand: 'Genie', price: 725, salePrice: null, category: 'openers',
      short: 'Genie edge-mounted (wall-mount) garage door opener.',
      description: 'Genie Edge Mounted Garage Door Opener (Genie #41410W) as listed in the current catalog. Manufacturer specifications to be added in production.',
      specs: { 'Brand': 'Genie', 'Model': '41410W', 'Type': 'Edge / wall-mount opener' }, box: ['Opener unit', 'Manufacturer accessories (to verify)'],
      images: ['https://static.wixstatic.com/media/424d86_bfe8c267ee3e4773ad2f9403e72cb952~mv2.jpg'] }),
    mount({ id: 'alumadoors', sku: 'ALUMA', name: 'Alumadoors Aluminum Garage Door', model: 'Alumadoors', brand: 'Alumadoors', price: 0, salePrice: null, category: 'doors', availability: 'quote', stock: 0,
      short: 'Aluminum full-view style garage door. Available in multiple door sizes — request a quote.',
      description: 'Alumadoors aluminum garage door listed with a "Door Sizes" option on the current site and no fixed price. The prototype shows this as a request-a-quote product. Sizes, glazing and finish options to be supplied by Thunder Mounts.',
      specs: { 'Brand': 'Alumadoors', 'Options': 'Door sizes (to verify)', 'Pricing': 'Quote' }, box: ['Door sections and hardware per quote'],
      images: ['https://static.wixstatic.com/media/424d86_7214469123244d1fb250570cc48976b1~mv2.jpg', 'https://static.wixstatic.com/media/424d86_5210c941883b47a48f8426d43f7ee5cd~mv2.jpg'] }),
    mount({ id: 'wayne-dalton-frameless', sku: 'WD-FRAMELESS', name: 'Wayne Dalton Frameless Garage Door', model: 'Frameless', brand: 'Wayne Dalton', price: 2200, salePrice: null, category: 'doors', stock: 2, availability: 'low-stock',
      short: 'Wayne Dalton frameless-style garage door as listed in the current catalog.',
      description: 'Wayne Dalton Frameless Garage Door as listed in the current catalog at $2,200.00. Sizes, glazing and finish to be confirmed by Thunder Mounts.',
      specs: { 'Brand': 'Wayne Dalton', 'Style': 'Frameless', 'Sizes': 'To verify' }, box: ['Door sections and hardware per order'],
      images: ['https://static.wixstatic.com/media/424d86_6c95a7ed84aa4aee9e79e974cfe43b71~mv2.jpg'] })
  ];

  // ---- Fictional customers (sample data) ----
  var customers = [
    { id: 'c1', name: 'Jordan Reyes', email: 'jordan.reyes@example.com', phone: '(805) 555-0142', type: 'Homeowner', status: 'active', city: 'Camarillo, CA', since: '2025-09-14', orders: 2, spent: 1213 },
    { id: 'c2', name: 'Priya Natarajan', email: 'priya.n@example.com', phone: '(818) 555-0177', type: 'Homeowner', status: 'active', city: 'Burbank, CA', since: '2025-10-02', orders: 1, spent: 490 },
    { id: 'c3', name: 'Coastline Door Co.', email: 'orders@coastlinedoor.example', phone: '(805) 555-0190', type: 'Dealer', status: 'active', city: 'Ventura, CA', since: '2025-07-21', orders: 6, spent: 7421 },
    { id: 'c4', name: 'Marcus Delgado', email: 'm.delgado@example.com', phone: '(559) 555-0133', type: 'Installer', status: 'active', city: 'Fresno, CA', since: '2025-11-05', orders: 1, spent: 743 },
    { id: 'c5', name: 'Hannah Whitfield', email: 'hannah.w@example.com', phone: '(480) 555-0168', type: 'Homeowner', status: 'inactive', city: 'Scottsdale, AZ', since: '2025-06-30', orders: 1, spent: 523 },
    { id: 'c6', name: 'Summit Overhead Door', email: 'purchasing@summitoverhead.example', phone: '(702) 555-0122', type: 'Dealer', status: 'active', city: 'Henderson, NV', since: '2025-08-12', orders: 4, spent: 5212 },
    { id: 'c7', name: 'Elena Fischer', email: 'elena.f@example.com', phone: '(619) 555-0111', type: 'Homeowner', status: 'active', city: 'San Diego, CA', since: '2026-01-19', orders: 1, spent: 699 }
  ];

  var orders = [
    { id: 'TM-10241', customer: 'Jordan Reyes', customerId: 'c1', email: 'jordan.reyes@example.com', date: '2026-02-18', items: [{ id: 'tmgt-24', qty: 1 }], total: 743, shipping: 0, payment: 'paid', fulfillment: 'new', method: 'PayPal (demo)', address: '114 Palm Ave, Camarillo, CA 93010', tracking: '', notes: [] },
    { id: 'TM-10240', customer: 'Coastline Door Co.', customerId: 'c3', email: 'orders@coastlinedoor.example', date: '2026-02-17', items: [{ id: 'tms-12', qty: 6 }, { id: 'tmx-19', qty: 4 }], total: 4484.4, shipping: 0, payment: 'paid', fulfillment: 'processing', method: 'Card (demo)', address: '2200 Harbor Blvd, Ventura, CA 93001', tracking: '', notes: ['Dealer tier pricing applied (demo).'], dealer: true },
    { id: 'TM-10239', customer: 'Elena Fischer', customerId: 'c7', email: 'elena.f@example.com', date: '2026-02-16', items: [{ id: 'tmgt-29', qty: 1 }], total: 699, shipping: 0, payment: 'paid', fulfillment: 'shipped', method: 'Card (demo)', address: '87 Ocean View Dr, San Diego, CA 92109', tracking: '1Z999AA10123456784 (sample)', notes: [] },
    { id: 'TM-10238', customer: 'Marcus Delgado', customerId: 'c4', email: 'm.delgado@example.com', date: '2026-02-14', items: [{ id: 'tmgt-19', qty: 1 }], total: 743, shipping: 0, payment: 'paid', fulfillment: 'completed', method: 'PayPal (demo)', address: '5190 N Blackstone, Fresno, CA 93710', tracking: '9400 1000 0000 0000 0000 00 (sample)', notes: [] },
    { id: 'TM-10237', customer: 'Summit Overhead Door', customerId: 'c6', email: 'purchasing@summitoverhead.example', date: '2026-02-12', items: [{ id: 'tmmrt-19', qty: 3 }, { id: 'tmmrt-12', qty: 2 }], total: 2305.7, shipping: 0, payment: 'invoice', fulfillment: 'processing', method: 'Net-30 invoice (proposed)', address: '400 Eastgate Rd, Henderson, NV 89011', tracking: '', notes: ['Awaiting PO confirmation (demo).'], dealer: true },
    { id: 'TM-10236', customer: 'Priya Natarajan', customerId: 'c2', email: 'priya.n@example.com', date: '2026-02-10', items: [{ id: 'tms-12', qty: 1 }], total: 490, shipping: 0, payment: 'refunded', fulfillment: 'cancelled', method: 'Card (demo)', address: '1200 Riverside Dr, Burbank, CA 91506', tracking: '', notes: ['Customer ordered wrong length; cancelled before shipping (demo).'] },
    { id: 'TM-10235', customer: 'Hannah Whitfield', customerId: 'c5', email: 'hannah.w@example.com', date: '2026-02-08', items: [{ id: 'tml-24', qty: 1 }], total: 523, shipping: 0, payment: 'paid', fulfillment: 'completed', method: 'Card (demo)', address: '7700 E Camelback, Scottsdale, AZ 85251', tracking: '1Z999AA10123456791 (sample)', notes: [] },
    { id: 'TM-10234', customer: 'Jordan Reyes', customerId: 'c1', email: 'jordan.reyes@example.com', date: '2026-02-05', items: [{ id: 'tmx-19', qty: 1 }], total: 523, shipping: 0, payment: 'pending', fulfillment: 'on-hold', method: 'Card (demo)', address: '114 Palm Ave, Camarillo, CA 93010', tracking: '', notes: ['Payment pending provider confirmation (demo).'] },
    { id: 'TM-10233', customer: 'Coastline Door Co.', customerId: 'c3', email: 'orders@coastlinedoor.example', date: '2026-02-01', items: [{ id: 'tmgt-12', qty: 2 }], total: 1287, shipping: 0, payment: 'paid', fulfillment: 'completed', method: 'Card (demo)', address: '2200 Harbor Blvd, Ventura, CA 93001', tracking: '1Z999AA10123456802 (sample)', notes: [], dealer: true },
    { id: 'TM-10232', customer: 'Summit Overhead Door', customerId: 'c6', email: 'purchasing@summitoverhead.example', date: '2026-01-27', items: [{ id: 'tmgt-24', qty: 2 }, { id: 'tml-29', qty: 1 }], total: 1807.7, shipping: 0, payment: 'paid', fulfillment: 'completed', method: 'Card (demo)', address: '400 Eastgate Rd, Henderson, NV 89011', tracking: '1Z999AA10123456815 (sample)', notes: [], dealer: true }
  ];

  var dealers = [
    { id: 'd1', company: 'Coastline Door Co.', contact: 'Renee Alvarez', email: 'orders@coastlinedoor.example', phone: '(805) 555-0190', address: '2200 Harbor Blvd, Ventura, CA 93001', website: 'coastlinedoor.example', status: 'approved', tier: 'Tier 2 — 10% (proposed)', manager: 'Thunder Mounts Sales', applied: '2025-07-15', docs: 'resale-certificate-sample.pdf', notes: ['Approved after resale certificate review (demo).'], orders: ['TM-10240', 'TM-10233'] },
    { id: 'd2', company: 'Summit Overhead Door', contact: 'Tom Okafor', email: 'purchasing@summitoverhead.example', phone: '(702) 555-0122', address: '400 Eastgate Rd, Henderson, NV 89011', website: 'summitoverhead.example', status: 'approved', tier: 'Tier 1 — 15% (proposed)', manager: 'Thunder Mounts Sales', applied: '2025-08-02', docs: 'nv-resale-sample.pdf', notes: [], orders: ['TM-10237', 'TM-10232'] },
    { id: 'd3', company: 'Valley Garage Pros', contact: 'Dana Kim', email: 'dana@valleygaragepros.example', phone: '(661) 555-0149', address: '9100 Rosedale Hwy, Bakersfield, CA 93312', website: 'valleygaragepros.example', status: 'pending', tier: '', manager: '', applied: '2026-02-15', docs: 'ca-seller-permit-sample.pdf', notes: [], orders: [] },
    { id: 'd4', company: 'Desert Door & Gate', contact: 'Luis Herrera', email: 'luis@desertdoorgate.example', phone: '(520) 555-0102', address: '3300 E Speedway, Tucson, AZ 85716', website: '', status: 'pending', tier: '', manager: '', applied: '2026-02-17', docs: '(not uploaded)', notes: ['Requested resale documentation (demo).'], orders: [] },
    { id: 'd5', company: 'QuickFix Handyman LLC', contact: 'Sam Patel', email: 'sam@quickfixhandy.example', phone: '(916) 555-0188', address: '55 J St, Sacramento, CA 95814', website: '', status: 'rejected', tier: '', manager: '', applied: '2026-01-22', docs: '(none)', notes: ['Not a garage door installer; redirected to retail purchase (demo).'], orders: [] }
  ];

  var pages = [
    { id: 'home', title: 'Home', slug: '/', status: 'published', inNav: true, hero: IMG + 'hero-dual-sets.jpg', heading: 'The new installation standard for garage doors and openers.', subheading: 'Thunder Mounts replaces outdated angle iron with engineered mounting systems that deliver Value. Symmetry. Safety. VSS™', ctaText: 'Shop Products', ctaLink: '#/shop', ctaText2: 'Become a Dealer', ctaLink2: '#/dealer/apply', content: '<p>ThunderMounts sets the standard in installation excellence. Our advanced mounting systems for garage doors and openers are designed for today and prepared for tomorrow.</p>', seo: { title: 'Thunder Mounts | Garage Door & Opener Mounting Systems', description: 'Thunder Mounts engineered mounting systems replace angle iron with a clean, symmetrical, safer installation standard for garage doors and openers.', canonical: 'https://www.thundermounts.com/', index: true, ogImage: IMG + 'hero-dual-sets.jpg' }, updated: '2026-02-18' },
    { id: 'about', title: 'About Thunder Mounts', slug: '/about', status: 'published', inNav: true, hero: 'https://static.wixstatic.com/media/424d86_dcb08f843594428ab475269b6036a396~mv2.jpg', heading: 'How Thunder Mounts was created', content: '<p>For years, garage door and opener installations relied on angle iron — a common but outdated choice. Thunder Mounts was created to replace it with a modern, engineered solution tailored for today\'s garages: strong, clean and symmetrical.</p><p><em>Founder story, company history and team photos to be supplied by Thunder Mounts.</em></p>', seo: { title: 'About Thunder Mounts | The VSS™ Installation Standard', description: 'Learn how Thunder Mounts was created and why installers are moving beyond angle iron.', index: true }, updated: '2026-02-10' },
    { id: 'products', title: 'Shop Products', slug: '/shop', status: 'published', inNav: true, heading: 'All Products', content: '<p>Browse opener mounts, track mount sets, openers and doors.</p>', seo: { title: 'Shop Garage Door Mounts & Openers | Thunder Mounts', description: 'Browse TMS, TMX, TML, TMMRT and TMGT mounting systems plus openers and doors.', index: true }, updated: '2026-02-18' },
    { id: 'dealer-program', title: 'Dealer Program', slug: '/dealer', status: 'published', inNav: true, heading: 'Partner with Thunder Mounts', content: '<p>Garage door installers and distributors can apply for a dealer account to access dealer pricing, bulk ordering and order history.</p><p><em>Program terms to be defined by Thunder Mounts.</em></p>', seo: { title: 'Dealer Program | Thunder Mounts', description: 'Apply for a Thunder Mounts dealer account.', index: true }, updated: '2026-02-12' },
    { id: 'resources', title: 'Resources', slug: '/resources', status: 'published', inNav: true, heading: 'Installation guides & resources', content: '<p>Mounting instructions, product guides and articles.</p>', seo: { title: 'Installation Resources | Thunder Mounts', description: 'Mounting instructions and guides for Thunder Mounts products.', index: true }, updated: '2026-02-01' },
    { id: 'contact', title: 'Contact', slug: '/contact', status: 'published', inNav: true, heading: 'Contact Thunder Mounts', content: '<p>Call or text <strong>805-338-6680</strong>. Use the form to send an inquiry.</p>', seo: { title: 'Contact | Thunder Mounts', description: 'Contact Thunder Mounts by phone, text or inquiry form.', index: true }, updated: '2026-01-20' },
    { id: 'faq', title: 'FAQ', slug: '/faq', status: 'published', inNav: false, heading: 'Frequently asked questions', content: '<h3>Are openers included with mounts?</h3><p>No. Mounts are not sold with openers or doors attached.</p><h3>Which length do I need?</h3><p>Mounts are offered in 12, 19, 24 and 29-inch maximum lengths. Measure the distance from the ceiling to the opener or track mounting point. <em>(Guidance to be confirmed by Thunder Mounts.)</em></p>', seo: { title: 'FAQ | Thunder Mounts', description: 'Answers to common questions about Thunder Mounts products.', index: true }, updated: '2026-01-20' },
    { id: 'shipping-returns', title: 'Shipping & Returns', slug: '/shipping-returns', status: 'published', inNav: false, heading: 'Shipping & returns', content: '<p><em>Sample policy text — to be replaced with Thunder Mounts\' actual shipping and return terms.</em></p><p>Orders ship from California. Return requests may be submitted within 30 days of delivery for unused products in original packaging.</p>', seo: { title: 'Shipping & Returns | Thunder Mounts', description: 'Shipping and return policy.', index: true }, updated: '2026-01-20' },
    { id: 'privacy', title: 'Privacy Policy', slug: '/privacy', status: 'published', inNav: false, heading: 'Privacy policy', content: '<p><em>Sample policy text — legal copy to be supplied by Thunder Mounts.</em></p>', seo: { title: 'Privacy Policy | Thunder Mounts', description: 'Privacy policy.', index: false }, updated: '2026-01-20' },
    { id: 'terms', title: 'Terms & Conditions', slug: '/terms', status: 'published', inNav: false, heading: 'Terms & conditions', content: '<p><em>Sample policy text — legal copy to be supplied by Thunder Mounts.</em></p>', seo: { title: 'Terms & Conditions | Thunder Mounts', description: 'Terms and conditions.', index: false }, updated: '2026-01-20' },
    { id: 'warranty', title: 'Warranty (draft)', slug: '/warranty', status: 'draft', inNav: false, heading: 'Product warranty', content: '<p>Draft page — warranty terms pending.</p>', seo: { title: 'Warranty | Thunder Mounts', description: '', index: false }, updated: '2026-02-16' }
  ];

  var navigation = [
    { id: 'n1', label: 'Shop Products', href: '#/shop', location: 'header', enabled: true, children: [
      { id: 'n1a', label: 'Opener Mounts', href: '#/shop?cat=opener-mounts', enabled: true },
      { id: 'n1b', label: 'Marantec Mounts', href: '#/shop?cat=marantec-mounts', enabled: true },
      { id: 'n1c', label: 'Track Mount Sets', href: '#/shop?cat=track-mounts', enabled: true },
      { id: 'n1d', label: 'Garage Door Openers', href: '#/shop?cat=openers', enabled: true },
      { id: 'n1e', label: 'Garage Doors', href: '#/shop?cat=doors', enabled: true }
    ] },
    { id: 'n2', label: 'Dealer Program', href: '#/dealer', location: 'header', enabled: true, children: [] },
    { id: 'n3', label: 'About', href: '#/about', location: 'header', enabled: true, children: [] },
    { id: 'n4', label: 'Resources', href: '#/resources', location: 'header', enabled: true, children: [] },
    { id: 'n5', label: 'Contact', href: '#/contact', location: 'header', enabled: true, children: [] },
    { id: 'n6', label: 'FAQ', href: '#/page/faq', location: 'footer', enabled: true, children: [] },
    { id: 'n7', label: 'Shipping & Returns', href: '#/page/shipping-returns', location: 'footer', enabled: true, children: [] },
    { id: 'n8', label: 'Privacy Policy', href: '#/page/privacy', location: 'footer', enabled: true, children: [] },
    { id: 'n9', label: 'Terms & Conditions', href: '#/page/terms', location: 'footer', enabled: true, children: [] }
  ];

  var blog = [
    { id: 'b1', title: 'Angle Iron vs. Engineered Mounts: What Changes Inside the Garage', slug: 'angle-iron-vs-engineered-mounts', author: 'Thunder Mounts', category: 'Product Comparison', tags: ['angle iron', 'installation', 'VSS'], status: 'published', date: '2026-02-05', image: IMG + 'after.jpg', excerpt: 'A side-by-side look at the traditional angle-iron method and a symmetrical engineered mount — and why the difference is easy to see.', content: '<p><em>Proposed sample article — not an existing Thunder Mounts publication.</em></p><p>For decades, perforated angle iron has been the default way to hang garage door openers. It works, but it was never designed for the job. This article compares the two approaches in terms of appearance, rigidity and installation time.</p>', related: ['tms-12', 'tmgt-12'], seo: { title: 'Angle Iron vs. Engineered Garage Door Opener Mounts', description: 'Compare traditional angle iron with Thunder Mounts engineered mounting systems.' } },
    { id: 'b2', title: 'Preparing Your Garage for an Opener Mount Installation', slug: 'preparing-for-installation', author: 'Thunder Mounts', category: 'Installation', tags: ['installation', 'preparation'], status: 'published', date: '2026-01-22', image: IMG + 'hero-dual-sets.jpg', excerpt: 'A simple checklist of measurements, tools and ceiling considerations before you install.', content: '<p><em>Proposed sample article — not an existing Thunder Mounts publication.</em></p><p>Before installation day, confirm your ceiling height, locate framing members, and measure from the ceiling to the opener mounting flange to select the right maximum length (12, 19, 24 or 29 inches).</p>', related: ['tml-24', 'tml-29'], seo: { title: 'How to Prepare for a Garage Door Opener Mount Installation', description: 'Measurements, tools and ceiling checks before installing Thunder Mounts.' } },
    { id: 'b3', title: 'Choosing the Right Mount Length: 12, 19, 24 or 29 Inches', slug: 'choosing-mount-length', author: 'Thunder Mounts', category: 'Buying Guide', tags: ['sizing', 'TMS', 'TML'], status: 'published', date: '2026-01-10', image: IMG + 'tm-mount-1.jpg', excerpt: 'How ceiling height and opener position determine which Thunder Mounts model fits your garage.', content: '<p><em>Proposed sample article — not an existing Thunder Mounts publication.</em></p><p>Thunder Mounts are offered in four maximum lengths. This guide walks through how to measure and which series fits each scenario.</p>', related: ['tms-12', 'tmx-19', 'tml-24', 'tml-29'], seo: { title: 'Which Thunder Mount Length Do I Need?', description: 'A sizing guide for TMS, TMX and TML opener mounts.' } },
    { id: 'b4', title: 'Garage Organization Ideas That Start at the Ceiling', slug: 'garage-organization-ceiling', author: 'Thunder Mounts', category: 'Garage Organization', tags: ['organization', 'design'], status: 'draft', date: '', image: 'https://static.wixstatic.com/media/424d86_dcb08f843594428ab475269b6036a396~mv2.jpg', excerpt: 'A clean, symmetrical opener installation sets the tone for an organized, showroom-quality garage.', content: '<p><em>Draft — proposed sample article.</em></p><p>Outline: lighting, ceiling storage, cable management, and finishing touches like Thunder Lights.</p>', related: ['thunder-lights'], seo: { title: '', description: '' } }
  ];

  var gallery = [
    { id: 'g1', file: 'after-thunder-mounts.jpg', src: IMG + 'after.jpg', category: 'before-after', caption: 'After — Thunder Mounts installed', alt: 'Garage ceiling with symmetrical black Thunder Mounts supporting the opener and track', featured: true },
    { id: 'g2', file: 'before-angle-iron.jpg', src: IMG + 'before.jpg', category: 'before-after', caption: 'Before — conventional angle iron', alt: 'Garage ceiling with perforated angle iron supporting an opener', featured: false },
    { id: 'g3', file: 'dual-sets-white-garage.jpg', src: IMG + 'hero-dual-sets.jpg', category: 'projects', caption: 'Dual sets in a finished white garage', alt: 'Bright white garage ceiling with two Thunder Mounts sets', featured: true },
    { id: 'g4', file: 'thunder-mounts-set.jpg', src: 'https://static.wixstatic.com/media/424d86_dcb08f843594428ab475269b6036a396~mv2.jpg', category: 'projects', caption: 'Thunder Mounts set installed', alt: 'Thunder Mounts set installed on a garage ceiling', featured: false },
    { id: 'g5', file: 'tms-series.jpg', src: IMG + 'tm-mount-1.jpg', category: 'products', caption: 'TMS / TMX / TML series', alt: 'Thunder Mounts opener mount product photo', featured: false },
    { id: 'g6', file: 'tmgt-track-set.jpg', src: IMG + 'tmgt-1.jpg', category: 'products', caption: 'TMGT track mount set', alt: 'TMGT track mount set product photo', featured: false },
    { id: 'g7', file: 'tmgt-chrome-ring.jpg', src: 'https://static.wixstatic.com/media/424d86_f452ae18e27842b6ac4a6864c09bb7fdf002.jpg', category: 'products', caption: 'TMGT with chrome ring', alt: 'TMGT mount with chrome finishing ring', featured: false },
    { id: 'g8', file: 'tmmrt-marantec.jpg', src: 'https://static.wixstatic.com/media/424d86_63007af6d4d74b33888cee384f3ba24c~mv2.jpg', category: 'products', caption: 'TMMRT Marantec mount', alt: 'TMMRT mount for Marantec openers', featured: false },
    { id: 'g9', file: 'tmgt-installed.jpg', src: 'https://static.wixstatic.com/media/424d86_3e984c2f7e47496380359795b1abbd96~mv2.jpg', category: 'projects', caption: 'TMGT set, installed view', alt: 'TMGT track mount installed in a garage', featured: false },
    { id: 'g10', file: 'tml-29.jpg', src: IMG + 'tml-29.jpg', category: 'products', caption: 'TML-29', alt: 'TML-29 opener mount', featured: false }
  ];

  var reviews = [
    { id: 'r1', name: 'Jordan R.', rating: 5, product: 'tmgt-24', text: 'The symmetry is the first thing you notice. Our garage looks finished instead of improvised. Install took about an hour.', status: 'approved', featured: true, date: '2026-02-20' },
    { id: 'r2', name: 'Coastline Door Co.', rating: 5, product: 'tms-12', text: 'We switched our crews to Thunder Mounts for new installs. Consistent results on every job and customers comment on the clean look.', status: 'approved', featured: true, date: '2026-02-11' },
    { id: 'r3', name: 'Marcus D.', rating: 4, product: 'tmgt-19', text: 'Solid hardware and clear instructions. Would like to see a sizing chart on the product page.', status: 'approved', featured: true, date: '2026-02-15' },
    { id: 'r4', name: 'Elena F.', rating: 5, product: 'tmgt-29', text: 'Exactly what the pictures show. Powder coat finish matches the track hardware perfectly.', status: 'pending', featured: false, date: '2026-02-19' },
    { id: 'r5', name: 'Anonymous', rating: 2, product: 'tml-24', text: 'Shipping box was damaged on arrival (product fine).', status: 'pending', featured: false, date: '2026-02-18' },
    { id: 'r6', name: 'Hannah W.', rating: 5, product: 'tml-24', text: 'Replaced rusty angle iron in a 1970s garage. Night and day difference.', status: 'hidden', featured: false, date: '2026-01-30' }
  ];

  var settings = {
    brand: { name: 'Thunder Mounts', tagline: 'Value. Symmetry. Safety. VSS™', logo: 'https://static.wixstatic.com/media/424d86_b9b306c6a9dc47539b15a600c0a59ba9~mv2.jpg/v1/crop/x_0,y_323,w_1536,h_379/fill/w_705,h_173,al_c,q_80/a_digital_vector_vector_logo_features_th.jpg', favicon: 'https://static.wixstatic.com/media/424d86_b9b306c6a9dc47539b15a600c0a59ba9~mv2.jpg', primary: '#C82026', dark: '#181818', font: 'Inter' },
    contact: { phone: '805-338-6680', email: 'info@thundermounts.com (to confirm)', address: 'California, USA (address to confirm)', hours: 'Mon–Fri 8am–5pm PT (to confirm)' },
    social: { facebook: '', instagram: '', youtube: '', linkedin: '' },
    header: { announcement: 'Dealer program now accepting applications — apply online in minutes.', showAnnouncement: true, showPhone: true, sticky: true },
    footer: { text: '© ' + new Date().getFullYear() + ' Thunder Mounts Garage Systems. All rights reserved.', showNewsletter: true },
    seo: { siteTitle: 'Thunder Mounts | Garage Door & Opener Mounting Systems', titleTemplate: '%s | Thunder Mounts', description: 'Engineered mounting systems for garage doors and openers. Value. Symmetry. Safety.', ogImage: IMG + 'hero-dual-sets.jpg', robots: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dealer/account/\nSitemap: https://www.thundermounts.com/sitemap.xml', structuredData: { organization: true, product: true, breadcrumb: true, article: true, faq: false, localBusiness: false }, breadcrumbs: true },
    redirects: [
      { from: '/category/all-products', to: '/shop', type: 301 },
      { from: '/product-page/tms-12', to: '/products/tms-12', type: 301 },
      { from: '/howthundermountwascreated', to: '/about', type: 301 },
      { from: '/mounting-instructions', to: '/resources/installation', type: 301 }
    ],
    cookie: { enabled: true, text: 'We use cookies to improve your experience and analyze traffic.', position: 'bottom' },
    analytics: { ga4: '', gsc: '', merchant: '' },
    notifications: { newOrder: true, paymentUpdate: true, dealerApplication: true, dealerApproval: true, contactInquiry: true, lowInventory: true, fulfillment: true, passwordRecovery: true, lowStockThreshold: 5, adminEmail: 'orders@thundermounts.com (to confirm)' },
    smtp: { host: 'smtp.example-provider.com', port: 587, user: 'notifications@thundermounts.com', secure: 'STARTTLS', from: 'Thunder Mounts <no-reply@thundermounts.com>' },
    integrations: { paypal: 'proposed', stripe: 'proposed', shipping: 'proposed', ga4: 'proposed', gsc: 'proposed', merchant: 'optional', email: 'optional' }
  };

  var activity = [
    { t: '09:42', text: 'Order <strong>TM-10241</strong> placed by Jordan Reyes (PayPal demo).' },
    { t: '09:15', text: 'Dealer application received from <strong>Desert Door & Gate</strong>.' },
    { t: '08:50', text: 'Admin updated SEO title on <strong>TMGT-12</strong>.' },
    { t: 'Yesterday', text: 'Order <strong>TM-10239</strong> marked shipped; tracking added.' },
    { t: 'Yesterday', text: 'Blog draft “Garage Organization Ideas” saved.' },
    { t: 'Feb 16', text: 'Review from Elena F. awaiting moderation.' }
  ];

  var salesTrend = [
    { m: 'Mar', v: 5100 }, { m: 'Apr', v: 6400 }, { m: 'May', v: 5900 }, { m: 'Jun', v: 7200 }, { m: 'Jul', v: 8100 }, { m: 'Aug', v: 7600 },
    { m: 'Sep', v: 8900 }, { m: 'Oct', v: 9400 }, { m: 'Nov', v: 10200 }, { m: 'Dec', v: 8800 }, { m: 'Jan', v: 9700 }, { m: 'Feb', v: 11300 }
  ];

  var SEED = { version: 1, categories: categories, products: products, customers: customers, orders: orders, dealers: dealers, pages: pages, navigation: navigation, blog: blog, gallery: gallery, reviews: reviews, settings: settings, activity: activity, salesTrend: salesTrend };

  // ---------------- state store ----------------
  var state = null;
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (raw) { var parsed = JSON.parse(raw); if (parsed && parsed.version === SEED.version) { state = parsed; return state; } }
    } catch (e) { /* ignore */ }
    state = clone(SEED);
    return state;
  }
  function save() { try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or disabled */ } }
  function reset() { state = clone(SEED); save(); }

  var DB = {
    load: load, save: save, reset: reset, seed: SEED, money: money, IMG: IMG,
    get: function (k) { return load()[k]; },
    product: function (id) { return load().products.filter(function (p) { return p.id === id; })[0]; },
    category: function (id) { return load().categories.filter(function (c) { return c.id === id; })[0]; },
    page: function (id) { return load().pages.filter(function (p) { return p.id === id; })[0]; },
    uid: function (prefix) { return (prefix || 'id') + '-' + Math.random().toString(36).slice(2, 8); },
    slugify: function (s) { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); },
    availabilityLabel: function (p) {
      var map = { 'in-stock': ['In stock', 'stock-in'], 'low-stock': ['Low stock', 'stock-low'], 'out-of-stock': ['Out of stock', 'stock-out'], 'pre-order': ['Coming soon', 'stock-pre'], 'quote': ['Request a quote', 'stock-pre'] };
      return map[p.availability] || map['in-stock'];
    },
    effectivePrice: function (p) { return (p.salePrice && p.salePrice < p.price) ? p.salePrice : p.price; }
  };

  global.TM = global.TM || {};
  global.TM.db = DB;
})(window);
