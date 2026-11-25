import { getSeminar } from "../config/funnels.js";
import { enhanceCaptureForms, initMobileNav } from "./commerce-ui.js";
import { track, EVENTS } from "./events.js";

const event = getSeminar("michael-pixley-march-2027");
const daysForm = document.getElementById("pixley-days-form");
const subtotal = document.getElementById("seminar-subtotal");
const duration = new Map([["Day 1", 1], ["Day 2", 1], ["Both days", 2]]);

function updateSubtotal() {
  const people = daysForm.elements.people.valueAsNumber;
  const days = duration.get(daysForm.elements.days.value);
  if (!Number.isInteger(people) || people < 1 || people > event.dayCapacity || !days) {
    subtotal.textContent = "";
    subtotal.hidden = true;
    return;
  }
  const amount = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: event.currency,
    maximumFractionDigits: 0,
  }).format(event.dayPrice * days * people);
  subtotal.hidden = false;
  subtotal.textContent = `Seminar total ${amount} AUD · No payment today`;
}

daysForm.addEventListener("input", updateSubtotal);
daysForm.addEventListener("change", updateSubtotal);
daysForm.addEventListener("reset", () => queueMicrotask(updateSubtotal));
updateSubtotal();
initMobileNav();

track(EVENTS.SEMINAR_VIEWED, { slug: event.slug, status: event.status });
document.querySelectorAll("form[data-capture]").forEach((form) => {
  form.addEventListener("focusin", () => {
    track(EVENTS.SEMINAR_REGISTRATION_STARTED, { slug: event.slug, mode: form.dataset.capture });
  }, { once: true });
});
enhanceCaptureForms(document, (form) => {
  track(EVENTS.SEMINAR_INTEREST_SUBMITTED, { slug: event.slug, mode: form.dataset.capture });
});
