/**
 * The Pressure Academy — media manifest resolver.
 *
 * The ONLY module allowed to decide whether a manifest entry may load.
 * Guards (all fail-closed):
 *   - placeholder / disabled entries never produce a loadable resolution
 *   - "available" without a real src/poster resolves to blocked (+ dev warn)
 *   - entries not allowed on the current route resolve to blocked
 *   - entries over the declared performance budget resolve to blocked
 * Nothing here touches the network; it returns decisions that video-loops.js
 * and motion-controller.js act on.
 */

import { visualSystem, getVideoLoop, getMotionAsset } from "../../config/visual-system.js";
import { VISUAL_EVENTS, trackVisual, devWarn } from "./visual-events.js";

function blocked(kind, key, reason) {
  devWarn(`${kind} "${key}" blocked: ${reason}`);
  return { allowed: false, reason, entry: null };
}

function routeAllowed(entry, pathname) {
  const list = entry.allowedRoutes || [];
  return list.some((p) => {
    try {
      return new RegExp(p).test(pathname);
    } catch {
      return false;
    }
  });
}

/**
 * Resolve a video loop key to a load decision for the current route.
 * A `true` resolution means: real src, real poster, route-allowed, on budget.
 */
export function resolveVideoLoop(key, pathname) {
  const entry = getVideoLoop(key);
  if (!entry) return blocked("video-loop", key, "not_in_manifest");
  if (entry.status === "placeholder") return blocked("video-loop", key, "placeholder");
  if (entry.status === "disabled") return blocked("video-loop", key, "disabled");
  if (entry.status !== "available") return blocked("video-loop", key, `unknown_status:${entry.status}`);
  if (!entry.src || typeof entry.src !== "string")
    return blocked("video-loop", key, "available_without_src");
  if (visualSystem.performanceBudgets.videoRequiresPoster && !entry.poster)
    return blocked("video-loop", key, "available_without_poster");
  if (!routeAllowed(entry, pathname)) return blocked("video-loop", key, "route_not_allowed");
  if (
    entry.fileSizeKb != null &&
    entry.fileSizeKb > visualSystem.performanceBudgets.maxVideoFileSizeKb
  ) {
    trackVisual(VISUAL_EVENTS.VISUAL_ASSET_FAILED, { key, kind: "video", reason: "over_budget" });
    return blocked("video-loop", key, "over_budget");
  }
  return { allowed: true, reason: null, entry };
}

/**
 * Resolve a motion asset key. Only the "css" provider is executable today —
 * file-based providers (lottie / fable_export / inline_svg / webgl) resolve
 * to blocked until a real asset exists and a provider path is implemented.
 * That is deliberate: no dependency is added ahead of a real file.
 */
export function resolveMotionAsset(key, pathname) {
  const entry = getMotionAsset(key);
  if (!entry) return blocked("motion-asset", key, "not_in_manifest");
  if (entry.status === "placeholder") return blocked("motion-asset", key, "placeholder");
  if (entry.status === "disabled") return blocked("motion-asset", key, "disabled");
  if (entry.status !== "available") return blocked("motion-asset", key, `unknown_status:${entry.status}`);
  if (!routeAllowed(entry, pathname)) return blocked("motion-asset", key, "route_not_allowed");
  if (entry.provider !== "css") {
    // A real file-based asset also needs a loader path, which lands together
    // with the first real asset (architecture doc §"Adding the first Fable 5
    // asset"). Until then: honest block, static fallback stays.
    return blocked("motion-asset", key, `provider_not_implemented:${entry.provider}`);
  }
  return { allowed: true, reason: null, entry };
}
