# Interaction & Motion Audit — The Pressure Academy

**Date:** 2026-03-19
**Auditor role:** JavaScript/animation engineer · Frontend UX specialist · Interaction designer
**Scope:** All CSS animations, GSAP usage, interactive components, scroll behaviour, state management in index.html

---

## Executive Summary

The site's interaction layer is technically competent but unevenly invested. The Planner demo is a genuinely excellent interactive component — real-time scoring, shift-mode weighting, coaching feedback, and presets. The ecosystem map, blueprint loop, and chain explorer are all functional interactive diagrams. However, animation quality drops off sharply outside the hero sequence: transitions between states are abrupt, reveal animations are generic, and performance-risky patterns (individual ScrollTriggers per element, DOM queries in resize handlers) go unoptimised. The site has good bones but needs choreography, polish, and restraint.

**Interaction grade: B-** — strong interactive components, weak motion choreography, inconsistent polish, unoptimised scroll performance.

---

## 1. GSAP Usage Audit

### Version & Plugins
- GSAP 3.12.7 via CDN (current stable — good)
- ScrollTrigger plugin — registered and used for reveals + section tracking
- ScrollToPlugin — used for smooth scroll navigation
- All loaded with `defer` attribute — correct

### Hero Timeline (lines 3610-3619)
```
heroTl: persona-selector → eyebrow → h1 words → hero-sub → hero-actions → stat-cards → device-card → side-card
```
**Verdict: Well-executed.** Staggered word reveal on the h1 (0.045s stagger, `splitWordsInNode` at line 2868) is the most polished animation on the page. Timing overlaps (`-=0.18` etc.) create a cascading feel. Duration (0.4-0.55s) and easing (`power3.out`) are appropriate.

**One concern:** The word-split function modifies DOM (creates `<span class="word">` wrappers) but only checks `dataset.splitDone` — if the function fires twice (e.g., HMR in development), it would create nested spans. Not a production issue but fragile.

### ScrollTrigger Reveals (lines 3597-3608)
```javascript
document.querySelectorAll('.reveal').forEach((el) => {
  gsap.fromTo(el, { opacity: 0, y: 22 }, {
    opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 84%' }
  });
});
```

**Problem: Individual ScrollTrigger per `.reveal` element.**
I count approximately 40-60 `.reveal` elements across the page (hero elements, section heads, cards, panels, feature cards, proof cards, etc.). Each creates its own ScrollTrigger instance with its own scroll listener and calculation. This is a known performance pattern to avoid.

**Fix:** Use `ScrollTrigger.batch()`:
```javascript
ScrollTrigger.batch('.reveal', {
  onEnter: batch => gsap.fromTo(batch,
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.08 }
  ),
  start: 'top 84%'
});
```
This reduces scroll overhead from 40-60 individual triggers to a single batch observer.

### Section Tracking ScrollTriggers (lines 3621-3632)
10 additional ScrollTrigger instances for nav highlighting. These are lightweight (toggle only, no animation) and acceptable.

### Ring Animations (lines 3403-3409)
```javascript
gsap.to('#plannerRing', { strokeDashoffset: offset, duration: 0.45, ease: 'power2.out' });
gsap.to('#heroRing', { strokeDashoffset: heroOffset, duration: 0.6, ease: 'power2.out' });
```
**Good.** Stroke-dashoffset animation is GPU-composited (filter layer, not layout). Duration and easing are appropriate. The planner ring animates on every slider input change — GSAP handles rapid re-triggers gracefully via its overwrite mode.

### Counter Animations (lines 3641-3656)
Using `gsap.fromTo` with `snap: { innerText: 1 }` — standard GSAP counter pattern. Works correctly. Each counter gets its own ScrollTrigger (3 counters = 3 triggers) — acceptable at this count.

### Loop Progress Animation (lines 3437-3444)
Stroke-dashoffset animation on the blueprint loop circle. Clean implementation, same pattern as the scoring ring.

---

## 2. CSS Animation Audit

### Keyframe Animations

**1. `pulse` (lines 133-137)**
Box-shadow expansion on the eyebrow dot. Subtle, 2s infinite. Appropriate — signals "live" status.

**2. `interactiveBorderPulse` (lines 141-160)**
Complex multi-layer box-shadow pulsation. Applied on `:hover`, `:focus-visible`, and `.active` states for cards, nodes, steps, pills, etc. 1.9s infinite.

**Concern:** This animation has 6 box-shadow layers at 50% keyframe. Box-shadow is not GPU-composited — it triggers paint on every frame. On a card with this animation + the `::before` radial gradient glow + the `::after` border sweep, a single hovered element runs 3 concurrent animations with paint-triggering properties.

**3. `ambientInteractiveGlow` (lines 162-177)**
4-layer box-shadow pulsation. Applied as the **resting state** animation on feature cards, slider rows, eco nodes, proof cards, funnel cards, loop nodes, and chain steps (line 1118). 4.8s infinite.

**Critical concern:** This animation runs constantly on 20+ elements simultaneously. Even when elements are off-screen, the CSS animation continues to trigger paint cycles. This is the single largest performance drag on the page.

**4. `borderSweep` (lines 179-182)**
Background-position animation on `::after` pseudo-elements. Applied on `:hover`/`:active` states. 2.8s infinite linear.

### Performance Impact of CSS Animations

The combined effect:
- ~20 elements running `ambientInteractiveGlow` at all times (constant paint)
- On hover, those elements switch to `interactiveBorderPulse` (heavier paint) + `borderSweep` (background-position animation on pseudo-element)
- The `::before` glow pseudo-element transitions opacity and transform simultaneously

**Recommendation:** Reserve continuous animations for the 2-3 most important interactive elements (planner demo, primary CTA). Use CSS `animation-play-state: paused` or IntersectionObserver to pause animations on off-screen elements. Consider replacing box-shadow animations with `filter: drop-shadow()` which can be GPU-composited.

### `prefers-reduced-motion` Implementation (lines 2159-2167)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }
  .journey-rail { transition: none !important; }
}
```

**Good.** Comprehensive blanket override. The JS also checks `prefersReduced` (line 2850) and skips GSAP animations accordingly. This is above-average accessibility implementation.

**Gap:** The check is `const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` — set once at IIFE execution. If the user changes their motion preference while the page is open, the JS won't react. Minor issue, but a `matchMedia` listener would be more robust.

---

## 3. Interactive Component Audit

### Planner Demo (lines 2381-2455)
**Grade: A-**

This is the best component on the page.

**What works:**
- 6 range inputs with real-time score calculation
- Shift-mode toggle (day/night/rotating) changes weight distribution — genuinely useful, not cosmetic
- Coaching panel updates headline + copy based on weakest variable — contextual feedback
- Quick presets (Sharp/Fatigued/Dad Mode) provide instant demo scenarios
- Persona-aware scoring adjustments (grappler boosts training weight, parent boosts family)
- SVG ring animation reflects score visually
- Hero dashboard mirrors planner state (score, metrics, bars) — nice touch

**What could improve:**
- No micro-interaction on slider movement. The slider thumb moves, the value changes, and the ring animates — but there's no visual feedback on the slider row itself. A subtle scale or border pulse on the active slider row would add tactile feel.
- Score number changes are instant (textContent swap). A number-morphing animation (GSAP snap tween on the score display) would add polish.
- Coach panel content swaps are instant. A brief fade-out/fade-in (150ms) would make the transition feel deliberate rather than jumpy.
- The "Quick presets" buttons could animate the sliders to their new values rather than instant-setting them, creating a satisfying "watch everything move" moment.

### Ecosystem Map (lines 2556-2610)
**Grade: B+**

**What works:**
- SVG connection lines between hub and nodes
- Node positioning with absolute coordinates
- Path filtering dims irrelevant nodes
- Detail panel updates on node click/hover/focus
- Brand-specific colour variations on the detail panel

**What could improve:**
- Lines are simple `<line>` elements (straight). Bezier curves would feel more organic and premium.
- Node activation has no transition on the detail panel content. The copy swaps instantly — a cross-fade would help.
- The SVG line drawing could use a dasharray animation (draw-on effect) when a node is activated.
- On mobile (< 960px), the map collapses to a stacked list with no SVG connections. This loses the "connected system" visual. Even a simple vertical flow line would maintain the ecosystem metaphor.

### Blueprint Loop (lines 2622-2656)
**Grade: B**

**What works:**
- Circular node positioning via polar coordinates — genuinely interesting layout
- SVG track circle with progress stroke animation
- Autoplay with interval-based progression
- Panel updates with badges and context

**What could improve:**
- Node activation has no transition animation. Active/completed class toggles are instant.
- The autoplay interval (2.2s) is too fast for reading the panel content. 3-4s would be more comfortable.
- No transition on the progress ring between steps — it just jumps. A brief GSAP tween would show progression.
- The circular layout is purely decorative on mobile (nodes stack vertically, SVG hidden). An animated vertical progress bar could maintain the "loop" concept.

### Chain Explorer (lines 2668-2709)
**Grade: B-**

**What works:**
- SVG bezier curve connections between nodes (nicely implemented with cubic Bezier calculation at lines 3509-3527)
- Active chain path highlighting
- Panel updates with tags and teaching context

**What could improve:**
- Node positions are hardcoded as CSS percentages (`left: 6%; top: 12%` etc.). This means the visual layout is static regardless of viewport proportions.
- No animation on chain path traversal. When a step is clicked, it highlights instantly. A sequential draw-on animation along the path would reinforce the "chain" metaphor.
- The bezier curve generation (`updateChainPaths`) is called on every resize. It reads `.getBoundingClientRect()` in a loop — this forces layout recalculation. Should be debounced.

### Mastery Tabs (lines 2720-2742)
**Grade: C+**

**What works:**
- Tab switching updates content, badges, and visual metrics
- Per-tab colour theming (teal, gold, coral, violet)
- `data-tab` attribute on `#mastery` section updates panel styling

**What could improve:**
- Content swap is completely instant. No transition, no fade, no slide. This is the most abrupt state change on the page.
- The mastery metrics grid uses `innerHTML` replacement (line 3557-3563) — this destroys and recreates DOM nodes on every tab switch. A pre-rendered approach (show/hide panels) would be smoother and more performant.
- Tab buttons have no indicator animation. A sliding underline or expanding background fill would give feedback during the transition.

### FAQ Accordion (lines 2753-2776)
**Grade: C**

Uses native `<details>/<summary>` elements.

**What works:**
- Semantic HTML — accessible without JS
- The `+` icon rotates on open (CSS transform, line 2156)

**What could improve:**
- No height animation on open/close. The content appears/disappears instantly, which feels jarring compared to the smooth animations elsewhere on the page.
- Heavy inline styles throughout — 20+ style attributes that should be CSS classes.
- No staggered reveal — all FAQs animate in with the same generic `.reveal` pattern.

### Persona Selector (lines 2274-2282)
**Grade: B**

**What works:**
- Clean 4-button layout with clear labels
- SessionStorage persistence
- Body data-attribute changes that affect `::after` content throughout the page
- Ecosystem path filter automatically adjusts

**What could improve:**
- Button activation is instant (class toggle). A brief scale+border animation would make the selection feel deliberate.
- The persona's effect on the page is subtle. Outside the planner subtitle and ecosystem filter, the visual impact is minimal. This could be more dramatic — perhaps a brief colour wash or section-specific copy swap.

---

## 4. Scroll Behaviour & Navigation

### Journey Rail (lines 2238-2246, CSS lines 403-429)
- Fixed vertical navigation on left side (desktop) / bottom bar (mobile)
- Appears after 45% scroll via opacity toggle
- Active state tracks current section via ScrollTrigger

**Works well.** The vertical writing-mode on desktop is distinctive. Mobile bottom bar is functional.

**Improvement:** Currently uses a hard opacity toggle (visible/not visible). A smooth opacity transition would be cleaner. The labels ("Hero", "Planner", "Value", "Why", "System", "FAQ", "Join") could be more descriptive — "Value" and "Why" are vague.

### Scroll-to Behaviour (lines 3129-3145)
Supports Lenis (if present), GSAP ScrollToPlugin, and native `scrollTo` as fallbacks. Smart implementation that handles multiple scroll libraries gracefully.

### Resize Handling (lines 3756-3762)
```javascript
window.addEventListener('resize', () => {
  positionLoopNodes();
  updateChainPaths();
  updateEcoLines(...);
  updateActiveNav();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
});
```

**Problem:** No debouncing. Each resize event fires all 5 functions, including `positionLoopNodes` and `updateChainPaths` which both read `.getBoundingClientRect()` (forced reflow). During a window resize drag, this fires 30-60 times per second.

**Fix:** Debounce with `requestAnimationFrame` or a 100ms timeout.

---

## 5. State Management

### Current approach
- `activePersona` — string, sessionStorage-persisted
- `activeShift` — string, component-local
- `loopIndex` — number, component-local
- `loopTimer` — interval ID, component-local
- No state management library — all plain JS

**Verdict:** Appropriate for this scale. The IIFE pattern (lines 2849-3788) keeps everything in closure scope, avoiding globals. SessionStorage persona persistence is a good touch.

**Gap:** No state serialisation for URL sharing. A visitor who configures "Parent + Night Shift + specific slider values" cannot share that state with anyone. URL parameters or hash state would add shareability.

---

## 6. Motion Design Consistency

### Reveal pattern
All `.reveal` elements use the same animation: `opacity: 0 → 1, translateY: 22px → 0, duration: 0.65s, ease: power3.out, trigger: top 84%`.

**Problem:** This is one-size-fits-all. Every section, card, heading, and panel reveals identically. Premium sites vary their reveal patterns: hero elements stagger, section heads slide in, cards cascade from different directions, proof elements scale up. Uniform reveals feel mechanical.

### Timing
- Hero timeline: well-choreographed (cascading overlaps)
- Everything else: no choreography. Elements reveal independently whenever they enter the viewport. Two cards side by side may reveal at different times depending on their exact Y position.

### Easing
- GSAP: `power3.out` for reveals, `power2.out` for ring/progress animations
- CSS: `cubic-bezier(0.16, 1, 0.3, 1)` for transitions (defined as `--ease`)
- These are different curves used in overlapping contexts. The visual effect is consistent enough, but formally they should align.

### Exit animations
None. Elements only animate in. When scrolling back up, revealed elements stay in their final state. This is acceptable but means the page has no scroll-based "breathing" — it's a one-way animation experience.

---

## 7. Performance Risk Assessment

| Risk | Severity | Location |
|------|----------|----------|
| `ambientInteractiveGlow` running on 20+ elements continuously | **High** | CSS line 1118 |
| Individual ScrollTrigger per `.reveal` element (40-60 instances) | **Medium** | JS line 3597 |
| Resize handler without debounce (forced reflows) | **Medium** | JS line 3756 |
| `innerHTML` replacement on tab switch (Mastery) | **Low** | JS line 3557 |
| `innerHTML` replacement for eco-meta chips | **Low** | JS line 3254 |
| Bezier path recalculation on every resize | **Low** | JS line 3489 |
| 3,791 lines of inline CSS+JS (no caching) | **Low** | Structural |

### Estimated impact
On a modern desktop: imperceptible. On a mid-range mobile device (2-3 year old Android): the continuous CSS animations + ScrollTrigger overhead could cause noticeable jank during fast scrolling, especially through the ecosystem/blueprint/chains sections where interactive elements are densely packed.

---

## 8. Summary Table

| Component | Quality | Polish | Performance | Priority |
|-----------|---------|--------|-------------|----------|
| Hero timeline | A | A | Good | Maintain |
| Planner demo | A- | B+ | Good | Enhance |
| Ecosystem map | B+ | B | Moderate | Refine |
| Blueprint loop | B | B- | Good | Polish |
| Chain explorer | B- | C+ | Moderate | Polish |
| Mastery tabs | C+ | C | Good | Rebuild transitions |
| FAQ accordion | C | C | Good | Add height animation |
| Scroll reveals | B- | C | Poor (batch needed) | Optimise |
| CSS glow animations | B | B | Poor (continuous paint) | Throttle/scope |
| Resize handling | C | — | Poor (no debounce) | Fix |
