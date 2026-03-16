# Deployment Checklist

## Before commit
- [ ] `index.html` exists at repo root
- [ ] `privacy-policy.html` exists at repo root
- [ ] all files in `assets/logos/` are present
- [ ] `assets/social/TPA_OG_1200x630.png` is present
- [ ] local preview loads header logo, ecosystem logos, section logos, and footer logo
- [ ] Privacy Policy link opens successfully
- [ ] OG image path returns 200
- [ ] favicon path returns 200

## Before redeploy
- [ ] no absolute local filesystem paths remain
- [ ] no references to self-contained emergency HTML remain
- [ ] homepage still uses current locked fonts and colours
- [ ] Formspree endpoint and hidden source fields remain intact

## After redeploy
- [ ] homepage loads on Brave, Chrome, and Safari
- [ ] hero interactions initialise
- [ ] planner demo updates live
- [ ] Blueprint loop works
- [ ] Chains section works
- [ ] logos render from `/assets/logos/*.svg`
- [ ] privacy policy route works live
