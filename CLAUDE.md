# CLAUDE.md — The Pressure Academy

## What This Repo Is

This is the static website for **The Pressure Academy** (thepressureacademy.com). It is a premium, systems-led coaching and wellness business. The primary commercial focus is launching the **Pressure Planner** digital product.

## Business Boundaries

- This repo is for The Pressure Academy ONLY
- Do NOT mix in Pressure Systems, LiftIQ, Raymonds Lift & Shift, or any unrelated brands
- The ecosystem includes: Pressure Planner, Pressure Blueprint, Mastery Method, Pressure Tested, Pressure Over Force — all under the TPA umbrella
- The Pressure Planner is the PRIMARY revenue product. All other ecosystem elements support it.

## Stack

- Static HTML/CSS/JS (no build system)
- Deployed on Vercel
- Forms via Formspree
- Fonts: DM Sans + JetBrains Mono (Google Fonts)
- Animation: GSAP 3.12.7 (CDN)
- No backend, no database, no auth

## Architecture Priorities

1. Product launch readiness (Pressure Planner)
2. Conversion path clarity (hero → product → CTA → capture)
3. Mobile-first responsive design
4. Accessibility (WCAG 2.1 AA baseline)
5. Performance (minimal dependencies, CDN assets)
6. SEO fundamentals

## Design Standards

- Dark theme: `--bg: #0A0A0A`, `--cream: #FFF8F0`
- Primary accent: `--rust: #C45B28`
- Secondary accent: `--gold: #E8A838`
- Fonts: DM Sans (body), JetBrains Mono (code/badges)
- Border radius: 18px (large), 12px (small)
- Premium, disciplined, systems-driven aesthetic
- NO cheap template patterns, stock photo grids, or generic gym aesthetics

## File Structure

```
index.html          — Homepage (all CSS/JS inline)
privacy-policy.html — Privacy policy
assets/logos/        — SVG brand marks (locked — do not regenerate)
assets/social/       — OG image
docs/                — Architecture, decisions, deployment docs
vercel.json          — Vercel config (cache headers)
robots.txt           — SEO
sitemap.xml          — SEO
```

## Locked Assets — Do Not Modify

- All files in `assets/logos/` — these are approved brand marks
- `assets/social/TPA_OG_1200x630.png` — approved OG image
- Font choices: DM Sans + JetBrains Mono
- Colour system (rust, gold, cream, bg values)

## Coding Standards

- All CSS and JS is currently inline in `index.html` — maintain this pattern until a deliberate extraction is planned
- Use semantic HTML5 elements
- Include `aria-label` on interactive elements
- Support `prefers-reduced-motion`
- Use CSS custom properties for theming
- Keep GSAP animations performance-safe (transform/opacity only)

## Privacy and Minors

- The Mastery Method targets children ages ~3-15
- Guardian/parent involvement is required for child-related features
- Do not collect child data without consent mechanisms
- Privacy policy is at `privacy-policy.html` — keep it aligned with actual capabilities
- Do not fabricate legal claims or compliance statements

## Deployment Rules

- Site deploys via Vercel from the repository
- Do NOT commit secrets, API keys, or credentials
- All asset paths must be relative (no absolute filesystem paths)
- Test all changes work with relative paths from repo root
- Verify logo rendering, privacy policy link, and OG image after any structural change

## Formspree Forms

- Endpoint: `https://formspree.io/f/meerjgde`
- Each form includes a hidden `intent` field to segment submissions
- Intents: `planner-access`, `blueprint-info`, `mastery-enquiry`, `academy-updates`
- Each form includes a hidden `source` field for tracking

## Definition of Done

A change is done when:
1. HTML is valid and renders correctly
2. All relative asset paths work
3. Mobile layout is responsive
4. Accessibility basics are maintained
5. No broken links
6. Privacy policy link works
7. Forms submit correctly
8. No secrets committed
