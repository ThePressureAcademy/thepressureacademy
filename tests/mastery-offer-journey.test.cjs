const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const page = name => fs.readFileSync("mastery-method/" + name + "/index.html", "utf8");

test("each published support option has an offer-specific route and matching intake classification", () => {
  const booking = page("book");
  const links = {
    "support-call": ["call", "Free"],
    assessment: ["assessment", "AUD $197 once"],
    pathway: ["info", "AUD $127 per month"],
    "targeted-sessions": ["info", "AUD $97 per session"],
  };
  for (const [offer, [intent, price]] of Object.entries(links)) {
    for (const source of ["pricing", "programs"]) {
      assert.ok(page(source).includes('href="/mastery-method/book/?offer=' + offer + '#request-details"'));
    }
    const option = booking.match(new RegExp('<option value="' + offer + '"[^>]*>[^<]+</option>'));
    assert.ok(option);
    assert.ok(option[0].includes('data-intent="' + intent + '"'));
    assert.ok(option[0].includes(price));
  }
  assert.ok(booking.includes('action="https://formspree.io/f/xwvwkqqg" method="post"'));
  assert.ok(booking.includes('name="requested_offer"'));
});
