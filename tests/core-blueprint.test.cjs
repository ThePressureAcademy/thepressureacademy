const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const slug = 'pressure-blueprint-core';
const path = '/blueprints/' + slug + '/';
const page = readFileSync(join(root, path, 'index.html'), 'utf8');
const routes = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')).routes;

test('the free Core System uses its static preview before the generic Blueprint route', async () => {
  const { getBlueprint, publicBlueprints } = await import('../js/config/funnels.js');
  const bp = getBlueprint(slug);
  assert.ok(publicBlueprints().includes(bp));
  assert.equal(bp.status, 'free-on-request');
  assert.equal(bp.detailPath, path);
  assert.equal(bp.priceCents, 0);
  const match = url => routes.find(rule => new RegExp(rule.src).test(url));
  assert.equal(match(path).dest, path + 'index.html');
  assert.equal(match(path.slice(0, -1)).dest, path + 'index.html');
  assert.equal(match('/blueprints/another-title/').dest, '/blueprints/_blueprint/index.html');
  assert.match(page, /<section[^>]+id="preview"/);
  const publicPdfs = new Set([...page.matchAll(/href="([^"]+\.pdf)"/g)].map(m => m[1]));
  assert.deepEqual([...publicPdfs], ['/assets/blueprints/pressure-blueprint-preview-v2.pdf']);
});

test('native PDF requests need only an email, accept an optional class date and keep the governed inbox labels', () => {
  const form = page.match(/<form\b[\s\S]*?<\/form>/)[0];
  assert.match(form, /action="https:\/\/formspree\.io\/f\/meerjgde"/);
  assert.match(form, /method="post"/);
  assert.match(form, /data-capture="blueprint-lead"/);
  assert.match(form, /name="intent" value="blueprint-waitlist"/);
  assert.match(form, /name="source" value="blueprint-pressure-blueprint-core"/);
  assert.match(form, /name="request_type" value="core-pdf-request"/);
  assert.match(form, /type="email"[^>]+name="email"[^>]+required/);
  assert.match(form, /type="date" name="class_date" \/>/);
  assert.equal(form.match(/<input\b/g).length, 5);
  assert.match(form, /team will email/);
  assert.match(form, /printable two-page lesson now/);
  assert.match(page, /Coach Edition 01 \(draft\)/);
  assert.match(form, /mailto:contact@thepressureacademy\.com\?subject=Follow-up/);
});
