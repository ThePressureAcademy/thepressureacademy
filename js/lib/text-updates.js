import { normalizeMobile, TEXT_TOPIC_LINKS } from "./sms-preferences.mjs";

function enhanceMobile(form) {
  const field = form.elements.namedItem("mobile");
  function validate() {
    const invalid = field.value && !normalizeMobile(field.value);
    field.setCustomValidity(
      invalid ? "Enter an Australian mobile starting with 04, or an international number starting with + and its country code." : "",
    );
  }
  field.addEventListener("input", validate);
  field.addEventListener("change", validate);
  form.addEventListener("reset", () => queueMicrotask(validate));
  form.addEventListener("formdata", ({ formData }) => {
    const number = normalizeMobile(formData.get("mobile"));
    if (number) formData.set("mobile_e164", number);
  });
  validate();
}

function enhanceTopics(form) {
  const select = form.querySelector("#sms-topics");
  const native = form.querySelector("#sms-topic-native");
  const picker = form.querySelector("#sms-topic-picker");
  const summary = form.querySelector("#sms-topic-summary");
  const container = form.querySelector("#sms-topic-options");
  const error = form.querySelector("#sms-topic-error");
  const suggested = new URLSearchParams(location.search).get("topic");
  const choices = Array.from(select.options, (option) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = option.value;
    const title = document.createElement("span");
    title.textContent = option.textContent.trim();
    label.append(checkbox, title);
    container.append(label);
    if (option.value === suggested) {
      label.dataset.suggested = "true";
      picker.open = true;
    }
    checkbox.addEventListener("change", () => {
      option.selected = checkbox.checked;
      updateChoices();
    });
    return { checkbox, option };
  });
  const first = choices[0].checkbox;
  const prompt = "Choose at least one topic.";
  function updateChoices() {
    for (const { checkbox, option } of choices) checkbox.checked = option.selected;
    const selected = select.selectedOptions;
    first.setCustomValidity(selected.length ? "" : prompt);
    if (selected.length) error.textContent = "";
    if (selected.length === 0) summary.textContent = "Choose topics";
    else if (selected.length === 1) summary.textContent = selected[0].textContent.trim();
    else summary.textContent = `${selected.length} topics selected`;
  }

  first.setAttribute("aria-describedby", error.id);
  first.addEventListener("invalid", () => {
    picker.open = true;
    error.textContent = prompt;
  });
  select.addEventListener("change", updateChoices);
  form.addEventListener("reset", () => queueMicrotask(() => {
    error.textContent = "";
    picker.open = false;
    updateChoices();
  }));
  form.addEventListener("formdata", ({ formData }) => {
    const selected = formData.getAll("topics");
    const topics = Object.keys(TEXT_TOPIC_LINKS).filter(topic => selected.includes(topic));
    if (!topics.length) return;
    formData.set("topic_list", topics.join(","));
    formData.set("topic_links", topics.map(topic => TEXT_TOPIC_LINKS[topic]).join("\n"));
  });

  updateChoices();
  select.required = false;
  native.hidden = true;
  picker.hidden = false;
}

export function initTextUpdates() {
  const signup = document.getElementById("sms-signup");
  const stop = document.getElementById("sms-stop");
  for (const form of [signup, stop]) {
    if (!form || form.dataset.smsEnhanced) continue;
    enhanceMobile(form);
    if (form === signup) enhanceTopics(form);
    form.dataset.smsEnhanced = "true";
  }
}
