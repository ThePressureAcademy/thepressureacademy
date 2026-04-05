> [!NOTE]
> SCOPED REFERENCE ONLY.
> This README is a general repo orientation file. It must not override verified code, [CLAUDE.md](./CLAUDE.md), or [docs/REPO_GOVERNANCE_AND_ENDPOINTS.md](./docs/REPO_GOVERNANCE_AND_ENDPOINTS.md).

# The Pressure Academy

**[thepressureacademy.com](https://thepressureacademy.com)**

Production website repository for The Pressure Academy, including the public site, Mastery Method public pages, and Mastery Method portal/auth handling.

## Quick Start

The frontend is primarily HTML/CSS/JS with no build step. To preview locally:

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
| Frontend | HTML/CSS/JS (homepage plus multi-page Mastery Method sections) |
| Hosting | Vercel |
| Forms | Formspree |
| Serverless / Auth | `api/` functions for portal activation, logout, and protected-page serving |
| Fonts | DM Sans + JetBrains Mono (Google Fonts) |
| Animation | GSAP 3.12.7 (CDN) |

No frontend build system or framework is currently used. This repo does include serverless functions and portal session handling.

## Project Structure

```
index.html              ← Homepage (CSS/JS inline)
privacy-policy.html     ← Privacy policy
mastery-method/         ← Mastery Method public pages and portal pages
api/                    ← Serverless functions for portal access
assets/
  logos/                 ← SVG brand marks (locked)
  social/               ← OG image
docs/
  REPO_GOVERNANCE_AND_ENDPOINTS.md ← Canonical governance and endpoint map
  DOC_AUTHORITY_INDEX.md ← Doc authority and status guide
vercel.json             ← Vercel config
robots.txt              ← SEO
sitemap.xml             ← SEO
CLAUDE.md               ← Canonical agent operating guide
```

## Current Focus

The repo currently contains mixed but real production surfaces:

1. TPA public-site traffic and lead capture
2. Mastery Method booking and scorecard flows
3. Mastery Method portal activation and protected portal serving

For authority rules and verified endpoint usage, start with [docs/DOC_AUTHORITY_INDEX.md](docs/DOC_AUTHORITY_INDEX.md).

## Deployment

The site deploys to Vercel from this repository. See [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) for pre/post deploy checks.

**Key rules:**
- All asset paths are relative — do not use absolute paths
- Do not commit secrets or API keys
- Logo SVGs in `assets/logos/` are locked brand assets — do not regenerate
- Test locally before pushing

## Documentation

- [CLAUDE.md](CLAUDE.md) — canonical agent operating guide
- [docs/REPO_GOVERNANCE_AND_ENDPOINTS.md](docs/REPO_GOVERNANCE_AND_ENDPOINTS.md) — canonical governance and endpoint map
- [docs/DOC_AUTHORITY_INDEX.md](docs/DOC_AUTHORITY_INDEX.md) — which docs are canonical, scoped, or historical
- [docs/PRODUCT_DIRECTION.md](docs/PRODUCT_DIRECTION.md) — Business direction
- [docs/DECISIONS.md](docs/DECISIONS.md) — Decision record
- [docs/AI_ALIGNMENT.md](docs/AI_ALIGNMENT.md) — Visual/interaction alignment

## License

All rights reserved. © 2026 The Pressure Academy.
