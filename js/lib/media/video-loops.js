/**
 * The Pressure Academy — video loop layer (poster-first, fail-closed).
 *
 * Markup contract: an element carries `data-video-loop="<manifest-key>"`.
 * The element IS the poster/fallback surface (gradient or poster image via
 * CSS/markup) and must look premium with no video at all.
 *
 * A <video> is created ONLY when every gate passes:
 *   manifest resolution (media-loader) + route autoplay allowance +
 *   reduced-motion + low-power + per-viewport loop budget + near viewport.
 * On any playback error the element reverts to its poster state permanently
 * for the session. Video never blocks rendering, CTAs, forms, or checkout.
 */

import { visualSystem } from "../../config/visual-system.js";
import { resolveVideoLoop } from "./media-loader.js";
import {
  prefersReducedMotion,
  isLowPowerDevice,
  isMobileViewport,
} from "./reduced-motion.js";
import { VISUAL_EVENTS, trackVisual } from "./visual-events.js";

function buildVideo(entry, useMobileSrc) {
  const video = document.createElement("video");
  video.className = "tpa-video-loop";
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.preload = entry.preload === "metadata" || entry.preload === "auto" ? entry.preload : "none";
  video.poster = entry.poster;
  if (entry.width) video.width = entry.width;
  if (entry.height) video.height = entry.height;
  video.setAttribute("aria-hidden", "true"); // ambient loops are decorative
  video.tabIndex = -1;
  const src = (useMobileSrc && entry.mobileSrc) || entry.src;
  const source = document.createElement("source");
  source.src = src;
  video.appendChild(source);
  return video;
}

function activate(el, entry, key) {
  const useMobileSrc = isMobileViewport(visualSystem.mobileBreakpointPx);
  trackVisual(VISUAL_EVENTS.VIDEO_LOOP_REQUESTED, { key, mobile: useMobileSrc });
  const video = buildVideo(entry, useMobileSrc);

  const fail = (reason) => {
    trackVisual(VISUAL_EVENTS.VIDEO_LOOP_FAILED, { key, reason });
    video.remove();
    el.classList.remove("has-video");
    // Poster/fallback surface is simply what was already there.
  };

  video.addEventListener("error", () => fail("media_error"), { once: true });
  const source = video.querySelector("source");
  if (source) source.addEventListener("error", () => fail("source_error"), { once: true });

  el.classList.add("has-video");
  el.appendChild(video);

  const playAttempt = video.play();
  if (playAttempt && typeof playAttempt.then === "function") {
    playAttempt
      .then(() => trackVisual(VISUAL_EVENTS.VIDEO_LOOP_STARTED, { key }))
      .catch(() => fail("autoplay_rejected"));
  }

  // Pause offscreen, resume near viewport — no wasted decode work.
  const visibility = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!video.isConnected) return visibility.disconnect();
        if (e.isIntersecting) video.play().catch(() => fail("resume_rejected"));
        else video.pause();
      });
    },
    { threshold: 0.05 },
  );
  visibility.observe(el);
}

/**
 * Initialise all `[data-video-loop]` hooks in scope. Safe to call on every
 * page: with placeholder/blocked manifests this resolves to zero network
 * requests and zero DOM changes.
 */
export function initVideoLoops(routeVisual, scope = document) {
  const hooks = scope.querySelectorAll("[data-video-loop]");
  if (!hooks.length) return;

  if (!visualSystem.globalMotionEnabled) return;
  if (!routeVisual || !routeVisual.allowAutoplayVideo) return;
  if (routeVisual.intensity === "minimal") return;
  if (visualSystem.respectReducedMotion && prefersReducedMotion()) {
    trackVisual(VISUAL_EVENTS.MOTION_DISABLED_REDUCED_MOTION, { surface: "video-loops" });
    return;
  }
  if (isLowPowerDevice()) {
    trackVisual(VISUAL_EVENTS.MOTION_DISABLED_LOW_POWER, { surface: "video-loops" });
    return;
  }

  const budget = isMobileViewport(visualSystem.mobileBreakpointPx)
    ? visualSystem.maxMobileVideoLoops
    : visualSystem.maxDesktopVideoLoops;
  if (budget < 1) return;

  let activated = 0;
  const nearViewport = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        nearViewport.unobserve(e.target);
        if (activated >= budget) return;
        const key = e.target.getAttribute("data-video-loop");
        const resolution = resolveVideoLoop(key, window.location.pathname);
        if (!resolution.allowed) return; // placeholder/disabled/missing: silent, zero requests
        activated += 1;
        activate(e.target, resolution.entry, key);
      });
    },
    { rootMargin: "200px 0px" },
  );
  hooks.forEach((el) => nearViewport.observe(el));
}
