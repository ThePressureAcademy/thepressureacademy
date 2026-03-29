/**
 * api/auth/activate.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Invite token activation endpoint.
 *
 * Called when a family clicks their invite link:
 *   GET /api/auth/activate?token=TOKEN_VALUE
 *
 * Flow:
 *   1. Receive invite token from query string
 *   2. Validate against PORTAL_INVITE_TOKENS env var (comma-separated list)
 *   3. If valid → issue HMAC-signed HttpOnly session cookie → redirect to dashboard
 *   4. If invalid → redirect to gate with error param
 *
 * Environment variables required (set in Vercel dashboard):
 *   SESSION_SECRET          — random 32+ char string (same as portal-serve.js)
 *   PORTAL_INVITE_TOKENS    — comma-separated list of valid invite tokens
 *                             Example: mm2026-smith-a1b2c3,mm2026-jones-d4e5f6
 *
 * Operating notes for Kirsty:
 *   - Generate a token using any UUID/random string generator
 *   - Add it to PORTAL_INVITE_TOKENS in the Vercel dashboard
 *   - Send the family this link: https://thepressureacademy.com/api/auth/activate?token=TOKEN
 *   - To revoke: remove the token from PORTAL_INVITE_TOKENS and redeploy
 *   - See docs/PORTAL_ACCESS_ADMIN.md for full workflow
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const crypto = require('crypto');

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60;          // 30 days in seconds
const GATE_URL = '/mastery-method/portal/';
const DASHBOARD_URL = '/mastery-method/portal/dashboard/';

// ── Create a signed session token ────────────────────────────────────────────
function createSession(familyId, secret) {
  const now = Date.now();
  // Payload: contains subject (anonymised family id), issued-at, expiry
  const payload = Buffer.from(
    JSON.stringify({
      sub: familyId,
      iat: now,
      exp: now + SESSION_DURATION_MS,
    })
  ).toString('base64');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `${payload}.${signature}`;
}

// ── Build a Set-Cookie header string ─────────────────────────────────────────
function buildCookie(value, maxAge) {
  return [
    `mm_session=${value}`,
    'Path=/mastery-method/portal/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
  ].join('; ');
}

// ── Anonymise token for use as session subject (no PII in session) ───────────
function hashToken(token, secret) {
  return crypto.createHmac('sha256', secret).update(token).digest('hex').slice(0, 12);
}

// ── Handler ──────────────────────────────────────────────────────────────────
module.exports = function handler(req, res) {
  const token = (req.query.token || '').trim();

  // Require a token
  if (!token) {
    return res.redirect(302, GATE_URL + '?error=no-token');
  }

  // Require environment configuration
  const secret = process.env.SESSION_SECRET;
  const tokensRaw = process.env.PORTAL_INVITE_TOKENS;

  if (!secret || !tokensRaw) {
    console.error('[activate] Required environment variables not set.');
    return res.redirect(302, GATE_URL + '?error=config');
  }

  // Parse valid tokens (trim whitespace, ignore empty entries)
  const validTokens = tokensRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  if (!validTokens.includes(token)) {
    // Unknown or revoked token
    return res.redirect(302, GATE_URL + '?error=invalid-token');
  }

  // Token is valid — issue session
  const familyId = hashToken(token, secret); // anonymised, not the raw token
  const sessionValue = createSession(familyId, secret);

  res.setHeader('Set-Cookie', buildCookie(sessionValue, SESSION_MAX_AGE_SEC));
  res.redirect(302, DASHBOARD_URL);
};
