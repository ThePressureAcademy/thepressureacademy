const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const src = readFileSync(join(__dirname, '../js/lib/cart.js'), 'utf8')
  .replace(/^import .*;$/gm, '').replace(/^export /gm, '');

test('request-only headers expose saved items only while the visitor has entries', () => {
  const label = {};
  const button = { querySelector: () => label, setAttribute(key, value) { this[key] = value; } };
  let stored = null;
  const checkout = { provider: 'none', cartStorageKey: 'test-cart' };
  const context = {
    checkout,
    localStorage: { getItem: () => stored, setItem: (_, value) => { stored = value; } },
    document: { querySelectorAll: selector => selector === '[data-cart-open]' ? [button] : [] },
  };
  vm.runInNewContext(src + '\nthis.refresh = renderCount; this.remove = removeItem;', context);
  context.refresh();
  assert.equal(button.hidden, true);
  stored = JSON.stringify({ items: [{ id: 'previous-piece', qty: 1 }] });
  context.refresh();
  assert.equal(button.hidden, false);
  assert.equal(label.textContent, 'Saved items');
  context.remove(0);
  assert.equal(button.hidden, true);
  checkout.provider = 'test-provider';
  context.refresh();
  assert.equal(button.hidden, false);
  assert.equal(label.textContent, 'Cart');
});
