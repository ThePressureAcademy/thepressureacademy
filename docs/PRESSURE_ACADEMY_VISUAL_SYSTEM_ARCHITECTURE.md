# Pressure Academy Visual System Architecture

Status: `ACTIVE — VISUAL PERFORMANCE LAYER v1`
Date: 3 July 2026
Depends on: [visual performance audit](./PRESSURE_ACADEMY_VISUAL_PERFORMANCE_AUDIT.md), [hybrid composable architecture](./PRESSURE_ACADEMY_HYBRID_COMPOSABLE_ARCHITECTURE.md)

## Decision

**Keep the static + Vercel stack. Add a governed, fail-closed motion/media layer as config + vanilla ES modules + one versioned stylesheet.** No framework migration, no npm dependency, no GSAP/Lottie/R3F/Cloudflare Stream, no media files invented. The layer prepares the site to accept real Higgsfield loops and Fable 5 micro-assets progressively, while conversion clarity, checkout reliability, mobile speed, and accessibility outrank visual intensity by rule.

## Layer stack (what exists after this build)

```text
1. Static HTML/CSS baseline            ACTIVE — works with JS disabled (incl. the
                                       pre-existing [data-reveal] no-JS blackout, now fixed)
2. CSS motion layer                    ACTIVE — assets/css/tpa-motion.css?v=1, gated
                                       behind html.tpa-motion (controller-added only)
3. Video loop layer                    SCAFFOLDED — poster-first loader live; every
                                       manifest entry is status:"placeholder" (no video
                                       file exists; zero network requests)
4. Vector micro-animation layer        PARTIAL — css-provider assets active (cta-confirm,
                                       card-lift); lottie/fable_export/inline_svg/webgl
                                       providers registered but deliberately unimplemented
                                       until a real asset exists
5. Advanced layer (WebGL/3D)           NOT BUILT — allowWebGL:false on every route;
                                       provider slot exists, nothing loads
6. Motion governance layer             ACTIVE — manifest flags, route intensity, budgets,
                                       reduced-motion, low-power, fallbacks, local events
```

## Module map

```text
js/config/visual-system.js        operator-editable manifest: global switches, route
                                  intensity, video loop registry, motion asset registry,
                                  budgets, fallback policy (+ resolveRouteVisual)
js/lib/media/motion-controller.js page entry (initMotion): html.tpa-motion gate,
                                  data-visual-intensity, shared [data-reveal] observer,
                                  CSS confirmation feedback via the events seam
js/lib/media/media-loader.js      the ONLY module that authorises a manifest entry to
                                  load; placeholder/disabled/missing-src/over-budget/
                                  wrong-route all resolve to blocked (dev-only warns)
js/lib/media/video-loops.js       poster-first video activation: manifest + route +
                                  reduced-motion + low-power + viewport-count budget +
                                  near-viewport IntersectionObserver; error → poster
js/lib/media/reduced-motion.js    prefers-reduced-motion, mid-session change listener,
                                  low-power/save-data heuristic, mobile viewport check
js/lib/media/visual-events.js     visual event names + trackVisual() → existing
                                  js/lib/events.js buffer (window.__tpaEvents only)
assets/css/tpa-motion.css?v=1     all motion styles + video surfaces + static-baseline
                                  guard; immutable-cache namespace, bump ?v= per edit
```

Wired on all 11 commerce pages (`/`, `/shop/*`, `/seminars/*`, `/blueprints/*`, `/campaigns/_campaign`, `/contact/`, `/academy-orders/`): one `<link>` + one `initMotion()` call. The three per-page inline reveal observers were replaced by the shared controller implementation. `/planner`, `/mastery-method/**`, `liftiq/**`, `api/*` are untouched and do not load this layer.

## The `html.tpa-motion` gate (core mechanism)

Every motion rule in `tpa-motion.css` requires `html.tpa-motion`, which only `initMotion()` adds, and only when `globalMotionEnabled` is true AND the user does not prefer reduced motion. Consequences, all landing on the same static baseline:

- **JS disabled / module fails** → class absent → static page, and `html:not(.tpa-motion) [data-reveal]` forces revealed-content visibility (fixes the pre-existing blackout where `tpa-commerce.css` hid `[data-reveal]` unconditionally).
- **Reduced motion** → class withheld + `motion_disabled_reduced_motion` buffered + a belt-and-braces `@media (prefers-reduced-motion: reduce)` block in the CSS itself. Mid-session OS flips are handled (class removed, pending reveals forced visible, loops paused).
- **Global kill switch** → set `globalMotionEnabled: false` in `js/config/visual-system.js` and deploy. One flip, whole site static. (`/js/` is outside the immutable cache namespace precisely so this propagates.)

`data-visual-intensity="minimal|standard|cinematic|experimental"` on `<html>` lets CSS scale effects per route without per-page stylesheets.

## What is active now vs scaffolded

| Piece | State |
| --- | --- |
| Button press feedback, card lift/glow, split-tile mark lift | Active (CSS, gated) |
| Scroll reveal (shared observer, route-gated, reduced-motion-safe) | Active |
| CTA confirmation pulse on capture success; register-panel pulse on `seminar_checkout_unavailable`; main-fade on `purchase_redirect_started` | Active (listens on the local event seam; zero checkout logic touched) |
| Homepage hero ambient gradient drift (desktop, cinematic routes only, transform-only) | Active — this is the "premium without video" fallback |
| Video loop slot `data-video-loop="home-hero"` on the homepage hero | Scaffolded — placeholder entry, requests nothing |
| Lottie / Fable / inline-SVG / WebGL providers | Registered, blocked by design (`provider_not_implemented`) |
| Visual events | Active, local-only buffer |

## How Higgsfield video loops will be added

See the exact runbook in the final section of this doc's sibling: no code change is needed for the first homepage loop, only real files + a manifest edit.

1. Export the loop (target ≤ 4 MB, ≤ ~15 s, 1920×1080 H.264 MP4 + optional lighter mobile encode) and a poster JPEG/WebP frame.
2. Add files under `assets/media/` with **versioned filenames** (`home-hero-loop-v1.mp4`, `home-hero-poster-v1.jpg`) — the immutable cache then works for you; never reuse a filename for different content.
3. Edit `js/config/visual-system.js → videoLoops["home-hero"]`: `status: "available"`, real `src`/`poster`(/`mobileSrc`), real `fileSizeKb` and `duration` from the export.
4. Deploy. The loader activates it only on `/`, desktop, motion-allowed, near-viewport, within the 1-loop budget; mobile stays poster-first until `maxMobileVideoLoops` is raised deliberately.
5. Verify: `video_loop_requested/started` in `window.__tpaEvents`, no console errors, page renders identically with the file renamed away (fail-safe check).

For additional loops: add a new key, reference it from a `data-video-loop="<key>"` element, list the route in `allowedRoutes`. Cloudflare Stream/external providers require a governance decision first (new external host = CSP/privacy/cost surface) — the `provider` field exists so that decision is a config value, not a rewrite.

## How Fable 5 / Lottie assets will be added

1. Produce the real asset (Lottie `.json` ≤ 250 KB, or Fable export, or inline SVG animation).
2. Commit it under `assets/media/motion/` with a versioned filename.
3. Implement the provider path in `media-loader.js`/`motion-controller.js` for that provider (deliberately absent today so no dead code / no speculative dependency ships). For Lottie this is the moment a player dependency is evaluated — prefer `lottie-web` light build served locally, decided at that PR, not before.
4. Flip the manifest entry (`seminar-secured`, `mat-calc-reveal`, or a new key) to `status: "available"` with `src`, trigger, routes, fallback, and `reducedMotionBehaviour`.
5. QA per the checklist in the [budgets doc](./PRESSURE_ACADEMY_VISUAL_PERFORMANCE_BUDGETS.md): reduced-motion state, failure state (rename the file), no CTA dependency.

## Which routes can carry weight

Full table in [PRESSURE_ACADEMY_ROUTE_VISUAL_STRATEGY.md](./PRESSURE_ACADEMY_ROUTE_VISUAL_STRATEGY.md). Rule of thumb: cinematic is reserved for `/` and `/blueprints/` index; anything carrying a form or the future money step is standard; `/contact/` and fallback states are minimal; planner/mastery-method are out of bounds.

## How to disable motion

- **Globally:** `globalMotionEnabled: false` in `js/config/visual-system.js`.
- **Per route:** set that route's `intensity: "minimal"`, `allowScrollAnimation: false`, `allowAutoplayVideo: false`.
- **Per asset:** `status: "disabled"` in the manifest (never requested again, markup hooks stay inert).
- **Per user:** OS reduced-motion setting — always honoured, including mid-session.

## How to debug visual asset failures

1. Local preview or any URL with `?tpaDebug=1` → `media-loader` prints `[tpa-visual] … blocked: <reason>` console warnings (`placeholder`, `disabled`, `available_without_src`, `available_without_poster`, `route_not_allowed`, `over_budget`, `provider_not_implemented`). Production visitors get silence.
2. Inspect `window.__tpaEvents` for `visual_asset_*` / `video_loop_*` / `motion_disabled_*` entries (see [event register](./PRESSURE_ACADEMY_VISUAL_EVENT_REGISTER.md)).
3. Check `<html>` for `tpa-motion` + `data-visual-intensity` — absence means the gate (flag/reduced-motion) fired, not a bug.
4. A `video_loop_failed` with `reason: "media_error" | "source_error" | "autoplay_rejected"` means the file/URL is bad or the browser refused autoplay; the poster surface remains by design.

## Hard boundaries this layer must never cross

- No motion module may be imported by `cart.js`, `commerce-ui.js`, or the checkout adapter — dependency direction is motion → events, never commerce → motion.
- Checkout CTAs, forms, and navigation must render and function with `js/lib/media/*` and `tpa-motion.css` deleted outright.
- No manifest entry flips to `available` without a real file. No fake media, no fake proof, no athlete footage that does not exist.
- Operator-editable config stays under `/js/config/`; media binaries stay under `/assets/media/` with versioned names.
