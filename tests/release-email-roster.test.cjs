const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, mkdtempSync, writeFileSync, rmSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const { tmpdir } = require("node:os");
const path = require("node:path");

const roster = import("../scripts/release-email-roster.mjs");
const start = "2026-11-19T00:00:00.123456Z";
const end = "2026-11-25T11:00:00+10:00";
const earlier = "2026-10-19T16:47:00.309389";
const version = "pt-releases-2026-11-26-v1";
const current = { windowStart: start, windowEnd: end, suppressed: [], alreadySent: [] };

function receipt(email, options = {}) {
  return { intent: "pressure-tested-release-alert", source: "apparel-lookbook", email, _date: start, ...options };
}

async function eligible(rows, controls = current) {
  const { releaseEmailRoster } = await roster;
  return releaseEmailRoster({ submissions: rows }, controls);
}

test("combine both clothing forms and deduplicate across source, case and retry; preserve distinct plus addresses", async () => {
  const rows = [
    receipt("Athlete@Example.org"), receipt("FAN+blue@example.org"),
    receipt(" athlete@example.org ", { source: "home-apparel" }), receipt("fan@example.org"),
    receipt("quality@éxample.org"), receipt("quality@xn--xample-9ua.org"),
  ];
  assert.deepEqual(await eligible(rows), ["athlete@example.org", "fan+blue@example.org", "fan@example.org", "quality@xn--xample-9ua.org"]);
});

test("window is inclusive at start and exclusive at end even for fractional receipts and local offsets", async () => {
  const recurring = { future_clothing_emails: "yes", email_consent_version: version };
  const rows = [
    receipt("before@example.org", { _date: "2026-11-19T00:00:00.123455" }),
    receipt("first@example.org", { _date: "2026-11-19T10:00:00.123456+10:00" }),
    receipt("last@example.org", { _date: "2026-11-25T00:59:59.999999" }),
    receipt("late@example.org", { ...recurring, _date: "2026-11-25T01:00:00.000000Z" }),
  ];
  assert.deepEqual(await eligible(rows), ["first@example.org", "last@example.org"]);
});

test("legacy, unchecked and unknown consent cover the requested drop only; prior explicit recurring consent qualifies", async () => {
  const old = { _date: earlier };
  const yes = { future_clothing_emails: "yes", email_consent_version: version };
  const rows = [
    receipt("old-recurring@example.org", { ...old, ...yes, source: "home-apparel" }),
    receipt("legacy-this@example.org"), receipt("unknown-this@example.org", { email_consent_version: "unknown" }),
    receipt("legacy-old@example.org", old), receipt("unchecked-old@example.org", { ...old, email_consent_version: version }),
    receipt("no-version@example.org", { ...old, future_clothing_emails: "yes" }),
    receipt("no-consent@example.org", { ...old, future_clothing_emails: "no", email_consent_version: version }),
    receipt("unknown-old@example.org", { ...old, future_clothing_emails: "yes", email_consent_version: "unknown" }),
  ];
  assert.deepEqual(await eligible(rows), ["legacy-this@example.org", "old-recurring@example.org", "unknown-this@example.org"]);
});

test("ignore unrelated forms, reply-to addresses and malformed or multiple recipient fields", async () => {
  const rows = [
    receipt("pixley@example.org", { intent: "pixley-date-alert" }), receipt("fake@example.org", { source: "other-page" }),
    receipt("", { _replyto: "reply@example.org" }), receipt(["one@example.org"]), receipt("A <a@example.org>"),
    receipt("bad@@example.org"), receipt("line@example.org\r\nBcc: copy@example.org"), receipt("x@bad-.org"),
    receipt("one@example.org,two@example.org"), receipt("local..part@example.org"),
  ];
  assert.deepEqual(await eligible(rows), []);
});

test("removals and in-flight or previous recipients override historic recurring and new requests", async () => {
  const yes = { _date: earlier, future_clothing_emails: "yes", email_consent_version: version };
  const rows = [receipt("a@example.org", yes), receipt("a@example.org"), receipt("b@example.org", yes), receipt("c@example.org")];
  const control = { ...current, suppressed: [" A@EXAMPLE.ORG  "], alreadySent: ["B@Example.org"] };
  assert.deepEqual(await eligible(rows, control), ["c@example.org"]);
});

test("malformed controls, exports, operator lists and missing processor timestamps cannot yield a send list", async () => {
  const { releaseEmailRoster } = await roster;
  assert.throws(() => releaseEmailRoster([], current), /submissions array/);
  for (const invalid of [
    {}, { ...current, alreadySent: null }, { ...current, suppressed: "a@example.org" }, { ...current, alreadySent: [""] },
    { ...current, windowStart: "2026-11-19T00:00:00" }, { ...current, windowEnd: start },
    { ...current, windowStart: "2026-02-31T00:00:00Z" }, { ...current, windowEnd: "now" },
  ]) {
    await assert.rejects(eligible([receipt("one@example.org")], invalid));
  }
  await assert.rejects(eligible([receipt("one@example.org", { _date: null, submittedAt: start })]), /_date/);
});

test("forms match the consent contract and the CLI returns JSON or a private-data-free error", async t => {
  const root = path.resolve(__dirname, "..");
  for (const page of ["index.html", "shop/apparel/drops/index.html"]) {
    const html = readFileSync(path.join(root, page), "utf8");
    assert.match(html, /name="future_clothing_emails" value="yes"/);
    assert.ok(html.includes('name="email_consent_version" value="' + version + '"'));
  }
  const directory = mkdtempSync(path.join(tmpdir(), "release-email-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const input = path.join(directory, "input.json");
  const file = path.join(directory, "control.json");
  const run = () => spawnSync(process.execPath, [path.join(root, "scripts/release-email-roster.mjs"), input, file], { encoding: "utf8" });
  writeFileSync(input, JSON.stringify({ submissions: [receipt("one@example.org")] }));
  writeFileSync(file, JSON.stringify(current));
  assert.deepEqual(JSON.parse(run().stdout), ["one@example.org"]);
  writeFileSync(file, "private malformed content one@example.org");
  const failed = run();
  assert.equal(failed.status, 1);
  assert.equal(failed.stdout, "");
  assert.match(failed.stderr, /campaign controls/);
  assert.ok(!failed.stderr.includes("one@example.org"));
});
