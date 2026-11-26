import { findPixleySeminar } from "../config/pixley-collab.mjs";

const form = document.getElementById("pixley-days-form");
const select = form.elements.namedItem("days");

function applyLinkedChoice(url) {
  const seminar = findPixleySeminar(url.searchParams.get("session"));
  if (url.hash !== "#seminar-request" || !seminar) return;
  select.value = seminar.label;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

document.querySelectorAll('.pixley-choices a[href^="?session="]').forEach(link => {
  link.addEventListener("click", event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const url = new URL(link.href);
    if (url.href !== location.href) history.pushState(null, "", url);
    applyLinkedChoice(url);
    // Focus the editable choice without resetting any previously entered party or contact details.
    select.focus({ preventScroll: true });
    select.scrollIntoView({ block: "center" });
  });
});

// A copied session link follows a visitor's edited selection.
select.addEventListener("change", () => {
  const url = new URL(location.href);
  if (url.hash !== "#seminar-request" || !url.searchParams.has("session")) return;
  const choice = findPixleySeminar(select.value)?.slug;
  if (choice === url.searchParams.get("session")) return;
  if (choice) url.searchParams.set("session", choice);
  else url.searchParams.delete("session");
  history.replaceState(history.state, "", url);
});

applyLinkedChoice(new URL(location.href));
window.addEventListener("popstate", () => applyLinkedChoice(new URL(location.href)));
