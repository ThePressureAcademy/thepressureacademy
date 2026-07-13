# The Pressure Academy - Visual Asset Manifest (v1)

Human register for the Higgsfield asset system shipped by the
`feature/tpa-higgsfield-visual-upgrade` pass. The runtime authority for what
actually loads is `js/config/visual-system.js` (governed manifest, fail-closed
loader); this document records provenance, review results, and placement so no
future session has to reverse-engineer where an asset came from.

Authority order: repo code, then `visual-system.js`, then this register, then
the prompt pack. If they disagree, code wins.

## Generation batch v1

- Generated: 2026-07-12 (single Higgsfield batch, one video follow-up)
- Still model: `recraft_v4_1`, 2K exports, shared palette seed
  `#0B0809 / #C45B28 / #F3D7B2 / #A08E83`
- Video model: `kling3_0_turbo`, 8 seconds, 720p, seeded with the hero poster
  still as its start frame (`start_image: a5862bab`), which is why the loop
  layers over the poster at full opacity without a visible seam
- Prompts: `docs/design/TPA_HIGGSFIELD_PROMPT_PACK.md` (verbatim)

## Shipped assets

All files live in `/assets/media/` and are immutable-cached for a year. Never
edit a file in place; a changed asset is a new `-v2` filename plus updated
references.

| File | Dimensions | Size | Source job | Placement |
| --- | --- | --- | --- | --- |
| tpa-hero-pressure-poster-v1.jpg | 1920x1097 | 162 KB | a5862bab | Homepage hero poster (always-on surface, `fetchpriority=high`) |
| tpa-hero-pressure-loop-v1.mp4 | 1280x720, 8 s | 3780 KB | 5d255656 | Homepage hero loop via manifest key `home-hero` (desktop only, gated) |
| pressure-planner-readiness-v1.jpg | 1200x1543 | 203 KB | d8875c19 | Homepage wider-house card: Pressure Planner |
| mastery-method-home-learning-v1.jpg | 1600x914 | 137 KB | 6290df0c | Homepage wider-house card: Mastery Method |
| academytalon-founder-testing-v1.jpg | 1600x914 | 140 KB | c75fb93a | Homepage wider-house card: AcademyTalon teaser |
| pressure-blueprint-grappling-v1.jpg | 1920x1097 | 222 KB | 47eda281 | `/blueprints/` media band (21:9 crop via CSS) |
| pressure-tested-apparel-v1.jpg | 1200x1543 | 244 KB | 75164732 | `/shop/apparel/` page-hero figure (4:5 portrait) |

## Review gate record

Every asset was inspected at full resolution before implementation for fake
readable text, faces, logos, uncanny anatomy, and claim-creating scenes.

- Passed first review: poster, planner, mastery method, blueprint, apparel.
- Rejected: AcademyTalon attempt 1 (job `f93f5cdf`). The prompt allowed
  "abstract grid marks" and "unreadable labels", and the render produced
  text-like artifacts on the clipboard and grading board that read as blurred
  real writing. Superseded, never shipped.
- Regenerated and passed: AcademyTalon attempt 2 (job `c75fb93a`) with the
  prompt rewritten to force completely blank paper surfaces and plain
  belt-tone strips. Verified: cards and clipboard sheet are blank, board reads
  as colour strips only, no faces, no logos.
- No asset depicts people, children, customers, testimonials, or real academy
  footage. All scenes are object still-lifes.

## Budgets and known tradeoffs

- Hero video is 3780 KB against the manifest's 4000 KB ceiling; the loader
  also enforces this at runtime and blocks over-budget entries.
- The loop is 720p under a 1080p poster. Accepted tradeoff: the scrim, film
  grain, and near-static camera hide the resolution gap, and 1080p would have
  broken the size budget. Revisit only with a lighter codec.
- MP4 only for v1. The WebM sibling from the original plan is deferred:
  Higgsfield exports MP4, MP4 plays everywhere the site supports, and a
  transcode pass without a quality gate is not worth the risk this round.
- Mobile never autoplays video (`maxMobileVideoLoops: 0`); phones get the
  poster and stills only. Raising that budget is an operator decision.

## Regeneration rules

1. New or replacement imagery starts from the prompt pack, not from scratch.
2. Every candidate passes the review gate above before it touches the repo.
3. Replacement files take a bumped `-vN` name; `/assets/` is immutable-cached,
   so overwriting a served filename ships stale caches forever.
4. Update this register and, for motion assets, `js/config/visual-system.js`
   in the same change.
