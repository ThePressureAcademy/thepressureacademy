# Analytics Baseline Plan

This document defines the minimum measurement baseline for The Pressure Academy repository.

It is a planning and governance document.
It does not mean analytics are currently installed.

## Current State

### Verified in repo

- No analytics provider script is installed in current repo code.
- No Google tag, Google Tag Manager, Plausible, Fathom, Mixpanel, PostHog, Segment, Amplitude, Meta Pixel, or `dataLayer` implementation was found in live repo HTML or JS.
- No custom analytics helper or event wrapper is installed in current repo code.
- Homepage lead capture, Mastery Method booking, and Mastery Method scorecard submissions are handled through existing form handlers and Formspree submission flows, but those flows do not currently emit analytics events.

### Not installed

- Pageview analytics in repo code
- Custom event tracking in repo code
- Funnel event naming standard
- Portal activation / logout measurement
- Resource or download click measurement

### Unknown from repo alone

- Platform-side analytics that may be enabled outside code, such as Vercel-side measurement, cannot be confirmed from the repository.
- Formspree dashboard usage may exist operationally, but dashboard access and current reporting configuration are outside repo evidence.

## Measurement Baseline Goal

The immediate goal is not a full analytics stack.
The goal is a shared event vocabulary and a minimum measurement plan so future implementation does not invent inconsistent names or claim tracking already exists.

## Minimum Event Set

### Must-have

| Event name | Trigger | Page / surface | Why it matters | Success meaning | Owner |
|---|---|---|---|---|---|
| `tpa_home_planner_cta_submit` | Successful submit of the homepage post-demo lead form with `source=post-demo-cta` | [index.html](../index.html) | Measures the highest-intent homepage capture point | A valid lead is submitted from the post-demo CTA path | TPA operator |
| `tpa_home_join_section_submit` | Successful submit of the homepage join form with `source=join-section` | [index.html](../index.html) | Separates bottom-of-page lead capture from post-demo capture | A valid lead is submitted from the join section | TPA operator |
| `mm_booking_form_submit` | Successful submit of the Mastery Method booking form | [mastery-method/book/index.html](../mastery-method/book/index.html) | Measures conversion into Learning Support Calls | A booking/intake request is accepted by the submit flow | TPA operator |
| `mm_scorecard_start` | User starts the scorecard flow | [mastery-method/scorecard/index.html](../mastery-method/scorecard/index.html) | Measures entry into the scorecard funnel before lead capture | A visitor begins question flow from the scorecard start screen | TPA operator |
| `mm_scorecard_submit` | Successful submit of the scorecard lead details/results flow | [mastery-method/scorecard/index.html](../mastery-method/scorecard/index.html) | Measures completed scorecard leads, not just page visits | A scorecard lead payload is accepted by the submit flow | TPA operator |

### Should-have

| Event name | Trigger | Page / surface | Why it matters | Success meaning | Owner |
|---|---|---|---|---|---|
| `mm_booking_start` | First meaningful interaction with the booking form, such as first intent selection or first form field focus | [mastery-method/book/index.html](../mastery-method/book/index.html) | Separates booking-page interest from successful submits | A visitor begins the booking/intake flow | TPA operator |
| `mm_portal_activation_success` | Successful completion of invite-token activation before redirect to dashboard | [api/auth/activate.js](../api/auth/activate.js) | Measures real portal-entry success, not just invite issuance | A valid invite token results in an active session | TPA operator |
| `mm_portal_logout` | Portal logout endpoint clears session and redirects | [api/auth/logout.js](../api/auth/logout.js) | Measures deliberate portal exits and helps interpret session behavior | A logout request clears the session cookie | TPA operator |

### Later

| Event name | Trigger | Page / surface | Why it matters | Success meaning | Owner |
|---|---|---|---|---|---|
| `mm_resource_download_click` | Click on a verified public resource/download link | Public Mastery Method resource surfaces, when such links are live | Measures actual resource consumption | A visitor clicks a live public resource/download link | TPA operator |

## Event Definitions

### `tpa_home_planner_cta_submit`

- Trigger: success path of the homepage post-demo form handler
- Current measurable anchor: form in [index.html](../index.html) with `source=post-demo-cta`
- Why it matters: this is the warmest homepage capture point
- Success meaning: submission accepted by the existing lead flow
- Owner: TPA operator

### `tpa_home_join_section_submit`

- Trigger: success path of the homepage join-section form handler
- Current measurable anchor: form in [index.html](../index.html) with `source=join-section`
- Why it matters: separates long-scroll capture from post-demo capture
- Success meaning: submission accepted by the existing lead flow
- Owner: TPA operator

### `mm_booking_start`

- Trigger: first meaningful interaction with the booking form
- Current measurable anchor: first selected intent, first field focus, or first input change in [mastery-method/book/index.html](../mastery-method/book/index.html)
- Why it matters: shows booking interest even when a visitor does not submit
- Success meaning: the visitor begins the booking/intake journey
- Owner: TPA operator

### `mm_booking_form_submit`

- Trigger: success path of `submitForm()` in [mastery-method/book/index.html](../mastery-method/book/index.html)
- Current measurable anchor: existing Formspree request using `source=mastery-method-book`
- Why it matters: this is the primary Mastery Method enquiry conversion
- Success meaning: the booking request is accepted by the submit flow
- Owner: TPA operator

### `mm_scorecard_start`

- Trigger: `startScorecard()` in [mastery-method/scorecard/index.html](../mastery-method/scorecard/index.html)
- Current measurable anchor: start button on the scorecard entry screen
- Why it matters: distinguishes scorecard interest from scorecard completion
- Success meaning: user enters the 16-question flow
- Owner: TPA operator

### `mm_scorecard_submit`

- Trigger: success path of the scorecard lead submission flow in [mastery-method/scorecard/index.html](../mastery-method/scorecard/index.html)
- Current measurable anchor: existing Formspree request using `intent=scorecard-lead` and `source=clarity-scorecard`
- Why it matters: this is the main MM scorecard conversion event
- Success meaning: a scorecard lead payload is accepted by the submit flow
- Owner: TPA operator

### `mm_portal_activation_success`

- Trigger: valid token path in [api/auth/activate.js](../api/auth/activate.js)
- Current measurable anchor: successful session issuance followed by redirect to dashboard
- Why it matters: measures live portal entry, not just public-page interest
- Success meaning: a valid invite token creates an active portal session
- Owner: TPA operator

### `mm_portal_logout`

- Trigger: logout handler in [api/auth/logout.js](../api/auth/logout.js)
- Current measurable anchor: session cookie cleared and redirect issued
- Why it matters: helps distinguish portal session churn from inactivity
- Success meaning: logout request successfully clears session
- Owner: TPA operator

### `mm_resource_download_click`

- Trigger: click on a verified live public resource/download link
- Current measurable anchor: not currently live in public HTML
- Why it matters: useful when resource-led nurturing becomes measurable
- Success meaning: a visitor opens or downloads a live public resource asset
- Owner: TPA operator

## Priority Order

### Must-have first

1. `tpa_home_planner_cta_submit`
2. `tpa_home_join_section_submit`
3. `mm_booking_form_submit`
4. `mm_scorecard_start`
5. `mm_scorecard_submit`

### Should-have next

1. `mm_booking_start`
2. `mm_portal_activation_success`
3. `mm_portal_logout`

### Later only

1. `mm_resource_download_click`

## Implementation Options

### Option 1: Documentation plus existing operational dashboards

- Use this plan as the canonical event vocabulary.
- Use existing Formspree submissions and hidden source fields for coarse submission counting where available.
- Limitation: no start events, no page analytics, no unified funnel reporting.

### Option 2: Platform-native page measurement later

- If the operator enables a platform-native page analytics tool later, use it for page-level visibility only.
- Do not let pageview tooling be confused with full funnel instrumentation.
- Limitation: provider capabilities vary and may not support the event set above without custom code.

### Option 3: Light custom instrumentation later

- Add a small event wrapper only after operator approval.
- Hook the wrapper into existing success paths and start actions already present in the repo:
  - homepage form success handler
  - Mastery Method booking submit flow
  - Mastery Method scorecard start and submit flow
  - portal activation and logout endpoints
- Keep payloads minimal and avoid collecting unnecessary personal data.

## What This Plan Does Not Claim

- It does not claim analytics are currently live.
- It does not claim any provider has been selected.
- It does not claim dashboard reporting already exists.
- It does not authorize adding analytics code without a separate implementation decision.
