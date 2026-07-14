/**
 * The Pressure Academy — retention / analytics event layer.
 *
 * TRUTH: no analytics or retention provider is installed. Events fired here
 * buffer to `window.__tpaEvents` and log via console.debug. Nothing leaves
 * the browser until a sender is registered (see registerSender / klaviyo-events.js).
 *
 * Canonical event names are the contract for future Klaviyo / analytics
 * wiring — do not rename without updating
 * docs/PRESSURE_ACADEMY_EVENT_TRACKING_REGISTER.md (trigger + payload contract
 * per event) and docs/PRESSURE_ACADEMY_HYBRID_COMPOSABLE_ARCHITECTURE.md.
 */

export const EVENTS = Object.freeze({
  PRODUCT_VIEWED: "product_viewed",
  ADD_TO_CART: "add_to_cart",
  CART_ABANDONED: "cart_abandoned",
  SEMINAR_VIEWED: "seminar_viewed",
  SEMINAR_REGISTRATION_STARTED: "seminar_registration_started",
  SEMINAR_INTEREST_SUBMITTED: "seminar_interest_submitted",
  SEMINAR_CHECKOUT_STARTED: "seminar_checkout_started",
  SEMINAR_CHECKOUT_UNAVAILABLE: "seminar_checkout_unavailable",
  SEMINAR_CHECKOUT_ABANDONED: "seminar_checkout_abandoned",
  PURCHASE_REDIRECT_STARTED: "purchase_redirect_started",
  BLUEPRINT_CHECKOUT_STARTED: "blueprint_checkout_started",
  UPSELL_VIEWED: "upsell_viewed",
  PURCHASE_COMPLETED: "purchase_completed",
  LEAD_CAPTURED: "lead_captured",
  // Drop-level apparel funnel (Drop 01 architecture). Local-only until an
  // external sink is registered. Privacy rule: no fit or body data rides on
  // these events; product id, capsule id, size band, and event state only.
  DROP_VIEW: "drop_view",
  CAPSULE_SELECT: "capsule_select",
  PRODUCT_REVEAL: "product_reveal",
  PRODUCT_INTEREST: "product_interest",
  SIZE_GUIDE_OPEN: "size_guide_open",
  WAITLIST_START: "waitlist_start",
  WAITLIST_SUBMIT: "waitlist_submit",
  RELEASE_HANDOFF: "release_handoff",
});

const senders = [];

function buffer() {
  if (!window.__tpaEvents) window.__tpaEvents = [];
  return window.__tpaEvents;
}

/**
 * Fire a named event. Payload must be plain JSON-safe data, no PII beyond
 * what the user explicitly submitted on the same surface.
 */
export function track(name, payload = {}) {
  const entry = {
    name,
    payload,
    path: window.location.pathname,
    ts: new Date().toISOString(),
  };
  buffer().push(entry);
  console.debug("[tpa-event]", entry.name, entry);
  senders.forEach((send) => {
    try {
      send(entry);
    } catch (err) {
      console.debug("[tpa-event] sender failed", err);
    }
  });
  return entry;
}

/**
 * Register a real sender (e.g. Klaviyo adapter) once credentials exist.
 * Until then the event layer is intentionally local-only.
 */
export function registerSender(fn) {
  if (typeof fn === "function") senders.push(fn);
}

/** Read-only copy of the local buffer (QA / debugging). */
export function getBufferedEvents() {
  return buffer().slice();
}
