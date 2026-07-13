# The Pressure Academy - Higgsfield Visual Direction

Date: 2026-07-13
Status: governing direction for all Higgsfield-generated media on thepressureacademy.com
Owner: operator (Cody). Agents extend this document; they do not fork it.

This is a brand and media-direction system, not an AI-video experiment. Every generated asset must survive the review gate in this document before it ships.

## Strategic boundary

Use Higgsfield-generated media for:

- hero video loops
- brand motion scenes
- social short-form content
- product explainer clips
- cinematic section backgrounds
- academy and event hype reels
- Pressure Planner visual metaphors
- AcademyTalon combat-adjacent visuals (operational clarity, never violence)
- Mastery Method parent and child learning visuals (no child faces)

Never use generated media for:

- fake testimonials
- fake customers
- fake class footage presented as real
- fake children, or any real-person likeness without consent
- misleading competition footage
- anything that implies guaranteed results
- legal, medical, or trauma-related content

## Brand separation

The Pressure Academy must not look like Pressure Systems. Pressure Systems is the controlled B2B operating layer. The Pressure Academy feels like: human pressure, discipline, family, training, combat readiness, learning, routine, resilience, calm intensity.

## The visual formula

- dark cinematic base (site token `#0B0809`)
- warm cream typography and paper surfaces (`#F3D7B2` family)
- burnt orange pressure accents (`#C45B28`, glow `#F0BF72`)
- soft film grain
- training-floor texture and mat-grid geometry
- family and home-discipline objects (planner, schoolwork, coffee, gear)
- combat readiness without combat (belts, tape, mats; never fights)
- learning clarity
- morning-routine energy

Avoid: generic AI warrior imagery, blood, skulls, cage-fight cliches, overdone samurai imagery, neon gym branding, fake luxury motivation sludge, crypto-dashboard visuals, childlike education graphics.

## Review gate (every asset, before implementation)

Reject an asset if any of the following appear:

1. Readable text of any kind (real or gibberish rendered as words), fake brand names, fake logos
2. Faces or people (current pass is object-scene only; people require a separate consent-safe direction)
3. Uncanny anatomy (hands especially), impossible objects, damaged geometry
4. A scene that implies an unverified claim (real classes, real customers, competition results)
5. Palette drift away from the formula above
6. Anything that reads synthetically cheap at a glance

One regeneration per failed asset, with the defect named in the prompt. If it fails twice, drop the slot and note it in the asset manifest rather than shipping a weak asset.

## Placement hierarchy (site implementation)

- Hero: exactly one lightweight compressed loop, poster-first, desktop only, governed by the visual-system manifest
- Section cards: stills (hover loops only as a future governed step)
- Mobile: still images only; `maxMobileVideoLoops` stays 0 until the operator raises it
- Social: full vertical motion assets, generated from this same direction

Technical rules (enforced by `js/config/visual-system.js` and the media layer):

- compress aggressively; hero loop must stay under the 4000 KB manifest budget
- poster image required before any video entry flips to available
- lazy-load video; `preload="none"`; near-viewport activation only
- respect `prefers-reduced-motion` (loader gate plus CSS hard stop)
- no autoplay audio, ever (loops are muted and `aria-hidden`)
- initial render must never depend on media
- WebM plus MP4 dual-serve is a future step; current pipeline ships MP4 only (no local transcode toolchain); revisit when a transcode step exists
- new media files live under `/assets/media/` with versioned filenames so the immutable cache works for them; never mutate an existing filename's content

## Asset naming

    tpa-hero-pressure-loop-v1.mp4
    tpa-hero-pressure-poster-v1.jpg
    pressure-planner-readiness-v1.jpg
    mastery-method-home-learning-v1.jpg
    pressure-blueprint-grappling-v1.jpg
    academytalon-founder-testing-v1.jpg
    pressure-tested-apparel-v1.jpg

Version suffix increments on any regeneration that ships. Old versions stay in git history, not in the live tree.

## Copy boundaries that ride with the visuals

- AcademyTalon is described only as "in founder testing". No "live academy OS" language until verified.
- No guaranteed performance, no mental-health treatment claims, no educational-outcome claims beyond the source-of-truth curriculum.
- No em dashes in authored copy.
