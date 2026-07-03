# First Seminar Launch Guide

Status: `ACTIVE — OPERATOR RUNBOOK`
Date: 3 July 2026
Audience: Cody. This is the exact procedure to take the first paid seminar live. Every step is a config edit or an account action — no code changes.

The one-line version: **fill in the event entry in `js/config/funnels.js`, paste a real Stripe Payment Link into `checkoutUrl`, change `status` to `"open"`, test, deploy.**

## 1. Real-world details you need locked BEFORE anything goes live

- Coach/athlete (name + how to describe them, with their agreement)
- Date and time
- Venue (name, city, country) — booked, not intended
- Capacity (the real number the room takes)
- Price (one number, incl. GST posture you intend)
- Refund/transfer policy (one sentence you will honour)
- What the day covers (3 to 6 bullet points)
- Who it is for (2 to 4 bullet points)
- Any requirements (gear, experience) — only if real
- Proof items — only real quotes with permission; the page renders no proof section if you have none. Do not borrow, paraphrase, or invent.

## 2. Stripe side (about 15 minutes)

1. In the Stripe dashboard: Products → add product (e.g. "Founding Pressure Seminar — [City] [Date]"), set the price in AUD.
2. Payment Links → create a link for that product. Recommended settings: collect customer name + email (default), limit the number of payments to the venue capacity (Payment Links supports a sales limit — set it to the cap so Stripe physically cannot oversell the room), and set a confirmation message that states the venue, date, and what happens next.
3. Copy the link. It looks like `https://buy.stripe.com/…`. Test-mode links (`test_` in the URL) are for rehearsal only — never ship one.

## 3. Config side (`js/config/funnels.js`, the entry with slug `founding-pressure-seminar`)

Fields to fill (everything currently `null` was left empty on purpose):

| Field | What to put |
| --- | --- |
| `title`, `headline`, `subheadline` | Real event name and pitch |
| `athleteName`, `athleteRole` | Real, agreed names only |
| `dateLabel`, `timeLabel` | e.g. `"Saturday 12 September 2026"`, `"9:00am — 1:00pm"` |
| `venueLabel`, `city`, `country` | The booked venue |
| `capacity`, `spotsRemaining` | Real numbers. Both or neither — numbers render only when both exist. You maintain `spotsRemaining` by hand (edit + redeploy) or leave both `null` and let Stripe's sales limit do the capping silently |
| `priceLabel` | e.g. `"$249 AUD"` — **must match the Payment Link amount exactly**; the page shows this label, Stripe charges the link amount, and a mismatch is a false price claim |
| `checkoutUrl` | The real `https://buy.stripe.com/…` link |
| `refundPolicyLabel` | The policy sentence. Set it before going open |
| `includedItems`, `whoItIsFor`, `requirements` | Your real bullets |
| `proofItems` | `[{ quote: "…", attribution: "…" }]` — real and permitted only, else leave `[]` |
| `seoTitle`, `seoDescription` | Honest one-liners |

`checkoutProvider` stays `"stripe_payment_link"`. `leadCaptureIntent`/`source` stay as-is unless you want different Formspree tagging (then update the Formspree rule first — see the forms register).

## 4. The status switch

`status` is the safety. What each value does is documented at the top of `funnels.js`. The launch sequence that matches how you actually run an event:

1. `"interest"` — now. Collects interest, takes no payment, says so.
2. `"announced"` — details are public, registration (free) is open, payment honestly gated. Use this to build the release list.
3. `"open"` — **this is the money switch.** The page renders "Secure my spot" only when status is `open` AND `checkoutUrl` is a valid https link. Anything missing and the page silently degrades to registration mode and logs a `seminar_checkout_unavailable` event instead of showing a broken buy button.
4. `"sold_out"` — waitlist capture. 5. `"closed"` — after the event.

You can go straight `interest → open` if the event is ready; `announced` is optional.

## 5. Test before publishing (10 minutes, local or preview deploy)

1. Serve the site locally (any static server; slug URLs also work as `/seminars/_event/?slug=founding-pressure-seminar` without rewrites) or use a Vercel preview deploy.
2. With a **test-mode** Payment Link in config: page shows "Tickets live" pill, price, refund line, and "Secure my spot". Click it — you must land on the Stripe checkout for the right amount. Complete a test payment with card `4242 4242 4242 4242`.
3. Check honesty states: temporarily blank `checkoutUrl` → the buy button must disappear and the free-registration panel must return. Restore it.
4. Swap the test link for the **live** link. Do not complete a live payment unless you intend to refund yourself.
5. Mobile check on your phone: no sideways scroll, button reachable, form usable.

## 6. Formspree side

Per the forms register: make sure rules exist for `seminar-registration` and `seminar-waitlist`, and decide who emails the payment link to registered names (the page promises release in registration order — that promise is yours to keep).

## 7. Deploy

Commit the config change and deploy the repo as usual (Vercel). After deploy, open the live URL `/seminars/founding-pressure-seminar/` on your phone and click through to Stripe once (abandon at the card screen). Config edits propagate on deploy — the modules live under `/js/` specifically so they are never pinned by the immutable asset cache.

## 8. What must never be claimed unless true

No invented athlete, date, venue, price, seat count, testimonial, or countdown. `spotsRemaining` only if you genuinely maintain it. `priceLabel` must equal the Stripe amount. The refund line must be a policy you honour. The system renders nothing you do not assert — the honesty gate is config-shaped, and it only works if the config is true.

## 9. Pre-launch QA checklist

- [ ] Live Payment Link opens and shows the right amount and event name
- [ ] Payment Link sales limit = room capacity
- [ ] `priceLabel` matches the Stripe amount
- [ ] Refund policy set in config AND in the Stripe confirmation message
- [ ] `status: "open"`, page shows "Tickets live" + "Secure my spot"
- [ ] Blank-URL degrade test done and reverted
- [ ] Phone test done on the deployed URL
- [ ] Formspree rules live; payment-release email owner agreed
- [ ] No invented claims anywhere on the page

## 10. Rollback

Any problem: set `status` back to `"announced"` (registration keeps working, payment gate closes) or `"interest"`, redeploy. That is the whole rollback — no Stripe action needed, though you can also deactivate the Payment Link in Stripe for a hard stop (the page will still degrade honestly, but a deactivated link is the belt-and-braces stop for anyone holding the old URL). Refund any charge you cannot honour, immediately, from the Stripe dashboard.
