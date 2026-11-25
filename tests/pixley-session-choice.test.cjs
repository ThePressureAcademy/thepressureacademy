const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");

const root = join(__dirname, "..");
const path = "https://example.test/seminars/michael-pixley-march-2027/";
const page = readFileSync(join(root, "seminars/michael-pixley-march-2027/index.html"), "utf8");
const source = readFileSync(join(root, "js/lib/pixley-session-choice.js"), "utf8");

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
  const links = [...page.matchAll(/class="pixley-choices">([^\n]+)/g)]
    .flatMap(match => [...match[1].matchAll(/href="(\?session=[^"]+)"/g)])
    .map(match => ({
      href: new URL(match[1], path).href,
      addEventListener(type, callback) { this[type] = callback; },
    }));
  const document = {
    getElementById() { return { elements: { namedItem() { return select; } } }; },
    querySelectorAll() { return links; },
  };
  vm.runInNewContext(source, { URL, Event, history, location, document, window: { addEventListener() {} } });
  return { select, links, location };
}

test("advertised Pixley session links select the correct editable request and follow subsequent edits", () => {
  const { select, links, location } = setup("?session=day-2#seminar-request");
  assert.equal(select.value, "Day 2");
  assert.equal(links.length, 3);
  for (const [index, label] of ["Day 1", "Day 2", "Both days"].entries()) {
    links[index].click({ button: 0, preventDefault() {} });
    assert.equal(select.value, label);
    assert.equal(select.focused, true);
  }
  select.value = "Day 1";
  select.dispatchEvent(new Event("change"));
  assert.equal(location.href, path + "?session=day-1#seminar-request");
  assert.equal(setup("?session=unknown#seminar-request").select.value, "");
  assert.equal(setup("?session=day-1#group-request").select.value, "");
});
