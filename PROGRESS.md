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
- [ ] Do one test build and check its row has `finished_at` and `stop_reason` filled in. If both are empty, check the function logs for "finish_build failed".
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
- Sogilex Build ideas from the owner, not yet scoped: PDF/Excel document creator, resume maker.
- The next Sogilex product: own subdomain, own card on sogilex.com.
