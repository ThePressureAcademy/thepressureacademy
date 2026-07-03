# Pressure Academy Visual Performance Audit

Status: `COMPLETE — VISUAL PERFORMANCE LAYER, PHASE 1`
Date: 3 July 2026
Depends on: [reverse-engineering audit](./PRESSURE_ACADEMY_REVERSE_ENGINEERING_AUDIT.md), [architecture](./PRESSURE_ACADEMY_HYBRID_COMPOSABLE_ARCHITECTURE.md), [QA report](./PRESSURE_ACADEMY_QA_REPORT.md)

Every claim below was verified against current repo code on this date. Nothing is inferred from older docs.

## 1. Current visual system

- **One shared stylesheet:** `assets/css/tpa-commerce.css` (`?v=1`, 482 lines) is the design system for all 11 commerce pages (`/`, `/shop/*`, `/seminars/*`, `/blueprints/*`, `/campaigns/_campaign`, `/contact/`, `/academy-orders/`). Dark pressure palette (rust `#c45b28`, sand, gold on near-black), Fraunces / Outfit / JetBrains Mono via Google Fonts (the only external asset host besides Formspree).
- **Homepage** carries a small inline `<style>` extension block (hero, split tiles, ticker) on top of the shared sheet.
- **Other stylesheets are NOT part of this surface:** `assets/css/liftiq.css` is referenced only by the 8 dormant `liftiq/**` pages (which `vercel.json` 308-redirects away in production). `assets/css/tpa-foundation.css` and `assets/css/mm-variant.css` are referenced by **zero** HTML files (verified by grep) — shared-looking but not live; do not touch, do not build on them.
- **Mastery Method / planner pages** are self-contained inline-CSS documents. Out of scope, untouched.

## 2. Current media assets

| Asset class | Reality |
| --- | --- |
| Video | **None.** No `<video>` element, no video file, no streaming reference anywhere in the repo. |
| Lottie / animation JSON | **None.** |
| WebGL / canvas | **None.** |
| Product photography | **None** (`image: null` on every catalogue entry; cards render an SVG-mark spec frame). |
| Images | SVG brand marks in `assets/logos/` (locked), 8 OG PNGs in `assets/social/` (40–92 KB, meta-only, never rendered in-page), `assets/Kirsty-portrait.jpg` (Mastery Method), one PDF lead magnet. |

There is no heavy media on any commerce route today. Baseline page weight is HTML + one stylesheet + fonts + ES modules.

## 3. Current motion usage

- **CSS micro-transitions (160 ms)**: nav-link colour, `.btn` hover lift + shadow, `.btn-ghost` hover, `.card` / `.product-card` hover lift + border. `html { scroll-behavior: smooth }`.
- **Scroll reveal**: `[data-reveal]` (opacity 0 / translateY 14px → `.revealed`) driven by an `IntersectionObserver` that is **copy-pasted inline into three pages** (`index.html`, `shop/index.html`, `academy-orders/index.html`). No other page uses `data-reveal`.
- **Reduced motion**: one `@media (prefers-reduced-motion: reduce)` block in the shared sheet neutralises reveal and button lift. Nothing else is gated.
- **One `@keyframes`** exists in `liftiq.css` only (dormant surface).

## 4. Current performance risks

1. **No-JS reveal blackout (real defect, pre-existing).** `tpa-commerce.css` sets `[data-reveal] { opacity: 0 }` unconditionally. If JavaScript is disabled or the module script fails, 21 content blocks across the three reveal pages (16 on the homepage, including the intake form panel) stay invisible forever. This violates the static-baseline rule and is fixed by this layer (see architecture doc §"No-JS guard").
2. **Reveal logic duplicated 3×** — divergence risk on every future edit; consolidated into the motion controller by this layer.
3. **Render-blocking Google Fonts** (pre-existing, accepted): 3 families / 12 weights via `fonts.googleapis.com`. Not changed in this phase; noted for a future font-subsetting pass.
4. **Immutable cache namespace:** `/assets/*` ships `Cache-Control: immutable` (1 year). Any new stylesheet there MUST be `?v=`-versioned on every referencing page, and **no operator-editable manifest may live there** (Loop 9 lesson — this is why `js/config/` exists). Future video/poster files under `/assets/` must be filename-versioned or `?v=`-versioned.
5. **No performance instrumentation** exists (no Lighthouse tooling installed). Budgets in this layer are therefore structural rules (what may load, when) rather than measured millisecond targets. Unmeasured is unmeasured — carried as a standing blocker.

## 5. Routes most suitable for motion vs. minimal

Full assignment lives in [PRESSURE_ACADEMY_ROUTE_VISUAL_STRATEGY.md](./PRESSURE_ACADEMY_ROUTE_VISUAL_STRATEGY.md). Summary:

- **Can carry cinematic weight:** `/` (brand hub, no checkout logic on-page), `/blueprints/` index (aspirational surface).
- **Standard only:** all shop, seminar, blueprint-slug, campaign surfaces — these carry forms and the future money path; motion must never sit between the visitor and a CTA.
- **Minimal:** `/contact/`, `/privacy-policy.html`, seminar/blueprint/campaign fallback states.
- **Do not disturb:** `/planner`, `/mastery-method/**` (separate subsystems, own inline CSS, portal auth), `liftiq/**` (dormant, redirected), `api/*`.

## 6. Safe files to modify (this layer)

- `index.html`, `shop/index.html`, `shop/apparel/index.html`, `shop/mats/index.html`, `seminars/index.html`, `seminars/_event/index.html`, `blueprints/index.html`, `blueprints/_blueprint/index.html`, `campaigns/_campaign/index.html`, `contact/index.html`, `academy-orders/index.html` — head link + module wiring only; forms, Formspree IDs, checkout logic untouched.
- New files under `js/config/`, `js/lib/media/`, `assets/css/tpa-motion.css`, `docs/`.

## 7. Files NOT to touch

`api/*`, `vercel.json` (no new routes/headers needed for this layer), `mastery-method/**`, `planner/index.html`, `liftiq/**`, `assets/logos/*`, `assets/css/{tpa-foundation,mm-variant,liftiq}.css`, `js/lib/checkout/stripe-payment-links.js`, `js/lib/events.js` (extended by composition, not edited), Formspree endpoint IDs, everything listed dirty in the reverse-engineering audit §10 (in-flight LiftIQ-retirement state).

## 8. Current fallback behaviour

- Config-driven pages (`seminars/_event`, `blueprints/_blueprint`, `campaigns/_campaign`) render honest fallbacks for unknown/draft slugs and carry `<noscript>` notices.
- Placeholder products render capture CTAs, never buy buttons; empty proof registry renders brand facts.
- The one fallback gap is the no-JS reveal blackout in §4.1.

## 9. Current mobile risk profile

- 375 px: zero horizontal overflow on all 10 public pages (Loop 8 QA, re-verified in this layer's QA).
- No media above the fold anywhere; fonts are the heaviest mobile cost.
- Risk to guard as media arrives: autoplaying video on cellular. The manifest therefore ships `maxMobileVideoLoops: 0` (poster-first on mobile until the operator explicitly raises it) and a save-data/low-power gate.

## 10. Verdict feeding Phase 2

The correct architecture is additive: keep `tpa-commerce.css` untouched (zero regression risk to the QA'd build, no 11-page `?v=` bump churn), add a versioned `tpa-motion.css` + a governed `js/config/visual-system.js` manifest + `js/lib/media/*` controllers that fail closed. No dependency, no framework, no invented media.
