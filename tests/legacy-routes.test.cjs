const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const read = path => readFileSync(resolve(__dirname, "..", path), "utf8");
const routes = JSON.parse(read("vercel.json")).routes;
const firstMatch = path => routes.find(route => new RegExp(route.src).test(path));
const teaser = "/#pressure-planner";

test("legacy Planner bookmarks land at the development preview", () => {
  for (const path of ["/planner", "/planner/", "/planner/index.html", "/planner/today", "/planner/a/b"]) {
    const route = firstMatch(path);
    assert.equal(route?.status, 307);
    assert.equal(route.headers.Location, teaser);
    assert.equal(route.headers["Cache-Control"], "no-store");
  }
  for (const path of ["/", "/shop/", "/planner-guide", "/planners", "/mastery-method/portal/dashboard"]) {
    assert.notEqual(firstMatch(path)?.headers?.Location, teaser);
  }
  const fallback = read("planner/index.html");
  assert.match(fallback, /http-equiv="refresh" content="0;url=\/#pressure-planner"/i);
  assert.doesNotMatch(fallback, /https?:\/\/|<script\b/i);
});

test("Planner is presented on the homepage without a launch link", () => {
  assert.match(read("index.html"), /id="pressure-planner"/);
  for (const path of ["index.html", "sitemap.xml", "llms.txt"]) {
    const content = read(path);
    assert.doesNotMatch(content, /https?:\/\/planner\.thepressureacademy\.com/i);
    assert.doesNotMatch(content, /(?:href=["']|thepressureacademy\.com)\/planner(?:[/"'<\s]|$)/i);
  }
});

test("old LiftIQ index documents resolve to the canonical DispatchTalon destinations", () => {
  const paths = ["", "/how-it-works", "/modules", "/design-partner", "/contact",
    "/dispatch-blind-spot-diagnostic", "/executive-briefing", "/sample-preview"];
  for (const path of paths) {
    const target = path === "/dispatch-blind-spot-diagnostic"
      ? "https://dispatchtalon.com/diagnostic/" : "https://dispatchtalon.com/";
    for (const suffix of ["", "/", "/index.html"]) {
      const rule = firstMatch("/liftiq" + path + suffix);
      assert.equal(rule?.status, 308);
      assert.equal(rule.headers.Location, target);
    }
  }
  for (const path of ["/liftiq-contact", "/liftiq/new-page", "/liftiq/indexXhtml"]) {
    assert.equal(firstMatch(path), undefined);
  }
});
