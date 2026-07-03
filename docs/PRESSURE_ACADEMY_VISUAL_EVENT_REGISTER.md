# Pressure Academy Visual Event Register

Status: `ACTIVE — VISUAL PERFORMANCE LAYER v1`
Date: 3 July 2026
Sibling of: [PRESSURE_ACADEMY_EVENT_TRACKING_REGISTER.md](./PRESSURE_ACADEMY_EVENT_TRACKING_REGISTER.md)

**Truth first:** no analytics or retention provider is installed. Every event below is emitted through the existing local layer (`js/lib/events.js → track()`), buffers to `window.__tpaEvents`, logs via `console.debug`, and **never leaves the browser**. Sender: `js/lib/media/visual-events.js → trackVisual()`. Payloads are JSON-safe, contain no PII, and carry the standard envelope (`name`, `payload`, `path`, `ts`).

| Event | Trigger | Payload | Routes | Current sender | Future use | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| `visual_asset_requested` | Reserved: a file-based motion asset (Lottie/Fable/WebGL) begins loading. No file-based provider is implemented yet, so this cannot fire today. | `{ key, kind }` | per manifest | none (reserved) | asset delivery monitoring | N/A — reserved, verified absent |
| `visual_asset_loaded` | Reserved: file-based motion asset finished loading. | `{ key, kind }` | per manifest | none (reserved) | asset performance | N/A — reserved, verified absent |
| `visual_asset_failed` | A manifest entry claims `available` but breaches a budget (today: `fileSizeKb` over `maxVideoFileSizeKb`); later also file-load failures. | `{ key, kind, reason }` | any layer route | `media-loader.js` | misconfiguration alerting | code-verified; cannot fire with all-placeholder manifest |
| `video_loop_requested` | A video-loop hook passed every gate and a `<video>` is being created (near viewport). | `{ key, mobile }` | routes with `allowAutoplayVideo` | `video-loops.js` | media engagement | code-verified; QA-verified NOT firing (placeholder manifest) |
| `video_loop_started` | `video.play()` resolved for a governed loop. | `{ key }` | as above | `video-loops.js` | media engagement | code-verified; cannot fire today |
| `video_loop_failed` | Playback/source error or autoplay rejection; element reverts to poster permanently for the session. | `{ key, reason }` | as above | `video-loops.js` | asset health | code-verified; cannot fire today |
| `motion_disabled_reduced_motion` | Page load (or mid-session OS flip) with `prefers-reduced-motion: reduce`. | `{ route }` or `{ midSession: true }` or `{ surface: "video-loops" }` | all layer routes | `motion-controller.js`, `video-loops.js` | a11y-aware design decisions | QA-verified firing under emulated reduced motion |
| `motion_disabled_low_power` | Save-data / 2G / low-memory / low-core device detected; heavy media self-blocks, CSS micro-motion stays. | `{ route, scope: "heavy_media_only" }` or `{ surface: "video-loops" }` | all layer routes | `motion-controller.js`, `video-loops.js` | device-mix insight | code-verified (heuristic device required to observe) |
| `motion_interaction_triggered` | A CSS confirmation asset actually played: capture-success pulse (`lead_captured`), register-panel pulse (`seminar_checkout_unavailable`), or departure fade (`purchase_redirect_started`). | `{ asset, source }` | all layer routes | `motion-controller.js` | micro-reward tuning | QA-verified firing on capture success |

## Rules

- Buffer-only: registering a real sender for these events is a future, separate decision — same seam as commerce events (`registerSender`).
- Do not rename events without updating this register; names are the analytics contract.
- Visual events must never be a prerequisite for commerce events or UI state. The dependency direction is one-way.
- The confirmation-feedback listener registered by `motion-controller.js` via `registerSender` is local plumbing, not an external sender; it reacts only to `lead_captured`, `seminar_checkout_unavailable`, `purchase_redirect_started` and ignores everything else (no recursion: visual events it emits are not in its watch list).
