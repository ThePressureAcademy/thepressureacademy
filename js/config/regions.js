/**
 * The Pressure Academy — region / currency / logistics configuration.
 *
 * TRUTH: only Australian operation exists today. Everything else is a
 * planned-expansion placeholder so international support is a config change,
 * not a rewrite. No UI may claim active global fulfilment from this file —
 * `status` gates every claim.
 */

export const baseCurrency = "AUD";
export const displayLocale = "en-AU";

export const currencies = [
  { code: "AUD", symbol: "$", status: "active" },
  { code: "NZD", symbol: "$", status: "planned" },
  { code: "USD", symbol: "$", status: "planned" },
  { code: "GBP", symbol: "£", status: "planned" },
  { code: "EUR", symbol: "€", status: "planned" },
];

export const regions = [
  {
    id: "au",
    label: "Australia",
    status: "active",
    currency: "AUD",
    taxHandling: "TBC", // GST posture to be confirmed with accountant before checkout goes live
  },
  { id: "nz", label: "New Zealand", status: "planned", currency: "NZD", taxHandling: "TBC" },
  { id: "us", label: "United States", status: "planned", currency: "USD", taxHandling: "TBC" },
  { id: "uk", label: "United Kingdom", status: "planned", currency: "GBP", taxHandling: "TBC" },
  { id: "eu", label: "European Union", status: "planned", currency: "EUR", taxHandling: "TBC" },
];

export const shippingZones = [
  {
    id: "au-parcel",
    label: "Australia — apparel parcel",
    regionId: "au",
    goods: "apparel",
    status: "planned", // no carrier account connected
    provider: null,
  },
  {
    id: "au-freight",
    label: "Australia — mat freight (heavy goods)",
    regionId: "au",
    goods: "mats",
    status: "planned",
    provider: null,
    note: "Mats ship as palletised freight. Quotes are per-order until a freight partner is contracted.",
  },
  {
    id: "intl-parcel",
    label: "International — apparel parcel",
    regionId: null,
    goods: "apparel",
    status: "planned",
    provider: null,
  },
];

export const fulfilmentHubs = [
  {
    id: "au-seq",
    label: "South East Queensland, Australia",
    status: "planned", // no warehouse/3PL contracted yet
    provider: null,
  },
];

export function formatMoney(cents, currency = baseCurrency) {
  if (cents == null) return null;
  return new Intl.NumberFormat(displayLocale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function activeRegions() {
  return regions.filter((r) => r.status === "active");
}
