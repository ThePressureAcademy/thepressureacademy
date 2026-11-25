import { PIXLEY_ADDONS } from "../../js/config/pixley-collab.mjs";

function matchesPublishedPrice(price, expectedCents) {
  return Number.isSafeInteger(expectedCents) && expectedCents > 0 &&
    typeof price.id === "string" && /^price_[A-Za-z0-9_]+$/.test(price.id) &&
    price.object === "price" && price.active === true &&
    price.currency === "aud" && price.type === "one_time" &&
    price.billing_scheme === "per_unit" && price.custom_unit_amount == null &&
    price.transform_quantity == null && price.unit_amount === expectedCents &&
    (price.unit_amount_decimal == null ||
      String(price.unit_amount_decimal).replace(/\.0+$/, "") === String(expectedCents));
}

/** Resolve the approved catalogue entries against the merchant account used for checkout. */
export async function loadPixleyStripePrices({ secretKey, fetchImpl = globalThis.fetch, addons = PIXLEY_ADDONS }) {
  if (typeof secretKey !== "string" || !secretKey.trim()) {
    throw new Error("Stripe credentials are required to verify merchandise prices.");
  }
  const url = new URL("https://api.stripe.com/v1/prices");
  url.searchParams.set("active", "true");
  url.searchParams.set("currency", "aud");
  url.searchParams.set("type", "one_time");
  for (const { lookupKey } of addons) url.searchParams.append("lookup_keys[]", lookupKey);

  const response = await fetchImpl(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${secretKey}` },
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Stripe price lookup failed (HTTP ${response.status}).`);
  const list = await response.json();
  if (!Array.isArray(list?.data) || list.has_more === true) {
    throw new Error("Stripe did not return a complete price list.");
  }
  const prices = {};
  for (const addon of addons) {
    const matches = list.data.filter((price) => price?.lookup_key === addon.lookupKey);
    const price = matches[0];
    prices[addon.id] = matches.length === 1 && matchesPublishedPrice(price, addon.priceCents)
      ? { id: price.id, priceCents: price.unit_amount }
      : null;
  }
  return prices;
}
