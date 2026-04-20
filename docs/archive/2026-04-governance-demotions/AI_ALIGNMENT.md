> [!WARNING]
> ARCHIVED - NOT CANONICAL.
> This document refers to old standalone build artifacts and pre-governance assumptions. Do not use it to guide current implementation.
> Use [../../../CLAUDE.md](../../../CLAUDE.md), [../../REPO_GOVERNANCE_AND_ENDPOINTS.md](../../REPO_GOVERNANCE_AND_ENDPOINTS.md), and [../../DOC_AUTHORITY_INDEX.md](../../DOC_AUTHORITY_INDEX.md).

# TPA AI Alignment — v6.7

## Canonical build state
- Current canonical homepage candidate: `TPA_Rebuild_Production_v6.7_vibrant_glow_control_positions.html`
- Repo scaffold package: `TPA_Repo_Static_Structure_v1.5_vibrant_glow_control_positions.zip`
- This supersedes v6.6 for visual-interaction polish.

## What changed in v6.7
1. Interactive structural cards now carry a stronger orange + cream illumination system.
   - Ambient glow is visible at idle on structural cards.
   - Hover / focus / active states pulse brighter and feel more premium.
   - Glow is allowed to extend beyond the card edge so interaction is visible on dark backgrounds.
2. Blueprint control positions were restructured.
   - Step 4 is now `Chest on Chest`.
   - Step 5 is now `Chest on Back`.
   - Loop panel data, descriptions, and badges were updated to match this control taxonomy.
3. No logo paths were changed.
4. No privacy-policy pathing was changed.
5. No core JS architecture was reopened.

## Locked visual rules
- Fonts remain `DM Sans` + `JetBrains Mono`.
- Mastery gold remains `#E8A838`.
- TPA house mark and subsystem marks remain locked.
- Join section continues using real subsystem marks, not emoji icons.

## Deployment notes
- Deploy with the full repo structure, not a lone HTML file, if the build references `/assets/...`.
- Required files at deploy root:
  - `index.html`
  - `privacy-policy.html`
  - `assets/logos/...`
  - `assets/social/TPA_OG_1200x630.png`
  - `robots.txt`
  - `sitemap.xml`
  - `vercel.json`

## UX intent for v6.7
- Structural cards should feel alive, premium, and obviously interactive.
- Control positions in Blueprint should read clearly across grapplers, parents, and non-specialist visitors.
- The site should sell a responsive product, not look like a static brochure.
