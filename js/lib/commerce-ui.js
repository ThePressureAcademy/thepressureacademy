/**
 * The Pressure Academy — shared commerce UI renderers.
 * Renders FROM config (js/config/*). No invented data here.
 */

import { formatMoney } from "../config/regions.js";
import { activeProof, brandFacts } from "../config/proof.js";
import { track, EVENTS } from "./events.js";

export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/** Slug from pathname: /seminars/some-event/ → "some-event". Falls back to ?slug= for local static preview. */
export function slugFromPath(section) {
  const m = window.location.pathname.match(
    new RegExp(`^/${section}/([a-z0-9][a-z0-9-]*)/?$`),
  );
  if (m) return m[1];
  const q = new URLSearchParams(window.location.search).get("slug");
  return q || null;
}

/** Apparel product card. Placeholder status renders drop-list CTA, never a fake buy button. */
export function apparelCard(product) {
  const placeholder = product.status !== "live";
  const price =
    product.priceCents != null
      ? formatMoney(product.priceCents)
      : escapeHtml(product.priceNote || "Pricing TBC");
  return `
  <article class="product-card" data-product-id="${escapeHtml(product.id)}">
    <div class="product-media">
      ${
        product.image
          ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />`
          : `<div class="product-media-fallback" aria-hidden="true"><img src="/assets/logos/Pressure_Tested_Mark.svg" alt="" /></div>`
      }
      ${placeholder ? `<span class="badge">In development</span>` : ""}
    </div>
    <div class="product-body">
      <h3>${escapeHtml(product.name)}</h3>
      <p class="muted">${escapeHtml(product.blurb)}</p>
      <div class="product-meta">
        <span class="mono">${price}</span>
        <span class="mono muted">${(product.sizes || []).map(escapeHtml).join(" · ")}</span>
      </div>
      ${
        placeholder
          ? `<button type="button" class="btn-ghost btn-block" data-drop-list="${escapeHtml(product.id)}">Get first access at drop</button>`
          : `<button type="button" class="btn btn-block" data-add-to-cart="${escapeHtml(product.id)}">Add to cart</button>`
      }
    </div>
  </article>`;
}

/** Mat system card — considered-purchase frame. */
export function matCard(mat) {
  const specs = [
    mat.coverageM2 ? `${mat.coverageM2}m² per mat` : "Spec'd per floor plan",
    mat.thicknessMm ? `${mat.thicknessMm}mm` : null,
    mat.approxWeightKg ? `~${mat.approxWeightKg}kg per mat (freight planning figure)` : null,
  ].filter(Boolean);
  return `
  <article class="product-card" data-product-id="${escapeHtml(mat.id)}">
    <div class="product-body">
      <span class="badge">Reference spec — supplier confirmation pending</span>
      <h3>${escapeHtml(mat.name)}</h3>
      <p class="muted">${escapeHtml(mat.blurb)}</p>
      <ul class="spec-list">
        ${specs.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
      </ul>
      <div class="product-meta">
        <span class="mono">${escapeHtml(mat.priceNote)}</span>
      </div>
      <a class="btn-ghost btn-block" href="#mat-enquiry">Get a spec + freight quote</a>
    </div>
  </article>`;
}

/**
 * Authority strip: real proof if any is enabled, otherwise verifiable brand
 * facts. Never renders fabricated endorsements.
 */
export function renderAuthorityStrip(el) {
  if (!el) return;
  const testimonials = activeProof();
  if (testimonials.length) {
    el.innerHTML = testimonials
      .map(
        (p) => `
      <figure class="proof-item">
        <blockquote>${escapeHtml(p.quote)}</blockquote>
        <figcaption class="mono muted">${escapeHtml(p.attribution)}</figcaption>
      </figure>`,
      )
      .join("");
  } else {
    el.innerHTML = brandFacts
      .map((f) => `<span class="fact-chip mono">${escapeHtml(f)}</span>`)
      .join("");
  }
}

/**
 * Enhance capture forms (Formspree AJAX, same pattern as the live homepage
 * form). Fires lead_captured locally on success. Forms MUST carry their own
 * hidden intent/source fields in markup.
 *
 * `onSuccess(form)` (optional) runs after a successful submit — funnel pages
 * use it for funnel-specific events (e.g. seminar_interest_submitted) without
 * duplicating the submit plumbing.
 */
export function enhanceCaptureForms(scope = document, onSuccess = null) {
  scope.querySelectorAll("form[data-capture]").forEach((form) => {
    if (form.dataset.captureEnhanced) return;
    form.dataset.captureEnhanced = "true";
    const status = form.querySelector(".form-status");
    if (status) status.setAttribute("tabindex", "-1");
    let sending = false;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      sending = true;
      const submit = form.querySelector('button[type="submit"]');
      if (status) status.textContent = "Sending…";
      if (submit) submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("submit failed");
        const intent = form.querySelector('input[name="intent"]');
        track(EVENTS.LEAD_CAPTURED, {
          intent: intent ? intent.value : null,
          capture: form.dataset.capture,
        });
        if (typeof onSuccess === "function") onSuccess(form);
        form.reset();
        if (status) {
          status.textContent = form.dataset.successMessage || "Thanks. Your enquiry has been sent.";
          status.focus();
        }
      } catch {
        if (status) {
          status.textContent = "Your message was not sent. Your answers are still here. Please try again.";
          status.focus();
        }
      } finally {
        sending = false;
        form.removeAttribute("aria-busy");
        if (submit) submit.disabled = false;
      }
    });
  });
}

/** Fire product_viewed for a catalogue surface. */
export function trackProductViews(products, surface) {
  products.forEach((p) =>
    track(EVENTS.PRODUCT_VIEWED, { id: p.id, name: p.name, status: p.status, surface }),
  );
}

/** Mobile nav toggle — same interaction pattern as the homepage. */
export function initMobileNav() {
  const btn = document.querySelector(".menu-button");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;
  const desktop = window.matchMedia("(min-width: 981px)");
  function setOpen(open, returnFocus = false) {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.hidden = !open;
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (returnFocus) btn.focus();
  }
  setOpen(false);
  btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      setOpen(false, true);
    }
  });
  desktop.addEventListener("change", () => { if (desktop.matches) setOpen(false); });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setOpen(false)),
  );
}
