# Mastery Method Intake -> Clarity -> Placement -> Approval -> Deployment System

Status: ACTIVE  
Owner: Kirsty / The Pressure Academy  
Primary inbox: `masterymethod@thepressureacademy.com`

## Purpose

This document defines the operating model for Mastery Method intake, interpretation, approval, and deployment work.

It is not a generic CRM workflow.
It is not a generic tutoring pipeline.
It is a clarity-led educational placement and deployment system with explicit human approval gates.

## Scope

Use this document for:

- lead intake handling
- scorecard interpretation workflow
- curriculum-grounded placement thinking
- approval-pack preparation for Kirsty
- preview, deployment, and portal allocation decisions
- parent-facing draft standards

This document does not prove application infrastructure.
Repo code and verified endpoint behavior still control implementation truth.

## Current Operational Reality

The current repo contains public intake surfaces and protected portal access, but no verified internal CRM or autonomous placement engine.

Operationally, treat the system as:

- human-in-the-loop
- status-driven
- approval-gated
- curriculum-led
- minimal-assumption

Do not describe the portal as a full autonomous curriculum engine.
Do not imply that deployment, placement, or allocation is automatic unless that has been explicitly pre-authorised by Kirsty.

## Authority Model

### 1. Human Authority

Kirsty is the final decision-maker.

No irreversible action becomes final without her approval unless it has been explicitly pre-authorised.

### 2. Funnel Authority

Mastery Method uses the locked scorecard-first funnel:

`Scorecard -> Nurture -> Clarity Call -> Clarity Assessment -> Clarity Pathway -> Initial Deployment`

Rules:

- Primary entry is the Clarity Scorecard.
- Sneak preview is optional and controlled.
- The guide is never the primary CTA.
- The guide is post-scorecard only.
- Do not silently reorder the funnel.

### 3. Curriculum Authority

Use the current Mastery Method curriculum system for:

- English ages 3-8
- Mathematics ages 3-8
- Clarity Scorecard alignment
- pathways
- scope and sequence
- lesson bank
- pilot delivery tools
- portal allocation planning

If curriculum evidence is incomplete, mark the recommendation as low-confidence and escalate to Kirsty review.

### 4. Operational Authority

Every lead must move through explicit status stages.
No silent jumps.
No hidden assumptions.

## Locked Status Model

Use these statuses exactly:

1. `NEW_INBOX_LEAD`
2. `PARSED`
3. `SCORE_INTERPRETED`
4. `CURRICULUM_MAPPED`
5. `KIRSTY_REVIEW_REQUIRED`
6. `PREVIEW_DRAFT_READY`
7. `CLARITY_CALL_BOOKED`
8. `ASSESSMENT_COMPLETE`
9. `DEPLOYMENT_DRAFT_READY`
10. `APPROVED_FOR_PORTAL`
11. `SENT / DEPLOYED`

## Status Rules

### `NEW_INBOX_LEAD`

Use when a family first enters the system from inbox, form, scorecard, or manual referral and no structured extraction has been completed yet.

### `PARSED`

Use when the incoming material has been converted into clean intake notes with facts separated from interpretation.

### `SCORE_INTERPRETED`

Use when the Clarity Scorecard result has been interpreted and any tensions, anomalies, or uncertainty have been surfaced.

### `CURRICULUM_MAPPED`

Use when the child's likely starting point has been mapped against current curriculum tools, pathways, or scope-and-sequence references.

### `KIRSTY_REVIEW_REQUIRED`

Use when a decision pack is ready for Kirsty's judgment or when any risk flag, confidence issue, or deployment consequence means human review is required.

### `PREVIEW_DRAFT_READY`

Use when a parent-facing sneak preview draft exists but has not been sent.

### `CLARITY_CALL_BOOKED`

Use when the family has a confirmed Clarity Call scheduled.

### `ASSESSMENT_COMPLETE`

Use when the Clarity Assessment has been completed and there is enough evidence to move toward pathway or deployment planning.

### `DEPLOYMENT_DRAFT_READY`

Use when an initial deployment recommendation exists, including pilot resource allocation thinking, but no final release has happened.

### `APPROVED_FOR_PORTAL`

Use only after Kirsty has approved the deployment decision and portal/resource allocation.

### `SENT / DEPLOYED`

Use only after the approved communication or approved portal allocation has actually been sent or deployed.

## Required Separation Of Thought

Always separate:

- `FACTS EXTRACTED`
- `INTERPRETATION`
- `RECOMMENDATION`
- `OPEN QUESTIONS / RISKS`

Never collapse these into one blended summary.

### `FACTS EXTRACTED`

Include only observable or supplied information:

- score values
- parent wording
- age/year level
- subject area
- prior support history
- direct statements from forms, emails, or scorecards

### `INTERPRETATION`

Include reasoned meaning drawn from the facts:

- likely clarity pattern
- likely unevenness
- likely placement tension
- probable readiness for call, assessment, or pathway

Interpretation must never be presented as fact.

### `RECOMMENDATION`

Include the best next action based on the facts plus curriculum mapping:

- nurture only
- Clarity Call
- Assessment
- hold for more evidence
- preview draft for review
- minimal pilot deployment

### `OPEN QUESTIONS / RISKS`

Include anything that reduces confidence or requires human judgment before movement.

## Communication Standard

All parent-facing drafts must be:

- calm
- specific
- high-trust
- educational
- confidence-safe
- non-clinical

Avoid:

- diagnosis language
- therapy framing
- overclaiming
- deficit labels
- robotic jargon
- generic praise

## Risk Flags

Raise explicit flags when:

- below-age placement is likely
- profile is highly uneven
- score and written concern conflict
- parent wording suggests emotional sensitivity
- family appears to want diagnosis rather than education support
- insufficient data exists for safe placement
- child may need split-band placement
- confidence in recommendation is low

When a flag is present, the lead should not bypass `KIRSTY_REVIEW_REQUIRED`.

## Automation Rule

Auto-send may be allowed for acknowledgment only.

The following always require human approval unless explicitly pre-authorised:

- sneak previews
- placement recommendations
- first deployment drafts
- portal allocation decisions

## Portal Rule

The portal is a controlled delivery and resource layer.
It is not assumed to be a full autonomous curriculum engine.

Only approved resources should be allocated.
Keep pilot resource allocation minimal and intentional.

## Standard Operating Flow

### Phase 1. Intake

1. Receive lead into `NEW_INBOX_LEAD`.
2. Extract clean intake facts.
3. Move to `PARSED`.
4. Send acknowledgment only if appropriate and if it stays within the automation rule.

### Phase 2. Interpretation

1. Review scorecard and written concerns.
2. Separate facts from inference.
3. Identify weak pillars, tensions, and mismatch risks.
4. Move to `SCORE_INTERPRETED`.

### Phase 3. Curriculum Mapping

1. Map the likely need against current curriculum tools and pathways.
2. Decide whether the evidence supports a safe starting recommendation.
3. Surface split-band, below-age, or uneven-profile risks.
4. Move to `CURRICULUM_MAPPED`.

### Phase 4. Human Review

1. Prepare a clean pack for Kirsty.
2. Include facts, interpretation, recommendation, and risks as separate sections.
3. Move to `KIRSTY_REVIEW_REQUIRED`.
4. Wait for approval before any irreversible next step.

### Phase 5. Controlled Output

Depending on approval, move into one of the next explicit states:

- `PREVIEW_DRAFT_READY`
- `CLARITY_CALL_BOOKED`
- `ASSESSMENT_COMPLETE`
- `DEPLOYMENT_DRAFT_READY`
- `APPROVED_FOR_PORTAL`
- `SENT / DEPLOYED`

## Approval Pack Format

Prepare Kirsty's review packs in this order:

### `FACTS EXTRACTED`

- lead source
- child age and year level
- subject area
- scorecard result details
- parent concerns in near-original wording
- prior support context

### `INTERPRETATION`

- clarity pattern summary
- likely learning profile shape
- confidence level
- why the interpretation fits the evidence

### `RECOMMENDATION`

- recommended next stage
- proposed pathway or placement logic
- whether preview, call, assessment, or deployment draft is appropriate
- minimal portal or resource thinking if relevant

### `OPEN QUESTIONS / RISKS`

- evidence gaps
- emotional sensitivity flags
- fit concerns
- curriculum uncertainty
- approval dependencies

## Decision Rules

### Acknowledgment

Acknowledgment may be sent before Kirsty review if it does not:

- promise placement
- imply approval
- imply diagnosis
- imply portal access
- imply curriculum allocation

### Previews

Sneak previews are optional and controlled.
They are never sent automatically unless explicit pre-authorisation exists.

### Placement

Initial placement recommendations must be grounded in current curriculum tools and flagged when confidence is low.

### Deployment

First deployment drafts should be minimal, intentional, and reversible until Kirsty approves the final decision.

## Success Standard

Success means:

- leads are understood quickly
- scorecards are interpreted accurately
- recommendations are grounded in the curriculum system
- Kirsty receives a clean approval pack
- families receive thoughtful, specific, high-trust communication
- no full deployment happens without the right approval
- the system supports monetisation without compromising integrity
