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

## Mastery Method funnel events

Wired 31 Jul 2026 per `ANALYTICS_BASELINE_PLAN.md` Option 3 (light custom
instrumentation, operator-approved). The MM pages are self-contained classic
scripts, so each imports nothing directly: a small `<script type="module">`
bridge on the page exposes `window.tpaTrack` / `window.TPA_EVENTS` from
`js/lib/events.js`. Canonical names still live only in `events.js`.

Local-only, as with every event here: `track()` buffers to `window.__tpaEvents`.
No sender is registered, so nothing leaves the browser.

| Event | Trigger | Payload | Verified |
| --- | --- | --- | --- |
| `mm_scorecard_start` | `window.startScorecard()` in `mastery-method/scorecard/index.html`, i.e. the "Start the Scorecard" button on the entry screen | `questions` (count in the flow) | Yes — local QA 31 Jul 2026 |
| `mm_scorecard_submit` | Success path of the scorecard Formspree POST (`response.ok`), `intent=scorecard-lead` / `source=clarity-scorecard` | `intent`, `source`, `weakest_pillar`, `clarity_level`, `total_score` — deliberately no name or email | Yes — local QA 31 Jul 2026 |
| `mm_booking_start` | First `focusin` or `change` on any input/select/textarea on `mastery-method/book/index.html`. Fires at most once per page view | none | Yes — local QA 31 Jul 2026 |
| `mm_booking_form_submit` | Success path of `window.submitForm()` (`response.ok`), `source=mastery-method-book` | `intent` (`call` / `assessment` / `info`), `source` — deliberately no name, email or notes | Yes — local QA 31 Jul 2026 |
| `mm_pricing_cta_click` | Click on any pricing tier CTA in `mastery-method/pricing/index.html` | `tier` (`learning-support-call` / `mastery-assessment` / `mastery-pathway` / `targeted-1-1`) | Yes — local QA 2026-08-08 |

**Homepage note.** `ANALYTICS_BASELINE_PLAN.md` lists `tpa_home_planner_cta_submit`
and `tpa_home_join_section_submit`. Neither was implemented, for two verified
reasons: their anchors `source=post-demo-cta` and `source=join-section` are
pre-rebuild values that exist in no current homepage code (and
`PRESSURE_ACADEMY_FORMS_AND_LEAD_CAPTURE_REGISTER.md` says to retire them), and
the homepage today has a single form (`intent=founding-intake`,
`source=home-join`) which `index.html` already instruments by calling
`enhanceCaptureForms()`, emitting the generic `lead_captured`. No new homepage
event was added.

## Future Klaviyo mapping (when keys exist — do not wire yet)

| Local event | Klaviyo profile action |
| --- | --- |
| `seminar_interest_submitted` | Add to event-interest list/segment (by intent) |
| `seminar_registration_started` + no `seminar_interest_submitted` | Abandoned-registration flow trigger |
| `seminar_checkout_started` + no purchase (webhook phase) | Abandoned-checkout flow trigger |
| `seminar_checkout_unavailable` | Operator alert (misconfigured live event) — not a customer flow |
| `purchase_completed` (webhook phase) | Post-purchase flow + upsell sequence |
