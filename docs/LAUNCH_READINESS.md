> [!WARNING]
> SUPERSEDED - NOT CANONICAL.
> This file assumes a pre-launch Pressure Planner state and outdated endpoint usage that no longer match the repo.
> Use [../CLAUDE.md](../CLAUDE.md), [REPO_GOVERNANCE_AND_ENDPOINTS.md](./REPO_GOVERNANCE_AND_ENDPOINTS.md), and [DOC_AUTHORITY_INDEX.md](./DOC_AUTHORITY_INDEX.md).

# Launch Readiness — Pressure Planner

**Date:** 19 March 2026
**Status:** Pre-launch — early access capture active

## What Is Ready

1. Homepage restructured with product-first positioning
2. Interactive Planner demo fully functional (6 variables, shift-mode logic, scoring)
3. Early access email capture via Formspree (segmented by intent)
4. Product value section explaining what buyers get
5. FAQ section addressing common questions
6. Social proof section (illustrative — needs real testimonials)
7. Privacy policy aligned with current capabilities
8. SEO basics: meta tags, OG image, structured data, sitemap, robots.txt
9. Mobile-responsive design
10. Vercel deployment configured

## What Is NOT Ready (Blockers)

### Content Production (Non-Development)
- [ ] Record remaining answers for the digital product (~30% remaining)
- [ ] Final editing and packaging of recorded content
- [ ] Confirm product format (PDF, video, app access, or bundled)

### Payment & Delivery (Requires Human Decisions)
- [ ] Choose payment provider (Stripe recommended)
- [ ] Set pricing (founding member vs. standard)
- [ ] Set up payment integration
- [ ] Build delivery mechanism (download link, gated access, email delivery)
- [ ] Update CTA from "Get Early Access" to "Buy Now" when ready

### Trust & Authority
- [ ] Replace illustrative testimonials with real customer/beta feedback
- [ ] Add real founder photo/bio if desired
- [ ] Consider adding a guarantee or refund policy

### Analytics
- [ ] Add analytics tracking (Vercel Analytics, Plausible, or similar)
- [ ] Set up conversion event tracking on form submissions
- [ ] Monitor Formspree submission volume vs. free tier limits

### Legal
- [ ] Review terms of sale for digital product
- [ ] Confirm privacy policy covers payment data handling
- [ ] Add terms of service page if selling directly

## Launch Sequence (Recommended)

### Phase A: Pre-launch (NOW)
1. Early access email capture is active
2. Drive traffic to homepage from social, email, or ads
3. Monitor form submissions in Formspree dashboard

### Phase B: Soft Launch
1. Complete content recording and packaging
2. Set up Stripe with founding member pricing
3. Email early access list with launch details
4. Update homepage CTA from "Get Early Access" to "Buy Now — Founding Price"
5. Add Stripe checkout link or embed

### Phase C: Full Launch
1. Switch to standard pricing
2. Add real testimonials from founding buyers
3. Consider paid acquisition (ads)
4. Add analytics for conversion optimisation

## Formspree Dashboard

- All form submissions go to: `https://formspree.io/f/meerjgde`
- Check the Formspree dashboard to see submissions segmented by `intent` field
- Intents: `planner-access`, `blueprint-info`, `mastery-enquiry`, `academy-updates`
- Export emails from Formspree for email marketing when ready
