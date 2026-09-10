const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.join(__dirname, '..');
// api/portal-serve.js resolves portal HTML from process.cwd() (its htmlPath
// build). node --test runs each test file in its own child process, so this is
// scoped to this suite and removes any dependence on the caller's directory.
process.chdir(root);

const activate = require('../api/auth/activate.js');
const portalServe = require('../api/portal-serve.js');

const SECRET = 'test-secret-value-at-least-32-chars-long';
const SECRET_B = 'second-test-secret-value-32-chars-min-ok';
const GATE = '/mastery-method/portal/';
const DASHBOARD = '/mastery-method/portal/dashboard/';
const CLEARED = 'mm_session=; Path=/mastery-method/portal/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

// Both handlers read process.env inside the handler body, so requiring each
// module once here and mutating process.env per test is correct; there is no
// need to bust require.cache.
const ORIGINAL_SECRET = process.env.SESSION_SECRET;
const ORIGINAL_TOKENS = process.env.PORTAL_INVITE_TOKENS;

after(() => {
  if (typeof ORIGINAL_SECRET === 'string') process.env.SESSION_SECRET = ORIGINAL_SECRET;
  else delete process.env.SESSION_SECRET;
  if (typeof ORIGINAL_TOKENS === 'string') process.env.PORTAL_INVITE_TOKENS = ORIGINAL_TOKENS;
  else delete process.env.PORTAL_INVITE_TOKENS;
});

// ── Harness ──────────────────────────────────────────────────────────────────
function response() {
  return {
    statusCode: null,
    location: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    getHeader(k) { return this.headers[k]; },
    redirect(status, url) { this.statusCode = status; this.location = url; return this; },
    status(code) { this.statusCode = code; return this; },
    send(body) { this.body = body; return this; },
  };
}

// Deletes rather than assigning '' for the unset case: Boolean('') is false and
// Boolean(' ') is true, so assigning '' silently exercises a different branch.
function setEnv({ secret, tokensRaw }) {
  if (typeof secret === 'string') process.env.SESSION_SECRET = secret;
  else delete process.env.SESSION_SECRET;

  if (typeof tokensRaw === 'string') process.env.PORTAL_INVITE_TOKENS = tokensRaw;
  else {
    delete process.env.PORTAL_INVITE_TOKENS;
    assert.equal('PORTAL_INVITE_TOKENS' in process.env, false);
  }
}

// Runs fn with console.warn/console.error captured, and returns what was
// logged. The operator's only diagnostic surface is the ephemeral Vercel
// runtime log, so what these handlers say when they refuse a request is
// behaviour under test, not decoration. Capturing also keeps the suite output
// clean, since several cases deliberately trigger a rejection.
function captureConsole(fn) {
  const lines = [];
  const originalWarn = console.warn;
  const originalError = console.error;
  console.warn = (...args) => lines.push({ level: 'warn', text: args.map(String).join(' ') });
  console.error = (...args) => lines.push({ level: 'error', text: args.map(String).join(' ') });
  try {
    fn();
  } finally {
    console.warn = originalWarn;
    console.error = originalError;
  }
  return lines;
}

function issueCookie(token, tokensRaw, secret = SECRET) {
  setEnv({ secret, tokensRaw });
  const res = response();
  activate({ query: { token } }, res);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, DASHBOARD);
  const match = /mm_session=([^;]*)/.exec(res.headers['Set-Cookie'] || '');
  assert.ok(match, 'activate did not set an mm_session cookie');
  assert.ok(match[1].length > 0, 'activate set an empty mm_session cookie');
  return match[1];
}

function serve(cookieValue, { secret = SECRET, tokensRaw, page = 'dashboard' } = {}) {
  setEnv({ secret, tokensRaw });
  const res = response();
  res.logs = captureConsole(() => {
    portalServe({ headers: { cookie: 'mm_session=' + cookieValue }, query: { page } }, res);
  });
  return res;
}

function fingerprint(token, secret) {
  return crypto.createHmac('sha256', secret).update(token).digest('hex').slice(0, 12);
}

function signPayload(data, secret) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

function subOf(cookieValue) {
  const dot = cookieValue.lastIndexOf('.');
  return JSON.parse(Buffer.from(cookieValue.slice(0, dot), 'base64').toString('utf8')).sub;
}

function flip(char) {
  return char === '0' ? '1' : '0';
}

// ── Source-parity lint helpers ───────────────────────────────────────────────
// Comments are stripped BEFORE whitespace-normalising, so prose describing an
// expression can never stand in for the expression itself.
function normaliseSource(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\s+/g, '');
}

function parseChainOf(source, label) {
  const normalised = normaliseSource(source);
  const start = normalised.indexOf("tokensRaw.split(',')");
  assert.ok(start >= 0, `${label} has no recognisable token parse chain`);
  const rest = normalised.slice(start);

  // Take the chain to the END of the statement, not merely as far as
  // .filter(Boolean). Stopping at a known step is what makes a lint blind to a
  // normalisation appended after it. The one legitimate difference between the
  // two files is that portal-serve.js goes on to map entries to fingerprints,
  // so that map is the other terminator.
  const ends = [rest.indexOf(';'), rest.indexOf('.map((t)=>crypto')].filter((i) => i >= 0);
  assert.ok(ends.length > 0, `${label} token parse chain has no terminator`);
  return rest.slice(0, Math.min(...ends));
}

function fingerprintExprOf(source, label) {
  // The .slice(0,12) tail is load-bearing: both files call .digest('hex') for
  // the session signature, and only the fingerprint truncates it.
  const match = /crypto\.createHmac\('sha256',secret\)\.update\((\w+)\)\.digest\('hex'\)\.slice\(0,12\)/
    .exec(normaliseSource(source));
  assert.ok(match, `${label} has no recognisable fingerprint expression`);
  // The two files bind the token to different names (token vs t); everything
  // else about the expression must match byte for byte.
  return match[0].replace(`.update(${match[1]})`, '.update(TOKEN)');
}

const ACTIVATE_PARSE_STATEMENT =
  "constvalidTokens=tokensRaw.split(',').map((t)=>t.trim()).filter(Boolean);";
const PORTAL_FINGERPRINT_STATEMENT =
  "returntokensRaw.split(',').map((t)=>t.trim()).filter(Boolean)" +
  ".map((t)=>crypto.createHmac('sha256',secret).update(t).digest('hex').slice(0,12));";

// ── Core behaviour ───────────────────────────────────────────────────────────

test('1. valid session whose token is still listed is served', () => {
  const cookie = issueCookie('family-a', 'family-a,family-b');
  const res = serve(cookie, { tokensRaw: 'family-a,family-b' });
  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<html/i);
  assert.match(res.headers['Content-Type'], /text\/html/);
  assert.equal(res.headers['Set-Cookie'], undefined);
});

test('2. session whose token was removed is rejected, with no cache in the way', () => {
  const cookie = issueCookie('family-a', 'family-a,family-b');
  // Same secret, only the token list changed, mutated in place, no reload.
  assert.equal(process.env.SESSION_SECRET, SECRET);
  const res = serve(cookie, { secret: SECRET, tokensRaw: 'family-b' });
  assert.equal(process.env.SESSION_SECRET, SECRET);
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE + '?error=invalid-token');
  assert.equal(res.body, null);
  assert.equal(res.headers['Set-Cookie'], CLEARED);
});

test('3. adding an unrelated token leaves existing sessions working', () => {
  const cookieA = issueCookie('family-a', 'family-a');
  assert.equal(serve(cookieA, { tokensRaw: 'family-a,family-c' }).statusCode, 200);

  const cookieC = issueCookie('family-c', 'family-a,family-c');
  assert.equal(serve(cookieC, { tokensRaw: 'family-a,family-c' }).statusCode, 200);

  // Per-token subjects, not a hash of the whole list.
  assert.notEqual(subOf(cookieA), subOf(cookieC));
});

test('4. rotating the whole list rejects every existing session', () => {
  const cookieA = issueCookie('family-a', 'family-a,family-b');
  const cookieB = issueCookie('family-b', 'family-a,family-b');

  for (const cookie of [cookieA, cookieB]) {
    const res = serve(cookie, { tokensRaw: 'family-d,family-e' });
    assert.equal(res.statusCode, 302);
    assert.equal(res.location, GATE + '?error=invalid-token');
    assert.equal(res.body, null);
    assert.equal(res.headers['Set-Cookie'], CLEARED);
  }
});

// ── Session integrity ────────────────────────────────────────────────────────

test('5. expired session is still rejected even when its subject is listed', () => {
  const now = Date.now();
  const cookie = signPayload(
    { sub: fingerprint('family-a', SECRET), iat: now - 2000, exp: now - 1000 },
    SECRET
  );
  const res = serve(cookie, { tokensRaw: 'family-a' });
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE);
  assert.equal(res.body, null);
});

test('6. tampered signature is still rejected', () => {
  const cookie = issueCookie('family-a', 'family-a');
  const dot = cookie.lastIndexOf('.');
  const sig = cookie.slice(dot + 1);
  const tampered = cookie.slice(0, dot + 1) + flip(sig[0]) + sig.slice(1);
  const res = serve(tampered, { tokensRaw: 'family-a' });
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE);
  assert.equal(res.body, null);
});

test('7. tampered payload is still rejected', () => {
  const cookie = issueCookie('family-a', 'family-a');
  const dot = cookie.lastIndexOf('.');
  const payload = cookie.slice(0, dot);
  const swapped = payload[0] === 'e' ? 'f' : 'e';
  const tampered = swapped + payload.slice(1) + cookie.slice(dot);
  const res = serve(tampered, { tokensRaw: 'family-a' });
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE);
  assert.equal(res.body, null);
});

test('8. malformed cookies are rejected and never throw', () => {
  const malformed = ['', 'no-dot-at-all', '.', 'abc.', '.abc', 'not-base64!!.deadbeef', 'x'.repeat(200 * 1024)];
  for (const value of malformed) {
    let res;
    assert.doesNotThrow(() => { res = serve(value, { tokensRaw: 'family-a' }); });
    assert.equal(res.statusCode, 302);
    assert.equal(res.location, GATE);
    assert.equal(res.body, null);
  }

  // A well-signed payload with no `sub` passes the signature and then fails
  // membership: ['aabbccddeeff'].includes(undefined) is false, so no type
  // guard is needed.
  const now = Date.now();
  const noSub = signPayload({ iat: now, exp: now + 60000 }, SECRET);
  const res = serve(noSub, { tokensRaw: 'family-a' });
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE + '?error=invalid-token');
  assert.equal(res.body, null);
});

test('9. checks run signature, then expiry, then membership', () => {
  const cookie = issueCookie('family-a', 'family-a', SECRET);
  // Rotating the secret must read as a signature failure (bare gate), not as a
  // revocation, proving membership is consulted only after validateSession.
  const rotated = serve(cookie, { secret: SECRET_B, tokensRaw: 'family-a' });
  assert.equal(rotated.statusCode, 302);
  assert.equal(rotated.location, GATE);
  assert.equal(rotated.body, null);

  const reissued = issueCookie('family-a', 'family-a', SECRET_B);
  const res = serve(reissued, { secret: SECRET_B, tokensRaw: 'family-a' });
  assert.equal(res.statusCode, 200);
});

// ── Parse parity with activate.js ────────────────────────────────────────────

test('10. whitespace and empty entries parse identically on both sides', () => {
  const cookie = issueCookie('family-b', 'family-a,family-b');
  const res = serve(cookie, { tokensRaw: '  family-a , , family-b  ' });
  assert.equal(res.statusCode, 200);
});

test('11. every accepted token in a messy list round-trips end to end', () => {
  const list = ' tokA , ,tokB\n';
  for (const token of ['tokA', 'tokB']) {
    const cookie = issueCookie(token, list);
    const res = serve(cookie, { tokensRaw: list });
    assert.equal(res.statusCode, 200);
  }
});

test('12. near-miss tokens mint nothing', () => {
  const list = ' tokA , ,tokB\n';
  const listed = list.split(',').map((t) => t.trim()).filter(Boolean);
  const candidates = ['', ' ', 'tok', 'tokABC', 'TOKA', ' tokA '];

  for (const candidate of candidates) {
    setEnv({ secret: SECRET, tokensRaw: list });
    const res = response();
    activate({ query: { token: candidate } }, res);
    const trimmed = candidate.trim();

    if (!trimmed) {
      assert.equal(res.location, GATE + '?error=no-token', `for ${JSON.stringify(candidate)}`);
      assert.equal(res.headers['Set-Cookie'], undefined);
    } else if (listed.includes(trimmed)) {
      // Trims to an exact listed entry, so it legitimately activates.
      assert.equal(res.location, DASHBOARD, `for ${JSON.stringify(candidate)}`);
      assert.ok(res.headers['Set-Cookie']);
    } else {
      assert.equal(res.location, GATE + '?error=invalid-token', `for ${JSON.stringify(candidate)}`);
      assert.equal(res.headers['Set-Cookie'], undefined);
    }
  }
});

test('13. membership covers the whole list, not just the head', () => {
  const list = 'tok1,tok2,tok3,tok4,tok5';
  for (const token of ['tok1', 'tok5']) {
    const cookie = issueCookie(token, list);
    assert.equal(serve(cookie, { tokensRaw: list }).statusCode, 200);
  }
});

// ── Missing-environment behaviour: fail closed ───────────────────────────────

test('14. PORTAL_INVITE_TOKENS deleted fails closed', () => {
  const cookie = issueCookie('family-a', 'family-a');
  assert.equal(serve(cookie, { tokensRaw: 'family-a' }).statusCode, 200);

  setEnv({ secret: SECRET, tokensRaw: undefined });
  assert.equal('PORTAL_INVITE_TOKENS' in process.env, false);
  const res = response();
  const logs = captureConsole(() => {
    portalServe({ headers: { cookie: 'mm_session=' + cookie }, query: { page: 'dashboard' } }, res);
  });
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE + '?error=config');
  assert.equal(res.body, null);

  // The log must name the variable that is actually missing. This is the
  // Production-set/Preview-unset case, the likeliest lockout this change
  // introduces, and a generic message would not tell it apart from a missing
  // SESSION_SECRET.
  assert.equal(logs.length, 1);
  assert.equal(logs[0].level, 'error');
  assert.match(logs[0].text, /PORTAL_INVITE_TOKENS/);
  assert.doesNotMatch(logs[0].text, /SESSION_SECRET/);
});

test('15. PORTAL_INVITE_TOKENS set to an empty string is a config error', () => {
  const cookie = issueCookie('family-a', 'family-a');
  const res = serve(cookie, { tokensRaw: '' });
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE + '?error=config');
  assert.equal(res.body, null);
  assert.equal(res.logs.length, 1);
  assert.match(res.logs[0].text, /PORTAL_INVITE_TOKENS/);
  assert.doesNotMatch(res.logs[0].text, /SESSION_SECRET/);
});

test('16. a list that parses to zero tokens is total revocation, and keeps cookies', () => {
  for (const tokensRaw of [',', ' ', ',,', ' , , ']) {
    const cookie = issueCookie('family-a', 'family-a');
    const res = serve(cookie, { tokensRaw });
    assert.equal(res.statusCode, 302, `for ${JSON.stringify(tokensRaw)}`);
    assert.equal(res.location, GATE + '?error=invalid-token');
    assert.equal(res.body, null);
    assert.equal(res.headers['Set-Cookie'], undefined);
  }
});

test('17. SESSION_SECRET unset still fails closed regardless of the token list', () => {
  const cookie = issueCookie('family-a', 'family-a');
  // Called directly rather than through serve(), whose destructuring default
  // would substitute SECRET for an explicit undefined.
  setEnv({ secret: undefined, tokensRaw: 'family-a' });
  assert.equal('SESSION_SECRET' in process.env, false);
  const res = response();
  const logs = captureConsole(() => {
    portalServe({ headers: { cookie: 'mm_session=' + cookie }, query: { page: 'dashboard' } }, res);
  });
  assert.equal(res.statusCode, 302);
  assert.equal(res.location, GATE + '?error=config');
  assert.equal(res.body, null);

  assert.equal(logs.length, 1);
  assert.match(logs[0].text, /SESSION_SECRET/);
  assert.doesNotMatch(logs[0].text, /PORTAL_INVITE_TOKENS/);
});

// ── Anti-divergence and parity lints ─────────────────────────────────────────

test('18. parse chain and fingerprint expression are identical across handlers', () => {
  const activateSrc = fs.readFileSync(path.join(root, 'api/auth/activate.js'), 'utf8');
  const portalSrc = fs.readFileSync(path.join(root, 'api/portal-serve.js'), 'utf8');

  // Equality of the extracted expressions, not containment of a fragment.
  // Containment is blind to additive drift: appending a normalisation step to
  // one file's chain leaves the fragment present and the lint green while the
  // two sides silently disagree about which string gets fingerprinted.
  assert.equal(
    parseChainOf(activateSrc, 'api/auth/activate.js'),
    parseChainOf(portalSrc, 'api/portal-serve.js'),
    'the token parse chains have diverged between the two handlers'
  );
  assert.equal(
    fingerprintExprOf(activateSrc, 'api/auth/activate.js'),
    fingerprintExprOf(portalSrc, 'api/portal-serve.js'),
    'the fingerprint expressions have diverged between the two handlers'
  );

  // Whole statements, terminator included, so a step added anywhere in either
  // chain (before or after the shared part) breaks the literal.
  assert.ok(
    normaliseSource(activateSrc).includes(ACTIVATE_PARSE_STATEMENT),
    'api/auth/activate.js no longer contains the expected parse statement'
  );
  assert.ok(
    normaliseSource(portalSrc).includes(PORTAL_FINGERPRINT_STATEMENT),
    'api/portal-serve.js no longer contains the expected parse-and-fingerprint statement'
  );
});

test('18b. the parity lint itself catches drift, comments and a swapped digest', () => {
  const real = fs.readFileSync(path.join(root, 'api/portal-serve.js'), 'utf8');

  // Comment text must not satisfy the lint. The design deliberately places
  // prose about these exact expressions directly above the function, so a
  // future comment edit could otherwise neuter the guard.
  const commentOnly = `
    // return tokensRaw.split(',').map((t) => t.trim()).filter(Boolean)
    //   .map((t) => crypto.createHmac('sha256', secret).update(t).digest('hex').slice(0, 12));
    function activeFamilyIds() { return []; }
  `;
  assert.throws(() => parseChainOf(commentOnly, 'comment-only'), /parse chain/);
  assert.throws(() => fingerprintExprOf(commentOnly, 'comment-only'), /fingerprint/);

  // Additive drift on one side only: same fragments present, different chain.
  const drifted = real.replace(
    ".filter(Boolean)\n    .map((t) => crypto",
    ".filter(Boolean)\n    .map((t) => t.toLowerCase())\n    .map((t) => crypto"
  );
  assert.notEqual(drifted, real, 'drift fixture did not apply');
  assert.notEqual(
    parseChainOf(drifted, 'drifted'),
    parseChainOf(real, 'api/portal-serve.js'),
    'the lint cannot see a normalisation step added to one side'
  );

  // A changed truncation must fail. The 12 characters are pinned deliberately,
  // not just kept in step: widening the truncation would change every live sub
  // and sign every family out on deploy, even if both files changed together.
  const retruncated = real.replace('.slice(0, 12)', '.slice(0, 16)');
  assert.notEqual(retruncated, real, 'truncation fixture did not apply');
  assert.throws(() => fingerprintExprOf(retruncated, 'retruncated'), /fingerprint/);
  const plainHash = real.replace(
    "crypto.createHmac('sha256', secret).update(t)",
    "crypto.createHash('sha256').update(t + secret)"
  );
  assert.throws(() => fingerprintExprOf(plainHash, 'plain-hash'), /fingerprint/);
});

test('19. the clear-cookie string matches api/auth/logout.js', () => {
  const cookie = issueCookie('family-a', 'family-a,family-b');
  const res = serve(cookie, { tokensRaw: 'family-b' });
  assert.equal(res.headers['Set-Cookie'], CLEARED);

  const logout = fs.readFileSync(path.join(root, 'api/auth/logout.js'), 'utf8').replace(/\s+/g, '');
  const segments = [
    'mm_session=',
    'Path=/mastery-method/portal/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Max-Age=0',
    'Expires=Thu,01Jan197000:00:00GMT',
  ];
  for (const segment of segments) {
    assert.ok(logout.includes(segment), `logout.js is missing ${segment}`);
  }
});

test('20. page routing is unaffected by the revocation guard', () => {
  const cookie = issueCookie('family-a', 'family-a');
  assert.equal(serve(cookie, { tokensRaw: 'family-a', page: 'library' }).statusCode, 200);

  for (const page of ['../../etc', 'DASHBOARD']) {
    const res = serve(cookie, { tokensRaw: 'family-a', page });
    assert.equal(res.statusCode, 302, `for page ${JSON.stringify(page)}`);
    assert.equal(res.location, DASHBOARD);
  }
});

// ── Diagnosability of a rejection ────────────────────────────────────────────
// The operator has no log drain and no alerting; ephemeral Vercel runtime logs
// are the whole diagnostic surface. A rejection that is observable but whose
// cause is not leaves "nobody can get in" unanswerable, so the cause is tested.

test('21. a per-family revocation logs the size of the list that excluded them', () => {
  const cookie = issueCookie('family-a', 'family-a,family-b,family-c');
  const res = serve(cookie, { tokensRaw: 'family-b,family-c' });
  assert.equal(res.location, GATE + '?error=invalid-token');

  assert.equal(res.logs.length, 1);
  assert.equal(res.logs[0].level, 'warn');
  assert.match(res.logs[0].text, /no longer listed/);
  // The count is what makes a routine revocation legible: two tokens listed is
  // what the operator expects after removing one of three.
  assert.match(res.logs[0].text, /\(2 token\(s\) currently listed\)/);
});

test('22. a zero-token allowlist announces the total lockout in its own words', () => {
  const revoked = [];
  for (const tokensRaw of [',', ' ', ',,', ' , , ']) {
    const cookie = issueCookie('family-a', 'family-a');
    const res = serve(cookie, { tokensRaw });
    assert.equal(res.location, GATE + '?error=invalid-token', `for ${JSON.stringify(tokensRaw)}`);

    assert.equal(res.logs.length, 1, `for ${JSON.stringify(tokensRaw)}`);
    // Error, not warn: every family is refused, not one.
    assert.equal(res.logs[0].level, 'error', `for ${JSON.stringify(tokensRaw)}`);
    assert.match(res.logs[0].text, /PORTAL_INVITE_TOKENS/);
    assert.match(res.logs[0].text, /zero tokens/);
    assert.match(res.logs[0].text, /every session will be rejected/);
    revoked.push(res.logs[0].text);
  }
  // Same message for every zero-token spelling, so it is recognisable.
  assert.equal(new Set(revoked).size, 1);

  // And it must not read like the single-family case.
  const single = issueCookie('family-a', 'family-a,family-b');
  const singleRes = serve(single, { tokensRaw: 'family-b' });
  assert.notEqual(singleRes.logs[0].text, revoked[0]);
  assert.notEqual(singleRes.logs[0].level, 'error');
  assert.doesNotMatch(revoked[0], /token\(s\) currently listed/);
});

test('23. the three lockout causes are three distinguishable log lines', () => {
  const cookieB = issueCookie('family-b', 'family-a,family-b');

  // (a) family-b genuinely revoked from a list the operator meant to write.
  const revoked = serve(cookieB, { tokensRaw: 'family-a' });

  // (b) family-b still enrolled, but a third token was appended with no
  // separator, so 'family-b' is no longer an entry. The operator believes
  // three families are listed; the log says two.
  const mangled = serve(cookieB, { tokensRaw: 'family-a,family-bfamily-c' });

  // (c) the value was mangled down to nothing at all.
  const total = serve(cookieB, { tokensRaw: ',' });

  for (const res of [revoked, mangled, total]) {
    assert.equal(res.location, GATE + '?error=invalid-token');
    assert.equal(res.body, null);
    assert.equal(res.logs.length, 1);
  }

  assert.match(revoked.logs[0].text, /\(1 token\(s\) currently listed\)/);
  assert.match(mangled.logs[0].text, /\(2 token\(s\) currently listed\)/);
  assert.equal(total.logs[0].level, 'error');

  // All three must be tellable apart from each other by their text alone.
  const texts = [revoked.logs[0].text, mangled.logs[0].text, total.logs[0].text];
  assert.equal(new Set(texts).size, 3);
});

test('24. no rejection log leaks a token, the secret or the session subject', () => {
  const cookie = issueCookie('family-a', 'family-a,family-b');
  const sub = subOf(cookie);
  const cases = [
    { tokensRaw: 'family-b' },
    { tokensRaw: ',' },
    { tokensRaw: '' },
    { secret: SECRET, tokensRaw: 'family-a,family-b', page: 'library' },
  ];

  for (const options of cases) {
    const res = serve(cookie, options);
    for (const line of res.logs) {
      assert.doesNotMatch(line.text, /family-a|family-b/, `leaked a token: ${line.text}`);
      assert.equal(line.text.includes(SECRET), false, `leaked the secret: ${line.text}`);
      assert.equal(line.text.includes(sub), false, `leaked the subject: ${line.text}`);
    }
  }
});
