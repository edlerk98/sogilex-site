# Sogilex: where things stand

Last updated 2026-11-19. **A new session should read this file first.**
This repo is public: no keys, user IDs or private details here.

## How to start the next session

- Start a cloud session on the **"Sogilex"** environment (a session started on Default can move to it with one approval) (it holds the Cloudflare key) with all three repos:
  `edlerk98/sogilex-site`, `edlerk98/sogilex-build`, `edlerk98/savepoint-atlas`.
- Tell it: *"Read PROGRESS.md in sogilex-site, then continue."*
- Working style the owner asked for: be an advisor, not a yes-man; **simple, one-step-at-a-time walkthroughs**
  for anything the owner does by hand (they get overwhelmed by long lists); test before shipping.

## What Sogilex is

Design tools for local businesses that **don't look AI-made**. Four design rules on every tool: one message,
two typefaces at most, no AI look (rule 03, reworded 2026-11-19 at the owner's request: no glossy stock art,
grime filters or uncanny faces; Sogilex itself is AI-made, so "nothing generated" overclaimed), only the owner's
facts (missing ones become [PLACEHOLDERS], never invented). Honesty line kept: demo sites are labelled demos. Order of tools: websites (live), menus (live beta),
flyers (next), invoices (no AI), reports. Resume maker parked (wrong customer). Excel later.

## Live

| What | Address | Repo |
|---|---|---|
| Company site | https://sogilex.com (+ /menus, /flyers pages) | `sogilex-site` |
| Build: AI websites | https://build.sogilex.com | `sogilex-build` |
| Menus (free beta) | https://build.sogilex.com/menus/ | `sogilex-build` |
| Published customer sites | https://NAME.sogilex.net (closed beta: owner only) | `sogilex-build/worker` |
| Savepoint Atlas | https://atlas.sogilex.com | `savepoint-atlas` |

## Brand (sogilex.com and Build, not Atlas)

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
- **Supabase** (one project, **Pro plan, $25/month**): auth, all tables, the `build-site` Edge Function.
  The session's Supabase connector can run SQL, apply migrations and deploy functions.
- **Cloudflare** (free plan): Worker `sogilex-sites` on routes `*.sogilex.net/*` and `sogilex.net/*`, KV namespace
  `sogilex-sites`, DNS `AAAA sogilex.net` and `AAAA *.sogilex.net` to `100::` (proxied). API token
  "Sogilex publishing" (Workers Scripts/KV edit, Account Settings read; sogilex.net Zone read, DNS edit, Workers
  Routes edit; expires 2027-11) is a network secret on the "Sogilex" environment: call api.cloudflare.com with
  `Authorization: Bearer proxy-injected`. Deploying the Worker: see `sogilex-build/docs/PUBLISHING.md`.
- **Anthropic:** `ANTHROPIC_API_KEY` Supabase secret; Claude Opus 5.5; spend limit in the Anthropic Console.
- **Resend** sends sign-in emails from `signin@mail.sogilex.com`.

## Sign-in (shared by Atlas, Build, Menus)

- `assets/sogilex-auth.js`, **keep identical** in savepoint-atlas and sogilex-build.
- One session for all of *.sogilex.com (cookie on `.sogilex.com`, chunked). Customer sites are on sogilex.net,
  so they never see it.
- Password, or an emailed code (the email's link still works). Forgot password = sign in with a code, then set a
  new one. "Password" button in Build/Menus header; password form on Atlas's Account page.
- Supabase email templates (Magic link + Confirm signup) use `savepoint-atlas/supabase/email-sign-in.html`;
  minimum password length 8; email code length 8. Owner tested all of it: works.

## Build (websites): `sogilex-build`

- `build-site` Edge Function, **version 14**: Opus 5.5, effort **medium** (low produced junk, never use it),
  `max_tokens` 24000, stops itself at **380 s** (Supabase Pro limit 400 s; builds take ~140 s), styles incl.
  Futuristic (with anti-cliché direction), rejects output that isn't a real page (doesn't count), saves each
  finished page to `build_outputs`, sends `{t:"meta", build_id}` first. Logo: asks Claude for
  `<img src="sogilex:logo">` and builds the palette from the logo's colours.
- Limits: 3 builds/person/24 h (failed ones don't count, max 5 failures), 50 overall/24 h. Per-person overrides
  in `build_limits` (owner: 20/day, can_publish = true). Cost about $0.25-0.31 per build.
- **Your sites (2026-11-19):** "Your sites" picker above the preview; the latest finished build opens on return;
  any past version can be reopened, downloaded or published. RPCs `my_builds()` / `my_build(id)` (own rows only).
- SQL (all applied; files are safe to re-run): `supabase/003_build.sql`, `004_publishing.sql`,
  `005_menus.sql`, `006_brand_kits.sql`, `007_my_sites.sql`, `008_edits.sql`, `009_photos.sql`, `010_menu_import.sql`. Lesson: new tables in this project don't grant `service_role` by default.

## Publishing (closed beta): `sogilex-build/docs/PUBLISHING.md`

- Publish panel under Build's preview: choose `name`, publish to `name.sogilex.net`, unpublish, Messages inbox.
- Only HTML Build generated can be published (never uploads). The Worker strips scripts/frames/etc., points
  forms at `/__form`, adds a honeypot and a "Made with Sogilex · Report this site" footer, inlines the logo,
  and serves with a strict CSP (no scripts, images only as data: URLs).
- Contact-form messages are stored (`site_messages`) and shown in Build. Rate limits: 30/site/hour, 5/visitor/hour.
- Owner tested end to end: works.
- HTTPS (2026-11-19): owner's mom got "this form is not secure" on a published site opened over http. Fixed:
  Cloudflare "Always Use HTTPS" turned on for sogilex.net (API token can edit zone settings), and the Worker
  itself 308-redirects any http request to https and sends HSTS (1 year). Logos are now served as `/logo.png`.

## Menus (free beta): build.sogilex.com/menus/

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
  Next for restaurants: an online menu at `name.sogilex.net/menu` (natural QR target, price changes update both).
- Files: `menus/index.html`, `assets/menus.js`, `assets/menus.css`. Extra fonts: EB Garamond, Playfair Display,
  Bebas Neue, Fraunces.

## Logos (brand kit), Build + Menus

- "Add your logo here" box (`assets/brand.js`): drag or click; PNG/JPG/WebP/SVG redrawn in the browser as a
  small PNG (SVG scripts can't survive); PDFs get a plain "save it as a PNG" message; main colours extracted.
- Stored in `brand_kits` (one per person). Used on menus, in generated sites and in published sites.

## sogilex.com: `sogilex-site`

- Pages: `/` (hero, tools, four rules, "How Build works" 3 steps + link to examples, Atlas strip), `/examples/`
  (Evergreen Lawn & Landscape demo, live at https://evergreenlawn.sogilex.net/, labelled "Demo site"; screenshots
  in `examples/`, rendered from the published copy in Cloudflare KV), `/menus/` (Beta), `/flyers/` (planned,
  waitlist). Nav: Tools, Examples, How we design, Open Build.
- Examples to add: 2-3 demos in other trades (owner's mom's photography site is the obvious next one).
- Waitlist: `waitlist` table (insert-only; read it in Supabase Table Editor), `assets/waitlist.js`, `supabase/waitlist.sql`.

## Waiting on the owner

- **Form the Missouri LLC** (planned; about $50 online). Then tell the next session the business name.
- **Terms of service** need the operator name (LLC or the owner's own name) before publishing opens to everyone.
- **DMCA designated agent** registration with the US Copyright Office (about $6), around the same time.
- Resend API key, later, for emailing site owners when a message arrives.
- Atlas privacy page placeholders: `[OPERATOR NAME]`, `[COUNTRY]`, `[EFFECTIVE DATE]`, `[SUPABASE REGION]`.

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

1. **Flyers**: next new tool; reuse the brand kit and the "curated looks" approach from Menus.
2. **Menus milestone 2**: Claude designs a style per restaurant (code still places every price). See MENU-SPEC.md.
3. **Open publishing to everyone** once the terms of service exist (set `can_publish` for all, or remove the check).
4. Smaller: **enforce HTTPS in GitHub Pages settings for all three repos (owner must do it: the session can't reach
   that GitHub API)**; add `v=spf1 -all` and `_dmarc p=reject` TXT
   records for sogilex.net in Cloudflare (the Worker already redirects sogilex.net to sogilex.com); delete old
   `build_outputs` after 30 days (but never the published one or a person's latest: "Your sites" relies on them); a privacy policy page for Build/Menus (Build's "Privacy & limits" section is current).
5. Atlas: real GTA VI entries; Pack Plus features before selling ($9.99, Stripe link still a placeholder);
   a phone app later should start with Atlas (installable web app first).

## How things were tested (reuse)

- Browser tests: Playwright with `--host-resolver-rules=MAP build.sogilex.com 127.0.0.1` and a local
  `python3 -m http.server`, Supabase calls mocked with `context.route`, a fake session in localStorage.
- Worker tests: `miniflare@3` locally with a mocked Supabase (`outboundService`).
- This cloud sandbox can't open sogilex.com/sogilex.net directly (proxy); the owner checks live pages.
