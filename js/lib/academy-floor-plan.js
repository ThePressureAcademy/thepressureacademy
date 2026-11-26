import { tatamiMat } from "../config/commerce.js";
import { decodeLayout, serializeLayout, summarizeLayout } from "./mat-layout-v1.js";
import { chooseSpareColour, orderColourMix } from "./mat-quote-mix.js";

export function initAcademyFloor(form) {
  const get = id => document.getElementById(id);
  const type = form.elements.order_type;
  const dimensions = form.elements.floor_dimensions;
  const quantity = form.elements.mat_quantity;
  const review = get("club-floor-review");
  const spareColour = get("club-spare-colour");
  const status = get("floor-link-status");
  const dialog = get("club-floor-editor");
  const frame = get("club-editor-frame");
  const params = new URLSearchParams(location.search);
  const source = document.querySelector('link[rel="canonical"]').href;
  const links = document.querySelectorAll("[data-open-floor]");
  const money = new Intl.NumberFormat("en-AU", { style: "currency", currency: tatamiMat.currency, maximumFractionDigits: 0 });
  let attached = null;
  let priorDimensions = dimensions.value;
  let priorQuantity = quantity.value;

  for (const colour of tatamiMat.colours) spareColour.add(new Option(colour, colour));

  function editorUrl(code, embedded = false) {
    const url = new URL("/shop/mats/", location.href);
    if (code) url.searchParams.set("plan", code);
    if (embedded) url.searchParams.set("editor", "academy");
    url.hash = "floor-planner";
    return url;
  }

  function keepUrlCurrent() {
    const url = new URL(location.href);
    const includesFloor = attached && ["mat-fitout", "both"].includes(type.value);
    if (attached) url.searchParams.set("type", type.value);
    if (includesFloor) {
      url.searchParams.set("plan", attached.code);
    } else {
      url.searchParams.delete("plan");
    }
    if (includesFloor && attached.totals.extraMats) url.searchParams.set("extra", spareColour.value);
    else url.searchParams.delete("extra");
    if (includesFloor && form.elements.request_mat_specifications.checked) url.searchParams.set("specs", "1");
    else url.searchParams.delete("specs");
    history.replaceState(history.state, "", url);
  }

  function orderMix() {
    return orderColourMix(attached.totals.colours, attached.totals.extraMats, spareColour.value);
  }

  function displayMix() {
    get("club-order-mix").textContent = "Order colours: " + orderMix();
  }

  function apply(code, preferredSpare) {
    const layout = decodeLayout(code);
    if (!layout || !layout.mats.length) return false;
    const totals = summarizeLayout(layout);
    if (!attached) {
      priorDimensions = dimensions.value;
      priorQuantity = quantity.value;
    }
    attached = { code, layout, totals };
    if (!["both", "mat-fitout"].includes(type.value)) {
      type.value = "both";
      type.dispatchEvent(new Event("change"));
    }
    dimensions.value = `${layout.widthM} × ${layout.lengthM} m`;
    quantity.value = String(totals.orderQuantity);
    dimensions.readOnly = quantity.readOnly = true;
    spareColour.value = chooseSpareColour(totals.colours, preferredSpare);
    spareColour.disabled = get("club-spare-field").hidden = !totals.extraMats;
    get("club-spare-label").textContent = totals.extraMats === 1
      ? "Colour for 1 extra mat to meet the minimum" : `Colour for ${totals.extraMats} extra mats to meet the minimum`;
    const area = `${totals.areaM2} m² covered, ${totals.uncoveredAreaM2} m² open`
      + (totals.blockedAreaM2 ? `, ${totals.blockedAreaM2} m² blocked` : "");
    get("club-plan-summary").textContent = `${totals.placed} ${totals.placed === 1 ? "mat" : "mats"} laid (${area}). Mat subtotal AUD ${money.format(totals.subtotalCents / 100)} before freight and team kit.`;
    displayMix();
    for (const link of links) link.href = editorUrl(code);
    review.hidden = false;
    status.hidden = true;
    get("club-manual-floor").hidden = true;
    keepUrlCurrent();
    return true;
  }

  function detach() {
    attached = null;
    dimensions.readOnly = quantity.readOnly = false;
    dimensions.value = priorDimensions;
    quantity.value = priorQuantity;
    spareColour.disabled = true;
    review.hidden = true;
    get("club-manual-floor").hidden = false;
    for (const link of links) link.href = editorUrl(null);
    keepUrlCurrent();
  }

  for (const link of links) {
    link.href = editorUrl(null);
    link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== "function") return;
      event.preventDefault();
      frame.src = editorUrl(attached?.code, true);
      dialog.showModal();
    });
  }
  get("club-editor-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { if (!dialog.open) frame.removeAttribute("src"); });
  window.addEventListener("message", event => {
    if (!dialog.open || event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.action === "academy-floor-close") dialog.close();
    if (event.data?.action !== "academy-floor-apply") return;
    if (apply(event.data.code, attached ? spareColour.value : null)) {
      dialog.close();
      get("club-floor-title").focus();
    }
  });
  get("club-remove-plan").addEventListener("click", () => {
    detach();
    dimensions.focus();
  });
  spareColour.addEventListener("change", () => {
    displayMix();
    keepUrlCurrent();
  });
  for (const field of [type, form.elements.request_mat_specifications]) {
    field.addEventListener("change", () => { if (attached) keepUrlCurrent(); });
  }
  form.addEventListener("formdata", ({ formData }) => {
    if (!attached || !["mat-fitout", "both"].includes(type.value)) return;
    const { layout, totals, code } = attached;
    const view = new URL("/shop/mats/", source);
    view.searchParams.set("plan", code);
    view.hash = "floor-planner";
    formData.set("view_floor_plan", view.href);
    formData.set("floor_plan", serializeLayout(layout));
    formData.set("floor_plan_summary", get("club-plan-summary").textContent);
    formData.set("mat_colour_quantities", orderMix());
    formData.set("mats_laid", String(totals.placed));
    formData.set("minimum_order_extras", String(totals.extraMats));
    if (totals.extraMats) formData.set("extra_mats_colour", spareColour.value);
    formData.set("mat_subtotal", String(totals.subtotalCents / 100));
    formData.set("currency", tatamiMat.currency);
  });
  form.addEventListener("reset", () => queueMicrotask(() => {
    priorDimensions = dimensions.defaultValue;
    priorQuantity = quantity.defaultValue;
    detach();
    status.hidden = true;
  }));

  if (params.get("specs") === "1") form.elements.request_mat_specifications.checked = true;
  if (params.has("plan") && !apply(params.get("plan"), params.get("extra"))) {
    status.textContent = "This link has no usable mat layout. You can design a floor or enter your quantities below.";
    status.hidden = false;
  }
}
