const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const moduleSource = fs.readFileSync(path.join(root, 'js/lib/commerce-ui.js'), 'utf8')
  .replace(/^import[\s\S]*?;\n/gm, '').replace(/^export /gm, '');

function element() {
  const attributes = {}, listeners = {}, classes = new Set();
  return {
    attributes, listeners, dataset: {}, hidden: false, textContent: '',
    addEventListener(event, fn) { (listeners[event] ||= []).push(fn); },
    setAttribute(k, v) { attributes[k] = v; },
    getAttribute(k) { return attributes[k]; },
    removeAttribute(k) { delete attributes[k]; },
    focus() { this.focused = true; },
    classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); }, contains(name) { return classes.has(name); } },
  };
}

function formHarness(fetchResponse) {
  const form = element(), status = element(), button = element(), intent = { value: 'seminar-interest' };
  form.dataset.capture = 'seminar-interest';
  form.dataset.successMessage = 'You are on the event update list. This does not reserve a ticket.';
  form.action = 'https://formspree.io/f/meerjgde';
  form.answers = { name: 'Test athlete', email: 'athlete@example.invalid' };
  form.reportValidity = () => true;
  form.reset = () => { form.answers = {}; form.resets = (form.resets || 0) + 1; };
  form.querySelector = selector => selector === '.form-status' ? status : selector.includes('button') ? button : intent;
  const posts = [], tracked = [];
  const context = vm.createContext({
    FormData: class { constructor(f) { this.values = { ...f.answers }; } },
    fetch: async (url, options) => { posts.push({ url, options }); return fetchResponse(); },
    track: (name, data) => tracked.push({ name, data }), EVENTS: { LEAD_CAPTURED: 'lead_captured' },
  });
  vm.runInContext(moduleSource + '\nthis.enhance = enhanceCaptureForms;', context);
  const scope = { querySelectorAll: () => [form] };
  context.enhance(scope);
  return { form, status, button, posts, tracked, scope, context, submit: () => form.listeners.submit[0]({ preventDefault() {} }) };
}

test('a successful interest request confirms the list without claiming a ticket', async () => {
  const h = formHarness(() => ({ ok: true }));
  await h.submit();
  assert.equal(h.posts.length, 1);
  assert.equal(h.posts[0].url, 'https://formspree.io/f/meerjgde');
  assert.equal(h.posts[0].options.method, 'POST');
  assert.match(h.status.textContent, /does not reserve a ticket/);
  assert.equal(h.form.resets, 1);
  assert.equal(h.status.focused, true);
  assert.equal(h.button.disabled, false);
  assert.equal(h.form.attributes['aria-busy'], undefined);
  assert.equal(h.tracked.length, 1);
  assert.equal(h.tracked[0].data.intent, 'seminar-interest');
  assert.equal(JSON.stringify(h.tracked).includes('athlete@example.invalid'), false);
});

test('HTTP rejection keeps entered answers and allows another attempt', async () => {
  let ok = false;
  const h = formHarness(() => ({ ok }));
  await h.submit();
  assert.equal(h.form.answers.name, 'Test athlete');
  assert.equal(h.form.resets, undefined);
  assert.match(h.status.textContent, /not sent/);
  assert.equal(h.tracked.length, 0);
  assert.equal(h.button.disabled, false);
  ok = true;
  await h.submit();
  assert.equal(h.form.resets, 1);
});

test('network failure retains the answers and exposes recovery', async () => {
  const h = formHarness(() => { throw Error('offline'); });
  await h.submit();
  assert.equal(h.form.answers.email, 'athlete@example.invalid');
  assert.match(h.status.textContent, /Please try again/);
  assert.equal(h.status.focused, true);
  assert.equal(h.button.disabled, false);
});

test('repeated submission while pending sends only once', async () => {
  let complete;
  const h = formHarness(() => new Promise(resolve => { complete = resolve; }));
  const first = h.submit();
  await h.submit();
  assert.equal(h.posts.length, 1);
  assert.equal(h.form.attributes['aria-busy'], 'true');
  assert.equal(h.button.disabled, true);
  complete({ ok: true });
  await first;
});

test('invalid forms and repeated enhancement cannot create extra submissions', async () => {
  const h = formHarness(() => ({ ok: true }));
  h.context.enhance(h.scope);
  assert.equal(h.form.listeners.submit.length, 1);
  h.form.reportValidity = () => false;
  await h.submit();
  assert.equal(h.posts.length, 0);
});

test('menu closes with Escape, returns focus, and clears its scroll lock at desktop width', () => {
  const button = element(), nav = element(), link = element(), body = element(), media = element(), document = element();
  nav.querySelectorAll = () => [link];
  document.body = body;
  document.querySelector = () => button;
  document.getElementById = () => nav;
  const context = vm.createContext({ document, window: { matchMedia: () => media } });
  vm.runInContext(moduleSource + '\ninitMobileNav();', context);
  assert.equal(nav.hidden, true);
  button.listeners.click[0]();
  assert.equal(button.attributes['aria-label'], 'Close menu');
  assert.equal(nav.hidden, false);
  assert.equal(body.classList.contains('menu-open'), true);
  document.listeners.keydown[0]({ key: 'Escape' });
  assert.equal(nav.hidden, true);
  assert.equal(button.focused, true);
  button.listeners.click[0]();
  media.matches = true;
  media.listeners.change[0]();
  assert.equal(button.attributes['aria-expanded'], 'false');
  assert.equal(body.classList.contains('menu-open'), false);
  button.listeners.click[0]();
  link.listeners.click[0]();
  assert.equal(nav.hidden, true);
});

test('the generic seminar list publishes no event details or promised inclusions', () => {
  const source = fs.readFileSync(path.join(root, 'js/config/funnels.js'), 'utf8').replace(/^export /gm, '');
  const context = vm.createContext({});
  vm.runInContext(source + '\nthis.items = publicSeminars();', context);
  assert.equal(context.items.length, 1);
  const item = context.items[0];
  assert.equal(item.status, 'interest');
  for (const field of ['athleteName', 'dateLabel', 'timeLabel', 'venueLabel', 'priceLabel', 'checkoutUrl', 'capacity', 'spotsRemaining']) assert.equal(item[field], null);
  assert.equal(item.includedItems.length, 0);
  assert.equal(item.whoItIsFor.length, 0);
});
