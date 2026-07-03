# Pressure Academy Visual QA Report

Status: `COMPLETE — VISUAL PERFORMANCE LAYER v1 QA`
Date: 3 July 2026
Scope: technical QA of the Visual Performance Layer (audit, governance architecture, media manifest, motion baseline, video-loop scaffolding, visual events). Every result below was produced by an actual command or live browser check on this date.

## 1. Commands run

| Check | Command / method | Result |
| --- | --- | --- |
| JS syntax | `node --check` on all 6 new modules (`js/config/visual-system.js`, `js/lib/media/{reduced-motion,visual-events,media-loader,video-loops,motion-controller}.js`) | **6/6 OK** |
| Module graph | `node -e "import(...)"` of `motion-controller.js` (pulls the full dependency graph incl. `events.js`) | imports cleanly, exports present |
| Route resolution | Node truth-table over `resolveRouteVisual()` — 13 paths incl. `/planner`, `/mastery-method/`, unknown | **13/13 match the strategy doc** (out-of-scope paths fall to `minimal` default) |
| Static serve | Session-local QA server on port 4362 mirroring the three `vercel.json` slug rewrites | up |
| Routes | `curl` sweep: 13 pages + 8 asset/module URLs | **21/21 → 200** |
| Browser QA | Preview browser (desktop + 375×812), plus headless Chrome for forced states | below |

## 2. Motion checks

- `<html>` gets `class="tpa-motion" data-visual-intensity="cinematic"` on `/`, `standard` on shop/seminar/blueprint surfaces — verified live.
- Scroll reveal: 15/15 homepage `[data-reveal]` blocks reveal on scroll (shared controller observer; the 3 duplicated inline observers were removed).
- CTA confirmation feedback verified on `/seminars/founding-pressure-seminar/`: `lead_captured` → form pulses (`tpa-confirm-pulse`), `seminar_checkout_unavailable` → register panel pulses; both buffered `motion_interaction_triggered`. (Simulated through the same module instance via `track()` — no live Formspree submit was sent.)
- Ambient hero drift renders behind hero content; hero CTAs unobstructed (`pointer-events: none` surface, content at `z-index: 1`).

## 3. Video checks

- No video file exists in the repo; the manifest's only entry (`home-hero`) is `status: "placeholder"`.
- Full homepage network log inspected: requests = Google Fonts, 2 stylesheets, SVG logos, ES modules. **Zero video requests, zero requests for placeholder/disabled assets, zero failed requests.**
- Hero slot `data-video-loop="home-hero"` present, contains no `<video>` element (loader correctly refused to activate a placeholder).

## 4. Reduced-motion checks (headless Chrome `--force-prefers-reduced-motion`)

- Forced reduce: `<html lang="en">` — **no** `tpa-motion` class, **no** intensity attribute; all 15 `[data-reveal]` blocks force-marked `revealed` (content fully visible, zero animation).
- Control run (no flag): class + `data-visual-intensity="cinematic"` present.
- Belt-and-braces `@media (prefers-reduced-motion: reduce)` block additionally neutralises pulses/drift/press states and hides loop videos even if the class ever slipped through.

## 5. No-JS baseline (the pre-existing defect, now fixed)

Loaded `/` in a scripts-blocked sandbox iframe: `tpa-motion` absent, first `[data-reveal]` computed `opacity: 1` / `transform: none`, intake form panel visible. Before this layer, `tpa-commerce.css` hid all `[data-reveal]` content permanently without JS (21 blocks across 3 pages, including the homepage intake form). Fixed via the `html:not(.tpa-motion)` guard in `tpa-motion.css` — no edit to the QA'd `tpa-commerce.css`.

## 6. Global kill switch

`globalMotionEnabled: false` → headless run shows no `tpa-motion` class and all 15 reveal blocks immediately `revealed` (static, visible). Flag restored to `true` afterwards; `node --check` re-verified.

## 7. Conversion-path regression checks

- **Apparel:** 4 product cards, 4 `product_viewed` events, 0 fake buy buttons (4 drop-list CTAs), cart drawer opens (`display: flex`) and closes (`none`).
- **Mats:** calculator reproduces the known-good result (8×6 m → "35 jigsaw mats (7 x 5)", 0.5 m wall clearance); enquiry form present, governed endpoint `meerjgde`.
- **Seminar slug page:** interest state renders, hidden `intent=seminar-interest` + governed endpoint intact, honest "no payment is taken" note, no buy button.
- Formspree endpoint IDs, checkout adapter, `vercel.json`, `api/*`, `sitemap.xml`, `llms.txt`, `.env.example` — **untouched** (no new public routes were added, so no sitemap change is due).

## 8. Console and responsive results

- **Zero console errors and zero warnings** across every page exercised (`/`, shop ×3, seminars ×2, blueprints ×2, campaigns fallback, contact, academy-orders).
- 375 px width: **zero horizontal overflow on all 10 public pages** (documented `scrollWidth` ≤ viewport on each).

## 9. Visual events buffer only locally

`window.__tpaEvents` inspected before/after interactions: visual events appear in the local buffer alongside commerce events; no network sender exists (`registerSender` seam carries only the local CSS-feedback listener added by the controller). Nothing leaves the browser.

## 10. Honesty sweep

- No media file, poster, or URL was invented; every video/file-based manifest entry is `placeholder` with `src: null`.
- No athlete footage, product renders, proof, scarcity, or checkout claims were added anywhere.
- Placeholder copy in the manifest describes slots, not assets.

## 11. Defects found during QA and their resolution

1. **Pre-existing no-JS reveal blackout** — found in Phase 1, fixed by the `html:not(.tpa-motion)` guard, proven in §5.
2. **Ambiguous first kill-switch measurement (QA-harness artifact, no code defect).** The first grep counted matching lines in a DOM dump and read as if reveals were missing; re-measured with token counting: kill switch behaves exactly as designed (§6).
3. No other defects found; nothing else was patched.

## 12. Remaining blockers

- **No measured performance baseline** (no Lighthouse tooling in repo — pre-existing). Budgets are structural rules; a measurement pass on the real Vercel deployment is operator-owned.
- **Real-device pass** (physical phone, actual deployment, real autoplay policies) is operator-owned; local QA mirrors rewrites but is not Vercel.
- **First real assets do not exist yet**: Higgsfield loop + poster, Fable 5/Lottie files. Activation runbooks are in the architecture doc; flipping any manifest entry to `available` before the file exists is prohibited.
- **Formal accessibility audit** still outstanding (inherited standing blocker; this layer adds `aria-hidden` decorative surfaces and honours reduced-motion, but that is not a WCAG audit).
- **Committed 3 July 2026 under operator direction** as two clean commits: the commercial platform + first-dollar funnel first, this visual layer second (pages verified byte-identical to the QA'd state after re-application). Push/deploy remains operator-owned. The in-flight LiftIQ-retirement working state stays uncommitted and untangled.
