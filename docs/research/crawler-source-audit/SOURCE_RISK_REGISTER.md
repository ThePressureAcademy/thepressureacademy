# SOURCE_RISK_REGISTER

Risk-classified register for every source surfaced by the crawl that is **not unambiguously low-risk**. Low-risk official channels and accepted free aggregator sources are recorded in `SOURCE_BIBLIOGRAPHY.md`. This document is the cleanup ledger.

Actions: `accept` · `accept with caution` · `use for lead discovery only` · `exclude` · `replace with official source`

---

## High-risk: paid commercial instructionals (sales pages)

| Source | Risk | Reason | Action |
|---|---|---|---|
| bjjfanatics.com/products/the-front-headlock-system-by-john-danaher | High | Paid course; copyright-protected | exclude (existence ref only) |
| bjjfanatics.com/products/systematically-attacking-the-front-headlock-by-gordon-ryan | High | Paid course | exclude |
| bjjfanatics.com/products/the-foundation-of-defense-turtle-front-headlock-escapes-by-gordon-ryan | High | Paid course | exclude |
| bjjfanatics.com/products/only-way-out-front-headlock-and-turtle-escapes-by-brian-glick | High | Paid course | exclude |
| bjjfanatics.com/products/strangles-turtle-breakdowns-bjj-fundamentals-go-further-faster-by-john-danaher | High | Paid course | exclude |
| bjjfanatics.com/products/leg-lock-anthology-50-50-by-lachlan-giles | High | Paid course | exclude |
| bjjfanatics.com/products/the-body-lock-pass-by-lachlan-giles | High | Paid course | exclude |
| bjjfanatics.com/products/no-gi-open-guard-volume-3-rdlr-leg-entanglements-by-lachlan-giles | High | Paid course | exclude |
| bjjfanatics.com/products/no-gi-open-guard-volume-1-k-guard-by-lachlan-giles | High | Paid course | exclude |
| bjjfanatics.com/products/daisy-fresh-white-belt-wrestling-curriculum-by-alejandro-wajner-and-heath-pedigo | High | Paid course | exclude |
| bjjfanatics.com/products/daisy-fresh-wrestling-blue-belt-curriculum-by-heath-pedigo | High | Paid course | exclude |
| bjjfanatics.com/products/the-daisy-fresh-curriculum-white-belt-bundle-by-heath-pedigo | High | Paid course bundle | exclude |
| bjjfanatics.com/products/the-daisy-fresh-curriculum-blue-belt-stripe-4-by-heath-pedigo | High | Paid course | exclude |
| bjjfanatics.com/products/the-daisy-fresh-curriculum-blue-belt-stripe-4-gi-by-heath-pedigo | High | Paid course | exclude |
| bjjfanatics.com/products/geekological-approach-introduction-to-jiu-jitsu-daisy-fresh-style-by-heath-pedigo | High | Paid course | exclude |
| bjjfanatics.com/products/battle-tested-down-under-leglocks-by-craig-jones | High | Paid course | exclude |
| bjjfanatics.com/products/systematic-submission-dilemmas-high-level-triangle-and-leg-lock-combos-by-craig-jones | High | Paid course | exclude |
| submeta.io/@lachlangiles/courses/front-headlock | High | Paid course | exclude |
| submeta.io/@lachlangiles/courses/saddle | High | Paid course | exclude |
| submeta.io/@lachlangiles/courses/straight-ankle-lock | High | Paid course | exclude |
| submeta.io/@lachlangiles/courses/advanced-leg-lock-strategy | High | Paid course | exclude |
| tomhalpinbjj.com/courses/frontheadlock | High | Paid coach course | exclude |
| warriorcollective.co.uk/products/the-front-headlock-system-bolt-wrestling-for-bjj-and-mma-with-kenny-johnson | High | Paid coach course | exclude |
| tackettjiujitsu.com (course area) | Med | Paid online platform; the public homepage is fine to cite, the lessons are not | use for lead discovery only |
| flograppling.com (subscription-gated videos) | Med | Mixed free + paid; some matches gated | accept with caution — cite the match URL, never copy paywalled content |

## High-risk: Bilibili reposts of paid courses

See full ledger in `BILIBILI_SOURCE_REGISTER.md`. Summary:

| Source pattern | Risk | Reason | Action |
|---|---|---|---|
| Any Bilibili upload whose title matches a known commercial product name | High | Pirated rip | exclude |
| Bilibili reposts of free YouTube clips from official channels | Med | Provenance laundering; better source available | replace with official source (cite YouTube original) |
| Bilibili-hosted competition footage (WNO, ADCC, Enigma, IBJJF) | High | Reposted without rights | replace with official source (FloGrappling / IBJJF / event host) |
| Bilibili-hosted seminar reposts | Med | Provenance unverified | use for lead discovery only |

## Medium-risk: provenance-ambiguous YouTube uploads

| Source | Risk | Reason | Action |
|---|---|---|---|
| "The Easiest Jiu Jitsu No Gi Takedowns by John Danaher" (https://www.youtube.com/watch?v=-rC5-LeRu2o) | Med | Free promo excerpt of a paid course; uploader provenance must be verified per session | use for lead discovery only |
| "How To Do A Jiu Jitsu Leg Lock Entry & Takedown By Craig Jones" (https://www.youtube.com/watch?v=YVSAq4Ux7hI) | Med | Same — free excerpt of a paid course | use for lead discovery only |
| BJJ Systems "Front Headlocks Flowchart v1" (https://bjjsystems.com/blog/2020/01/26/john-danaher-enter-the-system-front-headlock-flowchart-v1/) | Med | Editorial flowchart explicitly derived from a paid Danaher course | accept with caution — read for concept only; do not copy the flowchart structure |
| BJJ-World *Leg Lock Anthology 50/50 Review* | Med | Review of a paid course; lawful but biased toward course content | accept with caution |
| Multi-uploader "Front Headlock" YouTube playlist (https://www.youtube.com/playlist?list=PLqne-5xftWGTBp5w4DrHJ_dfdHQudqpEB) | Med | Aggregator playlist; some videos may be paid-course rips | accept with caution — vet each video individually |
| Random editorial channels with paid-course excerpts in title | Med | Possible TOS violation by uploader | use for lead discovery only |

## Low-risk caveats on otherwise-accepted sources

| Source | Caveat | Action |
|---|---|---|
| Evolve Daily / Evolve University blog | Editorial; phrasing often closely follows course terminology | accept — do not lift wording verbatim |
| BJJ University, BJJ.tips, Submission Searcher, BJJ-EE | Aggregators of mostly-free clips, but they sometimes embed paid-course trailers | accept — cite the underlying video, not the aggregator wrapper |
| Wikipedia bios | Generally reliable for dates and bouts; weaker on technique framing | accept — bio/background only |
| FloGrappling editorial articles | Lawful, well-sourced | accept |
| Sensō Jiu Jitsu / Graciemag editorial | Lawful | accept |

## False positives flagged during the crawl

| Result | Reason flagged | Resolution |
|---|---|---|
| "Jason Wolf wrestle jitsu" search results | "Jason Wolf" returned results for **Jason Nolf** (3× NCAA champ, BJJ crossover) and an unrelated *Jason Christoff* mind-control video | Treat as a typo cluster; use **Jason Nolf** as the canonical name. |
| Sequence "Lauchlin Giles" | Misspelling of **Lachlan Giles** | Use **Lachlan Giles** as canonical; the alternate spelling produced the same source set. |
| TikTok "Andrew Tackett Jiu Jitsu" discover page | TikTok aggregation pages have no clear uploader provenance | exclude |
| TikTok "Ill Wrestle Ya Josh Wolf" | Unrelated content | exclude |
| Tom Hardy training with Heath Pedigo (YouTube video) | Lawful and public, but tangential to systems audit | accept with caution — culture material only |
| "The Hidden Mind Control System Running the World — Jason Christoff" | Off-topic; surfaced via false-positive on "Jason Wolf" | exclude |
| `community.tubebuddy.com` forum post by a small wrestling/grappling YouTuber | Self-promotional forum post; uploader not vetted | exclude |

---

## Net risk picture

- **Heavy paid-course bias in the leg-lock segment.** Most named-system leg-lock material lives behind BJJ Fanatics / Submeta paywalls. This is unavoidable given the commercial structure of the sport. The audit relies on Giles' free YouTube content + Evolve / BJJ Sportswear / Submission Searcher aggregators for theme coverage.
- **Bilibili is structurally hostile to clean provenance.** Every meaningful Bilibili hit was either a paid-course rip (exclude) or a free-clip repost (replace with official). Bilibili adds zero unique authoritative source value to this audit.
- **Daisy Fresh's public footprint is documentary-led; their technical curriculum is commercial.** This means the **culture** material is highly usable, the **systems** material is not.
- **Heel-hook safety messaging is consistent and copyright-safe** — multiple independent free sources establish the safety culture; Pressure Blueprint can synthesize this without leaning on any single one.
