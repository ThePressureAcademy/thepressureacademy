/**
 * The Pressure Academy — motion controller (Visual Performance Layer entry).
 *
 * One call per page: initMotion(). It
 *   1. resolves the route's visual posture from js/config/visual-system.js
 *   2. adds `tpa-motion` + `data-visual-intensity` to <html> ONLY when motion
 *      is allowed (global flag on, reduced-motion off) — every motion style in
 *      assets/css/tpa-motion.css is gated behind that class, so no-JS,
 *      failed-JS, reduced-motion, and globally-disabled all land on the same
 *      static baseline (this also fixes the pre-existing no-JS reveal blackout)
 *   3. owns the shared [data-reveal] scroll-reveal observer (replaces the
 *      per-page inline copies)
 *   4. initialises the video loop layer (which applies its own stricter gates)
 *   5. registers a LOCAL event-layer listener that applies CSS confirmation
 *      feedback on capture success / checkout redirect / checkout-unavailable.
 *
 * Checkout, forms, and navigation never depend on anything in this module.
 */

import { visualSystem, resolveRouteVisual } from "../../config/visual-system.js";
import { resolveMotionAsset } from "./media-loader.js";
import { initVideoLoops } from "./video-loops.js";
import {
  prefersReducedMotion,
  onReducedMotionChange,
  isLowPowerDevice,
} from "./reduced-motion.js";
import { VISUAL_EVENTS, trackVisual } from "./visual-events.js";
import { registerSender, EVENTS } from "../events.js";

function motionAllowed() {
  if (!visualSystem.globalMotionEnabled) return false;
  if (visualSystem.respectReducedMotion && prefersReducedMotion()) return false;
  return true;
}

function setMotionState(routeVisual, allowed) {
  const root = document.documentElement;
  root.classList.toggle("tpa-motion", allowed);
  if (allowed) root.setAttribute("data-visual-intensity", routeVisual.intensity);
  else root.removeAttribute("data-visual-intensity");
}

/** Shared scroll reveal — one observer, disabled where the route forbids it. */
function initReveal(routeVisual, allowed) {
  const targets = document.querySelectorAll("[data-reveal]:not(.revealed)");
  if (!targets.length) return;
  if (!allowed || !routeVisual.allowScrollAnimation || !("IntersectionObserver" in window)) {
    // Static baseline: content must simply be visible.
    targets.forEach((el) => el.classList.add("revealed"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  targets.forEach((el) => observer.observe(el));
}

/**
 * CSS confirmation feedback, driven by the existing local event layer.
 * registerSender is local-only plumbing — nothing leaves the browser.
 */
function initInteractionFeedback(allowed) {
  if (!allowed) return;
  const confirm = resolveMotionAsset("cta-confirm", window.location.pathname);
  if (!confirm.allowed) return;
  const pulseClass = confirm.entry.cssClass;

  const pulse = (el, source) => {
    if (!el || !pulseClass) return;
    el.classList.remove(pulseClass);
    // restart the animation if it fires twice on the same element
    void el.offsetWidth;
    el.classList.add(pulseClass);
    trackVisual(VISUAL_EVENTS.MOTION_INTERACTION_TRIGGERED, { asset: "cta-confirm", source });
  };

  registerSender((entry) => {
    if (entry.name === EVENTS.LEAD_CAPTURED) {
      const form = entry.payload && entry.payload.capture
        ? document.querySelector(`form[data-capture="${CSS.escape(entry.payload.capture)}"]`)
        : null;
      pulse(form, entry.name);
    } else if (entry.name === EVENTS.SEMINAR_CHECKOUT_UNAVAILABLE) {
      pulse(document.getElementById("register"), entry.name);
    } else if (entry.name === EVENTS.PURCHASE_REDIRECT_STARTED) {
      document.body.classList.add("tpa-departing");
      trackVisual(VISUAL_EVENTS.MOTION_INTERACTION_TRIGGERED, {
        asset: "cta-departing",
        source: entry.name,
      });
    }
  });
}

/**
 * Page entry point. Idempotent per page load; safe on every commerce page.
 */
export function initMotion() {
  const routeVisual = resolveRouteVisual(window.location.pathname);
  const allowed = motionAllowed();
  setMotionState(routeVisual, allowed);

  if (!allowed && visualSystem.respectReducedMotion && prefersReducedMotion()) {
    trackVisual(VISUAL_EVENTS.MOTION_DISABLED_REDUCED_MOTION, { route: routeVisual.pattern });
  }
  if (allowed && isLowPowerDevice()) {
    // CSS micro-motion stays; heavy media self-blocks in video-loops.js.
    trackVisual(VISUAL_EVENTS.MOTION_DISABLED_LOW_POWER, { route: routeVisual.pattern, scope: "heavy_media_only" });
  }

  initReveal(routeVisual, allowed);
  initVideoLoops(routeVisual);
  initInteractionFeedback(allowed);

  // User flips OS reduced-motion mid-session → drop to static immediately.
  onReducedMotionChange((reduced) => {
    if (reduced && visualSystem.respectReducedMotion) {
      setMotionState(routeVisual, false);
      document.querySelectorAll("[data-reveal]:not(.revealed)").forEach((el) =>
        el.classList.add("revealed"),
      );
      document.querySelectorAll("video.tpa-video-loop").forEach((v) => v.pause());
      trackVisual(VISUAL_EVENTS.MOTION_DISABLED_REDUCED_MOTION, { midSession: true });
    } else if (!reduced && motionAllowed()) {
      setMotionState(routeVisual, true);
    }
  });

  return { routeVisual, motionActive: allowed };
}
