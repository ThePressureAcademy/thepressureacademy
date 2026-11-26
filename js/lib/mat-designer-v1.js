import { academyPlanLink } from './mat-quote-mix.js';
import { tatamiMat } from '../config/commerce.js';
import { createLayout, applyPattern, editLayout, cellAt, summarizeLayout, serializeLayout, encodeLayout, decodeLayout } from './mat-layout-v1.js';

const inks = {
  'Ruby Red': '#921c36', 'Matte White': '#f1f0eb', 'Jet Black': '#191b1c',
  'Rust Orange': '#af4f29', 'Night Grey': '#54585c',
};
const money = new Intl.NumberFormat('en-AU', { style: 'currency', currency: tatamiMat.currency, maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 4 });
const svgNS = 'http://www.w3.org/2000/svg';
const definitions = `<defs>
  <pattern id="floor-lattice" width="1" height="1" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#ede9df"/><path d="M0 1V0H1" fill="none" stroke="#aca99d" stroke-width=".028"/></pattern>
  <pattern id="floor-strip" width=".18" height=".18" patternUnits="userSpaceOnUse"><rect width=".18" height=".18" fill="#e1dbcc"/><path d="M-.05 .05L.05 -.05 M0 .18L.18 0 M.13 .23L.23 .13" stroke="#b7b2a2" stroke-width=".025"/></pattern>
  <pattern id="floor-block" width=".23" height=".23" patternUnits="userSpaceOnUse"><rect width=".23" height=".23" fill="#bdb6a4"/><path d="M-.05 .05L.05 -.05 M0 .23L.23 0 M.18 .28L.28 .18" stroke="#6c685f" stroke-width=".035"/></pattern>
  <pattern id="floor-rib-h" width=".08" height=".08" patternUnits="userSpaceOnUse"><path d="M0 .04H.08" stroke="#fff" stroke-opacity=".11" stroke-width=".012"/></pattern>
  <pattern id="floor-rib-v" width=".08" height=".08" patternUnits="userSpaceOnUse"><path d="M.04 0V.08" stroke="#fff" stroke-opacity=".11" stroke-width=".012"/></pattern>
</defs>`;

function renderFloor(svg, layout) {
  const { widthM, lengthM, cols, rows } = layout;
  svg.setAttribute('viewBox', `0 0 ${widthM} ${lengthM}`);
  // Coordinates and colours come exclusively from the validated layout model and catalogue.
  const mats = layout.mats.map(({ x, y, orientation, colour }) => {
    const bounds = `x="${x}" y="${y}" width="${orientation === 'h' ? 2 : 1}" height="${orientation === 'h' ? 1 : 2}"`;
    return `<g><rect ${bounds} fill="${inks[colour]}"/><rect ${bounds} fill="url(#floor-rib-${orientation})" stroke="#ede9df" stroke-width=".035"/></g>`;
  });
  const blocks = layout.blocked.map(({ x, y }) => `<rect x="${x}" y="${y}" width="1" height="1" fill="url(#floor-block)" stroke="#726c60" stroke-width=".04"/>`);
  svg.innerHTML = definitions + `<rect width="${widthM}" height="${lengthM}" fill="url(#floor-strip)"/><rect width="${cols}" height="${rows}" fill="url(#floor-lattice)"/>` + mats.join('') + blocks.join('') +
    `<g data-design-cursor visibility="hidden" pointer-events="none"><rect x=".035" y=".035" width=".93" height=".93" fill="none" stroke="#151515" stroke-width=".075"/><rect x=".06" y=".06" width=".88" height=".88" fill="none" stroke="#ffb77d" stroke-width=".05" stroke-dasharray=".16 .055"/></g>`;
}

export function initMatDesigner({ clubEditor = false } = {}) {
  const root = document.getElementById('floor-planner');
  if (!root) return;
  const get = id => root.querySelector(`#designer-${id}`);
  const board = get('board');
  const room = get('room');
  const width = get('width');
  const length = get('length');
  const patternInput = get('pattern');
  const zoom = get('zoom');
  const status = get('status');
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'display:block;flex:none;max-width:none;margin:auto';
  board.appendChild(svg);

  const sharedCode = new URL(location.href).searchParams.get('plan');
  const sharedLayout = sharedCode ? decodeLayout(sharedCode) : null;
  let layout = sharedLayout || createLayout(5, 4, 'checker');
  let selectedColour = 'Rust Orange';
  let tool = 'paint';
  let orientation = 'h';
  let pattern = 'checker';
  let custom = Boolean(sharedLayout);
  let appliedColours = ['Night Grey', 'Rust Orange'];
  let zoomed = false;
  let showCursor = false;
  let x = 0;
  let y = 0;
  const history = [];
  const hints = {
    paint: 'Choose a colour, then tap any mat to repaint it.',
    place: 'Tap an empty square for the first half of a mat. The second half extends right or down.',
    remove: 'Tap a mat to lift it, or tap a blocked square to clear it.',
    block: 'Tap a square to mark a 1 m² obstacle. This lifts any mat underneath. Tap again to clear it.',
  };

  function sizeBoard() {
    const available = Math.max(1, board.clientWidth - parseFloat(getComputedStyle(board).paddingLeft || 0) - parseFloat(getComputedStyle(board).paddingRight || 0));
    const fit = Math.min(available / layout.widthM, 420 / layout.lengthM);
    const scale = zoomed ? Math.max(48, fit * 1.45) : fit;
    svg.style.width = `${layout.widthM * scale}px`;
    svg.style.height = `${layout.lengthM * scale}px`;
  }

  function reportCell(announce = true) {
    const cursor = svg.querySelector('[data-design-cursor]');
    cursor.setAttribute('visibility', showCursor ? 'visible' : 'hidden');
    cursor.setAttribute('transform', `translate(${x} ${y})`);
    if (!announce) return;
    const { mat, blocked } = cellAt(layout, x, y);
    const contents = mat ? `${mat.colour} mat, ${mat.orientation === 'h' ? 'horizontal' : 'vertical'}` : blocked ? 'blocked' : 'empty';
    get('live-cell').textContent = `Column ${x + 1}, row ${y + 1}. ${contents}.`;
  }

  function choiceState() {
    for (const el of root.querySelectorAll('[data-mat-colour]')) el.setAttribute('aria-pressed', String(el.dataset.matColour === selectedColour));
    for (const el of root.querySelectorAll('[data-mat-tool]')) el.setAttribute('aria-pressed', String(el.dataset.matTool === tool));
    for (const el of root.querySelectorAll('[data-mat-orientation]')) el.setAttribute('aria-pressed', String(el.dataset.matOrientation === orientation));
    get('orientation').hidden = tool !== 'place';
    get('hint').textContent = hints[tool];
    zoom.setAttribute('aria-pressed', String(zoomed));
    zoom.textContent = zoomed ? 'Fit whole floor' : 'Zoom in';
  }

  function planUrl() {
    const url = new URL('/shop/mats/', document.querySelector('link[rel="canonical"]').href);
    url.searchParams.set('plan', encodeLayout(layout));
    url.hash = 'floor-planner';
    return url.href;
  }

  function reportPlan(eventName) {
    const totals = summarizeLayout(layout);
    const { placed, areaM2, roomAreaM2, blockedAreaM2, uncoveredAreaM2, orderQuantity, extraMats, subtotalCents, colours } = totals;
    get('width-label').textContent = `${number.format(layout.widthM)} m`;
    get('length-label').textContent = `${number.format(layout.lengthM)} m`;
    get('count').textContent = `${placed} ${placed === 1 ? 'mat' : 'mats'}`;
    get('area').textContent = `${number.format(areaM2)} m²`;
    get('subtotal').textContent = `AUD ${money.format(subtotalCents / 100)}`;
    const minimum = extraMats ? `${placed} laid + ${extraMats} extra to meet the ${tatamiMat.minimumQuantity}-mat minimum. ` : '';
    get('minimum').textContent = minimum + `${number.format(roomAreaM2)} m² room · ${number.format(uncoveredAreaM2)} m² open` + (blockedAreaM2 ? ` · ${number.format(blockedAreaM2)} m² blocked` : '') + '.';
    const breakdown = get('breakdown');
    breakdown.replaceChildren();
    const byColour = [];
    for (const colour of tatamiMat.colours) {
      if (!colours[colour]) continue;
      const item = document.createElement('li');
      const chip = document.createElement('span');
      chip.setAttribute('aria-hidden', 'true');
      chip.className = 'designer-count-chip';
      chip.style.backgroundColor = inks[colour];
      item.append(chip, `${colour} × ${colours[colour]}`);
      breakdown.appendChild(item);
      byColour.push(`${colour} × ${colours[colour]}`);
    }
    get('undo').disabled = !history.length;
    get('use').disabled = !placed;
    get('academy').hidden = !placed || clubEditor;
    if (placed && !clubEditor) get('academy').href = academyPlanLink(encodeLayout(layout), null, document.getElementById('mat-request').elements.request_mat_specifications.checked);
    if (eventName) {
      const summary = `${layout.widthM} × ${layout.lengthM} m room. ${placed} mats laid (${number.format(areaM2)} m²). ${byColour.join(', ')}. ${minimum}${orderQuantity} mats requested, AUD ${money.format(subtotalCents / 100)} before freight. ${number.format(uncoveredAreaM2)} m² open, ${blockedAreaM2} m² blocked.`;
      document.dispatchEvent(new CustomEvent(eventName, { detail: { quantity: orderQuantity, placed, colours, width: layout.widthM, length: layout.lengthM, layout: serializeLayout(layout), planUrl: planUrl(), summary } }));
    }
  }

  function redraw(eventName) {
    x = Math.min(x, layout.cols - 1);
    y = Math.min(y, layout.rows - 1);
    renderFloor(svg, layout);
    sizeBoard();
    reportCell(showCursor);
    reportPlan(eventName);
  }

  function replace(next, nextPattern, nextCustom, message) {
    history.push({ layout, pattern, custom, appliedColours });
    if (history.length > 60) history.shift();
    get('share-fallback').hidden = true;
    get('share').textContent = 'Copy plan link';
    layout = next;
    pattern = nextPattern;
    custom = nextCustom;
    status.textContent = message;
    redraw('tatami:layout-changed');
  }

  function act() {
    const result = editLayout(layout, x, y, tool, selectedColour, orientation);
    if (result.changed) replace(result.layout, pattern, true, result.message);
    else status.textContent = result.message;
  }

  // Newly added room area is left open for a hand-edited design. Off-grid pieces are lifted whole.
  function resized(w, l) {
    const next = createLayout(w, l, custom ? 'blank' : pattern, ...appliedColours);
    if (!next || !custom) return next;
    next.blocked = layout.blocked.filter(cell => cell.x < next.cols && cell.y < next.rows);
    next.mats = layout.mats.filter(mat => mat.x + (mat.orientation === 'h' ? 2 : 1) <= next.cols && mat.y + (mat.orientation === 'v' ? 2 : 1) <= next.rows);
    return next;
  }

  function patternColours(value) {
    return value === 'solid' ? [selectedColour, 'Rust Orange'] : ['Night Grey', selectedColour === 'Night Grey' ? 'Rust Orange' : selectedColour];
  }

  room.addEventListener('submit', event => {
    event.preventDefault();
    if (!room.reportValidity()) return;
    const w = width.valueAsNumber;
    const l = length.valueAsNumber;
    if (w === layout.widthM && l === layout.lengthM) { status.textContent = 'The board already uses these measurements.'; return; }
    const next = resized(w, l);
    if (next) {
      const note = custom ? ' Only whole mats inside the new room are kept.' : '';
      replace(next, pattern, custom, `Room updated to ${w} × ${l} m.${note}`);
    }
  });
  get('apply-pattern').addEventListener('click', () => {
    const requested = patternInput.value;
    const colours = patternColours(requested);
    const next = applyPattern(layout, requested, ...colours);
    if (!next) return;
    replace(next, requested, layout.blocked.length > 0, requested === 'blank' ? 'Mats cleared. Use Place to draw your layout.' : 'Pattern applied. Choose a colour and tap a mat to customise it.');
    appliedColours = colours;
    tool = requested === 'blank' ? 'place' : 'paint';
    choiceState();
  });
  root.addEventListener('click', event => {
    const el = event.target.closest('[data-mat-colour], [data-mat-tool], [data-mat-orientation]');
    if (!el) return;
    if (el.dataset.matTool) tool = el.dataset.matTool;
    if (el.dataset.matOrientation) orientation = el.dataset.matOrientation;
    if (el.dataset.matColour) {
      selectedColour = el.dataset.matColour;
      if (tool !== 'place') tool = 'paint';
    }
    choiceState();
  });
  svg.addEventListener('click', event => {
    const bounds = svg.getBoundingClientRect();
    const col = Math.floor((event.clientX - bounds.left) * layout.widthM / bounds.width);
    const row = Math.floor((event.clientY - bounds.top) * layout.lengthM / bounds.height);
    if (col < 0 || row < 0 || col >= layout.cols || row >= layout.rows) {
      status.textContent = 'This edge strip is narrower than a whole metre. Place whole mats inside the grid.';
      return;
    }
    x = col; y = row; showCursor = false;
    board.focus({ preventScroll: true });
    act();
    reportCell(false);
  });
  const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  board.addEventListener('focus', () => { showCursor = board.matches(':focus-visible'); reportCell(); });
  board.addEventListener('blur', () => { showCursor = false; reportCell(false); });
  board.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (moves[event.key]) {
      event.preventDefault();
      const [dx, dy] = moves[event.key];
      x = Math.max(0, Math.min(layout.cols - 1, x + dx));
      y = Math.max(0, Math.min(layout.rows - 1, y + dy));
      showCursor = true;
      reportCell();
      if (zoomed) {
        const cursorRect = svg.querySelector('[data-design-cursor]').getBoundingClientRect();
        const frame = board.getBoundingClientRect();
        if (cursorRect.left < frame.left) board.scrollLeft += cursorRect.left - frame.left;
        if (cursorRect.right > frame.right) board.scrollLeft += cursorRect.right - frame.right;
        if (cursorRect.top < frame.top) board.scrollTop += cursorRect.top - frame.top;
        if (cursorRect.bottom > frame.bottom) board.scrollTop += cursorRect.bottom - frame.bottom;
      }
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (event.repeat) return;
      showCursor = true;
      act();
      reportCell();
    }
  });
  get('undo').addEventListener('click', () => {
    const previous = history.pop();
    if (!previous) return;
    ({ layout, pattern, custom, appliedColours } = previous);
    get('share-fallback').hidden = true;
    get('share').textContent = 'Copy plan link';
    width.value = layout.widthM; length.value = layout.lengthM;
    patternInput.value = pattern;
    status.textContent = 'Last change undone.';
    redraw('tatami:layout-changed');
  });
  zoom.addEventListener('click', () => {
    zoomed = !zoomed;
    choiceState();
    sizeBoard();
    if (!zoomed) board.scrollTo(0, 0);
    status.textContent = zoomed ? 'Zoomed in. Scroll the board to reach other squares.' : 'Whole floor in view.';
  });
  get('share').addEventListener('click', async () => {
    const url = planUrl();
    const fallback = get('share-fallback');
    try {
      await navigator.clipboard.writeText(url);
      fallback.hidden = true;
      get('share').textContent = 'Link copied';
      status.textContent = 'Plan link copied.';
    } catch {
      const input = get('share-url');
      input.value = url;
      fallback.hidden = false;
      input.focus();
      input.select();
      status.textContent = 'Select and copy this plan link.';
    }
  });
  if (clubEditor) {
    get('use').textContent = 'Attach this floor to my academy quote';
    get('use').addEventListener('click', () => parent.postMessage({ action: 'academy-floor-apply', code: encodeLayout(layout) }, location.origin));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') parent.postMessage({ action: 'academy-floor-close' }, location.origin);
    });
  } else {
    get('use').addEventListener('click', () => reportPlan('tatami:use-layout'));
  }
  width.value = layout.widthM;
  length.value = layout.lengthM;
  patternInput.value = pattern;
  root.hidden = false;
  if (sharedCode !== null) status.textContent = sharedLayout
    ? 'Shared floor plan loaded. You can edit it or use it in your enquiry.'
    : 'This plan link could not be read. The 5 × 4 m example is ready to edit.';
  choiceState();
  redraw();
  if (location.hash === '#floor-planner' || location.hash === '#designer-board') {
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' }));
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(sizeBoard).observe(board);
  else window.addEventListener('resize', sizeBoard);
}
