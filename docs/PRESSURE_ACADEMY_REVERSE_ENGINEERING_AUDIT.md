# Pressure Academy Reverse Engineering Audit

Status: `ACTIVE — LOOP 1 BASELINE`
Date: 3 July 2026
Scope: full repo audit of `ThePressureAcademy/thepressureacademy` prior to the Hybrid Composable Architecture build.
Authority: per [CLAUDE.md](../CLAUDE.md), code wins over docs. Every claim below was verified against code on this date.

---

## 1. Current tech stack (verified)

| Layer | Reality |
| --- | --- |
| Frontend | Hand-written static HTML. Homepage and Mastery Method pages are self-contained (inline CSS + inline vanilla JS). No framework. |
| Build system | **None.** `package.json` has no scripts, no dependencies. No lint, no typecheck, no tests, no bundler. |
| Hosting | Vercel (project `prj_*` in `.vercel/project.json`), deploys from this repo. |
| Routing | Filesystem routing + legacy `routes` array in `vercel.json` (LiftIQ 308 redirects to pressuresystems.au, Mastery Method portal rewrites to `api/portal-serve`). |
| Serverless | `api/auth/activate.js`, `api/auth/logout.js`, `api/portal-serve.js` — real invite-token auth + signed session cookie serving protected portal HTML. Not a mock. |
| Forms | Formspree. `meerjgde` = TPA parent-site forms. `xwvwkqqg` = Mastery Method only. Endpoints are governed — do not merge or swap. |
| Fonts | Homepage: Fraunces + Outfit + JetBrains Mono via Google Fonts. (README's claim of DM Sans is stale.) |
| Analytics | **None installed.** `docs/ANALYTICS_BASELINE_PLAN.md` is a plan, not an implementation. |

Verdict on framework question: this is a **static multi-page site with Vercel serverless edges**. It is not Next.js, not Vite, not WordPress, not a Shopify theme. The least-destructive path is to stay static + config-first ES modules, and reserve any framework migration for a later, separately justified phase. A Next.js rewrite now would put the working portal auth, governed Formspree flows, and LiftIQ redirects at risk for zero commercial gain.

## 2. Current routing structure (verified)

Public, filesystem-served:

- `/` — homepage, 82 KB self-contained (`index.html`)
- `/planner` — governed bridge page → Manus-hosted `planner.thepressureacademy.com` (restored in unpushed commit `d8500c2`; do not restructure)
- `/privacy-policy.html`
- `/mastery-method/` + 9 public subpages (about, book, clarity, for-parents, pricing, programs, resources, scorecard, portal gate)
- `robots.txt`, `sitemap.xml`, `llms.txt`

Config-routed (`vercel.json`):

- `/liftiq/*` → 308 redirects to `pressuresystems.au/liftiq/*` (8 rules)
- `/mastery-method/portal/{dashboard,library,module,account,progress}` → `api/portal-serve?page=…` (session-gated)

Headers: `assets/*` cached `immutable` for 1 year (any edited shared asset **must** be cache-busted with a `?v=` query or new filename); portal gets no-store/noindex/DENY frame.

## 3. Current commerce capability (verified)

**Zero.** No cart, no checkout, no product data, no payment provider, no pricing surface on the TPA side (Mastery Method has a pricing page but conversion is call-booking via Formspree). No Shopify, Stripe, SamCart, Klaviyo, or logistics code anywhere in the repo. The only conversion machinery that exists and works:

1. Homepage "join the founding round" form → Formspree `meerjgde` (fields: name, email, `path` select, message; prefill via `data-prefill-path` links)
2. Mastery Method book + scorecard forms → Formspree `xwvwkqqg` with governed `intent`/`source` hidden fields
3. Mastery Method portal invite/session auth (env: `SESSION_SECRET`, `PORTAL_INVITE_TOKENS`)

## 4. Current visual identity (verified)

- Dark, warm, editorial: bg `#120f10`, rust `#c45b28` / `#ef7d43`, sand `#f3d7b2`, teal `#4a9b8e`, gold `#f0bf72`, large radii (32/22/16px), soft blur glows, rounded pill buttons.
- Locked SVG brand marks in `assets/logos/` (TPA House, Pressure Planner, Mastery Method, Pressure Blueprint, Pressure Tested, Pressure Over Force). README: **do not regenerate**.
- The house already names the commercial arms the new architecture needs: **Pressure Tested (apparel)**, **Pressure Blueprint (grappling/digital)**, Pressure Planner (software), Mastery Method (education). The commercial build extends existing brand architecture; it does not invent it.
- Gap vs target: current feel is "warm editorial product studio", not "UFC-event / premium combat apparel / cinematic". Radii are soft, copy is contemplative, hero sells a free 14-day pilot.

## 5. Current conversion weaknesses

1. **No revenue path anywhere on the homepage.** Every CTA leads to a free tool or a manual-review form.
2. Hero sells a free field test with meta-commentary copy ("The homepage explains the logic more fully than the live product does") — self-referential, not commercial.
3. No product paths: apparel and Blueprint exist only as brand-mark cards with no destination (dead-end ecosystem cards; two have no CTA at all).
4. No urgency, scarcity, price anchoring, or offer stack anywhere.
5. Single funnel (Formspree manual review) with no segmentation into buyer types (athlete / parent / academy owner / coach).
6. No analytics: zero visibility into any of the above.
7. `/seminars`, `/shop`, `/blueprints` etc. 404 — the brand has no commercial surface area to even send traffic to.

## 6. Current performance risks

- Homepage is one 82 KB HTML with inline CSS — fast first paint, but every new page copying this pattern multiplies unshareable CSS. New commerce pages must share a cached stylesheet.
- Three Google Font families on homepage (blocking-ish; `display=swap` mitigates).
- `assets/*` immutable cache is a foot-gun for shared CSS/JS edits (mitigation: `?v=` versioning discipline, documented in every new page).
- No image pipeline; product imagery will need explicit dimensions + lazy loading to protect CLS.

## 7. Current content gaps

- No apparel product data, imagery, or size guidance.
- No mat product/spec data (sizes, thickness, density, shipping weights) — must ship as clearly-labelled placeholder config until real supplier data exists.
- No seminar events, athletes, dates, or venues — **must not be invented**; funnel pages ship with honest "register interest" states.
- No proof assets (testimonials, athlete endorsements, federation affiliations) — proof components must ship disabled/fallback, not faked.
- No pricing for any physical or digital product.

## 8. Files safe to modify

- `index.html` (homepage rebuild — preserving the Formspree `meerjgde` join form, `/planner` links, locked marks, privacy link)
- `sitemap.xml`, `llms.txt` (add new public routes)
- `vercel.json` — **append-only**: new rewrite entries for slug routes added after existing entries; existing LiftIQ redirects and portal rewrites byte-identical
- `.env.example` — append commented integration-boundary variables
- `docs/` — new architecture docs (this file and siblings)

New files (no collision risk): `shop/`, `seminars/`, `blueprints/`, `campaigns/`, `contact/`, `academy-orders/`, `assets/css/tpa-commerce.css`, `js/config/*`, `js/lib/*`.

## 9. Files NOT to touch

| Path | Reason |
| --- | --- |
| `api/*` | Live portal auth. Breaking = locking out enrolled families. |
| `mastery-method/**` | Active product surface with governed forms; out of scope this pass. |
| `planner/index.html` | Governed bridge, restored in unpushed `d8500c2`. |
| `liftiq/**`, `assets/css/liftiq.css`, deleted LiftIQ assets, `archive/`, DispatchTalon OG PNGs, `docs/ANALYTICS_BASELINE_PLAN.md` | **Uncommitted operator working state** — the LiftIQ→DispatchTalon retirement pass sits dirty in this working tree (main also ahead 1 of origin). Do not stage, commit, revert, or edit any of it. |
| `assets/logos/*` | Locked brand marks. |
| Existing `vercel.json` entries | Portal protection + governed redirects. |
| Formspree endpoint IDs | Governed in CLAUDE.md. |

## 10. Git state at audit time (hazard record)

- Branch `main`, **ahead 1** of `origin/main` (`d8500c2` planner bridge). Push is operator's call.
- Dirty tree: LiftIQ retirement modifications/deletions + untracked `archive/` + DispatchTalon OG images. One stash exists (`GitHub_Desktop<main>`).
- Consequence: this build makes **working-tree changes only**; commit/branch/push strategy is left to the operator so the in-flight retirement pass is not entangled. All new work is path-disjoint from the dirty files and can be staged independently (`git add index.html shop/ seminars/ blueprints/ campaigns/ contact/ academy-orders/ assets/css/tpa-commerce.css js/ docs/PRESSURE_ACADEMY_*.md sitemap.xml llms.txt vercel.json .env.example`).

## 11. Unknowns requiring placeholder architecture

| Unknown | Placeholder strategy |
| --- | --- |
| Shopify store existence / credentials | Adapter `js/lib/shopify-client.js` throwing `NOT_CONFIGURED`; `.env.example` entries; mock-safe product shapes in config |
| Checkout provider decision (Shopify checkout vs Stripe vs SamCart) | `checkoutProvider` config key = `"none"`; CTAs render honest disabled/enquiry states until set |
| Klaviyo account/keys | `js/lib/klaviyo-events.js` no-op queue interface |
| Logistics (heavy mat freight, zones, fulfilment hubs) | `js/lib/logistics-providers.js` + `regions` config placeholders; UI shows "freight quoted at order confirmation" honesty copy |
| Real products, prices, imagery | Config entries flagged `status: "placeholder"`; UI renders spec-frame without fake price claims where price unknown |
| Seminars/athletes | Funnel pages run in "register interest" mode; no fake events |
| Proof assets | `proof.js` config with `enabled: false` entries; proof components render nothing (not fake badges) when empty |
