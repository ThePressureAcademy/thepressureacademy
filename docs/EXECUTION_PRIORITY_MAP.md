> [!NOTE]
> HISTORICAL REFERENCE ONLY - NOT CANONICAL.
> This sprint-ordering document reflects a March 2026 planning snapshot. It must not be treated as current implementation authority.
> Use [DOC_AUTHORITY_INDEX.md](./DOC_AUTHORITY_INDEX.md) before acting on any older execution plan.

# Execution Priority Map — The Pressure Academy

**Date:** 2026-03-19 (revised)
**Principle:** Strict commercial weighting. Conversion first, then trust, then differentiation, then measurement, then effort-to-impact. No tiers, no "future roadmap" — 15 changes in exact implementation order.

---

## Top 15 Changes — Implementation Order

| # | Change | Why This Order | Blocked By | Est. Time |
|---|--------|----------------|------------|-----------|
| 1 | **Add post-demo CTA section** — inline email capture after planner demo, duplicating the join form with same Formspree endpoint | Highest-leverage conversion change. No blocker. Warm demo users currently scroll through 4 sections before seeing a form. Ship this first so every subsequent change is captured by the new conversion point. | Nothing | 45 min |
| 2 | **Post-signup thank-you flow** — on successful submission, scroll to a new thank-you section that covers: (a) what happens next, (b) expected timeline, (c) delivery channel, (d) one recommended next action | Dead-end post-signup is the second-biggest conversion leak. Strengthening this retains the lead's attention and sets expectations. | Nothing | 1 hr |
| 3 | **Build the "Why This Is Different" section** — new named on-page section between proof and ecosystem with a dedicated `id`, heading, and 4 differentiation statements drawn from the existing "instead of" copy | Differentiation is the site's strongest copy but it's buried. A visible, scannable section converts sceptics before they hit the authority sequence. | Nothing | 1.5 hrs |
| 4 | **Add pricing expectation signal** — "Early access is free. Planner pricing announced at launch." in FAQ and join section | Removes value ambiguity. Visitors need to know this isn't a bait-and-switch. | Owner: confirm messaging | 15 min |
| 5 | **Install analytics** (Plausible or Fathom, privacy-first) | Now that the two biggest conversion changes (post-demo CTA, thank-you flow) are live, analytics measures their impact. If provider choice delays this, items 1-4 still ship. | Owner: provider choice | 30 min |
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
- **Item 4** — pricing language approval
- **Item 5** — analytics provider choice (Plausible recommended for privacy alignment)
- **Item 9** — founder photo and bio copy
- **Item 10** — real testimonials from beta users

### Can execute immediately (developer track)
Items 1, 2, 3, 6, 7, 8, 11, 12, 13, 14, 15 — all code changes, no external dependencies.

### Recommended parallel tracks

**Track A (developer, no blockers):**
```
1 → 2 → 3 → 6 → 7 → 8 → 11 → 12 → 13 → 14 → 15
```
Estimated total: ~10 hours of focused development

**Track B (owner decisions, then developer implements):**
```
4 (pricing language) → 5 (analytics choice) → 9 (bio/photo) → 10 (testimonials)
```
Owner lead time is the bottleneck. Developer implementation is ~3 hours once content is provided.

### Key change from previous revision
Post-demo CTA (#1), thank-you flow (#2), and differentiation section (#3) are all unblocked and ship before analytics. If the owner's provider decision delays analytics, the three highest-impact conversion changes are already live.

---

## Total Estimated Investment

| Track | Items | Dev Time | Owner Time |
|-------|-------|----------|------------|
| A (unblocked) | 1,2,3,6,7,8,11-15 | ~10 hrs | None |
| B (blocked) | 4,5,9,10 | ~3 hrs | Variable (content collection) |
| **Total** | **15** | **~13 hrs** | **Owner decision + content** |

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
