# Mastery Method Naming Canon

**Status:** ACTIVE — CANONICAL
**Scope:** Stage 1 migration — display naming only
**Owner:** Kirsty / The Pressure Academy

## Purpose

This file is the single source of truth for Mastery Method public naming.

Any Mastery Method display copy — across repo runtime, active local docs, ads, reels, decks, emails, invoices, and portal text — must follow the KEEP and RENAME rules below.

If another doc contradicts this file, this file wins. Update or demote the contradicting doc.

## Authority Rules

1. This canon is canonical for Mastery Method display naming.
2. It does NOT control analytics keys, Formspree `intent`/`source` values, URL paths, or internal database fields. See **Stable Analytics / Infrastructure Keys** below.
3. It does NOT broaden the offer, age range, subject core, or portal scope. See **No Broadening Rule** below.
4. Only Kirsty can approve changes to this canon. Agents must not introduce alternative naming on their own initiative.

## Stage 1 Scope

Stage 1 covers display copy only:

- page titles, H1s, body copy, CTA labels
- meta descriptions and OG / Twitter tags
- active local Mastery Method docs
- legal surface (privacy policy) where Mastery Method products are named
- `llms.txt`

Stage 1 does NOT change:

- URL paths — the route `/mastery-method/clarity` remains in place; only the page content is retitled to **The Mastery Method Framework**
- `vercel.json` route configuration
- Formspree `intent` or `source` keys
- Analytics event keys
- Portal authentication, session handling, or infrastructure
- Historical / archive docs (banner only; body copy untouched)

A future Stage 2 may revisit URL migration, redirect setup, and analytics taxonomy. Stage 2 is not authorised by this document.

## KEEP

These names are approved and in active use. Do not rename, replace, or soften.

- **Mastery Method** — master brand; master system name.
- **Clarity Scorecard** — the free entry tool. The single branded acquisition asset that retains the word *Clarity*.
- **Teaching Blueprint** — the deliverable produced by the Mastery Assessment and updated monthly on the Mastery Pathway.
- **Targeted 1:1 Sessions** — the optional premium add-on.
- **clarity** — permitted only as a lowercase descriptive benefit word in running prose. Never a product noun.

## RENAME

These terms are retired. Replace wherever they appear on active Mastery Method surfaces.

| Retired | Replacement |
|---|---|
| Clarity Framework | The Mastery Method Framework |
| Clarity Call | Learning Support Call |
| Clarity Assessment | Mastery Assessment |
| Clarity Pathway | Mastery Pathway |
| Clarity Pillars | The Four Pillars |
| Four Clarity Pillars | The Four Pillars |
| Four Pillars of Clarity | The Four Pillars |
| Clarity of Thinking | Thinking |
| Clarity of Communication | Communication |
| Clarity of Learning | Learning |
| Clarity of Action | Action |

The Four Pillars, named in full: **Thinking, Communication, Learning, Action.**

## Language Rules

1. "Clarity" appears in public copy only as (a) the brand noun in **Clarity Scorecard**, or (b) a lowercase descriptive benefit word in running prose.
2. "Clarity" must not appear as a prefix on any other product noun.
3. Pillar names stand alone. No "Clarity of ___" construction.
4. Public language stays premium, parent-clear, and non-clinical.
5. Mastery Method is a teacher-led learning support system. It is not a clinical, diagnostic, or therapeutic service.

## Stable Analytics / Infrastructure Keys

Do NOT change these during the naming migration.

- Formspree `intent` values: `call`, `assessment`, `info`, `scorecard-lead`, `planner-access`
- Formspree `source` values: `clarity-scorecard`, `mastery-method-book`, `post-demo-cta`, `join-section`
- Current route: `/mastery-method/clarity` (display copy changes; route does not change in Stage 1)

These are historical analytics keys. They are decoupled from display copy and must remain stable to preserve submission continuity.

## No Broadening Rule

This migration is a naming realignment. It does not broaden:

- the target age range (current wedge: Year 2–3)
- the subject core (English, Mathematics, Shared Reading)
- the offer layers (no new products or tiers)
- the portal scope
- the clinical / non-clinical boundary (Mastery Method remains a teacher-led, non-clinical learning support system)

## Dual-Surface Rule

Every naming change above must be reflected on both surfaces in the same migration pass:

1. **Repo / runtime:** public pages, meta, legal surface, `llms.txt`.
2. **Active local docs:** canonical, scoped-reference, and operating docs for Mastery Method.

Historical / archive docs receive a superseded banner only. Their body copy is not rewritten. They do not control implementation.

## Retired Alternatives — Do Not Revive

These names were considered or used at various points and have been retired. Do not reintroduce them on public or active surfaces.

- Discovery Call (considered; not approved — Learning Support Call was chosen for parent accessibility)
- Clarity Framework, Clarity Call, Clarity Assessment, Clarity Pathway, Clarity Pillars (superseded by this canon)
- Core Program (retired)
- Clarity Membership (never launched)
- Guided Support (too generic)
- Mastery Method Program (redundant)

## Change Control

Any change to this canon must:

1. Be approved by Kirsty before implementation.
2. Be reflected on both surfaces in a single migration pass.
3. Add the previous name to the **Retired Alternatives** list (do not delete prior retirements).
4. Trigger an update of `docs/DOC_AUTHORITY_INDEX.md` if document authority shifts as a result.
