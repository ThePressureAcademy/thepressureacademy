/**
 * The Pressure Academy - drop-level apparel manifest.
 *
 * Drop 01: Toā Earth is the governing Pressure Tested campaign. The apparel
 * page renders from this file; edit here, not in page markup. This manifest
 * supersedes the generic `apparel` catalogue in js/config/commerce.js for the
 * apparel surface.
 *
 * SOURCE AUTHORITY
 * - Operator-supplied Drop 01 core campaign and technical board, 7 June 2026.
 * - Operator-supplied Pressure Tested Women architecture pack, 7 June 2026.
 * - Operator-supplied hoodie, rashguard, shorts, and T-shirt size boards.
 * - Pressure Tested identity lock: final locked product mark and wordmark only.
 *
 * TRUTH RULES
 * - publicStage "waitlist" means interest capture only. No cart activation,
 *   stock counts, order creation, or numbered-run claims.
 * - priceStatus "unlocked" means price is not locked. The UI never invents a
 *   number; copy says pricing publishes when it locks.
 * - Development size-board numbers may render only with the development label.
 *   finalMeasurementStatus remains "pending-sealed-sample" until approved
 *   garments are measured and the operator clears publication as final.
 * - culturalReviewStatus "pending" gates cultural interpretation, motif names,
 *   artwork meanings, and cultural claims. Colour, silhouette, fabric, and
 *   construction facts may render without interpretation.
 * - Women's fit wording remains design intent. No solved-problem claim before
 *   sealed-sample approval and field testing.
 * - Only the final locked Pressure Tested mark and wordmark are permitted. No
 *   auxiliary, affiliate, team, or sub-brand mark may enter product data,
 *   artwork, prompts, labels, patches, metadata, or public copy.
 */

export const drop01 = Object.freeze({
  id: "drop-01-toa-earth",
  name: "Drop 01: Toā Earth",
  line: "pressure-tested",
  tagline: "Proof of work. Worn with intent.",
  publicStage: "waitlist",
  campaignNameApprovalStatus: "pending",
  priceStatus: "unlocked",
  sampleStatus: "technical-spec",
  checkoutStatus: "disabled",
  culturalReviewStatus: "pending",
  developmentSizeGuidesStatus: "source-provided",
  finalMeasurementStatus: "pending-sealed-sample",
  palette: [
    { id: "clay-brown", label: "Clay Brown", hex: "#6F5440" },
    { id: "faded-olive", label: "Faded Olive", hex: "#5C5A3F" },
    { id: "sand", label: "Sand", hex: "#B09A6F" },
    { id: "washed-stone", label: "Washed Stone", hex: "#9A8F80" },
  ],
  capsules: [
    {
      id: "core",
      label: "Toā Earth Core",
      audience: "unisex",
      thesis: "Four core pieces on one earth-toned standard.",
      products: [
        {
          id: "toa-core-hoodie",
          capsule: "core",
          name: "Structured Hoodie",
          silhouette: "Structured hoodie",
          colour: "clay-brown",
          fitLogic: "Oversized structured block intended to hold shape through heavyweight fleece.",
          intendedFabric: "460 GSM cotton fleece",
          construction: "HD screen front, puff and chenille back, woven hem patch, heat-transfer neck label.",
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
          fitLogic: "Compression specification for live training.",
          intendedFabric: "230 GSM poly-elastane",
          construction: "Full sublimation, clean front chest, woven hem label, sublimated neck band.",
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
          fitLogic: "Hybrid-waistband specification cut for grappling range.",
          intendedFabric: "4-way stretch woven",
          construction: "Sublimation panels, HD leg text, woven hem patch.",
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
          fitLogic: "Boxy relaxed block with restrained print zones.",
          intendedFabric: "240 GSM combed cotton",
          construction: "HD screen front, puff and chenille back, woven hem patch, heat-transfer neck label.",
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
          colour: "clay-brown",
          fitLogic: "Boxy shoulder and controlled crop specification. Shape is intended to come from heavyweight fleece, not tightness.",
          intendedFabric: "400 to 460 GSM heavyweight cotton fleece",
          construction: "External woven patch near the lower-front hem or pocket.",
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
          colour: "washed-stone",
          fitLogic: "Easy mid-hip drape with slight waist shaping planned.",
          intendedFabric: "400 to 460 GSM premium cotton fleece",
          construction: "Woven hem patch and internal neck print.",
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
          colour: "faded-olive",
          fitLogic: "Anatomical longline construction planned. Designed to reduce ride-up.",
          intendedFabric: "230 GSM poly-elastane",
          construction: "Sublimated neck band and woven hem label.",
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
          colour: "sand",
          fitLogic: "Wide high-rise waistband specification with internal liner.",
          intendedFabric: "4-way stretch woven outer with internal compression liner",
          construction: "External woven patch near the hem.",
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
          colour: "washed-stone",
          fitLogic: "High-hip boxy crop specification. Coverage-first cut.",
          intendedFabric: "220 to 240 GSM combed cotton",
          construction: "Woven hem patch and internal neck print.",
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
          colour: "clay-brown",
          fitLogic: "Mid-hip relaxed full-length specification for training and after it.",
          intendedFabric: "220 to 240 GSM combed cotton",
          construction: "Woven hem patch and internal neck print.",
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
 * Concepts deliberately outside Drop 01. Nothing here renders on the drop
 * page. Moving an entry back into a drop is an operator decision.
 */
export const futureConcepts = [
  {
    id: "pt-cap",
    line: "pressure-tested",
    name: "Pressure Tested Cap",
    status: "future-concept",
    priceCents: null,
    blurb: "Unstructured, low-profile, embroidered mark. The quiet one.",
    note: "Not part of the Toā Earth system. Held for a later accessories decision.",
  },
];

const columns = (...items) => items.map(([key, label]) => ({ key, label }));

/**
 * Development size-board data supplied by the operator. These are not final
 * sealed-sample measurements. The public page must show the development label
 * beside every table and preserve the final-measurement gate.
 */
export const sizeGuideFamilies = [
  {
    id: "hoodies",
    label: "Hoodies",
    covers: [
      "Core unisex structured hoodie",
      "Women's cropped structured hoodie",
      "Women's full-length relaxed hoodie grading is not supplied in the current size board",
    ],
    tables: [
      {
        id: "unisex-hoodie",
        label: "Unisex Hoodie",
        descriptor: "460 GSM, relaxed and oversized structured fit",
        units: "Garment measurements in cm",
        columns: columns(
          ["size", "Size"],
          ["halfChest", "Half chest"],
          ["bodyLength", "Body length"],
          ["shoulder", "Shoulder"],
          ["sleeve", "Sleeve"],
        ),
        rows: [
          { size: "XS", halfChest: "57", bodyLength: "66", shoulder: "52", sleeve: "58" },
          { size: "S", halfChest: "59", bodyLength: "68", shoulder: "54", sleeve: "59" },
          { size: "M", halfChest: "61", bodyLength: "70", shoulder: "56", sleeve: "60" },
          { size: "L", halfChest: "63", bodyLength: "72", shoulder: "58", sleeve: "61" },
          { size: "XL", halfChest: "66", bodyLength: "74", shoulder: "60", sleeve: "62" },
          { size: "2XL", halfChest: "69", bodyLength: "76", shoulder: "62", sleeve: "63" },
          { size: "3XL", halfChest: "72", bodyLength: "78", shoulder: "64", sleeve: "64" },
        ],
      },
      {
        id: "women-cropped-hoodie",
        label: "Women's Cropped Structured Hoodie",
        descriptor: "AU guide included",
        units: "Garment measurements in cm",
        columns: columns(
          ["size", "Size"],
          ["auGuide", "AU guide"],
          ["halfChest", "Half chest"],
          ["bodyLength", "Body length"],
          ["shoulder", "Shoulder"],
          ["sleeve", "Sleeve"],
        ),
        rows: [
          { size: "XXS", auGuide: "4 to 6", halfChest: "50", bodyLength: "51", shoulder: "48", sleeve: "55" },
          { size: "XS", auGuide: "6 to 8", halfChest: "52", bodyLength: "53", shoulder: "50", sleeve: "56" },
          { size: "S", auGuide: "8 to 10", halfChest: "54", bodyLength: "55", shoulder: "52", sleeve: "57" },
          { size: "M", auGuide: "10 to 12", halfChest: "56", bodyLength: "57", shoulder: "54", sleeve: "58" },
          { size: "L", auGuide: "12 to 14", halfChest: "59", bodyLength: "59", shoulder: "56", sleeve: "59" },
          { size: "XL", auGuide: "14 to 16", halfChest: "62", bodyLength: "61", shoulder: "58", sleeve: "60" },
          { size: "2XL", auGuide: "16 to 18", halfChest: "65", bodyLength: "63", shoulder: "60", sleeve: "61" },
        ],
      },
    ],
    notes: ["Heavyweight premium fleece", "Structured drape", "Development tolerance: ±1 to 2 cm"],
    posterHref: null,
  },
  {
    id: "rashguards",
    label: "Rashguards",
    covers: ["Core unisex compression rashguard", "Women's longline compression rashguard"],
    tables: [
      {
        id: "unisex-rashguard",
        label: "Unisex Rashguard",
        descriptor: "230 GSM compression fit",
        units: "Body guide and garment measurements in cm",
        columns: columns(
          ["size", "Size"],
          ["bodyChest", "Body chest guide"],
          ["halfChest", "Half chest relaxed"],
          ["bodyLength", "Body length"],
          ["sleeveLength", "Sleeve length"],
        ),
        rows: [
          { size: "XXS", bodyChest: "76 to 81", halfChest: "36", bodyLength: "61", sleeveLength: "67" },
          { size: "XS", bodyChest: "81 to 86", halfChest: "38", bodyLength: "63", sleeveLength: "69" },
          { size: "S", bodyChest: "86 to 91", halfChest: "40", bodyLength: "65", sleeveLength: "71" },
          { size: "M", bodyChest: "91 to 97", halfChest: "42", bodyLength: "67", sleeveLength: "73" },
          { size: "L", bodyChest: "97 to 103", halfChest: "44", bodyLength: "69", sleeveLength: "75" },
          { size: "XL", bodyChest: "103 to 110", halfChest: "47", bodyLength: "71", sleeveLength: "77" },
          { size: "2XL", bodyChest: "110 to 118", halfChest: "50", bodyLength: "73", sleeveLength: "79" },
        ],
      },
      {
        id: "women-longline-rashguard",
        label: "Women's Longline Rashguard",
        descriptor: "AU guide included",
        units: "Body guide and garment measurements in cm",
        columns: columns(
          ["size", "Size"],
          ["auGuide", "AU guide"],
          ["bustGuide", "Bust guide"],
          ["halfChest", "Half chest"],
          ["bodyLength", "Body length"],
        ),
        rows: [
          { size: "XXS", auGuide: "4 to 6", bustGuide: "74 to 80", halfChest: "34", bodyLength: "60" },
          { size: "XS", auGuide: "6 to 8", bustGuide: "80 to 86", halfChest: "36", bodyLength: "62" },
          { size: "S", auGuide: "8 to 10", bustGuide: "86 to 92", halfChest: "38", bodyLength: "64" },
          { size: "M", auGuide: "10 to 12", bustGuide: "92 to 98", halfChest: "40", bodyLength: "66" },
          { size: "L", auGuide: "12 to 14", bustGuide: "98 to 104", halfChest: "43", bodyLength: "68" },
          { size: "XL", auGuide: "14 to 16", bustGuide: "104 to 112", halfChest: "46", bodyLength: "70" },
          { size: "2XL", auGuide: "16 to 18", bustGuide: "112 to 120", halfChest: "49", bodyLength: "72" },
        ],
      },
    ],
    notes: ["Compression fit", "Longer-body design intent", "Development tolerance: ±1 to 2 cm", "Prefer a looser feel? Size up"],
    posterHref: null,
  },
  {
    id: "shorts",
    label: "Shorts",
    covers: ["Core unisex grappling shorts", "Women's high-waist grappling short"],
    tables: [
      {
        id: "unisex-grappling-shorts",
        label: "Unisex Grappling Shorts",
        descriptor: "4-way stretch, hybrid fit",
        units: "Body and garment measurements in cm; waist column uses garment waist size",
        columns: columns(
          ["waist", "Waist"],
          ["alpha", "Alpha"],
          ["bodyWaist", "Body waist"],
          ["outseam", "Outseam"],
          ["inseam", "Inseam"],
          ["legOpening", "Leg opening"],
        ),
        rows: [
          { waist: "28", alpha: "XS", bodyWaist: "71", outseam: "40", inseam: "17", legOpening: "29" },
          { waist: "30", alpha: "S", bodyWaist: "76", outseam: "41", inseam: "17.5", legOpening: "30" },
          { waist: "32", alpha: "M", bodyWaist: "81", outseam: "42", inseam: "18", legOpening: "31" },
          { waist: "34", alpha: "L", bodyWaist: "86", outseam: "43", inseam: "18.5", legOpening: "32" },
          { waist: "36", alpha: "XL", bodyWaist: "91", outseam: "44", inseam: "19", legOpening: "33" },
          { waist: "38", alpha: "2XL", bodyWaist: "96", outseam: "45", inseam: "19.5", legOpening: "34" },
          { waist: "40", alpha: "2XL+", bodyWaist: "102", outseam: "46", inseam: "20", legOpening: "35" },
          { waist: "42", alpha: "3XL / custom", bodyWaist: "107", outseam: "47", inseam: "20.5", legOpening: "36" },
        ],
      },
      {
        id: "women-highwaist-shorts",
        label: "Women's High-Waist Grappling Shorts",
        descriptor: "Internal liner, AU guide included",
        units: "Body and garment measurements in cm",
        columns: columns(
          ["size", "Size"],
          ["auGuide", "AU guide"],
          ["waist", "Waist"],
          ["hip", "Hip"],
          ["inseam", "Inseam"],
        ),
        rows: [
          { size: "XXS", auGuide: "4 to 6", waist: "58 to 64", hip: "82 to 88", inseam: "13" },
          { size: "XS", auGuide: "6 to 8", waist: "64 to 70", hip: "88 to 94", inseam: "13.5" },
          { size: "S", auGuide: "8 to 10", waist: "70 to 76", hip: "94 to 100", inseam: "14" },
          { size: "M", auGuide: "10 to 12", waist: "76 to 82", hip: "100 to 106", inseam: "14.5" },
          { size: "L", auGuide: "12 to 14", waist: "82 to 90", hip: "106 to 114", inseam: "15" },
          { size: "XL", auGuide: "14 to 16", waist: "90 to 98", hip: "114 to 122", inseam: "15.5" },
          { size: "2XL", auGuide: "16 to 18", waist: "98 to 106", hip: "122 to 130", inseam: "16" },
        ],
      },
    ],
    notes: ["Mobility-first cut", "High-waist support specification", "Development tolerance: ±1 to 2 cm"],
    posterHref: null,
  },
  {
    id: "tees",
    label: "T-Shirts",
    covers: [
      "Core unisex boxy T-shirt",
      "Women's boxy crop and relaxed full-length tee grading is not supplied in the current size board",
    ],
    tables: [
      {
        id: "unisex-tshirt",
        label: "Unisex T-Shirt",
        descriptor: "240 GSM, boxy and relaxed",
        units: "Garment measurements in cm",
        columns: columns(
          ["size", "Size"],
          ["halfChest", "Half chest"],
          ["bodyLength", "Body length"],
          ["shoulder", "Shoulder"],
          ["sleeve", "Sleeve"],
        ),
        rows: [
          { size: "XXS", halfChest: "49", bodyLength: "64", shoulder: "45", sleeve: "20" },
          { size: "XS", halfChest: "51", bodyLength: "66", shoulder: "47", sleeve: "21" },
          { size: "S", halfChest: "53", bodyLength: "68", shoulder: "49", sleeve: "22" },
          { size: "M", halfChest: "55", bodyLength: "70", shoulder: "51", sleeve: "23" },
          { size: "L", halfChest: "58", bodyLength: "72", shoulder: "53", sleeve: "24" },
          { size: "XL", halfChest: "61", bodyLength: "74", shoulder: "55", sleeve: "25" },
          { size: "2XL", halfChest: "64", bodyLength: "76", shoulder: "57", sleeve: "26" },
        ],
      },
    ],
    notes: ["Heavyweight collar rib", "Premium boxy drape", "Measure a garment flat", "Development tolerance: ±1 to 2 cm"],
    posterHref: null,
  },
];

export const sizeGuideLabel =
  "Development measurement guide from the supplied size boards. Final garment measurements publish after sealed-sample approval.";
