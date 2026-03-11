#v3.2 — The Pressure Academy

**Version:** 3.2 | **Date:** 7 March 2026 |
**Owner:** Cody Raymond (Business Director)

---

## 0. TL;DR — CURRENT STATE

Website v8.2 is deployment-ready. The Planner React app draft exists. Cody flies to Thailand today.

**Deploy now (2 files):** `index.html` + `privacy-policy.html`
**Deploy later (Phase 1):** `PressurePlanner.jsx` via Vite + Capacitor

### What v8.2 Includes
- GSAP ScrollTrigger + Lenis smooth scroll
- Hero word-split animation + counter animations
- Interactive Blueprint modal (click loop steps → detail panel)
- Interactive Mastery Method modal (click pillars → detail panel)
- Scroll-triggered phone mockup (ring + sliders animate on view)
- 7 sections: Hero, Ecosystem, Planner, Blueprint, Mastery Method, Testimonials, Email CTA
- Formspree `meerjgde` LIVE
- Privacy policy with APPs Act compliance
- WCAG 2.1 AA: skip link, focus-visible, prefers-reduced-motion, semantic landmarks

### What Changed From v8.1 → v8.2 (Kimi Build)
- Added interactive Blueprint detail panel (click any loop step)
- Added interactive Mastery Method detail panel (click any pillar)
- Updated 6 variables: Sleep, **Stress**, Training, Nutrition, **Hydration**, Family (was Mood/Energy)
- Testimonials section refined with compliance label
- All `href="#"` links fixed
- Blueprint card icon nodes corrected to rust/amber only

### What Opus Primary Fixed in Kimi's Build
- Phone slider colours: Stress was teal (#4A9B8E) → fixed to #E8734A (warm). Hydration was green (#5BA85B) → fixed to #D4915C (amber). **Patch 3.1 violation resolved.**

---

## 1. DEPLOYMENT FILES

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| `index.html` | 1698 | 76KB | Main website — all sections, animations, interactive features |
| `privacy-policy.html` | 162 | 5.5KB | Privacy policy with APPs Act compliance |
| `PressurePlanner.jsx` | 631 | 39KB | React Planner app draft (NOT deployed yet — Phase 1) |

---

## 2. DEPLOYMENT STEPS (Do This Now)

### Step 1: Create New Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your renamed GitHub repo
3. Framework Preset: **Other**
4. Root Directory: wherever you put the files (repo root or subfolder)
5. Deploy

### Step 2: Add Domains
In Vercel → Settings → Domains:
- Add `thepressureacademy.com` → Production, no redirect
- Add `www.thepressureacademy.com` → 308 Permanent Redirect → `thepressureacademy.com`

### Step 3: DNS (Already Done)
Your nameservers are already at Vercel:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Vercel auto-creates ALIAS records. No registrar changes needed.

### Step 4: Upload Files
In your GitHub repo, upload:
1. `index.html`
2. `privacy-policy.html`

Commit message: `v8.2 FINAL: Interactive Blueprint + MM, GSAP+Lenis, Formspree live`

### Step 5: Verify
- [ ] Hero text animates word by word
- [ ] Smooth scroll (buttery feel)
- [ ] Phone mockup ring + sliders animate on scroll
- [ ] Click Blueprint loop step → detail panel opens
- [ ] Click Mastery Method pillar → detail panel opens
- [ ] Email form → test submit → check Formspree dashboard
- [ ] Privacy Policy link in footer → opens policy page
- [ ] Mobile: hamburger menu, all sections readable

---

## 3. STRATEGIC RATING — v8.2

### IF→THEN Grading (30 points)

| Category | Score | Notes |
|----------|-------|-------|
| Brand Correctness | 6/6 | All logos, names, colours correct. Patch 3.1 compliant. |
| Technical Quality | 7/8 | Strong a11y, SEO, structure. Minor: apple-touch-icon.png still referenced but not provided. |
| Content Completeness | 7/8 | All sections present + interactive. Missing: real testimonials (placeholder is honest). |
| Animation & Polish | 5/8 | GSAP + Lenis integrated, hero word-split, scroll triggers. Still needs section transitions and parallax depth. |

**Total: 25/30** — Up from 19.5 (v8.0). Ready for production.

### Competitive Position
| vs Competitor | TPA v8.2 Status |
|---|---|
| GrapplingAI | ✅ Matches on animation quality. Exceeds on lifestyle features. |
| JitsAI | ✅ Exceeds on website quality. Different positioning (builders vs gamers). |
| BJJ Notes | ✅ Exceeds on interactive features (Blueprint/MM modals). |
| Jitzio | ✅ Exceeds on brand depth and ecosystem presentation. |

---

## 4. PLANNER APP REVIEW

**File:** `PressurePlanner.jsx` (631 lines)
**Status:** Draft — functional React component, NOT deployment-ready yet

### What Works
- 7 screens: Today, Log, Blueprint, Journal, Timer, Coach, Settings
- Onboarding flow with goal selection (BJJ, Fitness, Family, Business, Learning, Mental Health)
- Sport-agnostic: BJJ tabs only show when BJJ goal is selected
- 6-variable scoring (Sleep, Stress, Training, Nutrition, Hydration, Family)
- Shift detection (rotating, day-only, night-only, off)
- Date navigation with proper UTC handling
- localStorage persistence (offline-first)
- Score ring with band system (Pressure Tested → System Down)
- 7-day trend chart
- Non-negotiables checklist (shift-aware)
- Journal with searchable entries
- Interval timer for rounds

### Issues Found
1. **localStorage in artifacts** — Won't work in Claude.ai preview (artifacts block localStorage). Works fine in production Vite build.
2. **Coach screen** — Uses simulated AI responses, not real API. Acceptable for MVP.
3. **No default export on last line** — needs `export default PressurePlanner;` (checking...)
4. **Blueprint screen** — Basic placeholder, needs full positional loop integration from curriculum.json

### Deployment Path (Phase 1)
```
PressurePlanner.jsx → Vite project → npm run build → Capacitor → Android APK → Play Store
```
This is a Phase 1 task (Weeks 3-8 per Master Roadmap). Not today's deploy.

---

## 5. AGENT TEAM STATUS

| Agent | Status | Last Contribution |
|-------|--------|-------------------|
| **Opus Primary (me)** | ✅ ACTIVE | Reviewed v8.2, fixed patch 3.1 violations, deployment prep |
| **Kimi 2.5** | Built v8.2 | Interactive Blueprint/MM modals, privacy policy, a11y fixes, 6-variable update |
| **Opus Agent 002** | Contributed | Planner JSX draft, data architecture, variable naming |
| **Openclaw Agent 001** | ❌ DISCONNECTED | Needs reconnection for Drive file management |

### Team Performance on v8.2
- **Kimi:** 8/10 — Strong interactive build. Caught a11y gaps. One patch 3.1 colour violation (phone sliders).
- **Agent 002:** 7/10 — Good Planner architecture. Sport-agnostic support. Blueprint screen needs depth.
- **Combined:** Quality is high. Cross-agent validation works — Opus Primary catches what others miss, others catch what Opus misses.

---

## 6. THAILAND TRIP CHECKLIST

### Before You Board
- [ ] Deploy v8.2 (Steps 1-5 above)
- [ ] Verify site loads on mobile
- [ ] Test email signup
- [ ] Screenshot the live site (proof of milestone)

### While at Camp (Content Ops)
- Reference: `THAILAND-CAMP-CONTENT-OPS-v2.md`
- 5 clips/day minimum
- Daily Planner log captures (screen recordings for marketing)
- Hero photo captures for website triptych replacement
- Use reel format templates (5 formats, 7-day rotation)

### When You Return
- Phase 1 begins: Android build from PressurePlanner.jsx
- Kimi edits Thailand content for 90-day posting schedule
- Agent 002 deepens Blueprint curriculum data

---

## 7. FILE INVENTORY (Complete)

### Deploy Now
| File | Status |
|------|--------|
| index.html (v8.2) | ✅ Deployment-ready |
| privacy-policy.html | ✅ Deployment-ready |

### Deploy Phase 1
| File | Status |
|------|--------|
| PressurePlanner.jsx | ⏳ Draft — needs Vite project wrapper |

### System Documents (Reference — do NOT deploy)
| Document | Purpose |
|----------|---------|
| CROSS-AI-ALIGNMENT-v3.2.md | THIS FILE — agent briefing |
| GAMIFICATION-SYSTEM-v1.md | XP, missions, badges spec |
| PRESSURE-BLUEPRINT-UNIFIED-v3.md | Curriculum architecture |
| MASTER-ROADMAP.md | 4-phase execution plan |
| THAILAND-CAMP-CONTENT-OPS-v2.md | Content acquisition system |

---

*Deploy the site. Fly to Thailand. Capture content. Trust the system. The agents will be here when you get back.*
