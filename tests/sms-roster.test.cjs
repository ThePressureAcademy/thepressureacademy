const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { mkdtempSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const rosterModule = import("../scripts/sms-roster.mjs");
const preferences = import("../js/lib/sms-preferences.mjs");

const first = "2026-11-20T01:02:03.345001";
const later = "2026-11-20T01:02:03.345002Z";
const au = "+61491570006";
const nz = "+64210000000";

async function signup(overrides = {}) {
  const { SMS_CONSENT_VERSION, SMS_CONSENT_TEXT } = await preferences;
  return {
    intent: "sms-topic-signup", source: "text-updates", mobile: "0491 570 006",
    topics: ["academy", "seminars"], _date: first, sms_consent: "yes",
    consent_version: SMS_CONSENT_VERSION, consent_text: SMS_CONSENT_TEXT, ...overrides,
  };
}

async function list(rows, topic) {
  const { smsRoster } = await rosterModule;
  return smsRoster({ submissions: rows }, topic);
}

test("native and enhanced receipts reconcile into a topic-specific list; latest choices replace previous ones", async () => {
  const older = await signup();
  const newer = await signup({ _date: later, mobile: "+61 (0)491570006", topics: "clothing,family", topic_list: "family,clothing" });
  const other = await signup({ mobile: nz, topics: "family", topic_list: "" });
  const rows = [newer, other, older, older, { intent: "seminar-waitlist", mobile: au, topics: "seminars" }];
  assert.deepEqual(await list(rows, "academy"), []);
  assert.deepEqual(await list(rows, "seminars"), []);
  assert.deepEqual(await list(rows, "clothing"), [au]);
  assert.deepEqual(await list(rows, "family"), [au, nz]);
});

test("web stops override both earlier grants and later anonymous re-signups in any input order", async () => {
  const one = await signup();
  const two = await signup({ _date: later, topics: "seminars" });
  const stop = { intent: "sms-stop-all", mobile: au };
  for (const rows of [[one, stop, two], [two, one, stop], [stop, stop, two, one]]) {
    assert.deepEqual(await list(rows, "seminars"), []);
    assert.deepEqual(await list(rows, "stopped"), [au]);
  }
});

test("invalid latest consent, source, topics or mismatched enhanced evidence grants no topics", async () => {
  const previous = await signup();
  for (const broken of [
    { sms_consent: "" }, { consent_text: "different" }, { consent_version: "future-version" },
    { source: "seminars" }, { topics: [] }, { topics: "academy,unknown" }, { topics: "__proto__" },
    { topics: null, topic_list: "academy" }, { topics: "academy", topic_list: "academy,clothing" },
  ]) {
    assert.deepEqual(await list([await signup({ ...broken, _date: later }), previous], "academy"), []);
  }
});

test("same timestamp retains only common choices and accepts equivalent ISO offsets", async () => {
  const one = await signup({ _date: "2026-11-20T11:02:03.345001+10:00" });
  const two = await signup({ topics: ["academy", "family"] });
  for (const rows of [[one, two], [two, one]]) {
    assert.deepEqual(await list(rows, "academy"), [au]);
    assert.deepEqual(await list(rows, "seminars"), []);
    assert.deepEqual(await list(rows, "family"), []);
  }
});

test("use the trusted Formspree date and the raw entered number; reject ambiguous stops", async () => {
  const { smsRoster } = await rosterModule;
  const row = await signup();
  assert.throws(() => smsRoster({ rows: [row] }, "seminars"), /submissions array/);
  assert.throws(() => smsRoster({ submissions: [row] }, "all"), /Choose a topic/);
  for (const date of [null, "2026-02-31T00:00:00Z", "today"]) {
    await assert.rejects(list([{ ...row, _date: date, browser_date: first }], "academy"), /receipt _date/);
  }
  assert.deepEqual(await list([{ ...row, mobile: undefined, mobile_e164: au }], "academy"), []);
  await assert.rejects(list([row, { intent: "sms-stop-all", mobile: "bad" }], "academy"), /stop request/);
});

test("CLI prints one segment or a private-data-free error with an unsuccessful exit", async t => {
  const directory = mkdtempSync(path.join(tmpdir(), "academy-sms-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const input = path.join(directory, "receipts.json");
  const script = path.resolve(__dirname, "../scripts/sms-roster.mjs");
  const run = () => spawnSync(process.execPath, [script, input, "family"], { encoding: "utf8" });
  writeFileSync(input, JSON.stringify({ submissions: [await signup({ topics: "family" })] }));
  assert.deepEqual(JSON.parse(run().stdout), [au]);
  writeFileSync(input, "invalid private content " + au);
  const failure = run();
  assert.equal(failure.status, 1);
  assert.equal(failure.stdout, "");
  assert.match(failure.stderr, /Could not parse/);
  assert.equal(failure.stderr.includes(au), false);
});
