const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const scripts = ["js/config/commerce.js", "js/lib/mat-layout-v1.js"]
  .map(file => readFileSync(path.join(__dirname, "..", file), "utf8").replace(/^import .*;$/gm, "").replace(/^export /gm, ""))
  .join("\n");
const model = vm.createContext({});
vm.runInContext(scripts, model);
const { createLayout, applyPattern, editLayout, cellAt, summarizeLayout, serializeLayout } = model;
const { deepEqual, equal } = assert;

function assertPhysicalLayout(layout) {
  const occupied = new Set(layout.blocked.map(({ x, y }) => x + "," + y));
  for (const mat of layout.mats) {
    const { x, y, orientation } = mat;
    for (const [a, b] of [[x, y], [x + Number(orientation === "h"), y + Number(orientation === "v")]]) {
      assert.ok(a >= 0 && a < layout.cols && b >= 0 && b < layout.rows);
      const key = a + "," + b;
      assert.ok(!occupied.has(key), "Unexpected overlap at " + key);
      occupied.add(key);
      equal(cellAt(layout, a, b).mat, mat);
    }
  }
}

test("starter patterns fill the available whole-mat area without overlapping or using partial edge strips", () => {
  for (const pattern of ["solid", "checker", "border"]) {
    for (const [width, length] of [[5, 4], [4, 5], [3, 3], [1, 5], [6, 1], [2, 2], [1, 1], [3.5, 4.01], [24, 24]]) {
      const layout = createLayout(width, length, pattern);
      equal(layout.mats.length, Math.floor(Math.floor(width) * Math.floor(length) / 2));
      assertPhysicalLayout(layout);
    }
  }
  for (const [width, length] of [[0, 4], [1, Infinity], [24.01, 4], [3.444, 5], [NaN, 7], ["3", 4]]) {
    equal(createLayout(width, length), null);
  }
  equal(createLayout(4, 4, "bad-pattern"), null);
});

test("the border preset is a continuous one-metre perimeter of the selected accent colour", () => {
  const layout = createLayout(5, 4, "border", "Jet Black", "Ruby Red");
  for (let x = 0; x < layout.cols; x++) {
    for (let y = 0; y < layout.rows; y++) {
      const edge = x === 0 || x === 4 || y === 0 || y === 3;
      equal(cellAt(layout, x, y).mat.colour, edge ? "Ruby Red" : "Jet Black");
    }
  }
  const checked = summarizeLayout(createLayout(5, 4, "checker", "Matte White", "Rust Orange"));
  deepEqual({ ...checked.colours }, { "Matte White": 5, "Rust Orange": 5 });
});

test("edits affect whole mats from either half, and cannot place outside the usable lattice or on a blocked cell", () => {
  const empty = createLayout(3.5, 4, "blank");
  let current = editLayout(empty, 0, 1, "place", "Jet Black").layout;
  equal(empty.mats.length, 0);
  const placed = current;
  for (const [x, y, axis, colour] of [[0, 0, "v", "Jet Black"], [2, 1, "h", "Jet Black"], [1, 3, "v", "Jet Black"],
    [0.5, 0, "h", "Night Grey"], [-1, 0, "h", "Night Grey"], [0, 0, "h", "Unlisted"]]) {
    const result = editLayout(current, x, y, "place", colour, axis);
    equal(result.layout, current);
    equal(result.changed, false);
  }
  current = editLayout(current, 1, 1, "paint", "Ruby Red").layout;
  equal(cellAt(current, 0, 1).mat.colour, "Ruby Red");
  equal(cellAt(placed, 0, 1).mat.colour, "Jet Black");
  current = editLayout(current, 1, 1, "block").layout;
  equal(current.mats.length, 0);
  equal(cellAt(current, 1, 1).blocked, true);
  equal(cellAt(current, 0, 1).blocked, false);
  equal(editLayout(current, 1, 0, "place", "Jet Black", "v").changed, false);
  current = editLayout(current, 1, 1, "block").layout;
  current = editLayout(current, 1, 0, "place", "Jet Black", "v").layout;
  current = editLayout(current, 1, 1, "remove").layout;
  equal(current.mats.length, 0);
  equal(editLayout(current, 0, 0, "paint", "Jet Black").changed, false);
});

test("patterns preserve arbitrary obstacles and fit the maximum number of uncut mats", () => {
  const empty = createLayout(3, 3, "blank");
  // Independent exhaustive packing oracle across every obstacle arrangement on 3 × 3.
  const cache = new Map([[0, 0]]);
  function maxPairs(mask) {
    if (cache.has(mask)) return cache.get(mask);
    const first = mask & -mask;
    const cell = Math.log2(first);
    const remaining = mask ^ first;
    let count = maxPairs(remaining);
    const neighbours = [];
    if (cell % 3 < 2) neighbours.push(first << 1);
    if (cell < 6) neighbours.push(first << 3);
    for (const neighbour of neighbours) {
      if (remaining & neighbour) count = Math.max(count, 1 + maxPairs(remaining ^ neighbour));
    }
    cache.set(mask, count);
    return count;
  }
  for (let mask = 0; mask < 512; mask++) {
    const blocked = [];
    for (let cell = 0; cell < 9; cell++) {
      if (!(mask & (1 << cell))) blocked.push({ x: cell % 3, y: Math.floor(cell / 3) });
    }
    for (const pattern of ["border", "solid"]) {
      const layout = applyPattern({ ...empty, blocked }, pattern);
      equal(layout.mats.length, maxPairs(mask));
      deepEqual(layout.blocked, blocked);
      assertPhysicalLayout(layout);
    }
  }
});

test("commercial summary separates mats placed and extras for the minimum, omits exclusions and retains fractional uncovered space", () => {
  const empty = createLayout(3.55, 3.37, "blank");
  equal(summarizeLayout(empty).orderQuantity, 0);
  equal(summarizeLayout(empty).subtotalCents, 0);
  let layout = editLayout(empty, 0, 0, "place", "Matte White", "v").layout;
  layout = editLayout(layout, 1, 1, "place", "Rust Orange", "h").layout;
  layout = editLayout(layout, 2, 2, "block").layout;
  deepEqual(JSON.parse(JSON.stringify(summarizeLayout(layout))), {
    placed: 2, areaM2: 4, roomAreaM2: 11.9635, blockedAreaM2: 1, uncoveredAreaM2: 6.9635,
    orderQuantity: 10, extraMats: 8, subtotalCents: 138000, colours: { "Matte White": 1, "Rust Orange": 1 },
  });
  const submitted = JSON.parse(serializeLayout(layout));
  deepEqual(submitted.room_m, [3.55, 3.37]);
  deepEqual(submitted.blocked, [[2, 2]]);
  deepEqual(submitted.mats.map(([x, y, orientation, colour]) => ({ x, y, orientation, colour: submitted.colours[colour] })),
    JSON.parse(JSON.stringify(layout.mats)));
  const large = summarizeLayout(createLayout(12, 20));
  equal(large.orderQuantity, 120);
  equal(large.extraMats, 0);
  equal(large.subtotalCents, 1656000);
});

test("shared layout links reproduce the exact floor, colour and geometry at full scale within a short URL", () => {
  for (const [width, length] of [[1.01, 1.99], [5, 4], [13.37, 18.92], [24, 24]]) {
    let layout = createLayout(width, length, "blank");
    for (let y = 0; y < layout.rows; y++) {
      for (let x = 0; x < layout.cols; x++) {
        if ((7 * x + 11 * y) % 17 === 0) layout = editLayout(layout, x, y, "block").layout;
      }
    }
    layout = applyPattern(layout, "border");
    const palette = ["Ruby Red", "Matte White", "Jet Black", "Rust Orange", "Night Grey"];
    layout.mats.forEach((mat, i) => { layout = editLayout(layout, mat.x, mat.y, "paint", palette[i % 5]).layout; });
    const token = model.encodeLayout(layout);
    assert.match(token, /^[a-zA-Z0-9_-]{7,389}$/);
    const restored = model.decodeLayout(token);
    equal(restored.widthM, width);
    equal(restored.lengthM, length);
    for (let y = 0; y < layout.rows; y++) {
      for (let x = 0; x < layout.cols; x++) deepEqual(cellAt(layout, x, y), cellAt(restored, x, y));
    }
    equal(model.encodeLayout(restored), token);
    const shuffled = { ...layout, mats: [...layout.mats].reverse(), blocked: [...layout.blocked].reverse() };
    equal(model.encodeLayout(shuffled), token);
    if (width === 24) equal(token.length, 389);
  }
});

test("untrusted layout links reject unknown versions, oversized rooms, malformed cells, illegal edges and overlap", () => {
  const digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const pair = value => digits[value >> 6] + digits[value & 63];
  const token = (...cells) => {
    const body = [...cells, 0, 0];
    let code = "1" + pair(200) + pair(200);
    for (let i = 0; i < cells.length; i += 3) code += pair(body[i] * 256 + body[i + 1] * 16 + body[i + 2]);
    return code;
  };
  for (const invalid of [null, false, {}, "", "x".repeat(390), "javascript:alert(1)",
    "1" + pair(2401) + pair(100) + "AA", "1" + pair(10) + pair(100) + "AA",
    token(0, 0, 0, 0).slice(1), token(0, 0, 0, 0).slice(0, -1), token(0, 0, 0, 0) + "AA",
    "2" + token(0, 0, 0, 0).slice(1), token(0, 0, 0, 0).replace(/.$/, "!"),
    token(12, 0, 0, 0), token(0, 2, 0, 0), token(0, 0, 7, 0), token(2, 1, 0, 0),
    token(0, 7, 2, 0), token(0, 0, 0, 0, 1, 0)]) {
    equal(model.decodeLayout(invalid), null, String(invalid));
  }
  const layout = createLayout(2, 2);
  equal(model.encodeLayout({ ...layout, blocked: [{ x: 0, y: 0 }] }), null);
  equal(model.encodeLayout({ ...layout, blocked: [{ x: 2, y: 0 }] }), null);
  equal(model.encodeLayout({ ...layout, cols: 24 }), null);
});
