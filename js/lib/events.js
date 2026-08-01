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

  // Mastery Method funnel. Names and triggers are defined in
  // docs/ANALYTICS_BASELINE_PLAN.md and contracted in
  // docs/PRESSURE_ACADEMY_EVENT_TRACKING_REGISTER.md.
  // The MM pages are self-contained inline scripts rather than modules, so
  // they reach these through a small per-page module bridge that exposes
  // window.tpaTrack / window.TPA_EVENTS. The names still live only here.
  MM_SCORECARD_START: "mm_scorecard_start",
  MM_SCORECARD_SUBMIT: "mm_scorecard_submit",
  MM_BOOKING_START: "mm_booking_start",
  MM_BOOKING_FORM_SUBMIT: "mm_booking_form_submit",
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
