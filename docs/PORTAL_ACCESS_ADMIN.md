# Mastery Method Portal — Access Administration Guide

## What this is

The Mastery Method portal uses a server-side session system. Each enrolled family receives a personal invite link. Clicking the link activates a 30-day session on their device.

This document explains how to manage portal access as families enrol, move through their programme, and eventually leave.

---

## One-time setup (developer)

Before the portal goes live, the following environment variables must be set in the Vercel dashboard:

**Project → Settings → Environment Variables**

### `SESSION_SECRET`
A random 32+ character string used to sign all session cookies.

Generate one at: https://generate-secret.vercel.app/32

**Important:** If this value changes, all existing sessions are invalidated. Every enrolled family would need to re-activate. Only change this if you suspect a compromise.

### `PORTAL_INVITE_TOKENS`
A comma-separated list of valid invite tokens. Example:

```
mm2026-smith-a1b2c3d4e5f6,mm2026-jones-g7h8i9j0k1l2
```

After setting both variables, redeploy the project from the Vercel dashboard.

---

## Enrolling a new family

When a family starts a Mastery Pathway and needs portal access:

**Step 1 — Generate a unique token**

Use any random string generator to create a token. A good format:
```
mm2026-[familyname]-[random8chars]
```

Example tools:
- https://generate-secret.vercel.app/16
- Any UUID generator (e.g. uuidgen on Mac/Linux)

Keep a private record of which token belongs to which family (e.g. in your client notes or a spreadsheet).

**Step 2 — Add the token to Vercel**

1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Edit `PORTAL_INVITE_TOKENS`
3. Append `,new-token-here` to the existing value
4. Save and redeploy

**Step 3 — Send the family their invite link**

Email or message the family with:
```
https://thepressureacademy.com/api/auth/activate?token=THEIR_TOKEN_HERE
```

Suggested message:
> "Here's your Mastery Method portal access link. Click it to activate your session — you'll land directly on your dashboard. Your session stays active for 30 days on the same device. If you ever need a fresh link, just let me know."

**Step 4 — Family clicks the link**

The link:
1. Validates the token on the server
2. Issues a signed 30-day session cookie (HttpOnly, Secure)
3. Redirects to `/mastery-method/portal/dashboard/`

No password needed. No account creation. It just works.

---

## Revoking access

When a family's Mastery Pathway ends or you need to revoke access:

1. Go to Vercel dashboard → Project → Settings → Environment Variables
2. Edit `PORTAL_INVITE_TOKENS`
3. Remove the family's token from the comma-separated list
4. Save and redeploy

After redeployment, any existing session from that token will still be valid until it expires naturally (up to 30 days from when it was last activated). For immediate revocation, you would also need to rotate `SESSION_SECRET` — but this revokes ALL sessions.

For most cases (programme end, amicable departure), waiting for natural session expiry is sufficient.

---

## Re-issuing access

If a family loses their invite link or their session expires:

1. Their existing token (if still in `PORTAL_INVITE_TOKENS`) can be re-sent. They just click it again and get a fresh 30-day session.
2. If you've removed their token, generate a new one and add it.

---

## Session details

- Session duration: 30 days from activation
- Session storage: HttpOnly cookie (`mm_session`), scoped to `/mastery-method/portal/`
- Progress data: stored client-side in browser localStorage (survives session expiry, cleared if browser storage is cleared)
- Session signing: HMAC-SHA256 using `SESSION_SECRET`

---

## Adding a second device

Sessions are per-device (they live in the browser's cookies). If a family wants to access the portal from a second device, they simply click their invite link on that device. Each device gets its own session.

---

## Scaling beyond env vars

The current `PORTAL_INVITE_TOKENS` env var approach works well for up to ~50 families.

When the number of families grows, or when per-session management (revocation without full redeploy, session analytics) is needed, the next step is:
- Add Vercel KV (Redis) to store tokens and sessions
- Replace the env var token check in `api/auth/activate.js` with a KV lookup
- Sessions can then be individually revoked without rotating the master secret

The existing function structure (`activate.js`, `portal-serve.js`) is designed so this upgrade is a targeted change, not a full rewrite.

---

## Security notes

- Invite tokens are one-to-one with families — losing/sharing the link means that family's access is shared. If a link is accidentally shared, revoke the token and issue a new one.
- The session cookie is HttpOnly (not readable by JavaScript) and Secure (HTTPS only).
- Portal HTML is served by a server function — it is not publicly accessible as a static file.
- All portal routes return `Cache-Control: private, no-cache, no-store`.
- The portal is disallowed in `robots.txt` and carries `noindex, nofollow` meta tags.
