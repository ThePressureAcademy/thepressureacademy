# Interaction & Motion Audit — The Pressure Academy

**Date:** 2026-03-19 (revised)
**Scope:** All CSS animations, GSAP usage, interactive components, scroll behaviour, state management in `index.html`
**Commercial lens:** Motion items are evaluated by their impact on conversion, trust, and perceived product quality — not visual polish alone.

---

## 1. Executive Summary

**Grade: B+** for animation quality, **C+** for performance.

The GSAP implementation is competent — hero word-stagger, SVG ring animation, and scroll reveals are well-executed and GPU-friendly. The planner demo is genuinely interactive and serves as the site's best conversion tool. However, 50-100+ individual ScrollTrigger instances create unnecessary scroll overhead, `prefers-reduced-motion` has only a partial implementation, and several interactive components (tabs, chain panels) lack transition polish that would reinforce the premium positioning.

---

## 2. GSAP Usage Audit

### Setup
- **Version:** 3.12.7 via CDN (current stable)
- **Plugins:** ScrollTrigger, ScrollToPlugin
- **Loading:** All three scripts use `defer` — not render-blocking
- **Initialisation:** Single IIFE wrapping all JS (~920 lines)

### Hero Timeline
- Word-split stagger animation on h1 — each word wrapped in a `<span>`, animated with GSAP `fromTo` (opacity 0→1, y 30→0)
- Well-executed, GPU-friendly (transform + opacity only)
- Stagger timing creates a premium reading experience
- **Commercial value:** High — this is the first visual impression

### SVG Scoring Ring
- `stroke-dashoffset` animation on circular SVG path
- Smooth, performant, responds to planner input changes in real-time
- Standard technique, correctly implemented
- **Commercial value:** High — visual proof that the scoring system works

### Counter Animations
- GSAP `to()` with `snap: 1` for integer counting
- Used for hero stats bar numbers
- Standard pattern, no issues

### ScrollTrigger Reveals
- Batch creation: `.reveal` class elements each get an individual ScrollTrigger
- Animation: `opacity 0→1, translateY 30px→0` on enter viewport
- **Issue:** Each trigger creates a separate scroll listener and position calculation
- Estimated 50-100+ instances based on `.reveal` usage across all sections

### SVG Line Drawing
- Ecosystem section: SVG bezier curves connecting nodes
- Chain section: SVG connections between steps
- Blueprint loop: Circular polar-coordinate positioning with connecting lines
- All recalculated on resize — functional but DOM-heavy

---

## 3. ScrollTrigger Performance Analysis

**Current pattern:** Individual ScrollTrigger per `.reveal` element.

```
// Pseudocode of current approach
document.querySelectorAll('.reveal').forEach(el => {
  ScrollTrigger.create({ trigger: el, ... })
})
```

**Problem:** Each trigger adds a scroll event listener and forces position recalculation. With 50-100+ elements, this creates measurable scroll jank on low-end mobile devices.

**Fix:** `ScrollTrigger.batch()` — single IntersectionObserver, batch callback.

```javascript
ScrollTrigger.batch('.reveal', {
  onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1 })
});
```

**Estimated improvement:** Reduce scroll handlers from 50-100+ to ~5.

**Commercial value:** Medium — affects perceived smoothness on mobile, which is where most visitors will experience the site. Jerky scrolling undermines the premium positioning.

---

## 4. CSS Animation Audit

### Keyframe Animations (4 total)

| Name | Purpose | Properties | Commercial Value |
|------|---------|------------|-----------------|
| `pulse` | Glow on interactive elements | box-shadow opacity | Medium — draws attention to demo |
| `interactiveBorderPulse` | Border highlight on demo | border-color opacity | Medium — indicates interactivity |
| `ambientInteractiveGlow` | Background glow | radial-gradient opacity | Low — atmospheric only |
| `borderSweep` | Rotating border gradient | background-position | Low — decorative |

### `prefers-reduced-motion` Implementation

A media query exists at line 2159:
```css
@media (prefers-reduced-motion: reduce) { ... }
```

And a JS check at line 2850:
```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

**Audit needed:** Verify that the CSS media query actually disables all 4 keyframe animations, and that the JS check gates all GSAP timeline creation. If the CSS query only targets a subset of animations, or the JS check doesn't prevent ScrollTrigger batch creation, motion-sensitive users still experience unwanted animation.

### Missing CSS Optimisations
- No `will-change` hints on frequently animated elements (minor GPU scheduling hint)
- No animation choreography — elements animate independently without coordinated timing
- CSS custom properties used for colours but not for animation timing/easing (missed consistency opportunity)

---

## 5. Interaction Design Quality

### Planner Demo — Grade: A
- **Commercial value: Highest on the site.** This is the product's best pitch.
- 6 range inputs (sleep, training, nutrition, stress, hydration, family)
- Real-time score calculation with persona-weighted variables
- Shift-mode toggle (day/night/rotating) genuinely changes scoring weights
- SVG ring animation responds to score changes
- Coaching recommendations panel updates per-variable
- Preset scenarios (Sharp, Fatigued, Dad Mode) let visitors see extremes quickly
- **Friction:** Slider thumbs are 18px visual — too small for mobile touch targets

### Ecosystem Map — Grade: B
- SVG bezier connections between 5 ecosystem nodes
- Hover states with information reveal
- Path filtering (Shift Worker / BJJ / Parent / Education)
- Functional but passive — no deep interaction beyond hover
- **Commercial value:** Medium — builds authority but doesn't convert

### Blueprint Loop — Grade: B-
- Circular polar-coordinate positioning of 6 methodology phases
- Autoplay stepping through phases
- Pulse animation on active node
- Visually distinctive but interaction is limited to clicking nodes and autoplay
- **Commercial value:** Low — educational, not conversion-relevant

### Chains — Grade: C+
- Expandable panels with height toggle
- SVG connections between steps
- Basic expand/collapse with no transition animation
- **Commercial value:** Low — authority content, not on the conversion path

### Mastery Tabs — Grade: C+
- 4-tab content switching (Focus & Logic, Achievement, Creativity, Connection)
- Instant content swap — no transition between tab content
- Functional but feels flat compared to the planner demo's polish
- **Commercial value:** Low — educational content for a different audience (parents/children)

### Persona Selector — Grade: B
- 4 buttons in hero: Shift Worker, Grappler, Parent, Learning Support
- Sets `data-persona` on body element
- Adjusts planner weights and coaching language
- Subtle effect — visitor may not notice the difference unless they compare personas
- **Commercial value:** Medium — personalisation increases perceived relevance

---

## 6. Motion Design Consistency

**Reveal pattern:** Consistent across all sections (opacity 0→1, translateY 30→0). Good baseline uniformity.

**Timing:** Varies between sections. Hero has carefully choreographed stagger; other sections use default GSAP ease and duration. The quality gap between hero animation and the rest is noticeable.

**Easing:** Mostly GSAP defaults (`power1.out` or similar). No custom easing curve for brand identity. Premium sites often define a signature ease.

**Gaps:**
- No exit animations — elements only animate in, never out. Scrolling back up shows static content.
- No scroll-velocity-aware timing — fast scrollers and slow scrollers get the same animation speed.
- Transition between interactive states (tab switch, chain expand) lacks the polish of the GSAP-driven reveals.

---

## 7. Micro-interaction Opportunities (Commercially Ranked)

### Conversion-relevant (worth building)

| Interaction | Where | Impact | Effort |
|-------------|-------|--------|--------|
| Form submission success animation | Join section | Confirms action, feels premium | Low |
| Score-change number morph | Planner demo | Makes best asset feel polished | Medium |
| CTA button hover feedback | All "Get Early Access" buttons | Reinforces clickability | Low |

### Decorative (skip for now)

| Interaction | Where | Why Skip |
|-------------|-------|----------|
| Magnetic cursor pull on CTAs | All buttons | No evidence of conversion impact |
| Parallax on hero background | Hero | Adds complexity, no commercial value |
| Exit animations on scroll-up | All sections | Polish only, no user benefit |
| Tab cross-fade (Mastery) | Mastery section | Not on conversion path |
| Chain panel height animation | Chains section | Authority section, not conversion |

---

## 8. Accessibility

### `prefers-reduced-motion`
- CSS media query at line 2159
- JS variable check at line 2850
- **Verify:** Does the CSS query disable all 4 keyframe animations? Does the JS check prevent all GSAP animations or just the hero timeline?

### Keyboard Navigation
- Planner sliders: native `<input type="range">` — keyboard accessible by default
- Tab/persona/shift buttons: verify `tabindex` and keyboard event handlers
- FAQ accordions: `<details>/<summary>` — keyboard accessible natively
- Mobile menu: verify focus trap when open

### JS Failure Mode
- Hero h1 starts at `opacity: 0` via GSAP setup — if JS fails, hero text is invisible
- Consider a `<noscript>` style override or CSS default visibility with JS-applied hide

### Focus States
- Verify visible focus indicators on all interactive elements
- Dark theme can make default browser focus rings invisible — may need custom `:focus-visible` styles
