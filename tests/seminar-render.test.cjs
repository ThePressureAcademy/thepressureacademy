const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const config = fs.readFileSync(path.join(root, 'js/config/funnels.js'), 'utf8').replace(/^export /gm, '');
const html = fs.readFileSync(path.join(root, 'seminars/_event/index.html'), 'utf8');
const source = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/^\s*import[\s\S]*?;\n/gm, '');
function render(status, slug = 'founding-pressure-seminar') {
  let redirectedTo;
  const elements = Object.fromEntries(['event-main', 'upsell-slot'].map(id => [id, { innerHTML: '' }]));
  const document = {
    title: '', getElementById: id => elements[id] || null,
    querySelector: () => ({ setAttribute() {} }), addEventListener() {},
  };
  const context = vm.createContext({
    document, initMotion() {}, initCart() {}, initMobileNav() {}, enhanceCaptureForms() {}, track() {}, EVENTS: {},
    slugFromPath: () => slug,
    window: { location: { hash: '#group-request', replace(target) { redirectedTo = target; } } },
    escapeHtml: value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
    checkoutAction: () => ({ available: false, start() {} }),
  });
  vm.runInContext(config, context);
  if (status) vm.runInContext(`seminars[0].status = ${JSON.stringify(status)};`, context);
  vm.runInContext(source, context);
  return { title: document.title, html: elements['event-main'].innerHTML, redirectedTo };
}
test('interest page renders labelled capture and no payment action or promised ticket', () => {
  const result = render();
  assert.match(result.html, /Seminar interest|next training announcement/);
  assert.match(result.html, /This does not reserve a ticket/);
  assert.match(result.html, /<label>Your name<input/);
  assert.match(result.html, /<label>Email address<input/);
  assert.doesNotMatch(result.html, /id="buy-btn|Register my spot|What you will learn/);
});
test('draft event renders only the not-open state', () => {
  const result = render('draft');
  assert.match(result.html, /This event is not open/);
  assert.doesNotMatch(result.html, /seminar-form|next training announcement/);
});
test('open event without checkout falls back to an interest form', () => {
  const result = render('open');
  assert.match(result.html, /Get ticket updates/);
  assert.match(result.html, /Bookings are not open yet/);
  assert.doesNotMatch(result.html, /id="buy-btn|Tickets live/);
});
test('closed event gives an update-list path without taking registrations', () => {
  const result = render('closed');
  assert.match(result.html, /has closed/);
  assert.doesNotMatch(result.html, /seminar-form|id="buy-btn/);
});

const pixleySlug = 'michael-pixley-march-2027';
const pixleyPath = '/seminars/' + pixleySlug + '/';
const pixleyHtml = fs.readFileSync(path.join(root, pixleyPath, 'index.html'), 'utf8');

test('Pixley requests have a crawlable event page and two native submission paths', () => {
  const routes = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'))).routes;
  const route = routes.find(item => new RegExp(item.src).test(pixleyPath));
  assert.equal(route.dest, pixleyPath + 'index.html');
  assert.equal(render(null, pixleySlug).redirectedTo, pixleyPath + '#group-request');
  const generic = routes.find(item => new RegExp(item.src).test('/seminars/founding-pressure-seminar/'));
  assert.equal(generic.dest, '/seminars/_event/index.html');
  assert.match(pixleyHtml, /Hosted by The Pressure Academy/);
  assert.match(pixleyHtml, /Brisbane, Queensland, Australia/);
  const forms = [...pixleyHtml.matchAll(/<form\b[\s\S]*?<\/form>/g)].map(match => match[0]);
  assert.equal(forms.length, 2);
  for (const form of forms) {
    assert.match(form, /action="https:\/\/formspree.io\/f\/meerjgde"/);
    assert.match(form, /method="post"/);
    assert.match(form, /name="intent" value="seminar-registration"/);
    assert.match(form, /name="source" value="seminar-michael-pixley-march-2027"/);
  }
  assert.match(forms[0], /name="request_type" value="seminar-days"/);
  assert.match(forms[0], /name="people"[^>]*min="1" max="20" step="1"/);
  assert.match(forms[1], /name="request_type" value="semi-private-group"/);
  assert.match(forms[1], /name="group_price_aud" value="1000"/);
  assert.deepEqual([...forms[1].matchAll(/<option value="(\d+)"/g)].map(m => +m[1]), [1, 2, 3, 4, 5, 6]);
});

test('seminar total respects selected days, attendee count and capacity', () => {
  const people = { valueAsNumber: 1 };
  const days = { value: '' };
  const listeners = {};
  const form = { elements: { people, days }, addEventListener(type, handler) { listeners[type] = handler; } };
  const subtotal = { hidden: false, textContent: '' };
  const document = {
    getElementById(id) { return id === 'pixley-days-form' ? form : subtotal; },
    querySelectorAll() { return []; },
  };
  const context = vm.createContext({
    document, initCart() {}, initMobileNav() {}, enhanceCaptureForms() {}, track() {}, EVENTS: {}, queueMicrotask,
  });
  vm.runInContext(config, context);
  const script = fs.readFileSync(path.join(root, 'js/lib/pixley-seminar.js'), 'utf8').replace(/^import .*;$/gm, '');
  vm.runInContext(script, context);
  assert.equal(subtotal.hidden, true);
  for (const [daySelection, count, amount] of [['Day 1', 1, '$150'], ['Day 2', 2, '$300'], ['Both days', 2, '$600'], ['Both days', 20, '$6,000']]) {
    days.value = daySelection;
    people.valueAsNumber = count;
    listeners.input();
    assert.equal(subtotal.hidden, false);
    assert.ok(subtotal.textContent.includes(amount + ' AUD'));
  }
  for (const outOfRange of [0, 21, 1.5, NaN]) {
    people.valueAsNumber = outOfRange;
    listeners.input();
    assert.equal(subtotal.hidden, true);
  }
});
