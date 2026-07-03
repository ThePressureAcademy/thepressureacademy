# Pressure Academy First-Dollar Activation Audit

Status: `ACTIVE — PHASE 1 BASELINE (pre-implementation)`
Date: 3 July 2026
Scope: audit of the seminar funnel system as built in the Hybrid Composable Architecture pass, before the First-Dollar Revenue Activation changes. Read together with the five `PRESSURE_ACADEMY_*` docs from the previous pass.

## 1. Current seminar config shape (`js/config/funnels.js`)

One entry only: `first-pressure-camp`, `status: "draft"`, every field null. Shape:
`slug, status, title, athlete {name, credential, image}, dateISO, venue {name, city, country}, priceCents, seatCap, closesAt, checkoutUrl, pitch, schedule[], upsellIds[]`.

Gaps vs the real-launch spec: no interest/waitlist lifecycle states, no label-based fields (dateLabel/priceLabel/venueLabel — the ISO/cents fields force premature precision), no checkoutProvider field, no leadCaptureIntent/source, no includedItems/whoItIsFor/requirements/refundPolicyLabel/proofItems/heroImage/videoUrl/seo fields, no per-event orderBump/upsell reference in the new naming.

## 2. Current status values and their consumers

| Value | Where consumed |
| --- | --- |
| `draft` | never rendered; slug page falls to not-open state |
| `announced`, `on-sale` | `_event` template `isOpen` check; `publicSeminars()` filter |
| `on-sale` + `checkoutUrl` | `canPay` → renders a raw `<a href=checkoutUrl>` pay link (no adapter, no validation, no events) |
| `sold-out` | index card badge; included in `publicSeminars()` |
| `completed` | defined in config comment only; consumed nowhere |

Migration is safe: no real event exists, so the status vocabulary can be replaced wholesale with `draft / interest / announced / open / sold_out / closed`.

## 3. Current checkout fields / behaviour

- `checkoutUrl` exists on the seminar shape; when `on-sale`, the template renders it as a bare link with **no provider validation, no status guard beyond the ternary, and no checkout events**. This is the main gap the adapter closes.
- Cart layer (`js/lib/cart.js`) is apparel-only: `checkout.provider === "none"` renders a disabled button. Seminars do not touch the cart. Correct; unchanged this phase.
- `.env.example` documents `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` as future server-side boundaries. **Payment Links require neither** — no keys, no server routes, no webhooks this phase.

## 4. Current form capture behaviour

All forms post to governed Formspree `meerjgde` via `enhanceCaptureForms()` (AJAX, honest status line, fires `lead_captured` locally). Inventory:

| Page | intent | source |
| --- | --- | --- |
| `/` join form | `founding-intake` | `home-join` |
| `/shop/apparel/` drop list | `apparel-drop-list` | `shop-apparel` |
| `/shop/mats/` enquiry | `mat-enquiry` | `shop-mats` |
| `/seminars/` founding list | `seminar-interest` | `seminars-index` |
| `/seminars/[slug]` registration | `seminar-registration` | `seminar-<slug>` |
| `/blueprints/[slug]` waitlist | `blueprint-waitlist` | `blueprint-<slug>` |
| `/campaigns/[slug]` | from campaign config | from campaign config |
| `/contact/` | `contact` | `contact-page` |
| `/academy-orders/` | `academy-order-enquiry` | `academy-orders` |

Every form already has explicit intent + source. Full register with promises/risks moves to `PRESSURE_ACADEMY_FORMS_AND_LEAD_CAPTURE_REGISTER.md` this phase. Note: the prompt references `js/lib/analytics/events.js`; the actual path is `js/lib/events.js`.

## 5. Current event behaviour (seminar-relevant)

- `seminar_registration_started` — fires once on `focusin` of the index founding-list form and the `_event` registration form. Works (verified in QA report §8.2).
- `seminar_checkout_abandoned` — fires on `visibilitychange→hidden` when registration started but not submitted (`_event` page, step 1).
- `lead_captured` — on any successful capture-form submit.
- Missing vs the Phase 7 target: `seminar_viewed`, `seminar_interest_submitted`, `seminar_checkout_started`, `seminar_checkout_unavailable`, `purchase_redirect_started`. All additive to the canonical names in `js/lib/events.js`; buffer-only posture unchanged.

## 6. Current disabled-checkout behaviour

Step 2 on the `_event` page renders "Payment is not open on this page yet — no card is taken here" whenever `status !== "on-sale"` or `checkoutUrl` is empty. Honest, but static: no event fires when a visitor hits an unavailable checkout, so demand for a not-yet-open event is invisible. The adapter + `seminar_checkout_unavailable` close this.

## 7. Files safe to modify this phase

- `js/config/funnels.js` (seminar shape + sample entry; blueprints/campaigns arrays untouched)
- `js/lib/events.js` (additive event names only)
- `js/lib/commerce-ui.js` (additive: optional success callback on `enhanceCaptureForms`)
- `seminars/index.html`, `seminars/_event/index.html`
- New: `js/lib/checkout/stripe-payment-links.js`
- New/updated docs under `docs/`

## 8. Files NOT to touch

Same never-touch list as the ledger (api/*, mastery-method/**, planner, logos, existing vercel.json entries, Formspree IDs, dirty LiftIQ operator state), plus this phase: `index.html`, `shop/**`, `blueprints/**`, `campaigns/**`, `contact/`, `academy-orders/`, `js/lib/cart.js`, `js/lib/shopify-client.js`, `js/lib/klaviyo-events.js`, `vercel.json` (slug rewrite already exists — no additive change required), `sitemap.xml` (no new indexable routes; `_event` stays noindex).

## 9. Defects discovered before implementation

1. **Bare pay link, no adapter (§3).** `on-sale` renders `checkoutUrl` as a plain anchor with no validation and no `seminar_checkout_started`/redirect event. Fixed this phase by the Stripe Payment Link adapter.
2. **No checkout-unavailable signal (§6).** Fixed this phase.
3. **Status vocabulary too thin (§2).** `interest` and `closed` states missing; `completed` dead. Fixed this phase.
4. **`spotsRemaining` not representable** — old shape only had `seatCap`; numerical scarcity could never be stated honestly against a live count. New shape requires BOTH `capacity` and `spotsRemaining` before any number renders.
5. Not a defect but a governance note: `publicSeminars()` is also imported by `seminars/index.html` only — no other page renders seminar entries, so the migration surface is exactly two pages plus config.
