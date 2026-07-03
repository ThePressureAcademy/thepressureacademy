/**
 * The Pressure Academy — funnel configuration (seminars, blueprints, campaigns).
 *
 * TRUTH RULES:
 * - No invented events, athletes, dates, venues, prices, seat counts, or proof.
 * - Seminar `status` lifecycle (drives exactly what the funnel page may render):
 *     "draft"     → never rendered publicly; slug page shows not-open state
 *     "interest"  → page renders in interest-capture mode; explicit "no payment
 *                   is taken on this page yet" copy; no buy button, ever
 *     "announced" → full event page; registration (lead capture) live;
 *                   payment step honestly gated
 *     "open"      → live checkout, ONLY if checkoutUrl is a real provider URL;
 *                   with no checkoutUrl the page behaves like "announced"
 *     "sold_out"  → waitlist capture
 *     "closed"    → archival closed message; hidden from the event board
 * - Numerical scarcity renders ONLY when BOTH `capacity` and `spotsRemaining`
 *   are real numbers maintained by the operator. Either missing = no numbers.
 * - Any absent field degrades honestly (see seminars/_event/index.html).
 * - Launch procedure: docs/PRESSURE_ACADEMY_FIRST_SEMINAR_LAUNCH_GUIDE.md.
 */

export const seminars = [
  {
    // ── SAMPLE / PLACEHOLDER ENTRY ──────────────────────────────────────────
    // This is NOT a real event. It exists so the funnel flow is verifiable and
    // so the first real seminar is launched by filling in these fields, not by
    // writing new code. Nothing here invents an athlete, date, venue, price,
    // or seat count, and status "interest" cannot render a buy button.
    slug: "founding-pressure-seminar",
    status: "interest",
    title: "Founding Pressure Seminar",
    headline: "The first Pressure Academy live training event.",
    subheadline:
      "Register interest for the founding seminar. Date, venue, coach, and pricing are confirmed to the interest list first.",
    athleteName: null, // real, agreed names only — never invented
    athleteRole: null, // e.g. "Head coach" / competition credential
    dateLabel: null, // e.g. "Saturday 12 September 2026" — real dates only
    timeLabel: null, // e.g. "9:00am — 1:00pm"
    venueLabel: null, // e.g. "The Pressure Academy HQ" — real venues only
    city: null,
    country: null,
    capacity: null, // real cap from venue logistics, or null
    spotsRemaining: null, // operator-maintained live count, or null
    priceLabel: null, // e.g. "$249 AUD" — MUST match the Stripe Payment Link amount
    currency: "AUD",
    checkoutProvider: "stripe_payment_link", // intended provider; inert until checkoutUrl exists
    checkoutUrl: null, // real Stripe Payment Link (https://buy.stripe.com/…) only
    leadCaptureIntent: "seminar-interest", // hidden `intent` on this event's capture form
    source: "seminar-founding-pressure-seminar", // hidden `source` on this event's capture form
    heroImage: null, // rights-cleared imagery only
    videoUrl: null,
    proofItems: [], // real quotes/results only — empty renders no proof section
    includedItems: [
      "A connected positional system taught start to finish — not a technique playlist",
      "Live coaching rounds with corrections, capped so everyone gets mat time",
      "The written positional map of the material to take home",
    ],
    whoItIsFor: [
      "Grapplers who want a system that survives hard rounds",
      "Competitors preparing for pressure, not highlight reels",
      "Coaches and academy owners auditing how we structure material",
    ],
    refundPolicyLabel: null, // set the real policy before status "open"
    requirements: [], // gear / experience requirements, only if real
    orderBump: null, // orderBumps[].id reference once a real bump exists
    upsell: "upsell-blueprint-after-seminar", // upsells[].id reference (placeholder, renders label only)
    seoTitle: "Founding Pressure Seminar | The Pressure Academy",
    seoDescription:
      "Register interest for the first Pressure Academy live training seminar. Date, venue, and pricing to be confirmed. No payment is taken on this page.",
  },
];

export const blueprints = [
  {
    slug: "pressure-blueprint-core",
    status: "in-development", // renders waitlist funnel, not a buy page
    title: "The Pressure Blueprint — Core System",
    line: "pressure-blueprint",
    promise:
      "The positional grappling system behind the Pressure house, taught as architecture: position, pressure, decision — in that order.",
    format: "Digital system: video modules + written positional maps",
    priceCents: null,
    priceNote: "Pricing locks at release",
    checkoutUrl: null,
    modulesPreview: [
      "Positional hierarchy — where pressure actually comes from",
      "Weight before technique — making control cheap to hold",
      "Decision trees under load — what to do when they defend right",
    ],
    upsellIds: [],
  },
];

export const campaigns = [
  // { slug, status, title, heroCopy, ctaLabel, ctaHref, capture: {intent, source} }
];

/**
 * Order bumps / upsells — placeholder shapes. Nothing renders as purchasable
 * while the parent product/funnel has no live checkout.
 */
export const orderBumps = [
  {
    id: "bump-pt-tee-with-blueprint",
    status: "placeholder",
    label: "Add the Pressure Tested Heavyweight Tee at checkout",
    productId: "pt-heavy-tee",
    priceCents: null,
  },
];

export const upsells = [
  {
    id: "upsell-blueprint-after-seminar",
    status: "placeholder",
    label: "Keep the system after the seminar — The Pressure Blueprint",
    blueprintSlug: "pressure-blueprint-core",
    priceCents: null,
  },
];

export function getSeminar(slug) {
  return seminars.find((s) => s.slug === slug) || null;
}

export function getBlueprint(slug) {
  return blueprints.find((b) => b.slug === slug) || null;
}

export function getCampaign(slug) {
  return campaigns.find((c) => c.slug === slug) || null;
}

export function publicSeminars() {
  // "closed" is archival and "draft" is private — neither belongs on the board.
  return seminars.filter((s) =>
    ["interest", "announced", "open", "sold_out"].includes(s.status),
  );
}

export function publicBlueprints() {
  return blueprints.filter((b) => ["in-development", "announced", "on-sale"].includes(b.status));
}
