const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const config = fs.readFileSync(path.join(root, 'js/config/funnels.js'), 'utf8').replace(/^export /gm, '');
const html = fs.readFileSync(path.join(root, 'seminars/_event/index.html'), 'utf8');
const source = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/^\s*import[\s\S]*?;\n/gm, '');
function render(status) {
  const elements = Object.fromEntries(['event-main', 'upsell-slot'].map(id => [id, { innerHTML: '' }]));
  const document = {
    title: '', getElementById: id => elements[id] || null,
    querySelector: () => ({ setAttribute() {} }), addEventListener() {},
  };
  const context = vm.createContext({
    document, initMotion() {}, initCart() {}, initMobileNav() {}, enhanceCaptureForms() {}, track() {}, EVENTS: {},
    slugFromPath: () => 'founding-pressure-seminar',
    escapeHtml: value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
    checkoutAction: () => ({ available: false, start() {} }),
  });
  vm.runInContext(config, context);
  if (status) vm.runInContext(`seminars[0].status = ${JSON.stringify(status)};`, context);
  vm.runInContext(source, context);
  return { title: document.title, html: elements['event-main'].innerHTML };
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
