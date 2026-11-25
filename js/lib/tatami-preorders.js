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
  const summary = document.getElementById("mat-summary");
  const payload = document.getElementById("calc-payload");
  const calc = document.getElementById("mat-calc");
  const preset = document.getElementById("calc-preset");
  const width = document.getElementById("calc-width");
  const length = document.getElementById("calc-length");
  const result = document.getElementById("calc-result");
  const detail = document.getElementById("calc-detail");
  const useCount = document.getElementById("use-count");
  let estimatedCount = null;

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
  form.addEventListener("formdata", event => {
    const subtotal = matSubtotal(quantity.valueAsNumber);
    if (subtotal) {
      event.formData.set("mat_subtotal", String(subtotal.cents / 100));
      event.formData.set("coverage_m2", String(subtotal.area));
    }
  });
  form.addEventListener("reset", () => queueMicrotask(() => {
    payload.disabled = true;
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
    detail.textContent = estimate.count < estimate.orderQuantity
      ? `${base} The minimum order is ${estimate.orderQuantity} mats.`
      : base;
    result.hidden = false;
    useCount.textContent = `Use ${estimatedCount} mats in my request`;
  });
  useCount.addEventListener("click", () => {
    if (estimatedCount === null) return;
    quantity.value = estimatedCount;
    updateSubtotal();
    payload.value = `${width.value} m × ${length.value} m; ${detail.textContent}`;
    payload.disabled = false;
    quantity.focus();
    quantity.scrollIntoView({ block: "center" });
  });
  calc.hidden = false;
}
