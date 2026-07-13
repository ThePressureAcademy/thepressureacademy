/**
 * The Pressure Academy — visual system manifest (Visual Performance Layer).
 *
 * Single source of truth for motion intensity, video loops, and motion assets.
 * Pages never hardcode media URLs; they reference manifest KEYS and the media
 * layer (js/lib/media/*) resolves them under these rules.
 *
 * TRUTH RULES (do not violate):
 * - `status: "placeholder"` = the slot exists, the asset does NOT. Nothing is
 *   ever requested over the network for a placeholder. `src` stays null.
 * - `status: "disabled"` = asset exists but is switched off. Never requested.
 * - `status: "available"` requires a real, verified file path or URL in `src`.
 *   Do not flip to "available" ahead of the file actually existing — the
 *   loader will request it and the failure event will tell on you.
 * - Checkout, forms, and navigation must remain fully functional with every
 *   entry here deleted. Motion is enhancement, never infrastructure.
 *
 * CACHE RULE: this file is operator-editable and therefore lives under /js/
 * (Vercel default revalidation), NOT /assets/ (immutable, 1 year). Media FILES
 * (mp4/webm/posters) belong under /assets/media/ with versioned filenames
 * (e.g. home-hero-loop-v1.mp4) so the immutable cache works FOR them.
 *
 * Intensity ladder: "minimal" < "standard" < "cinematic" < "experimental".
 * Budgets per intensity are enforced by js/lib/media/motion-controller.js and
 * documented in docs/PRESSURE_ACADEMY_VISUAL_PERFORMANCE_BUDGETS.md.
 */

export const visualSystem = {
  // ── Global switches ───────────────────────────────────────────────────────
  globalMotionEnabled: true, // false = whole site renders static, one flip
  respectReducedMotion: true, // never set false; kept explicit for audits
  maxMobileVideoLoops: 0, // mobile is poster-first until operator raises this
  maxDesktopVideoLoops: 1, // at most one autoplaying loop per route
  mobileBreakpointPx: 768,

  // ── Structural performance budgets (see budgets doc) ────────────────────
  performanceBudgets: {
    maxAutoplayVideosAboveFold: 1,
    maxVideoFileSizeKb: 4000, // reject manifest entries claiming more
    maxMotionAssetSizeKb: 250, // Lottie JSON / SVG budget per asset
    videoRequiresPoster: true,
    initialRenderMayDependOnMedia: false, // hard rule, not a target
  },

  // ── Route visual strategy ─────────────────────────────────────────────────
  // First pattern match wins (test in order). `pattern` is a RegExp source
  // string tested against location.pathname.
  routes: [
    {
      pattern: "^/$",
      intensity: "cinematic",
      heroVideo: "home-hero",
      cardVideos: [],
      motionAssets: ["cta-confirm", "card-lift"],
      allowWebGL: false,
      allowAutoplayVideo: true,
      allowScrollAnimation: true,
      fallbackMode: "static-premium",
    },
    {
      pattern: "^/blueprints/?$",
      intensity: "cinematic",
      heroVideo: null,
      cardVideos: [],
      motionAssets: ["cta-confirm", "card-lift"],
      allowWebGL: false,
      allowAutoplayVideo: true,
      allowScrollAnimation: true,
      fallbackMode: "static-premium",
    },
    {
      pattern: "^/shop(/.*)?$",
      intensity: "standard",
      heroVideo: null,
      cardVideos: [],
      motionAssets: ["cta-confirm", "card-lift"],
      allowWebGL: false,
      allowAutoplayVideo: false,
      allowScrollAnimation: true,
      fallbackMode: "static-premium",
    },
    {
      pattern: "^/seminars(/.*)?$",
      intensity: "standard",
      heroVideo: null,
      cardVideos: [],
      motionAssets: ["cta-confirm", "card-lift"],
      allowWebGL: false,
      allowAutoplayVideo: false, // seminar path carries the money step
      allowScrollAnimation: true,
      fallbackMode: "static-premium",
    },
    {
      pattern: "^/blueprints/.+$",
      intensity: "standard",
      heroVideo: null,
      cardVideos: [],
      motionAssets: ["cta-confirm", "card-lift"],
      allowWebGL: false,
      allowAutoplayVideo: false,
      allowScrollAnimation: true,
      fallbackMode: "static-premium",
    },
    {
      pattern: "^/campaigns/.+$",
      intensity: "standard",
      heroVideo: null,
      cardVideos: [],
      motionAssets: ["cta-confirm"],
      allowWebGL: false,
      allowAutoplayVideo: false,
      allowScrollAnimation: true,
      fallbackMode: "static-premium",
    },
    {
      pattern: "^/academy-orders/?$",
      intensity: "standard",
      heroVideo: null,
      cardVideos: [],
      motionAssets: ["cta-confirm"],
      allowWebGL: false,
      allowAutoplayVideo: false,
      allowScrollAnimation: true,
      fallbackMode: "static-premium",
    },
    {
      pattern: "^/contact/?$",
      intensity: "minimal",
      heroVideo: null,
      cardVideos: [],
      motionAssets: ["cta-confirm"],
      allowWebGL: false,
      allowAutoplayVideo: false,
      allowScrollAnimation: false,
      fallbackMode: "static",
    },
    // /planner and /mastery-method/** are deliberately ABSENT: those
    // subsystems do not load this layer and must not be disturbed.
  ],
  // Unmatched routes get this posture:
  defaultRoute: {
    pattern: null,
    intensity: "minimal",
    heroVideo: null,
    cardVideos: [],
    motionAssets: [],
    allowWebGL: false,
    allowAutoplayVideo: false,
    allowScrollAnimation: false,
    fallbackMode: "static",
  },

  // ── Video loop registry (Higgsfield cinematic loops) ─────────────────────
  // First real loop activated 2026-07-13 (Higgsfield batch v1, prompt pack:
  // docs/design/TPA_HIGGSFIELD_PROMPT_PACK.md). The loader still fail-closes
  // on any entry whose file goes missing; mobile stays poster-first while
  // maxMobileVideoLoops is 0.
  videoLoops: {
    "home-hero": {
      key: "home-hero",
      status: "available", // "placeholder" | "available" | "disabled"
      provider: "local", // "local" | "cloudflare_stream" | "external" | "higgsfield_export"
      src: "/assets/media/tpa-hero-pressure-loop-v1.mp4",
      mobileSrc: null, // mobile never autoplays at current budgets; poster only
      poster: "/assets/media/tpa-hero-pressure-poster-v1.jpg",
      width: 1280,
      height: 720,
      duration: 8, // seconds, from the real export
      fileSizeKb: 3780, // real export size; under the 4000 KB budget
      alt: "Ambient early-morning training-desk loop behind the homepage hero",
      caption: null,
      allowedRoutes: ["^/$"],
      fallbackImage: null, // poster doubles as fallback; separate still optional
      preload: "none", // "none" | "metadata" | "auto"
    },
  },

  // ── Motion asset registry (future Fable 5 / Lottie micro-assets) ─────────
  // css-provider entries are ACTIVE now (they map to classes in
  // assets/css/tpa-motion.css — no file, no network). File-based providers
  // (lottie / fable_export / inline_svg / webgl) stay "placeholder" until a
  // real asset exists AND the loader gains that provider path.
  motionAssets: {
    "cta-confirm": {
      key: "cta-confirm",
      status: "available",
      provider: "css", // "fable_export" | "lottie" | "css" | "inline_svg" | "webgl"
      src: null, // css provider needs no file
      cssClass: "tpa-confirm-pulse",
      trigger: "event", // fires on lead_captured (see visual-events register)
      allowedRoutes: ["^/"], // any commerce route that loads the layer
      fallbackText: null, // form-status copy already confirms in plain text
      fallbackIcon: null,
      reducedMotionBehaviour: "disable", // "disable" | "static" | "fade_only"
    },
    "card-lift": {
      key: "card-lift",
      status: "available",
      provider: "css",
      src: null,
      cssClass: null, // pure hover CSS; controller only gates it via html class
      trigger: "hover",
      allowedRoutes: ["^/"],
      fallbackText: null,
      fallbackIcon: null,
      reducedMotionBehaviour: "disable",
    },
    "seminar-secured": {
      key: "seminar-secured",
      status: "placeholder", // future Fable 5 confirmation moment
      provider: "fable_export",
      src: null,
      cssClass: null,
      trigger: "event",
      allowedRoutes: ["^/seminars/.+$"],
      fallbackText: "Spot registered.",
      fallbackIcon: null,
      reducedMotionBehaviour: "static",
    },
    "mat-calc-reveal": {
      key: "mat-calc-reveal",
      status: "placeholder", // future micro-reward on calculator result
      provider: "lottie",
      src: null,
      cssClass: null,
      trigger: "event",
      allowedRoutes: ["^/shop/mats/?$"],
      fallbackText: null,
      fallbackIcon: null,
      reducedMotionBehaviour: "disable",
    },
  },

  // ── Global fallback policy ────────────────────────────────────────────────
  fallbacks: {
    onVideoError: "poster", // failed video reverts to poster/gradient, no retry loop
    onAssetMissing: "silent", // fail silent; console.warn in dev only
    onBudgetExceeded: "skip", // asset over budget is skipped, page renders on
  },
};

/**
 * Resolve the route visual config for a pathname. Pure; safe defaults.
 */
export function resolveRouteVisual(pathname) {
  const path = typeof pathname === "string" && pathname ? pathname : "/";
  for (const route of visualSystem.routes) {
    try {
      if (new RegExp(route.pattern).test(path)) return route;
    } catch {
      // Malformed operator pattern must never break a page.
    }
  }
  return visualSystem.defaultRoute;
}

export function getVideoLoop(key) {
  return (key && visualSystem.videoLoops[key]) || null;
}

export function getMotionAsset(key) {
  return (key && visualSystem.motionAssets[key]) || null;
}
