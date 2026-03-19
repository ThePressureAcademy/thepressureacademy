# Execution Priority Map — The Pressure Academy

**Date:** 2026-03-19 (revised)
**Principle:** Strict commercial weighting. Conversion first, then trust, then differentiation, then measurement, then effort-to-impact. No tiers, no "future roadmap" — 15 changes in exact implementation order.

---

## Top 15 Changes — Implementation Order

| # | Change | Why This Order | Blocked By | Est. Time |
|---|--------|----------------|------------|-----------|
| 1 | **Install analytics** (Plausible or Fathom, privacy-first) | Everything after this can be measured. Without it, all other changes are unverifiable. | Owner: provider choice | 30 min |
| 2 | **Add post-demo CTA section** — inline email capture or scroll-to-join after planner demo | Highest-leverage conversion change. Warm demo users currently scroll through 4 sections before seeing a form. | Nothing | 45 min |
| 3 | **Post-signup thank-you flow** — replace inline "Thanks" with redirect to thank-you section: what happens next, expected timeline, social share prompt | Reduces post-conversion confusion. Currently a dead end. | Nothing | 1 hr |
| 4 | **Add pricing expectation signal** — "Early access is free. Planner pricing announced at launch." in FAQ and join section | Removes value ambiguity. Visitors need to know this isn't a bait-and-switch. | Owner: confirm messaging | 15 min |
| 5 | **Consolidate differentiation block** — gather scattered "instead of" statements into a single "Why this is different" section between proof and ecosystem | Makes the strongest copy on the site visible in one place instead of buried. | Nothing | 1 hr |
| 6 | **Add FAQ schema markup** (FAQPage structured data) | Zero-effort SEO win. 6 Q&As already exist in HTML, just need `<script type="application/ld+json">` wrapper. | Nothing | 20 min |
| 7 | **Increase slider touch targets** — thumb size from 18px to 44px on mobile via CSS media query | Removes the only measurable mobile conversion friction point. The demo is the best sales tool. | Nothing | 20 min |
| 8 | **Add `prefers-reduced-motion` verification** — confirm CSS query disables all 4 keyframes, JS check gates all GSAP timelines | Accessibility compliance. Failing this loses motion-sensitive users and is a WCAG violation. | Nothing | 30 min |
| 9 | **Add founder/authority block** — photo, 2-3 sentence bio, credibility markers in proof section | Trust gap is the biggest weakness after conversion path. Premium products need a face. | Owner: photo + bio copy | 1 hr |
| 10 | **Add real testimonials** — 3-5 quotes from beta users/early testers, placed after demo or in proof section | Social proof is currently zero. Even 3 real quotes change the trust equation. | Owner: collect testimonials | 1 hr |
| 11 | **ScrollTrigger.batch() migration** — replace individual `.reveal` triggers with batch pattern | Performance improvement that affects perceived quality on mobile. 50-100+ triggers → ~5. | Nothing | 2 hrs |
| 12 | **Form submission success animation** — SVG checkmark draw + "You're on the list" confirmation | Small but noticeable conversion-quality signal. Makes the signup feel intentional. | Nothing | 45 min |
| 13 | **Planner demo score micro-interaction** — number morphing on score change, ring animation easing refinement | Makes the strongest sales asset (the demo) feel more premium. | Nothing | 2 hrs |
| 14 | **Add `loading="lazy"` to below-fold SVGs** — ecosystem, blueprint, mastery logo images | Minor performance win. Easy to implement, no risk. | Nothing | 15 min |
| 15 | **Orphaned CSS cleanup** — remove ~200 lines of unused proof-filter, old funnel-form styles | Technical hygiene. Reduces page weight by ~5KB. | Nothing | 30 min |

---

## Dependencies Summary

### Needs owner input
- **Item 1** — analytics provider choice (Plausible recommended for privacy alignment)
- **Item 4** — pricing language approval
- **Item 9** — founder photo and bio copy
- **Item 10** — real testimonials from beta users

### Can execute immediately (developer track)
Items 2, 3, 5, 6, 7, 8, 11, 12, 13, 14, 15 — all code changes, no external dependencies.

### Recommended parallel tracks

**Track A (developer, no blockers):**
```
2 → 3 → 5 → 6 → 7 → 8 → 11 → 12 → 13 → 14 → 15
```
Estimated total: ~9.5 hours of focused development

**Track B (owner decisions, then developer implements):**
```
1 (analytics choice) → 4 (pricing language) → 9 (bio/photo) → 10 (testimonials)
```
Owner lead time is the bottleneck. Developer implementation is ~3 hours once content is provided.

---

## Total Estimated Investment

| Track | Items | Dev Time | Owner Time |
|-------|-------|----------|------------|
| A (unblocked) | 2,3,5,6,7,8,11-15 | ~9.5 hrs | None |
| B (blocked) | 1,4,9,10 | ~3 hrs | Variable (content collection) |
| **Total** | **15** | **~12.5 hrs** | **Owner decision + content** |

---

## What's NOT on this list (and why)

| Excluded Item | Reason |
|---------------|--------|
| Magnetic CTA hover effects | Decorative — no conversion evidence |
| Tab transitions (Mastery) | Off the conversion path |
| Chain panel animations | Authority section, not conversion |
| Hero parallax | Adds complexity, no commercial value |
| Animation choreography | High effort, decorative |
| CSS/JS file extraction | Developer convenience, no user impact |
| Blog/content infrastructure | High effort, long-term play |
