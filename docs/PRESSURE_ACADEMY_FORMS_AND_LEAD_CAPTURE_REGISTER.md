# Pressure Academy Forms and Lead Capture Register

Status: `ACTIVE — GOVERNED REGISTER`
Date: 26 November 2026
Rule: every form on a TPA commercial surface posts to the governed Formspree endpoint for the parent site and carries explicit hidden `intent` and `source` fields. Pre-order forms also include `request_type` so submitted requests can be distinguished from older entries using the same inbox rules. Mastery Method forms are a separate governed endpoint (`xwvwkqqg`) and are listed separately below (see CLAUDE.md).

## Register

The parent-site rows in this table post to `https://formspree.io/f/meerjgde`. Enhanced forms use AJAX and report success after the endpoint accepts the submission. Pre-order forms also support native POST.

| Page | Form purpose | intent | source | User-facing promise | Risk |
| --- | --- | --- | --- | --- | --- |
| `/` | Founding-round intake | `founding-intake` | `home-join` | Reply from a person, no drip spam | Old Formspree triage rules keyed on `planner-access` will not match (flagged in QA report §8.4 of the architecture pass) |
| `/shop/apparel/` | Apparel pre-order request (`request_type=apparel-preorder`) | `apparel-drop-list` | `shop-apparel` | Request the chosen size and quantity at the displayed AUD unit price. Availability, delivery and the total are confirmed before payment. | Low |
| `/#next-drop`, `/shop/apparel/drops/#release-alert` | Next Pressure Tested release | `pressure-tested-release-alert` | `home-apparel` or `apparel-lookbook` | One email when this release opens. Visitors may also opt into future clothing releases. | Deduplicate across both entry points and check cancellations before each send. |
| `/shop/mats/` | Tatami pre-order and freight quote (`request_type=tatami-preorder`) | `mat-enquiry` | `shop-mats` | AUD 138 per 2 × 1 m mat. Minimum ten. Freight and availability confirmed before payment. | Low |
| `/shop/mats/#mat-spec-request` | Supplier details before an order (`request_type=tatami-specification`) | `mat-enquiry` | `shop-mats` | Reply with confirmed supplier information for the 2 × 1 m mat. | Only email is required. Read the optional question or deadline in `message`. Keep these separate from freight quotes issued. |
| `/seminars/` | Future seminar updates | `seminar-interest` | `seminars-index` | Hear about future seminar announcements. | Low |
| `/seminars/michael-pixley-march-2027/#pixley-date-alert` | Confirmed Brisbane dates | `pixley-date-alert` | `seminar-michael-pixley-march-2027` | One email when the Brisbane schedule is confirmed. | Deduplicate by email within this event and honour cancellations. |
| `/seminars/michael-pixley-march-2027/#seminar-request` | Seminar places (`request_type=seminar-days`) | `seminar-registration` | `seminar-michael-pixley-march-2027` | Request Day 1, Day 2 or both, AUD 150 per person per day. | Check availability against each day’s cap of 20 before confirming. |
| `/seminars/michael-pixley-march-2027/#group-request` | Semi-private session (`request_type=semi-private-group`) | `seminar-registration` | `seminar-michael-pixley-march-2027` | Request one 90-minute group session at AUD 1,000 total. | Check availability and group size (1–6) before confirming. |
| `/seminars/[slug]` (status `interest`) | Per-event interest | `seminar-interest` (or config `leadCaptureIntent`) | config `source`, default `seminar-<slug>` | "No payment is taken on this page yet." | Low |
| `/seminars/[slug]` (status `announced` / `open` without valid checkout) | Ticket updates | `seminar-registration` | config `source` / `seminar-<slug>` | Event updates. Joining does not reserve a ticket. | Low |
| `/seminars/[slug]` (status `sold_out`) | Waitlist | `seminar-waitlist` | config `source` / `seminar-<slug>` | Hear about returned tickets. Joining does not guarantee a place. | Low |
| `/blueprints/pressure-blueprint-core/` | Free coach’s PDF (`request_type=core-pdf-request`) | `blueprint-waitlist` | `blueprint-pressure-blueprint-core` | Two-page lesson immediately. The Academy emails the full 15-page guide. | Check the optional `class_date`, reply about timing and attach the watermarked guide. Count delivery when actually sent. |
| `/blueprints/[slug]` (other unreleased titles) | Release waitlist | `blueprint-waitlist` | `blueprint-<slug>` | One email at release | Low |
| `/campaigns/[slug]` | Campaign capture | from campaign config | from campaign config | Per campaign copy | Campaign entries must define both fields |
| `/contact/` | General enquiry | `contact` | `contact-page` | Reply from a person | Low |
| `/text-updates/` | Choose or replace SMS topics | `sms-topic-signup` | `text-updates` | Text updates from The Pressure Academy about the selected topics. | Use the explicit consent record and honour all suppressions before sending. |
| `/text-updates/#stop` | Stop all Academy SMS topics | `sms-stop-all` | `text-updates` | Request an opt-out using just the mobile number. | Apply to every SMS topic and retain suppression when importing new records. |
| `/academy-orders/` | B2B / bulk enquiry | `academy-order-enquiry` | `academy-orders` | Scoped quote | Low |

The apparel request captures product, preferred size, quantity, destination country and contact details. Current SKUs are `pt-heavy-tee` (AUD 69), `pt-crop-tee` (AUD 65), `pt-hoodie` (AUD 129) and `pt-crop-hoodie` (AUD 109). Use the selected SKU and quantity to calculate the merchandise total when a native submission omits an enhanced total. The mat request captures quantity, freight destination, contact details and mat colour. A custom colour enquiry includes the requested shade. The Pixley requests capture session choice, headcount, tee and rashguard quantities and optional sizes. Admission and apparel are itemised separately. The co-branded tee is AUD 69 and rashguard AUD 79 each. A customer can revise these preferences at hosted checkout after availability is confirmed. A submitted request is free and requires follow-up before a place, item, or delivery can be confirmed.

## Mastery Method homework audit

These forms use the Mastery Method intake at `https://formspree.io/f/xwvwkqqg`.

| Page | Intent | Source | Intake behaviour |
| --- | --- | --- | --- |
| `/mastery-method/scorecard/` | `scorecard-lead` | `clarity-scorecard` | Parent-only submission posts directly. Opting into teacher input submits the same results through `/api/mastery-audit`, adds an `audit_ref`, then gives the parent a private link to share. |
| `/mastery-method/teacher-input/` | `teacher-homework-input` | `mastery-teacher-input` | A valid invitation enables the teacher to submit assigned homework, subject-specific observations and a next step. The API forwards the report with the matching `audit_ref` and a `response_ref`. |

Match the two records by `audit_ref` when reviewing a family’s results. Treat repeated deliveries with the same `response_ref` as one teacher response. The private invitation expires after 14 days and provides no view of the parent’s answers or results.

## Operator follow-up

Use the existing `intent` and `source` labels. Within those labels use `request_type` to distinguish pre-orders from past interest forms and to separate day places from semi-private groups. Keep both days’ availability separately. Confirm the selected product or session, availability, payable total and any fulfilment details with the customer before taking payment.

- For mat and club quotes, read `quote_needed_by` separately from the buyer’s delivery timing. When a club indicates `kit_branding` or `request_kit_approvals`, include available artwork, placement and sample approval steps and costs in its quote.
- For apparel, use the optional `delivery_postcode`, `measurements_requested`, `fabric_details_requested`, `sample_photo_requested` and `exchange_terms_requested` fields to send information specific to the chosen cut and destination before confirmation.
- For Pixley, answer the optional `attending_question` on the day or group request. Update both the event page and date alerts once the organiser confirms the schedule. Keep expressions of interest, paid day places, group bookings and apparel quantities separate.

### Clothing release email

Use one list for the next drop across both sources. A request covers that launch only. Keep a recipient for later launches only when the form receipt also records `future_clothing_emails=yes` with `email_consent_version=pt-releases-2026-11-26-v1`. That checkbox reads “Also email me about future Pressure Tested clothing releases.” Previous release requests, purchases, Pixley alerts and SMS selections grant no ongoing email permission.

Generate the launch list with `node scripts/release-email-roster.mjs /private/parent-form.json /private/release-control.json`. Use all parent Formspree receipts, including their processor timestamps. The private control file must contain `windowStart` (inclusive) and `windowEnd` (exclusive) with explicit time zones, and two arrays of email addresses: `suppressed` for opt-outs, cancellations and bounces, and `alreadySent` for the current launch’s sent or in-flight messages. Use an empty array when there are none. Set the start to the opening of this drop’s signup period, preserving earlier explicit recurring subscribers. Keep customer lists out of the repository and refresh the controls before every run.

For an actual launch, link to the collection shoppers can buy and identify The Pressure Academy. Use a monitored reply-to address and include a visible unsubscribe option in each email. Process opt-outs across both sources and the sending platform before the next send. Record confirmed, deduplicated paid orders and their contribution after fulfilment, refunds and sending costs. For subscribers who chose both channels, compare email alone with email plus one timely text for the same release; keep order revenue counted once.

### Topic-based SMS

The parent intake captures a mobile, chosen topics, explicit consent and its wording version; use the processor receipt time as the date of consent. A family-learning selection concerns general Mastery Method updates from The Pressure Academy. Keep child information and education enquiries in their existing intake.

Use a complete private non-spam Formspree submissions JSON export including processor `_date` fields. Keep the export and all output outside this repository. Run `node scripts/sms-roster.mjs /private/parent-form.json clothing` to get the current numbers for one topic. The other topics are `academy`, `seminars` and `family`. Use `stopped` to retrieve all stop requests. A newer valid selection replaces earlier topics. A stop request takes precedence even over a later unverified web signup.

Before a campaign, reconcile the current list with provider and inbox opt-outs, retain suppression history, and resolve any request to restart directly with the number holder. Use an Academy sender with monitored contact details and a working unsubscribe mechanism. The website accepts preferences without an SMS sending provider. For each send use one relevant offer link, such as the specific Pixley event or a released clothing collection, plus the separate unsubscribe link at `https://thepressureacademy.com/text-updates/#stop`.

## Change discipline

Adding a form = adding a row here in the same change. Changing an `intent`/`source` value = flag it in the QA report of that change AND update Formspree rules before deploy.
