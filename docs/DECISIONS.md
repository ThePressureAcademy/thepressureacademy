# Decision Record — The Pressure Academy

Decisions made during development, with rationale. Newest first.

---

## D-005: Restructure homepage to lead with digital product (2026-03-19)

**Decision:** Reorder homepage sections to position Pressure Planner as the primary above-the-fold product, with ecosystem content supporting rather than leading.

**Why:** The digital product is ~70% complete and is the target first transaction. The current homepage treats the Planner as one of six ecosystem nodes, diluting conversion focus. Every visitor should immediately understand what the product is and how to get it.

**What changes:**
- Hero section rewritten with product-first headline and CTA
- Navigation simplified to prioritise product flow
- Ecosystem section moved below product demonstration
- New "What You Get" section added above the demo
- Join/CTA section emphasises product access first

**Risk:** Existing returning visitors may notice layout change. Low risk — site is pre-launch with minimal traffic.

---

## D-004: Add CLAUDE.md and documentation structure (2026-03-19)

**Decision:** Create CLAUDE.md, improve README, add deployment/environment docs.

**Why:** Repo had minimal documentation. Agent sessions and human developers need clear boundaries, standards, and context to make aligned changes.

---

## D-003: Keep static HTML architecture (2026-03-19)

**Decision:** Do not introduce a build system, framework, or backend in this session.

**Why:** The current static site works, deploys cleanly on Vercel, and the immediate priority is product launch — not architecture migration. Introducing Next.js, Astro, or similar would delay launch without improving conversion. Revisit after first revenue.

**Trade-off:** The 3,700-line single HTML file is increasingly hard to maintain. CSS/JS extraction should happen in a near-future session.

---

## D-002: Use Formspree for all lead capture (pre-existing)

**Decision:** Continue using Formspree for email capture forms.

**Why:** Already configured and working. Free tier adequate for pre-launch volume. Intent field differentiates form submissions.

---

## D-001: Vercel for hosting and deployment (pre-existing)

**Decision:** Continue using Vercel for static hosting.

**Why:** Already configured. Zero-config deploys. Preview deploys available for PRs. Custom domain likely already connected.
