# Pressure Academy Hybrid Composable Architecture

Status: `ACTIVE — LOOP 2 TARGET ARCHITECTURE`
Date: 3 July 2026
Depends on: [PRESSURE_ACADEMY_REVERSE_ENGINEERING_AUDIT.md](./PRESSURE_ACADEMY_REVERSE_ENGINEERING_AUDIT.md)

## Architecture decision

**Keep the static + Vercel-serverless stack. Add a composable commerce layer as config-driven static routes with clean adapter boundaries.**

Rationale: the repo is working production infrastructure (portal auth, governed forms, governed redirects) with no build system. A framework rewrite risks all of it and buys nothing until a headless commerce provider is actually connected. Every commerce concern below is therefore built config-first, so that swapping the "none" checkout provider for Shopify/SamCart/Stripe later is a config + adapter change, not a page rewrite.

```text
[VISITOR TRAFFIC]
   → /                    Brand Hub / global storefront entry
   → /shop/…              Physical goods (apparel = impulse, mats = considered)
   → /seminars/…          Campaign funnels (live events, scarcity)
   → /blueprints/…        Digital blueprint funnels
   → /campaigns/[slug]    Ad-hoc campaign funnels
   → /academy-orders/     B2B / wholesale / bulk path
   → /contact/            Enquiry path
   → adapters (Shopify / Klaviyo / logistics / checkout)   ← credential-gated
   → events layer (js/lib/events.js)                ← retention / recovery hooks
```

## Commercial zones → concrete surfaces

| # | Zone | Surface | State after this build |
| --- | --- | --- | --- |
| 1 | Global Brand Hub | `index.html` rebuilt as commercial authority hub | **Implemented** |
| 2 | Apparel Storefront | `/shop/` + `/shop/apparel/` — product card system from config, size-guide architecture, slide-out cart, order-bump + express-checkout placeholders | **Implemented UI, checkout credential-gated** |
| 3 | Mat Sales Engine | `/shop/mats/` — academy-size matching, bulk enquiry (Formspree, live), shipping expectation messaging, financing placeholder, B2B handoff to `/academy-orders/` | **Implemented UI; freight/financing placeholder** |
| 4 | Seminar Funnel Engine | `/seminars/` + `/seminars/[slug]` (rewrite → `_event` template) — 2-step logic: lead capture (live) → payment step (gated); urgency/scarcity blocks driven by config, honest when empty | **Implemented; no live events invented** |
| 5 | Blueprint Funnel Engine | `/blueprints/` + `/blueprints/[slug]` (rewrite → `_blueprint` template) — transformation-led, upsell placeholders | **Implemented; checkout gated** |
| 6 | Cart / Checkout Layer | `js/lib/cart.js` slide-out foundation (localStorage), `checkoutProvider` config = `"none"` renders enquiry/notify fallback | **Foundation implemented; provider deferred** |
| 7 | Retention / Klaviyo Layer | `js/lib/events.js` canonical event names + queue; `js/lib/klaviyo-events.js` no-op adapter | **Scaffolded; sends nothing** |
| 8 | Logistics / Region Layer | `js/config/regions.js` + `js/lib/logistics-providers.js` — currency/region/zone/fulfilment/tax placeholders | **Scaffolded** |
| 9 | Proof / Authority Layer | `js/config/proof.js` — components render only `enabled: true` verifiable entries; empty registry renders brand-fact strip, never fake badges | **Scaffolded, fail-honest** |
| 10 | Admin / Content Config | `js/config/*.js` — all products, funnels, regions, proof editable without touching page markup | **Implemented** |

## Route map (final)

| Route | Mechanism |
| --- | --- |
| `/` | filesystem (`index.html`, rebuilt) |
| `/shop/`, `/shop/apparel/`, `/shop/mats/` | filesystem folders |
| `/seminars/` | filesystem |
| `/seminars/[slug]` | `vercel.json` rewrite → `/seminars/_event/index.html`, client renders from `funnels.js` by pathname; unknown slug → honest fallback + interest capture |
| `/blueprints/`, `/blueprints/[slug]` | same pattern → `/blueprints/_blueprint/index.html` |
| `/campaigns/[slug]` | rewrite → `/campaigns/_campaign/index.html` |
| `/contact/`, `/academy-orders/` | filesystem |
| Cart | slide-out drawer on commerce pages (no standalone `/cart` page needed on a static stack; documented limitation) |
| Existing routes | untouched (`/planner`, `/mastery-method/**`, portal rewrites, LiftIQ redirects, privacy) |

Slug template folders are underscore-prefixed (`_event`, `_blueprint`, `_campaign`) so the slug regex `^/section/([a-z0-9][a-z0-9-]*)/?$` cannot recurse into them. Vercel legacy `routes` are evaluated in order before filesystem fallback; new entries are appended after the existing governed entries and never modify them.

## Module layout

```text
assets/css/tpa-commerce.css        shared commerce design system (?v= cache-busting discipline)
js/config/commerce.js       brand lines, apparel + mat products, checkout provider settings
js/config/funnels.js        seminars, blueprints, campaigns, order bumps, upsells
js/config/regions.js        currencies, regions, shipping zones, fulfilment hubs, tax posture
js/config/proof.js          proof/authority registry (fail-honest)
js/lib/events.js            canonical retention event names + track() queue
js/lib/cart.js              slide-out cart foundation (localStorage tpa.cart.v1)
js/lib/commerce-ui.js       shared renderers: product cards, money, drawer, header/footer wiring
js/lib/shopify-client.js    headless Shopify adapter boundary (NOT_CONFIGURED until env set)
js/lib/klaviyo-events.js    retention adapter boundary (no-op until key set)
js/lib/logistics-providers.js  freight/3PL boundary (placeholder quotes only)
js/lib/checkout/stripe-payment-links.js  First-Dollar phase: validated Payment Link
                            redirect action (no keys, no server); see
                            PRESSURE_ACADEMY_FIRST_SEMINAR_LAUNCH_GUIDE.md
```

All modules are browser-native ES modules (`<script type="module">`) — no build step introduced.

**Cache-namespace rule (Loop 9 correction):** runtime-mutable JS lives under `/js/`, deliberately OUTSIDE `/assets/`, because `vercel.json` serves `/assets/*` with `Cache-Control: immutable` (1 year). Config modules are exactly the files the operator edits to activate commerce (flip a product live, announce an event); under the immutable namespace those edits would never reach returning browsers. `/js/*` gets Vercel's default revalidation, so config edits propagate on the next deploy. Truly immutable assets (logos, images) and the `?v=`-versioned stylesheet stay under `/assets/`. Do not move modules back under `/assets/` and do not put operator-editable config there.

## What requires external credentials / decisions

| Dependency | Blocked capability | Boundary |
| --- | --- | --- |
| Shopify store + Storefront API token | Live products, variants, inventory, checkout | `shopify-client.js` + `SHOPIFY_*` in `.env.example`; product config is mock-safe and flagged `placeholder` |
| Checkout provider decision (Shopify / Stripe / SamCart) | Taking money at all | `commerce.js → checkout.provider = "none"`; buy CTAs render enquiry/notify states |
| Klaviyo private/public keys | Cart recovery, abandoned-registration flows, email/SMS | `klaviyo-events.js`; events queue locally, send nothing |
| Freight/3PL account (heavy mats) | Real shipping quotes, zone pricing | `logistics-providers.js`; UI states freight is quoted on order confirmation |
| Financing partner | Mat financing offers | UI shows "financing options in development" — no false offer |
| Real seminar events / athletes | Live seminar sales | `funnels.js` events array ships empty of live events; index runs interest-capture mode |
| Proof assets (testimonials, results, media) | Authority ticker content | `proof.js` entries `enabled: false` until verified |

## Intentionally deferred

- Framework migration (Next.js) — revisit only if/when headless Shopify goes live and SSR/ISR is actually needed.
- Standalone `/cart` page, multi-currency price display (config carries the structure; display currency fixed AUD until a provider supplies FX).
- Geo-routing/localised shipping UI beyond config placeholders.
- Any Mastery Method changes.
- Analytics provider install (event layer buffers to `window.__tpaEvents`; provider hookup is one function).

## Minimum viable commercial launch path

1. **Now (this build):** brand hub + four product paths + funnels in interest-capture mode + bulk/B2B enquiry live via existing Formspree. Revenue-ready surfaces, lead capture live day one.
2. **First dollar (apparel):** create Shopify store, load real Pressure Tested products, set `SHOPIFY_*` env + `checkout.provider = "shopify"`, replace placeholder product entries. No page rewrites.
3. **First high-ticket dollar (seminar):** confirm one real event → add it to `funnels.js` with real athlete/date/venue + payment link (Stripe Payment Link or SamCart URL) → scarcity blocks activate from config.
4. **Mats:** confirm supplier + freight lanes → replace placeholder specs, enable freight quotes.
5. **Retention:** Klaviyo keys → wire `klaviyo-events.js` sender; cart/registration abandonment events already fire client-side.
