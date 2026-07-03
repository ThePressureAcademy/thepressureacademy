# Pressure Academy QA Report

Status: `COMPLETE — LOOP 8 TECHNICAL QA`
Date: 3 July 2026
Scope: technical QA of the Hybrid Composable Architecture build (Phases 1–6 of the [implementation ledger](./PRESSURE_ACADEMY_IMPLEMENTATION_LEDGER.md)). Every result below was produced by an actual command or live browser check on this date; nothing is inferred.

## 1. Project scripts

`package.json` has **no scripts and no dependencies**. There is no install, lint, typecheck, build, test, or format command in this repo — that is the pre-existing reality of a static site, not a regression. QA therefore used direct tooling:

| Check | Command / method |
| --- | --- |
| JS syntax | `node --check <file>` on every new module |
| Config validity | `node -e "JSON.parse(...)"` on `vercel.json` |
| Diff safety | `git diff` review of every modified tracked file |
| Runtime QA | Local static server on port 4351 mirroring the three `vercel.json` slug rewrites, driven through browser preview (console, DOM, computed styles, events, viewport resize) |

## 2. Static checks — all pass

- `node --check` on all 10 new JS modules (`js/config/{commerce,funnels,proof,regions}.js`, `js/lib/{cart,commerce-ui,events,klaviyo-events,logistics-providers,shopify-client}.js`): **10/10 OK**.
- `vercel.json` parses as valid JSON. Diff is **append-only**: 3 slug rewrites (`/seminars/[slug]`, `/blueprints/[slug]`, `/campaigns/[slug]`) added after the last portal rewrite. All existing LiftIQ redirects and Mastery Method portal rewrites are byte-identical.
- `sitemap.xml`: +7 URLs (shop, apparel, mats, seminars, blueprints, academy-orders, contact), no deletions. Slug templates and `/campaigns/` correctly excluded (nothing public exists there yet).
- `llms.txt`: additive only.
- `.env.example`: appended commented integration-boundary variables only (Shopify, Stripe/SamCart, Klaviyo, freight). Nothing in the repo reads them at runtime — stated in the file itself.

## 3. Route QA — 15/15 return 200

`/`, `/shop/`, `/shop/apparel/`, `/shop/mats/`, `/seminars/`, `/seminars/<unknown-slug>`, `/blueprints/`, `/blueprints/<unknown-slug>`, `/blueprints/pressure-blueprint-core/`, `/campaigns/<unknown-slug>`, `/contact/`, `/academy-orders/`, `/privacy-policy.html`, plus `tpa-commerce.css` and module assets.

Unknown slugs never 500: seminar fallback renders "This event is not open." with zero scarcity text; blueprint and campaign fallbacks render equivalent honest states.

## 4. Browser console

Zero errors and zero warnings across every page exercised (homepage, shop index, apparel, mats, seminars index, seminar slug fallback, blueprints index, blueprint funnel, contact, academy-orders).

## 5. Functional QA

| Surface | Verified behaviour |
| --- | --- |
| Homepage | Title/meta commercial; four lanes linked (split tiles, path cards, nav, footer — 11 footer links); `/planner` (3 links), `/mastery-method`, privacy link preserved; join form still posts to governed Formspree `meerjgde`. |
| Apparel | 4 product cards fire `product_viewed` on load; placeholder products render "Get first access at drop" capture (no fake buy buttons); size-suggest tool present; cart drawer opens (`display: flex`) and closes (`display: none`); checkout button disabled with honest label "Checkout opens with the first drop". |
| Mats | Calculator does real math: 8m x 6m room → "35 jigsaw mats (7 x 5)" with 0.5m wall clearance, ~5 training pairs, thickness guidance; result populates hidden `calculator_result` field feeding the enquiry form; freight and financing copy honest ("in development", quote-confirmed). |
| Seminars | Empty state = founding-list capture, no invented events; `seminar_registration_started` fires on form `focusin`; interest form posts to `meerjgde`. |
| Blueprint funnel | Config-rendered from `funnels.js`; CTA "Join the release waitlist" fires `blueprint_checkout_started` with `{gated: true}`; zero dollar-price claims ("Pricing locks at release"); step 2 honestly locked ("Checkout opens at release."). |
| Events layer | Buffers to `window.__tpaEvents` + `console.debug` only; nothing leaves the browser (no senders registered — verified `registerSender` seam empty). |

## 6. Responsive QA

All 10 public pages measured at 375px width: **zero horizontal overflow** (document `scrollWidth` = 375 on every page). Tablet (768) and desktop (1280) passes were completed during the build pass; the mobile check above was re-run fresh for this report.

## 7. Accessibility spot-checks

- Cart drawer: `role="dialog"`, `aria-modal="true"`, `aria-label="Cart"`, `hidden` attribute state management.
- Mobile nav: managed `aria-expanded` / `aria-controls`.
- Decorative media fallbacks: `aria-hidden="true"` with empty `alt`.
- `:focus-visible` styles on nav, buttons, cart controls, and all capture-form inputs.
- This is a spot-check, not a full WCAG audit — a formal audit is listed as a remaining blocker.

## 8. Failures found during QA and their resolution

1. **Cart drawer visibility defect (fixed).** During the first browser pass the drawer's hidden/open state was wrong on load. Fixed in the drawer implementation; re-verified this date via computed styles: hidden = `display: none` on page load, open = `flex`, close returns to `none`.
2. **`seminar_registration_started` appeared not to fire (no defect).** Programmatic `element.focus()` in an unfocused headless tab does not dispatch `focusin`, which is what the listener uses. With a dispatched `FocusEvent` (and with real user focus) the event fires exactly once per form. Wiring is correct; the anomaly was a test-harness artifact.
3. **Immutable-cache landmine on config modules (found in Loop 9, fixed structurally).** The JS modules originally lived under `assets/js/`, but `vercel.json` serves `/assets/*` with `Cache-Control: public, max-age=31536000, immutable`. The stylesheet was `?v=`-versioned on every page, but ES module imports were not — and cannot be reliably versioned because modules import each other with relative specifiers (page-level `?v=` never busts nested imports). Consequence if shipped: editing `js/config/commerce.js` to flip the first product live, or `funnels.js` to announce the first event, would never reach returning browsers for up to a year. Fix: moved `assets/js/{config,lib}` → `js/{config,lib}` (outside the immutable namespace; Vercel default revalidation applies), rewrote all references (11 pages, module comments, `.env.example`, docs — zero stale references verified by grep). An appended vercel.json header override was considered and rejected: Vercel's docs do not explicitly state same-key precedence between overlapping header rules, and production cache behaviour should not depend on undocumented semantics. Re-verified after the move: 10/10 `node --check`, 12 routes 200, old `/assets/js/` path 404s, config-rendered content on every page (proving module execution), events fire, drawer opens/closes, zero console errors.
4. **Homepage form intent values changed (deliberate, flagged).** The rebuilt homepage posts to the same governed endpoint (`meerjgde`) but with `intent=founding-intake` / `source=home-join` instead of the old `intent=planner-access` / `source=post-demo-cta|join-section`. New commerce surfaces send their own distinct `intent`/`source` values on the same endpoint. Consequence: Formspree inbox triage rules keyed on the old values need updating, and the "Verified Form Behavior" section of `CLAUDE.md` becomes stale the moment this lands — update it at commit time (operator-owned, since CLAUDE.md is governance).

## 9. What was NOT touched (verified via `git status` / diff)

`api/*`, `mastery-method/**`, `planner/index.html`, `assets/logos/*`, existing `vercel.json` entries, Formspree endpoint IDs, and the entire dirty LiftIQ-retirement working state (liftiq pages, deleted LiftIQ assets, `archive/`, DispatchTalon OG images, `docs/ANALYTICS_BASELINE_PLAN.md`) — all exactly as the audit recorded them.

## 10. Remaining blockers

- **No automated test harness exists** in this repo; all QA above is manual/scripted-at-QA-time. Adding one is optional for a static site but would harden regressions on `vercel.json` and config shapes.
- **Performance not instrumented**: no Lighthouse run (no tooling installed). Risk is low — static HTML, one shared stylesheet, ES modules, no external requests beyond Google Fonts and Formspree — but unmeasured is unmeasured.
- **Formal accessibility audit** not performed (spot-checks only).
- **Real-device pass** (physical phone, actual Vercel deployment) is operator-owned; local QA mirrors the rewrites but is not Vercel itself.
- **Commit/branch/push** is deliberately left to the operator so the in-flight LiftIQ-retirement working state stays untangled (staging command in audit §10).
- All commercial activation blockers (checkout provider, Shopify, Klaviyo, proof assets, first drop, first event) are tracked in the [conversion audit](./PRESSURE_ACADEMY_CONVERSION_AUDIT.md) and architecture doc — they are operator decisions, not code gaps.
