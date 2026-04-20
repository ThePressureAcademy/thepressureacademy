> [!WARNING]
> ARCHIVED - NOT CANONICAL.
> This audit predates the current `api/` auth/session implementation and no longer matches repo reality.
> Use [../../../CLAUDE.md](../../../CLAUDE.md), [../../REPO_GOVERNANCE_AND_ENDPOINTS.md](../../REPO_GOVERNANCE_AND_ENDPOINTS.md), and [../../DOC_AUTHORITY_INDEX.md](../../DOC_AUTHORITY_INDEX.md).

# Architecture Audit — The Pressure Academy

**Date:** 19 March 2026
**Auditor:** Claude (automated session)

## Current State

### Stack
- **Type:** Static site (no build system, no framework)
- **Hosting:** Vercel (via `vercel.json`)
- **Frontend:** Single `index.html` (~3,777 lines) with all CSS and JS inline
- **Forms:** Formspree (`https://formspree.io/f/meerjgde`) — 4 capture forms
- **Fonts:** DM Sans + JetBrains Mono (Google Fonts)
- **Animation:** GSAP 3.12.7 (ScrollTrigger, ScrollToPlugin) via CDN
- **Assets:** SVG logos, OG image (PNG)
- **Pages:** `index.html`, `privacy-policy.html`
- **SEO:** robots.txt, sitemap.xml, structured data (JSON-LD)
- **Backend/Database:** None
- **Auth:** None
- **Payments:** None
- **CI/CD:** None (direct Vercel deploy from repo)

### What Exists and Works
1. Fully designed, interactive homepage with 8 sections
2. Persona selector (Shift Worker, Grappler, Parent, Learning Support)
3. Interactive Planner demo (6 sliders, score calculation, shift-mode logic)
4. Blueprint positional loop explorer
5. IF→THEN chain explorer (BJJ technique chains)
6. Mastery Method pillar tabs
7. Social proof section with 3 testimonials
8. 4 email capture forms (Formspree) with intent tracking
9. Privacy policy page
10. All brand SVG assets (TPA House, Planner, Blueprint, Mastery, Pressure Tested, Pressure Over Force)
11. Mobile-responsive design with hamburger menu
12. Accessibility basics (skip link, aria labels, reduced motion support)
13. Structured data (Organization, WebSite, Product)

### What Is Misaligned
1. **Homepage positions the Planner as one of six ecosystem nodes** — it should be the primary product with its own hero-level CTA
2. **Title and meta description** say "Interactive System for Shift Workers, Grapplers & Parents" — should lead with the digital product
3. **Hero eyebrow** says "Now live — The Pressure Planner" but the main headline and CTA treat the ecosystem as the product
4. **Navigation** gives equal weight to Ecosystem, Planner, Blueprint, Chains, Mastery, Proof, Join — the Planner should be elevated
5. **Ecosystem section** dominates the page before users see the product — this is backwards for conversion
6. **No dedicated product landing section** above the fold with clear value proposition, pricing/waitlist, and social proof
7. **No urgency or scarcity** in the launch positioning (limited access, founding member, etc.)
8. **Testimonials appear fabricated** (common first names with initials) — need to be clearly marked as illustrative or removed

### What Is Missing
1. Product-focused hero section (what it is, who it's for, what you get, CTA)
2. Product launch/sales page or above-the-fold product positioning
3. Clear pricing or "coming soon" pricing section
4. Email sequence / launch funnel documentation
5. Analytics (no tracking script visible — Vercel Analytics may be separate)
6. Any CI/CD or validation pipeline
7. `.env.example` or environment documentation
8. Contributing guidelines
9. CLAUDE.md for agent alignment
10. Deployment automation beyond Vercel defaults
11. Any test infrastructure

## Target State (Near Term)

1. Homepage leads with the digital product (Pressure Planner) as the primary conversion target
2. Clear above-the-fold value proposition → CTA → email capture
3. Ecosystem context supports product credibility (not the other way around)
4. Product launch page ready for traffic from ads, social, or email
5. Clean documentation for continued development
6. Formspree forms segmented by intent with clear tracking

## Major Risks

1. **No analytics** — cannot measure conversion or traffic
2. **All code in one file** — maintainability risk as site grows
3. **Fabricated-looking testimonials** — trust risk if real customers see through them
4. **No staging/preview** — Vercel likely auto-deploys main/master, risky for breaking changes
5. **Formspree free tier limits** — unknown form submission volume capacity

## Recommended Build Order

1. Restructure homepage to lead with product launch
2. Add CLAUDE.md and repo documentation
3. Improve meta tags and SEO for product launch
4. Add analytics placeholder
5. Improve deployment safety (branch protection, preview deploys)
6. Add product-specific structured data
7. Separate CSS/JS from HTML (future session)
