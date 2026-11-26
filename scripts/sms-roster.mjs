import { parseFormspreeTime } from "./lib/formspree-time.mjs";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { normalizeMobile, TEXT_TOPIC_LINKS } from "../js/lib/sms-preferences.mjs";

// Keep the exact wording of earlier consent versions when the form changes.
const consentStatements = new Map([
  ["2026-11-26-v1", "I agree to receive marketing texts from The Pressure Academy about the topics I selected."],
]);

const usage = `node scripts/sms-roster.mjs <complete-formspree.json> <academy|seminars|clothing|family|stopped>

Read all parent-form receipts, including all previous stops, from a trusted
Formspree JSON export with a submissions array and processor _date on signups.
Output is a private JSON array of international-format mobile numbers.
Keep the export and output outside this repository. Use the stopped segment
and the messaging provider's own suppressions before sending. No messages are sent.`;

function readTopics(raw) {
  const values = typeof raw === "string" ? raw.split(",") : raw;
  if (!Array.isArray(values) || values.length === 0) return null;
  const topics = new Set();
  for (const value of values) {
    if (typeof value !== "string" || !Object.hasOwn(TEXT_TOPIC_LINKS, value.trim())) return null;
    topics.add(value.trim());
  }
  return topics;
}

function consentedTopics(row) {
  if (row.source !== "text-updates" || row.sms_consent !== "yes" ||
      !consentStatements.has(row.consent_version) ||
      consentStatements.get(row.consent_version) !== row.consent_text) return new Set();
  const topics = readTopics(row.topics);
  if (!topics) return new Set();
  // Enhanced forms also send a canonical topic list. A disagreement needs review.
  if (row.topic_list != null && row.topic_list !== "") {
    const summary = readTopics(row.topic_list);
    if (!summary || topics.size !== summary.size || [...topics].some(topic => !summary.has(topic))) return new Set();
  }
  return topics;
}

export function smsRoster(input, segment) {
  if (segment !== "stopped" && !Object.hasOwn(TEXT_TOPIC_LINKS, segment)) throw Error("Choose a topic or stopped.");
  if (!Array.isArray(input?.submissions)) throw Error("Expected a complete Formspree JSON export with a submissions array.");
  const latest = new Map();
  const stopped = new Set();
  for (const [index, row] of input.submissions.entries()) {
    if (row?.intent !== "sms-topic-signup" && row?.intent !== "sms-stop-all") continue;
    const mobile = normalizeMobile(row.mobile);
    if (row.intent === "sms-stop-all") {
      if (!mobile) throw Error(`Review the mobile on stop request at submissions[${index}] before using the list.`);
      stopped.add(mobile);
      continue;
    }
    if (!mobile) continue;
    const field = `Formspree receipt _date at submissions[${index}]`;
    let time;
    try { time = parseFormspreeTime(row._date, field); }
    catch { throw Error(`Missing or invalid ${field}.`); }
    const topics = consentedTopics(row);
    const previous = latest.get(mobile);
    if (!previous || time > previous.time) latest.set(mobile, { time, topics });
    else if (time === previous.time) {
      // When two receipts are indistinguishable in time, use only their common choices.
      for (const topic of previous.topics) if (!topics.has(topic)) previous.topics.delete(topic);
    }
  }
  if (segment === "stopped") return [...stopped].sort();
  return [...latest.keys()].filter(mobile => !stopped.has(mobile) && latest.get(mobile).topics.has(segment)).sort();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [file, segment, ...extra] = process.argv.slice(2);
  if (file === "--help") console.log(usage);
  else {
    try {
      if (!file || !segment || extra.length) throw Error(usage);
      const contents = await readFile(file, "utf8");
      let receipts;
      try { receipts = JSON.parse(contents); }
      catch { throw Error("Could not parse the Formspree JSON file."); }
      console.log(JSON.stringify(smsRoster(receipts, segment)));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
