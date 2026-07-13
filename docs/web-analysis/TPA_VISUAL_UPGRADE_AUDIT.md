# The Pressure Academy - Visual Upgrade Audit

Date: 2026-07-13
Scope: thepressureacademy.com public commerce surfaces (homepage, /blueprints/, /shop/apparel/), assessed on the live repo at `main` (face746) via local QA server plus headless-Chrome capture at 1440 and 390 widths.
Method: settled-state screenshots (reduced-motion emulation so `[data-reveal]` sections render), plus a runtime probe of the visual layer (`html.tpa-motion` class, `data-visual-intensity`, video element state, image inventory, page errors).

This audit is the before-state baseline for the Higgsfield visual upgrade pass. It scores the site as it ships today, before any generated asset lands.

## Baseline evidence

Runtime probe of `/` (desktop 1440, before this upgrade):

- `html.tpa-motion` active, `data-visual-intensity="cinematic"` on the home route
- No `<video>` element present; manifest key `home-hero` is a placeholder and the loader correctly requests nothing
- `.hero-media` background-image: none (ambient gradient only)
- Total content images in `<main>`: 6, all decorative SVG lane marks, all `alt=""`
- Zero page errors, zero failed asset requests

The site has no photographic or filmic asset anywhere on the public surface. The only raster images in the repo are OG/social cards.

## Scores (before)

Scale 1-10. Scored against what a premium human-performance brand needs at first contact.

| Dimension | Score | Evidence and reasoning |
| --- | --- | --- |
| Hero impact | 6 | Strong Fraunces typographic hero and clear CTAs, but the surface is a flat gradient. Nothing signals training, family, or discipline visually. Reads clean yet placeholder. |
| Brand clarity | 8 | Voice is locked and consistent ("Built under pressure.", "Not motivation. Architecture."), lockup and marks coherent, fail-honest authority ticker. Copy carries the brand; visuals do not yet. |
| Emotional engagement | 4 | Zero human-context imagery. No mats, no planner, no home-learning table, no gear. The emotional register lives entirely in words. |
| Product-lane separation | 5 | Four commerce tiles are structurally present but visually identical dark cards distinguished only by small SVG marks and kickers. The wider-house arms (Planner, Mastery Method) are text-only cards. |
| Mobile experience | 7 | Clean stacked layout, working nav, no heavy payloads. Same flatness as desktop; nothing broken. |
| Image quality | 2 | No photographic assets exist on the public site at all. This is the single largest gap. |
| Motion quality | 6 | Governed motion layer is live and disciplined (scroll reveals, ambient hero drift, hover lifts, fail-closed video loader, reduced-motion hard stop). No media motion exists yet because no media exists. |
| Performance risk | 9 | Before-state risk is very low: near-zero media payload, no autoplay video, initial render depends on no media. The upgrade must not spend more than the governed budgets (4000 KB max video, poster required, mobile poster-first). |
| Claim safety | 9 | Copy is disciplined: "first drop in development", "announced when they are real", no outcome guarantees, no fake social proof. Flag: pre-existing em dashes exist across live page copy, which conflicts with the house punctuation rule; out of scope for this pass and listed under Not changed. |
| Conversion readiness | 7 | Funnels are wired (cart, Formspree captures, seminar two-step, mat calculator path). The flat first screen under-sells conviction before the scroll. |

## What this pass targets

1. Hero: one governed cinematic loop (manifest key `home-hero`), poster-first, desktop-only autoplay, mobile stays poster.
2. Wider-house section: per-lane photographic identity for Pressure Planner, Mastery Method, and a new AcademyTalon founder-testing teaser card.
3. Lane pages: one editorial image band each for /blueprints/ (grappling system scene) and /shop/apparel/ (Pressure Tested proof-of-work scene).
4. No change to checkout, forms, nav, or any money path. Motion stays enhancement, never infrastructure.

## What this pass deliberately does not target

- Mats and seminars lane imagery (next asset batch; keeping the four commerce tiles uniform until all four have assets)
- 9:16 social exports (generated later from the same prompt pack)
- Site-wide em dash cleanup of pre-existing copy (separate governed copy pass; a branch for punctuation audit already exists)
- Any WebGL, Lottie, or additional autoplay surfaces

## After-state (validated 2026-07-13)

Validated on `feature/tpa-higgsfield-visual-upgrade` with the same probes as the
baseline: headless Chrome settled-DOM dumps and screenshots at 1440 and small
widths, live runtime probes, route sweep, and copy scans. Asset facts live in
`docs/design/TPA_VISUAL_ASSET_MANIFEST.md`.

Evidence:

- Organic desktop activation: headless 1440 load ends with `html.tpa-motion`,
  `data-visual-intensity="cinematic"`, `.has-video` on the hero slot, and
  exactly one `video.tpa-video-loop` element. Playback probe: unpaused,
  clock advancing in real time, decode 1268x724, `readyState 4`, looping,
  muted, no media error.
- Mobile 390: settled DOM contains no video element and no `has-video`;
  poster and stills only, `tpa-motion` still on for lightweight CSS motion.
  No horizontal overflow (`scrollWidth` equals viewport at 375 and 390).
- Reduced motion (forced via Chrome flag): no `tpa-motion` class, no video,
  all 16 `[data-reveal]` targets force-revealed. Static baseline holds.
- Routes: 9 key pages plus the three new asset URLs all 200. Zero console
  errors on the three edited pages. Card images lazy-load with correct
  natural dimensions; hero poster ships `fetchpriority=high`.
- Copy scans: zero em dashes in newly authored copy (the single em dash in
  the diff is a pre-existing apparel truth-note sentence that moved during
  markup wrapping). Forbidden-claims scan matches only the governance docs
  that ban those claims. AcademyTalon appears only as "in founder testing".
- Budgets: video 3780 KB against the 4000 KB ceiling, poster 162 KB, stills
  137 to 244 KB. Runtime resolver re-checks the video budget on every load.

Scores after (movement against the baseline table):

| Dimension | Before | After | Why |
| --- | --- | --- | --- |
| Hero impact | 6 | 9 | Cinematic poster surface plus governed desktop loop behind the directed "Systems for people who perform under pressure." hero. |
| Emotional engagement | 4 | 8 | Five scene assets place training, planning, home learning, and academy operations into the page. Mats and seminars lanes still text-only, so not higher. |
| Product-lane separation | 5 | 8 | Wider-house arms now carry distinct photographic identities plus the AcademyTalon teaser; the four commerce tiles stay uniform by design until batch 2. |
| Image quality | 2 | 9 | Seven review-gated 2K-source assets; no faces, no fake text, no logos. |
| Performance risk | 9 | 8 | Slightly more payload than the near-zero baseline, but every heavy asset is gated: `preload=none`, viewport-lazy, desktop-only autoplay, poster-first mobile, fail-closed on error. |
| Claim safety | 9 | 9 | New copy adds founder-testing boundaries; scans confirm no regressions. |

QA environment notes for future sessions:

- The embedded Browser pane suppresses IntersectionObserver callbacks (and
  native `loading=lazy` fetches), so governed video never activates there.
  That is the pane, not the site: prove activation with a headless Chrome
  DOM dump instead.
- Windows clamps Chrome's minimum window width around 500 px, so headless
  screenshots requested narrower than that render a wider layout cropped at
  the right edge. Measure layout with in-page `scrollWidth` probes and shoot
  small-viewport proofs at 500 px.
- The tpa-media QA server (this session's `tpa-media-qa` launch entry) adds
  mp4/webm MIME and HTTP Range support that the older tpa-commerce QA server
  lacks; video QA against the old server false-fails.
