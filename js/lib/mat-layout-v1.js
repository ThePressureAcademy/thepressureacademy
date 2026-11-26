import { tatamiMat } from "../config/commerce.js";

const patterns = ["blank", "solid", "border", "checker"];

function validDimension(value) {
  return Number.isFinite(value) && value >= 1 && value <= 24 &&
    Math.abs(value - Math.round(value * 100) / 100) < 1e-9;
}

export function createLayout(widthM, lengthM, pattern = "solid", base = "Night Grey", accent = "Rust Orange") {
  if (!validDimension(widthM) || !validDimension(lengthM)) return null;
  widthM = Math.round(widthM * 100) / 100;
  lengthM = Math.round(lengthM * 100) / 100;
  const layout = { widthM, lengthM, cols: Math.floor(widthM), rows: Math.floor(lengthM), mats: [], blocked: [] };
  return applyPattern(layout, pattern, base, accent);
}

// Cell numbers run left-to-right, top-to-bottom. Pair the perimeter first for a
// continuous single-cell border, then tile the remaining rectangle in rows.
function presetPairs(cols, rows, border) {
  const pairs = [];
  let inset = 0;
  if (border && cols > 1 && rows > 1) {
    const ring = [];
    for (let x = 0; x < cols; x++) ring.push(x);
    for (let y = 1; y < rows; y++) ring.push(y * cols + cols - 1);
    for (let x = cols - 2; x >= 0; x--) ring.push((rows - 1) * cols + x);
    for (let y = rows - 2; y > 0; y--) ring.push(y * cols);
    for (let i = 0; i < ring.length; i += 2) pairs.push([ring[i], ring[i + 1]]);
    inset = 1;
  }
  let y = inset;
  for (; y + 1 < rows - inset; y += 2) {
    for (let x = inset; x < cols - inset; x++) {
      const cell = y * cols + x;
      pairs.push([cell, cell + cols]);
    }
  }
  if (y < rows - inset) {
    for (let x = inset; x + 1 < cols - inset; x += 2) {
      const cell = y * cols + x;
      pairs.push([cell, cell + 1]);
    }
  }
  return pairs;
}

// A domino always covers one cell of each checkerboard parity. Preserve the
// preset where possible, then find augmenting paths to fill around obstacles.
function fitAroundBlocks({ cols, rows, blocked }, pairs) {
  const excluded = new Set(blocked.map(({ x, y }) => y * cols + x));
  const partner = new Int16Array(cols * rows).fill(-1);
  for (const [a, b] of pairs) {
    if (!excluded.has(a) && !excluded.has(b)) {
      partner[a] = b;
      partner[b] = a;
    }
  }
  function findPartner(cell, visited) {
    const x = cell % cols;
    const neighbours = [];
    if (x > 0) neighbours.push(cell - 1);
    if (x + 1 < cols) neighbours.push(cell + 1);
    if (cell >= cols) neighbours.push(cell - cols);
    if (cell + cols < partner.length) neighbours.push(cell + cols);
    for (const next of neighbours) {
      if (excluded.has(next) || visited.has(next)) continue;
      visited.add(next);
      if (partner[next] === -1 || findPartner(partner[next], visited)) {
        partner[cell] = next;
        partner[next] = cell;
        return true;
      }
    }
    return false;
  }
  for (let cell = 0; cell < partner.length; cell++) {
    const evenParity = ((cell % cols + Math.floor(cell / cols)) % 2) === 0;
    if (evenParity && partner[cell] === -1 && !excluded.has(cell)) findPartner(cell, new Set());
  }
  const result = [];
  for (let cell = 0; cell < partner.length; cell++) {
    if (partner[cell] > cell) result.push([cell, partner[cell]]);
  }
  return result;
}

export function applyPattern(layout, pattern, base = "Night Grey", accent = "Rust Orange") {
  if (!patterns.includes(pattern) || !tatamiMat.colours.includes(base) || !tatamiMat.colours.includes(accent)) return null;
  if (pattern === "blank") return { ...layout, mats: [] };
  const { cols, rows } = layout;
  let pairs = presetPairs(cols, rows, pattern === "border");
  if (layout.blocked.length) pairs = fitAroundBlocks(layout, pairs);
  const mats = pairs.map(([a, b]) => {
    const start = Math.min(a, b);
    const x = start % cols;
    const y = Math.floor(start / cols);
    const horizontal = Math.floor(a / cols) === Math.floor(b / cols);
    const atBorder = x === 0 || y === 0 || x + (horizontal ? 2 : 1) === cols || y + (horizontal ? 1 : 2) === rows;
    const alternate = (horizontal ? Math.floor(x / 2) + y : x + Math.floor(y / 2)) % 2 === 1;
    const accented = (pattern === "border" && atBorder) || (pattern === "checker" && alternate);
    return { x, y, orientation: horizontal ? "h" : "v", colour: accented ? accent : base };
  });
  return { ...layout, mats };
}

function onGrid(layout, x, y) {
  return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && y >= 0 && x < layout.cols && y < layout.rows;
}

export function cellAt(layout, x, y) {
  if (!onGrid(layout, x, y)) return { mat: null, blocked: false };
  const mat = layout.mats.find(m => {
    if (m.orientation === "h") return m.y === y && (x === m.x || x === m.x + 1);
    return m.x === x && (y === m.y || y === m.y + 1);
  });
  const blocked = layout.blocked.some(point => point.x === x && point.y === y);
  return { mat: mat || null, blocked };
}

export function editLayout(layout, x, y, tool, colour, orientation = "h") {
  function reject(message) { return { layout, changed: false, message }; }
  function update(changes, message) { return { layout: { ...layout, ...changes }, changed: true, message }; }
  if (!onGrid(layout, x, y)) return reject("Choose a whole square inside the floor.");
  const { mat, blocked } = cellAt(layout, x, y);
  const withoutBlock = () => layout.blocked.filter(point => point.x !== x || point.y !== y);
  if (tool === "block") {
    if (blocked) return update({ blocked: withoutBlock() }, "Square available again.");
    const changes = { blocked: [...layout.blocked, { x, y }] };
    if (mat) {
      changes.mats = layout.mats.filter(item => item !== mat);
      return update(changes, "Mat removed and this square marked unavailable.");
    }
    return update(changes, "Square marked unavailable.");
  }
  if (tool === "remove") {
    if (mat) return update({ mats: layout.mats.filter(item => item !== mat) }, "Mat removed.");
    if (blocked) return update({ blocked: withoutBlock() }, "Square available again.");
    return reject("This square is already empty.");
  }
  if (!tatamiMat.colours.includes(colour)) return reject("Choose a mat colour.");
  if (tool === "paint") {
    if (!mat) return reject("Choose a mat to change its colour.");
    if (mat.colour === colour) return reject("This mat is already " + colour + ".");
    return update({ mats: layout.mats.map(item => item === mat ? { ...item, colour } : item) }, "Mat changed to " + colour + ".");
  }
  if (tool !== "place" || (orientation !== "h" && orientation !== "v")) return reject("Choose a placement direction.");
  const nextX = x + (orientation === "h" ? 1 : 0);
  const nextY = y + (orientation === "v" ? 1 : 0);
  if (!onGrid(layout, nextX, nextY)) return reject("This mat would extend past the floor edge.");
  const next = cellAt(layout, nextX, nextY);
  if (blocked || next.blocked) return reject("One of these squares is marked unavailable.");
  if (mat || next.mat) return reject("Choose two empty squares for this mat.");
  return update({ mats: [...layout.mats, { x, y, orientation, colour }] }, colour + " mat placed.");
}

export function summarizeLayout(layout) {
  const placed = layout.mats.length;
  const areaM2 = placed * tatamiMat.coverageM2;
  const roomCm2 = Math.round(layout.widthM * 100) * Math.round(layout.lengthM * 100);
  const blockedAreaM2 = layout.blocked.length;
  const orderQuantity = placed === 0 ? 0 : Math.max(placed, tatamiMat.minimumQuantity);
  const colours = {};
  for (const { colour } of layout.mats) colours[colour] = (colours[colour] || 0) + 1;
  return {
    placed, areaM2, roomAreaM2: roomCm2 / 10000, blockedAreaM2,
    uncoveredAreaM2: (roomCm2 - (areaM2 + blockedAreaM2) * 10000) / 10000,
    orderQuantity, extraMats: orderQuantity - placed, subtotalCents: orderQuantity * tatamiMat.priceCents, colours,
  };
}

export function serializeLayout(layout) {
  return JSON.stringify({
    version: 1, room_m: [layout.widthM, layout.lengthM], origin: "top-left", grid_m: 1,
    colours: tatamiMat.colours, mat_fields: ["x", "y", "axis", "colour_index"],
    mats: layout.mats.map(({ x, y, orientation, colour }) => [x, y, orientation, tatamiMat.colours.indexOf(colour)]),
    blocked: layout.blocked.map(({ x, y }) => [x, y]),
  });
}

// Version 1 fixes the colour order in shared links independently of catalogue
// display order. Each three 1 m cells occupy two URL-safe characters.
const linkColours = ["Ruby Red", "Matte White", "Jet Black", "Rust Orange", "Night Grey"];
const linkDigits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const coveredHalf = 12;

function digitPair(value) {
  return linkDigits[value >> 6] + linkDigits[value & 63];
}

function readPair(token, index) {
  const hi = linkDigits.indexOf(token[index]);
  const lo = linkDigits.indexOf(token[index + 1]);
  return hi < 0 || lo < 0 ? -1 : hi * 64 + lo;
}

// Cell codes are 0 (floor), 1 (blocked), 2–6 (horizontal), or 7–11
// (vertical). coveredHalf is internal only; the second half encodes as 0.
function reserveCells(cells, cols, index, code) {
  if (cells[index] !== 0) return false;
  if (code !== 1) {
    const vertical = code >= 7;
    const next = index + (vertical ? cols : 1);
    if ((!vertical && index % cols === cols - 1) || cells[next] !== 0) return false;
    cells[next] = coveredHalf;
  }
  cells[index] = code;
  return true;
}

export function encodeLayout(layout) {
  if (!layout || !validDimension(layout.widthM) || !validDimension(layout.lengthM) ||
      layout.cols !== Math.floor(layout.widthM) || layout.rows !== Math.floor(layout.lengthM) ||
      !Array.isArray(layout.blocked) || !Array.isArray(layout.mats)) return null;
  const cells = new Uint8Array(layout.cols * layout.rows);
  for (const point of layout.blocked) {
    if (!point || !onGrid(layout, point.x, point.y) || !reserveCells(cells, layout.cols, point.y * layout.cols + point.x, 1)) return null;
  }
  for (const mat of layout.mats) {
    if (!mat || !onGrid(layout, mat.x, mat.y) || (mat.orientation !== "h" && mat.orientation !== "v")) return null;
    const colour = linkColours.indexOf(mat.colour);
    if (colour < 0) return null;
    const code = (mat.orientation === "h" ? 2 : 7) + colour;
    if (!reserveCells(cells, layout.cols, mat.y * layout.cols + mat.x, code)) return null;
  }
  let token = "1" + digitPair(Math.round(layout.widthM * 100)) + digitPair(Math.round(layout.lengthM * 100));
  for (let i = 0; i < cells.length; i += 3) {
    let word = 0;
    for (let n = 0; n < 3; n++) {
      const cell = cells[i + n] || 0;
      word = (word << 4) | (cell === coveredHalf ? 0 : cell);
    }
    token += digitPair(word);
  }
  return token;
}

export function decodeLayout(token) {
  if (typeof token !== "string" || token.length < 7 || token.length > 389 || token[0] !== "1") return null;
  const layout = createLayout(readPair(token, 1) / 100, readPair(token, 3) / 100, "blank");
  if (!layout) return null;
  const cells = new Uint8Array(layout.cols * layout.rows);
  if (token.length !== 5 + 2 * Math.ceil(cells.length / 3)) return null;
  for (let start = 0; start < cells.length; start += 3) {
    const word = readPair(token, 5 + 2 * (start / 3));
    if (word < 0) return null;
    for (let n = 0; n < 3; n++) {
      const code = (word >> (8 - 4 * n)) & 15;
      if (code === 0) continue;
      const index = start + n;
      if (index >= cells.length || code >= coveredHalf || !reserveCells(cells, layout.cols, index, code)) return null;
      const x = index % layout.cols;
      const y = Math.floor(index / layout.cols);
      if (code === 1) layout.blocked.push({ x, y });
      else {
        const vertical = code >= 7;
        layout.mats.push({ x, y, orientation: vertical ? "v" : "h", colour: linkColours[code - (vertical ? 7 : 2)] });
      }
    }
  }
  return layout;
}
