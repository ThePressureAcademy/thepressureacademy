/**
 * The Pressure Academy — visual layer events.
 *
 * Composes the existing retention event layer (js/lib/events.js): every
 * visual event goes through the same track() and buffers ONLY to
 * window.__tpaEvents. Nothing leaves the browser — no provider is installed.
 *
 * Names are the contract for future analytics/Klaviyo wiring — do not rename
 * without updating docs/PRESSURE_ACADEMY_VISUAL_EVENT_REGISTER.md.
 */

import { track } from "../events.js";

export const VISUAL_EVENTS = Object.freeze({
  VISUAL_ASSET_REQUESTED: "visual_asset_requested",
  VISUAL_ASSET_LOADED: "visual_asset_loaded",
  VISUAL_ASSET_FAILED: "visual_asset_failed",
  VIDEO_LOOP_REQUESTED: "video_loop_requested",
  VIDEO_LOOP_STARTED: "video_loop_started",
  VIDEO_LOOP_FAILED: "video_loop_failed",
  MOTION_DISABLED_REDUCED_MOTION: "motion_disabled_reduced_motion",
  MOTION_DISABLED_LOW_POWER: "motion_disabled_low_power",
  MOTION_INTERACTION_TRIGGERED: "motion_interaction_triggered",
});

export function trackVisual(name, payload = {}) {
  return track(name, payload);
}

/**
 * Dev-only diagnostics. Production visitors get silence; local preview and
 * ?tpaDebug=1 get console.warn so asset misconfiguration is visible in QA.
 */
export function isDevContext() {
  try {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return true;
    return new URLSearchParams(window.location.search).has("tpaDebug");
  } catch {
    return false;
  }
}

export function devWarn(...args) {
  if (isDevContext()) console.warn("[tpa-visual]", ...args);
}
