# Pressure Academy Visual Performance Budgets

Status: `ACTIVE — VISUAL PERFORMANCE LAYER v1`
Date: 3 July 2026

No Lighthouse/measurement tooling exists in this repo (pre-existing, documented in the QA report). These budgets are therefore **structural rules the code enforces or the manifest declares**, not measured millisecond targets. They bind every future media addition; a real measurement pass is a standing blocker.

## Non-negotiable global rules (enforced in code)

1. Initial render never depends on video, animation, or any manifest asset (`initialRenderMayDependOnMedia: false`; video is injected post-load, near-viewport only).
2. Every route works with `js/lib/media/*` and `tpa-motion.css` absent — static baseline is the floor, including no-JS (`html:not(.tpa-motion)` reveal guard).
3. Max **1** autoplaying video above the fold on any route (`maxDesktopVideoLoops: 1`); mobile default **0** (`maxMobileVideoLoops: 0`, poster-first).
4. Autoplay never under reduced-motion, never on `minimal` routes, never on save-data/low-power clients.
5. Video without a poster cannot go `available` (`videoRequiresPoster: true`).
6. Video files: ≤ 4 MB declared (`maxVideoFileSizeKb`); motion assets (Lottie/SVG): ≤ 250 KB. Over-budget = skipped + `visual_asset_failed`.
7. Checkout CTAs and forms are plain DOM — never inside WebGL, canvas, or animation-required components (`allowWebGL: false` everywhere today).
8. Heavy media lazy-loads via IntersectionObserver (`rootMargin: 200px`), pauses offscreen.
9. Unknown/missing/placeholder/disabled media = zero network requests, silent static fallback (dev-only console warning).
10. Reduced-motion users get stable static UI: no reveal offsets, no pulses, no drift, `video { display: none }` backstop.

## Per-route budgets

| Route | Intensity | Autoplay video | Scroll reveal | Notes |
| --- | --- | --- | --- | --- |
| `/` (homepage) | cinematic | 1 desktop / 0 mobile | yes | Hero loop slot only. Ambient gradient drift is the video-less fallback, desktop-only, transform-only. Fonts remain the heaviest baseline cost. |
| `/shop/`, `/shop/apparel/`, `/shop/mats/` | standard | none | yes | Product imagery (when real) stays `loading="lazy"`. Mat calculator and enquiry form must be interactive before any media finishes. |
| `/seminars/`, `/seminars/[slug]` | standard | none | yes | Money path. Registration/checkout panel renders from config synchronously; motion limited to micro-feedback. Any future event film = click-to-play, never autoplay. |
| `/blueprints/` | cinematic | allowed by config, no slot wired yet | yes | Aspirational surface; may take a loop later within global budgets. |
| `/blueprints/[slug]` | standard | none | yes | Conversion surface. |
| `/campaigns/[slug]` | standard | none | yes | Ad landing: fast first paint beats spectacle; keep to micro-feedback. |
| `/academy-orders/` | standard | none | yes | B2B enquiry form is the point of the page. |
| `/contact/` | minimal | none | no | Utility page: CTA confirm pulse only. |
| `/privacy-policy.html` | (defaults to minimal) | none | no | Not wired; inherits nothing. |
| `/planner`, `/mastery-method/**` | out of scope | — | — | Do not wire this layer without a specific directive. |

## Mobile budget

- Poster-first: `maxMobileVideoLoops: 0` until the operator deliberately raises it after real-device testing.
- No cursor-follow, no parallax, no scroll-jacking (not implemented anywhere; keep it that way).
- Ambient hero drift disabled under 769 px (battery).
- 375 px must stay horizontal-overflow-free (verified in this layer's QA).

## Reduced-motion budget

- `respectReducedMotion: true` is permanent. Double enforcement: controller withholds `html.tpa-motion`, and `@media (prefers-reduced-motion: reduce)` neutralises motion rules and hides loop videos even if the class slips through.
- Mid-session OS changes take effect without reload.

## Failure fallback policy

| Failure | Behaviour |
| --- | --- |
| Video error / autoplay rejected | `video_loop_failed` buffered; element reverts to poster/gradient permanently for the session; no retry loop |
| Manifest entry `available` but src/poster missing | Blocked at resolve; dev warning; static surface |
| Asset over declared budget | Skipped; `visual_asset_failed`; page renders on |
| Whole layer fails to import | Page renders static; forms/checkout/nav unaffected (they never import it) |
| Malformed operator route pattern | Pattern skipped; default minimal posture applies |

## Change control

Raising any budget number, enabling mobile autoplay, adding an `experimental` route, or introducing a media dependency (Lottie player, stream provider) is an operator decision recorded in this doc + the manifest in the same change. Do not raise budgets inside an unrelated PR.
