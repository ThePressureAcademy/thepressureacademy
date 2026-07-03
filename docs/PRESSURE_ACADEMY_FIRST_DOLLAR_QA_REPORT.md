# Pressure Academy First-Dollar QA Report

Status: `COMPLETE — PHASE 9 QA`
Date: 3 July 2026
Scope: technical QA of the First-Dollar Revenue Activation build (seminar funnel + Stripe Payment Link readiness). Every result below was produced by an actual command or live browser check on this date. QA harness: local static server (port 4351) mirroring the `vercel.json` slug rewrites, driven through browser preview.

## 1. Commands run

- `node --check` on every changed/new JS file: `js/config/funnels.js`, `js/lib/events.js`, `js/lib/commerce-ui.js`, `js/lib/checkout/stripe-payment-links.js` — **4/4 OK** (re-run after every config flip during the status-matrix test).
- Grep sweeps: hardcoded credential scan (`sk_live|sk_test|whsec_|pk_live|buy.stripe.com` → only commented `.env.example` documentation lines), stale-reference scan.
- No project build/lint/test scripts exist (unchanged pre-existing reality; documented in the architecture-pass QA report).

## 2. Routes tested — all 200, all honest

- `/seminars/` — event board renders the sample entry with "Interest open" badge and "Register interest" CTA.
- `/seminars/founding-pressure-seminar/` — tested in **every lifecycle status** (see §4).
- `/seminars/never-a-real-event` — honest "This event is not open." fallback, no scarcity text.
- Regression sweep (shared module `commerce-ui.js` changed): `/`, `/shop/`, `/shop/apparel/`, `/shop/mats/`, `/blueprints/`, `/blueprints/pressure-blueprint-core/`, `/campaigns/x`, `/contact/`, `/academy-orders/` — all render their h1, zero console errors.

## 3. Events tested (live browser, `window.__tpaEvents`)

| Event | Result |
| --- | --- |
| `seminar_viewed` | Fires on every `_event` load with `{slug, status}`, including `draft` (dead-link traffic measurable) |
| `seminar_registration_started` | Fires once on first `focusin`, payload includes `mode` |
| `seminar_interest_submitted` | Fires on successful capture submit alongside `lead_captured` (submit tested with a stubbed `fetch` — **no real Formspree lead was sent during QA**) |
| `seminar_checkout_started` | Fires ONLY on click of a validated live buy button, payload `{slug, provider, priceLabel}` |
| `purchase_redirect_started` | Fires immediately after checkout_started, before `location.assign`, payload `{checkoutHost: "buy.stripe.com"}` |
| `seminar_checkout_unavailable` | Fires once at render when `status: "open"` fails validation, machine-readable `reasons` (verified `missing_checkout_url`) |

Adapter validation matrix (direct `validateCheckout()` calls in-browser): valid config passes; not-open status, wrong provider, missing URL, http URL, malformed URL, null config, missing slug all refuse with the correct reason string — **8/8**.

## 4. Status lifecycle matrix (config flipped, page reloaded, then restored)

| Status | Verified page behaviour |
| --- | --- |
| `interest` (ships) | Pill "Interest open"; interest form (`intent=seminar-interest`, `source=seminar-founding-pressure-seminar`); "No payment is taken on this page yet."; zero buy buttons; details show "Date/Venue/Price to be confirmed"; no scarcity chips; no proof section (empty registry — probe against a false positive confirmed 0 rendered proof figures) |
| `announced` | Pill "Announced — registration open"; free registration form (`intent=seminar-registration`); "no card is taken here"; zero buy buttons |
| `open`, no URL | Degrades to registration mode, pill downgraded to Announced, `seminar_checkout_unavailable` fired with `missing_checkout_url` |
| `open`, valid URL (synthetic QA link) | Pill "Tickets live"; 2 "Secure my spot" buttons (panel + closing CTA); price + refund labels render; "Payment is handled by Stripe on a secure stripe.com checkout page" honesty line; click → both checkout events → redirect to `buy.stripe.com` |
| `sold_out` | Waitlist form (`intent=seminar-waitlist`); **no buy button even though a checkoutUrl was still set** — adapter refuses on status |
| `closed` | "…has closed." page; hidden from the event board (board shows honest empty state) |
| `draft` | Not-open fallback; hidden from board |

QA-only synthetic values (`checkoutUrl`, `priceLabel`, `refundPolicyLabel`) were reverted to `null`; shipping state is `interest` with zero invented data (verified by grep + `node --check` after restore).

## 5. Mobile

375px iframe measurement: `/seminars/` and `/seminars/founding-pressure-seminar/` — zero horizontal overflow. (Full-site 375px sweep was green in the architecture-pass QA and no layout primitives changed.)

## 6. Defects found / fixed during this phase

- Pre-implementation defects 1–4 in the activation audit (bare pay link, no unavailable signal, thin status vocabulary, unrepresentable spotsRemaining) — all fixed by this build and verified above.
- One QA probe false-positive (proof-section regex matched the page's own script source) — investigated, not a product defect (0 proof figures rendered).
- No new defects found in the hostile pass.

## 7. Remaining blockers (all operator-side)

- No real event details, no real Stripe account/Payment Link — the funnel ships in `interest` mode and cannot take money until the launch guide is executed. This is by design, not a gap.
- `purchase_completed` intentionally does not fire anywhere (completion happens on stripe.com; client-side firing would be a false claim). Needs the later webhook/confirmation phase.
- Formspree triage rules for `seminar-registration` / `seminar-waitlist` and the payment-release email process are human-side prerequisites (forms register §Required operator actions).
- Commit/push remains operator-owned (same dirty-tree isolation as the architecture pass).
