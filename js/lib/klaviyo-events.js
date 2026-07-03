/**
 * The Pressure Academy — Klaviyo retention adapter boundary.
 *
 * TRUTH: no Klaviyo account is connected. This adapter accepts the canonical
 * events from js/lib/events.js and does nothing until a public key is
 * present. It never sends email or SMS itself — Klaviyo flows do that once
 * this boundary is live and flows are built in Klaviyo.
 *
 * To go live:
 * 1. Create the Klaviyo account; put the PUBLIC site key on the page via
 *      window.__TPA_KLAVIYO = { publicKey: "XXXXXX" }
 *    (private keys are server-side only — see .env.example: KLAVIYO_*).
 * 2. Load Klaviyo's client script per their docs.
 * 3. Call `connectKlaviyo()` once on each commerce page (already structured
 *    as a registered sender against the local event layer).
 *
 * Event mapping contract (local name → Klaviyo metric):
 *   product_viewed               → "Viewed Product"
 *   add_to_cart                  → "Added to Cart"
 *   cart_abandoned               → (derived in Klaviyo from Added to Cart flows)
 *   seminar_registration_started → "Started Seminar Registration"
 *   seminar_checkout_abandoned   → "Abandoned Seminar Checkout"
 *   blueprint_checkout_started   → "Started Blueprint Checkout"
 *   upsell_viewed                → "Viewed Upsell"
 *   purchase_completed           → "Placed Order"
 *   lead_captured                → profile subscribe + "Captured Lead"
 */

import { registerSender } from "./events.js";

function config() {
  return (typeof window !== "undefined" && window.__TPA_KLAVIYO) || null;
}

export function isConfigured() {
  const c = config();
  return Boolean(c && c.publicKey);
}

/**
 * Send one event to Klaviyo. Safe no-op while unconfigured.
 * Returns { sent, reason } — never throws in page flow.
 */
export function sendToKlaviyo(entry) {
  if (!isConfigured()) {
    return { sent: false, reason: "NOT_CONFIGURED" };
  }
  const klaviyo = window.klaviyo;
  if (!klaviyo || typeof klaviyo.push !== "function") {
    return { sent: false, reason: "KLAVIYO_SCRIPT_NOT_LOADED" };
  }
  klaviyo.push(["track", entry.name, entry.payload]);
  return { sent: true };
}

/** Register this adapter against the local event layer. Idempotent enough for one call per page. */
export function connectKlaviyo() {
  registerSender(sendToKlaviyo);
  return isConfigured();
}
