const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const config = fs.readFileSync(path.join(root, "js/config/commerce.js"), "utf8");
const logic = fs.readFileSync(path.join(root, "js/lib/tatami-preorders.js"), "utf8");
const page = fs.readFileSync(path.join(root, "shop/mats/index.html"), "utf8");
const context = vm.createContext({});
vm.runInContext(config.replace(/^export /gm, "") + "\n" + logic.replace(/^import .*?;$/gm, "").replace(/^export /gm, ""), context);

test("minimum mat order and individual increments price in AUD before freight", () => {
  assert.deepEqual({ ...context.matSubtotal(10) }, { area: 20, cents: 138000 });
  assert.deepEqual({ ...context.matSubtotal(11) }, { area: 22, cents: 151800 });
  for (const quantity of [9, 10.5, -2, NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
    assert.equal(context.matSubtotal(quantity), null);
  }
});

test("floor estimator distinguishes requested coverage from the minimum order", () => {
  assert.deepEqual({ ...context.estimateMatFloor(5, 4) }, { area: 20, count: 10, orderQuantity: 10 });
  assert.deepEqual({ ...context.estimateMatFloor(3, 5) }, { area: 15, count: 8, orderQuantity: 10 });
  assert.deepEqual({ ...context.estimateMatFloor(3.5, 6) }, { area: 21, count: 11, orderQuantity: 11 });
  assert.deepEqual({ ...context.estimateMatFloor(0.28, 100) }, { area: 28, count: 14, orderQuantity: 14 });
  for (const bad of [-1, 0, NaN, Infinity, 1001]) assert.equal(context.estimateMatFloor(4, bad), null);
});

test("native mat request keeps the confirmed offer, minimum and destination without JavaScript", () => {
  const form = page.match(/<form[^>]*id="mat-request"[\s\S]*?<\/form>/)[0];
  assert.match(form, /action="https:\/\/formspree.io\/f\/meerjgde" method="POST"/);
  assert.match(form, /name="quantity"[^>]*min="10"[^>]*step="1"[^>]*required/);
  assert.match(form, /name="country"[^>]*required/);
  assert.match(form, /name="city"[^>]*required/);
  assert.doesNotMatch(form, /name="postal_code"[^>]*required/);
  for (const [name, value] of Object.entries({ intent: "mat-enquiry", source: "shop-mats", request_type: "tatami-preorder", currency: "AUD", unit_price: "138" })) {
    assert.ok(form.includes(`name="${name}" value="${value}"`));
  }
  assert.match(page, /AUD \$1,380 before freight/);
});

test("the native request sends the catalogue mat colour or a separate custom enquiry", () => {
  const colours = ["Ruby Red", "Matte White", "Jet Black", "Rust Orange", "Night Grey"];
  assert.deepEqual(Array.from(vm.runInContext("tatamiMat.colours", context)), colours);
  const form = page.match(/<form[^>]*id="mat-request"[\s\S]*?<\/form>/)[0];
  const choices = [...form.matchAll(/type="radio" name="mat_colour" value="([^"]+)" required/g)];
  assert.deepEqual(choices.map(choice => choice[1]), [...colours, "Other colour enquiry"]);
  assert.match(form, /name="requested_colour"/);
  assert.match(form, /<a href="\/contact\/">contact us<\/a>/);
});
