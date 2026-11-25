/**
 * Issue a private Stripe Checkout URL after confirming the requested places.
 * Run `node scripts/pixley-checkout.mjs --help` for the input contract.
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { PIXLEY_ADDONS, PIXLEY_SESSIONS } from "../js/config/pixley-collab.mjs";
import { loadPixleyStripePrices } from "./lib/pixley-stripe-prices.mjs";

const slug = "michael-pixley-march-2027";
const page = "https://thepressureacademy.com/seminars/" + slug + "/";
const sessionLabels = Object.freeze({
  day1: "Day 1",
  day2: "Day 2",
  both: "Both days",
  group: "90-minute semi-private group",
});

const help = `Use a Pressure Academy merchant key (PIXLEY_STRIPE_SECRET_KEY) and its separately
configured account ID (PIXLEY_STRIPE_ACCOUNT_ID). The key needs account, Price
and Checkout Session read access and Checkout Session write access.

After confirming available places, pipe one JSON booking on standard input:
  node scripts/pixley-checkout.mjs < confirmed-booking.json
  {"bookingRef":"BRIS-001","session":"day1","people":1,"email":"buyer@example.com"}

Use day1, day2, both, or group. Keep the same bookingRef for every retry.
With live credentials add --live. The output is a private URL for this buyer.
Sessions expire after 24 hours. To renew an expired link, confirm availability
again and reissue with the original bookingRef. Payment status and purchased
items are available on the merchant's Stripe Checkout Session.`;

function validateBooking(input) {
  const { bookingRef, session, people, email } = input ?? {};
  if (typeof bookingRef !== "string" || !/^[A-Za-z0-9_-]{1,80}$/.test(bookingRef)) {
    throw new Error("Supply a stable bookingRef of 1–80 letters, numbers, hyphens or underscores.");
  }
  if (!Object.hasOwn(sessionLabels, session)) throw new Error("Choose day1, day2, both, or group.");
  const cap = session === "group" ? PIXLEY_SESSIONS.groupCapacity : PIXLEY_SESSIONS.dayCapacity;
  if (!Number.isInteger(people) || people < 1 || people > cap) {
    throw new Error(`People for this session must be an integer from 1 to ${cap}.`);
  }
  if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Supply the booking organiser’s email.");
  }
  return { bookingRef: bookingRef.toUpperCase(), session, people, email: email.toLowerCase() };
}

function checkoutBody(booking, reference, prices) {
  const { people, session, email } = booking;
  const group = session === "group";
  const unitCents = group ? PIXLEY_SESSIONS.groupPriceCents
    : PIXLEY_SESSIONS.dayPriceCents * (session === "both" ? 2 : 1);
  const params = new URLSearchParams({
    mode: "payment",
    integration_identifier: "pixley_seminar_kzevhmrq",
    "adaptive_pricing[enabled]": "false",
    client_reference_id: reference,
    customer_email: email,
    success_url: page + "#payment-return",
    cancel_url: page + (group ? "#group-request" : "#seminar-request"),
    "line_items[0][price_data][currency]": "aud",
    "line_items[0][price_data][product_data][name]": "Michael Pixley · Brisbane, March 2027 · " + sessionLabels[session],
    "line_items[0][price_data][unit_amount]": String(unitCents),
    "line_items[0][quantity]": String(group ? 1 : people),
    "custom_fields[0][key]": "merch_sizes",
    "custom_fields[0][type]": "text",
    "custom_fields[0][label][type]": "custom",
    "custom_fields[0][label][custom]": "Apparel sizes (e.g. 1 M tee, 1 L rashguard)",
    "custom_fields[0][optional]": "true",
    "metadata[event]": slug,
    "metadata[session]": session,
    "metadata[people]": String(people),
    "metadata[booking_ref]": booking.bookingRef,
    "payment_intent_data[metadata][booking_ref]": booking.bookingRef,
    "payment_intent_data[metadata][event]": slug,
  });
  for (const [index, addon] of PIXLEY_ADDONS.entries()) {
    const price = prices[addon.id];
    if (!price || price.priceCents !== addon.priceCents || !price.id?.startsWith("price_")) {
      throw new Error("Check the active AUD Stripe Price for " + addon.name + " before issuing the link.");
    }
    const key = `optional_items[${index}]`;
    params.set(key + "[price]", price.id);
    params.set(key + "[quantity]", "1");
    params.set(key + "[adjustable_quantity][enabled]", "true");
    params.set(key + "[adjustable_quantity][minimum]", "1");
    params.set(key + "[adjustable_quantity][maximum]", "99");
  }
  return params;
}

async function findPrevious(request, reference, booking) {
  // Checkout does not offer a reference-ID search. Read the full history so late
  // retries remain safe after Stripe's 24-hour idempotency-key retention window.
  const query = new URLSearchParams({ limit: "100" });
  let newestExpired = null;
  for (;;) {
    const page = await request("/checkout/sessions?" + query);
    if (!Array.isArray(page.data) || typeof page.has_more !== "boolean") {
      throw new Error("Could not verify existing Stripe Checkout Sessions.");
    }
    for (const item of page.data) {
      if (item.client_reference_id !== reference) continue;
      if (item.metadata?.event !== slug || item.metadata?.session !== booking.session ||
          item.metadata?.people !== String(booking.people) || item.customer_email !== booking.email) {
        throw new Error("This booking reference already has different details. Review the original booking.");
      }
      if (item.status === "open" && item.url && item.payment_status === "unpaid") return { session: item };
      if (item.status !== "expired" || item.payment_status !== "unpaid") {
        throw new Error("This booking already has a completed or pending payment. Check its Stripe Session.");
      }
      newestExpired ??= item.id;
    }
    if (!page.has_more) return { newestExpired };
    const cursor = page.data.at(-1)?.id;
    if (!cursor || cursor === query.get("starting_after")) throw new Error("Incomplete Stripe session history.");
    query.set("starting_after", cursor);
  }
}

export async function issueCheckout(input, {
  secretKey, accountId, live = false, fetchImpl = globalThis.fetch,
} = {}) {
  const booking = validateBooking(input);
  const mode = /^(?:sk|rk)_(live|test)_[A-Za-z0-9]+$/.exec(secretKey ?? "")?.[1];
  if (!mode || (mode === "live") !== live) {
    throw new Error("Set the dedicated PIXLEY_STRIPE_SECRET_KEY. Use --live only with live credentials.");
  }
  if (!/^acct_[A-Za-z0-9]+$/.test(accountId ?? "")) throw new Error("Set PIXLEY_STRIPE_ACCOUNT_ID.");
  async function request(path, { method = "GET", body, idempotencyKey } = {}) {
    const headers = { Authorization: "Bearer " + secretKey, "Stripe-Version": "2026-11-18.endive" };
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
    const response = await fetchImpl("https://api.stripe.com/v1" + path, {
      method, headers, body, redirect: "error", signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      const requestId = response.headers?.get("request-id") ?? "unavailable";
      throw new Error(`Stripe returned HTTP ${response.status} (request ID ${requestId}).`);
    }
    return response.json();
  }
  const account = await request("/account");
  if (account.id !== accountId) throw new Error("Stripe credentials do not match the configured Pressure Academy merchant.");
  if (live && account.charges_enabled !== true) throw new Error("Charges are not yet enabled for this merchant.");
  const reference = slug + ":" + booking.bookingRef;
  const previous = await findPrevious(request, reference, booking);
  if (previous.session) return previous.session.url;
  const prices = await loadPixleyStripePrices({ secretKey, fetchImpl });
  const completed = await request("/checkout/sessions", {
    method: "POST", body: checkoutBody(booking, reference, prices),
    idempotencyKey: reference + ":" + (previous.newestExpired ?? "first"),
  });
  if (!completed.url || completed.status !== "open" || completed.livemode !== live) {
    throw new Error("Stripe has not returned a usable session. Check this booking before retrying.");
  }
  return completed.url;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    console.log(help);
  } else {
    try {
      if (args.length > 1 || (args.length && args[0] !== "--live")) throw new Error("Use --help for usage.");
      const booking = JSON.parse(readFileSync(0, "utf8"));
      const url = await issueCheckout(booking, {
        secretKey: process.env.PIXLEY_STRIPE_SECRET_KEY,
        accountId: process.env.PIXLEY_STRIPE_ACCOUNT_ID,
        live: args[0] === "--live",
      });
      console.log(url);
    } catch (error) {
      console.error(error instanceof SyntaxError ? "Supply valid booking JSON on standard input." : error.message);
      process.exitCode = 1;
    }
  }
}
