/**
 * The Pressure Academy — logistics provider boundary.
 *
 * TRUTH: no carrier, freight partner, or 3PL is contracted. This module is
 * the seam where rate quoting and fulfilment handoff will live. Until a
 * provider is connected, every quote request returns an honest
 * `available: false` so UI can render "quoted at order confirmation" copy
 * instead of invented shipping prices.
 *
 * Candidate integrations (decision deferred): Shopify Shipping profiles,
 * ShipStation, direct freight carrier for palletised mats. Env boundary in
 * .env.example (SHIPSTATION_*, FREIGHT_*).
 */

import { shippingZones, fulfilmentHubs } from "../config/regions.js";

export const providers = [
  // { id: "shipstation", label: "ShipStation", goods: ["apparel"], status: "candidate" }
];

export function activeProviders() {
  return providers.filter((p) => p.status === "active");
}

/**
 * Freight expectation for heavy goods (mats). Pure messaging helper — the
 * only honest output available before a freight partner exists.
 */
export function getFreightEstimate({ goods = "mats", regionId = "au" } = {}) {
  const zone = shippingZones.find(
    (z) => z.goods === goods && (z.regionId === regionId || z.regionId === null),
  );
  return {
    available: false,
    reason: "NO_PROVIDER_CONTRACTED",
    zone: zone ? zone.id : null,
    message:
      goods === "mats"
        ? "Mats ship as palletised freight. We confirm the exact freight cost with you before any money changes hands."
        : "Shipping rates are confirmed at checkout once our carrier account is live.",
  };
}

/** Fulfilment handoff placeholder — records intent, performs no dispatch. */
export function requestFulfilmentHandoff(order) {
  return {
    accepted: false,
    reason: "NO_FULFILMENT_HUB_ACTIVE",
    hubs: fulfilmentHubs.map((h) => ({ id: h.id, status: h.status })),
    order: order ? { ref: order.ref || null } : null,
  };
}
