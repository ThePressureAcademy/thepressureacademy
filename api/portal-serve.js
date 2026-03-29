/**
 * api/portal-serve.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Portal route handler — real server-side auth gate.
 *
 * All /mastery-method/portal/(dashboard|library|module|account) routes are
 * rewritten here via vercel.json before any HTML is returned to the browser.
 *
 * Flow:
 *   1. Parse mm_session cookie from request
 *   2. Validate HMAC-SHA256 signature and expiry
 *   3. If invalid/missing → redirect to gate page
 *   4. If valid → read the portal HTML file and return it
 *
 * The HTML files live on disk and are bundled with this function via
 * vercel.json "includeFiles". This means portal HTML is NEVER served
 * statically — it only comes through this function after auth passes.
 *
 * Environment variables required (set in Vercel dashboard):
 *   SESSION_SECRET — random 32+ character string for HMAC signing
 *
 * Upgrade path: replace validateSession() with a Vercel KV session lookup
 * when per-session revocation or multi-device sync is needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SESSION_COOKIE = 'mm_session';
const ALLOWED_PAGES = ['dashboard', 'library', 'module', 'account'];
const GATE_URL = '/mastery-method/portal/';

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

// ── Handler ──────────────────────────────────────────────────────────────────
module.exports = function handler(req, res) {
  // Require SESSION_SECRET — fail closed if not configured
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.error('[portal-serve] SESSION_SECRET not configured');
    return res.redirect(302, GATE_URL + '?error=config');
  }

  // Validate session cookie
  const cookies = parseCookies(req.headers.cookie);
  const session = validateSession(cookies[SESSION_COOKIE] || '', secret);
  if (!session) {
    return res.redirect(302, GATE_URL);
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
