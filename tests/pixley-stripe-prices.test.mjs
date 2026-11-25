import assert from "node:assert/strict";
import test from "node:test";
import { PIXLEY_ADDONS } from "../js/config/pixley-collab.mjs";
import { loadPixleyStripePrices } from "../scripts/lib/pixley-stripe-prices.mjs";

const [tee, rashguard] = PIXLEY_ADDONS;
function stripePrice(addon, overrides = {}) {
  return {
    object: "price", id: "price_" + addon.id, lookup_key: addon.lookupKey,
    active: true, type: "one_time", billing_scheme: "per_unit", currency: "aud",
    unit_amount: addon.priceCents, unit_amount_decimal: addon.priceCents + ".0000", ...overrides,
  };
}
function response(data, fields = {}) {
  return { ok: true, json: async () => ({ object: "list", has_more: false, data, ...fields }) };
}

test("matches the published prices by their exact lookup keys in one read-only request", async () => {
  let requests = 0;
  const prices = await loadPixleyStripePrices({
    secretKey: "test-credential",
    fetchImpl: async (input, options) => {
      requests++;
      const url = new URL(input);
      assert.equal(url.origin + url.pathname, "https://api.stripe.com/v1/prices");
      assert.deepEqual(url.searchParams.getAll("lookup_keys[]"), [tee.lookupKey, rashguard.lookupKey]);
      assert.equal(url.searchParams.get("currency"), "aud");
      assert.equal(url.searchParams.get("active"), "true");
      assert.equal(url.searchParams.get("type"), "one_time");
      assert.equal(options.method, "GET");
      assert.equal(options.headers.Authorization, "Bearer test-credential");
      return response([stripePrice(rashguard), stripePrice(tee)]);
    },
  });
  assert.equal(requests, 1);
  assert.deepEqual(prices, {
    tee: { id: "price_tee", priceCents: 6900 },
    rashguard: { id: "price_rashguard", priceCents: 7900 },
  });
});

test("a missing, ambiguous or incompatible item cannot be added at another price", async () => {
  const invalid = [
    [], [stripePrice(tee), stripePrice(tee)],
    ...[
      { active: false }, { id: "prod_unexpected" }, { currency: "usd" }, { type: "recurring" },
      { lookup_key: "unrelated" }, { billing_scheme: "tiered" }, { unit_amount: 7900 },
      { custom_unit_amount: { enabled: true } }, { transform_quantity: { divide_by: 2 } },
      { unit_amount_decimal: "6900.000000000001" },
    ].map((override) => [stripePrice(tee, override)]),
  ];
  for (const candidates of invalid) {
    const prices = await loadPixleyStripePrices({
      secretKey: "test-credential",
      fetchImpl: async () => response([...candidates, stripePrice(rashguard)]),
    });
    assert.equal(prices.tee, null);
    assert.deepEqual(prices.rashguard, { id: "price_rashguard", priceCents: 7900 });
  }
});

test("credentials and a successful complete provider response are required", async () => {
  await assert.rejects(loadPixleyStripePrices({
    secretKey: "", fetchImpl: assert.fail,
  }), /credentials/);
  for (const [reply, expected] of [
    [{ ok: false, status: 403 }, /HTTP 403/],
    [response(null), /complete price list/],
    [response([], { has_more: true }), /complete price list/],
  ]) {
    await assert.rejects(loadPixleyStripePrices({
      secretKey: "test-credential", fetchImpl: async () => reply,
    }), expected);
  }
});
