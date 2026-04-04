# CLAUDE.md - The Pressure Academy Repo Operating Guide

## Purpose

This repository contains production website code for **The Pressure Academy**.
It is not a static-only concept stub.
It includes:

- The TPA public site and homepage experience
- The Mastery Method public pages
- The Mastery Method portal gate and protected portal pages
- Vercel route configuration in `vercel.json`
- Serverless functions in `api/`

## Source Of Truth

Use this authority order:

1. Current repo code on `main`
2. Current verified route and config behavior in the repo
3. Current verified deployment metadata
4. Internal docs

If a markdown doc conflicts with code, the code wins.

Do not reuse old audit claims without re-verifying them.
Stale internal docs exist in this repo and are not automatically canonical.

## High-Level Architecture

- **TPA public site:** [index.html](./index.html)
- **Privacy policy:** [privacy-policy.html](./privacy-policy.html)
- **Mastery Method public pages:** `mastery-method/*`
- **Mastery Method portal gate:** `mastery-method/portal/index.html`
- **Protected portal pages:** `mastery-method/portal/dashboard`, `library`, `module`, `account`, `progress`
- **Vercel config:** [vercel.json](./vercel.json)
- **Serverless functions:** `api/portal-serve.js`, `api/auth/activate.js`, `api/auth/logout.js`
- **Assets:** `assets/`
- **Internal docs:** `docs/`

## Important Repo Reality

- This repo is deployed on Vercel.
- The portal is not a fake mock. Protected routes are handled through `api/` and `vercel.json`.
- `api/auth/activate.js` validates invite tokens and issues a signed session cookie.
- `api/portal-serve.js` validates the session cookie before serving protected portal HTML.
- Portal pages also use browser storage for some client-side progress state.
- Do not claim "no backend", "no auth", or "no serverless" in this repo.

## Form Endpoint Map

These mappings are verified in current repo code:

- `https://formspree.io/f/meerjgde`
  - TPA parent-site forms only
  - Verified current use: homepage planner capture forms in `index.html`

- `https://formspree.io/f/xwvwkqqg`
  - Mastery Method only
  - Verified current use: `mastery-method/book/index.html`
  - Verified current use: `mastery-method/scorecard/index.html`

Do not merge, swap, or "simplify" these endpoints without first verifying the live code paths that use them.

## Verified Form Behavior

- TPA homepage forms currently use hidden `intent=planner-access`
- TPA homepage forms currently use hidden `source=post-demo-cta` and `source=join-section`
- Mastery Method booking uses dynamic `intent` values: `call`, `assessment`, `info`
- Mastery Method booking uses `source=mastery-method-book`
- Mastery Method scorecard uses `intent=scorecard-lead`
- Mastery Method scorecard uses `source=clarity-scorecard`

## Docs: What To Trust Carefully

- Treat docs as scoped working notes unless they are confirmed against code.
- Some older docs describe:
  - no auth / no backend
  - old Formspree mappings
  - portal as future work
  - historical handover states that no longer match the repo

Before editing docs, verify the relevant code path first.

## Strategy Caution

Do not overstate product strategy as if it is fully settled.
Current code reality is mixed:

- The TPA homepage is Pressure Planner-led
- Mastery Method is a large, active subsystem with its own public flow
- A protected Mastery Method portal exists in production code

If you need strategic truth, verify code first and then check scoped docs.

## Analytics And Tracking

No analytics provider is verified as installed in current repo code.
Do not claim analytics, event tracking, funnel measurement, or dashboard visibility exists unless you add and verify it.

## CSS / JS Editing Caution

- The homepage and Mastery Method pages are primarily self-contained HTML with inline CSS/JS
- Do not assume external CSS files in `assets/css/` are live
- Verify references before editing shared-looking assets

## Portal / Auth Editing Caution

Files that can break protected access if edited carelessly:

- [vercel.json](./vercel.json)
- [api/portal-serve.js](./api/portal-serve.js)
- [api/auth/activate.js](./api/auth/activate.js)
- [api/auth/logout.js](./api/auth/logout.js)

Do not weaken portal route protection based on old docs or convenience.

## Operating Rules For Agents

- Verify code before updating docs
- Do not invent infrastructure facts
- Do not invent compliance, analytics, or medical claims
- Do not assume old docs are canonical
- Keep TPA-site and Mastery Method form handling distinct
- Keep edits scoped and evidence-led
