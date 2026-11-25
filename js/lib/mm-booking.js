import { EVENTS, track } from "./events.js";

const form = document.getElementById("booking-enquiry");
const offers = form.elements.requested_offer;
const button = form.querySelector("button[type=submit]");
const error = document.getElementById("formError");
const receipt = document.getElementById("formSuccess");

function showOffer() {
  const option = offers.selectedOptions[0];
  form.elements.intent.value = option.dataset.intent;
  document.getElementById("enquiry-detail").textContent = option.dataset.detail;
  button.textContent = option.dataset.submit;
}

function openLinkedOffer() {
  const params = new URLSearchParams(location.search);
  const legacy = { call: "support-call", assessment: "assessment", info: "general" };
  const choice = params.get("offer") || legacy[params.get("intent")];
  if (Array.from(offers.options).some(option => option.value === choice)) offers.value = choice;
  showOffer();
}

openLinkedOffer();
window.addEventListener("pageshow", openLinkedOffer);
offers.addEventListener("change", () => {
  showOffer();
  const url = new URL(location.href);
  url.searchParams.delete("intent");
  url.searchParams.set("offer", offers.value);
  history.replaceState(history.state, "", url);
});

form.addEventListener("focusin", () => track(EVENTS.MM_BOOKING_START, {}), { once: true });
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (button.disabled) return;
  const data = new FormData(form);
  data.set("observations", data.getAll("observations").join("; "));
  const topic = offers.selectedOptions[0].textContent;
  const fields = document.getElementById("enquiry-fields");
  fields.disabled = true;
  const intent = data.get("intent");
  error.hidden = true;
  button.disabled = true;
  button.textContent = "Sending…";
  form.setAttribute("aria-busy", "true");
  try {
    const response = await fetch(form.action, {
      method: "POST", body: data, headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Request declined");
    const result = await response.json();
    if (result.ok !== true && !(result.ok === undefined && typeof result.next === "string" && result.next)) {
      throw new Error("Request unconfirmed");
    }
  } catch {
    error.hidden = false;
    return;
  } finally {
    fields.disabled = false;
    button.disabled = false;
    form.removeAttribute("aria-busy");
    showOffer();
  }
  form.hidden = true;
  document.getElementById("receipt-offer").textContent = topic;
  receipt.hidden = false;
  receipt.querySelector("h2").focus();
  track(EVENTS.MM_BOOKING_FORM_SUBMIT, { intent, source: "mastery-method-book" });
});
