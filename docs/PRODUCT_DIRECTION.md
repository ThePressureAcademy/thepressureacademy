# Product Direction — The Pressure Academy

**Status:** ACTIVE — aligned with Mastery Method Stage 1 naming canon
**Governing canon:** [MASTERY_METHOD_NAMING_CANON.md](./MASTERY_METHOD_NAMING_CANON.md)
**Last aligned:** Stage 1 migration

## Purpose

This note captures the current product direction across The Pressure Academy's public surfaces. It does not override repo code or the naming canon.

If this doc conflicts with the repo or with `MASTERY_METHOD_NAMING_CANON.md`, the canon and the repo code win.

## Core Business Truth

The Pressure Academy is a premium, systems-led coaching and wellness business. Within TPA there are two distinct public-facing systems that each have their own commercial path:

- **Mastery Method** — an independent premium parent-facing learning support system. It has its own public flow, its own naming canon, its own offer architecture (Clarity Scorecard → Learning Support Call → Mastery Assessment → Mastery Pathway + optional Targeted 1:1 Sessions), its own pricing, and its own operational standards. It is not framed publicly as a sub-offer or authority layer of any other TPA product.
- **Pressure Planner** — a digital planning and performance scoring tool for people managing shift work, training, parenting, and structured routines. It is a separate commercial priority on the TPA homepage (`index.html`).

Internally, both systems sit within the wider TPA ecosystem. Publicly, they are treated as independent premium systems.

## Pressure Planner — Digital Product Direction

- **What:** A digital planning and performance scoring tool.
- **Who:** Shift workers, grapplers/athletes, parents — anyone managing competing demands on energy and time.
- **Status:** In development; remaining work is content production and packaging rather than platform engineering.
- **First transaction type:** Digital product purchase or early-access waitlist conversion.

### TPA Homepage (`index.html`) — What It Must Do

1. Position the Pressure Planner clearly as its own digital product, with its own value, audience, and CTA.
2. Support the Planner with TPA ecosystem context where helpful, without collapsing Mastery Method into a supporting authority layer.
3. Provide a primary CTA appropriate to the Planner's current stage (buy, waitlist, or early access).
4. Capture emails with clear intent segmentation.

### TPA Homepage — What It Should Not Do

- Frame Mastery Method as a sub-offer or supporting brand of the Pressure Planner.
- Frame Mastery Method using retired Clarity-era product nouns (Clarity Call, Clarity Assessment, Clarity Pathway, Clarity Framework, Clarity Pillars). See `MASTERY_METHOD_NAMING_CANON.md`.
- Treat the Planner as one of several equal ecosystem nodes on the homepage.
- Over-invest in admin/platform features before the Planner's first sale.
- Mix in unrelated brands (Pressure Systems, LiftIQ, etc.).
- Fabricate testimonials or legal claims.

## Mastery Method — Public System Direction

Mastery Method is handled under its own public flow at `/mastery-method/*`. It is not driven from this document.

Authoritative references for Mastery Method are:

- [MASTERY_METHOD_NAMING_CANON.md](./MASTERY_METHOD_NAMING_CANON.md) — display naming.
- [MASTER_CONTENT_SOT_SCORECARD_FUNNEL.md](./MASTER_CONTENT_SOT_SCORECARD_FUNNEL.md) — funnel content.
- [mastery-method-mastery-pathway-definition.txt](./mastery-method-mastery-pathway-definition.txt) — offer architecture.
- [MASTERY_METHOD_INTAKE_DEPLOYMENT_SYSTEM.md](./MASTERY_METHOD_INTAKE_DEPLOYMENT_SYSTEM.md) — intake and deployment operations.

Do not restate Mastery Method public positioning here. Link to the canon instead.

## Remaining Pressure Planner Bottlenecks

1. Content production (recording remaining answers).
2. Final editing and packaging.
3. Payment integration (Stripe or similar — not yet configured).
4. Delivery mechanism (download link, app access, or gated content).

## TPA Homepage Content Hierarchy (Target)

```
1. Hero — Pressure Planner headline + CTA
2. Product value — what you get, who it's for
3. Interactive demo — try before you buy
4. Social proof — real outcomes (only when verified)
5. Ecosystem context — Mastery Method and other TPA systems
   as independent premium systems, linked out, not collapsed
6. Pricing / early access
7. FAQ
8. Email capture / join
9. Footer
```

## Assumptions (Marked)

- [ASSUMPTION] Pressure Planner will be sold as a digital download or app access — exact delivery TBD.
- [ASSUMPTION] Pressure Planner pricing is not yet set — placeholder needed.
- [ASSUMPTION] Testimonials on the current TPA homepage are illustrative, not from real customers.
- [ASSUMPTION] Formspree is adequate for current volume — may need upgrade at scale.

## What Changed In This Alignment

- Removed the framing of Mastery Method as an "authority layer" or credibility support for the Pressure Planner. Mastery Method is now described as an independent premium parent-facing system within TPA.
- Removed the claim that the Pressure Planner is the sole or dominant TPA commercial priority. The Planner remains the TPA homepage's headline product; Mastery Method runs on its own public flow with its own commercial path.
- Added explicit references to `MASTERY_METHOD_NAMING_CANON.md` so no retired Clarity-era product nouns are reintroduced via this doc.
- Removed the operator-decision caution banner: the hierarchy conflict has been resolved and this doc is now aligned with the current canon.
