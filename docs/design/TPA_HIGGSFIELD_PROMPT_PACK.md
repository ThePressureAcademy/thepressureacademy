# The Pressure Academy - Higgsfield Prompt Pack (v1)

Date: 2026-07-13
Status: canonical prompt source for the v1 asset batch. The operator-authored prompts are the source of truth; the "as executed" blocks record exactly what was sent to which model, with every adaptation named and justified. Future batches extend this file.

Models used this batch:

- Stills: `recraft_v4_1`, model_type `standard`, resolution 2k, with the brand palette passed as a hard color constraint: `#0B0809` (charcoal base), `#C45B28` (burnt orange), `#F3D7B2` (sand/cream), `#A08E83` (soft taupe), plus `#F0BF72` (warm gold) on the hero
- Hero loop: `kling3_0_turbo`, 720p, 8 seconds, 16:9, driven from the approved hero still as `start_image` so the website poster is frame zero of the loop. A Higgsfield preset suggestion ("IN THE DARK") was declined; the operator direction is a literal controlled scene, not a stylised preset.

Standing adaptations applied to every operator prompt, with reasons:

1. Palette named as hex values and passed as a model color constraint (brand consistency across the batch).
2. "No readable text" hardened to explicit abstract-marks language (models render gibberish-as-words otherwise; the review gate rejects readable text).
3. "No hands" added everywhere (operator gate rejects uncanny body parts; hands are the highest-risk anatomy).
4. Aspect ratios: one primary ratio generated per asset this batch (16:9 or 4:5). The additional 9:16 and variant ratios in the operator prompts are deferred to the social batch.

## 1. Hero loop

Operator prompt (canonical):

    Create a cinematic 8-second website hero loop for a premium human-performance brand called The Pressure Academy.

    Scene: early morning, dark warm room, a training mat edge, a handwritten planner, a jiu-jitsu belt, kids schoolwork, a water bottle, and a phone showing a readiness-style checklist. Slow controlled camera push-in. Warm cream and burnt orange highlights. Charcoal shadows. Calm intensity. Realistic documentary texture. Premium but grounded. No logos unless provided. No readable fake brand names. No people required. No hype. No neon. No combat violence. No skulls. No blood. No cinematic explosions.

    Mood: discipline before chaos, calm under pressure, systems for real life.
    Aspect ratio: 16:9.
    Style: cinematic, realistic, soft grain, premium editorial.

As executed, step 1 (hero still, doubles as poster and video start frame), `recraft_v4_1` 16:9 2k, job `a5862bab-3629-4192-9654-8177ebe57c80`:

    Realistic editorial photograph, premium website hero scene for a human-performance brand. Early morning in a dark warm room: the edge of a black jiu-jitsu training mat, an open handwritten paper planner, a worn martial-arts belt laid loosely, a child's schoolwork pages stacked neatly, a steel water bottle, and a phone face-up showing only abstract dim checkbox shapes, no legible words. Warm cream and burnt orange window light cutting through charcoal shadows, soft film grain, documentary texture, calm intensity, disciplined and grounded. No people, no faces, no hands, no logos, no readable text anywhere, no neon, no violence, no clutter. Cinematic depth of field, premium and quiet.

As executed, step 2 (motion pass), `kling3_0_turbo` 8s 720p 16:9 with the hero still as `start_image`, job `5d255656-9efd-4c83-ab09-3ada91ce2db2`:

    Ambient cinematic website hero loop. Keep the scene exactly as the start frame: early morning desk with steel water bottle, coiled martial-arts belt, open handwritten planner, phone, stacked papers, warm window light. Motion: an extremely slow, subtle camera push-in of only a few percent, faint dust motes drifting in the warm light beam, the window light very gently shifting warmer. Nothing else changes: no people enter, no hands, no new objects, no text appears, no camera shake, no cuts. Calm intensity, disciplined, quiet. Designed to loop seamlessly as a muted background video.

Adaptation notes: the operator's "slow controlled camera push-in" is kept but constrained to a few percent so the loop restart stays subtle behind the hero scrim.

## 2. Pressure Planner visual

Operator prompt (canonical):

    Create a cinematic visual for Pressure Planner.

    Scene: a desk before sunrise, training gear beside a planner, handwritten readiness notes, sleep and recovery markers, a coffee cup, a phone with a simple scorecard-style interface, and a folded rash guard. The frame should feel like a parent, athlete, or shift worker preparing for a hard day with discipline.

    Palette: charcoal, warm cream, burnt orange, muted sand.
    Mood: clear, grounded, resilient, calm intensity.
    No fake text except simple abstract checkboxes.
    No medical claims.
    Aspect ratio: 4:5 and 9:16 variants.

As executed (4:5 primary; 9:16 deferred to social batch), `recraft_v4_1`, job `d8875c19-1128-47a3-bdd7-71cdaf707188`:

    Realistic editorial photograph for a daily readiness planning product. A desk before sunrise: an open paper planner with handwritten-style abstract marks and simple empty checkboxes, a black coffee cup with faint steam, a folded dark rash guard, training gear beside the desk, a phone showing only a minimal abstract scorecard of dim bars and dots with no legible words. The feeling of a parent, athlete, or shift worker preparing for a hard day with discipline. Palette: charcoal shadows, warm cream highlights, one burnt orange accent, muted sand tones. Soft film grain, calm intensity, grounded, resilient. No people, no faces, no hands, no logos, no readable text, no medical items. Premium quiet still life.

## 3. Mastery Method visual

Operator prompt (canonical):

    Create a premium editorial image for Mastery Method under The Pressure Academy.

    Scene: warm home-learning table, primary-school worksheets, pencils, small progress cards, parent notes, calm natural light, structured but not sterile. The image should feel trustworthy for families and teachers. It should show learning clarity, not pressure or punishment.

    Palette: warm cream, charcoal detail, soft orange accents, natural timber.
    No visible child faces. No fake school logos. No overdone cartoon style.
    Aspect ratio: 16:9 and 4:5 variants.

As executed (16:9 primary; 4:5 deferred), `recraft_v4_1`, job `6290df0c-20d1-40c8-8e40-44930d25204b`:

    Premium editorial photograph of a warm home-learning table for a family education system. Primary-school worksheets with abstract unreadable handwriting marks, sharpened pencils, small blank progress cards arranged in a neat row, a parent's notebook open beside them, natural timber table, calm soft morning light through a window. Structured but warm, trustworthy for families and teachers, learning clarity rather than pressure. Palette: warm cream light, charcoal detail, soft burnt orange accents, natural timber tones. Soft film grain, gentle depth of field. No people, no children, no faces, no hands, no logos, no readable text, no cartoon style. Quiet, orderly, premium.

Adaptation notes: "no visible child faces" widened to no people at all for this batch.

## 4. Pressure Blueprint visual

Operator prompt (canonical):

    Create a cinematic visual for Pressure Blueprint, a grappling and positional-learning system.

    Scene: jiu-jitsu mats, belt, notebook with abstract positional diagrams, tape on fingers, water bottle, quiet post-training light. The image should feel technical, disciplined, and intelligent. No fight scene. No aggression. No blood. No cage. No fake championship claims.

    Palette: black mats, warm cream, burnt orange highlights, subtle grain.
    Mood: precise, calm, tactical, pressure-tested.
    Aspect ratio: 16:9 and 9:16 variants.

As executed (16:9 primary; 9:16 deferred), `recraft_v4_1`, job `47eda281-774f-4593-9b66-1a7f351ce890`:

    Cinematic realistic photograph for a grappling positional-learning system. Black jiu-jitsu mats in quiet post-training light, a worn belt coiled on the mat, an open notebook showing abstract hand-drawn positional diagrams of circles arrows and grids with no legible words, a roll of white finger tape, a steel water bottle. Technical, disciplined, intelligent atmosphere. Palette: black mats, charcoal shadows, warm cream light, burnt orange highlight, subtle film grain. No people, no faces, no hands, no fighting, no aggression, no blood, no cage, no logos, no readable text. Precise, calm, tactical, premium editorial quality.

Adaptation notes: "tape on fingers" became a tape roll as an object (no hands rule).

## 5. AcademyTalon teaser

Operator prompt (canonical):

    Create a cinematic landing-page teaser for AcademyTalon, a combat-sports academy management system in founder testing.

    Scene: jiu-jitsu academy desk, attendance cards, coach notes, grading pathway board, mat grid in background, competition prep checklist, parent communication card. No real faces. No logos unless provided. The image should feel like an academy finally getting operational clarity without losing its coaching soul.

    Palette: charcoal, warm cream, burnt orange, muted canvas.
    Mood: serious, organised, coach-led, parent-safe, performance-aware.
    No AI coach replacement language. No guaranteed wins. No violent imagery.
    Aspect ratio: 16:9.

As executed, attempt 1, `recraft_v4_1` 16:9, job `f93f5cdf-5f6d-4e02-a0bb-3ce0a38faf8e`: REJECTED at the review gate. The render printed a clearly readable "competition preparation" heading plus word-like line items, violating the no-readable-text rule.

As executed, attempt 2 (shipped candidate), job `c75fb93a-bdc6-4311-9358-283c39829a88`, with the checklist sheet removed and all paper forced blank:

    Cinematic realistic photograph of a combat-sports academy front desk, quiet and organised at night. A tidy coach's desk under a warm desk lamp: a dark clipboard holding a completely blank cream sheet, neat rows of small completely blank cream index cards, a wall board behind showing only plain coloured horizontal strips in belt tones from white through blue purple brown to black with no writing, black training mats with subtle grid seams in the soft-focus background. Every paper surface is totally blank, no letters, no words, no numbers, no symbols, no printed characters of any kind anywhere in the frame. Organised, coach-led, calm, performance-aware. Palette: charcoal, warm cream, burnt orange lamp glow, muted canvas. Soft film grain. No people, no faces, no hands, no logos, no typography, no violence. Serious and premium.

## 6. Pressure Tested apparel

Operator prompt (canonical):

    Create a premium product lifestyle visual for Pressure Tested apparel.

    Scene: folded black training shirt, tape-worn hands nearby, belt, gym bag, morning light, subtle sweat and fabric texture, no faces. It should feel earned, disciplined, and real, not fashion-model polished.

    Palette: charcoal, warm cream, burnt orange accent.
    Mood: proof-of-work, understated, resilient.
    Aspect ratio: 4:5.

As executed (4:5), `recraft_v4_1`, job `75164732-5094-4442-a19d-ab497495b168`:

    Premium product lifestyle photograph for a training apparel line. A folded heavyweight black training shirt with visible fabric weave, a worn martial-arts belt beside it, a roll of white athletic finger tape, a dark canvas gym bag, quiet morning light raking across subtle sweat-darkened fabric texture. Earned, disciplined, real, proof-of-work feeling, not fashion-model polished. Palette: charcoal, warm cream light, one burnt orange accent thread of light. Soft film grain, shallow depth of field, understated and resilient. No people, no faces, no hands, no mannequins, no logos, no readable text or lettering on any garment. Premium editorial still life.

Adaptation notes: "tape-worn hands nearby" replaced with the tape roll as an object (no hands rule).

## Deferred to the next batch

- Mats lane still and seminars lane still (so all four commerce tiles gain imagery together)
- 9:16 and 4:5 social variants of every scene
- Social short templates (9:16 reels, LinkedIn squares, landing motion cards, explainer snippets)
- Any people-in-frame direction (requires its own consent-safe rules before prompting)
