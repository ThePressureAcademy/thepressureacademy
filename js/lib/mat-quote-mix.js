import { tatamiMat } from "../config/commerce.js";

export function chooseSpareColour(colours, requested) {
  if (tatamiMat.colours.includes(requested)) return requested;
  return tatamiMat.colours.reduce((best, colour) =>
    (colours[colour] || 0) > (colours[best] || 0) ? colour : best);
}

export function orderColourMix(colours, extras, spareColour) {
  const mix = { ...colours };
  if (extras) mix[spareColour] = (mix[spareColour] || 0) + extras;
  return tatamiMat.colours.filter(colour => mix[colour] > 0)
    .map(colour => `${mix[colour]} × ${colour}`).join(", ");
}

export function academyPlanLink(code, spareColour, specs = false) {
  const params = new URLSearchParams({ type: "both", plan: code });
  if (tatamiMat.colours.includes(spareColour)) params.set("extra", spareColour);
  if (specs) params.set("specs", "1");
  return "/academy-orders/?" + params.toString() + "#order-enquiry";
}
