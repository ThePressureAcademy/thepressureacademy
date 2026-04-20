# Repo Governance And Endpoints

## Purpose

This file is the current internal governance reference for repo truth, endpoint ownership, and document authority.

It is meant to stop stale assumptions from driving production edits.

## A. Repo Source Of Truth

Code authority order:

1. Current repo code on `main`
2. Current verified route and config behavior in the repo
3. Current verified deployment metadata
4. Internal docs

Rules:

- If docs conflict with code, the code wins.
- Do not treat old audits or handover docs as deployment proof.
- Do not revive old claims about production state without fresh verification.
- Use this file as the governance entry point before relying on other docs.

## B. Verified Endpoint Map

### `https://formspree.io/f/meerjgde`

Scope: **TPA parent-site forms only**

Verified current pages:

- `index.html`
  - Planner capture form
  - Hidden `intent=planner-access`
  - Hidden `source=post-demo-cta`
- `index.html`
  - Planner join form
  - Hidden `intent=planner-access`
  - Hidden `source=join-section`

- `liftiq/dispatch-blind-spot-diagnostic/index.html`
  - Uses `fetch(...)` via shared LiftIQ JS
  - Sends `intent=liftiq-dispatch-blind-spot-review`
  - Sends `source=liftiq-diagnostic-page`

- `liftiq/executive-briefing/index.html`
  - Uses `fetch(...)` via shared LiftIQ JS
  - Sends `intent=liftiq-executive-design-partner-briefing`
  - Sends `source=liftiq-executive-briefing-page`

- `liftiq/contact/index.html`
  - Uses `fetch(...)` via shared LiftIQ JS
  - Sends `intent=liftiq-general-contact`
  - Sends `source=liftiq-contact-page`

No Mastery Method page is currently verified to post to this endpoint.

### `https://formspree.io/f/xwvwkqqg`

Scope: **Mastery Method only**

Verified current pages:

- `mastery-method/book/index.html`
  - Uses `fetch(...)` to submit to `xwvwkqqg`
  - Sends `source=mastery-method-book`
  - Sends fixed `intent=call`
  - Sends parent/guardian and child-context intake fields
  - Sends `call_goal` as the call-preparation selector

- `mastery-method/scorecard/index.html`
  - Uses `fetch(...)` to submit to `xwvwkqqg`
  - Sends `intent=scorecard-lead`
  - Sends `source=clarity-scorecard`
  - Sends scorecard result fields and optional contact details

## C. Verified Portal/Auth Behavior

The repo includes a real protected portal flow.

Verified current code behavior:

- `api/auth/activate.js`
  - Validates invite tokens from `PORTAL_INVITE_TOKENS`
  - Issues a signed session cookie
  - Cookie is `HttpOnly`, `Secure`, `SameSite=Strict`

- `api/portal-serve.js`
  - Validates `mm_session`
  - Refuses access if the session is invalid or missing
  - Serves protected portal HTML only after auth passes
  - Returns private/no-store caching headers

- Portal HTML pages also use browser storage for progress/view state

Do not describe this repo as static-only or auth-free.

## D. Document Authority Rules

### Canonical for governance / agent safety

- Repo code itself
- `docs/REPO_GOVERNANCE_AND_ENDPOINTS.md`
- `CLAUDE.md`

### Scoped docs that may still be useful

- `docs/PORTAL_ACCESS_ADMIN.md`
  - Scope: portal invite and session operations

- `docs/MASTER_CONTENT_SOT_SCORECARD_FUNNEL.md`
  - Scope: Mastery Method scorecard-first funnel and CTA rules
  - Not a global TPA architecture source

- `docs/MASTERY_METHOD_INTAKE_DEPLOYMENT_SYSTEM.md`
  - Scope: Mastery Method intake, interpretation, approval, placement, and deployment workflow
  - Not proof of app infrastructure or automation

- `docs/MASTERY_METHOD_PILOT_1_LAUNCH_CHECKLIST.md`
  - Scope: Pilot 1 launch readiness, invite gating, and first-session go/no-go operations
  - Not proof that internal pilot tooling or tracking systems already exist

- `docs/PRODUCT_DIRECTION.md`
  - Scope: TPA homepage / Pressure Planner commercial direction
  - Not proof of current implementation everywhere else

- `docs/DECISIONS.md`
  - Scope: historical decision record
  - Not deployment proof

### Archived stale / superseded governance docs

These have been demoted out of the active `docs/` root and must not be treated as canonical:

- `docs/archive/2026-04-governance-demotions/AI_ALIGNMENT.md`
- `docs/archive/2026-04-governance-demotions/ALIGNMENT-PROMPT-MM-HANDOVER.txt`
- `docs/archive/2026-04-governance-demotions/ARCHITECTURE_AUDIT.md`
- `docs/archive/2026-04-governance-demotions/LAUNCH_READINESS.md`

Older audit/remediation packs outside the repo root are still reference only and should stay outside active repo authority.

## E. Agent Warning

- Do not reuse stale assumptions
- Verify code before editing docs
- Do not invent analytics, app infrastructure, or compliance claims
- Do not merge TPA-site and Mastery Method form flows
- Do not weaken portal route protection for convenience
- Do not let markdown override production code truth
