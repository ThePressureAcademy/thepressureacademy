import { estimateMatFloor } from "./tatami-preorders.js";

export function initAcademyQuote(form) {
  const type = form.elements.order_type;
  const floor = form.querySelector("#floor-scope");
  const kit = form.querySelector("#kit-scope");

  function showScope() {
    floor.disabled = floor.hidden = !["mat-fitout", "both"].includes(type.value);
    kit.disabled = kit.hidden = !["team-apparel", "both"].includes(type.value);
  }

  const params = new URLSearchParams(location.search);
  const requested = params.get("type");
  if (Array.from(type.options).some(option => option.value === requested)) {
    type.value = requested;
    if (requested === "mat-fitout") {
      const width = Number(params.get("width_m"));
      const length = Number(params.get("length_m"));
      const estimate = estimateMatFloor(width, length);
      if (estimate) {
        form.elements.floor_dimensions.value = width + " × " + length + " m";
        form.elements.mat_quantity.value = String(estimate.orderQuantity);
      }
    }
  }
  showScope();
  type.addEventListener("change", showScope);
  form.addEventListener("reset", () => queueMicrotask(showScope));
  for (const link of document.querySelectorAll("[data-quote-for]")) {
    link.addEventListener("click", () => {
      type.value = link.dataset.quoteFor;
      showScope();
      type.focus({ preventScroll: true });
    });
  }
}
