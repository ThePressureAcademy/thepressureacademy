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

const pixleyForms = [...pixleyHtml.matchAll(/<form\b[\s\S]*?<\/form>/g)].map(match => match[0]);
const sessionForms = pixleyForms.filter(form => form.includes('data-session-quote'));

test('Pixley date notification only requests email and identifies the individual event', () => {
  const alert = pixleyForms.find(form => form.includes('id="pixley-date-alert"'));
  assert.ok(alert);
  assert.match(alert, /action="https:\/\/formspree.io\/f\/meerjgde"/);
  assert.match(alert, /method="post"/);
  assert.match(alert, /name="intent" value="pixley-date-alert"/);
  assert.match(alert, /name="source" value="seminar-michael-pixley-march-2027"/);
  assert.match(alert, /type="email" name="email"[^>]* required/);
  assert.deepEqual([...alert.matchAll(/<input(?! type="hidden")[^>]*name="([^"]+)"/g)].map(match => match[1]), ['email']);
  const hub = fs.readFileSync(path.join(root, 'seminars/index.html'), 'utf8');
  assert.ok(hub.includes('href="' + pixleyPath + '#pixley-date-alert"'));
});

test('Pixley requests have a crawlable event page and two native submission paths', () => {
  const routes = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'))).routes;
  const route = routes.find(item => new RegExp(item.src).test(pixleyPath));
  assert.equal(route.dest, pixleyPath + 'index.html');
  assert.equal(render(null, pixleySlug).redirectedTo, pixleyPath + '#group-request');
  const generic = routes.find(item => new RegExp(item.src).test('/seminars/founding-pressure-seminar/'));
  assert.equal(generic.dest, '/seminars/_event/index.html');
  assert.match(pixleyHtml, /Hosted by The Pressure Academy/);
  assert.match(pixleyHtml, /Brisbane, Queensland, Australia/);
  const forms = sessionForms;
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

test('day and group requests quote admission and both optional garments independently', () => {
  const catalog = fs.readFileSync(path.join(root, 'js/config/pixley-collab.mjs'), 'utf8').replace(/^export /gm, '');
  const elements = Object.fromEntries([
    'request_type', 'people', 'days', 'group_size', 'tee_quantity', 'rashguard_quantity',
    'tee_sizes', 'rashguard_sizes', 'admission_aud', 'apparel_aud', 'estimated_total_aud',
  ].map(name => [name, { value: '', valueAsNumber: 0, max: '99', closest() { return this; } }]));
  const output = { replaceChildren(...rows) { this.rows = rows; } };
  const form = { elements, querySelector: () => output };
  const document = {
    querySelectorAll: () => [],
    createElement: () => ({ append(label, amount) { this.label = label; this.amount = amount.textContent; } }),
  };
  const context = vm.createContext({
    document, window: { addEventListener() {} }, initMobileNav() {}, enhanceCaptureForms() {},
    track() {}, EVENTS: {}, form,
  });
  vm.runInContext(config + '\n' + catalog, context);
  const script = fs.readFileSync(path.join(root, 'js/lib/pixley-seminar.js'), 'utf8').replace(/^import .*;$/gm, '');
  vm.runInContext(script, context);
  const update = () => vm.runInContext('updateQuote(form)', context);
  elements.request_type.value = 'seminar-days';
  for (const [day, people, tees, rashguards, admission, total] of [
    ['Day 1', 1, 0, 0, 150, 150], ['Day 1', 1, 1, 0, 150, 219], ['Day 2', 1, 0, 1, 150, 229],
    ['Both days', 1, 1, 1, 300, 448], ['Both days', 2, 2, 1, 600, 817], ['Day 2', 20, 0, 0, 3000, 3000],
  ]) {
    elements.days.value = day;
    elements.people.valueAsNumber = people;
    elements.tee_quantity.valueAsNumber = tees;
    elements.rashguard_quantity.valueAsNumber = rashguards;
    update();
    assert.equal(output.hidden, false);
    assert.equal(elements.admission_aud.value, admission.toFixed(2));
    assert.equal(elements.apparel_aud.value, (total - admission).toFixed(2));
    assert.equal(elements.estimated_total_aud.value, total.toFixed(2));
    assert.equal(elements.tee_sizes.disabled, tees === 0);
    assert.equal(elements.rashguard_sizes.disabled, rashguards === 0);
  }
  for (const invalid of [0, 21, 1.5, NaN]) {
    elements.people.valueAsNumber = invalid;
    update();
    assert.equal(output.hidden, true);
    assert.equal(elements.estimated_total_aud.disabled, true);
  }
  elements.request_type.value = 'semi-private-group';
  elements.group_size.value = '6';
  elements.tee_quantity.valueAsNumber = 1;
  elements.rashguard_quantity.valueAsNumber = 2;
  update();
  assert.equal(elements.estimated_total_aud.value, '1227.00');
  assert.deepEqual(Array.from(output.rows, row => row.amount), ['$1,000', '$69', '$158', '$1,227 AUD']);
  for (const invalid of [-1, 1.5, 100, NaN]) {
    elements.tee_quantity.valueAsNumber = invalid;
    update();
    assert.equal(output.hidden, true);
  }
  const catalogItems = vm.runInContext('PIXLEY_ADDONS', context);
  for (const form of sessionForms) {
    for (const item of catalogItems) {
      assert.ok(form.includes('+$' + item.priceCents / 100 + ' AUD each'));
      assert.ok(form.includes('name="' + item.id + '_quantity"'));
      assert.ok(form.includes('name="' + item.id + '_sizes"'));
    }
  }
});
