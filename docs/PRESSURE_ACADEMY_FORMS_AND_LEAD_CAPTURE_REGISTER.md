# Pressure Academy Forms and Lead Capture Register

Status: `ACTIVE — GOVERNED REGISTER`
Date: 26 November 2026
Rule: every form on a TPA commercial surface posts to the governed Formspree endpoint for the parent site and carries explicit hidden `intent` and `source` fields. Pre-order forms also include `request_type` so submitted requests can be distinguished from older entries using the same inbox rules. Mastery Method forms are a separate governed endpoint (`xwvwkqqg`) and are out of scope here — never merge the two (see CLAUDE.md).

## Register

All rows below post to `https://formspree.io/f/meerjgde`. Enhanced forms use AJAX and report success after the endpoint accepts the submission. Pre-order forms also support native POST.

| Page | Form purpose | intent | source | User-facing promise | Risk |
| --- | --- | --- | --- | --- | --- |
| `/` | Founding-round intake | `founding-intake` | `home-join` | Reply from a person, no drip spam | Old Formspree triage rules keyed on `planner-access` will not match (flagged in QA report §8.4 of the architecture pass) |
| `/shop/apparel/` | Apparel pre-order request (`request_type=apparel-preorder`) | `apparel-drop-list` | `shop-apparel` | Request the chosen size and quantity at the displayed AUD unit price. Availability, delivery and the total are confirmed before payment. | Low |
| `/shop/mats/` | Tatami pre-order and freight quote (`request_type=tatami-preorder`) | `mat-enquiry` | `shop-mats` | AUD 138 per 2 × 1 m mat. Minimum ten. Freight and availability confirmed before payment. | Low |
| `/seminars/` | Future seminar updates | `seminar-interest` | `seminars-index` | Hear about future seminar announcements. | Low |
| `/seminars/michael-pixley-march-2027/#seminar-request` | Seminar places (`request_type=seminar-days`) | `seminar-registration` | `seminar-michael-pixley-march-2027` | Request Day 1, Day 2 or both, AUD 150 per person per day. | Check availability against each day’s cap of 20 before confirming. |
| `/seminars/michael-pixley-march-2027/#group-request` | Semi-private session (`request_type=semi-private-group`) | `seminar-registration` | `seminar-michael-pixley-march-2027` | Request one 90-minute group session at AUD 1,000 total. | Check availability and group size (1–6) before confirming. |
| `/seminars/[slug]` (status `interest`) | Per-event interest | `seminar-interest` (or config `leadCaptureIntent`) | config `source`, default `seminar-<slug>` | "No payment is taken on this page yet." | Low |
| `/seminars/[slug]` (status `announced` / `open` without valid checkout) | Ticket updates | `seminar-registration` | config `source` / `seminar-<slug>` | Event updates. Joining does not reserve a ticket. | Low |
| `/seminars/[slug]` (status `sold_out`) | Waitlist | `seminar-waitlist` | config `source` / `seminar-<slug>` | Hear about returned tickets. Joining does not guarantee a place. | Low |
| `/blueprints/[slug]` | Release waitlist | `blueprint-waitlist` | `blueprint-<slug>` | One email at release | Low |
| `/campaigns/[slug]` | Campaign capture | from campaign config | from campaign config | Per campaign copy | Campaign entries must define both fields |
| `/contact/` | General enquiry | `contact` | `contact-page` | Reply from a person | Low |
| `/academy-orders/` | B2B / bulk enquiry | `academy-order-enquiry` | `academy-orders` | Scoped quote | Low |

The apparel request captures product, preferred size, quantity, destination country and contact details. Current SKUs are `pt-heavy-tee` (AUD 69), `pt-crop-tee` (AUD 65), `pt-hoodie` (AUD 129) and `pt-crop-hoodie` (AUD 109). Use the selected SKU and quantity to calculate the merchandise total when a native submission omits an enhanced total. The mat request captures quantity, freight destination and contact details. The seminar requests capture session choice and number of people. A submitted request is free and requires follow-up before a place, item, or delivery can be confirmed.

## Operator follow-up

Use the existing `intent` and `source` labels. Within those labels use `request_type` to distinguish pre-orders from past interest forms and to separate day places from semi-private groups. Keep both days’ availability separately. Confirm the selected product or session, availability, payable total and any fulfilment details with the customer before taking payment.

## Change discipline

Adding a form = adding a row here in the same change. Changing an `intent`/`source` value = flag it in the QA report of that change AND update Formspree rules before deploy.
