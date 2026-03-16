# The Pressure Academy — Static Site Repo Structure v1

Date: 16 March 2026  
Status: Long-term asset-path deployment scaffold  
Purpose: Replace self-contained emergency HTML with a stable static-site structure that serves the homepage, privacy policy, logos, and OG image from predictable relative paths.

## Canonical contents in this scaffold
- `index.html` → homepage based on `TPA_Rebuild_Production_v6.1_fixed_js.html`
- `privacy-policy.html` → reviewed privacy policy draft aligned to current site styling
- `assets/logos/*.svg` → locked subsystem marks + patched Mastery Method mark
- `assets/social/TPA_OG_1200x630.png` → OG/Twitter preview image
- `docs/AI_ALIGNMENT.md` → current alignment truth for agents
- `prompts/COWORK_DEPLOYMENT_PROMPT_v1.md` → execution prompt for Cowork

## Locked decisions carried into this scaffold
- Website type system: DM Sans + JetBrains Mono
- Mastery gold: `#E8A838`
- Mastery Method mark uses brain outline + structured nodes + pressure plates
- Interaction architecture remains closed
- Relative asset paths must remain:
  - `assets/logos/*.svg`
  - `assets/social/TPA_OG_1200x630.png`
  - `privacy-policy.html`

## Goal of this scaffold
This package is not a redesign. It is the long-term deployment baseline so the site can load consistently without relying on embedded logos or ad-hoc folder placement.

## Expected repo root structure
```.
├── index.html
├── privacy-policy.html
├── assets/
│   ├── logos/
│   └── social/
├── docs/
│   ├── AI_ALIGNMENT.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   └── REPO_STRUCTURE.txt
├── prompts/
│   └── COWORK_DEPLOYMENT_PROMPT_v1.md
├── robots.txt
├── sitemap.xml
└── vercel.json
```

## Immediate next move
Hand this scaffold and the prompt in `prompts/` to Cowork and have it:
1. place the files into the actual GitHub repo root,
2. verify every asset path resolves on preview,
3. keep the current visual design intact,
4. redeploy after validation.


## Patch notes v1.1
- Blueprint loop progress now starts from Step 1 at the top of the ring.
- Planner sliders now show clear value references and formatted outputs.
- Planner feature cards have equal-height bordered containers so the AI coach reaction card sits cleanly in the grid.
