// Dependency-free check for the static Pages package and seed image references.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const context = { window: {}, localStorage: { getItem: () => null, setItem: () => {} } };
vm.runInNewContext(fs.readFileSync(path.join(root, 'demo/js/data.js'), 'utf8'), context);
let images = 0;
function inspect(value) {
  if (Array.isArray(value)) return value.forEach(inspect);
  if (value && typeof value === 'object') return Object.values(value).forEach(inspect);
  if (typeof value !== 'string' || !value.startsWith('assets/img/')) return;
  assert.ok(fs.existsSync(path.join(root, 'demo', value)), `Missing seed asset: ${value}`);
  images++;
}
inspect(context.window.TM.db.seed);
for (const entry of ['index.html', 'demo/index.html', 'demo/admin.html', 'presentation/index.html']) {
  const html = fs.readFileSync(path.join(root, entry), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:)/.test(url)) continue;
    assert.ok(fs.existsSync(path.resolve(root, path.dirname(entry), url)), `${entry}: missing ${url}`);
  }
}
console.log(`PASS: ${images} local seed image references and all four HTML entry-point links exist.`);
