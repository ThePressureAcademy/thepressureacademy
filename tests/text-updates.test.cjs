const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = readFileSync(path.join(root, "text-updates/index.html"), "utf8");
const settings = import("../js/lib/sms-preferences.mjs");
const signup = html.match(/<form\b[^>]*id="sms-signup"[\s\S]*?<\/form>/)[0];
const stop = html.match(/<form\b[^>]*id="sms-stop"[\s\S]*?<\/form>/)[0];

test("signup and stop accept the same mobile formats with or without JavaScript", async () => {
  const { normalizeMobile } = await settings;
  const cases = [
    ["0412 345 678", "+61412345678"], ["(04)12.345-678", "+61412345678"],
    ["+61 (0) 412 345 678", "+61412345678"], ["+61412345678", "+61412345678"],
    ["+64 21 123 4567", "+64211234567"], ["+1 (202) 555-0143", "+12025550143"],
    ["+44 7700 900123", "+447700900123"], ["+999999999999999", "+999999999999999"],
    ["", null], ["        ", null], ["0061 412 345 678", null],
    ["04123", null], ["04 123 456 789", null], ["+61 02 9123 4567", null],
    ["02 9123 4567", null], ["+61 412 345 678 ext.4", null],
    ["+0123456789", null], ["+123", null], ["+1234567890123456", null],
    ["+1++2025550143", null], ["0412345678" + " ".repeat(23), null],
  ];
  for (const form of [signup, stop]) {
    const input = form.match(/<input\b[^>]*type="tel"[^>]*>/)[0];
    const native = new RegExp("^(?:" + input.match(/pattern="([^"]+)"/)[1] + ")$", "u");
    const max = Number(input.match(/maxlength="(\d+)"/)[1]);
    assert.match(input, /\brequired\b/);
    for (const [raw, expected] of cases) {
      assert.equal(normalizeMobile(raw), expected, raw);
      assert.equal(Boolean(raw) && raw.length <= max && native.test(raw), Boolean(expected), raw);
    }
  }
  assert.equal(normalizeMobile(null), null);
});

test("all four visible topic choices have an existing first-party destination", async () => {
  const { TEXT_TOPIC_LINKS } = await settings;
  const options = signup.match(/<select\b[^>]*id="sms-topics"[\s\S]*?<\/select>/)[0];
  assert.match(options, /\bmultiple\b/);
  assert.match(options, /\brequired\b/);
  assert.doesNotMatch(options, /\bselected\b/);
  const slugs = Array.from(options.matchAll(/<option value="([^"]+)"/g), match => match[1]);
  assert.deepEqual(slugs, ["academy", "seminars", "clothing", "family"]);
  assert.deepEqual(Object.keys(TEXT_TOPIC_LINKS), slugs);
  for (const target of Object.values(TEXT_TOPIC_LINKS)) {
    const url = new URL(target);
    assert.equal(url.origin, "https://thepressureacademy.com");
    assert.equal(url.search, "");
    const destination = readFileSync(path.join(root, url.pathname, "index.html"), "utf8");
    if (url.hash) assert.ok(destination.includes('id="' + url.hash.slice(1) + '"'));
  }
});

test("versioned consent evidence matches the signup copy and is absent from withdrawal", async () => {
  const { SMS_CONSENT_TEXT, SMS_CONSENT_VERSION } = await settings;
  const checkbox = signup.match(/<input\b[^>]*name="sms_consent"[^>]*>/)[0];
  assert.match(checkbox, /type="checkbox"/);
  assert.match(checkbox, /value="yes"/);
  assert.match(checkbox, /\brequired\b/);
  assert.doesNotMatch(checkbox, /\bchecked\b/);
  assert.ok(signup.includes(`name="consent_text" value="${SMS_CONSENT_TEXT}"`));
  assert.ok(signup.includes(`name="consent_version" value="${SMS_CONSENT_VERSION}"`));
  assert.ok(signup.includes(`<span>${SMS_CONSENT_TEXT}</span>`));
  assert.match(signup, /name="intent" value="sms-topic-signup"/);
  assert.match(stop, /name="intent" value="sms-stop-all"/);
  for (const form of [signup, stop]) {
    assert.match(form, /name="source" value="text-updates"/);
    assert.match(form, /method="post"/i);
  }
  assert.doesNotMatch(stop, /name="(?:sms_consent|consent_version|topics)"/);
});
