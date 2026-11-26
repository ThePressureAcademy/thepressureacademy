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

test("size enquiries accept reference-garment measurements for any selected cut without making them mandatory", () => {
  const form = page.match(/<form\b[^>]*id="apparel-preorder"[\s\S]*?<\/form>/)[0];
  for (const name of ["reference_chest_width_cm", "reference_body_length_cm"]) {
    const input = form.match(new RegExp('<input[^>]*name="' + name + '"[^>]*>'))[0];
    assert.match(input, /type="number"/);
    assert.match(input, /min="0\.1"/);
    assert.doesNotMatch(input, /\brequired\b/);
  }
  assert.match(form, /name="measurements_requested" value="yes"/);
});

test("the lookbook accepts a separately identified email-only release notification", () => {
  const lookbook = read("shop/apparel/drops/index.html");
  const form = lookbook.match(/<form\b[^>]*id="next-release-form"[\s\S]*?<\/form>/)[0];
  assert.match(form, /action="https:\/\/formspree.io\/f\/meerjgde" method="POST"/);
  assert.match(form, /name="intent" value="pressure-tested-release-alert"/);
  assert.match(form, /name="source" value="apparel-lookbook"/);
  assert.match(form, /type="email" name="email"[^>]*required/);
  assert.doesNotMatch(form, /name="(?:quantity|product|size|name)"/);
  assert.ok(lookbook.indexOf(form) > lookbook.indexOf('id="view-l"'));
});

test("the three cut-specific flat-garment guides match the Pressure Tested size references", () => {
  const expected = {
    "tee": [
      "XXS 49 64 45 20", "XS 51 66 47 21", "S 53 68 49 22", "M 55 70 51 23",
      "L 58 72 53 24", "XL 61 74 55 25", "2XL 64 76 57 26",
    ],
    "hoodie": [
      "XS 57 66 52 58", "S 59 68 54 59", "M 61 70 56 60", "L 63 72 58 61",
      "XL 66 74 60 62", "2XL 69 76 62 63", "3XL 72 78 64 64",
    ],
    "crop-hoodie": [
      "XXS 4–6 50 51 48 55", "XS 6–8 52 53 50 56", "S 8–10 54 55 52 57", "M 10–12 56 57 54 58",
      "L 12–14 59 59 56 59", "XL 14–16 62 61 58 60", "2XL 16–18 65 63 60 61",
    ],
  };
  for (const [cut, rows] of Object.entries(expected)) {
    const body = page.match(new RegExp('<table id="' + cut + '-size-chart">[\\s\\S]*?<tbody>([\\s\\S]*?)</tbody>'))[1];
    const actual = [...body.matchAll(/<tr>(.*?)<\/tr>/g)].map(([, row]) =>
      [...row.matchAll(/<(?:th scope="row"|td)>(.*?)<\/(?:th|td)>/g)].map(([, cell]) => cell).join(" "));
    assert.deepEqual(actual, rows, cut);
  }
});
