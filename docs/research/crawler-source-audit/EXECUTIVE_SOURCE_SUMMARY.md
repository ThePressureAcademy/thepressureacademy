# EXECUTIVE_SOURCE_SUMMARY

**Crawl pack:** Pressure Blueprint technical upgrade — wrestle-jitsu, front headlock, body-lock / mat return, single-leg, leg-lock systems.
**Audit date:** 2026-05-12
**Auditor scope:** Public-source discovery, provenance classification, copyright-risk audit. Not curriculum drafting.

---

## What was crawled

Lawful, public-web research using `WebSearch` and targeted `WebFetch` (read-only) across seven query clusters defined in the brief:

- **A** Wrestle-jitsu / wrestling-for-BJJ (Daisy Fresh, Tackett brothers, B-Team, Jason Nolf, Simple Man, Danaher)
- **B** Standing-to-ground / front headlock system
- **C** Body lock + mat return
- **D** Single leg / high crotch
- **E** Leg locks (Lachlan Giles, Danaher, Craig Jones / B-Team, basic + intermediate)
- **F** Bilibili (`site:bilibili.com`) provenance scan
- **G** Official-source recovery for Bilibili and other risky hits

**Tooling note.** Apify was specified in the brief but is not connected to this environment. The crawl was executed via Claude Code's `WebSearch` / `WebFetch`. For a future deeper crawl, Apify Actors `apify/google-search-scraper`, `apify/youtube-scraper`, and a Bilibili-capable scraper would extend reach into result-page rank, channel listings, and metadata at scale. The shape of the source pack here is Actor-ready: column-aligned for direct ingest.

**Coverage style.** Breadth-first source discovery across all clusters, not exhaustive harvest. Every accepted source is verifiable. Risky-provenance sources are listed for awareness but not for technical reuse.

---

## Strongest source clusters

1. **Lachlan Giles (Absolute MMA St Kilda) — public leg-lock & passing material.** Active official YouTube channel, free written tutorials, public ADCC 2019 highlight material, lawful public previews. Highest single-instructor signal-to-noise in the leg-lock segment.
2. **B-Team Jiu Jitsu (Austin) official YouTube.** Public training footage, public seminar previews, wrestle-jitsu and front-headlock concept demos. Lawful.
3. **Daisy Fresh / Pedigo Submission Fighting.** Official YouTube + FloGrappling documentary series. Public concept and culture material; the *Daisy Fresh Wrestling Curriculum* itself is **paid** (BJJ Fanatics) and is excluded from technical reuse.
4. **William Tackett (Tackett Jiu Jitsu) official YouTube.** Public rolls, narrated breakdowns, ADCC trials commentary. Good for principle observation.
5. **Andrew Tackett.** Public match footage, public interviews and analysis pieces (FloGrappling, BJJ Hacks, Open Note Grappling). Match observation only — no instructional rip.
6. **Jason Nolf official YouTube.** Free wrestling-for-BJJ seminar-style clips from a 3× NCAA champion.
7. **Simple Man Martial Arts / Simple Man Podcast.** Public vlog and concept content from Ryan / Crelinsten / Rod / Anderson; useful for principle exposure, not for copying.
8. **John Danaher — public concept material only.** Lex Fridman #182 / #328, JRE MMA #11, Jake Shields, ADCC interview. Danaher's *paid* instructionals (`Front Headlock System`, `Enter The System: Leg Locks`, `New Wave Jiu Jitsu`) are **excluded** from technical reuse regardless of where copies are found.
9. **Free aggregator / educational channels.** `bjjuniversity.com`, `bjj.tips`, `evolve-mma.com`, `evolve-university.com`, `bjjsportswear.com`, `submissionsearcher.com`. Useful as cross-reference and theme-mapping anchors; cite carefully, do not lift wording.

---

## Highest-trust public sources (top of bibliography)

- Absolute MMA St Kilda — https://www.youtube.com/@AbsoluteMMAStKilda
- B-Team Jiu Jitsu — https://www.youtube.com/@BTeamJiuJitsu
- Daisy Fresh — https://www.youtube.com/@DaisyFreshUSA
- William Tackett — https://www.youtube.com/@WilliamTackettBJJ
- Jason Nolf — https://www.youtube.com/@Jasonnolfusa
- Simple Man Martial Arts — https://www.youtube.com/@simplemanmartialarts
- Tackett Jiu Jitsu (William Tackett platform) — https://tackettjiujitsu.com/
- BJJ Heroes athlete biographies (background) — https://www.bjjheroes.com/
- FloGrappling *Daisy Fresh* documentary series (FloGrappling-hosted) — https://www.flograppling.com/collections/6751431-daisy-fresh-an-american-jiu-jitsu-story

---

## Excluded / high-risk source clusters

- **All Bilibili uploads of paid courses** — Danaher *Enter The System: Leg Locks*, *Front Headlock System*, *New Wave Jiu Jitsu*; Lachlan Giles *Leg Lock Anthology 50/50*, *Body Lock Pass*, *Half Guard Anthology*; Mikey Musumeci *Death From Below*; etc. These are full-instructional rips of paid product. **Exclude from any reuse.** See `BILIBILI_SOURCE_REGISTER.md`.
- **All BJJ Fanatics product pages** (`bjjfanatics.com/products/...`) — these are paid-instructional sales pages. Allowed as **citation that a body of work exists**; not allowed as a technical source.
- **Submeta course pages** (`submeta.io/@.../courses/...`) — paywalled; allowed as existence-reference only.
- **Long-form transcripts of any paid course**, in any language.
- **Any source whose provenance cannot be traced to the official rights-holder.**

---

## Key technical themes observed across credible public sources

(Repeated independently by ≥3 credible public sources. See `TECHNICAL_THEME_MAP.md` for the cross-reference matrix.)

- Handfighting → snapdown → front headlock as a primary standing-to-ground gateway in modern no-gi BJJ.
- Front headlock as a **system** (guillotine / D'Arce / anaconda / back-take) rather than three separate finishes — reactive chain logic.
- Turtle breakdowns triggered from the front headlock; defensive turtle escape framed as a counter-system.
- Body lock takedown as a high-percentage, low-injury entry for grappler-bodied athletes (vs. explosive double).
- Rear body lock → mat return (knee pinch / knee staple, cross-scissor trip) as a wrestling import that maps cleanly onto no-gi BJJ scoring.
- Single leg head-inside (running-the-pipe family) and single leg head-outside / high-crotch as two distinct lanes with different exposure profiles to guillotine counters.
- Ashi garami family (single-leg-X / outside ashi / inside sankaku-saddle / 50/50) as a position-first framework where the heel hook is one of several finishes, not the sole goal.
- Heel-hook safety culture (no cranking in training, IBJJF brown+/black-belt no-gi only) is consistently emphasized by every reputable public source.
- Leg-lock defense — heel exposure management, defensive grip on the attacker's free leg, hip escape mechanics — taught at least as prominently as offense by Giles, Danaher, and Craig Jones in their public material.

---

## Recommended next use by Codex

1. Use this pack as the **only** approved source list for Pressure Blueprint synthesis on these systems.
2. Treat every BJJ Fanatics / Submeta / Bilibili-rip URL as an **existence reference**, never as a content source. If a theme only appears inside a paid course, mark it as a **gap** and either fill it from a lawful public source or commission original Pressure Academy material.
3. Build the Pressure Blueprint IF→THEN chain language **from first principles informed by the theme map**, not from any single instructor's terminology. Avoid naming systems after their commercial owners (no "Front Headlock System", no "Enter The System", no "Leg Lock Anthology" in Pressure Academy copy).
4. For any heel-hook content authored by Codex, surface the safety culture as a non-optional layer — every public source treats this as load-bearing, and so should the Pressure Blueprint.
5. Re-run cluster G ("official-source recovery") if a future curriculum draft accidentally drifts toward a paid-course-only theme.

---

## Verdict

**CRAWL PACK READY WITH SOURCE GAPS.**

Source gaps to be aware of (see `CODEx_HANDOFF.md` for the full list): public material for *basic* leg-lock instruction by Giles and Danaher is plentiful, but the *intermediate* layer (saddle entries, inside sankaku transition mechanics, ashi-to-ashi switching) is concentrated in paid courses. Codex should plan for original synthesis on those gaps rather than waiting for an unattainable public source.
