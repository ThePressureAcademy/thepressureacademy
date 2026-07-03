# Pressure Academy Implementation Ledger

Status: `EXECUTED — ALL 7 PHASES BUILT AND QA'D (see PRESSURE_ACADEMY_QA_REPORT.md); commit/push operator-owned`
Date: 3 July 2026
Depends on: [audit](./PRESSURE_ACADEMY_REVERSE_ENGINEERING_AUDIT.md), [architecture](./PRESSURE_ACADEMY_HYBRID_COMPOSABLE_ARCHITECTURE.md)

Standing constraints for every phase:

- Working-tree changes only; the operator owns commit/branch/push (dirty LiftIQ-retirement state must stay untangled).
- Never touch: `api/*`, `mastery-method/**`, `planner/index.html`, `liftiq/**`, `assets/logos/*`, existing `vercel.json` entries, Formspree endpoint IDs, any file listed dirty in the audit §10.
- No fake proof, prices, events, athletes, integrations, or shipping claims. Placeholders must read as placeholders or render honest fallback states.
- All shared assets referenced with `?v=1` (immutable cache discipline).
- Loop 9 amendment: JS modules were moved from `assets/js/{config,lib}` to `js/{config,lib}` — the `/assets/*` immutable cache header would have pinned operator-editable config in returning browsers for a year. File lists below reflect the final `js/` paths. See QA report §8.4 and architecture doc "Cache-namespace rule".

## Phase 1 — Homepage commercial repositioning

- **Modify:** `index.html` (full rebuild of head meta, hero, sections; preserve Formspree `meerjgde` join form incl. field names, `/planner` and `/mastery-method` links, locked marks, privacy link, mobile nav pattern).
- **Risks:** breaking the live lead-capture form; losing planner funnel continuity; SEO title/description churn. Mitigation: keep form action/fields identical (extend `path` options only), keep planner as ecosystem product, keep canonical URL.
- **Acceptance:** 1-second read = performance commerce brand; primary CTA "Shop Pressure Tested"; secondary CTA seminars/blueprints; 4-way commercial split above the fold-adjacent; no dead CTAs; form still posts.
- **Test:** local static serve + browser preview (desktop/mobile), JS console clean, form dry-check (no live submit), link sweep.

## Phase 2 — Product/category architecture

- **Create:** `shop/index.html`, `shop/apparel/index.html`, `shop/mats/index.html`, `assets/css/tpa-commerce.css`, `js/config/commerce.js`, `js/lib/commerce-ui.js`.
- **Risks:** placeholder products read as live stock. Mitigation: `status: "placeholder"` renders "First drop in production — join the release list" states instead of buy buttons; no invented scarcity counts.
- **Acceptance:** apparel path = impulse retail pattern (cards, size guide, cart drawer); mats path = considered purchase pattern (size matching, freight honesty, bulk path); zero fake prices presented as purchasable.
- **Test:** preview both pages at 390/768/1280, cart drawer add/remove, size-matcher logic, console clean.

## Phase 3 — Funnel route architecture

- **Create:** `seminars/index.html`, `seminars/_event/index.html`, `blueprints/index.html`, `blueprints/_blueprint/index.html`, `campaigns/_campaign/index.html`, `js/config/funnels.js`.
- **Modify:** `vercel.json` (append 3 rewrite entries), `sitemap.xml` + `llms.txt` (new public indexable routes only).
- **Risks:** vercel.json regression on portal/LiftIQ entries (mitigation: append-only + diff review); slug regex recursion (mitigation: `_`-prefixed template folders excluded by `[a-z0-9]` first char).
- **Acceptance:** `/seminars/anything` renders template fallback with interest capture; config-driven event with `status: "announced"` renders full funnel layout with 2-step registration (lead capture live, payment step honestly gated); unknown slug never 500s.
- **Test:** local slug simulation (`?slug=` fallback param supported for local static servers), vercel.json JSON-parse + diff, link sweep.

## Phase 4 — Cart/checkout placeholders

- **Create:** `js/lib/cart.js`, `contact/index.html`, `academy-orders/index.html`.
- **Risks:** cart implying purchasable stock. Mitigation: drawer checkout button state = "Checkout opens with first drop" + release-list capture while `checkout.provider === "none"`.
- **Acceptance:** drawer persists via localStorage; add/remove/quantity work; order-bump and express-checkout placeholders visibly inert; B2B enquiry posts via existing Formspree endpoint with distinct `intent`/`source` values.
- **Test:** preview interaction pass, localStorage inspection, reload persistence.

## Phase 5 — Retention event hooks

- **Create:** `js/lib/events.js`, `js/lib/klaviyo-events.js`.
- **Wire:** `product_viewed`, `add_to_cart`, `cart_abandoned`, `seminar_registration_started`, `seminar_checkout_abandoned`, `blueprint_checkout_started`, `upsell_viewed`, `purchase_completed` across pages.
- **Risks:** claiming tracking exists. Mitigation: events buffer to `window.__tpaEvents` + console.debug only; docs state no provider installed.
- **Acceptance:** every named event fires at the right interaction; nothing leaves the browser.
- **Test:** preview console/`__tpaEvents` inspection per interaction.

## Phase 6 — Global logistics placeholders

- **Create:** `js/config/regions.js`, `js/lib/logistics-providers.js`, `js/lib/shopify-client.js`, `js/config/proof.js`.
- **Modify:** `.env.example` (append commented `SHOPIFY_*`, `KLAVIYO_*`, `STRIPE_*`, `SAMCART_*`, freight/3PL keys — documentation only, nothing reads them at runtime yet).
- **Risks:** none material; pure scaffolding. Guard: adapters throw/return `NOT_CONFIGURED` rather than pretending.
- **Acceptance:** config carries currency/region/zone/fulfilment/tax structure; no UI claims active global fulfilment.
- **Test:** module import smoke via node --check / browser import.

## Phase 7 — QA, performance, accessibility, deployment readiness

- **Create:** `docs/PRESSURE_ACADEMY_CONVERSION_AUDIT.md`, `docs/PRESSURE_ACADEMY_QA_REPORT.md`.
- **Method:** no project scripts exist (documented), so QA = `node --check` on all new JS, JSON parse of `vercel.json`, local static serve + browser preview (390/768/1280 widths), console/network error sweep, link integrity sweep, event-firing verification, honest-state verification (no fake claims), keyboard/focus/aria pass on interactive components.
- **Acceptance:** QA report lists commands, results, failures, fixes, remaining blockers; conversion audit scores 12 dimensions with fixes or documented blockers below 8.
