# Execution Priority Map — The Pressure Academy

**Date:** 2026-03-19
**Principle:** Highest leverage first. Minimum effort for maximum commercial, perceptual, and performance gain. Do not touch things that are already working.

---

## Tier 1 — Quick Wins (< 1 hour each, immediate lift)

These items require minimal code changes and produce disproportionate results. Execute before anything else.

### 1.1 Add inline CTA after the Planner demo section
**Ref:** CF-1
**What:** Insert a compact CTA block between `</section><!-- #planner -->` and `<section id="product-value">`. Centre-aligned, one line of copy + one button.
**Why:** The visitor's peak engagement moment currently has no conversion capture. This is the single highest-leverage change on the page.
**Dependencies:** None.

### 1.2 Rewrite section headings as curiosity hooks
**Ref:** CM-1
**What:** Replace 6 section headings with intrigue-driven alternatives. No structural changes — text-only edits.
**Why:** Headings are the first thing a scrolling visitor reads. Curiosity hooks increase scroll depth and section engagement without adding complexity.
**Dependencies:** None.

### 1.3 Add FAQPage schema markup
**Ref:** TF-1
**What:** Add a `<script type="application/ld+json">` block with FAQPage structured data for the 6 FAQ questions.
**Why:** Free SERP feature eligibility. Zero visual change, immediate SEO value.
**Dependencies:** None.

### 1.4 Debounce the resize handler
**Ref:** MI-8
**What:** Wrap the resize event callback in `requestAnimationFrame`. One line change.
**Why:** Prevents forced reflow cascades during window resizing. Low effort, meaningful mobile performance improvement.
**Dependencies:** None.

### 1.5 Pause off-screen CSS animations
**Ref:** MI-2
**What:** Add IntersectionObserver to toggle `animation-play-state` on elements using `ambientInteractiveGlow`.
**Why:** 20+ elements running continuous box-shadow animations off-screen is the largest unnecessary paint cost on the page.
**Dependencies:** None.

### 1.6 Add a curiosity CTA after the demo ("Convinced? / Curious?")
**Ref:** CM-2
**What:** After the demo section, present two paths: "Get Early Access" for the convinced, "See how the score affects your week" for the curious.
**Why:** Splits the audience at peak engagement into conversion or deeper engagement, rather than dumping everyone into a product-value explainer.
**Dependencies:** 1.1 (or replace 1.1 with this as a more sophisticated version).

---

## Tier 2 — High-Value Work (1-4 hours each, strategic lift)

These items require more implementation but produce measurable quality and conversion improvements.

### 2.1 Migrate ScrollTrigger reveals to `ScrollTrigger.batch()`
**Ref:** MI-1
**What:** Replace individual `gsap.fromTo` + ScrollTrigger per `.reveal` element with a single `ScrollTrigger.batch('.reveal', ...)` call.
**Why:** Reduces 40-60 scroll observers to ~1. Meaningful scroll performance improvement, especially on mobile.
**Dependencies:** None. Test thoroughly — batch stagger timing may need tuning.

### 2.2 Build a premium join/CTA section
**Ref:** PF-2
**What:** Redesign the join section (section 10) with: full-width background gradient, larger Planner logo, waitlist counter, animated border on the form card, stronger visual presence.
**Why:** The section that should work hardest commercially has the least visual investment. This is the last thing a visitor sees before deciding.
**Dependencies:** 1.1 should be in place first (so the join section isn't the only CTA).

### 2.3 Add planner score morphing + coach panel transitions
**Ref:** MI-3, MI-4
**What:** Score number animates via GSAP snap tween (300ms). Coach panel fades out/in on content change (150ms each).
**Why:** These two micro-interactions transform the demo from "functional" to "polished." Combined effort is ~1 hour.
**Dependencies:** None.

### 2.4 Animate slider presets
**Ref:** MI-5
**What:** When a preset button is clicked, GSAP tweens all 6 sliders to their target values over 400ms.
**Why:** Creates a "watch the system reconfigure" moment that demonstrates the product's responsiveness more dramatically than instant value setting.
**Dependencies:** None.

### 2.5 Replace diamond icons in product-value cards
**Ref:** PF-1
**What:** Replace `&#9670;` with designed icon elements matching the `feature-icon` pattern used elsewhere. Use meaningful initials or simple SVG icons.
**Why:** The product-value section is the third section on the page and the only one that feels template-like. Fixing this takes 30 minutes.
**Dependencies:** None.

### 2.6 Extract FAQ inline styles to CSS classes
**Ref:** PF-3
**What:** Create `.faq-item`, `.faq-summary`, `.faq-body` classes. Replace 20+ inline style attributes.
**Why:** Code quality that also makes future FAQ changes easier. Low effort, good hygiene.
**Dependencies:** None.

### 2.7 Install analytics
**Ref:** CF-3
**What:** Add Plausible, Fathom, or Vercel Analytics. Single script tag.
**Why:** Without data, every future decision is a guess. This is a prerequisite for optimising anything.
**Dependencies:** Owner decision on analytics provider.

---

## Tier 3 — Strategic Investments (half-day to full-day each)

These items require significant implementation or external content but produce lasting improvements.

### 3.1 Add founder bio/about section
**Ref:** PF-4
**What:** Compact section between proof and ecosystem: photo, one-sentence bio, 2-3 credibility markers.
**Why:** Premium products need a face. "Built by a shift worker, grappler, and parent" is copy — a photo makes it credibility.
**Dependencies:** Owner provides photo and biographical details.

### 3.2 Progressive ecosystem reveal
**Ref:** CM-3
**What:** Start with only the Planner node visible and active. Reveal additional nodes as the visitor scrolls or interacts with the path filter.
**Why:** Creates layered discovery instead of full-map information dump.
**Dependencies:** 2.1 (batch ScrollTrigger should be in place for additional scroll-triggered reveals).

### 3.3 Persona-aware section filtering
**Ref:** EE-1
**What:** Use the `body[data-persona]` attribute to collapse or minimize sections irrelevant to the selected persona. Shift workers see a teaser for Blueprint instead of the full interactive; Parents see Mastery elevated.
**Why:** The page currently shows 100% of content to 100% of visitors, regardless of who they are. Persona selection should actually change the page meaningfully.
**Dependencies:** Persona selector must remain functional. Test all 4 persona states + default.

### 3.4 Varied reveal patterns per section type
**Ref:** MI-10
**What:** Instead of uniform translateY reveals, use: left-slide for section heads, stagger-cascade for card grids, scale+blur for interactive panels, overshoot for CTAs.
**Why:** Uniform animation makes the page feel mechanical. Varied motion adds perceived craftsmanship.
**Dependencies:** 2.1 (batch migration should be done first, then extend with varied patterns).

### 3.5 Extract CSS and JS to separate files
**Ref:** TF-3
**What:** Create `style.css` (~1,500 lines) and `app.js` (~800 lines). Update `index.html` to link them. Update `vercel.json` cache headers.
**Why:** Enables browser caching, better dev tooling, and easier collaboration.
**Dependencies:** None, but should be done when other code changes are minimal to avoid merge conflicts.

---

## Tier 4 — Future Roadmap (do not start yet)

These items are valuable but depend on external factors or should wait until the product launches.

### 4.1 Real testimonials section
**Wait for:** Actual beta users or early access members to provide feedback.
**What:** Replace the "Why this exists" proof section with 3-5 real testimonials from people who have used the Planner.

### 4.2 Blog/content marketing infrastructure
**Wait for:** Product launch. Content marketing is wasted effort while the product isn't live.
**What:** Add a `/blog` or `/articles` structure for SEO-driven content.

### 4.3 Scroll-linked parallax effects
**Wait for:** Tier 2 and 3 items to be complete. Adding parallax to an unoptimised page makes performance worse.
**What:** Subtle depth movement on hero background gradients, section divider elements.

### 4.4 URL state for planner configuration
**Wait for:** Product concept validation. Shareability matters more when people are actually sharing.
**What:** Encode slider values + shift mode + persona in URL hash for link-sharing.

### 4.5 Exit-intent conversion capture
**Wait for:** Analytics data showing bounce rate and scroll depth. Don't add exit-intent patterns until you know how visitors actually behave.
**What:** Non-intrusive bottom bar for visitors who scroll past the join section without converting.

---

## What NOT to Do

| Temptation | Why to Avoid |
|-----------|--------------|
| Add more ecosystem sections | The page is already 10 sections long. More sections = more scroll distance between demo and CTA. |
| Add scroll-based parallax before optimisation | The page already has performance concerns from CSS animations. Adding parallax before fixing batch ScrollTrigger and pausing off-screen animations would make things worse. |
| Build a multi-page site | The single-page structure is correct for a pre-launch product. Multi-page adds complexity without adding conversion. |
| Add a pricing page | Pricing isn't decided. Building a pricing page creates an obligation. |
| Add "more animation" everywhere | The page's problem is not a lack of animation — it's uneven animation quality. Polish what exists before adding more. |
| Rebuild the ecosystem section | It's technically impressive and mostly works. Refinement (progressive reveal, better mobile) is better than a rewrite. |

---

## Execution Sequence (Recommended Order)

```
Week 1 — Quick Wins
├── 1.1 Inline CTA after demo
├── 1.2 Curiosity headings
├── 1.3 FAQ schema
├── 1.4 Debounce resize
├── 1.5 Pause off-screen animations
└── 1.6 Curiosity CTA variant

Week 2 — Core Polish
├── 2.1 ScrollTrigger.batch() migration
├── 2.3 Score morphing + coach transitions
├── 2.4 Preset animations
├── 2.5 Product-value card icons
├── 2.6 FAQ style extraction
└── 2.7 Analytics installation

Week 3 — Strategic
├── 2.2 Premium join section
├── 3.1 Founder bio (if content ready)
└── 3.2 Progressive ecosystem reveal

Week 4+ — Refinement
├── 3.3 Persona-aware section filtering
├── 3.4 Varied reveal patterns
└── 3.5 CSS/JS extraction
```
