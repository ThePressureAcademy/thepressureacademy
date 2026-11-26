/** Confirmed booking and merchandise prices in Australian cents. */
export const PIXLEY_SESSIONS = Object.freeze({
  dayPriceCents: 15000,
  dayCapacity: 20,
  groupPriceCents: 100000,
  groupCapacity: 6,
});

// IDs are retained on existing bookings. Earlier shared links and form values use the day aliases.
const seminarChoices = [
  { id: "day1", slug: "wrestling-for-jiu-jitsu", label: "Wrestling for Jiu Jitsu", count: 1, legacySlug: "day-1", legacyLabel: "Day 1" },
  { id: "day2", slug: "front-headlock", label: "Front Headlock", count: 1, legacySlug: "day-2", legacyLabel: "Day 2" },
  { id: "both", slug: "both-seminars", label: "Both seminars", count: 2, legacySlug: "both-days", legacyLabel: "Both days" },
];

export function findPixleySeminar(value) {
  return seminarChoices.find(choice =>
    [choice.id, choice.slug, choice.label, choice.legacySlug, choice.legacyLabel].includes(value)
  );
}

export const PIXLEY_ADDONS = Object.freeze([
  { id: "tee", label: "Tee", name: "Pressure Academy × Pixley Tee", lookupKey: "pixley_2027_tee_aud", priceCents: 6900 },
  { id: "rashguard", label: "Rashguard", name: "Pressure Academy × Pixley Rashguard", lookupKey: "pixley_2027_rashguard_aud", priceCents: 7900 },
]);
