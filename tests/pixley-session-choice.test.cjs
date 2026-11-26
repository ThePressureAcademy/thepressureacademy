const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

const root = join(__dirname, "..");
const path = "https://example.test/seminars/michael-pixley-march-2027/";
const page = readFileSync(join(root, "seminars/michael-pixley-march-2027/index.html"), "utf8");
const catalog = readFileSync(join(root, "js/config/pixley-collab.mjs"), "utf8").replace(/^export /gm, "");
const source = readFileSync(join(root, "js/lib/pixley-session-choice.js"), "utf8").replace(/^import .*;$/gm, "");

function setup(suffix) {
  const location = { href: path + suffix };
  const history = {
    pushState(_state, _title, url) { location.href = String(url); },
    replaceState(_state, _title, url) { location.href = String(url); },
  };
  const listeners = {};
  const select = {
    value: "", addEventListener(type, callback) { listeners[type] = callback; },
    dispatchEvent(event) { listeners[event.type](); },
    focus() { this.focused = true; }, scrollIntoView() {},
  };
  const links = [...page.matchAll(/href="(\?session=[^"]+#seminar-request)"/g)]
    .map(match => ({
      href: new URL(match[1], path).href,
      addEventListener(type, callback) { this[type] = callback; },
    }));
  const document = {
    getElementById() { return { elements: { namedItem() { return select; } } }; },
    querySelectorAll() { return links; },
  };
  vm.runInNewContext(catalog + "\n" + source, { URL, Event, history, location, document, window: { addEventListener() {} } });
  return { select, links, location };
}

test("advertised Pixley session links select the correct editable request and follow subsequent edits", () => {
  const { select, links, location } = setup("?session=day-2#seminar-request");
  assert.equal(select.value, "Front Headlock");
  assert.equal(location.href, path + "?session=front-headlock#seminar-request");
  assert.equal(links.length, 3);
  for (const [index, label] of ["Wrestling for Jiu Jitsu", "Front Headlock", "Both seminars"].entries()) {
    links[index].click({ button: 0, preventDefault() {} });
    assert.equal(select.value, label);
    assert.equal(select.focused, true);
  }
  select.value = "Wrestling for Jiu Jitsu";
  select.dispatchEvent(new Event("change"));
  assert.equal(location.href, path + "?session=wrestling-for-jiu-jitsu#seminar-request");
  assert.equal(setup("?session=day-1#seminar-request").select.value, "Wrestling for Jiu Jitsu");
  assert.equal(setup("?session=both-days#seminar-request").select.value, "Both seminars");
  assert.equal(setup("?session=unknown#seminar-request").select.value, "");
  assert.equal(setup("?session=day-1#group-request").select.value, "");
});
