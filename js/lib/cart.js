/**
 * The Pressure Academy — slide-out cart foundation.
 *
 * Client-side cart state (localStorage) + drawer UI. This is the retail
 * foundation that a real checkout provider plugs into. While
 * checkout.provider === "none", the checkout CTA renders an honest gated
 * state — it never pretends payment exists.
 *
 * Pre-order requests go directly to the product or seminar form. Existing
 * cart entries stay on this device and can still be reviewed or edited.
 */

import { checkout } from "../config/commerce.js";
import { formatMoney } from "../config/regions.js";
import { track, EVENTS } from "./events.js";

const KEY = checkout.cartStorageKey;
const listeners = [];

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { items: [], updatedAt: null };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) return { items: [], updatedAt: null };
    return parsed;
  } catch {
    return { items: [], updatedAt: null };
  }
}

function save(cart) {
  cart.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(cart));
  listeners.forEach((fn) => fn(cart));
  renderDrawerContents();
  renderCount();
}

export function getCart() {
  return load();
}

export function addItem({ id, name, variant = null, size = null, priceCents = null, qty = 1 }) {
  const cart = load();
  const matchKey = `${id}|${variant}|${size}`;
  const existing = cart.items.find((i) => `${i.id}|${i.variant}|${i.size}` === matchKey);
  if (existing) existing.qty += qty;
  else cart.items.push({ id, name, variant, size, priceCents, qty });
  save(cart);
  track(EVENTS.ADD_TO_CART, { id, name, variant, size, qty });
  openDrawer();
  return cart;
}

export function removeItem(index) {
  const cart = load();
  cart.items.splice(index, 1);
  save(cart);
  return cart;
}

export function setQty(index, qty) {
  const cart = load();
  if (!cart.items[index]) return cart;
  cart.items[index].qty = Math.max(1, qty);
  save(cart);
  return cart;
}

export function subscribe(fn) {
  listeners.push(fn);
}

function subtotalCents(cart) {
  let known = 0;
  let hasUnknown = false;
  cart.items.forEach((i) => {
    if (i.priceCents == null) hasUnknown = true;
    else known += i.priceCents * i.qty;
  });
  return { known, hasUnknown };
}

/* ---------- Drawer UI ---------- */

let drawerEl = null;
let returnFocus = null;

function drawerMarkup() {
  return `
  <div class="cart-overlay" data-cart-close hidden></div>
  <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" hidden>
    <div class="cart-head">
      <span class="kicker" id="cart-title">${checkout.provider === "none" ? "Saved items" : "Cart"}</span>
      <button type="button" class="cart-x" data-cart-close aria-label="Close cart">&times;</button>
    </div>
    <div class="cart-items" data-cart-items></div>
    <div class="cart-foot">
      <div class="cart-subtotal" data-cart-subtotal></div>
      ${checkout.provider === "none"
        ? '<a class="btn btn-block" href="/shop/">Browse pre-orders</a>'
        : '<button type="button" class="btn btn-block" data-cart-checkout>Checkout</button>'}
      <p class="cart-note" data-cart-note></p>
    </div>
  </aside>`;
}

function renderDrawerContents() {
  if (!drawerEl) return;
  const cart = load();
  const itemsEl = drawerEl.querySelector("[data-cart-items]");
  const subEl = drawerEl.querySelector("[data-cart-subtotal]");
  const btn = drawerEl.querySelector("[data-cart-checkout]");
  const note = drawerEl.querySelector("[data-cart-note]");

  if (!cart.items.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <p><strong>${checkout.provider === "none" ? "No saved items." : "Your cart is empty."}</strong></p>
        <p class="muted">Choose what you’re interested in to send a request.</p>
        <a class="btn-ghost" href="/shop/apparel/#preorder">Request apparel</a>
        <a class="btn-ghost" href="/shop/mats/#mat-enquiry">Request tatami mats</a>
        <a class="btn-ghost" href="/seminars/michael-pixley-march-2027/">Request a seminar or group session</a>
      </div>`;
    subEl.textContent = "";
  } else {
    itemsEl.innerHTML = cart.items
      .map(
        (i, idx) => `
      <div class="cart-line">
        <div class="cart-line-copy">
          <strong>${escapeHtml(i.name)}</strong>
          <span class="muted">${[i.variant, i.size].filter(Boolean).map(escapeHtml).join(" / ") || ""}</span>
          <span class="muted">${i.priceCents != null ? formatMoney(i.priceCents) : "Price to be confirmed"}</span>
        </div>
        <div class="cart-line-actions">
          <button type="button" data-qty-minus="${idx}" aria-label="Decrease quantity">&minus;</button>
          <span aria-label="Quantity">${i.qty}</span>
          <button type="button" data-qty-plus="${idx}" aria-label="Increase quantity">+</button>
          <button type="button" class="cart-remove" data-remove="${idx}" aria-label="Remove item">Remove</button>
        </div>
      </div>`,
      )
      .join("");
    const { known, hasUnknown } = subtotalCents(cart);
    subEl.textContent = hasUnknown
      ? "Subtotal to be confirmed"
      : `Subtotal: ${formatMoney(known)}`;
  }

  if (btn) btn.disabled = cart.items.length === 0;
  note.textContent = checkout.provider === "none"
    ? "We’ll confirm availability and any delivery costs before payment."
    : "";
}

function renderCount() {
  const cart = load();
  const count = cart.items.reduce((n, i) => n + i.qty, 0);
  document.querySelectorAll("[data-cart-open]").forEach((button) => {
    const requestOnly = checkout.provider === "none";
    button.hidden = requestOnly && count === 0;
    button.setAttribute("aria-label", requestOnly ? "Open saved items" : "Open cart");
    const label = button.querySelector("[data-cart-label]");
    if (label) label.textContent = requestOnly ? "Saved items" : "Cart";
  });
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count > 0 ? String(count) : "";
    el.classList.toggle("has-items", count > 0);
  });
}

export function openDrawer() {
  if (!drawerEl || !drawerEl.querySelector(".cart-drawer").hidden) return;
  returnFocus = document.activeElement;
  drawerEl.querySelector(".cart-drawer").hidden = false;
  drawerEl.querySelector(".cart-overlay").hidden = false;
  document.body.classList.add("cart-open");
  drawerEl.querySelector(".cart-x").focus();
}

export function closeDrawer() {
  if (!drawerEl || drawerEl.querySelector(".cart-drawer").hidden) return;
  drawerEl.querySelector(".cart-drawer").hidden = true;
  drawerEl.querySelector(".cart-overlay").hidden = true;
  document.body.classList.remove("cart-open");
  if (returnFocus?.isConnected && !returnFocus.hidden) returnFocus.focus();
  else document.querySelector(".site-header .brand-lockup")?.focus();
  returnFocus = null;
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/** Mount the drawer + wire header cart buttons ([data-cart-open]). */
export function initCart() {
  if (drawerEl) return;
  drawerEl = document.createElement("div");
  drawerEl.className = "cart-root";
  drawerEl.innerHTML = drawerMarkup();
  document.body.appendChild(drawerEl);

  drawerEl.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest("[data-cart-close]")) closeDrawer();
    if (t.dataset.remove != null) removeItem(Number(t.dataset.remove));
    if (t.dataset.qtyMinus != null) {
      const idx = Number(t.dataset.qtyMinus);
      const item = load().items[idx];
      if (item) item.qty <= 1 ? removeItem(idx) : setQty(idx, item.qty - 1);
    }
    if (t.dataset.qtyPlus != null) {
      const idx = Number(t.dataset.qtyPlus);
      const item = load().items[idx];
      if (item) setQty(idx, item.qty + 1);
    }
  });

  document.addEventListener("keydown", (e) => {
    const drawer = drawerEl.querySelector(".cart-drawer");
    if (drawer.hidden) return;
    if (e.key === "Escape") closeDrawer();
    if (e.key !== "Tab") return;
    const controls = drawer.querySelectorAll("button:not(:disabled), a[href]");
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.querySelectorAll("[data-cart-open]").forEach((btn) =>
    btn.addEventListener("click", () => {
      renderDrawerContents();
      openDrawer();
    }),
  );

  // Abandonment hook: page hidden with items in cart → local event only.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      const cart = load();
      if (cart.items.length) {
        track(EVENTS.CART_ABANDONED, {
          itemCount: cart.items.reduce((n, i) => n + i.qty, 0),
        });
      }
    }
  });

  renderDrawerContents();
  renderCount();

  // QA / future-integration handle (documented in QA report).
  window.__tpaCart = { add: addItem, remove: removeItem, setQty, get: getCart, open: openDrawer };
}
