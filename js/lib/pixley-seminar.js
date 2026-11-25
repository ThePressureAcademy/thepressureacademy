import { getSeminar } from "../config/funnels.js";
import { PIXLEY_SESSIONS, PIXLEY_ADDONS } from "../config/pixley-collab.mjs";
import { enhanceCaptureForms, initMobileNav } from "./commerce-ui.js";
import { track, EVENTS } from "./events.js";

const event = getSeminar("michael-pixley-march-2027");
const dayCounts = new Map([["Day 1", 1], ["Day 2", 1], ["Both days", 2]]);
const aud = new Intl.NumberFormat("en-AU", {
  style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 2,
});
const money = cents => aud.format(cents / 100);

function updateQuote(form) {
  const fields = form.elements;
  const group = fields.request_type.value === "semi-private-group";
  const people = group ? Number(fields.group_size.value) : fields.people.valueAsNumber;
  const days = group ? 1 : dayCounts.get(fields.days.value);
  const capacity = group ? PIXLEY_SESSIONS.groupCapacity : PIXLEY_SESSIONS.dayCapacity;
  const validPeople = Number.isInteger(people) && people >= 1 && people <= capacity;
  const admission = group ? PIXLEY_SESSIONS.groupPriceCents : PIXLEY_SESSIONS.dayPriceCents * days * people;
  const output = form.querySelector("[data-quote]");
  const lines = [];
  let gear = 0;
  let valid = Boolean(days) && validPeople;

  for (const addon of PIXLEY_ADDONS) {
    const input = fields[addon.id + "_quantity"];
    const qty = input.valueAsNumber;
    if (!Number.isInteger(qty) || qty < 0 || qty > Number(input.max)) valid = false;
    const sizeInput = fields[addon.id + "_sizes"];
    sizeInput.disabled = !(qty > 0);
    sizeInput.closest("label").hidden = sizeInput.disabled;
    if (qty > 0) {
      gear += addon.priceCents * qty;
      lines.push([addon.label + " × " + qty, money(addon.priceCents * qty)]);
    }
  }
  for (const [name, cents] of Object.entries({admission, apparel: gear, estimated_total: admission + gear})) {
    fields[name + "_aud"].value = valid ? (cents / 100).toFixed(2) : "";
    fields[name + "_aud"].disabled = !valid;
  }
  output.hidden = !valid;
  if (!valid) {
    output.replaceChildren();
    return;
  }
  const session = group ? "Semi-private group" : fields.days.value + " × " + people + (people === 1 ? " person" : " people");
  lines.unshift([session, money(admission)]);
  lines.push(["Booking total", money(admission + gear) + " AUD"]);
  const rows = lines.map(([name, amount]) => {
    const row = document.createElement("span");
    const value = document.createElement("b");
    value.textContent = amount;
    row.append(name, value);
    return row;
  });
  output.replaceChildren(...rows);
}

initMobileNav();
track(EVENTS.SEMINAR_VIEWED, { slug: event.slug, status: event.status });
document.querySelectorAll("form[data-capture]").forEach((form) => {
  form.addEventListener("input", () => updateQuote(form));
  form.addEventListener("change", () => updateQuote(form));
  form.addEventListener("reset", () => queueMicrotask(() => updateQuote(form)));
  form.addEventListener("focusin", () => {
    track(EVENTS.SEMINAR_REGISTRATION_STARTED, { slug: event.slug, mode: form.dataset.capture });
  }, { once: true });
  updateQuote(form);
});
window.addEventListener("pageshow", () => {
  document.querySelectorAll("form[data-capture]").forEach(updateQuote);
});
enhanceCaptureForms(document, (form) => {
  track(EVENTS.SEMINAR_INTEREST_SUBMITTED, { slug: event.slug, mode: form.dataset.capture });
});
