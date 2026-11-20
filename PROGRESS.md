# Sogilex: where things stand

Last updated 2026-11-20. **A new session should read this file first.**
This repo is public: no keys, user IDs or private details here.

## How to start the next session

- Start a cloud session on the **"Sogilex"** environment (it holds the Cloudflare key; a session started on
  Default can move to it with one approval) with both repos:
  `edlerk98/sogilex-site`, `edlerk98/sogilex-build` (`edlerk98/savepoint-atlas` only serves the "closed" page now; not needed).
- Tell it: *"Read PROGRESS.md in sogilex-site, then continue."*
- Working style the owner asked for: be an advisor, not a yes-man (say when they're wrong and why, give
  confidence levels); **simple, one-step-at-a-time walkthroughs** for anything the owner does by hand (they get
  overwhelmed by long lists); test before shipping; end each reply with one clear next step.

## Where we left off (2026-11-20)

- **Quotes & invoices (5th tool) built 2026-11-20** (owner approved the plan, including the advisor's additions:
  the owner is the first user, billing their own done-for-you clients; "Bill this again next month" for care plans).
  See the "Quotes & invoices" section below. **Live** (database, build.sogilex.com/invoices/ and
  sogilex.com/invoices/, pushed to `main` 2026-11-20); not yet used by the owner with a real sign-in. **Owner's test:** make a real invoice for themselves (e.g. a $149 setup
  for a pretend client), print it to PDF, check it reads right. Next for this tool, when asked: email from Sogilex,
  Stripe "Pay now", reminders.
- **Owner corrections (2026-11-20), keep to them:** Sogilex sells **nationwide**. Saying it is **based in St. Louis
  is fine** (and the demo lawn business can say St. Louis); what is not wanted is wording that limits the market to
  St. Louis (e.g. "for restaurants in St. Louis"). **No founding
  offer / no "first 10 half price"**: a session invented it; the owner never offered it. Both removed from the
  homepage and the offer sheet. Don't add offers, discounts or prices the owner didn't state.
- **Owner's instruction (2026-11-20): not going to market yet; focus is the website (sogilex.com and the tools).
  Do NOT bring up the restaurant visit, Poor Richard's, sales or "talk to customers first" until the owner raises it.**
  (The case for testing with customers has been made several times; the owner has heard it and decided.)
- Security advisor (pre-existing, not urgent): `public.rls_auto_enable()` is SECURITY DEFINER and executable by anon
  and authenticated; revoke EXECUTE from them (check what it is first).
- All of 2026-11-20's work is live and the owner checked it: Posts + AI captions, Services tab, done-for-you
  section, Atlas closed. The first real AI caption worked.
- **"Services" tab (2026-11-20, owner: "each time we add something it needs to automatically go under that tab"):**
  one list, `sogilex-site/assets/services.js` (`window.SOGILEX_SERVICES`), builds the Services tab with its
  drop-down on every page (it replaced "Tools"; shows on phones too), the homepage cards (`<div data-services>`,
  section renamed "01 / Services") and the new page sogilex.com/services/ (`data-services="full"`). **To add a
  service: add one entry to that list.** Tested: a 5th entry appeared in the menu and the cards with nothing else
  changed. New pages need `<li class="nav-services"><a href="/services/">Services</a></li>` in their menu and
  `<script src="/assets/services.js" defer></script>`.
- **Posts (4th tool, free beta) is live** at build.sogilex.com/posts/ with a page at sogilex.com/posts/ and a 4th
  homepage card. Owner paused Menus to pick a 4th service: résumés were advised against again (individuals, not
  businesses; free competition; no repeat income); owner clarified Sogilex is for any local business, not only
  restaurants (selling stays restaurant-first for now). Chosen: social posts first, quotes/invoices later.
  See the Posts section below.
- **Homepage section "04 / Done for you" is live** (owner approved prices going public): headline, the two price
  cards from the offer sheet ($149 + $25/mo menu; $349 + $45/mo menu + website), "No contracts", and a "Get a free
  sample menu" form. Requests go to table `sample_requests` (`sogilex-site/supabase/sample_requests.sql`: anyone can
  insert, nobody can read via the API; one per email a day, 30 a day in all) and are emailed to hello@sogilex.com by
  `message-email` v4 (action "sample", Reply-To the requester). Owner confirmed hello@sogilex.com reaches them.
  No "Most popular" label: no customers yet, so it would be a made-up claim.
- **Pricing advice given:** prices are fine and low; the risk is "unlimited changes" eating time. Decide a private
  fair-use line for the one-page agreement (e.g. a full redesign = $75). Ask early customers for permission to
  show their menu as an example plus a one-line quote (no discount attached: owner has no founding offer).
- (Parked by the owner until they bring it up: the first restaurant visit with a printed sample menu.)
- Parked by the owner: an AI help chat (advised: not until self-serve users ask repeated questions), and a
  "Questions? Text us" line with phone numbers. Résumé maker stays parked (wrong customer); suggested 4th service
  instead: weekly social posts made from the menu (specials/dishes as Instagram/Facebook images).
- **Savepoint Atlas shut down (2026-11-20, owner: "nothing to do with what I am building"; its 2 users were
  testers).** Removed from the homepage; atlas.sogilex.com now shows one "has closed" page (old pages redirect to
  it; the app is in the `savepoint-atlas` repo history). Its database pieces were dropped by
  `sogilex-build/supabase/015_remove_atlas.sql` (data was placeholder test entries only), including the sign-up hook
  that made an Atlas profile for every new account (dropped first, so sign-ups don't break). Atlas wording removed
  from the sign-in boxes. The `savepoint-atlas` repo stays only to serve the closed page; no more work there.
- Done by the owner 2026-11-20: Supabase sign-in email templates (Magic link + Confirm signup) no longer mention
  Atlas ("One Sogilex account works for Build, Menus and Flyers."); Site URL confirmed https://build.sogilex.com.
- Flyers is live (merged 2026-11-19). See the Flyers section below.
- **Offer sheet filled in** (contact details are on the private canvas only, not here); turnaround days and
  "spots left" removed for now.
- **Business direction decided: done-for-you.** The owner sells menus (print + online + QR) and websites to local
  restaurants as a service, using Sogilex as the tool, rather than self-serve software first.
- **Offer + price sheet made** (2 letter pages, design canvas, private to the owner):
  https://claude.ai/artifact/VbFfATarqVS9VNuapzoJbQ . Page 1: "Your menu, on paper and online. Done for you." with
  a free-sample hook ("I'll redo your current menu"). Page 2 prices: setup Menu $149 / Menu + website $349;
  care plans Menu $25/mo, Menu + website $45/mo (unlimited changes within 1 business day); extra menu $75; same-day
  change $25; printing at cost; yearly = 2 months free;
  own domain "coming soon". Placeholders the owner fills: [YOUR NAME] [PHONE] [YOUR CITY] [BUSINESS NAME] [2 DAYS]
  [X] spots left.
- (Parked, see above:) fill the placeholders, print, visit the first restaurant with a free sample menu
  (use "Read it from a photo" on their current menu, check prices, print). Their reaction picks what to build next.
- **Gaps the done-for-you model exposes (build when needed):**
  1. One account = one business. Each client needs its own sign-in for now (Gmail plus-addresses work:
     you+client@gmail.com). Several businesses per account becomes worth building after a few clients.
  2. Contact-form messages: now also emailed to an address the owner picks (live and tested 2026-11-19).
     For a client: type their email, they press Confirm once in the email we send them.
  3. Own domains (Cloudflare for SaaS custom hostnames) not built; the sheet says "coming soon".
  4. Edits are capped per day (30) but not per month: a monthly allowance matters once anyone pays.
- **Before taking money:** Missouri LLC, business bank account, a one-page written agreement per customer
  (Stripe later). Terms of service + DMCA agent before publishing opens to the public.

## What Sogilex is

Design tools for local businesses that **don't look AI-made**. Four design rules on every tool: one message,
two typefaces at most, no AI look (rule 03, reworded 2026-11-19 at the owner's request: no glossy stock art,
grime filters or uncanny faces; Sogilex itself is AI-made, so "nothing generated" overclaimed), only the owner's
facts (missing ones become [PLACEHOLDERS], never invented). Honesty line kept: demo sites are labelled demos. Order of tools: websites, menus, flyers, posts, invoices (all live betas), reports later. Resume maker parked (wrong customer). Excel later.

## Live

| What | Address | Repo |
|---|---|---|
| Company site | https://sogilex.com (+ /menus, /flyers pages) | `sogilex-site` |
| Build: AI websites (beta) | https://build.sogilex.com | `sogilex-build` |
| Menus (free beta) | https://build.sogilex.com/menus/ | `sogilex-build` |
| Flyers, Posts, Invoices (free beta) | build.sogilex.com/flyers/, /posts/, /invoices/ | `sogilex-build` |
| Published customer sites | https://NAME.sogilex.net (closed beta: owner only) | `sogilex-build/worker` |
| (closed) Savepoint Atlas | https://atlas.sogilex.com shows a "closed" page | `savepoint-atlas` |

## Brand (sogilex.com and Build)

- Night plum + sunset gradient (#D91E8C to #F2496B to #FF9A4D). Tokens and fonts: `sogilex-site/design/README.md`.
- Fonts self-hosted (SIL OFL): Unbounded (headings), Inter (body), JetBrains Mono (labels), Montserrat 600 (wordmark).
- Logo: two offset rounded squares (`favicon.svg`, `<symbol id="mark">` in each page).
- Background scene (owner loves it): sunset over a particle sea, drifting sparks, cursor glow + trailing ring,
  click ripples, sun sets on scroll. `assets/scene.js` (copy in both sogilex-site and sogilex-build);
  the horizon sits below the element marked `data-horizon` so it never runs behind text.
- Design mockup canvas: https://claude.ai/artifact/P1FwkbQkqcBivZrtxJktzU
- Boxes/cards must be solid dark panels with borders (owner: they blended into the scene).

## Infrastructure

- **GitHub Pages** hosts all three static sites. Pushing to `main` deploys (about 45 s).
- **DNS:** sogilex.com stays at **Porkbun** (hello@sogilex.com forwarding depends on it). sogilex.net is on **Cloudflare**.
- **Supabase** (one project, **Pro plan, $25/month**): auth, all tables, Edge Functions `build-site` (v15),
  `edit-site` (v3), `read-menu` (v3: longer text limits, anything shortened is flagged), `edit-selftest` (retired stub, deletable). Deploying a function from a
  session: the Supabase connector's deploy tool takes the full file text; send exactly the tested file.
  The session's Supabase connector can run SQL, apply migrations and deploy functions.
- **Cloudflare** (free plan): Worker `sogilex-sites` on routes `*.sogilex.net/*` and `sogilex.net/*`, KV namespace
  `sogilex-sites`, DNS `AAAA sogilex.net` and `AAAA *.sogilex.net` to `100::` (proxied). API token
  "Sogilex publishing" (Workers Scripts/KV edit, Account Settings read; sogilex.net Zone read, DNS edit, Workers
  Routes edit, and zone settings edit works too; expires 2027-11) is a network secret on the "Sogilex" environment: call api.cloudflare.com with
  `Authorization: Bearer proxy-injected`. Deploying the Worker: see `sogilex-build/docs/PUBLISHING.md`.
- **Anthropic:** `ANTHROPIC_API_KEY` Supabase secret; Claude Opus 5.5; spend limit in the Anthropic Console.
- **Resend** sends sign-in emails from `signin@mail.sogilex.com`.

## Sign-in (shared by Build, Menus, Flyers, Posts, Invoices)

- `sogilex-build/assets/sogilex-auth.js` (Atlas's copy is gone with Atlas).
- One session for all of *.sogilex.com (cookie on `.sogilex.com`, chunked). Customer sites are on sogilex.net,
  so they never see it.
- Password, or an emailed code (the email's link still works). Forgot password = sign in with a code, then set a
  new one. "Password" button in the Build/Menus/Flyers header.
- Supabase email templates (Magic link + Confirm signup) use `sogilex-build/supabase/email-sign-in.html`;
  minimum password length 8; email code length 8. Owner tested all of it: works.

## Build (websites): `sogilex-build`

- `build-site` Edge Function, **version 15** (v15 added "Use my photos"): Opus 5.5, effort **medium** (low produced junk, never use it),
  `max_tokens` 24000, stops itself at **380 s** (Supabase Pro limit 400 s; builds take ~140 s), styles incl.
  Futuristic (with anti-cliché direction), rejects output that isn't a real page (doesn't count), saves each
  finished page to `build_outputs`, sends `{t:"meta", build_id}` first. Logo: asks Claude for
  `<img src="sogilex:logo">` and builds the palette from the logo's colours.
- Limits: 3 builds/person/24 h (failed ones don't count, max 5 failures), 50 overall/24 h. Per-person overrides
  in `build_limits` (owner: 20/day, can_publish = true). Cost about $0.25-0.31 per build.
- **Your sites (2026-11-19):** "Your sites" picker above the preview; the latest finished build opens on return;
  any past version can be reopened, downloaded or published. RPCs `my_builds()` / `my_build(id)` (own rows only).
- SQL (all applied; files are safe to re-run): `supabase/003_build.sql`, `004_publishing.sql`,
  `005_menus.sql`, `006_brand_kits.sql`, `007_my_sites.sql`, `008_edits.sql`, `009_photos.sql`, `010_menu_import.sql`, `011_online_menus.sql`, `012_menu_logo.sql`, then 013-018 (flyers, message email, Atlas removal, posts, captions, invoices). Lesson: new tables in this project don't grant `service_role` by default.

## Publishing (closed beta): `sogilex-build/docs/PUBLISHING.md`

- Publish panel under Build's preview: choose `name`, publish to `name.sogilex.net`, unpublish, Messages inbox.
- Only HTML Build generated can be published (never uploads). The Worker strips scripts/frames/etc., points
  forms at `/__form`, adds a honeypot and a "Made with Sogilex · Report this site" footer, serves the logo as
  `/logo.png` and photos as `/photos/<id>.jpg` (copied to KV at publish), with a strict CSP (no scripts; images
  only from the site itself or data: URLs). Always https (308 redirect + HSTS).
- Contact-form messages are stored (`site_messages`) and shown in Build. Rate limits: 30/site/hour, 5/visitor/hour.
- Owner tested end to end: works.
- HTTPS (2026-11-19): owner's mom got "this form is not secure" on a published site opened over http. Fixed:
  Cloudflare "Always Use HTTPS" turned on for sogilex.net (API token can edit zone settings), and the Worker
  itself 308-redirects any http request to https and sends HSTS (1 year). Logos are now served as `/logo.png`.

## Menus (free beta): build.sogilex.com/menus/

- **Statement looks (2026-11-19)**, after the owner said the Poor Richard's sample "looks like a Word doc" (every
  section identical, no focal point): "Ready-made looks" row (Tavern, Sports bar, Bistro, Diner, Café, Clean
  modern) sets font + colours + layout + border at once; new Tavern palette (deep red on cream); new layout
  "Colour bands" (section headings on solid accent bands, diamond ornament under the name, text on the band picks
  white or ink for contrast); per-section "Feature this section" (tinted panel, bigger heading, never splits
  across columns or pages). Tested on the full Poor Richard's menu: fits front and back at 84-88%.
  Known: one shared type scale for both pages, so page 1 can end with spare space when page 2 is full.
- **Bold layout + photos + display fonts (2026-11-20)**, after the owner said the statement looks still read
  "like a Word doc" and sent reference menus (picked: bold modern; must-haves: colour bands/shapes, food photos,
  fun lettering). Layout "Bold": accent band with a curved bottom edge at the top (hero photo on the right if
  chosen, logo on a white tile), label-style section headings with a rule, prices as tinted tags, half-circles
  peeking in from the margins, a dark footer band with a curved top. Photos: "Food photos" group in Menus uses
  Build's private photo library (`assets/photos.js`, signed links); `menu.hero` and `section.photo` hold photo
  ids; removed photos drop off the menu. Fonts: Anton (Heavy), Alfa Slab One (Slab), Rye (Western), Lobster
  (Script), self-hosted OFL, headings only. Palettes Mustard (dark/yellow) and Ketchup. Looks: Bold grill, Night
  market, Saloon, Retro diner, Sweet shop. Poor Richard's fits front and back at 80-84% with photos.
  Online menu shows the photos too (2026-11-20, Worker deployed; see sogilex-build/docs/PUBLISHING.md), plus the
  new palettes/lettering (system-font stand-ins) and the longer text limits. Flyers have a photo too (one per flyer, from the same library; Colour block puts it edge to
  edge under the band; Save image embeds it).
- Photo reader no longer cuts text silently (it did: "Served with ... D"): higher limits, anything still too
  long goes in the "couldn't read clearly" note.

- Milestone 1 of `sogilex-build/docs/MENU-SPEC.md` done, no AI: form (sections, dishes, multiple prices with
  labels, dietary tags, footer), live preview that fits one page (type down to 80%, then two columns),
  autosave (`menus` table, one per person), print / save as PDF (Letter or A4). Prices print exactly as typed.
- **Looks:** 5 font pairings (Classic, Elegant, Modern, Bold, Warm) × 10 palettes (all WCAG AA checked) +
  "From my logo" × 3 layouts (centered, left, dotted leaders) × 3 borders. Owner: "it is great".
- **Structure (2026-11-19):** one page or front and back (flows onto page 2), add-ons per dish/section
  ("Add bacon +2", "Choice of ..."), section kinds (regular, specials box, set price for prix fixe/tasting),
  starters (Bar & grill, Fine dining, Café & bakery, Pizzeria, Taqueria) that set sections + look, never dishes.
- **Read from photos + QR (2026-11-19):** "Read it from a photo" (up to 4 photos or a PDF) fills the form via the
  `read-menu` Edge Function; every price highlighted until checked; print warns. Optional QR code on the last page.
  Live-tested: 24/24 prices exact on a tilted photo, 23 s, ~7 cents. Details in `sogilex-build/docs/MENU-SPEC.md`.
- **Online menu (2026-11-19, closed beta):** "Online menu" box in Menus → https://<name>.sogilex.net/menu, built by
  the Worker from the saved menu text; updates on every save unless photo-read prices are unchecked; "Use it for my
  QR code". SQL `011_online_menus.sql`. Owner tested: works, QR opens it.
- **Menu-only logo (2026-11-19):** one logo per account is shared by Build and Menus (right for a real business);
  Menus now says so and offers "Use a different logo for this menu" (`brand_kits.menu_logo/_name/_colors`,
  `012_menu_logo.sql`); the online menu serves it as `/menu-logo.png`. Underlying assumption still: one account =
  one business (one logo, menu, website, address). Owner's demos: use a separate sign-in per demo business.
  Multi-business accounts only if customers ask.
- **Custom domains (idea, owner asked 2026-11-19):** Cloudflare for SaaS custom hostnames (first 100 free); owner
  adds one DNS record at their registrar. Proposed as the first paid feature (own domain + no Sogilex footer),
  after the LLC + terms of service.
- Files: `menus/index.html`, `assets/menus.js`, `assets/menus.css`. Extra fonts: EB Garamond, Playfair Display,
  Bebas Neue, Fraunces.

## Build quick changes (2026-11-19)

- 8 one-click buttons above the "Change your site" chat (`renderQuick` in `assets/build.js`): Serif fonts,
  Sans-serif fonts, Darker look, Lighter look, Bigger headline, More breathing room, Simpler, Use my logo colours
  (only with a logo; sends the hex colours). Each sends a fixed request through `edit-site` (one edit, one version,
  undo works), always ending "Keep every word, every section, the layout and the images exactly as they are."
- Build is labelled **Beta** on sogilex.com (card tag and hero button) as well as on Build itself.

## Message emails (2026-11-19): contact-form messages also go to the owner's inbox

- Build > Publish panel: "Email me new messages" box (prefilled with the sign-in email). Own sign-in email works
  at once; any other address gets a confirmation email and must press Confirm on build.sogilex.com/email/
  (a button, so mail-app link scanners can't confirm). Max 3 confirmation emails per hour.
- Every message email: Reply-To = the visitor's email (found in the form fields), subject "New message from
  <name> (<slug>.sogilex.net)", a one-click Stop link (same page) and a List-Unsubscribe header.
- How: table `message_emails` (014_message_email.sql) + `site_messages.emailed_at`; an insert trigger calls the
  Edge Function **`message-email` (v1, verify_jwt off, checks callers itself)** through pg_net, only if the
  owner has a confirmed address. The function claims the message (emailed_at) so it never sends twice, and only
  sends messages under 15 minutes old. Messages always stay in Build either way.
- Secret `RESEND_API_KEY` is set (Resend key "Sogilex messages", sending access, mail.sogilex.com only).
  Sends from messages@mail.sogilex.com. Function `message-email` is at v3 (v3 logs why a confirmation failed).
- The service role needed explicit grants on `message_emails` and `site_messages` (new tables in this project
  don't grant it anything): remember this for any future Edge Function that writes a new table.
- **Owner tested it live end to end (2026-11-19):** confirmation email, Confirm page, a real contact-form message
  arrived, Reply goes to the visitor, Stop link opens the stop page.

## Posts (free beta): build.sogilex.com/posts/

- Runs on the Flyers engine (`assets/flyers.js` + `flyers.css`): `posts/index.html` has `<body data-tool="posts">`,
  which switches the table (`posts`, 016_posts.sql, max 100 per person), the sizes (Square 8in = 1080x1080 feed,
  Tall 7.5x13.333in = 1080x1920 story; no print), and the kinds: Deal or special, Event, Featured item, Announcement,
  Now hiring, Customer review. A kind can rename boxes (`labels`), hide boxes and leave them off the image (`hide`),
  rename the image's row labels (`rows`, e.g. "Hours"), and show a rule (`note`).
- Customer review: the review is the headline, shown as an italic quote with "— name" under it. Rule shown in the
  form: only real reviews, copied exactly; ask before using a full name. No stars (no made-up ratings).
- "Use a dish from my menu" (Posts and Flyers): copies a dish's name, description, price (exactly as on the menu,
  with its labels) and its section's photo. Prices read from a photo and not yet checked are left out.
- Flyers gained the display fonts (Heavy, Slab, Western, Script) and Tavern/Mustard/Ketchup colours; Save image
  embeds the new fonts.
- Tested in a browser with a stand-in account: all six kinds, both sizes, dish picker, review boxes hidden, story
  saved at 1080x1920, saves go to `posts`; Flyers re-tested (no change in behaviour).
- **AI captions (2026-11-20, owner asked: "like the chat box editor with websites"):** "Caption" group in Posts:
  tone (Friendly, Fun, Professional, Short), "Write a caption" / "Write a new one", an editable box (saved with the
  post as `caption`, `tone`), "Change it" requests ("make it shorter") applied to the current caption, "Copy
  caption". Edge Function **`write-caption` (v1, verify_jwt on)**: Claude Opus 5.5, effort low, JSON output
  `{caption}`, server-side refusal fallback. The prompt allows only the post's facts (or facts the owner types in a
  change request): no invented prices, dates, claims, awards, review words or star ratings; a list of banned AI
  clichés; at most 2 emoji; 2-4 hashtags, a place only if it's in the facts. Limits in `build_generations`
  (kind `caption`, 017_captions.sql): 40 a person a day, failures don't count (max 10), 1000 a day for everyone;
  `caption_quota()` for the "left today" count. Tested in a browser with a stand-in for the AI; **not yet tested
  against the real model** (the sandbox can't reach Supabase functions): the owner's first real caption is the test.
- **Share button (2026-11-20):** in Posts, next to Save image, shown only where the browser can share image files
  (phones; some desktops). Copies the caption, then opens the phone's share menu with the 1080 px PNG (and the caption
  as text; Instagram/Facebook ignore it, hence the copy). The image is made ahead of time ~1 s after each change,
  because a share menu only opens right after a tap. Uses the same drawing code as Save image (`makeImage()` in
  flyers.js). Tested in Chromium with a stand-in share menu, and **the owner confirmed it works on an iPhone**
  (2026-11-20), so the image drawing works in iPhone Safari (the old "Safari may refuse Save image" worry is likely
  outdated).
- Real "connect your Instagram/Facebook" advice given: needs Meta app review + Business Verification (needs the LLC),
  privacy policy and terms; Meta Business Suite already schedules for free. Build only after LLC + terms + real demand.
- Later: posting straight to Instagram/Facebook (Meta app review), several posts at once ("this week's posts"),
  and Quotes & invoices as the 5th tool.

## Quotes & invoices (free beta): build.sogilex.com/invoices/

- Files: `invoices/index.html`, `assets/invoices.js`, `assets/invoices.css` (editor reuses menus.css), SQL
  `supabase/018_invoices.sql` (applied live 2026-11-20). Page on sogilex.com: `/invoices/`; entry in `assets/services.js`.
  **No AI.** Money is whole cents, quantities are hundredths, tax rate is thousandths of a percent (8.475% = 8475);
  amounts round half away from zero. The database recomputes every total in a trigger (`inv_docs_check`), so the
  stored totals are the real ones; the page shows the same maths as you type.
- Tables: `inv_profile` (business details, one per person: name, address, phone, email, website, how to pay, usual
  terms, usual tax, colour), `inv_customers` (max 500), `inv_docs` (quotes and invoices, max 2000; `data` holds
  date, due, to, lines [{d, q, p, t}], tax, notes; `from` is frozen in when sent), `inv_counters` (no client access).
- Rules: a draft has no number; `inv_send()` gives the next one per kind (INV-0001, Q-0001) in the same transaction,
  so no gaps, and saves/updates the customer in the list. Sent documents can't be edited or deleted (trigger +
  column grants: the page can only write `data`/`customer_id`); invoices go sent → paid (undo allowed) or sent →
  void ("Cancelled", keeps its number); quotes go sent → accepted/declined (undo allowed). `inv_quote_to_invoice()`
  makes a draft invoice linked to the quote (`source_id`) and marks the quote accepted. Only drafts can be deleted.
  "Overdue" isn't stored: sent invoice past its due date (worked out in the browser, local date).
- Page: list with All/Invoices/Quotes/Unpaid and "Unpaid: $X · Overdue: $Y"; editor (customer picker, dates with
  On receipt/7/14/30 days, lines with qty/price/taxed, tax %, notes); "Make a copy"; "Bill this again next month"
  (dates move one month; the 31st becomes the last day of a short month); print or save PDF (letter, 0.5 in margins,
  long invoices flow onto more pages with the column headings repeated; the PDF's suggested name is "INV-0003 Customer").
  Drafts print with a "Draft" stamp. Logo comes from the shared brand kit.
- Tested 2026-11-20: SQL on a local Postgres 16 (totals, rounding, numbering, locking, other users see nothing) and
  live in a rolled-back transaction; browser test (23 checks) with the page talking to that local Postgres through a
  small PostgREST stand-in (harness idea worth reusing: real SQL rules instead of mocks). Not yet used by a real person.
- Later (only when asked): email the invoice from Sogilex (Resend), Stripe "Pay now" link, reminders, a customers
  page, CSV export for the accountant, several businesses per account.

## Flyers (free beta): build.sogilex.com/flyers/

- `flyers/index.html`, `assets/flyers.js`, `assets/flyers.css` (reuses menus.css for the editor). No AI: every
  word is what was typed; blanks are left off. Several flyers per person (max 40, trigger), table `flyers`
  (`supabase/013_flyers.sql`), autosave, New / Duplicate / Delete.
- Fields: headline, small line above, line under, big price/deal, when, where, up to 5 details, call to action,
  fine print, business name/phone/website/address, shared logo (brand kit), QR code. First flyer pre-fills
  business details from the saved menu.
- Kinds (starters set a look + example text in empty boxes, never words): Event, Special or deal, Live music,
  Grand opening, Class or sign-up, Notice or hours. Looks: 3 layouts (Poster, Colour block, Left-aligned) x
  the 5 Menus font pairings x the 10 Menus palettes (+ logo colour). Text on the accent picks the more
  readable of white/ink.
- Fit: headline size from its length, then everything shrinks in steps (to 58%) until it fits the page and no
  word sticks out; a single overlong word may break as a last resort.
- Sizes: US Letter, A4 (print dialog / Save as PDF), Square 8in (social). "Save image" draws the flyer through
  SVG foreignObject with fonts embedded: 1080x1080 for Square, 150 dpi for print sizes. Works in Chrome/Edge;
  Safari may refuse (shows a message pointing to PDF). Owner should test on their phone.

## Logos (brand kit), Build + Menus + Flyers

- "Add your logo here" box (`assets/brand.js`): drag or click; PNG/JPG/WebP/SVG redrawn in the browser as a
  small PNG (SVG scripts can't survive); PDFs get a plain "save it as a PNG" message; main colours extracted.
- Stored in `brand_kits` (one per person), at most 480×200 (~100 KB); older bigger logos shrink on load.
  Used on menus, in generated sites and in published sites. Menus can have its own logo (`menu_logo`).
- After the logo change, **Evergreen needs one republish** (Publish this version) for its page to drop from
  ~720 KB to ~30 KB; not confirmed done.

## sogilex.com: `sogilex-site`

- Pages: `/` (hero, tools, four rules, "How Build works" 3 steps + link to examples, "Done for you" prices + free sample form), `/examples/`
  (Evergreen Lawn & Landscape demo, live at https://evergreenlawn.sogilex.net/, labelled "Demo site"; screenshots
  in `examples/`, rendered from the published copy in Cloudflare KV), `/menus/` (Beta), `/flyers/` (Beta,
  links to build.sogilex.com/flyers/). Nav: Tools, Examples, How we design, Open Build.
- **/examples/ (2026-11-20): one demo per tool.** Evergreen website (as before), Maple Street Diner menu (Retro diner
  look), flyer ("Kids Eat Free", Poster layout) and square post ("Blueberry Pancake Stack", Poster layout), and
  Evergreen invoice INV-0042. All made-up businesses, 555 phone numbers, labelled "Demo"; no photos (no stock).
  Images are `examples/diner-*.jpg` and `evergreen-invoice.jpg`, made by rendering the real tools with fixture data
  in a headless browser (copy the page out of the preview box before the screenshot, or it gets clipped).
  Fixed 2026-11-20: "Colour block" without a photo used to leave an empty middle; now the colour band fills the free
  space with the message at its bottom edge and the facts right under it (flyers.css, `.layout-block:not(.has-photo)`).
- Still to add: 2-3 more demo websites in other trades (owner's mom's photography site, if she agrees).
- Waitlist: `waitlist` table (insert-only; read it in Supabase Table Editor), `assets/waitlist.js`, `supabase/waitlist.sql`.

## Waiting on the owner

- (Parked by the owner: printing the offer sheet and the first restaurant visit.)
- **Turn on leaked-password protection** in Supabase (Authentication → password security); can't be done from a
  session. Not confirmed done.
- **Enforce HTTPS** in GitHub Pages settings for all three repos (Settings → Pages); not confirmed done.

- **Form the Missouri LLC** (planned; about $50 online). Then tell the next session the business name.
- **Privacy policy and terms are live (2026-11-20)** at sogilex.com/privacy/ and /terms/, linked from every site and
  tool footer and the sign-in box ("By signing in you agree to..."). They name **Keagan Edler (founder) and Blake
  Pille**, based in St. Louis, and say Sogilex "is not yet a registered company" (owner: nothing that needs an LLC).
  Key promises made in them: delete an account within 30 days of an email request; email before important changes;
  tell users if their data is exposed; no ads/tracking/selling; no training AI on user content; 18+; Missouri law,
  St. Louis County courts; liability capped at $50 for the free tools; copyright complaints by email (no DMCA agent
  claimed). **When the LLC exists:** swap the names for the company, consider registering a DMCA agent, and have a
  lawyer read both before taking payments. Advisor note given: two people running a business without an entity are
  usually a general partnership (each personally liable); a short written agreement between them is worth having.
- **DMCA designated agent** registration with the US Copyright Office (about $6), around the same time.
- (Atlas privacy page placeholders: moot, Atlas is closed.)

## Usage (checked 2026-11-19)

No real users yet: the 5 other accounts are the owner's friend and mom testing. Waitlist 0. Advice given: get
3 local restaurants to react to a printed Sogilex menu before building more tools; their answers pick the next build.

## Website editing plan (owner's priority, 2026-11-19)

Owner's mom (photographer) built a site and couldn't change it afterwards. Plan, one piece at a time, each tested live:
1. **Done:** reopen your sites (above).
2. **Done (2026-11-19): chat edits** ("Change your site" under the preview). `edit-site` Edge Function (v2,
   verify_jwt off, does its own auth): Opus 5.5, effort medium, structured JSON output {reply, edits[find/replace],
   rewrite}, server-side refusal fallbacks; one retry if a find doesn't match; refuses versions that add scripts.
   Each change = new version (build_generations kind='edit', parent_id, note) + page in build_outputs; Undo opens
   the parent. Questions/refusals make no version. Limits: 30 edits/person/day (failed don't count, max 10
   failures), 500/day overall; builds count separately. SQL `008_edits.sql`. Measured on a real 33 KB site:
   small edits 6-8 s, adding a section 25 s, ~17k input tokens, about $0.08-0.13 per edit.
   A full restyle ("rewrite") took 147 s and ~20k output tokens: about $0.47. Works only because edit-site pings
   every 5 s (Supabase cuts a response after 150 s with no bytes). If restyles get common, consider limiting them.
   `edit-selftest` is a retired stub (returns 410); it can be deleted in the Supabase dashboard (Edge Functions).
3. **Done (2026-11-19): your own photos.** "Your photos" box in Build (`assets/photos.js`): redrawn in the browser
   as JPEG (max 2000 px, strips GPS/EXIF) + 400 px preview, private bucket `site-photos/<uid>/<id>.jpg` (+ `-t.jpg`),
   list in `site_photos` (max 60/person, `009_photos.sql`). Pages use `sogilex:photo:<id>`; Build preview swaps in
   1-hour signed links, Download/Copy put the photos inside the file. build-site (v15, "Use my photos" tick box)
   and edit-site (v3) send Claude the list + previews of the newest 12; edit-site refuses unknown photo tags.
   Worker copies used photos to KV on publish, serves `/photos/<id>.jpg`, CSP `img-src data: 'self'`.
   Each photo shows "+ Add to site" (or "On this site") for the open site, plus "Add the N photos that aren't on
   this site"; after an upload with a site open, the chat offers "Add them to my site". Both send a chat edit naming
   the exact photo tags (owner, 2026-11-19: "there needs to be a way to add new photos to a site already built").
   Owner tested: build with 3 photos + 2 edits worked live (25 s, 11 s).
   **Before publishing opens to everyone: terms of service + DMCA agent are required (user-uploaded images).**

## Next steps (owner picks)

0. **Done-for-you support, as clients arrive:** several businesses in one account; client email notifications for
   contact-form messages (Resend key); own domains; a monthly edit allowance. Second example site for
   `/examples/` (owner's mom's photography site, if she agrees).
1. **Flyers next**: owner tests the beta on real flyers. Then maybe: a photo on the flyer, a 9:16 story size,
   two-up half-letter printing, Claude-designed looks (like Menus milestone 2).
2. **Menus milestone 2**: Claude designs a style per restaurant (code still places every price). See MENU-SPEC.md.
3. **Open publishing to everyone** once the terms of service exist (set `can_publish` for all, or remove the check).
4. Smaller: **enforce HTTPS in GitHub Pages settings for all three repos (owner must do it: the session can't reach
   that GitHub API)**; add `v=spf1 -all` and `_dmarc p=reject` TXT
   records for sogilex.net in Cloudflare (the Worker already redirects sogilex.net to sogilex.com); delete old
   `build_outputs` after 30 days (but never the published one or a person's latest: "Your sites" relies on them); a privacy policy page for Build/Menus (Build's "Privacy & limits" section is current).

## How things were tested (reuse)

- Browser tests: Playwright with `--host-resolver-rules=MAP build.sogilex.com 127.0.0.1` and a local
  `python3 -m http.server`, Supabase calls mocked with `context.route`, a fake session in localStorage.
- Worker tests: `miniflare@3` locally with a mocked Supabase (`outboundService`).
- This cloud sandbox can't open sogilex.com/sogilex.net directly (proxy); the owner checks live pages.
