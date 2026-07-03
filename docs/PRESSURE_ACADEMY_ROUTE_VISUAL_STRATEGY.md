# Pressure Academy Route Visual Strategy

Status: `ACTIVE — VISUAL PERFORMANCE LAYER v1`
Date: 3 July 2026
Source of truth at runtime: `js/config/visual-system.js → routes[]` (first pattern match wins; unmatched routes fall to the `minimal` default). This doc explains the assignments; if it drifts from the config, the config wins.

## Assignments

| Route | Intensity | Rationale |
| --- | --- | --- |
| `/` | **cinematic** | Brand hub, no on-page money step. Carries the only video-loop slot (`home-hero`, placeholder) and the ambient-drift fallback. First impression is allowed to spend the most — within the 1-loop/4 MB budget. |
| `/shop/` | **standard** | Storefront junction; cards + reveal + micro-feedback. Speed to category beats spectacle. |
| `/shop/apparel/` | **standard** | Retail conversion surface: product grid, cart drawer, drop-list capture. Future product photography arrives as lazy images before any product video is even considered. |
| `/shop/mats/` | **standard** | Considered-purchase surface. Calculator and enquiry form are the conversion machinery; `mat-calc-reveal` (placeholder) is the one planned micro-reward. |
| `/seminars/` | **standard** | Funnel entry; founding-list capture must be instant. |
| `/seminars/[slug]` | **standard** | The high-ticket money path (registration → Stripe Payment Link). Motion is micro-feedback only: confirm pulse, register-panel pulse on unavailable-checkout, departure fade on redirect. Never autoplay video here; a future athlete/event film is click-to-play. |
| `/blueprints/` | **cinematic** | Aspirational catalogue; may take a governed loop later (no slot wired yet). |
| `/blueprints/[slug]` | **standard** | Conversion template (waitlist/checkout states). |
| `/campaigns/[slug]` | **standard** | Paid-traffic landings: fastest useful paint wins ad economics. |
| `/academy-orders/` | **standard** | B2B enquiry path; credibility = clarity + speed. |
| `/contact/` | **minimal** | Utility. Scroll animation off; confirm pulse only. |
| `/privacy-policy.html` | **minimal (unwired)** | Legal text. Layer not loaded. |
| Unknown-slug fallbacks (`_event`, `_blueprint`, `_campaign` honest states) | inherit **standard** route posture; they contain no media hooks | Honest states must feel stable, not decorated. |
| `/planner` | **do not disturb** | Separate self-contained app; explicitly absent from the route table; no layer files loaded. |
| `/mastery-method/**` (public + portal) | **do not disturb** | Separate subsystem with its own inline CSS and portal auth. Off limits. |
| `liftiq/**` | **dormant** | 308-redirected in production; untouched. |

## `experimental` intensity

Defined in the ladder, assigned to **no route**. It exists so a future isolated showcase (e.g. a WebGL blueprint explorer) has a governed home without inventing a new mechanism. Turning it on anywhere requires: operator decision, its own route entry, `allowWebGL: true` scoped to that route, and a budget-doc update in the same change. It must never host a checkout CTA.

## Escalation/demotion rules

- A route earns `cinematic` only if it has no on-page payment step and its conversion action survives the added weight.
- Any route that gains a live checkout step is capped at `standard` from that moment (seminar slug pages are already treated this way).
- Demotion is always safe: dropping a route to `minimal` requires only the config edit and cannot break content.
