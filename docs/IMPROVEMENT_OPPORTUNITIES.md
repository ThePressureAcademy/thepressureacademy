# Improvement Opportunities — The Pressure Academy

**Date:** 2026-03-19 (revised)
**Ranking criteria (strict commercial weighting):**

1. Immediate conversion lift — does this directly increase email captures?
2. Trust/authority lift — does this make the product feel more credible?
3. Differentiation lift — does this sharpen "why us"?
4. Data/measurement value — does this give us numbers to optimise against?
5. Effort-to-impact ratio — is this achievable in the time it deserves?

---

## Top 15 Ranked Improvements

| Rank | Item | Commercial Driver | Impact | Effort |
|------|------|-------------------|--------|--------|
| 1 | **Add post-demo CTA section** — inline email capture immediately after planner demo, duplicating join form with same Formspree endpoint | Conversion — capture warm demo users at peak engagement; no blocker | High | Low |
| 2 | **Post-signup thank-you flow** — on successful submission, show/scroll to thank-you section covering: (a) what happens next, (b) timeline expectation, (c) delivery channel, (d) one recommended next action | Conversion — eliminates dead-end post-conversion experience | High | Low |
| 3 | **Build "Why This Is Different" named section** — new on-page section (`id="different"`) between proof and ecosystem with dedicated heading and 4 differentiation cards drawn from existing "instead of" copy; registered in nav and JS sections array | Differentiation — strongest copy is buried across 5 sections; sceptics never see it | High | Medium |
| 4 | **Add pricing expectation signal** — "Early access is free. Planner pricing announced at launch." in FAQ and join section | Conversion — removes value ambiguity; visitors can't currently calibrate cost | Medium | Low |
| 5 | **Install analytics** (Plausible, Fathom, or GA4 — privacy-first preferred) | Measurement — currently flying blind on scroll depth, bounce, conversion rate; delayed by provider choice but must not block items 1-4 | High | Low |
| 6 | **Add FAQ schema markup** (FAQPage structured data) | SEO/trust — 6 Q&As exist but aren't schema-marked; easy SERP feature eligibility | Medium | Low |
| 7 | **Increase slider touch targets** — thumb size from 18px to 44px on mobile via CSS media query | Conversion — demo is the best sales tool; mobile friction reduces demo engagement | Medium | Low |
| 8 | **Add `prefers-reduced-motion` verification** — confirm CSS query disables all 4 keyframes and JS check gates all GSAP timelines | Trust/compliance — accessibility requirement; motion-sensitive users bounce | Medium | Low |
| 9 | **Add founder/authority block** — photo, 2-3 sentence bio, credibility markers in proof section | Trust — premium products need a face; currently zero personal authority | High | Medium (needs content from owner) |
| 10 | **Collect and display 3-5 real testimonials** — placed after demo or in proof section | Trust — social proof is currently zero | High | Medium (needs users) |
| 11 | **ScrollTrigger.batch() migration** — replace individual `.reveal` triggers with batch pattern | Performance — 50-100+ individual triggers → ~5; reduces mobile scroll jank | Medium | Medium |
| 12 | **Form submission success animation** — SVG checkmark draw + "You're on the list" confirmation | Conversion quality — makes signup feel intentional and premium | Low-Med | Low |
| 13 | **Planner demo score micro-interaction** — number morphing on score change, ring easing refinement | Product quality — makes the strongest sales asset feel more polished | Low-Med | Medium |
| 14 | **Add `loading="lazy"` to below-fold SVGs** — ecosystem, blueprint, mastery logo images | Performance — minor bandwidth/LCP win for below-fold content | Low | Low |
| 15 | **Orphaned CSS cleanup** — remove ~200 lines of unused proof-filter, old funnel-form styles | Technical debt — reduces page weight by ~5KB, cleaner codebase | Low | Low |

---

## Explicitly Downgraded Items

These were in the previous audit. They're removed from the Top 15 because they don't meet the commercial weighting threshold.

| Item | Previous Rank | Reason for Downgrade |
|------|--------------|---------------------|
| Magnetic CTA hover effects | 11 | Decorative — no evidence of conversion impact |
| Tab transition animations (Mastery) | 12 | Polish only — Mastery is not the conversion product |
| Chain panel expand animation | 13 | Polish only — authority section, not conversion path |
| Scroll-linked parallax on hero | 14 | Decorative — adds complexity, no conversion value |
| Coordinated animation choreography | 10 | High effort, decorative — no direct revenue link |
| Extract CSS/JS into separate files | 8 | Developer convenience — no user-facing impact for launch |
| Blog/content infrastructure | 15 | High effort, long-term — not launch-critical |

---

## Ranking Rationale

**Items 1-3** are unblocked conversion and differentiation mechanics. Post-demo CTA, thank-you flow, and the "Why This Is Different" section can all be built by a developer without waiting for owner decisions. They ship first.

**Items 4-5** require owner input (pricing language, analytics provider) but are high-impact. They slot in as soon as the owner decides — they must not block items 1-3.

**Items 6-8** are low-effort multipliers — SEO schema, mobile touch targets, accessibility. Each takes under 30 minutes and compounds value.

**Items 9-10** are trust mechanics. They require content from the business owner (photo, bio, testimonials) but have the highest impact on converting sceptical visitors before paid launch.

**Items 11-15** are quality and performance improvements. They improve perceived professionalism and technical health but don't directly drive conversions.
