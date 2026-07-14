/**
 * The Pressure Academy drop-level apparel manifest.
 *
 * Drop 01: Toā Earth is not release ready. The public page is a curiosity
 * surface only. It may reveal controlled signals, collect first-access intent,
 * and measure interest. It must not publish the full technical pack, complete
 * sizing data, final artwork, pricing, inventory, or checkout state.
 *
 * SOURCE AUTHORITY
 * - Operator-supplied Drop 01 core campaign and technical board, 7 June 2026.
 * - Operator-supplied Pressure Tested Women architecture pack, 7 June 2026.
 * - Operator-supplied development size boards.
 * - Pressure Tested identity lock: final locked product mark and wordmark only.
 *
 * PUBLIC TRUTH RULES
 * - publicStage "curiosity" means snippets and signup mechanics only.
 * - releaseReadiness "not-release-ready" blocks any release framing.
 * - publicDetailLevel "snippets-only" blocks full specifications and tables.
 * - No price, stock, numbered-run, cart, order, final-fit, or performance claim.
 * - Cultural interpretation, motif names, meanings, and artwork stay gated.
 * - Only the final locked Pressure Tested mark and wordmark are permitted.
 */

export const drop01 = Object.freeze({
  id: "drop-01-toa-earth",
  name: "Drop 01: Toā Earth",
  line: "pressure-tested",
  tagline: "Proof of work. Worn with intent.",
  publicStage: "curiosity",
  releaseReadiness: "not-release-ready",
  publicDetailLevel: "snippets-only",
  campaignNameApprovalStatus: "pending",
  culturalReviewStatus: "pending",
  sampleStatus: "technical-spec",
  finalMeasurementStatus: "pending-sealed-sample",
  priceStatus: "unlocked",
  checkoutStatus: "disabled",
  inventoryStatus: "not-available",
  sourcePacksStatus: "operator-held-not-public",
  publicGates: Object.freeze({
    technicalSpecifications: false,
    fullProductArchitecture: false,
    sizeTables: false,
    posterDownloads: false,
    finalArtwork: false,
    culturalInterpretation: false,
    pricing: false,
    inventory: false,
    checkout: false,
  }),
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
      audience: "unisex",
      thesis: "Four earth-toned training silhouettes. Only the first signals are public.",
      products: [
        {
          id: "toa-core-hoodie",
          capsule: "core",
          category: "hoodie",
          name: "Structured Hoodie",
          colour: "clay-brown",
          teaser: "A heavyweight outer layer in Clay Brown. Shape first, details later.",
          publicTeaser: true,
        },
        {
          id: "toa-core-rashguard",
          capsule: "core",
          category: "rashguard",
          name: "Compression Rashguard",
          colour: "faded-olive",
          teaser: "A Faded Olive training layer built around compression and restraint.",
          publicTeaser: true,
        },
        {
          id: "toa-core-shorts",
          capsule: "core",
          category: "shorts",
          name: "Grappling Shorts",
          colour: "sand",
          teaser: "A Sand grappling short developed for movement, with construction held back.",
          publicTeaser: true,
        },
        {
          id: "toa-core-tee",
          capsule: "core",
          category: "tee",
          name: "Boxy T-Shirt",
          colour: "washed-stone",
          teaser: "A Washed Stone boxy tee. Minimal on the surface, deliberate underneath.",
          publicTeaser: true,
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
          category: "hoodie",
          name: "Cropped Structured Hoodie",
          colour: "clay-brown",
          teaser: "A structured Clay Brown crop. Strong line, controlled length.",
          publicTeaser: true,
        },
        {
          id: "toa-w-longline-rashguard",
          capsule: "women",
          category: "rashguard",
          name: "Longline Compression Rashguard",
          colour: "faded-olive",
          teaser: "A Faded Olive longline training layer, designed around coverage and movement.",
          publicTeaser: true,
        },
        {
          id: "toa-w-highwaist-short",
          capsule: "women",
          category: "shorts",
          name: "High-Waist Grappling Short",
          colour: "sand",
          teaser: "A Sand high-waist short built from a separate women-specific fit logic.",
          publicTeaser: true,
        },
        {
          id: "toa-w-relaxed-hoodie",
          capsule: "women",
          category: "hoodie",
          name: "Full-Length Relaxed Hoodie",
          colour: "washed-stone",
          teaser: null,
          publicTeaser: false,
        },
        {
          id: "toa-w-crop-tee",
          capsule: "women",
          category: "tee",
          name: "Boxy Crop Tee",
          colour: "washed-stone",
          teaser: null,
          publicTeaser: false,
        },
        {
          id: "toa-w-relaxed-tee",
          capsule: "women",
          category: "tee",
          name: "Relaxed Full-Length Tee",
          colour: "clay-brown",
          teaser: null,
          publicTeaser: false,
        },
      ],
    },
  ],
  curiosityReveals: [
    {
      id: "palette",
      title: "The ground",
      copy: "Four earth tones hold the drop together: Clay Brown, Faded Olive, Sand, and Washed Stone.",
    },
    {
      id: "systems",
      title: "Two systems",
      copy: "A four-piece unisex core and a separate women-specific architecture share one Pressure Tested standard.",
    },
    {
      id: "locked",
      title: "What stays locked",
      copy: "Final construction, measurements, artwork, cultural interpretation, pricing, stock, and checkout remain private until their gates clear.",
    },
  ],
});

/**
 * Concepts deliberately outside Drop 01. Nothing here renders on the drop page.
 */
export const futureConcepts = [
  {
    id: "pt-cap",
    line: "pressure-tested",
    name: "Pressure Tested Cap",
    status: "future-concept",
    priceCents: null,
    note: "Not part of Drop 01. Held for a later accessories decision.",
  },
];

/**
 * Public sizing is teaser-only during the curiosity phase. Development tables
 * remain in the operator source pack and do not render on the website.
 */
export const sizeGuideFamilies = [
  {
    id: "hoodies",
    label: "Hoodies",
    teaser: "Core and women-specific hoodie guides publish after sealed samples.",
  },
  {
    id: "rashguards",
    label: "Rashguards",
    teaser: "Compression and longline guides publish after sealed samples.",
  },
  {
    id: "shorts",
    label: "Shorts",
    teaser: "Unisex and high-waist guides publish after sealed samples.",
  },
  {
    id: "tees",
    label: "T-Shirts",
    teaser: "Core and women-specific tee guides publish after sealed samples.",
  },
];

export const sizeGuideLabel =
  "Sizing architecture is in development. Final guides publish only after sealed-sample approval.";
