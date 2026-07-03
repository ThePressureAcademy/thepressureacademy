# Pressure Academy Forms and Lead Capture Register

Status: `ACTIVE — GOVERNED REGISTER`
Date: 3 July 2026
Rule: every form on a TPA commercial surface posts to the governed Formspree endpoint for the parent site and carries an explicit hidden `intent` + `source`. Mastery Method forms are a separate governed endpoint (`xwvwkqqg`) and are out of scope here — never merge the two (see CLAUDE.md).

## Register

All rows below post to `https://formspree.io/f/meerjgde` via `enhanceCaptureForms()` (AJAX, honest status line, local `lead_captured` event; seminar forms additionally fire `seminar_interest_submitted`).

| Page | Form purpose | intent | source | User-facing promise | Risk |
| --- | --- | --- | --- | --- | --- |
| `/` | Founding-round intake | `founding-intake` | `home-join` | Reply from a person, no drip spam | Old Formspree triage rules keyed on `planner-access` will not match (flagged in QA report §8.4 of the architecture pass) |
| `/shop/apparel/` | First-drop release list | `apparel-drop-list` | `shop-apparel` | First access at drop; no payment implied | Low |
| `/shop/mats/` | Spec + freight quote enquiry (carries `calculator_result`) | `mat-enquiry` | `shop-mats` | A quote, not an order; freight confirmed in quote | Low |
| `/seminars/` | Founding event list | `seminar-interest` | `seminars-index` | Announcements first; city shapes venue choice | Low |
| `/seminars/[slug]` (status `interest`) | Per-event interest | `seminar-interest` (or config `leadCaptureIntent`) | config `source`, default `seminar-<slug>` | "No payment is taken on this page yet." | Low |
| `/seminars/[slug]` (status `announced` / `open` without valid checkout) | Free registration, ticket release order | `seminar-registration` | config `source` / `seminar-<slug>` | Free, "no card is taken here", release in registration order | **Operator must actually honour registration order at release** |
| `/seminars/[slug]` (status `sold_out`) | Waitlist | `seminar-waitlist` | config `source` / `seminar-<slug>` | First option on returned spots / next event | Operator must honour waitlist order |
| `/blueprints/[slug]` | Release waitlist | `blueprint-waitlist` | `blueprint-<slug>` | One email at release | Low |
| `/campaigns/[slug]` | Campaign capture | from campaign config | from campaign config | Per campaign copy | Campaign entries must define both fields |
| `/contact/` | General enquiry | `contact` | `contact-page` | Reply from a person | Low |
| `/academy-orders/` | B2B / bulk enquiry | `academy-order-enquiry` | `academy-orders` | Scoped quote | Low |

No form implies payment or a confirmed booking anywhere; every gated state says so in visible copy ("No payment is taken on this page yet." / "no card is taken here").

## Required operator actions inside Formspree

1. Set up inbox rules / labels on `meerjgde` keyed to the `intent` values above — `seminar-registration` and `seminar-waitlist` are order-sensitive and need timestamps preserved (Formspree records submission time; do not sort them out of order).
2. Retire any triage rule still keyed to `intent=planner-access` / `source=post-demo-cta` / `source=join-section` (pre-rebuild homepage values).
3. Before the first `open` event: decide the reply-path for `seminar-registration` (who sends the payment link email, from which address, within what SLA). The page promises release "in registration order" — that promise is kept by a human process, not by code.
4. When a real seminar launches with a custom `leadCaptureIntent`, add the matching rule first, then flip the config.

## Change discipline

Adding a form = adding a row here in the same change. Changing an `intent`/`source` value = flag it in the QA report of that change AND update Formspree rules before deploy.
