# Pressure Academy Event Tracking Register

Status: `ACTIVE — CANONICAL EVENT CONTRACT`
Date: 3 July 2026
Truth: **no analytics or retention provider is installed.** Every event buffers to `window.__tpaEvents` and logs via `console.debug` only. Nothing leaves the browser until a sender is registered through `registerSender()` (`js/lib/events.js`); the Klaviyo adapter (`js/lib/klaviyo-events.js`) is the intended first sender and is a no-op without keys. Renaming any event = updating this file in the same change.

Common envelope on every event: `{ name, payload, path, ts }`.

## Seminar funnel events (First-Dollar phase)

| Event | Trigger | Payload | Verified |
| --- | --- | --- | --- |
| `seminar_viewed` | `_event` template load, every status including draft/unknown (dead-link traffic stays measurable) | `slug`, `status` (`"unknown"` when no config entry) | Yes — QA 3 Jul 2026 (interest, announced, open, draft) |
| `seminar_registration_started` | First `focusin` on the seminar capture form (index founding list or `_event` form, any mode) | `slug` (null on index), `mode` (`seminar-interest` / `seminar-registration` / `seminar-waitlist`), `surface` (index only) | Yes |
| `seminar_interest_submitted` | Successful submit of any seminar capture form (fires alongside generic `lead_captured`) | `slug` (null on index), `mode`, `surface` (index only) | Yes (stubbed-fetch submit) |
| `seminar_checkout_started` | Click on a live "Secure my spot" button — exists only when the adapter validated `status === "open"` + provider + https URL | `slug`, `provider`, `priceLabel` | Yes (synthetic QA URL, reverted) |
| `purchase_redirect_started` | Immediately after `seminar_checkout_started`, right before `window.location.assign(checkoutUrl)` | `slug`, `provider`, `checkoutHost` | Yes |
| `seminar_checkout_unavailable` | Render of an event whose config says `status: "open"` but fails adapter validation (misconfiguration signal, once per page view); also fired by any programmatic `action.start()` on an invalid funnel | `slug`, `reasons[]` (machine-readable, e.g. `missing_checkout_url`, `status_not_open:interest`, `checkout_url_not_https`) | Yes |
| `seminar_checkout_abandoned` | `visibilitychange → hidden` after registration started but not submitted, statuses `announced`/`open` only | `slug`, `step: 1` | Carried over from architecture pass (verified then) |

## Drop 01 apparel funnel events (curiosity phase)

Fired by `/shop/apparel/` from the Drop 01 manifest (`js/config/drops.js`).
Privacy rule: product id, capsule id, size band, and event state only. Names,
emails, and any fit or body information never ride on the event layer.

| Event | Trigger | Payload | Verified |
| --- | --- | --- | --- |
| `drop_view` | Apparel page load with the drop manifest resolved | `drop`, `stage` | Yes (QA 14 Jul 2026) |
| `capsule_select` | Capsule selector click (core / women / both); also syncs the waitlist radio and filters the reveals | `drop`, `capsule` | Yes |
| `product_reveal` | First open of a work-behind-the-work reveal item, once per page view per item | `drop`, `reveal` | Yes |
| `product_interest` | Register-interest click on a drop card; prefills the waitlist product and first-choice fields | `drop`, `product`, `capsule` | Yes |
| `size_guide_open` | First open of a size-guide family, once per page view per family | `drop`, `family` | Yes |
| `waitlist_start` | First `focusin` on the drop-list form | `drop` | Wiring verified via dispatched focusin; the embedded QA pane suppresses focus events on programmatic focus (document unfocused). Real user input fires it. |
| `waitlist_submit` | Successful drop-list submit, fires alongside generic `lead_captured` | `drop`, `capsule`, `product` | Yes (stubbed-fetch submit) |
| `release_handoff` | RESERVED. Fires when a waitlist entry hands off to an open release funnel. Nothing fires it in waitlist stage; firing it earlier would be a false claim. | `drop`, `product` | Constant only |

## Other canonical events (unchanged this phase)

| Event | Trigger | Payload |
| --- | --- | --- |
| `product_viewed` | Catalogue card render (apparel/mats) | `id`, `name`, `status`, `surface` |
| `add_to_cart` | Cart add (live products only — none exist yet) | item fields |
| `cart_abandoned` | Cart heuristics in `js/lib/cart.js` | cart snapshot |
| `blueprint_checkout_started` | Blueprint funnel primary CTA | `slug`, `gated` |
| `upsell_viewed` | Real upsell config entry rendered | `id`, `slug` |
| `purchase_completed` | RESERVED — nothing fires this yet. With Payment Links, completion happens on stripe.com; firing it client-side would be a false claim. It activates with a server-side webhook phase (`STRIPE_WEBHOOK_SECRET` boundary) or a Stripe-confirmed redirect page. |
| `lead_captured` | Any successful capture-form submit | `intent`, `capture` |

## Future Klaviyo mapping (when keys exist — do not wire yet)

| Local event | Klaviyo profile action |
| --- | --- |
| `seminar_interest_submitted` | Add to event-interest list/segment (by intent) |
| `seminar_registration_started` + no `seminar_interest_submitted` | Abandoned-registration flow trigger |
| `seminar_checkout_started` + no purchase (webhook phase) | Abandoned-checkout flow trigger |
| `seminar_checkout_unavailable` | Operator alert (misconfigured live event) — not a customer flow |
| `purchase_completed` (webhook phase) | Post-purchase flow + upsell sequence |
