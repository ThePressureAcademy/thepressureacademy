# TPA Deployment Checklist

## Pre-deployment verification

### Asset paths (all must return 200)
- [ ] `/assets/logos/TPA_House_Mark.svg`
- [ ] `/assets/logos/TPA_House_Mark_mono.svg`
- [ ] `/assets/logos/TPA_House_Favicon.svg`
- [ ] `/assets/logos/Pressure_Planner_Mark.svg`
- [ ] `/assets/logos/Pressure_Planner_Mark_mono.svg`
- [ ] `/assets/logos/Pressure_Blueprint_Mark.svg`
- [ ] `/assets/logos/Pressure_Blueprint_Mark_mono.svg`
- [ ] `/assets/logos/Pressure_Tested_Mark.svg`
- [ ] `/assets/logos/Pressure_Tested_Mark_mono.svg`
- [ ] `/assets/logos/Mastery_Method_Mark.svg`
- [ ] `/assets/logos/Mastery_Method_Mark_mono.svg`
- [ ] `/assets/logos/Pressure_Over_Force_Mark.svg`
- [ ] `/assets/logos/Pressure_Over_Force_Mark_mono.svg`
- [ ] `/assets/social/TPA_OG_1200x630.png`

### Pages
- [ ] `/` serves `index.html`
- [ ] `/privacy-policy.html` serves privacy policy
- [ ] Privacy policy link in footer works
- [ ] "Back to Home" from privacy page works

### Visual checks
- [ ] Header logo visible
- [ ] Ecosystem section logos (all 6 nodes) visible
- [ ] Section logos visible (Planner, Blueprint, Mastery, Proof, Join)
- [ ] Footer logo visible
- [ ] Favicon appears in browser tab

### Functional checks
- [ ] Planner sliders respond and update score
- [ ] Shift mode pills (Day/Night/Rotating) switch
- [ ] Persona buttons filter ecosystem
- [ ] Blueprint loop autoplay starts from Step 1
- [ ] Chain visualisation highlights correct paths
- [ ] Mastery tabs switch content
- [ ] Proof wall filter works
- [ ] Mobile menu opens and closes
- [ ] Smooth scroll between sections works
- [ ] Form submission sends to Formspree

### SEO checks
- [ ] OG preview shows image when shared
- [ ] Canonical URL resolves
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] JSON-LD structured data present

### Performance
- [ ] No 404 errors in console
- [ ] No JS errors in console
- [ ] GSAP loads from CDN (graceful fallback if blocked)
- [ ] Google Fonts load

## Post-deployment
- [ ] Test from incognito/private browser
- [ ] Test on mobile device
- [ ] Confirm Formspree endpoint is active
- [ ] Share URL and verify OG preview image
