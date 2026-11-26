export function parseFormspreeTime(value, field, requireZone = false) {
  // Formspree returns ISO processor dates, sometimes UTC with no suffix. Keep
  // submillisecond precision so adjacent drop windows cannot overlap.
  const match = typeof value === "string" && /^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)(?:\.(\d{1,9}))?(Z|[+-]\d\d:\d\d)?$/.exec(value);
  if (!match || (requireZone && !match[3])) throw Error(`Invalid or missing ${field}. Use an ISO timestamp${requireZone ? " with an explicit time zone" : ""}.`);
  const [, clock, fraction = "", zone = "Z"] = match;
  const millis = Date.parse(clock + zone);
  const wall = new Date(clock + "Z");
  if (!Number.isFinite(millis) || !Number.isFinite(wall.valueOf()) || wall.toISOString().slice(0, 19) !== clock) {
    throw Error(`Invalid calendar date at ${field}.`);
  }
  return BigInt(millis) * 1_000_000n + BigInt(fraction.padEnd(9, "0"));
}
