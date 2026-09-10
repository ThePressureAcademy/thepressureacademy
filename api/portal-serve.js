/**
 * api/portal-serve.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Portal route handler — real server-side auth gate.
 *
 * All /mastery-method/portal/(dashboard|library|module|account|progress) routes are
 * rewritten here via vercel.json before any HTML is returned to the browser.
 *
 * Flow:
 *   1. Parse mm_session cookie from request
 *   2. Validate HMAC-SHA256 signature and expiry
 *   3. Confirm the session subject still matches a currently-listed invite token
 *   4. If invalid, missing or revoked → redirect to gate page
 *   5. If valid → read the portal HTML file and return it
 *
 * The HTML files live on disk and are bundled with this function via
 * vercel.json "includeFiles". This means portal HTML is NEVER served
 * statically — it only comes through this function after auth passes.
 *
 * Environment variables required (set in Vercel dashboard):
 *   SESSION_SECRET:       random 32+ character string for HMAC signing
 *   PORTAL_INVITE_TOKENS: the same comma-separated list api/auth/activate.js
 *                         issues from. This function fails closed without it:
 *                         if it is unset in any environment that serves portal
 *                         routes, every request redirects to the gate with
 *                         ?error=config. Set it in Production, Preview and any
 *                         Development environment.
 *
 * Revocation: removing a token from PORTAL_INVITE_TOKENS and redeploying ends
 * that family's existing sessions on their next request served by a deployment
 * built after the change. SESSION_SECRET does NOT need to be rotated; rotating
 * it remains the break-glass that signs every family out at once. Revocation is
 * per token, not per device or per session: every device that used that link is
 * signed out together. Per-device revocation would still need a Vercel KV
 * session lookup in place of validateSession().
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SESSION_COOKIE = 'mm_session';
const ALLOWED_PAGES = ['dashboard', 'library', 'module', 'account', 'progress'];
const GATE_URL = '/mastery-method/portal/';

// Byte-identical to the clear in api/auth/logout.js. A cookie clear only works
// if Path and the flags match the Set-Cookie that created the session, so these
// two strings must stay in step; tests/portal-session.test.cjs asserts it.
const CLEAR_COOKIE = [
  'mm_session=',
  'Path=/mastery-method/portal/',
  'HttpOnly',
  'Secure',
  'SameSite=Strict',
  'Max-Age=0',
  'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
].join('; ');

// ── Cookie parser ────────────────────────────────────────────────────────────
function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    out[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  }
  return out;
}

// ── Session validation ───────────────────────────────────────────────────────
function validateSession(cookieValue, secret) {
  try {
    // Format: {base64-payload}.{hex-hmac}
    const dot = cookieValue.lastIndexOf('.');
    if (dot < 0) return null;

    const payload = cookieValue.slice(0, dot);
    const provided = cookieValue.slice(dot + 1);

    // Recompute expected signature
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Reject if lengths differ (prevents timing oracle with timingSafeEqual)
    if (provided.length !== expected.length) return null;

    const providedBuf = Buffer.from(provided, 'hex');
    const expectedBuf = Buffer.from(expected, 'hex');

    // Timing-safe comparison
    if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

    // Decode and validate payload
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    if (!data || !data.exp || typeof data.exp !== 'number') return null;
    if (Date.now() > data.exp) return null;

    return data;
  } catch {
    // Any malformed input → reject
    return null;
  }
}

// ── Active family subjects ───────────────────────────────────────────────────
// Byte-identical to api/auth/activate.js: the same parse (split on commas, trim,
// drop empties) and the same hashToken() HMAC. A session's `sub` is a member of
// this list only while the token it was issued from is still listed, so removing
// a token from PORTAL_INVITE_TOKENS revokes that family's existing sessions.
// Any edit here must be made in api/auth/activate.js in the same commit;
// tests/portal-session.test.cjs asserts the two expressions stay identical.
function activeFamilyIds(tokensRaw, secret) {
  return tokensRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => crypto.createHmac('sha256', secret).update(t).digest('hex').slice(0, 12));
}

// ── Handler ──────────────────────────────────────────────────────────────────
module.exports = function handler(req, res) {
  // Require SESSION_SECRET and PORTAL_INVITE_TOKENS, failing closed if not
  // configured. Tested before the cookie is parsed, so the revocation check
  // below can never sit behind a guard that a later edit could widen.
  const secret = process.env.SESSION_SECRET;
  const tokensRaw = process.env.PORTAL_INVITE_TOKENS;
  if (!secret || !tokensRaw) {
    // Name the variable(s). There are now two, and the likeliest new lockout
    // this function introduces is PORTAL_INVITE_TOKENS being set in Production
    // but not in Preview, which a generic message would not distinguish from a
    // missing SESSION_SECRET. Names only; no value is ever logged.
    const missing = [
      !secret && 'SESSION_SECRET',
      !tokensRaw && 'PORTAL_INVITE_TOKENS',
    ].filter(Boolean);
    console.error('[portal-serve] Required environment variables not set:', missing.join(', '));
    return res.redirect(302, GATE_URL + '?error=config');
  }

  // Validate session cookie
  const cookies = parseCookies(req.headers.cookie);
  const session = validateSession(cookies[SESSION_COOKIE] || '', secret);
  if (!session) {
    return res.redirect(302, GATE_URL);
  }

  // Revocation check: the issuing token must still be listed
  const familyIds = activeFamilyIds(tokensRaw, secret);
  if (!familyIds.includes(session.sub)) {
    if (familyIds.length === 0) {
      // Highest blast radius: the allowlist names nobody, so EVERY family is
      // refused, not just this one. Logged distinctly, and at error level, so
      // a total lockout announces itself instead of reading in the runtime log
      // exactly like a routine per-family revocation.
      console.error(
        '[portal-serve] PORTAL_INVITE_TOKENS parsed to zero tokens: every session will be rejected. Check the value for a stray comma or whitespace-only content.'
      );
    } else {
      // The count is the diagnostic: a family reporting a lockout while the
      // list is the size the operator expects is a real revocation, and a
      // count that is short by one or more points at a mangled value.
      console.warn(
        `[portal-serve] Session rejected: issuing token no longer listed (${familyIds.length} token(s) currently listed).`
      );
    }
    // Clear the cookie only when the list actually names someone. A list that
    // parses to zero tokens is more likely a bad env edit than a deliberate
    // revoke-everyone, and clearing there would force every family to
    // re-activate from their enrolment email.
    //
    // Known bound: this guard covers only the zero-token shape. A mis-separated
    // value that still parses to a non-empty list (a token appended with no
    // comma, say) drops the affected families and DOES clear their cookies, so
    // repairing the variable is not enough for them; they re-click the link in
    // their enrolment email. The zero-token log above is what tells the two
    // states apart.
    if (familyIds.length > 0) {
      res.setHeader('Set-Cookie', CLEAR_COOKIE);
    }
    return res.redirect(302, GATE_URL + '?error=invalid-token');
  }

  // Sanitise page parameter — only lowercase alpha chars allowed
  const raw = req.query.page || '';
  const page = raw.replace(/[^a-z]/g, '');
  if (!ALLOWED_PAGES.includes(page)) {
    return res.redirect(302, '/mastery-method/portal/dashboard/');
  }

  // Read HTML file from bundled project files
  const htmlPath = path.join(
    process.cwd(),
    'mastery-method',
    'portal',
    page,
    'index.html'
  );

  let html;
  try {
    html = fs.readFileSync(htmlPath, 'utf8');
  } catch (err) {
    console.error('[portal-serve] Could not read portal page:', htmlPath, err.message);
    return res.status(404).send('Portal page not found.');
  }

  // Return with strict non-cacheable, non-indexable headers
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.status(200).send(html);
};
