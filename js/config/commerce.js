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

/** Public apparel pre-order prices in Australian cents. Only photographed cuts have images. */
export const apparel = [
  {
    id: "pt-heavy-tee",
    line: "pressure-tested",
    name: "Pressure Tested Tee",
    status: "preorder-request",
    priceCents: 6900,
    blurb: "Charcoal tee with cream lettering on the chest and a patterned back print.",
    image: "/assets/media/pt-tee-back-cutout-v2.webp",
    frontImage: "/assets/media/pt-tee-front-cutout-v2.webp",
  },
  {
    id: "pt-crop-tee",
    line: "pressure-tested",
    name: "Pressure Tested Crop Tee",
    status: "preorder-request",
    priceCents: 6500,
    blurb: "Cropped tee. Product photo to follow.",
    image: null,
  },
  {
    id: "pt-hoodie",
    line: "pressure-tested",
    name: "Pressure Tested Hoodie",
    status: "preorder-request",
    priceCents: 12900,
    blurb: "Rust hoodie with raised lettering and a tonal design across the back.",
    image: "/assets/media/pt-hoodie-back-cutout-v2.webp",
  },
  {
    id: "pt-crop-hoodie",
    line: "pressure-tested",
    name: "Pressure Tested Crop Hoodie",
    status: "preorder-request",
    priceCents: 10900,
    blurb: "Cropped hoodie. Product photo to follow.",
    image: null,
  },
];

/** Tatami pre-order offer. Freight and availability are confirmed per request. */
export const tatamiMat = Object.freeze({
  id: "tatami-2x1",
  name: "Tatami mat",
  status: "preorder-request",
  currency: "AUD",
  priceCents: 13800,
  lengthM: 2,
  widthM: 1,
  coverageM2: 2,
  minimumQuantity: 10,
  colours: Object.freeze(["Ruby Red", "Matte White", "Jet Black", "Rust Orange", "Night Grey"]),
});

/** Other floor systems remain reference specifications for custom enquiries. */
export const mats = [
  tatamiMat,
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
 * Room presets for the floor-area estimator.
 */
export const matGuidance = Object.freeze({
  presets: [
    { id: "garage-single", label: "Garage / single car bay", widthM: 3, lengthM: 5 },
    { id: "home-room", label: "Spare room", widthM: 3.5, lengthM: 4 },
    { id: "small-academy", label: "Small academy floor", widthM: 8, lengthM: 12 },
    { id: "full-academy", label: "Full academy floor", widthM: 12, lengthM: 20 },
  ],
});
