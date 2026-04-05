> [!NOTE]
> HISTORICAL REFERENCE ONLY - NOT CANONICAL.
> This sprint plan records an earlier implementation sequence and should not control current remediation work.
> Use [DOC_AUTHORITY_INDEX.md](./DOC_AUTHORITY_INDEX.md) before acting on it.

# Top 10 Execution Sprint — The Pressure Academy

**Date:** 2026-03-20
**Scope:** The 10 highest-impact changes to thepressureacademy.com, in exact implementation order.
**Rule:** Items 1-3 are unblocked. Ship them before waiting on any owner decision.

---

## 1. Add post-demo CTA section

**Objective:** Place a second email capture form immediately after the planner demo section, before the visitor scrolls into the authority sequence (ecosystem, blueprint, chains, mastery).

**Why it matters:** The demo is the strongest conversion asset on the site. A visitor who just interacted with 6 sliders, toggled shift modes, and saw their score is at peak intent. Currently they must scroll through 4 more sections (~6 screen-heights) before reaching the join form. This change captures them at the warmest point.

**Owner dependency:** None.

**Estimated time:** 45 minutes.

**Success metric:** A second email capture form exists immediately after the planner demo section. It uses the same Formspree endpoint (`https://formspree.io/f/meerjgde`) with `intent=planner-access`. The two forms are source-distinguishable via the hidden `source` field (e.g., `source="post-demo-cta"` vs `source="join-section"`). Both forms use the same confirmation/thank-you logic. Formspree receives submissions from both forms.

---

## 2. Post-signup thank-you flow

**Objective:** Replace the inline "Thanks — your request is in. We will be in touch." text with a thank-you section that covers 4 specific things.

**Why it matters:** The current post-signup experience is a dead end. The visitor submitted their email, the form clears, sliders reset, and a single line of green text appears. No next steps, no timeline, no sense of what they just joined. This loses the lead's attention at the exact moment they're most engaged with the brand.

**The thank-you flow must deliver:**

1. **What happens next** — "You're on the early access list. Here's what that means."
2. **Timeline expectation** — "The full Planner launches [quarter/year]. You'll hear from us before anyone else."
3. **Delivery channel** — "Watch your inbox at [submitted email]. That's where launch details and your access link will arrive."
4. **One recommended next action** — "While you wait: try the demo above with a different persona and see how the scoring changes."

**Owner dependency:** None (timeline quarter can use placeholder if not yet decided).

**Estimated time:** 1 hour.

**Success metric:** After successful form submission, user sees all 4 elements — either via scroll to a revealed section or an in-place expansion. The form status area no longer shows a flat text string as the only feedback.

---

## 3. Build "Why This Is Different" section

**Objective:** Create a new named on-page section (`id="different"`, heading: "Why This Is Different") positioned between proof and ecosystem, containing 4 differentiation statements presented as scannable cards.

**Why it matters:** The site's strongest copy — 8+ "instead of" statements that position against generic wellness tools — is currently scattered across ecosystem, blueprint, chains, mastery, and FAQ sections. A first-visit sceptic evaluating the product will never scroll deep enough to encounter most of them. A consolidated section at the decision point (after proof, before the authority sequence) makes the case visible.

**The 4 statements should be drawn from:**
- "respects home load instead of pretending it does not" (line 2377)
- "accounts for that instead of pretending it does not happen" (line 2527)
- "respects reality instead of pretending you have unlimited energy and time" (line 2759)
- "teachable instead of fragmented" (line 2654)

Rewrite as short, scannable cards — not a copy-paste. The originals stay in their current locations for in-context reinforcement.

**Owner dependency:** None.

**Estimated time:** 1.5 hours.

**Success metric:** New section visible on the page between proof and ecosystem. Section has its own `id`, appears in the JS `sections` array and the nav. 4 differentiation cards are present and scannable on both desktop and mobile.

---

## 4. Add pricing expectation signal

**Objective:** Add "Early access is free. Planner pricing announced at launch." (or owner-approved equivalent) to the FAQ and join section.

**Why it matters:** The only cost language on the site is "free to join" and "no charge" — both describing the waitlist, not the product. A visitor has no way to calibrate whether the full product is £9 or £299. This ambiguity can read as either "too early" (acceptable) or "hiding the price" (suspicious). An explicit signal resolves the ambiguity.

**Owner dependency:** Owner must confirm or revise the pricing language.

**Estimated time:** 15 minutes.

**Success metric:** Both the FAQ answer for "Is early access free?" and the join section subtext contain the approved pricing expectation language.

---

## 5. Install analytics

**Objective:** Add a privacy-first analytics script (Plausible or Fathom recommended) that tracks page views, scroll depth, and form conversion events.

**Why it matters:** No analytics are currently installed. Every decision about what to improve, where visitors drop off, and whether changes work is a guess. Items 1-4 shipped without measurement — analytics retroactively validates them and informs everything that follows.

**Owner dependency:** Owner must choose analytics provider. Plausible recommended for privacy alignment (no cookies, GDPR-compliant, simple).

**Estimated time:** 30 minutes.

**Success metric:** Analytics script loads on every page and tracks page views. CTA click events and form submission events are instrumented for both capture points (post-demo CTA and join section), distinguishable by source. Scroll depth tracking and any additional event tracking are documented as implemented or noted as unsupported by the chosen provider. A brief integration note in the codebase records what is tracked, what is not, and where to extend.

---

## 6. Add FAQ schema markup

**Objective:** Add FAQPage structured data (`<script type="application/ld+json">`) wrapping all 6 existing FAQ questions and answers.

**Why it matters:** 6 Q&As already exist in HTML as `<details>/<summary>` elements. Adding schema markup makes them eligible for Google's FAQ rich results — free SERP real estate with zero content creation.

**Owner dependency:** None.

**Estimated time:** 20 minutes.

**Success metric:** FAQPage schema validates in Google Rich Results Test. All 6 questions and answers are present in the structured data. Existing Organization + WebSite schema remains intact.

---

## 7. Increase slider touch targets

**Objective:** Increase planner slider thumb size from 18px to 44px on mobile viewports (≤640px) via CSS media query.

**Why it matters:** The planner demo is the site's best sales tool. The slider thumb is currently 18px visual (extended to ~26px by box-shadow) — below the 44px WCAG minimum for touch targets. On small phones, visitors may struggle with precise slider manipulation, reducing demo engagement and weakening the conversion path.

**Owner dependency:** None.

**Estimated time:** 20 minutes.

**Success metric:** Slider thumb renders at ≥44px on viewports ≤640px. Both `-webkit-slider-thumb` and `-moz-range-thumb` pseudo-elements are sized. Passes WCAG 2.5.8 target size check.

---

## 8. `prefers-reduced-motion` verification

**Objective:** Verify and complete the `prefers-reduced-motion` implementation so that all GSAP animations and CSS keyframes are disabled when the user has reduced motion enabled.

**Why it matters:** A CSS media query exists (line 2159) and a JS variable is set (line 2850), but it's unverified whether they gate all animation paths. Motion-sensitive users who still see animations will bounce. This is also a WCAG 2.3.3 compliance item.

**Owner dependency:** None.

**Estimated time:** 30 minutes.

**Success metric:** With `prefers-reduced-motion: reduce` enabled: no GSAP animations fire, no CSS keyframes play, hero text is immediately visible (no opacity:0 start state), all content is accessible without animation.

---

## 9. Add founder/authority block

**Objective:** Add a founder section to the proof area containing a photo, 2-3 sentence bio, and at least one credibility marker (e.g., BJJ rank, shift work experience, parenting context).

**Why it matters:** Zero personal authority exists on the site — no name, no photo, no credentials, no "founded by" anywhere. Authority is entirely system/brand-centric. Premium coaching products depend on perceived expertise. A visitor considering a paid tool from a faceless brand has a high trust barrier. Even a minimal founder presence materially changes the equation.

**Owner dependency:** Owner must provide photo and bio copy.

**Estimated time:** 1 hour (once content is provided).

**Success metric:** Proof section contains a founder photo, 2-3 sentence bio, and at least one domain-specific credibility marker. The block is responsive and maintains the site's dark premium aesthetic.

---

## 10. Add real testimonials

**Objective:** Display 3-5 real quotes from beta users or early testers, each with first name and context (e.g., "Shift worker, 6 months").

**Why it matters:** Social proof is currently zero. Fabricated testimonials were correctly removed. The demo is doing all the trust work alone. Even 3 short, real quotes from actual users transform the credibility layer — they prove that real people have used the system and found it valuable.

**Owner dependency:** Owner must collect testimonials from real users.

**Estimated time:** 1 hour (once testimonials are provided).

**Success metric:** 3-5 real testimonial quotes are displayed on the page (after demo or in proof section). Each includes first name and a context descriptor. No fabricated quotes. No stock photos.

---

## Sprint Summary

| # | Item | Blocked? | Time |
|---|------|----------|------|
| 1 | Post-demo CTA | No | 45 min |
| 2 | Thank-you flow | No | 1 hr |
| 3 | "Why This Is Different" section | No | 1.5 hrs |
| 4 | Pricing signal | Owner | 15 min |
| 5 | Analytics | Owner | 30 min |
| 6 | FAQ schema | No | 20 min |
| 7 | Slider touch targets | No | 20 min |
| 8 | Reduced motion check | No | 30 min |
| 9 | Founder block | Owner | 1 hr |
| 10 | Testimonials | Owner | 1 hr |
| | **Total** | | **~7 hrs** |

**Unblocked items (1-3, 6-8): ~4.5 hours** — can ship immediately.
**Owner-dependent items (4-5, 9-10): ~2.75 hours** — ship when content/decisions arrive.
