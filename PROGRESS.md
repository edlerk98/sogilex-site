# Sogilex: where things stand

Last updated 2026-11-18. This repo is public, so no keys or private details belong here.

## Live

| Site | Address | Repo |
|---|---|---|
| Sogilex (company) | https://sogilex.com | `edlerk98/sogilex-site` |
| Savepoint Atlas | https://atlas.sogilex.com | `edlerk98/savepoint-atlas` |
| Sogilex Build (beta) | https://build.sogilex.com | `edlerk98/sogilex-build` |

- All three are static sites on GitHub Pages. DNS is at Porkbun.
- One Supabase project serves both products: magic-link sign-in (one Sogilex account), the Atlas checklist, contributions and friends, and the Build limits plus its `build-site` Edge Function.
- Sign-in emails send from `signin@mail.sogilex.com` via Resend. `hello@sogilex.com` forwards (Porkbun) to the business inbox.
- Sogilex Build calls Claude Opus 5.5 with a workspace-scoped Anthropic key stored as the `ANTHROPIC_API_KEY` Supabase secret. Limits: 3 builds per person and 50 overall per 24 hours. Rough cost: $0.20-0.30 per site. There is a monthly spend limit in the Anthropic Console.

## Finishing touches

- [ ] Enforce HTTPS in Pages settings for all three repos.
- [x] Database updated (2026-11-18): `finished_at`, `stop_reason`; failed builds don't count toward the 3 a day (max 5 failures); only the Edge Function can mark builds finished.
- [x] `build-site` redeployed as version 7 (API-key format check, `max_tokens` 24k, records stop reason).
- [x] Test build 2026-11-18: recorded correctly. **Took 146 s** for 15,566 output tokens ($0.31), right at Supabase's free-plan 150 s limit.
- [x] `build-site` version 8 stops a build at 140 s with a clear message (`stop_reason` "timeout"; doesn't count toward the 3 a day).
- [x] Supabase Pro ($25/month) since 2026-11-18; `DEADLINE_MS` raised to 380 s (build-site v13). Effort stays "medium": "low" produced junk output.
- [ ] Clear test builds: `delete from public.build_generations where status <> 'done';`
- [ ] After 5-10 new builds, run the query at the bottom of `003_build.sql` to see seconds and cost per build. If any are near 150 s (Supabase's free-plan limit), lower effort or `max_tokens`.
- [ ] Privacy policy for Sogilex Build.
- [ ] Savepoint Atlas privacy page: fill in `[OPERATOR NAME]`, `[COUNTRY]`, `[EFFECTIVE DATE]`, `[SUPABASE REGION]`, then get it reviewed and remove "Draft".
- [ ] sogilex.net: forward to sogilex.com, and add `v=spf1 -all` and `_dmarc` `v=DMARC1; p=reject;` records.
- [ ] Optional: branded sign-in email template (`savepoint-atlas/supabase/email-sign-in.html`; it currently says Savepoint Atlas, and could be made generic for Sogilex).

## Bigger next steps

- Savepoint Atlas: real verified Grand Theft Auto VI entries (contribute, then review).
- Savepoint Atlas: build the Pack Plus features before selling it. Price $9.99 once; Stripe Payment Link still a placeholder.
- Sogilex Build: tune quality and speed from real builds, and decide whether to keep Opus 5.5 or move to a cheaper model. First 3 builds (2026-11-18): 9.3k-15.5k output tokens, about $0.19-0.31 each, all finished; owner rated the result good.
- Sogilex Build: more futuristic look for the Build site itself (owner's request, not yet specified).
- Direction (2026-11-18): Sogilex = design tools for local businesses that don't look AI-made. Order: brand mockup, then menus, then flyers, then invoices (no AI), then reports. Resume maker parked (wrong customer). Excel later.
- Brand mockup (dark plum, sunset gradient, Unbounded/Inter/JetBrains Mono): https://claude.ai/artifact/P1FwkbQkqcBivZrtxJktzU. New look covers sogilex.com and Build, not Atlas.
- Menu creator spec: `sogilex-build/docs/MENU-SPEC.md`.
- Homepage scene approved by owner (2026-11-18): sunset over a particle sea, page-wide cursor effects. Live on sogilex.com since 2026-11-18 (`assets/scene.js`); owner checked it on a phone.
- Sign-in (2026-11-18): password or emailed code on Atlas and Build, one session across *.sogilex.com (`assets/sogilex-auth.js`, keep identical in both repos). Owner to do in Supabase: paste `savepoint-atlas/supabase/email-sign-in.html` into BOTH Magic link and Confirm signup templates; set minimum password length to 8. Later: Sign in with Google (needs Google Cloud setup; if an iOS app ever offers it, Apple requires Sign in with Apple too).
- build.sogilex.com restyled to the new look, with a Futuristic style (function v9), 2026-11-18. Sign-in tested end to end by owner.
- sogilex.com/menus and /flyers pages live (2026-11-18) with a real waitlist (Supabase `waitlist` table; read it in Table Editor).
- Publishing tested end to end by owner 2026-11-18 (build, publish, live site, contact form, Messages).
- Publishing (closed beta) built 2026-11-18: publish from Build to name.sogilex.net, contact forms, messages inbox. See `sogilex-build/docs/PUBLISHING.md`. Only accounts with `build_limits.can_publish` (the owner) can publish.
- Owner's build limit raised to 20/day (`build_limits` table).
- Before opening publishing to everyone: terms of service (operator: owner, Missouri, sole proprietor until the planned LLC), DMCA designated agent registration, email notifications for messages (needs a Resend API key).
- Next (owner's order): finish publishing, then menus milestone 1.
  - Customer sites on **sogilex.net** subdomains (never sogilex.com: shared origin, phishing risk). sogilex.net DNS moves to Cloudflare; sogilex.com stays at Porkbun (email forwarding depends on it).
  - Cloudflare: account created, sogilex.net active on Cloudflare (2026-11-18). API token "Sogilex publishing" (Workers Scripts, KV, Account Settings read; sogilex.net Zone read, DNS, Workers Routes; expires in 1 year) is saved as a network secret on the "Sogilex" cloud environment, not in any repo.
  - Was: Owner needs a Cloudflare account. Still to answer: business name and state/country (for terms of service), and whether Lawn Gang 101 (homepage example) is a real business.
- The next Sogilex product: own subdomain, own card on sogilex.com.
