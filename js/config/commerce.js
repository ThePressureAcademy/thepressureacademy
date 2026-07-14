/**
 * The Pressure Academy — commerce configuration.
 *
 * Single source of truth for product lines, catalogue entries, and checkout
 * provider posture. Pages render FROM this file; edit here, not in page markup.
 *
 * TRUTH RULES (do not violate):
 * - `status: "placeholder"` = product line is real, this catalogue entry is a
 *   production-stage stand-in. UI must render release-list capture, never a
 *   purchasable price.
 * - `priceCents: null` = pricing not locked. UI must not display an invented number.
 * - checkout.provider = "none" until a real provider is connected. While "none",
 *   every checkout CTA renders an honest gated state.
 *
 * Going live with Shopify: set provider to "shopify", configure env in
 * .env.example (SHOPIFY_*), and replace placeholder entries with synced data
 * via js/lib/shopify-client.js.
 */

export const checkout = Object.freeze({
  provider: "none", // "none" | "shopify" | "stripe" | "samcart"
  expressCheckout: false, // Shop Pay / Apple Pay / Google Pay — requires live provider
  cartStorageKey: "tpa.cart.v1",
  displayCurrency: "AUD",
});

export const brandLines = Object.freeze({
  pressureTested: {
    id: "pressure-tested",
    name: "Pressure Tested",
    mark: "/assets/logos/Pressure_Tested_Mark.svg",
    positioning: "Apparel and proof-of-work signal. Worn under load, not for the feed.",
  },
  mats: {
    id: "tpa-mats",
    name: "Pressure Academy Mats",
    mark: "/assets/logos/TPA_House_Mark.svg",
    positioning: "Training-floor infrastructure for garages, home rooms, and academies.",
  },
  blueprint: {
    id: "pressure-blueprint",
    name: "The Pressure Blueprint",
    mark: "/assets/logos/Pressure_Blueprint_Mark.svg",
    positioning: "Grappling and positional systems, taught as architecture.",
  },
});

/**
 * Apparel — impulse retail line.
 * SUPERSEDED for the apparel page by the Drop 01 manifest in
 * js/config/drops.js (the page renders from the drop, not this array).
 * Entries below remain as pre-drop line-item references only; the cap moved
 * to `futureConcepts` in drops.js when it left Drop 01. Same truth rules:
 * no locked pricing, no stock, capture only.
 */
export const apparel = [
  {
    id: "pt-heavy-tee",
    line: "pressure-tested",
    name: "Pressure Tested Heavyweight Tee",
    status: "placeholder",
    priceCents: null,
    priceNote: "Pricing locks at first drop",
    blurb: "Heavyweight cotton (240gsm+ target). Cut for training shoulders, built to survive the wash cycle.",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    variants: ["Blackout", "Bone"],
    image: null, // no product photography yet — card renders spec frame
  },
  {
    id: "pt-hoodie",
    line: "pressure-tested",
    name: "Built Under Pressure Hoodie",
    status: "placeholder",
    priceCents: null,
    priceNote: "Pricing locks at first drop",
    blurb: "Heavy fleece, minimal print, no billboard energy. The corner-of-the-gym hoodie.",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    variants: ["Blackout"],
    image: null,
  },
  {
    id: "pt-rash-guard",
    line: "pressure-tested",
    name: "Competition Rash Guard",
    status: "placeholder",
    priceCents: null,
    priceNote: "Pricing locks at first drop",
    blurb: "Flatlock seams, full-length cut, ranked and unranked options planned.",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    variants: ["Blackout", "Rust"],
    image: null,
  },
];

/**
 * Mats — high-consideration physical goods.
 * REFERENCE SPECS ONLY: dimensions and densities below are standard industry
 * reference values used for the size-matching calculator. Final supplier
 * specification, pricing, and freight are not locked. UI must say so.
 */
export const mats = [
  {
    id: "mat-jigsaw-40",
    name: "Academy Jigsaw Mat — 40mm",
    status: "placeholder",
    priceCents: null,
    priceNote: "Pricing and supplier spec to be confirmed",
    blurb: "1m x 1m interlocking EVA, 40mm competition-standard thickness. Reference spec for takedown-inclusive training.",
    coverageM2: 1,
    thicknessMm: 40,
    approxWeightKg: 6.5, // reference value for freight expectation messaging only
    audience: ["home", "academy"],
  },
  {
    id: "mat-jigsaw-30",
    name: "Home Room Jigsaw Mat — 30mm",
    status: "placeholder",
    priceCents: null,
    priceNote: "Pricing and supplier spec to be confirmed",
    blurb: "1m x 1m interlocking EVA, 30mm. Reference spec for drilling, technique, and garage rooms.",
    coverageM2: 1,
    thicknessMm: 30,
    approxWeightKg: 5,
    audience: ["home"],
  },
  {
    id: "mat-roll-smooth",
    name: "Roll-Out Mat System",
    status: "placeholder",
    priceCents: null,
    priceNote: "Quoted per floor plan",
    blurb: "Continuous roll-out surface for full academy floors. Spec'd per venue with subfloor and wall-padding guidance.",
    coverageM2: null,
    thicknessMm: 40,
    approxWeightKg: null,
    audience: ["academy"],
  },
];

/**
 * Size-matching guidance used by the mat calculator (pure math + safety
 * margins, no supplier claims).
 */
export const matGuidance = Object.freeze({
  minTrainingAreaPerPersonM2: 3, // live grappling planning figure per pair-half
  wallClearanceM: 0.5,
  presets: [
    { id: "garage-single", label: "Garage / single car bay", widthM: 3, lengthM: 5 },
    { id: "home-room", label: "Spare room", widthM: 3.5, lengthM: 4 },
    { id: "small-academy", label: "Small academy floor", widthM: 8, lengthM: 12 },
    { id: "full-academy", label: "Full academy floor", widthM: 12, lengthM: 20 },
  ],
});
