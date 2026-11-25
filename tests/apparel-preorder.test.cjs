const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const context = vm.createContext({ Intl, queueMicrotask });
const config = read("js/config/commerce.js").replace(/^export /gm, "");
const moduleCode = read("js/lib/apparel-preorder.js").replace(/^import .*;$/gm, "").replace(/^export /gm, "");
vm.runInContext(config + "\n" + moduleCode + "\nthis.products = apparel;", context);
const page = read("shop/apparel/index.html");

test("every approved price matches the static, no-JavaScript product choices and per-piece amounts", () => {
  const prices = { "pt-heavy-tee": 69, "pt-crop-tee": 65, "pt-hoodie": 129, "pt-crop-hoodie": 109 };
  assert.equal(context.products.length, Object.keys(prices).length);
  for (const product of context.products) {
    const price = prices[product.id];
    assert.equal(product.priceCents, price * 100);
    assert.match(page, new RegExp('<option value="' + product.id + '">[^<]*AUD \\$' + price + '</option>'));
    assert.match(page, new RegExp('class="piece-price">AUD \\$' + price + ' each</p>'));
    assert.ok(page.includes('data-piece="' + product.id + '"'));
    assert.equal(context.apparelQuote(product.id, 3).subtotal, price * 3);
    if (product.id.startsWith("pt-crop")) assert.equal(product.image, null);
    else assert.ok(existsSync(path.join(root, product.image)));
  }
});

test("unknown pieces and unsafe or invalid quantities cannot generate submitted prices", () => {
  assert.equal(context.apparelQuote("wrong", 1), null);
  for (const units of ["", 0, -1, 1.5, "text", Infinity, Number.MAX_SAFE_INTEGER]) {
    assert.equal(context.apparelQuote("pt-heavy-tee", units), null);
  }
});

test("selection, quantity and reset update both the displayed subtotal and the request fields", async () => {
  const listeners = {};
  const quantity = { value: "2", setCustomValidity(message) { this.message = message; } };
  const product = { value: "pt-crop-hoodie" };
  const elements = { product, quantity, unit_price_aud: {}, subtotal_aud: {} };
  const output = {};
  const form = {
    elements, querySelector: () => output,
    addEventListener(event, listener) { listeners[event] = listener; },
  };
  context.initApparelRequest(form);
  assert.match(output.textContent, /AUD \$218/);
  assert.equal(elements.subtotal_aud.value, "218.00");
  assert.equal(elements.unit_price_aud.value, "109.00");
  product.value = "pt-heavy-tee";
  listeners.change();
  assert.equal(elements.subtotal_aud.value, "138.00");
  quantity.value = "0.5";
  listeners.input();
  assert.ok(quantity.message);
  assert.equal(elements.subtotal_aud.disabled, true);
  assert.equal(elements.subtotal_aud.value, "");
  quantity.value = "1";
  listeners.submit();
  assert.equal(quantity.message, "");
  assert.equal(elements.subtotal_aud.disabled, false);
  assert.equal(elements.subtotal_aud.value, "69.00");
  listeners.reset();
  product.value = "";
  await Promise.resolve();
  assert.equal(elements.subtotal_aud.disabled, true);
  assert.equal(elements.unit_price_aud.value, "");
});
