import { tatamiMat, matGuidance } from "../config/commerce.js";

const dollars = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: tatamiMat.currency,
  maximumFractionDigits: 0,
});

export function matSubtotal(quantity) {
  const cents = quantity * tatamiMat.priceCents;
  if (!Number.isInteger(quantity) || quantity < tatamiMat.minimumQuantity || !Number.isSafeInteger(cents)) return null;
  return { cents, area: quantity * tatamiMat.coverageM2 };
}

export function estimateMatFloor(widthM, lengthM) {
  if (![widthM, lengthM].every(value => Number.isFinite(value) && value >= 0.01 && value <= 1000)) return null;
  // Inputs accept centimetre precision. Integer multiplication avoids rounding
  // an exact fit up to an extra mat due to floating-point error.
  const areaCm2 = Math.round(widthM * 100) * Math.round(lengthM * 100);
  const count = Math.ceil(areaCm2 / (tatamiMat.coverageM2 * 10000));
  return { area: areaCm2 / 10000, count, orderQuantity: Math.max(tatamiMat.minimumQuantity, count) };
}

export function initTatamiPreorders() {
  const form = document.getElementById("mat-request");
  const quantity = form.elements.quantity;
  const otherColour = document.getElementById("other-mat-colour");
  const colourDetails = document.getElementById("mat-colour-details");
  const requestedColour = form.elements.requested_colour;
  const summary = document.getElementById("mat-summary");
  const payload = document.getElementById("calc-payload");
  const calc = document.getElementById("mat-calc");
  const preset = document.getElementById("calc-preset");
  const width = document.getElementById("calc-width");
  const length = document.getElementById("calc-length");
  const result = document.getElementById("calc-result");
  const detail = document.getElementById("calc-detail");
  const useCount = document.getElementById("use-count");
  const clubQuote = document.getElementById("use-academy-estimate");
  const manualColours = document.getElementById("mat-colours");
  const planQuote = document.getElementById("plan-quote");
  const spareLabel = document.getElementById("plan-extra-label");
  const spareColour = document.getElementById("plan-extra-colour");
  const quantityHelp = document.getElementById("quantity-help");
  let estimatedCount = null;
  let attached = null;
  let manualQuantity = quantity.value;

  function updateColourField() {
    const needsDetail = !attached && otherColour.checked;
    colourDetails.hidden = !needsDetail;
    requestedColour.disabled = !needsDetail;
    requestedColour.required = needsDetail;
  }
  manualColours.addEventListener("change", updateColourField);
  updateColourField();

  function updateSubtotal() {
    const subtotal = matSubtotal(quantity.valueAsNumber);
    quantity.setCustomValidity(subtotal ? "" : "Enter a whole number of mats, 10 or more, within the supported quantity range.");
    summary.textContent = subtotal
      ? `${subtotal.area.toLocaleString("en-AU")} m² · AUD ${dollars.format(subtotal.cents / 100)} before freight`
      : "Enter a valid quantity to see your mat subtotal.";
  }

  quantity.addEventListener("input", () => {
    payload.disabled = true;
    updateSubtotal();
  });
  for (const colour of tatamiMat.colours) spareColour.add(new Option(colour, colour));

  function orderMix() {
    const mix = { ...attached.colours };
    const spares = attached.quantity - attached.placed;
    if (spares) mix[spareColour.value] = (mix[spareColour.value] || 0) + spares;
    return tatamiMat.colours.filter(colour => mix[colour] > 0)
      .map(colour => `${mix[colour]} × ${colour}`).join(", ");
  }

  function displayMix() {
    document.getElementById("plan-quote-colours").textContent = "Order colours: " + orderMix();
  }

  function attachPlan(plan, moveFocus) {
    const wasAttached = Boolean(attached);
    if (!wasAttached) manualQuantity = quantity.value;
    attached = plan;
    payload.disabled = true;
    manualColours.disabled = manualColours.hidden = true;
    updateColourField();
    quantity.readOnly = true;
    quantityHelp.hidden = true;
    quantity.value = plan.quantity;
    planQuote.hidden = false;
    document.getElementById("plan-quote-summary").textContent = plan.summary;
    const spares = plan.quantity - plan.placed;
    spareColour.disabled = spareLabel.hidden = spares === 0;
    if (!wasAttached) {
      spareColour.value = tatamiMat.colours.reduce((best, colour) =>
        (plan.colours[colour] || 0) > (plan.colours[best] || 0) ? colour : best);
    }
    if (spares > 0) {
      document.getElementById("plan-extra-title").textContent =
        `Colour for ${spares === 1 ? "1 extra mat" : spares + " extra mats"} to meet the minimum order`;
    }
    displayMix();
    updateSubtotal();
    if (moveFocus) document.getElementById("plan-quote-heading").focus();
  }

  function detachPlan() {
    if (!attached) return;
    attached = null;
    planQuote.hidden = true;
    spareColour.disabled = true;
    manualColours.disabled = manualColours.hidden = false;
    quantityHelp.hidden = quantity.readOnly = false;
    quantity.value = manualQuantity;
    updateColourField();
    updateSubtotal();
  }
  spareColour.addEventListener("change", displayMix);
  document.getElementById("remove-plan").addEventListener("click", () => {
    detachPlan();
    (manualColours.querySelector("input:checked") || manualColours.querySelector("input")).focus();
  });
  document.addEventListener("tatami:use-layout", event => {
    if (event.detail.placed > 0) attachPlan(event.detail, true);
  });
  document.addEventListener("tatami:layout-changed", event => {
    if (!attached) return;
    if (event.detail.placed > 0) attachPlan(event.detail, false);
    else detachPlan();
  });
  form.addEventListener("formdata", event => {
    const subtotal = matSubtotal(quantity.valueAsNumber);
    if (subtotal) {
      event.formData.set("mat_subtotal", String(subtotal.cents / 100));
      event.formData.set("coverage_m2", String(subtotal.area));
    }
    if (attached) {
      const orderColours = tatamiMat.colours.filter(colour => attached.colours[colour] > 0 ||
        (!spareColour.disabled && spareColour.value === colour));
      event.formData.set("mat_colour", orderColours.length === 1 ? orderColours[0] : "Mixed floor plan");
      event.formData.set("mat_colour_quantities", orderMix());
      event.formData.set("floor_plan_summary", attached.summary);
      event.formData.set("floor_plan", attached.layout);
      event.formData.set("view_floor_plan", attached.planUrl);
    }
  });
  form.addEventListener("reset", () => queueMicrotask(() => {
    detachPlan();
    quantity.value = quantity.defaultValue;
    payload.disabled = true;
    updateColourField();
    updateSubtotal();
  }));
  updateSubtotal();
  summary.hidden = false;

  for (const room of matGuidance.presets) {
    preset.add(new Option(`${room.label} (${room.widthM} × ${room.lengthM} m)`, room.id));
  }
  function clearEstimate() {
    estimatedCount = null;
    result.hidden = true;
  }
  preset.addEventListener("change", () => {
    const room = matGuidance.presets.find(entry => entry.id === preset.value);
    if (room) {
      width.value = room.widthM;
      length.value = room.lengthM;
    }
    clearEstimate();
  });
  for (const field of [width, length]) {
    field.addEventListener("input", () => {
      preset.value = "";
      clearEstimate();
    });
  }
  calc.addEventListener("submit", event => {
    event.preventDefault();
    if (!calc.reportValidity()) return;
    const estimate = estimateMatFloor(width.valueAsNumber, length.valueAsNumber);
    if (!estimate) return;
    estimatedCount = estimate.orderQuantity;
    const matWord = estimate.count === 1 ? "mat" : "mats";
    const base = `${estimate.area.toLocaleString("en-AU", { maximumFractionDigits: 4 })} m² needs about ${estimate.count} ${matWord} by area.`;
    const quantityNote = estimate.count < estimate.orderQuantity
      ? `${base} The minimum order is ${estimate.orderQuantity} mats.`
      : base;
    const subtotal = matSubtotal(estimate.orderQuantity);
    detail.textContent = quantityNote + " Mat subtotal AUD " + dollars.format(subtotal.cents / 100) + " before freight.";
    const params = new URLSearchParams({ type: "mat-fitout", width_m: width.value, length_m: length.value });
    clubQuote.href = "/academy-orders/?" + params.toString() + "#order-enquiry";
    result.hidden = false;
    useCount.textContent = `Use ${estimatedCount} mats in my request`;
  });
  useCount.addEventListener("click", () => {
    if (estimatedCount === null) return;
    detachPlan();
    quantity.value = estimatedCount;
    updateSubtotal();
    payload.value = `${width.value} m × ${length.value} m; ${detail.textContent}`;
    payload.disabled = false;
    quantity.focus();
    quantity.scrollIntoView({ block: "center" });
  });
  calc.hidden = false;
}
