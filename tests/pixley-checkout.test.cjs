const { test } = require("node:test");
const assert = require("node:assert/strict");

const input = Object.freeze({ bookingRef: "TEST-1", session: "day1", people: 1, email: "buyer@example.com" });
const checkoutUrl = "https://checkout.stripe.com/c/pay/test";
const conf = { secretKey: "rk_test_Example", accountId: "acct_Academy" };
const reference = "michael-pixley-march-2027:TEST-1";
const priceRows = [
  ["tee", 6900],
  ["rashguard", 7900],
].map(([id, cents]) => ({
  id: "price_" + id, object: "price", type: "one_time", active: true, currency: "aud",
  lookup_key: "pixley_2027_" + id + "_aud", unit_amount: cents, billing_scheme: "per_unit",
}));
const previousSession = {
  id: "cs_previous", client_reference_id: reference, customer_email: input.email,
  status: "open", payment_status: "unpaid", url: checkoutUrl,
  metadata: { event: "michael-pixley-march-2027", people: "1", session: "day1" },
};

async function harness({ pages = [], prices = priceRows, merchant = "acct_Academy", live = false, enabled = true } = {}) {
  const { issueCheckout } = await import("../scripts/pixley-checkout.mjs");
  const posts = [];
  const paths = [];
  let next = 0;
  async function fetchImpl(url, options) {
    const { pathname } = new URL(url);
    paths.push(pathname);
    let response;
    if (pathname === "/v1/account") response = { id: merchant, charges_enabled: enabled };
    else if (pathname === "/v1/prices") response = { data: prices };
    else if (pathname === "/v1/checkout/sessions" && options.method === "GET") {
      if (next > 0) assert.ok(new URL(url).searchParams.has("starting_after"));
      response = pages[next++] ?? { data: [], has_more: false };
    } else if (pathname === "/v1/checkout/sessions" && options.method === "POST") {
      posts.push(options);
      response = { id: "cs_created", status: "open", livemode: live, url: checkoutUrl };
    } else assert.fail("Unexpected merchant request");
    return { ok: true, json: () => response };
  }
  return {
    run: (booking = input, config = {}) => issueCheckout(booking, { ...conf, fetchImpl, ...config }),
    paths, posts,
  };
}

test("Stripe Checkout charges the chosen admission once and offers two independently removable additions", async () => {
  for (const [session, people, expectedCents, quantity] of [
    ["day1", 1, 15000, 1], ["day2", 20, 15000, 20], ["both", 2, 30000, 2], ["group", 6, 100000, 1],
  ]) {
    const { run, posts } = await harness();
    assert.equal(await run({ ...input, session, people }), checkoutUrl);
    const { body, headers } = posts[0];
    assert.equal(body.get("line_items[0][price_data][unit_amount]"), String(expectedCents));
    assert.equal(body.get("line_items[0][quantity]"), String(quantity));
    assert.equal(body.get("line_items[0][price_data][currency]"), "aud");
    assert.equal(body.get("adaptive_pricing[enabled]"), "false");
    assert.equal(body.get("client_reference_id"), reference);
    assert.equal(body.get("customer_email"), input.email);
    assert.equal(body.get("metadata[people]"), String(people));
    assert.equal(body.get("metadata[session]"), session);
    assert.equal(body.has("line_items[1][quantity]"), false);
    assert.equal(body.has("payment_method_types[]"), false);
    assert.equal(body.get("custom_fields[0][optional]"), "true");
    assert.match(body.get("success_url"), /#payment-return$/);
    assert.equal(headers["Idempotency-Key"], reference + ":first");
    for (const [i, style] of ["tee", "rashguard"].entries()) {
      assert.equal(body.get(`optional_items[${i}][price]`), "price_" + style);
      assert.equal(body.get(`optional_items[${i}][quantity]`), "1");
      assert.equal(body.get(`optional_items[${i}][adjustable_quantity][maximum]`), "99");
    }
  }
});

test("invalid bookings, unintended live credentials and incorrect merchant cannot issue a link", async () => {
  const h = await harness({ merchant: "acct_Different" });
  await assert.rejects(() => h.run({ ...input, people: 21 }), /People/);
  await assert.rejects(() => h.run({ ...input, session: "group", people: 7 }), /People/);
  await assert.rejects(() => h.run({ ...input, session: "day10" }), /Choose/);
  await assert.rejects(() => h.run({ ...input, email: "bad" }), /email/);
  await assert.rejects(() => h.run(input, { secretKey: "sk_live_Example" }), /live/);
  await assert.rejects(() => h.run(input, { accountId: "" }), /ACCOUNT_ID/);
  assert.deepEqual(h.paths, []);
  await assert.rejects(() => h.run(), /merchant/);
  assert.deepEqual(h.paths, ["/v1/account"]);
  const disabledAccount = await harness({ enabled: false });
  await assert.rejects(() => disabledAccount.run(input, { secretKey: "rk_live_Example", live: true }), /not yet enabled/);
  assert.equal(disabledAccount.posts.length, 0);
});

test("missing or differently priced collaboration SKU prevents a checkout", async () => {
  for (const prices of [priceRows.slice(0, 1), [priceRows[0], { ...priceRows[1], unit_amount: 7500 }]]) {
    const h = await harness({ prices });
    await assert.rejects(() => h.run(), /active AUD Stripe Price/);
    assert.equal(h.posts.length, 0);
  }
});

test("late retry recovers an existing unpaid session, even beyond the first page of history", async () => {
  const h = await harness({
    pages: [{ data: [{ id: "cs_other" }], has_more: true }, { data: [previousSession], has_more: false }],
  });
  assert.equal(await h.run(), checkoutUrl);
  assert.equal(h.posts.length, 0);
  assert.equal(h.paths.includes("/v1/prices"), false);
});

test("completed and pending payments, incomplete history and reused references never create a second charge", async () => {
  for (const [session, expected] of [
    [{ ...previousSession, status: "complete", payment_status: "paid" }, /completed or pending/],
    [{ ...previousSession, status: "complete", payment_status: "unpaid" }, /completed or pending/],
    [{ ...previousSession, customer_email: "other@example.com" }, /different details/],
  ]) {
    const h = await harness({ pages: [{ data: [session], has_more: false }] });
    await assert.rejects(() => h.run(), expected);
    assert.equal(h.posts.length, 0);
  }
  const h = await harness({ pages: [{ data: [], has_more: true }] });
  await assert.rejects(() => h.run(), /Incomplete/);
  assert.equal(h.posts.length, 0);
});

test("renewal of expired unpaid sessions gets a deterministic idempotency key", async () => {
  const expired = { ...previousSession, status: "expired", url: null };
  for (let i = 0; i < 2; i++) {
    const h = await harness({ pages: [{ data: [expired], has_more: false }] });
    assert.equal(await h.run(), checkoutUrl);
    assert.equal(h.posts[0].headers["Idempotency-Key"], reference + ":" + expired.id);
  }
});
