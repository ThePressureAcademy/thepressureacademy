import { parseFormspreeTime } from "./lib/formspree-time.mjs";
import { readFile } from "node:fs/promises";
import { domainToASCII, pathToFileURL } from "node:url";

const sources = new Set(["apparel-lookbook", "home-apparel"]);
const recurringConsentVersion = "pt-releases-2026-11-26-v1";
const usage = `node scripts/release-email-roster.mjs <complete-formspree.json> <release-control.json>

Use the complete, privately retrieved parent-form submissions JSON. Set the
campaign window from the first signup for this release (inclusive) to the
launch cutoff (exclusive). Example private controls:
{"windowStart":"2026-11-01T00:00:00+10:00","windowEnd":"2026-12-01T10:00:00+10:00","suppressed":[],"alreadySent":[]}

Refresh both address lists before each run. Include opt-outs, bounces and
cancellations in suppressed, and this release's sent or in-flight recipients in
alreadySent. The output is a private JSON list. This command never sends email.`;

function emailAddress(value) {
  if (typeof value !== "string") return null;
  const [local, domain, ...rest] = value.trim().toLowerCase().split("@");
  if (!local || !domain || rest.length || local.length > 64 || !/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/u.test(local) ||
      local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;
  // Check hostname syntax before converting international domains to ASCII.
  if (!/^[\p{L}\p{N}\p{M}.-]+$/u.test(domain)) return null;
  const host = domainToASCII(domain);
  const labels = host.split(".");
  if (labels.length < 2 || labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) return null;
  const address = local + "@" + host;
  return address.length <= 254 ? address : null;
}

export function releaseEmailRoster(exported, control) {
  if (!Array.isArray(exported?.submissions)) throw Error("Expected a Formspree JSON export with a submissions array.");
  const start = parseFormspreeTime(control?.windowStart, "windowStart", true);
  const end = parseFormspreeTime(control?.windowEnd, "windowEnd", true);
  if (start >= end) throw Error("windowEnd must be later than windowStart.");

  const excluded = new Set();
  for (const key of ["suppressed", "alreadySent"]) {
    if (!Array.isArray(control[key])) throw Error(`Supply the ${key} address array, even if empty.`);
    for (const [index, entry] of control[key].entries()) {
      const address = emailAddress(entry);
      if (!address) throw Error(`Review the address in ${key}[${index}].`);
      excluded.add(address);
    }
  }

  const recipients = new Set();
  for (const [index, row] of exported.submissions.entries()) {
    if (row?.intent !== "pressure-tested-release-alert" || !sources.has(row.source)) continue;
    const address = emailAddress(row.email);
    if (!address || excluded.has(address)) continue;
    const received = parseFormspreeTime(row._date, `submissions[${index}]._date`);
    const recurring = row.future_clothing_emails === "yes" && row.email_consent_version === recurringConsentVersion;
    if (received < end && (received >= start || recurring)) recipients.add(address);
  }
  return [...recipients].sort();
}

async function readJson(file, label) {
  const raw = await readFile(file, "utf8");
  try { return JSON.parse(raw); }
  catch { throw Error(`Could not parse ${label} as JSON.`); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [receipts, control, ...extra] = process.argv.slice(2);
  if (receipts === "--help") console.log(usage);
  else {
    try {
      if (!receipts || !control || extra.length) throw Error(usage);
      const rows = await readJson(receipts, "the Formspree export");
      const campaign = await readJson(control, "the campaign controls");
      console.log(JSON.stringify(releaseEmailRoster(rows, campaign)));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
