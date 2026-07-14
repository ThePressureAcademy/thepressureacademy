/**
 * The Pressure Academy — drop-level apparel manifest.
 *
 * Drop 01: Toā Earth is the governing Pressure Tested campaign. The apparel
 * page renders FROM this file; edit here, not in page markup. This manifest
 * supersedes the generic `apparel` catalogue in js/config/commerce.js for the
 * apparel surface (see the note there).
 *
 * TRUTH RULES (extend the commerce.js contract, do not weaken it):
 * - publicStage "waitlist" = interest capture only. No cart activation, no
 *   stock counts, no order creation, no numbered-run claims.
 * - priceStatus "unlocked" = price is NOT locked. UI never shows an invented
 *   number; copy says pricing publishes when it locks.
 * - finalMeasurementStatus "pending-sealed-sample" = size tables must not
 *   publish numbers. Every size surface carries the development label.
 * - culturalReviewStatus "pending" = NO cultural interpretation, motif
 *   naming, or artwork meaning may render anywhere on the public site until
 *   the provenance review is approved and this flag flips. Colour system,
 *   silhouettes, material restraint, and construction logic are safe.
 * - Fit wording on women's pieces uses design-intent language only
 *   ("designed to", "specification", "planned"). No solved-problem claims
 *   before sealed-sample approval and field testing.
 * - Identity: one locked Pressure Tested mark and wordmark. No auxiliary,
 *   affiliate, team, or sub-brand marks may be introduced through this file.
 *
 * SOURCE GAP (flagged, do not fill from memory): the June 2026 Drop 01
 * technical packs (core board, women's pack, size-guide posters) are not on
 * this machine. Fields marked null with "publishes with" notes wait for
 * those packs to land in an operator-approved form. Never invent fabric
 * specs, colour assignments, or measurements to fill them.
 */

export const drop01 = Object.freeze({
  id: "drop-01-toa-earth",
  name: "Drop 01: Toā Earth",
  line: "pressure-tested",
  tagline: "Proof of work. Worn with intent.",
  publicStage: "waitlist", // "waitlist" | "release"; release requires operator gates cleared
  priceStatus: "unlocked", // price not locked; no figures anywhere until it is
  sampleStatus: "technical-spec", // "technical-spec" | "sealed-sample" | "production"
  checkoutStatus: "disabled", // stays disabled until a payment provider is connected
  culturalReviewStatus: "pending", // gates ALL cultural interpretation site-wide
  palette: [
    { id: "clay-brown", label: "Clay Brown" },
    { id: "faded-olive", label: "Faded Olive" },
    { id: "sand", label: "Sand" },
    { id: "washed-stone", label: "Washed Stone" },
  ],
  capsules: [
    {
      id: "core",
      label: "Toā Earth Core",
      audience: "unisex", // Core is a unisex block, not a men's line
      thesis: "Four core pieces on one earth-toned standard.",
      products: [
        {
          id: "toa-core-hoodie",
          capsule: "core",
          name: "Structured Hoodie",
          silhouette: "Structured hoodie",
          colour: "clay-brown",
          fitLogic: "Structured block, built for training shoulders.",
          intendedFabric: null, // publishes with the technical board
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-core-hoodie",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-core-rashguard",
          capsule: "core",
          name: "Compression Rashguard",
          silhouette: "Compression rashguard",
          colour: "faded-olive",
          fitLogic: "Compression cut for live training.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-core-rashguard",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-core-shorts",
          capsule: "core",
          name: "Grappling Shorts",
          silhouette: "Grappling shorts",
          colour: "sand",
          fitLogic: "Cut for grappling range, nothing decorative.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-core-shorts",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-core-tee",
          capsule: "core",
          name: "Boxy T-Shirt",
          silhouette: "Boxy tee",
          colour: "washed-stone",
          fitLogic: "Boxy block, restrained print zones.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-core-tee",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
      ],
    },
    {
      id: "women",
      label: "Pressure Tested Women",
      audience: "women",
      thesis: "Not smaller. Better aligned.",
      principles: ["Movement", "Confidence", "Coverage", "Strength"],
      products: [
        {
          id: "toa-w-cropped-hoodie",
          capsule: "women",
          name: "Cropped Structured Hoodie",
          silhouette: "Cropped structured hoodie",
          colour: null, // colour assignment publishes with the campaign board
          fitLogic: "Cropped structured block with a deliberate hem line.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-w-cropped-hoodie",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-w-relaxed-hoodie",
          capsule: "women",
          name: "Full-Length Relaxed Hoodie",
          silhouette: "Full-length relaxed hoodie",
          colour: null,
          fitLogic: "Relaxed full-length block for cover between rounds.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-w-relaxed-hoodie",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-w-longline-rashguard",
          capsule: "women",
          name: "Longline Compression Rashguard",
          silhouette: "Longline compression rashguard",
          colour: null,
          fitLogic: "Anatomical longline construction planned. Designed to reduce ride-up.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-w-longline-rashguard",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-w-highwaist-short",
          capsule: "women",
          name: "High-Waist Grappling Short",
          silhouette: "High-waist grappling short",
          colour: null,
          fitLogic: "Wide high-rise waistband specification.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-w-highwaist-short",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-w-crop-tee",
          capsule: "women",
          name: "Boxy Crop Tee",
          silhouette: "Boxy crop tee",
          colour: null,
          fitLogic: "Coverage-first cut in a boxy crop block.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-w-crop-tee",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
        {
          id: "toa-w-relaxed-tee",
          capsule: "women",
          name: "Relaxed Full-Length Tee",
          silhouette: "Relaxed full-length tee",
          colour: null,
          fitLogic: "Relaxed full-length block, built for training and after it.",
          intendedFabric: null,
          sampleStage: "technical-spec",
          finalMeasurementStatus: "pending-sealed-sample",
          pricingStatus: "unlocked",
          availabilityStatus: "waitlist",
          interestEventKey: "toa-w-relaxed-tee",
          image: null,
          alt: null,
          culturalReviewStatus: "pending",
        },
      ],
    },
  ],
});

/**
 * Concepts deliberately OUTSIDE Drop 01. Nothing here renders on the drop
 * page. Moving an entry back into a drop is an operator decision.
 */
export const futureConcepts = [
  {
    id: "pt-cap",
    line: "pressure-tested",
    name: "Pressure Tested Cap",
    status: "future-concept", // removed from Drop 01 so the drop stays canonical
    priceCents: null,
    blurb: "Unstructured, low-profile, embroidered mark. The quiet one.",
    note: "Not part of the Toā Earth system. Held for a later accessories decision.",
  },
];

/**
 * Size-guide families for the drop page. Tables stay null until the
 * sealed-sample pack lands; the UI must render the development label and no
 * numbers while they are.
 */
export const sizeGuideFamilies = [
  {
    id: "hoodies",
    label: "Hoodies",
    covers: ["Core unisex structured hoodie", "Women's cropped and relaxed hoodies"],
    table: null,
    posterHref: null, // downloadable poster reference lands with the pack
  },
  {
    id: "rashguards",
    label: "Rashguards",
    covers: ["Core unisex compression rashguard", "Women's longline rashguard"],
    table: null,
    posterHref: null,
  },
  {
    id: "shorts",
    label: "Shorts",
    covers: ["Core unisex grappling shorts", "Women's high-waist grappling short"],
    table: null,
    posterHref: null,
  },
  {
    id: "tees",
    label: "T-Shirts",
    covers: ["Core unisex boxy tee", "Women's tee tables land when finalised"],
    table: null,
    posterHref: null,
  },
];

export const sizeGuideLabel =
  "Development measurement guide. Final garment measurements publish after sealed-sample approval.";
