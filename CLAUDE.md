# CLAUDE.md — The Pressure Academy

This file describes the codebase structure, conventions, and workflows for AI assistants working in this repository.

---

## Project Overview

The Pressure Academy (TPA) is a static marketing/product demonstration site for a BJJ-rooted performance and learning system. The site is persona-aware, highly interactive, and deployed to Vercel. There is no backend, no database, and no build step — it is pure HTML/CSS/JS.

**Current canonical version:** v6.7 (`TPA_Rebuild_Production_v6.7_vibrant_glow_control_positions.html`)

---

## Repository Structure

```
/
├── index.html               # Complete homepage (3700+ lines, self-contained)
├── privacy-policy.html      # Privacy policy page
├── robots.txt               # SEO robots config
├── sitemap.xml              # XML sitemap
├── vercel.json              # Vercel deployment headers config
├── assets/
│   ├── logos/               # SVG subsystem marks (locked — do not modify)
│   │   ├── TPA_House_Mark.svg
│   │   ├── TPA_House_Favicon.svg
│   │   ├── Mastery_Method_Mark.svg
│   │   ├── Pressure_Blueprint_Mark.svg
│   │   ├── Pressure_Planner_Mark.svg
│   │   ├── Pressure_Over_Force_Mark.svg
│   │   ├── Pressure_Tested_Mark.svg
│   │   └── *_mono.svg variants for each mark
│   └── social/
│       └── TPA_OG_1200x630.png   # Open Graph image
└── docs/
    ├── AI_ALIGNMENT.md           # Canonical build state and version info
    ├── DEPLOYMENT_CHECKLIST.md   # Pre-commit and pre-deploy verification
    └── REPO_STRUCTURE.txt        # File tree documentation
```

**All asset paths must be relative** (e.g., `assets/logos/TPA_House_Mark.svg`). Never use absolute local paths.

---

## Technology Stack

- **HTML5** — semantic, with ARIA labels and skip-link for accessibility
- **CSS3** — embedded in `<style>` in `index.html`; 2100+ lines using CSS custom properties
- **Vanilla JavaScript** — embedded in `<script>` in `index.html`; ~600 lines
- **GSAP 3.12.7** — animation library loaded from Cloudflare CDN (ScrollTrigger, ScrollToPlugin)
- **Google Fonts** — DM Sans + JetBrains Mono (loaded via `<link>`)
- **Formspree** — external service for lead capture form submissions
- **Vercel** — static hosting with custom cache headers

No npm, no build tooling, no TypeScript, no frameworks.

---

## Locked Design Decisions

These are non-negotiable. Do not change them without explicit instruction.

### Typography
- **Body / UI:** DM Sans (weights 400, 500, 600, 700, 800)
- **Code / Labels:** JetBrains Mono (weights 400, 500)

### Color Palette
| Variable | Value | Role |
|---|---|---|
| `--rust` | `#C45B28` | Primary brand / CTA |
| `--cream` | `#FFF8F0` | Light text / backgrounds |
| `--gold` | `#E8A838` | Mastery gold accent |
| `--green` | `#5BA85B` | Success / progress |
| `--teal` | `#4A9B8E` | Focus tab theme |
| `--violet` | `#8B6AAE` | Connection tab theme |
| `--coral` | `#D4726A` | Creativity tab theme |
| `--ink` | `#0A0A0A` | Deep background |

### Logos / Marks
- All SVG marks in `assets/logos/` are locked. Do not alter, rename, or replace them.
- The Join section uses real subsystem SVG marks — not emoji or placeholder icons.

---

## index.html Architecture

The homepage is monolithic by design. All CSS and JS live in the single file. Sections in order:

1. **`<head>`** — meta tags, OG/Twitter cards, structured data (JSON-LD), font links, GSAP CDN
2. **`<style>`** — complete CSS design system
3. **`<body>`**
   - `#skip-link` — accessibility skip navigation
   - `<nav>` — sticky nav with persona pills
   - `#hero` — entry point with persona selector
   - `#ecosystem` — interactive node map of TPA subsystems
   - `#planner` — performance score calculator (6 sliders)
   - `#blueprint` — circular 7-step BJJ control loop
   - `#chains` — technical progression chains with SVG links
   - `#mastery` — 4-tab mastery method metrics
   - `#proof` — filterable social proof cards
   - `#join` — lead capture forms (Formspree)
   - `<footer>`
4. **`<script>`** — all interactivity (IIFE-wrapped)

---

## JavaScript Architecture

All JS is inside an IIFE for scope isolation. Key patterns:

### State Variables
```js
let activePersona = 'shift-worker';   // current persona
let activeShift = 'day';             // shift type for planner
let loopIndex = 0;                   // blueprint auto-play index
```

### Persona System
Four personas drive content adaptation across sections:
- `shift-worker` — default, shift-aware scoring
- `grappler` — BJJ training boost in planner
- `parent` — family variable boost in planner
- `learner` — general learner path

Data attributes used: `data-persona`, `data-filter`, `data-tab`, `data-preset`, `data-shift`, `data-step`

### Ecosystem Data (`ecoData` object)
Each subsystem brand has: `kicker`, `title`, `desc`, `benefit`, `meta`, `cta`
Brands: `planner`, `blueprint`, `mastery`, `tested`, `force`, `academy`

### Planner Scoring
- 6 input sliders: `sleep`, `training`, `nutrition`, `stress`, `hydration`, `family`
- Weights shift by `activeShift` (day/night/rotating) and `activePersona`
- Score 0–100 maps to 4 performance bands
- Function: `calculatePlannerScore()`, `getScoreBand()`

### Blueprint Loop
- 7 BJJ control positions arranged in a circle (cos/sin math for positioning)
- Auto-plays every 2200ms via `setInterval`
- **Step 4 = Chest on Chest**, **Step 5 = Chest on Back** (locked in v6.7)

### Chains
- 5 control positions with SVG paths drawn between steps
- Relationships: 1→2, 2→3, 2→4, 4→5

### Mastery Method Tabs
- `focus` (teal), `achievement` (gold), `creativity` (coral), `connection` (violet)
- Each tab has: kicker, title, description, tags, 3 metrics

### GSAP Animations
- ScrollTrigger for reveal animations on `.reveal` elements
- Smooth scroll via ScrollToPlugin on nav links
- Timelines for hero entrance

---

## CSS Conventions

- **CSS custom properties** for all colors, spacing, and typography
- **`clamp()`** for fluid responsive sizing
- **Mobile-first** with breakpoints at `960px` and `640px`
- **`prefers-reduced-motion`** respected — all GSAP animations gated
- **Component naming:** BEM-adjacent flat classes
  - Buttons: `.btn`, `.ghost-btn`
  - Cards: `.stat-card`, `.proof-card`, `.feature-card`, `.funnel-card`
  - Pills: `.persona-pill`, `.path-pill`, `.shift-pill`, `.eyebrow`
  - Nodes: `.eco-node`, `.loop-node`, `.chain-step`
  - Animation trigger: `.reveal`
- **Interactive card glow:** `ambientInteractiveGlow` + `interactiveBorderPulse` keyframes — glow extends beyond card edge on dark backgrounds (v6.7 feature, do not remove)

---

## Deployment

**Platform:** Vercel (static, no build command)

**Required files at deploy root:**
```
index.html
privacy-policy.html
assets/logos/*.svg (all marks)
assets/social/TPA_OG_1200x630.png
robots.txt
sitemap.xml
vercel.json
```

**Cache headers** (configured in `vercel.json`):
- `assets/**` — `Cache-Control: public, max-age=31536000, immutable`
- All routes — `X-Content-Type-Options: nosniff`

**Pre-deploy checklist** (see `docs/DEPLOYMENT_CHECKLIST.md`):
- [ ] All asset paths resolve (no broken images/SVGs)
- [ ] `privacy-policy.html` loads correctly
- [ ] OG image returns HTTP 200
- [ ] No absolute local paths in HTML
- [ ] Homepage loads on Chrome, Safari, Brave
- [ ] All interactive sections function (persona switch, planner sliders, blueprint loop, chains, mastery tabs, proof filter, join forms)
- [ ] Logo SVGs render from `/assets/logos/`

---

## Accessibility

- Skip link (`#skip-link`) at top of body for keyboard navigation
- `aria-label` on all interactive elements
- `aria-live` regions for dynamic content updates
- `focus-visible` styling: `2px solid var(--rust)` outline
- All animation respects `prefers-reduced-motion`

---

## SEO

- Canonical URL: `https://thepressureacademy.com/`
- JSON-LD structured data: `Organization`, `WebSite`, `Product`
- OG/Twitter meta tags with `assets/social/TPA_OG_1200x630.png`
- `sitemap.xml` references both `index.html` and `privacy-policy.html`
- `robots.txt` points to sitemap

---

## What NOT to Do

1. **Do not add a build system** (webpack, vite, rollup, etc.) — this is intentionally build-free
2. **Do not split index.html** into components or multiple files — monolith is by design
3. **Do not change font families** (DM Sans + JetBrains Mono are locked)
4. **Do not alter color variables** without explicit instruction, especially `--gold: #E8A838`
5. **Do not rename or replace SVG marks** in `assets/logos/`
6. **Do not use absolute paths** for any local assets
7. **Do not reopen the core JS architecture** — add behavior incrementally, don't restructure
8. **Do not add a backend** — Formspree handles all form submission
9. **Do not change Blueprint step 4/5 labels** (Chest on Chest / Chest on Back) — locked in v6.7
10. **Do not remove the interactive card glow system** — ambient glow is a deliberate v6.7 UX feature

---

## Version History Reference

| Version | Key Change |
|---|---|
| v6.1 | Initial deployment scaffold baseline |
| v6.6 | Visual interaction polish (pre-glow) |
| v6.7 | Stronger orange+cream illumination; Blueprint control positions restructured |

Current source of truth for version state: `docs/AI_ALIGNMENT.md`
