export const SMS_CONSENT_VERSION = "2026-11-26-v1";
export const SMS_CONSENT_TEXT =
  "I agree to receive marketing texts from The Pressure Academy about the topics I selected.";

export const TEXT_TOPIC_LINKS = Object.freeze({
  academy: "https://thepressureacademy.com/#academy-family",
  seminars: "https://thepressureacademy.com/seminars/",
  clothing: "https://thepressureacademy.com/shop/apparel/drops/",
  family: "https://thepressureacademy.com/mastery-method/",
});

// The page also validates these formats during a native, JavaScript-free post.
export function normalizeMobile(raw) {
  if (typeof raw !== "string" || raw.length > 32) return null;
  const number = raw.replace(/[\s().-]/g, "");
  if (/^04\d{8}$/.test(number)) return "+61" + number.slice(1);
  if (/^\+610?4\d{8}$/.test(number)) return "+614" + number.slice(-8);
  if (/^\+(?!61)[1-9]\d{7,14}$/.test(number)) return number;
  return null;
}
