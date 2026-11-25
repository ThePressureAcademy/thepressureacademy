import { apparel } from "../config/commerce.js";

/** Accessed on input and again before transmission to account for autofill. */
export function apparelQuote(productId, quantity) {
  const product = apparel.find((item) => item.id === productId);
  const units = Number(quantity);
  if (!product || !Number.isSafeInteger(units) || units < 1) return null;
  const subtotal = product.priceCents * units;
  if (!Number.isSafeInteger(subtotal)) return null;
  return { unitPrice: product.priceCents / 100, subtotal: subtotal / 100 };
}

export function initApparelRequest(form) {
  const { product, quantity, unit_price_aud: price, subtotal_aud: subtotal } = form.elements;
  const output = form.querySelector("[data-subtotal]");
  const money = new Intl.NumberFormat("en-AU", {
    style: "currency", currency: "AUD", maximumFractionDigits: 0, minimumFractionDigits: 0,
  });
  function update() {
    const quote = apparelQuote(product.value, quantity.value);
    price.disabled = subtotal.disabled = !quote;
    price.value = quote ? quote.unitPrice.toFixed(2) : "";
    subtotal.value = quote ? quote.subtotal.toFixed(2) : "";
    quantity.setCustomValidity(product.value && quantity.value && !quote ? "Please enter a valid whole-number quantity." : "");
    output.textContent = quote
      ? `Item subtotal: AUD ${money.format(quote.subtotal)}`
      : "Select a piece and enter a whole-number quantity to see the subtotal.";
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", update, true);
  form.addEventListener("reset", () => queueMicrotask(update));
  update();
}
