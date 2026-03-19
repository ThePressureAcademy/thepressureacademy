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
| 1 | **Add post-demo CTA section** — inline email capture or scroll-to-join immediately after planner demo | Conversion — capture warm demo users at peak engagement | High | Low |
| 2 | **Install analytics** (Plausible, Fathom, or GA4 — privacy-first preferred) | Measurement — currently flying blind on scroll depth, bounce, conversion rate | High | Low |
| 3 | **Post-signup thank-you flow** — replace inline "Thanks" text with redirect to thank-you section: what happens next, expected timeline, share prompt | Conversion — eliminates dead-end post-conversion experience | High | Low |
| 4 | **Add founder/authority block** — photo, 2-3 sentence bio, credibility markers in proof section | Trust — premium products need a face; currently zero personal authority | High | Medium (needs content from owner) |
| 5 | **Collect and display 3-5 real testimonials** — placed after demo or in proof section | Trust — social proof is currently zero | High | Medium (needs users) |
| 6 | **Add FAQ schema markup** (FAQPage structured data) | SEO/trust — 6 Q&As exist but aren't schema-marked; easy SERP feature eligibility | Medium | Low |
| 7 | **Consolidate differentiation block** — gather best "instead of" statements into one "Why this is different" section between proof and ecosystem | Differentiation — strongest copy is currently buried across 5 sections | Medium | Low |
| 8 | **Add pricing expectation signal** — "Early access is free. Planner pricing announced at launch." in FAQ and join section | Conversion — removes value ambiguity; visitors can't currently calibrate cost | Medium | Low |
| 9 | **Increase slider touch targets** — thumb size from 18px to 44px on mobile via CSS media query | Conversion — demo is the best sales tool; mobile friction reduces demo engagement | Medium | Low |
| 10 | **Add `prefers-reduced-motion` verification** — confirm CSS query disables all 4 keyframes and JS check gates all GSAP timelines | Trust/compliance — accessibility requirement; motion-sensitive users bounce | Medium | Low |
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

**Items 1-3** are pure conversion mechanics. They require no external content, can be built by a developer alone, and directly affect email capture rate.

**Items 4-5** are trust mechanics. They require content from the business owner (photo, bio, testimonials) but have the highest impact on converting skeptical visitors.

**Items 6-10** are efficiency multipliers — SEO, accessibility, mobile usability, messaging clarity. Each is low effort with compounding value.

**Items 11-15** are quality and performance improvements. They improve perceived professionalism and technical health but don't directly drive conversions.
