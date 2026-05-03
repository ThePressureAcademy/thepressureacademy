# Planner Route Bridge — governance note

## Summary

`/planner` on `thepressureacademy.com` is the canonical, TPA-branded public entry route for Pressure Planner. It is implemented in this repo as a **bridge page**, not a real Pressure Planner application.

The homepage CTAs link to `/planner`. The bridge page redirects to the live Planner runtime currently hosted on Manus.

This is a deliberate, governed staging step. It is not the end state.

## Active route map

| Surface | URL | Owner | Purpose |
|---|---|---|---|
| Homepage CTAs | `/planner` | this repo | Branded public entry point. Used in all marketing copy, social posts, app store listings, and email links. |
| Bridge page file | `planner/index.html` | this repo | ~190-line static HTML. Sets meta refresh + JS redirect to the runtime URL. Includes a visible "Open Pressure Planner" button for fallback. Honest about being a bridge. |
| Runtime destination | `https://planner.thepressureacademy.com/` | Manus-hosted | The actual Pressure Planner application (Vite + React + tRPC + Drizzle + MySQL + S3 + Manus OAuth). |
| Source of truth | `ThePressureAcademy/pressure-planner-app` (separate repo, governed) | future | Where the real Planner application source belongs once recovered/imported. **Not this repo.** |

## What this repo does NOT do

- Does **not** contain the Pressure Planner application source.
- Does **not** run the Vite/React/Express/tRPC/Drizzle stack.
- Does **not** proxy `/planner/*` to the runtime via a transparent rewrite. A blind rewrite was rejected pending audit of:
  - root-relative assets
  - `/assets/*` paths
  - `/api/*` (including tRPC `/api/trpc`)
  - OAuth callback URLs (Manus OAuth depends on the canonical runtime origin)
  - cookie scope (`app_session_id`)
  - SPA client-side routing (`wouter` deep links)
  - Manus runtime paths (`/__manus__/*`)
- Does **not** handle Pressure Planner authentication, storage, or persistence.

## Why a bridge instead of a transparent proxy

A transparent proxy or `vercel.json` rewrite from `/planner/*` to the Manus runtime would silently break:

1. **OAuth**: callbacks are registered to the Manus app's origin. Cookies set on `thepressureacademy.com` would not flow back to `planner.thepressureacademy.com`.
2. **Asset paths**: Vite emits root-relative `/assets/*` URLs which would collide with the TPA static `/assets/*` directory served by this repo.
3. **tRPC endpoints**: the client targets `/api/trpc`. This repo already has `api/portal-serve.js`, `api/auth/activate.js`, `api/auth/logout.js`. A transparent rewrite would conflict.
4. **SPA navigation**: client-side routes (e.g. `/planner/today`) need to be served the SPA shell, not 404. Misconfigured rewrites send them to the homepage's catch-all.

A **redirect** has none of these problems. Users land on the canonical Planner origin where everything already works.

## Bridge implementation details

### File: `planner/index.html`

- Single static HTML file. No external JS, no build step.
- `<meta http-equiv="refresh" content="2;url=https://planner.thepressureacademy.com/">` — works without JS.
- JS redirect at ~700ms via `window.location.replace` — works in modern browsers.
- Visible "Open Pressure Planner" button for users who block JS and meta-refresh, or who have slow networks.
- `<noscript>` fallback message.
- `meta name="robots" content="noindex,follow"` — the bridge itself should not index. The runtime can have its own indexing policy.
- Branded with the Pressure Planner mark and a single H1. No fake product UI. No sliders, no scoring, no faux interactions.
- Mobile-friendly, dark theme aligned to the homepage palette.
- Reduced-motion gated.

### Routing

- Vercel auto-serves `/planner` from `planner/index.html`. No `vercel.json` change needed.
- No `vercel.json` rewrite was added. Future rewrites must be tested against the checklist above before introduction.

## Sitemap / llms.txt policy

- `/planner` IS listed in `sitemap.xml` and `llms.txt` because it is a stable, branded public entry route.
- The `llms.txt` description names it as a Planner entry route, not the full application source, and points at the Manus runtime as the current destination.
- `https://planner.thepressureacademy.com/` (the runtime origin) is **not** listed as the canonical homepage destination. It remains the runtime, not the brand surface.

## Eventual end state (target, not current)

The intended end state, in dependency order:

1. The Pressure Planner application source is recovered/imported into `ThePressureAcademy/pressure-planner-app` (a separate, governed repo).
2. That repo deploys to its own infrastructure (separate Vercel project, Render, Railway, or continued Manus, whichever survives the dependency audit on MySQL / S3 / OAuth / Manus runtime).
3. `thepressureacademy.com/planner/*` is then served by that deployment via Vercel domain configuration (path-based routing in the Vercel dashboard) or a fully-tested `vercel.json` rewrite.
4. `planner/index.html` in this repo is deleted at that point — the bridge is no longer needed.

Until that audit passes, this bridge is the production-correct minimum.

## Hard rules

- Do **not** import the Pressure Planner application source into this repo.
- Do **not** point homepage CTAs directly at the Manus subdomain. The branded `/planner` URL is what marketing communicates.
- Do **not** add a `vercel.json` rewrite for `/planner/*` until the dependency audit (assets, API, OAuth, cookies, tRPC, SPA, Manus runtime) is documented as passing.
- Do **not** present the bridge as if it were the live product. The bridge says "Opening Pressure Planner…" and gets out of the way.
- Do **not** remove `/planner` from `sitemap.xml` or `llms.txt` while the bridge is the active entry point.

## Last reviewed

2026-05-01.
