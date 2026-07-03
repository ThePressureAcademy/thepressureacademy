# Pressure Academy Conversion Audit

Status: `ACTIVE — LOOP 7 POST-IMPLEMENTATION AUDIT`
Date: 3 July 2026
Scope: buying-psychology audit of the implemented commercial architecture (homepage + shop + funnels), scored 1–10. Anything below 8 is fixed or has its blocker named. Scores reflect what a real buyer experiences today, not what the architecture could do once credentials exist — that is why credential-gated dimensions score low even where the build is complete.

| # | Dimension | Score | Verdict |
| --- | --- | --- | --- |
| 1 | 1-second clarity | 9 | Hero states the brand and all four commercial lanes in one screen; primary CTA "Shop Pressure Tested". No welcome copy. |
| 2 | Visual authority | 7 | Coherent dark cinematic system, locked marks, hard-edged commerce components. **Blocker: zero real photography.** Product cards render honest mark-based fallbacks. Cannot be fixed in code — needs a product/athlete shoot. |
| 3 | Product path clarity | 9 | Four lanes on homepage (split tiles + straight-path cards + nav + footer), each with distinct buying psychology. Verified: no dead CTAs (link sweep, all 200). |
| 4 | Apparel impulse conversion | 6 | Full retail architecture exists (cards, size confidence, slide-out cart, drop-list capture). **Blocker: nothing is purchasable** — no Shopify store, no live product, no locked pricing. Until the first drop is real, the honest ceiling is drop-list capture, which is implemented. |
| 5 | Mat risk mitigation | 9 | Floor calculator (real math, stated margins), palletised-freight honesty before any payment, quote-approval flow, financing placeholder stated as in-development, B2B handoff to `/academy-orders/`. |
| 6 | Seminar scarcity | 7 | Scarcity architecture is config-gated and honest (seat caps and close dates render only from real event logistics; capped-room policy stated). **Blocker: no live event exists.** Fake urgency was deliberately not built — scarcity activates with the first real event entry in `funnels.js`. |
| 7 | Blueprint transformation clarity | 8 | Specific promise (position → pressure → decision), module preview, "stop collecting techniques" framing, waitlist funnel with locked step 2. |
| 8 | Checkout friction | 3 | **The biggest gap, by design honesty: there is no checkout.** `checkout.provider = "none"`; every payment surface renders a truthful gated state. Blocker: operator decision on provider (Shopify vs Stripe Payment Links vs SamCart) + credentials. The architecture accepts any of the three without page rewrites. |
| 9 | Trust / proof | 6 | Authority strip renders only verifiable brand facts; proof registry (`proof.js`) is empty and fail-honest. **Blocker: proof must be earned/collected** (testimonials with consent, athlete agreements, media). Flipping `enabled: true` on real entries lights the components. |
| 10 | Mobile conversion | 9 | Verified at 375px: single-column collapse, no horizontal scroll, full-width CTAs ≥44px, drawer full-width, hamburger nav. Tablet 768px verified. |
| 11 | Global buyer readiness | 5 | Config layer carries currencies/regions/zones/hubs with honest `planned` status; display currency AUD. **Blocker: no international carrier, FX, or tax posture exists** — activating any of it before a provider would be a false claim. |
| 12 | Cart recovery readiness | 7 | All eight canonical events fire locally at the right moments (verified in QA); Klaviyo adapter boundary ready; abandonment heuristics live. **Blocker: no Klaviyo account/keys — nothing is recoverable until flows exist.** |

## Fix-or-blocker record (scores < 8)

- **#2 Visual authority → operator asset task:** commission product photography (apparel flats/on-body, mat detail, training-room environment). The card system takes `image` URLs today.
- **#4 Apparel → operator commercial task:** finalise first drop + pricing; connect Shopify (or interim Stripe Payment Links); flip catalogue entries to `status: "live"` with `priceCents`.
- **#6 Seminar scarcity → operator commercial task:** lock one real event (athlete, date, venue, price, cap) and enter it in `funnels.js` with `status: "announced"` → funnel page and scarcity blocks activate.
- **#8 Checkout → operator decision:** pick the provider. Fastest first dollar: Stripe Payment Link on a seminar (no store build needed). Fastest durable retail: Shopify.
- **#9 Proof → operator collection task:** gather real testimonials/consent; add to `proof.js`.
- **#11 Global → sequenced after checkout:** do not activate until carrier + tax advice exist.
- **#12 Recovery → Klaviyo account + keys**, then `connectKlaviyo()` is already the registered-sender seam.

None of these can be closed honestly from inside the repo. Every one is named in the operator's launch path (see architecture doc §Minimum viable commercial launch path).
