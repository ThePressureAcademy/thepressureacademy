/**
 * The Pressure Academy — motion capability gates.
 *
 * Answers one question for the rest of the media layer: is this browser /
 * device / user a place where motion should run at all? Fail-closed: any
 * detection error means "no motion", never a broken page.
 */

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  try {
    return window.matchMedia(REDUCED_QUERY).matches;
  } catch {
    return true; // cannot detect → treat as reduced
  }
}

/** React to the user flipping the OS setting mid-session. */
export function onReducedMotionChange(handler) {
  try {
    const mq = window.matchMedia(REDUCED_QUERY);
    const listener = (e) => handler(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", listener);
    else if (mq.addListener) mq.addListener(listener);
  } catch {
    /* no-op */
  }
}

/**
 * Low-power / constrained-network heuristic. Conservative: any positive
 * signal disables heavy media (video loops), while CSS micro-motion stays.
 */
export function isLowPowerDevice() {
  try {
    const nav = navigator;
    if (nav.connection && nav.connection.saveData) return true;
    if (nav.connection && /(^|-)2g$/.test(nav.connection.effectiveType || "")) return true;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return true;
    return false;
  } catch {
    return true;
  }
}

export function isMobileViewport(breakpointPx) {
  try {
    return window.innerWidth < (breakpointPx || 768);
  } catch {
    return true;
  }
}
