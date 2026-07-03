/**
 * The Pressure Academy — proof / authority registry.
 *
 * TRUTH RULES (non-negotiable):
 * - Nothing renders unless `enabled: true` AND the entry is a real, verifiable
 *   asset (real person, real result, real affiliation, with consent).
 * - No fake badges, invented testimonials, or implied federation endorsements.
 * - When no proof is enabled, proof components render the brandFacts strip —
 *   statements that are true of the brand today — or nothing at all.
 */

export const proof = [
  {
    id: "example-testimonial",
    type: "testimonial", // testimonial | athlete | affiliation | media | result
    enabled: false, // flip only with a real quote + consent
    quote: null,
    attribution: null,
    context: null,
  },
  {
    id: "example-athlete",
    type: "athlete",
    enabled: false,
    name: null,
    credential: null,
    image: null,
  },
];

/**
 * Statements that are verifiably true of the brand today. Safe fallback
 * content for authority components while the proof registry is empty.
 */
export const brandFacts = [
  "Founder-led and independently owned",
  "Built in Queensland, Australia",
  "One system across mats, apparel, seminars, and digital blueprints",
  "Not motivation. Architecture.",
];

export function activeProof(type) {
  return proof.filter((p) => p.enabled && (!type || p.type === type));
}
