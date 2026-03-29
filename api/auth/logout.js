/**
 * api/auth/logout.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Session logout endpoint.
 *
 * Clears the mm_session cookie by setting Max-Age=0 and an expired date,
 * then redirects to the portal gate page.
 *
 * Called via: window.location.href = '/api/auth/logout'
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const GATE_URL = '/mastery-method/portal/';

module.exports = function handler(req, res) {
  // Clear the session cookie — same Path/flags as when it was set
  res.setHeader('Set-Cookie', [
    'mm_session=',
    'Path=/mastery-method/portal/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  ].join('; '));

  res.redirect(302, GATE_URL);
};
