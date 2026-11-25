import { initMobileNav } from "./commerce-ui.js";

initMobileNav();

const reel = document.querySelector(".pt-reel");
const frames = Array.from(reel.querySelectorAll(".pt-frame"));
const status = document.querySelector(".pt-status");
let activeIndex = -1;
let repaint = 0;

function currentIndex() {
  return Math.max(0, Math.min(frames.length - 1, Math.round(reel.scrollLeft / reel.clientWidth)));
}

function syncControls() {
  const index = currentIndex();
  if (index === activeIndex) return;
  for (const [position, frame] of frames.entries()) {
    for (const link of frame.querySelectorAll("[data-step]")) {
      link.tabIndex = position === index ? 0 : -1;
    }
  }
  if (activeIndex !== -1) status.textContent = frames[index].querySelector("img").alt;
  activeIndex = index;
}

function moveTo(frame, focusStep) {
  reel.scrollLeft = frame.offsetLeft;
  syncControls();
  if (focusStep) {
    frame.querySelector('[data-step="' + focusStep + '"]').focus({ preventScroll: true });
  }
}

function navigate(frame, focusStep) {
  if (location.hash !== "#" + frame.id) history.pushState(null, "", "#" + frame.id);
  moveTo(frame, focusStep);
}

function restoreLocation() {
  const target = document.getElementById(location.hash.slice(1));
  const frame = target?.closest(".pt-frame");
  if (frame || !location.hash) moveTo(frame || frames[0]);
}

reel.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-step]");
  if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const frame = document.getElementById(link.hash.slice(1));
  navigate(frame, link.dataset.step);
});

reel.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const index = currentIndex();
  const destinations = {
    ArrowLeft: (index + frames.length - 1) % frames.length,
    ArrowRight: (index + 1) % frames.length,
    Home: 0,
    End: frames.length - 1
  };
  if (!Object.hasOwn(destinations, event.key)) return;
  event.preventDefault();
  navigate(frames[destinations[event.key]], event.target.closest("[data-step]")?.dataset.step);
});

reel.addEventListener("scroll", () => {
  cancelAnimationFrame(repaint);
  repaint = requestAnimationFrame(syncControls);
}, { passive: true });

window.addEventListener("popstate", restoreLocation);
window.addEventListener("hashchange", restoreLocation);
restoreLocation();
syncControls();
