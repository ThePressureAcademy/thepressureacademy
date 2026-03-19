# The Pressure Academy

**[thepressureacademy.com](https://thepressureacademy.com)**

Static website for The Pressure Academy — home of the **Pressure Planner**, a daily performance scoring system for shift workers, grapplers, and parents.

## Quick Start

This is a static site with no build step. To preview locally:

```bash
# Any static server works
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000` and verify:
- Homepage loads with hero, demo, and all sections
- Logo SVGs render from `assets/logos/`
- Privacy policy link works
- Formspree forms are functional

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Static HTML/CSS/JS (single page) |
| Hosting | Vercel |
| Forms | Formspree |
| Fonts | DM Sans + JetBrains Mono (Google Fonts) |
| Animation | GSAP 3.12.7 (CDN) |

No build system, no framework, no backend, no database.

## Project Structure

```
index.html              ← Homepage (CSS/JS inline)
privacy-policy.html     ← Privacy policy
assets/
  logos/                 ← SVG brand marks (locked)
  social/               ← OG image
docs/
  ARCHITECTURE_AUDIT.md  ← Current state analysis
  PRODUCT_DIRECTION.md   ← Commercial priorities
  DECISIONS.md           ← Decision record
  DEPLOYMENT_CHECKLIST.md
  AI_ALIGNMENT.md
vercel.json             ← Vercel config
robots.txt              ← SEO
sitemap.xml             ← SEO
CLAUDE.md               ← Agent alignment guide
```

## Current Focus

The Pressure Planner digital product is the primary launch target. The website is positioned to:

1. Explain the product clearly above the fold
2. Let visitors try the interactive demo
3. Capture early access emails via Formspree
4. Use the broader ecosystem (Blueprint, Mastery Method, etc.) as supporting authority

See [docs/PRODUCT_DIRECTION.md](docs/PRODUCT_DIRECTION.md) for full commercial context.

## Deployment

The site deploys to Vercel from this repository. See [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) for pre/post deploy checks.

**Key rules:**
- All asset paths are relative — do not use absolute paths
- Do not commit secrets or API keys
- Logo SVGs in `assets/logos/` are locked brand assets — do not regenerate
- Test locally before pushing

## Documentation

- [CLAUDE.md](CLAUDE.md) — Agent alignment and coding standards
- [docs/ARCHITECTURE_AUDIT.md](docs/ARCHITECTURE_AUDIT.md) — Technical audit
- [docs/PRODUCT_DIRECTION.md](docs/PRODUCT_DIRECTION.md) — Business direction
- [docs/DECISIONS.md](docs/DECISIONS.md) — Decision record
- [docs/AI_ALIGNMENT.md](docs/AI_ALIGNMENT.md) — Visual/interaction alignment

## License

All rights reserved. © 2026 The Pressure Academy.
