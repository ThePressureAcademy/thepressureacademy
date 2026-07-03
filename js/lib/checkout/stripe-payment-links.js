/**
 * The Pressure Academy — Stripe Payment Link checkout adapter.
 *
 * SCOPE (deliberately small): Payment Links are hosted checkout pages on
 * stripe.com. This adapter only validates a funnel entry and performs the
 * redirect. It uses NO API keys, NO server routes, NO webhooks, and never
 * collects card details on-site. Fulfilment/confirmation flows are a later,
 * server-side phase (see .env.example STRIPE_* boundary notes).
 *
 * TRUTH RULES:
 * - Checkout is available ONLY when status === "open" AND checkoutProvider
 *   === "stripe_payment_link" AND checkoutUrl is a real https URL.
 * - Anything else returns an unavailable action with a stated reason, and
 *   attempting it fires `seminar_checkout_unavailable` — demand on a closed
 *   funnel is a signal, not an error.
 * - `seminar_checkout_started` and `purchase_redirect_started` fire ONLY on a
 *   real redirect to a real checkout URL.
 *
 * A later swap to Shopify/SamCart is a sibling adapter with the same action
 * shape — funnel pages depend on checkoutAction(), not on Stripe.
 */

import { track, EVENTS } from "../events.js";

export const PROVIDER = "stripe_payment_link";

/** Validation detail for one funnel entry. Pure — no side effects. */
export function validateCheckout(funnel) {
  const reasons = [];
  if (!funnel || typeof funnel !== "object") {
    return { valid: false, reasons: ["no_funnel_config"] };
  }
  if (!funnel.slug) reasons.push("missing_slug");
  if (funnel.status !== "open") reasons.push(`status_not_open:${funnel.status ?? "none"}`);
  if (funnel.checkoutProvider !== PROVIDER)
    reasons.push(`provider_not_payment_link:${funnel.checkoutProvider ?? "none"}`);
  if (!funnel.checkoutUrl || typeof funnel.checkoutUrl !== "string") {
    reasons.push("missing_checkout_url");
  } else {
    let url;
    try {
      url = new URL(funnel.checkoutUrl);
    } catch {
      reasons.push("checkout_url_not_a_url");
    }
    if (url && url.protocol !== "https:") reasons.push("checkout_url_not_https");
  }
  return { valid: reasons.length === 0, reasons };
}

/**
 * Build the safe checkout action for a funnel entry.
 *
 * Returns:
 *   { available: true,  url, start() }  — start() fires the checkout events
 *                                          and redirects to the Payment Link.
 *   { available: false, reasons, start() } — start() fires
 *                                          `seminar_checkout_unavailable` and
 *                                          does NOT navigate. UI must already
 *                                          be showing the honest fallback.
 */
export function checkoutAction(funnel) {
  const { valid, reasons } = validateCheckout(funnel);
  const slug = funnel?.slug ?? null;

  if (!valid) {
    return {
      available: false,
      reasons,
      start() {
        track(EVENTS.SEMINAR_CHECKOUT_UNAVAILABLE, { slug, reasons });
        return false;
      },
    };
  }

  return {
    available: true,
    url: funnel.checkoutUrl,
    start() {
      track(EVENTS.SEMINAR_CHECKOUT_STARTED, {
        slug,
        provider: PROVIDER,
        priceLabel: funnel.priceLabel ?? null,
      });
      track(EVENTS.PURCHASE_REDIRECT_STARTED, {
        slug,
        provider: PROVIDER,
        checkoutHost: new URL(funnel.checkoutUrl).host,
      });
      window.location.assign(funnel.checkoutUrl);
      return true;
    },
  };
}
