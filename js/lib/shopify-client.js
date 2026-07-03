/**
 * The Pressure Academy — headless Shopify adapter boundary.
 *
 * TRUTH: no Shopify store is connected. This module is the single seam where
 * a Storefront API client will live, so pages and config never need to change
 * shape when credentials arrive.
 *
 * To go live:
 * 1. Create the Shopify store and a Storefront API access token.
 * 2. Expose PUBLIC values to the client via a small config script or
 *    build-time injection (never commit secrets):
 *      window.__TPA_SHOPIFY = { domain: "xxx.myshopify.com", storefrontToken: "public-token" }
 * 3. Server-side/admin values belong in Vercel env (see .env.example: SHOPIFY_*).
 * 4. Set checkout.provider = "shopify" in js/config/commerce.js.
 */

export class NotConfiguredError extends Error {
  constructor(capability) {
    super(
      `Shopify is not connected (${capability}). See js/lib/shopify-client.js and .env.example.`,
    );
    this.name = "NotConfiguredError";
    this.code = "NOT_CONFIGURED";
  }
}

function config() {
  return (typeof window !== "undefined" && window.__TPA_SHOPIFY) || null;
}

export function isConfigured() {
  const c = config();
  return Boolean(c && c.domain && c.storefrontToken);
}

/**
 * Fetch products from the Storefront API. Mapping contract: returned items
 * must be reshaped to the catalogue shape used in js/config/commerce.js
 * (id, name, status: "live", priceCents, sizes, variants, image, blurb).
 */
export async function fetchProducts() {
  if (!isConfigured()) throw new NotConfiguredError("fetchProducts");
  const { domain, storefrontToken, apiVersion = "2026-01" } = config();
  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({
      query: `{ products(first: 50) { edges { node { id title handle description
        priceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url altText }
        variants(first: 50) { edges { node { id title availableForSale } } }
      } } } }`,
    }),
  });
  if (!res.ok) throw new Error(`Shopify Storefront API error: ${res.status}`);
  return res.json();
}

/** Create a checkout / cart via Storefront API. Not available until configured. */
export async function createCheckout() {
  if (!isConfigured()) throw new NotConfiguredError("createCheckout");
  throw new Error(
    "createCheckout mapping is implemented alongside the first live product sync.",
  );
}
