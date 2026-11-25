import { getSubjectPrompt } from "../config/mm-teacher-prompts.mjs";

const access = document.getElementById("access");
const heading = document.getElementById("access-heading");
const message = document.getElementById("access-note");
const retry = document.getElementById("retry-check");
const form = document.getElementById("teacher-notes");
const year = form.elements.yearLevel;
const checks = Array.from(form.querySelectorAll('[name="subjects"]'));
const notes = document.getElementById("subject-notes");
const error = document.getElementById("send-error");
const submit = document.getElementById("send-notes");
const token = new URLSearchParams(location.hash.slice(1)).get("invite");
const noteFields = new Map();
const responseId = crypto.randomUUID();

function updatePrompts() {
  for (const check of checks) {
    const id = check.value;
    if (!noteFields.has(id)) {
      const field = document.createElement("div");
      const label = document.createElement("label");
      const input = document.createElement("textarea");
      field.className = "teacher-field";
      input.id = "note-" + id;
      input.rows = 2;
      input.maxLength = 500;
      input.required = true;
      label.htmlFor = input.id;
      field.append(label, input);
      notes.append(field);
      noteFields.set(id, { field, label, input });
    }
    const { field, label, input } = noteFields.get(id);
    const prompt = getSubjectPrompt(year.value, id);
    field.hidden = !check.checked || !prompt;
    input.disabled = field.hidden;
    if (!field.hidden) label.textContent = check.parentElement.textContent.trim() + " · " + prompt;
  }
  const other = form.elements.otherSubject;
  other.disabled = !checks.find(check => check.value === "other").checked;
  document.getElementById("other-subject-field").hidden = other.disabled;
  checks[0].setCustomValidity(checks.some(check => check.checked) ? "" : "Choose at least one learning area.");
}

function showNotice(title, text, { focus = false, allowRetry = false } = {}) {
  form.hidden = true;
  access.hidden = false;
  heading.textContent = title;
  message.textContent = text;
  retry.hidden = !allowRetry;
  if (focus) heading.focus();
}

function invalidInvite(status, focus) {
  if (status === 410) {
    showNotice("This invitation has expired", "Ask the parent or carer to share a fresh teacher link.", { focus });
  } else {
    showNotice("This link could not be verified", "Open the complete link your student’s parent or carer shared, or ask them for a fresh one.", { focus });
  }
}

async function post(payload) {
  const result = await fetch("/api/mastery-audit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    credentials: "omit",
    cache: "no-store",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(payload),
  });
  const data = await result.json().catch(() => null);
  return { status: result.status, ok: result.ok, data };
}

async function checkInvite(focus = false) {
  if (!token) return;
  showNotice("Checking invitation…", "Opening your private teacher form.");
  try {
    const { status, ok, data } = await post({ action: "check", token });
    if ([400, 401, 403, 404, 410].includes(status)) {
      invalidInvite(status, focus);
    } else if (!ok || !data || !["", "2", "3"].includes(data.yearLevel)) {
      throw new Error("Verification unavailable");
    } else {
      year.value = data.yearLevel;
      updatePrompts();
      access.hidden = true;
      form.hidden = false;
      if (focus) year.focus();
    }
  } catch {
    showNotice("We couldn’t check this link", "Try again in a moment using this same invitation.", { focus, allowRetry: true });
  }
}

year.addEventListener("change", updatePrompts);
checks.forEach(check => check.addEventListener("change", updatePrompts));
retry.addEventListener("click", () => checkInvite(true));
form.addEventListener("input", event => {
  if (event.target.tagName === "TEXTAREA" || event.target.id === "otherSubject") event.target.setCustomValidity("");
  error.hidden = true;
});
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (submit.disabled) return;
  updatePrompts();
  for (const input of form.querySelectorAll("textarea[required]:enabled, input[type=text][required]:enabled")) {
    input.setCustomValidity(input.value.trim() ? "" : "Add a short response.");
  }
  if (!form.reportValidity()) return;
  const subjects = checks.filter(check => check.checked).map(check => check.value);
  const sectionFields = ["homework", "independent", "supports", "nextGoal"];
  const payload = {
    action: "teacher", token, responseId, yearLevel: year.value, subjects,
    ...(subjects.includes("other") ? { otherSubject: form.elements.otherSubject.value.trim() } : {}),
    ...Object.fromEntries(sectionFields.map(name => [name, form.elements[name].value.trim()])),
    subjectNotes: Object.fromEntries(subjects.map(id => [id, noteFields.get(id).input.value.trim()])),
  };
  error.hidden = true;
  submit.disabled = true;
  form.setAttribute("aria-busy", "true");
  const sections = form.querySelectorAll(":scope > fieldset");
  sections.forEach(section => { section.disabled = true; });
  submit.textContent = "Sending…";
  try {
    const { ok, data, status } = await post(payload);
    if (status === 410 || status === 401 || status === 403) {
      invalidInvite(status, true);
    } else if (!ok || data?.received !== true) {
      throw new Error("Submission unavailable");
    } else {
      form.reset();
      history.replaceState(null, "", location.pathname);
      showNotice("Homework notes received", "Thank you. Your observations are available to the Mastery Method team for the homework audit.", { focus: true });
    }
  } catch {
    error.textContent = "We couldn’t confirm delivery. Your notes are still here. Try sending again from this page.";
    error.hidden = false;
    error.focus();
  } finally {
    sections.forEach(section => { section.disabled = false; });
    form.removeAttribute("aria-busy");
    submit.disabled = false;
    submit.textContent = "Send homework notes";
  }
});

checkInvite();
