const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const scripts = ["js/config/commerce.js", "js/lib/tatami-preorders.js", "js/lib/academy-quote.js"]
  .map(file => readFileSync(path.join(root, file), "utf8").replace(/^import .*;$/gm, "").replace(/^export /gm, ""))
  .join("\n");

function loadQuote(search) {
  const events = {};
  const order = {
    value: "",
    options: ["", "mat-fitout", "team-apparel", "both", "other"].map(value => ({ value })),
    addEventListener: (name, fn) => { events[name] = fn; },
  };
  const fields = { order_type: order, floor_dimensions: { value: "" }, mat_quantity: { value: "" } };
  const scopes = { "#floor-scope": {}, "#kit-scope": {} };
  const form = {
    elements: fields,
    querySelector: selector => scopes[selector],
    addEventListener: (name, fn) => { events[name] = fn; },
  };
  const env = vm.createContext({ form, URLSearchParams, location: { search }, document: { querySelectorAll: () => [] }, queueMicrotask });
  vm.runInContext(scripts + "\ninitAcademyQuote(form);", env);
  return { fields, scopes, events };
}

test("a floor estimate carries the actual dimensions and minimum-adjusted quantity into the club enquiry", () => {
  const { fields, scopes, events } = loadQuote("?type=mat-fitout&width_m=3&length_m=3");
  assert.equal(fields.floor_dimensions.value, "3 × 3 m");
  assert.equal(fields.mat_quantity.value, "10");
  assert.equal(scopes["#kit-scope"].disabled, true);
  assert.equal(scopes["#floor-scope"].hidden, false);
  fields.order_type.value = "team-apparel";
  events.change();
  assert.equal(scopes["#floor-scope"].disabled, true);
  assert.equal(scopes["#kit-scope"].hidden, false);
  fields.order_type.value = "both";
  events.change();
  assert.equal(scopes["#floor-scope"].disabled, false);
  assert.equal(scopes["#kit-scope"].disabled, false);
});

test("unsupported estimates never prefill club order details", () => {
  for (const search of ["?type=mat-fitout&width_m=-5&length_m=6", "?type=unknown&width_m=5&length_m=6"]) {
    const { fields } = loadQuote(search);
    assert.equal(fields.mat_quantity.value, "");
    assert.equal(fields.floor_dimensions.value, "");
  }
});

test("the academy handoff preserves a share code and only a catalogue spare colour, keeping quote-only details separate", () => {
  const moneyScripts = ["js/config/commerce.js", "js/lib/mat-quote-mix.js"]
    .map(file => readFileSync(path.join(root, file), "utf8").replace(/^import .*;$/gm, "").replace(/^export /gm, ""))
    .join("\n");
  const model = vm.createContext({ URLSearchParams });
  vm.runInContext(moneyScripts, model);
  const colours = { "Rust Orange": 2, "Night Grey": 6 };
  assert.equal(model.chooseSpareColour(colours, "unlisted"), "Night Grey");
  assert.equal(model.chooseSpareColour(colours, "Ruby Red"), "Ruby Red");
  assert.equal(model.orderColourMix(colours, 2, "Ruby Red"), "2 × Ruby Red, 2 × Rust Orange, 6 × Night Grey");
  assert.equal(model.orderColourMix(colours, 0, "Ruby Red"), "2 × Rust Orange, 6 × Night Grey");
  const url = new URL(model.academyPlanLink("1H0GQUFCqu7AAAKUFAA", "Ruby Red", true), "https://example.com");
  assert.deepEqual(Object.fromEntries(url.searchParams), { type: "both", plan: "1H0GQUFCqu7AAAKUFAA", extra: "Ruby Red", specs: "1" });
  assert.equal(url.hash, "#order-enquiry");
  assert.equal(model.academyPlanLink("abc", "unlisted"), "/academy-orders/?type=both&plan=abc#order-enquiry");
});
